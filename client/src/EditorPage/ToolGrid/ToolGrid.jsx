import "../../Components/TitledFrame.css";
import AlphaBlend from "../../Tools/AlphaBlend";
import BrushTool from "../../Tools/BrushTool";
import { ColorPipette } from "../../Tools/ColorPipette";
import ElipseTool from "../../Tools/ElipseTool";
import { FloodFillTool } from "../../Tools/FloodFillTool";
import RectTool from "../../Tools/RectTool";
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
		icon: "🖌"
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

const rectTool = new RectTool();
const elipseTool = new ElipseTool();

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

			<ToolSelect tool={FloodFillTool}>🪣</ToolSelect>
			<ToolSelect tool={ColorPipette}>P</ToolSelect>
			<ToolSelect tool={rectTool}>□</ToolSelect>
			<ToolSelect tool={elipseTool}>□</ToolSelect>
		</div>
	);
}
 
export default ToolGrid;