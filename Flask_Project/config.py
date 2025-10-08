
class Config:
    # Hardcoded configuration variables
    SECRET_KEY = "thisisahighsecret"
    DEBUG_MODE = True  # Corresponds to FLASK_DEBUG=1

    # Database connection details
    db_user = "dhir4j"
    db_password = "m4dc0d3r"
    db_host = "simple4j-4739.postgres.pythonanywhere-services.com"
    db_port = "14739"
    db_name = "shedload"

    # SQLAlchemy Configuration
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{db_user}:{db_password}"
        f"@{db_host}:{db_port}/{db_name}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS Configuration
    CORS_ORIGINS = "*"


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    # Set to True based on user request (FLASK_DEBUG=1) for debugging in production
    DEBUG = True


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
