# html-to-markdown

Script to convert semantic HTML to markdown

````js
(function () {
  function chunk(options) {
    return options;
  }
  function collapseMargins(marginA, marginB) {
    return Math.max(marginA ?? 0, marginB ?? 0);
  }
  function joinChunks(chunks) {
    if (!chunks.length) {
      return chunk({});
    }
    if (chunks.length === 1) {
      return chunks[0];
    }
    const a = chunks[0];
    const b = joinChunks(chunks.slice(1));
    const verticalGap = collapseMargins(a.margin?.bottom, b.margin?.top);
    const horizontalGap = collapseMargins(a.margin?.right, b.margin?.left);
    return chunk({
      margin: {
        top: a.content
          ? a.margin?.top
          : collapseMargins(a.margin?.top, a.margin?.bottom),
        right: a.content
          ? a.margin?.right
          : collapseMargins(a.margin?.right, a.margin?.left),
        bottom: b.content
          ? b.margin?.bottom
          : collapseMargins(b.margin?.top, b.margin?.bottom),
        left: a.content
          ? a.margin?.left
          : collapseMargins(a.margin?.left, a.margin?.right),
      },
      content: [a.content, b.content]
        .filter(Boolean)
        .join(
          verticalGap ? '\n'.repeat(verticalGap) : ' '.repeat(horizontalGap)
        ),
    });
  }
  function wrap(content, prefix, suffix = prefix) {
    return content ? [prefix, content, suffix].join('') : '';
  }
  function headingChunk(element, content, level = 1) {
    const id = element.getAttribute('id');
    return content
      ? [
          chunk({
            content: ['#'.repeat(level), content, id && `{#${id}}`]
              .filter(Boolean)
              .join(' '),
            margin: {
              top: 2,
              bottom: 2,
            },
          }),
        ]
      : [];
  }
  function getListItem(chunk) {
    return (
      chunk.content?.replace(/\n\n/g, '\n').replace(/^(-|\d+.) /gm, '  $&') ??
      ''
    );
  }
  function getMarkdownRecursive(root) {
    return Array.from(root.childNodes).flatMap((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child;
        const chunks = getMarkdownRecursive(child);
        const content = joinChunks(chunks).content;
        switch (element.tagName.toLowerCase()) {
          case 'p':
            return [
              chunk({
                content,
                margin: {
                  top: 2,
                  bottom: 2,
                },
              }),
            ];
          case 'br':
            return [
              chunk({
                margin: {
                  bottom: 1,
                },
              }),
            ];
          case 'em':
            return [
              chunk({
                content: wrap(content?.trim(), '*'),
              }),
            ];
          case 'strong':
            return [
              chunk({
                content: wrap(content?.trim(), '**'),
                margin: {
                  right: 1,
                  left: 1,
                },
              }),
            ];
          case 'h1':
            return headingChunk(element, content, 1);
          case 'h2':
            return headingChunk(element, content, 2);
          case 'h3':
            return headingChunk(element, content, 3);
          case 'h4':
            return headingChunk(element, content, 4);
          case 'h5':
            return headingChunk(element, content, 5);
          case 'h6':
            return headingChunk(element, content, 6);
          case 'code':
            if (element.parentElement?.tagName.toLowerCase() === 'pre') {
              return chunks;
            }
            return chunk({
              content: wrap(content, '`'),
              margin: {
                right: 1,
                left: 1,
              },
            });
          case 'pre':
            return chunk({
              content: wrap(content, '```\n', '\n```'),
              margin: {
                top: 2,
                bottom: 2,
              },
            });
          case 'a':
            return [
              chunk({
                content: `[${content}](${element.getAttribute('href')})`,
                margin: {
                  right: 1,
                  left: 1,
                },
              }),
            ];
          case 'li':
            return [
              chunk({
                content,
                margin: {
                  right: 1,
                  left: 1,
                },
              }),
            ];
          case 'ol':
            return [
              chunk({
                content: chunks
                  .filter((chunk) => chunk.content?.trim())
                  .map((chunk, index) => `${index + 1}. ${getListItem(chunk)}`)
                  .join('\n'),
                margin: {
                  top: 2,
                  bottom: 2,
                },
              }),
            ];
          case 'ul':
            return [
              chunk({
                content: chunks
                  .filter((chunk) => chunk.content?.trim())
                  .map((chunk) => `- ${getListItem(chunk)}`)
                  .join('\n'),
                margin: {
                  top: 2,
                  bottom: 2,
                },
              }),
            ];
          case 'img':
            return [
              chunk({
                content: `![${
                  element.getAttribute('alt') ?? ''
                }](${element.getAttribute('src')})`,
                margin: {
                  top: 2,
                  bottom: 2,
                },
              }),
            ];
          case 'tr':
            return [
              chunk({
                content: wrap(
                  chunks
                    .filter((chunk) => chunk.content?.trim())
                    .map((chunk) => chunk.content ?? '')
                    .join(' | '),
                  '| ',
                  ' |'
                ),
                margin: {
                  top: 1,
                  bottom: 1,
                },
              }),
            ];
          case 'thead':
            return [
              chunk({
                content,
                margin: {
                  top: 2,
                },
              }),
              chunk({
                content: wrap(
                  Array((content ?? '').split('|').length - 2)
                    .fill('-')
                    .join(' | '),
                  '| ',
                  ' |'
                ),
                margin: {
                  top: 1,
                  bottom: 1,
                },
              }),
            ];
          case 'tbody':
            return [
              chunk({
                content,
                margin: {
                  bottom: 2,
                },
              }),
            ];
          default:
            return chunks;
        }
      }
      if (child.nodeType === Node.TEXT_NODE) {
        return [chunk({ content: child.textContent ?? '' })];
      }
      return [];
    });
  }

  function getMarkdown() {
    return joinChunks(getMarkdownRecursive(document.body)).content ?? '';
  }

  copy(getMarkdown());
})();
````
