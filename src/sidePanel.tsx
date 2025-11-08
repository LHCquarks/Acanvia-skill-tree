import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import type { SkillNode } from "./skillCommon";
import remarkGfm from "remark-gfm";
import './SidePanel.css';
import './theme.css';

type Data = {
	children: string,
	selectedNode: SkillNode | null
}

export default function SkillInfoPanel(data:Data) {
	const selectedNode = data.selectedNode;
	const [markdown, setMarkdown] = useState('');
	useEffect(() => {
		if (selectedNode) {
			fetch(`/markdown/${selectedNode.id}.md`)
				.then(res => res.text())
				.then(setMarkdown)
				.catch(() => setMarkdown(''))
		}
	}, [selectedNode, markdown]);
	
	if (!selectedNode) return null;

	return (
		<div className={`skill-panel ${selectedNode ? 'open': ''} theme-dark markdown-preview-view`}> 
			<ReactMarkdown remarkPlugins={[remarkGfm]}>
				{markdown}
			</ReactMarkdown>
		</div>
	);
}
