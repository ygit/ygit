"""Dependency-free checks for the static site's navigable and accessible structure."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids = []
        self.refs = []
        self.images = []
        self.h1s = 0
        self.canonical = None
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        self.h1s += tag == 'h1'
        if tag == 'img':
            self.images.append(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        for candidate in attrs.get('srcset', '').split(','):
            if candidate.strip():
                self.refs.append(candidate.strip().split()[0])
        for name in ('src', 'href'):
            if name in attrs:
                self.refs.append(attrs[name])


class SiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.documents = {p: Document(p) for p in ROOT.rglob('*.html')}

    def test_internal_routes_assets_and_fragments_resolve(self):
        for source, document in self.documents.items():
            for ref in document.refs:
                with self.subTest(source=source.relative_to(ROOT), ref=ref):
                    parsed = urlparse(ref)
                    if parsed.scheme or parsed.netloc:
                        continue
                    target = ROOT / parsed.path.lstrip('/') if parsed.path else source
                    if target.is_dir():
                        target /= 'index.html'
                    self.assertTrue(target.is_file())
                    if parsed.fragment:
                        self.assertIn(parsed.fragment, self.documents[target].ids)

    def test_pages_have_one_primary_heading_and_unique_ids(self):
        self.assertGreaterEqual(len(self.documents), 12)
        for path, document in self.documents.items():
            with self.subTest(path=path):
                self.assertEqual(document.h1s, 1)
                self.assertEqual(len(document.ids), len(set(document.ids)))
                self.assertIn('main', document.ids)

    def test_sitemap_and_canonical_urls_agree(self):
        tree = ET.parse(ROOT / 'sitemap.xml')
        urls = [node.text for node in tree.findall('.//{*}loc')]
        self.assertEqual(len(urls), len(set(urls)))
        expected = set()
        for path, document in self.documents.items():
            relative = path.parent.relative_to(ROOT).as_posix()
            url = 'https://yogeshsingh.space/' + (relative + '/' if relative != '.' else '')
            self.assertEqual(document.canonical, url)
            expected.add(url)
        self.assertEqual(set(urls), expected)

    def test_diagrams_have_alternative_text_and_dimensions(self):
        for document in self.documents.values():
            for attrs in document.images:
                self.assertTrue(attrs.get('alt'))
                self.assertTrue(attrs.get('width'))
                self.assertTrue(attrs.get('height'))
        for path in (ROOT / 'assets').glob('*.svg'):
            tree = ET.parse(path)
            self.assertIsNotNone(tree.find('{*}title'))
            self.assertIsNotNone(tree.find('{*}desc'))


if __name__ == '__main__':
    unittest.main()
