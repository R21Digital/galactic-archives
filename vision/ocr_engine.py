import pytesseract
from PIL import Image


def run_ocr(image: Image.Image, lang='eng'):
    return pytesseract.image_to_string(image, lang=lang)
