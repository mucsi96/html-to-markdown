import { getMarkdown } from './getMarkdown';

describe('getMarkdown', () => {
  test('returns text', () => {
    document.body.innerHTML = 'sample text';
    expect(getMarkdown()).toEqual('sample text');
  });

  test('returns text in tag', () => {
    document.body.innerHTML = '<div>sample text</div>';
    expect(getMarkdown()).toEqual('sample text');
  });

  test('returns text in multiple tags', () => {
    document.body.innerHTML = '<div>sample</div> <div>text</div>';
    expect(getMarkdown()).toEqual('sample text');
  });

  test('returns text from paragraphs', () => {
    document.body.innerHTML = '<p>sample</p><p>text</p>';
    expect(getMarkdown()).toEqual('sample\n\ntext');
  });

  test('returns empty string in case of br tag', () => {
    document.body.innerHTML = '<br/>';
    expect(getMarkdown()).toEqual('');
  });

  test('returns line break for br tag', () => {
    document.body.innerHTML = 'sample<br/>text';
    expect(getMarkdown()).toEqual('sample\ntext');
  });

  test('returns strong text as bold', () => {
    document.body.innerHTML = 'sample<strong>strong</strong>text';
    expect(getMarkdown()).toEqual('sample **strong** text');
  });

  test('returns headign level 1', () => {
    document.body.innerHTML = 'sample<h1>heading</h1>text';
    expect(getMarkdown()).toEqual('sample\n\n# heading\n\ntext');
  });

  test('returns headign level 2', () => {
    document.body.innerHTML = 'sample<h2>heading</h2>text';
    expect(getMarkdown()).toEqual('sample\n\n## heading\n\ntext');
  });

  test('returns headign level 3', () => {
    document.body.innerHTML = 'sample<h3>heading</h3>text';
    expect(getMarkdown()).toEqual('sample\n\n### heading\n\ntext');
  });

  test('returns headign level 4', () => {
    document.body.innerHTML = 'sample<h4>heading</h4>text';
    expect(getMarkdown()).toEqual('sample\n\n#### heading\n\ntext');
  });

  test('returns headign level 5', () => {
    document.body.innerHTML = 'sample<h5>heading</h5>text';
    expect(getMarkdown()).toEqual('sample\n\n##### heading\n\ntext');
  });

  test('returns headign level 6', () => {
    document.body.innerHTML = 'sample<h6>heading</h6>text';
    expect(getMarkdown()).toEqual('sample\n\n###### heading\n\ntext');
  });

  test('returns inline code', () => {
    document.body.innerHTML = 'sample<code>code</code>text';
    expect(getMarkdown()).toEqual('sample `code` text');
  });

  test('returns multiline code', () => {
    document.body.innerHTML = 'sample<pre>multi\nline\ncode</pre>text';
    expect(getMarkdown()).toEqual('sample\n\n```multi\nline\ncode```\n\ntext');
  });

  test('returns link', () => {
    document.body.innerHTML = 'sample<a href="#test-href">link</a>text';
    expect(getMarkdown()).toEqual('sample [link](#test-href) text');
  })

  test('returns ordered list', () => {
    document.body.innerHTML = 'sample<ol><li>a</li><li>b</li></ol>text';
    expect(getMarkdown()).toEqual('sample\n\n1. a\n2. b\n\ntext');
  })

  test('returns unordered list', () => {
    document.body.innerHTML = 'sample<ul><li>a</li><li>b</li></ul>text';
    expect(getMarkdown()).toEqual('sample\n\n- a\n- b\n\ntext');
  })

  test('returns list with complex items', () => {
    document.body.innerHTML = 'sample<ul><li>first<strong>strong</strong>item</li><li>second<code>code</code>item</li></ul>text';
    expect(getMarkdown()).toEqual('sample\n\n- first **strong** item\n- second `code` item\n\ntext');
  })
});
