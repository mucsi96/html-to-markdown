function chunk(options) {
    return options;
}
function collapseMargins(marginTop, marginBottom) {
    return Math.max(marginTop ?? 0, marginBottom ?? 0);
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
function wrap(content, prefix, suffix = prefix) {
    return content ? [prefix, content, suffix].join('') : '';
}
function code(content, language) {
    return content && `\`\`\`${language}\n\n${content}\n\n\`\`\``;
}
function inlineCode(content) {
    return wrap(content, '`', '`');
}
function heading(name, level) {
    return ['#'.repeat(level), name].join(' ');
}
function listItem(text, level = 1) {
    return ['  '.repeat(level - 1), '- ', text].join('');
}
function link(text, link) {
    return `[${text}](${link})`;
}
function headingChunk(content, level = 1) {
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
export function getMarkdown() {
    return joinChunks(getMarkdownRecursive(document.body)).content ?? '';
}
