import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './Background.css';
import { useCallback, useState } from 'react';
import MainSkillNode, { type MainSkillNodeType } from './mainSkill';
import SubSkillNode, { type SubSkillNodeType } from './subSkill';
import RootSkillNode, { type RootSkillNodeType } from './rootSkill';
import SkillInfoPanel from './sidePanel';
import type { SkillNode } from './skillCommon';

const nodeTypes = {
	main: MainSkillNode,
	sub: SubSkillNode,
	root: RootSkillNode,
};

type SkillId = string;

type Skill = {
	id:SkillId,
	name:string,
	type:'main' | 'sub' | 'root',
	tags:string[],
	level:number,
	preq:SkillId[],
	xPos:number,
	maxLevel: number,
}

type Data = {
	skills:Skill[],
	initialPoints: number
}

const data:Data = {
	skills: [
		{
			id: "n5",
			name: "test5",
			type: 'root',
			tags: [],
			level: 0,
			preq: [],
			xPos: 1,
			maxLevel: 5
		},
		{
			id: "n6",
			name: "test6",
			type: 'root',
			tags: [],
			level: 0,
			preq: [],
			xPos: 2,
			maxLevel: 5
		},
		{
			id: "n1",
			name: "test1",
			type: 'main',
			tags: [],
			level: 1,
			preq: ['n5'],
			xPos: 0,
			maxLevel: 1
		},
		{
			id: "n4",
			name: "test4",
			type: 'main',
			tags: [],
			level: 1,
			preq: ['n5'],
			xPos: 1,
			maxLevel: 1
		},
		{
			id: "n2",
			name: "test2",
			type: 'sub',
			tags: [],
			level: 2,
			preq: ["n1"],
			xPos: 0,
			maxLevel: 3
		},
		{
			id: "n3",
			name: "test3",
			type: 'sub',
			tags: [],
			level: 2,
			preq: ["n1", "n4"],
			xPos: 1,
			maxLevel: 1,
		},
	],
	initialPoints:10
}

export default function App() {
	const {initialNodes, initialEdges} = import_skillTree();
	const [nodes, setNodes] = useState(initialNodes);
	const [edges] = useState(initialEdges);
	const [selectedNode, setSelectedNode] = useState<SkillNode|null>(null);
	const [points, setPoints] = useState(data.initialPoints);

	const unlockSkill = (selectedNode:SkillNode, nodes:SkillNode[], points: number) => {
		// Check for all prerequasit skills being unlocked
		let preqMet = true;
		for (const preq of selectedNode.data.preq) {
			if (nodes.find((node) => (node.id === preq) && (!node.data.unlocked))) preqMet = false;
		}
		if (!preqMet) return;
		// Get the skill
		const currNode = nodes.find((n) => n.id === selectedNode.id);
		if (!currNode) return;
		// Chack if we have already maxed the skill
		if (currNode.data.level >= currNode.data.maxLevel) return;
		// Check we have enough points
		if (points < 1) return;
		// Update the level of the skill / unlock it
		setNodes(prevNodes => prevNodes.map(n => 
			n.id === selectedNode.id? {...n, data: { ...n.data, unlocked:true, level: n.data.level + 1} }: n
		));
		// reduce the points
		setPoints(points - 1);
	}

	const onNodeClick = useCallback((_, node:SkillNode) => {
		if (selectedNode !== null) {
			if (selectedNode.id === node.id) {
				unlockSkill(selectedNode, nodes, points);
			} else {
				setNodes(prevNodes => prevNodes.map(n => 
					n.id === selectedNode.id? {...n, data: { ...n.data, selected:false } }: n
				));
			}
		}
		setSelectedNode(node);
		setNodes(prevNodes => prevNodes.map(n => 
			n.id === node.id? {...n, data: { ...n.data, selected:true } }: n
		));
	}, [selectedNode, nodes, points]);

	const onPaneClick = useCallback(() => {
		if (selectedNode !== null) {
			setNodes(prevNodes => prevNodes.map(n => 
				n.id === selectedNode.id? {...n, data: { ...n.data, selected:false } }: n
			));
		}
		setSelectedNode(null);
	}, [selectedNode]);

	return (
		<div style={{ width: '100vw', height: '100vh', position: 'relative'}}>
			<h1 className='points-total'>{points}</h1>
			<ReactFlow 
				nodes={nodes} 
				edges={edges}
				nodeTypes={nodeTypes}
				onNodeClick={onNodeClick}
				onPaneClick={onPaneClick}
				nodesDraggable={false}
				nodesConnectable={false}
				colorMode='dark'
				fitView
			/>
			<SkillInfoPanel selectedNode={selectedNode}> </SkillInfoPanel>
		</div>
	)
}

type Edge = {
	id:SkillId,
	source:SkillId,
	target:SkillId,
	type:'default' | 'step',
}

function import_skillTree() {
	const nodes:(MainSkillNodeType | SubSkillNodeType | RootSkillNodeType)[] = data.skills.map((skill) => { return ({
		id: skill.id,
		position: { x: skill.xPos * 100, y: -(skill.level * 100)},
		type: skill.type,
		data: {
			out: {top: 0, right: 0, left: 0, bottom: 0}, 
			in: {top: 0, right: 0, left: 0, bottom: 0}, 
			unlocked: false, 
			selected:false, 
			title: skill.name,
			preq: skill.preq,
			maxLevel: skill.maxLevel,
			level: 0,
		}
	});});

	const edges:Edge[] = [];
	for (const skill of data.skills) {
		for (const preq of skill.preq) {
			edges.push({id: `${preq}-${skill.id}`, source: preq, target: skill.id, type: 'default'})
		}
	}

	for (const edge of edges) {
		const source = nodes.find((node) => node.id === edge.source);
		const dest = nodes.find((node) => node.id === edge.target);
		if (!source || !dest) continue;
		if (source.position.y > dest.position.y) {
			source.data.out.top++;
			dest.data.in.bottom++;
		} else if (source.position.y < dest.position.y) {
			source.data.out.bottom++;
			dest.data.in.top++;
		} else if (source.position.x < dest.position.x) {
			source.data.out.right++;
			dest.data.in.left++;
		} else {
			source.data.out.left++;
			dest.data.in.right++;
		}
	}
	
	return {initialNodes: nodes, initialEdges: edges};
}
