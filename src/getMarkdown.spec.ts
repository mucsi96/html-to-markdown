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
    expect(getMarkdown()).toEqual('sample**strong**text');
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
});
