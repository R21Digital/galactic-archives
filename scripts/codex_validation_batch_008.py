from pathlib import Path


def validate():
    required_files = [
        'src/index.md',
        'src/layouts/homepage.njk'
    ]
    missing = [f for f in required_files if not Path(f).exists()]
    if missing:
        raise FileNotFoundError(f'Missing files for Batch 008: {missing}')

    css = Path('src/styles/main.css')
    if not css.exists():
        raise FileNotFoundError('src/styles/main.css does not exist')

    text = css.read_text(encoding='utf-8')
    if '.category-grid' not in text:
        raise ValueError('Missing .category-grid styles in main.css')

    print('✅ Batch 008 validation passed.')


if __name__ == '__main__':
    validate()
