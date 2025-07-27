"""Utilities for OCR processing."""

def clean_ocr_text(text):
    """Normalize whitespace from OCR output."""
    return ' '.join(text.split())
