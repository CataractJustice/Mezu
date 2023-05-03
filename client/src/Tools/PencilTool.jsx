import { useContext, useState } from "react";
import ContextModifyAction from "../ActionList/ContextModifyAction";
import { EditorContext } from "../EditorPage/Editor";
import ToolProp from "./ToolProp";

export const PencilTool =
{	
	active: false,
	lineCurrent: {x: 0, y: 0},
	before: 0,
	after: 0,

	onMouseDown: (canvas, context, localx, localy, editor)=> 
	{
		PencilTool.active = true;
		context.fillStyle = PencilTool.lineColor;
		context.strokeStyle = PencilTool.lineColor;
		context.lineWidth = PencilTool.lineWidth;
		PencilTool.lineCurrent.x = localx;
		PencilTool.lineCurrent.y = localy;
		PencilTool.before = context.getImageData(0, 0, canvas.width, canvas.height);
	},
	onMouseUp: (canvas, context, localx, localy, editor)=> 
	{
		PencilTool.active = false
		PencilTool.after = context.getImageData(0, 0, canvas.width, canvas.height);
		editor.actionList.push(new ContextModifyAction({context: context, before: PencilTool.before, after: PencilTool.after}));
	},
	onMouseMove: (canvas, context, localx, localy, editor)=> 
	{
		if(PencilTool.active) 
		{
			context.beginPath();
			context.moveTo(PencilTool.lineCurrent.x, PencilTool.lineCurrent.y+PencilTool.lineWidth/2);
			for(let a = 0; a < Math.PI*2; a += Math.PI/16) 
			{
				context.lineTo(PencilTool.lineCurrent.x+Math.sin(a)*PencilTool.lineWidth/2, PencilTool.lineCurrent.y+Math.cos(a)*PencilTool.lineWidth/2);
			}
			context.closePath();
			context.fill();

			context.beginPath();
			context.moveTo(localx, localy+PencilTool.lineWidth/2);
			for(let a = 0; a < Math.PI*2; a += Math.PI/16) 
			{
				context.lineTo(localx+Math.sin(a)*PencilTool.lineWidth/2, localy+Math.cos(a)*PencilTool.lineWidth/2);
			}
			context.closePath();
			context.fill();

			context.beginPath();
			context.moveTo(PencilTool.lineCurrent.x, PencilTool.lineCurrent.y);
			context.lineTo(localx, localy);
			context.stroke();
			PencilTool.lineCurrent.x = localx;
			PencilTool.lineCurrent.y = localy;
		}
	},

	toolName: "Pencil",

	lineWidth: 1,

	lineColor: "#000000",

	PropsComponent: function() 
	{
		const editor = useContext(EditorContext);
		const [lineColor, setLineColor] = useState(PencilTool.lineColor);
		const [lineWidth, setLineWidth] = useState(PencilTool.lineWidth);
		//to-do: make tool prop component
		return (
			<>
				<ToolProp title="Line color">
					<input className="ToolPropColorInput" type="color" value={lineColor} onChange={(e)=>{
						setLineColor(e.target.value);
						PencilTool.lineColor = e.target.value;
						editor.setCurrentTool(PencilTool);
					}}></input>
				</ToolProp>
				
				<ToolProp title="Line width">
					<input className="ToolPropSliderInput" type="range" min={1} max={100} step={1} value={lineWidth} onChange={(e)=>{
						setLineWidth(e.target.value);
						PencilTool.lineWidth = e.target.value;
						editor.setCurrentTool(PencilTool);
					}}></input>
					<div>{`${lineWidth}px`}</div>
				</ToolProp>
			</>
		);
	}
}