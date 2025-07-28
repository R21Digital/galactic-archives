from pathlib import Path


def validate():
    required = [
        'src/layouts/categories/index.njk',
        'src/content/professions.md',
        'src/content/quests.md'
    ]

    missing = [f for f in required if not Path(f).exists()]
    if missing:
        raise FileNotFoundError(f'Missing files for Batch 007: {missing}')

    eleventy = Path('.eleventy.js')
    if not eleventy.exists():
        raise FileNotFoundError('Missing .eleventy.js')

    text = eleventy.read_text(encoding='utf-8')
    if 'slugifyCategory' not in text:
        raise ValueError('slugifyCategory not defined in .eleventy.js')

    print('✅ Batch 007 validation passed.')


if __name__ == '__main__':
    validate()
