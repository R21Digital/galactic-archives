import sys
from types import SimpleNamespace
from PIL import Image
import pytest


def test_ocr_with_blank_image(monkeypatch):
    # Provide a dummy pytesseract module so tests run without the real dependency
    dummy = SimpleNamespace(image_to_string=lambda image, lang='eng': '')
    monkeypatch.setitem(sys.modules, 'pytesseract', dummy)

    from importlib import reload
    import vision.ocr_engine as ocr_engine
    reload(ocr_engine)

    img = Image.new('RGB', (100, 100), color='white')
    result = ocr_engine.run_ocr(img)
    assert isinstance(result, str)
