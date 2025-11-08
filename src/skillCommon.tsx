import { Handle, Position, type Node } from "@xyflow/react";
import type { SubSkillNodeType } from "./subSkill";
import type { MainSkillNodeType } from "./mainSkill";
import type { RootSkillNodeType } from "./rootSkill";
export type SkillNodeType = Node<NodeData, 'skill'>

export type SkillNode = RootSkillNodeType | MainSkillNodeType | SubSkillNodeType;

type SkillId = string;

export type NodeData = {
	out: ConnectionPoints,
	in: ConnectionPoints,
	unlocked: boolean,
	selected: boolean,
	title: string,
	preq: SkillId[],
	level: number,
	maxLevel: number,
}

type ConnectionPoints = {
	top: number,
	right: number,
	left: number,
	bottom: number
}

export function getHandles(data:NodeData) {
	const handles = [];
	for (let i = 0; i < data.in.top; i++) {
		handles.push(<Handle type="target" position={Position.Top} key={`in-top-${i}`}/>);
	}
	for (let i = 0; i < data.in.bottom; i++) {
		handles.push(<Handle type="target" position={Position.Bottom} key={`in-bottom-${i}`}/>);
	}
	for (let i = 0; i < data.in.left; i++) {
		handles.push(<Handle type="target" position={Position.Left} key={`in-left-${i}`}/>);
	}
	for (let i = 0; i < data.in.right; i++) {
		handles.push(<Handle type="target" position={Position.Right} key={`in-right-${i}`}/>);
	}

	for (let i = 0; i < data.out.top; i++) {
		handles.push(<Handle type="source" position={Position.Top} key={`out-top-${i}`}/>);
	}
	for (let i = 0; i < data.out.bottom; i++) {
		handles.push(<Handle type="source" position={Position.Bottom} key={`out-bottom-${i}`}/>);
	}
	for (let i = 0; i < data.out.left; i++) {
		handles.push(<Handle type="source" position={Position.Left} key={`out-left-${i}`}/>);
	}
	for (let i = 0; i < data.out.right; i++) {
		handles.push(<Handle type="source" position={Position.Right} key={`out-right-${i}`}/>);
	}
	return handles;
}

export function getDiamonds(data:NodeData) {
	if (data.maxLevel == 1) return null;
	const diamonds = [];
	for (let i = 0; i < data.maxLevel; i++) {
		diamonds.push(<div className="skill-diamond-container"><div className={`skill-diamond ${data.level > i? 'unlocked': ''}`}></div></div>);
	}
	return (
		<div className="skill-diamonds-container">{diamonds}</div>
	);
}

export function getColor(level:number, maxLevel:number, selected: boolean) {
	if (!selected && level === 0) return '#232a42';
	const baseColor = 0x38446e;
	const fullyUnlockedColor = 0xc9ced1;
	const out = colorMixer(fullyUnlockedColor, baseColor,  level / maxLevel);
	return `#${out.toString(16).padStart(6, '0')}`;
}

function colorMixer(rgbA:number, rgbB:number, amountToMix:number){
	const colorMask = 0xFF;

	const r = colorChannelMixer((rgbA >> 16) & colorMask, (rgbB >> 16) & colorMask, amountToMix);
	const g = colorChannelMixer((rgbA >> 8) & colorMask, (rgbB >> 8) & colorMask, amountToMix);
	const b = colorChannelMixer(rgbA & colorMask, rgbB & colorMask, amountToMix);
	return b | (g << 8) | (r << 16);
}

function colorChannelMixer(colorChannelA:number, colorChannelB:number, amountToMix:number){
    const channelA = colorChannelA*amountToMix;
    const channelB = colorChannelB*(1-amountToMix);
    return channelA+channelB;
}
