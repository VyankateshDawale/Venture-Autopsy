import os
import json
import logging
import asyncio
from google import genai
from google.genai import types

_gemini_semaphore = asyncio.Semaphore(1)

logger = logging.getLogger(__name__)

from app.config import settings

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key or settings.APP_MODE == "mock":
            logger.warning("Mock mode or missing API key. Mocking LLM responses.")
            self.client = None
        else:
            self.client = genai.Client(api_key=self.api_key)

    async def complete(self, model: str, messages: list[dict], temperature: float = 0.7) -> str:
        if not self.client:
            return "MOCK_RESPONSE"
        
        # Convert openai style messages to gemini contents
        contents = []
        system_instruction = None
        for m in messages:
            if m["role"] == "system":
                system_instruction = m["content"]
            else:
                role = "user" if m["role"] == "user" else "model"
                contents.append(types.Content(role=role, parts=[types.Part.from_text(text=m["content"])]))
        
        config = types.GenerateContentConfig(
            temperature=temperature,
            system_instruction=system_instruction
        )
        
        import asyncio
        import re
        max_retries = 8
        base_delay = 5.0
        
        async with _gemini_semaphore:
            for attempt in range(max_retries):
                try:
                    response = await asyncio.to_thread(
                        self.client.models.generate_content,
                        model=model,
                        contents=contents,
                        config=config
                    )
                    return response.text
                except Exception as e:
                    error_str = str(e).lower()
                    is_retryable = '503' in error_str or '429' in error_str or 'unavailable' in error_str or 'quota' in error_str
                    
                    if is_retryable and attempt < max_retries - 1:
                        delay = base_delay * (1.5 ** attempt)
                        
                        match = re.search(r'retry in (\d+\.?\d*)s', error_str)
                        if match:
                            delay = max(delay, float(match.group(1)) + 1.0)
                            
                        logger.warning(f"Gemini API rate limited/unavailable (attempt {attempt+1}/{max_retries}). Retrying in {delay:.1f}s...")
                        await asyncio.sleep(delay)
                    else:
                        logger.error(f"Gemini API error after {attempt+1} attempts: {e}")
                        raise

    async def complete_json(self, model: str, messages: list[dict], temperature: float = 0.3) -> dict:
        if not self.client:
            return {"mock": "data"}

        # Attempt to prompt the model to return JSON
        messages_with_json = messages.copy()
        messages_with_json.append({"role": "user", "content": "Return the result STRICTLY as valid JSON. Do not include markdown code blocks like ```json."})
        
        response_text = await self.complete(model, messages_with_json, temperature)
        
        # Clean up markdown if present
        text = response_text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from Gemini: {e}\nResponse: {text}")
            return {"error": "Invalid JSON returned"}
