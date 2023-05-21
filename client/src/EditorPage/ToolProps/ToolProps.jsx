import { useContext } from "react";
import { EditorContext } from "../Editor";
import "./ToolProps.css";

function ToolProps() 
{
	const editor = useContext(EditorContext);
	return (
		<div className="TitledFrame">
			<div className="TitledFrameTitle">{editor.currentTool.toolName ? `${editor.currentTool.toolName} properties` : "Tool properties"}</div>
		<div className="ToolProps">
			{
				editor.currentTool.PropsComponent ? <editor.currentTool.PropsComponent tool={editor.currentTool}></editor.currentTool.PropsComponent> : <></>
			}
		</div>
		</div>
	);
}
 
export default ToolProps;