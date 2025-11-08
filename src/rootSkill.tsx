import { type Node, type NodeProps } from "@xyflow/react";
import './CustomNodes.css';
import { getColor, getDiamonds, getHandles, type NodeData } from "./skillCommon";
import { useState } from "react";

export type RootSkillNodeType = Node<NodeData, 'root'>

export default function RootSkillNode(props: NodeProps<RootSkillNodeType>) {
	const [isHovering, setIsHovering] = useState(false);
	const [showTitle, setShowTitle] = useState(false);

	const handleOnMouseEnter = () => {
		setIsHovering(true);
		setShowTitle(false);
		setTimeout(() => {
			setShowTitle(true);
		}, 1000);
	};

	const handleOnMouseLeave = () => {
		setIsHovering(false);
		setShowTitle(false);
	};

  return (
    <div 
			className={getClass(props.data)} 
			style={{backgroundColor: getColor(props.data.level, props.data.maxLevel, props.selected)}}
			onMouseEnter={handleOnMouseEnter}
			onMouseLeave={handleOnMouseLeave}
		>
      <div>
				<div>{props.id}</div>
				{getHandles(props.data)}
				{getDiamonds(props.data)}
				{showTitle && isHovering? <div className="skill-hover"><p>{props.data.title}</p></div>: null}
      </div>
    </div>
  );
}

function getClass(data:NodeData) {
	if (data.selected) return 'root-skill-node selected';
	return 'root-skill-node';
}
