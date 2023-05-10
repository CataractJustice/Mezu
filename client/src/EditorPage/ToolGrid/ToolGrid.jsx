import "../../Components/TitledFrame.css";
import AlphaBlend from "../../Tools/AlphaBlend";
import BrushTool from "../../Tools/BrushTool";
import { FloodFillTool } from "../../Tools/FloodFillTool";
import "./ToolGrid.css";
import ToolSelect from "./ToolSelect";

const BrushList = [
	{
		brush: new BrushTool({
			title: "Brush",
			colorFunction: (args) => {
				const editor = args.viewportArgs.editor;
				return [editor.primaryColor[0], editor.primaryColor[1], editor.primaryColor[2], editor.primaryColor[3] * args.brushMaskColor[3] / 255];
			},
			blendFunction: AlphaBlend.Normal
		}),
		icon: "B"
	},

	{
		brush: new BrushTool({
			title: "Eraser",
			colorFunction: (args) => {
			return [255, 255, 255, 255-args.brushMaskColor[3]];
			},
			blendFunction: AlphaBlend.Multiply
		}),
		icon: "E"
	}
];

function ToolGrid() 
{
	return (
		<div className="TitledFrame ToolGrid">
			<div className="TitledFrameTitle">Tools</div>
			{
				BrushList.map((brush, index) => {
					return <ToolSelect tool={brush.brush} key={brush.brush.title+""+index}>{brush.icon}</ToolSelect>	
				})
			}

			<ToolSelect tool={FloodFillTool}>F</ToolSelect>
		</div>
	);
}
 
export default ToolGrid;