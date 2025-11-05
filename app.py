from flask import Flask
from controllers.api_controller import api
import logging
from utils.logger import setup_logger
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # ← This allows frontend on a different port to access backend

app.register_blueprint(api)
# Setup logging
setup_logger()

if __name__ == "__main__":
    app.run(debug=True)
