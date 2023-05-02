import "../../Components/TitledFrame.css";
import { EraserTool } from "../../Tools/EraserTool";
import { FloodFillTool } from "../../Tools/FloodFillTool";
import { PencilTool } from "../../Tools/PencilTool";
import "./ToolGrid.css";
import ToolSelect from "./ToolSelect";

function ToolGrid() 
{
	return (
		<div className="TitledFrame ToolGrid">
			<div className="TitledFrameTitle">Tools</div>
			<ToolSelect tool={PencilTool}>A</ToolSelect>
			<ToolSelect tool={EraserTool}>B</ToolSelect>
			<ToolSelect tool={FloodFillTool}>C</ToolSelect>
			<ToolSelect>D</ToolSelect>
			<ToolSelect>E</ToolSelect>
			<ToolSelect>F</ToolSelect>
		</div>
	);
}
 
export default ToolGrid;