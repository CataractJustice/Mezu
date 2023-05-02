import { useContext, useState } from "react";
import ContextModifyAction from "../ActionList/ContextModifyAction";
import { EditorContext } from "../EditorPage/Editor";
import ToolProp from "./ToolProp";

export const FloodFillTool =
{
	before: 0,
	after: 0,
	fillColor: "#000000",
	tolerance: 0,


	onMouseDown: (canvas, context, localx, localy, editor)=> 
	{
		const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(FloodFillTool.fillColor);

		const fillR = parseInt(hex[1], 16);
		const fillG = parseInt(hex[2], 16);
		const fillB = parseInt(hex[3], 16);

		let fillColor = [fillR, fillG, fillB, 0];
		
		const pixelStack = [[parseInt(localx), parseInt(localy)]];
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

		function pixel(x, y)
		{
			return [
				imageData.data[(x + y * canvas.width) * 4 + 0],
				imageData.data[(x + y * canvas.width) * 4 + 1],
				imageData.data[(x + y * canvas.width) * 4 + 2],
				imageData.data[(x + y * canvas.width) * 4 + 3]
			];
		};

		function fillPixel(x, y)
		{
			imageData.data[(x + y * canvas.width) * 4 + 0] = fillColor[0];
			imageData.data[(x + y * canvas.width) * 4 + 1] = fillColor[1];
			imageData.data[(x + y * canvas.width) * 4 + 2] = fillColor[2];
			imageData.data[(x + y * canvas.width) * 4 + 3] = 255;
		};

		function colorDelta(c1, c2)
		{
			return Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]) + Math.abs(c1[2] - c2[2]) + Math.abs(c1[3] - c2[3]);
		};

		const filledColor = pixel(pixelStack[0][0], pixelStack[0][1]);
		fillColor[3] = filledColor[3];

		FloodFillTool.before = canvas.toDataURL();

		while(pixelStack.length) 
		{
			const currentPixel = pixelStack.pop();
			let x = currentPixel[0];
			let y = currentPixel[1];
			
			//go up
			while(colorDelta(filledColor, pixel(x, --y)) <= FloodFillTool.tolerance && colorDelta(fillColor, pixel(x, y)) && y >= 0);
			y++;
			let checkLeft = true;
			let checkRight = true;
			//go down
			while(colorDelta(filledColor, pixel(x, y)) <= FloodFillTool.tolerance && colorDelta(fillColor, pixel(x, y)) && y < canvas.width) 
			{
				fillPixel(x, y);
				if(x > 0)
				{
					if(colorDelta(filledColor, pixel(x-1, y)) <= FloodFillTool.tolerance && colorDelta(fillColor, pixel(x-1, y))) 
					{
						if(checkLeft)
							pixelStack.push([x-1, y]);
						checkLeft = false;
					}
					else 
					{
						checkLeft = true;
					}
				}//////////////////
				if(x < canvas.width - 1) 
				{
					if(colorDelta(filledColor, pixel(x+1, y)) <= FloodFillTool.tolerance && colorDelta(fillColor, pixel(x+1, y))) 
					{
						if(checkRight)
							pixelStack.push([x+1, y]);
						checkRight = false;
					}
					else 
					{
						checkRight = true;
					}
				}
				y++;
			}
		}

		context.putImageData(imageData, 0, 0);
		FloodFillTool.after = canvas.toDataURL();
		editor.actionList.push(new ContextModifyAction(context, FloodFillTool.before, FloodFillTool.after));
	},
	onMouseUp: ()=> 
	{
	},
	onMouseMove: ()=> 
	{
	},

	toolName: "Flood fill",

	PropsComponent: function() 
	{
		const editor = useContext(EditorContext);
		const [fillColor, setFillColor] = useState(FloodFillTool.fillColor);
		const [tolerance, setTolerance] = useState(FloodFillTool.tolerance);
		//to-do: make tool prop component
		return (
			<>
				<ToolProp title={"Fill color"}>
					<input className="ToolPropColorInput" type="color" value={fillColor} onChange={(e)=>{
						setFillColor(e.target.value);
						FloodFillTool.fillColor = e.target.value;
						editor.setCurrentTool(FloodFillTool);
					}}></input>
				</ToolProp>

				<ToolProp title={"Tolerance"}>
					<input className="ToolPropSliderInput" type="range" min={1} max={1024} step={1} value={tolerance} onChange={(e)=>{
						setTolerance(e.target.value);
						FloodFillTool.tolerance = e.target.value;
						editor.setCurrentTool(FloodFillTool);
						}}></input>
					<div style={{width:'64px'}}>{`${parseInt(tolerance/1024*100)}%`}</div>
				</ToolProp>
			</>
		);
	}
}