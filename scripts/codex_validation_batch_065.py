from pathlib import Path


def validate():
    required = [
        'vision/capture_screen.py',
        'vision/ocr_engine.py',
        'vision/ocr_utils.py',
        'network/chat_listener.py',
        'tests/test_ocr_engine.py',
        'tests/test_chat_listener.py'
    ]
    missing = [f for f in required if not Path(f).exists()]
    if missing:
        raise FileNotFoundError(f'Missing files for Batch 065: {missing}')
    print('✅ Batch 065 validation passed.')


if __name__ == '__main__':
    validate()
