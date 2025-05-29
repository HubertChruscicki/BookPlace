import os
import sys
from pathlib import Path

# Dodanie katalogu projektu do sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Konfiguracja Django przed uruchomieniem testów
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django
django.setup()

# Dodajemy pytest_configure dla pewności
def pytest_configure():
    from django.conf import settings
    if not settings.configured:
        import django
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
        django.setup()