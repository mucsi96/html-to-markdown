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
  function headingChunk(content, level = 1) {
    return content
      ? [
          chunk({
            content: ['#'.repeat(level), content].join(' '),
            margin: {
              top: 2,
              bottom: 2,
            },
          }),
        ]
      : [];
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
                content: wrap(content, '*'),
                margin: {
                  right: 1,
                  left: 1,
                },
              }),
            ];
          case 'strong':
            return [
              chunk({
                content: wrap(content, '**'),
                margin: {
                  right: 1,
                  left: 1,
                },
              }),
            ];
          case 'h1':
            return headingChunk(content, 1);
          case 'h2':
            return headingChunk(content, 2);
          case 'h3':
            return headingChunk(content, 3);
          case 'h4':
            return headingChunk(content, 4);
          case 'h5':
            return headingChunk(content, 5);
          case 'h6':
            return headingChunk(content, 6);
          case 'code':
            return chunk({
              content: wrap(content, '`'),
              margin: {
                right: 1,
                left: 1,
              },
            });
          case 'pre':
            return chunk({
              content: wrap(content, '```'),
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
                  .map((chunk, index) => `${index + 1}. ${chunk.content ?? ''}`)
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
                  .map((chunk) => `- ${chunk.content ?? ''}`)
                  .join('\n'),
                margin: {
                  top: 2,
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
