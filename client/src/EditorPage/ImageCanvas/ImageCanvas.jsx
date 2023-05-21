import { useEffect } from "react";
import "./ImageCanvas.css";

function ImageCanvas(props) 
{
	useEffect(()=>{
		let index = 0;
		for(let layer of props.file.layers) 
		{
			let placeholder = document.getElementById(`CanvasPlaceholder${index}${props.file.uuid}`);
			if(!index) 
			{
				let old = placeholder.parentNode.getElementsByTagName("canvas");
				for(let oldcanv of old) 
				{
					oldcanv.remove();
				}
			}
			if(!placeholder) {index++; continue;}
			placeholder.parentNode.append(layer.canvas, placeholder);
			placeholder.parentNode.append(layer.bufferCanvas, placeholder);
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
			<div>
				{
					props.file.layers.map((layer, index)=>{
						return <div key={`CanvasPlaceholder${index}${props.file.uuid}`} id={`CanvasPlaceholder${index}${props.file.uuid}`}></div>//<img key={index} className="CanvasLayer" src={canvasImage} alt={""}></img>
					})
				}
			</div>
		</div>
	);
}
 
export default ImageCanvas;