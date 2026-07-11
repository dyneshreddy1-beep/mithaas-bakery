import sys
import os

# Add the root and backend folders to the python system path to resolve imports cleanly
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))
sys.path.insert(0, BASE_DIR)

from backend.main import app
