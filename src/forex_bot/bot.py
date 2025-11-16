import json
import time

class Bot:

    ERROR_LOG = "error"
    MAIN_LOG = "main"
    GRANULARITY = "M1"
    SLEEP = 10

    def __init__(self):
        pass

    def log_messages(self, msg, key):
        self.logs[key].logger.debug(msg)
    
        