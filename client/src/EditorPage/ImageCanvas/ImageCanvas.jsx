import { useEffect } from "react";
import "./ImageCanvas.css";

function ImageCanvas(props) 
{
	useEffect(()=>{
		let index = 0;
		for(let layer of props.file.layers) 
		{
			let placeholder = document.getElementById(`CanvasPlaceholder${index}${props.file.uuid}`);
			if(!placeholder) {index++; continue;}
			placeholder.parentNode.replaceChild(layer.canvas, placeholder);
			index++;
		}
	});

	return (
		<div className="CanvasContainer" style={
			{
				left: `${props.xOffset}px`,
				top: `${props.yOffset}px`,
				width: `${props.file.width*props.zoom}px`,
				height: `${props.file.height*props.zoom}px`
			}
		}>
			{
				props.file.layers.map((layer, index)=>{
					return <div key={index} id={`CanvasPlaceholder${index}${props.file.uuid}`}></div>//<img key={index} className="CanvasLayer" src={canvasImage} alt={""}></img>
				})
			}
		</div>
	);
}
 
export default ImageCanvas;