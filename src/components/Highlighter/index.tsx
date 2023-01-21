
import React from "react";
import hljs from "highlight.js";
import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', javascript);

import 'highlight.js/styles/atom-one-dark.css';

interface HighlighterProps {
    content: string;
    language?: string;
}

export default function Highlighter({
    content,
    language,
}: HighlighterProps): JSX.Element {
    const highlighted = language
        ? hljs.highlight(language, content)
        : hljs.highlightAuto(content);

    return (
        <pre className="hljs">
            <code dangerouslySetInnerHTML={{__html: highlighted.value}} />
        </pre>
    );
}
