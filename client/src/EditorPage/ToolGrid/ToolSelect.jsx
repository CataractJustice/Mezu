import { useContext } from "react";
import { EditorContext } from "../Editor";
import "./ToolSelect.css";

function ToolSelect(props) 
{
	const editor = useContext(EditorContext);
	return (
		<div title={props.tool ? props.tool.toolName : ""} className="ToolSelect" onClick={()=>{
			editor.setCurrentTool(props.tool);
		}}
		style={{backgroundColor:props.tool === editor.currentTool ? "var(--inset-color)" : ""}}
		>
			{props.children}
		</div>
	);
}
 
export default ToolSelect;