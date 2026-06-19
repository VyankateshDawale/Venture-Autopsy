"""GitHub repository analyzer using the REST API."""

import httpx
import base64
from app.config import settings

class GitHubAnalyzer:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.headers = {"Accept": "application/vnd.github.v3+json"}
        if settings.GITHUB_TOKEN:
            self.headers["Authorization"] = f"token {settings.GITHUB_TOKEN}"

    async def analyze_repo(self, owner: str, repo: str) -> dict:
        async with httpx.AsyncClient(headers=self.headers) as client:
            # Metadata
            meta_res = await client.get(f"{self.base_url}/repos/{owner}/{repo}")
            metadata = meta_res.json() if meta_res.status_code == 200 else {}
            
            # Languages
            lang_res = await client.get(f"{self.base_url}/repos/{owner}/{repo}/languages")
            languages = lang_res.json() if lang_res.status_code == 200 else {}
            
            # Readme
            readme_res = await client.get(f"{self.base_url}/repos/{owner}/{repo}/readme")
            readme = ""
            if readme_res.status_code == 200:
                readme_data = readme_res.json()
                if "content" in readme_data:
                    readme = base64.b64decode(readme_data["content"]).decode('utf-8', errors='ignore')

            # Root contents (for structure)
            contents_res = await client.get(f"{self.base_url}/repos/{owner}/{repo}/contents")
            structure = []
            if contents_res.status_code == 200:
                structure = [item["name"] for item in contents_res.json() if isinstance(item, dict)]
                
            return {
                "metadata": metadata,
                "languages": languages,
                "readme_snippet": readme[:2000] if readme else "",  # First 2000 chars to save tokens
                "root_structure": structure
            }

github_analyzer = GitHubAnalyzer()
