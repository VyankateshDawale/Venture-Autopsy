"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """All environment variables for the Venture Autopsy backend."""

    # ── Supabase ──
    SUPABASE_URL: str = "https://placeholder.supabase.co"
    SUPABASE_SERVICE_ROLE_KEY: str = "placeholder"


    # ── Gemini ──
    GEMINI_API_KEY: str = ""

    # ── GitHub ──
    GITHUB_TOKEN: str = ""

    # ── Server ──
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    CORS_ORIGINS: list[str] = ["*"]

    APP_MODE: str = "mock"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}

    from pydantic import model_validator
    @model_validator(mode="after")
    def validate_mode(self):
        # Check if all required live keys are present and valid
        required = [self.SUPABASE_URL, self.SUPABASE_SERVICE_ROLE_KEY, self.GEMINI_API_KEY]
        is_mock = any(not val or val == "placeholder" or val == "mock" for val in required)
        
        self.APP_MODE = "mock" if is_mock else "live"
        return self

settings = Settings()
