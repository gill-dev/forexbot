import logging
import os

LOG_FORMAT = "%(asctime)s %(message)s"
DEFAULT_LEVEL=logging.DEBUG

class LOG_WRAPPER:
    PATH='./logs'
    
    def __init__(self, name, mode="w"):
        self.create_directory
        self.filename = f"{LOG_WRAPPER.PATH}.log"
        self.logger = logging.getLogger(name)
        self.logger.setLevel(DEFAULT_LEVEL)

        file_handler = logging.FileHandler(self.filename, mode=mode)
        formatter =logging.Formatter(LOG_FORMAT, datefmt='%Y-%m-%d %H-%m')

        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

        self.logger.info(f"LogWrapper init() {self.filename}")

        def create_directory(self):
            if not os.path.exists(LOG_WRAPPER.PATH):
                os.makedirs(LOG_WRAPPER.PATH)