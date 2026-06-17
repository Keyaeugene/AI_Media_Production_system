from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    ANTHROPIC_API_KEY: str
    MIDJOURNEY_API_KEY: str
    MIDJOURNEY_API_URL: str
    HIGGSFIELD_API_KEY: str
    HIGGSFIELD_API_URL: str
    RUNWAY_API_KEY: str = ""
    RUNWAY_API_URL: str = ""
    ELEVENLABS_API_KEY: str
    ELEVENLABS_VOICE_ID: str
    STORAGE_PROVIDER: str = "s3"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_BUCKET_NAME: str = ""
    AWS_REGION: str = "us-east-1"
    SECRET_KEY: str
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    # Env must stay a plain string: pydantic-settings JSON-decodes List[str] before validators run.
    cors_origins_raw: str = Field(
        default="http://localhost:3000",
        validation_alias="CORS_ORIGINS",
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @computed_field
    @property
    def CORS_ORIGINS(self) -> list[str]:
        return [o.strip() for o in self.cors_origins_raw.split(",") if o.strip()]


settings = Settings()
