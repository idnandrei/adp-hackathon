from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_PATH)


class Settings(BaseSettings):
    app_name: str = "DocumentHelper"
    debug: bool = False

    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "documenthelper"
    db_user: str = "pguser"
    db_password: str = ""

    @property
    def db_url(self) -> str:
        return (
            f"postgresql+psycopg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


settings = Settings()
