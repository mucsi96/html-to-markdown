type Chunk = {
  marginTop?: number;
  content?: string;
  marginBottom?: number;
};

function chunk(options: Chunk): Chunk {
  return options;
}

function collapseMargins(marginTop?: number, marginBottom?: number): number {
  return Math.max(marginTop ?? 0, marginBottom ?? 0);
}

function joinChunks(chunks: Chunk[]): Chunk {
  if (!chunks.length) {
    return chunk({});
  }

  if (chunks.length === 1) {
    return chunks[0];
  }

  const a = chunks[0];
  const b = joinChunks(chunks.slice(1));
  const gap = collapseMargins(a.marginBottom, b.marginTop);
  return chunk({
    marginTop: a.content
      ? a.marginTop
      : collapseMargins(a.marginTop, a.marginBottom),
    marginBottom: b.content
      ? b.marginBottom
      : collapseMargins(b.marginTop, b.marginBottom),
    content: [a.content, b.content].filter(Boolean).join('\n'.repeat(gap)),
  });
}

function wrap(content?: string, prefix?: string, suffix = prefix): string {
  return content ? [prefix, content, suffix].join('') : '';
}

function code(content: string, language: string): string {
  return content && `\`\`\`${language}\n\n${content}\n\n\`\`\``;
}

function inlineCode(content: string): string {
  return wrap(content, '`', '`');
}

function heading(name: string, level: number): string {
  return ['#'.repeat(level), name].join(' ');
}

function listItem(text: string, level = 1): string {
  return ['  '.repeat(level - 1), '- ', text].join('');
}

function link(text: string, link: string): string {
  return `[${text}](${link})`;
}

function headingChunk(content?: string, level: number = 1): Chunk[] {
  return content
    ? [
        chunk({
          content: heading(content, level),
          marginTop: 2,
          marginBottom: 2,
        }),
      ]
    : [];
}

function getMarkdownRecursive(root: HTMLElement): Chunk[] {
  return Array.from(root.childNodes).flatMap((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as HTMLElement;
      const chunks = getMarkdownRecursive(child as HTMLElement);
      const content = joinChunks(chunks).content;
      switch (element.tagName.toLowerCase()) {
        case 'p':
          return [
            chunk({
              content,
              marginTop: 2,
              marginBottom: 2,
            }),
          ];

        case 'br':
          return [chunk({ marginBottom: 1 })];
        case 'strong':
          return [
            chunk({
              content: wrap(content, '**'),
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

export function getMarkdown(): string {
  return joinChunks(getMarkdownRecursive(document.body)).content ?? '';
}
