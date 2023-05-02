import "./ToolProp.css";

export default function ToolProp(props) 
{
	return (
		<div className="ToolPropContainer">
			<div className="ToolPropTitle">
			{props.title}
			</div>
			<div className="ToolProp">
			{props.children}
			</div>
		</div>
	);
}