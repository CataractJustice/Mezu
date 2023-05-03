import { useContext, useState } from "react";
import ContextModifyAction from "../ActionList/ContextModifyAction";
import { EditorContext } from "../EditorPage/Editor";
import ToolProp from "./ToolProp";

export const EraserTool =
{	
	active: false,
	before: 0,
	after: 0,

	onMouseDown: (canvas, context)=> 
	{
		EraserTool.active = true;
		/*
		context.lineWidth = PencilTool.lineWidth;
		context.strokeStyle = PencilTool.lineColor;
		PencilTool.lineCurrent.x = localx;
		PencilTool.lineCurrent.y = localy;
		context.beginPath();
		*/
		EraserTool.before = context.getImageData(0, 0, canvas.width, canvas.height);
	},
	onMouseUp: (canvas, context, localx, localy, editor)=> 
	{
		EraserTool.active = false
		EraserTool.after = context.getImageData(0, 0, canvas.width, canvas.height);
		editor.actionList.push(new ContextModifyAction({context: context, before: EraserTool.before, after: EraserTool.after}));
	},
	onMouseMove: (canvas, context, localx, localy)=> 
	{
		if(EraserTool.active) 
		{
			context.clearRect(localx-EraserTool.size/2, localy-EraserTool.size/2, EraserTool.size, EraserTool.size);
		}
	},

	toolName: "Eraser",

	size: 10,

	PropsComponent: function() 
	{
		const editor = useContext(EditorContext);
		const [eraserSize, setEraserSize] = useState(EraserTool.size);
		//to-do: make tool prop component
		return (
			<>
				<ToolProp title={"Eraser size"}>
					<input className="ToolPropSliderInput" type="range" min={1} max={100} step={1} value={eraserSize} onChange={(e)=>{
						setEraserSize(e.target.value);
						EraserTool.size = e.target.value;
						editor.setCurrentTool(EraserTool);
					}}></input>
					<div>{`${eraserSize}px`}</div>
				</ToolProp>
			</>
		);
	}
}