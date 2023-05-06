import { useEffect } from "react";
import { createRef } from "react";

export default function BrushMaskDisplay(props) 
{
	const canvasRef = createRef();

	useEffect(()=>{
		if(canvasRef.current) 
		{
			canvasRef.current.width = props.mask.width;
			canvasRef.current.height = props.mask.height;
			
			const context = canvasRef.current.getContext("2d");
			context.putImageData(props.mask, 0, 0);
		}
	});

	return (
		<div className="BrushMaskDisplay">
			<canvas ref={canvasRef}></canvas>
		</div>
	);
}