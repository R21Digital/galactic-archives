def clean_ocr_text(text):
    return text.strip().replace('
', ' ').replace(' ', ' ')
