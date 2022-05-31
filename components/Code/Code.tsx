import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);

export interface CodeProps {
	code?: string;
	language?: string
}

export const Code: React.FC<CodeProps> = ({ code, language }) => {
	const ref = useRef<HTMLPreElement>(null);

	useEffect(() => {
		const el = ref.current;
		if(el) {
			hljs.highlightBlock(el);
		}
	}, [code]);

	return (
		<pre>
			<code ref={ref} className={language && `language-${language}`}>
				{code}
			</code>
		</pre>
	);
};
