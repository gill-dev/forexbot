import os
from pathlib import Path
from typing import Optional


class Settings:
    """Application configuration loaded from environment variables"""

    def __init__(self):
        # Load from .env file if it exists
        self._load_env_file()

        # OANDA API configuration
        self.OANDA_API_KEY: str = os.getenv('OANDA_API_KEY', '')
        self.OANDA_ACCOUNT_ID: str = os.getenv('OANDA_ACCOUNT_ID', '')
        self.OANDA_URL: str = os.getenv(
            'OANDA_URL',
            'https://api-fxpractice.oanda.com/v3'
        )

        # Data storage configuration
        self.DATA_PATH: str = os.getenv('DATA_PATH', './data')

        # Validate required settings
        self._validate()

    def _load_env_file(self) -> None:
        """Load environment variables from .env file"""
        env_file = Path('.env')

        if not env_file.exists():
            return

        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()

                # Skip comments and empty lines
                if not line or line.startswith('#'):
                    continue

                # Parse KEY=VALUE
                if '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip()

                    # Remove quotes if present
                    if value.startswith('"') and value.endswith('"'):
                        value = value[1:-1]
                    elif value.startswith("'") and value.endswith("'"):
                        value = value[1:-1]

                    # Only set if not already in environment
                    if key not in os.environ:
                        os.environ[key] = value

    def _validate(self) -> None:
        """Validate that required settings are present"""
        if not self.OANDA_API_KEY:
            raise ValueError(
                "OANDA_API_KEY not found in environment variables. "
                "Please create a .env file with your API key."
            )

        if not self.OANDA_ACCOUNT_ID:
            raise ValueError(
                "OANDA_ACCOUNT_ID not found in environment variables. "
                "Please create a .env file with your account ID."
            )

    def __repr__(self) -> str:
        """String representation (hide sensitive data)"""
        return (
            f"Settings(\n"
            f"  OANDA_API_KEY={'*' * 20}...\n"
            f"  OANDA_ACCOUNT_ID={self.OANDA_ACCOUNT_ID}\n"
            f"  OANDA_URL={self.OANDA_URL}\n"
            f"  DATA_PATH={self.DATA_PATH}\n"
            f")"
        )


# Singleton instance
_settings: Optional[Settings] = None


def get_settings() -> Settings:
    """Get or create Settings singleton"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
