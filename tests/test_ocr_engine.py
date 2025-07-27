from vision.ocr_engine import run_ocr
from PIL import Image
import pytest


def test_ocr_with_blank_image():
    img = Image.new('RGB', (100, 100), color='white')
    result = run_ocr(img)
    assert isinstance(result, str)
