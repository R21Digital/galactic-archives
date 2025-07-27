from vision.ocr_utils import clean_ocr_text


def test_clean_ocr_text_collapses_whitespace():
    raw = "Hello\n   world\t!  "
    assert clean_ocr_text(raw) == "Hello world !"
