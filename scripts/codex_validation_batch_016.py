from pathlib import Path


def validate():
    required = [
        'src/_data/metadata.js',
        'src/_includes/seo.njk',
        'src/sitemap.xml.njk'
    ]
    missing = [f for f in required if not Path(f).exists()]
    if missing:
        raise FileNotFoundError(f'Missing files for Batch 016: {missing}')
    print('✅ Batch 016 validation passed.')


if __name__ == '__main__':
    validate()
