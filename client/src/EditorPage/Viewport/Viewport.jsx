import { createRef, useContext, useState } from "react";
import ImageCanvas from "../ImageCanvas/ImageCanvas";
import { UpdateFooterPixelCoords } from "../Footer/Footer";
import "./Viewport.css";
import { EditorContext } from "../Editor";
import FreeTransformUI from "./FreeTransformUI";
import { useEffect } from "react";

function Viewport(props) 
{
	let ViewportRef = createRef();
	const [mbuttonPressed, setMbuttonPressed] = useState([false, false, false]);
	const [mbuttonDownPosition, setMbuttonDownPosition] = useState([{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]);
	const [mbuttonUpPosition, setMbuttonUpPosition] = useState([{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]);
	const [zoom, setZoom] = useState(1.0);
	const [oldXOffset, setoldXOffset] = useState(0.0);
	const [oldYOffset, setoldYOffset] = useState(0.0);
	const [xOffset, setXOffset] = useState(0.0);
	const [yOffset, setYOffset] = useState(0.0);

	const editor = useContext(EditorContext);

	const [transformRect, setTransformRect] = useState({x:0,y:0,w:0,h:0});
	const [transformRectActive, setTransformRectActive] = useState(false);

	//Temporary test fields
	const canvasWidth = props.file.width;
	const canvasHeight = props.file.height;

	useEffect(()=>{
		if(editor.currentTool.update) editor.currentTool.update({xOffset:xOffset, yOffset:yOffset, zoom:zoom, editor: editor, layer: editor.currentFile.currentLayer, viewport: ViewportRef});
	});

	return (
		<div className="Viewport" ref={ViewportRef} style={{display: props.active ? "block" : "none"}}
		onMouseDown={(e)=>
			{
				const viewportRect = ViewportRef.current.getBoundingClientRect();
				const localMouseX = ((e.clientX - viewportRect.x) - xOffset) / zoom;
				const localMouseY = ((e.clientY - viewportRect.y) - yOffset) / zoom;

				const mbuttonPressedTemp = mbuttonPressed.slice();
				mbuttonPressedTemp[e.button] = true;
				setMbuttonPressed(mbuttonPressedTemp);

				const mbuttonDownPositionTemp = mbuttonDownPosition.slice();
				mbuttonDownPositionTemp[e.button] = {x: e.clientX, y: e.clientY};
				setMbuttonDownPosition(mbuttonDownPositionTemp);
				if(e.button === 1) 
				{
					setoldXOffset(xOffset);
					setoldYOffset(yOffset);
				}
				if(e.button === 0 && editor.currentTool.onMouseDown && editor.currentFile.currentLayer.context) 
				{
					editor.currentTool.onMouseDown({setTransformRectActive, setTransformRect:setTransformRect,xOffset:xOffset, yOffset:yOffset, zoom:zoom, editor: editor, px: localMouseX, py: localMouseY, layer: editor.currentFile.currentLayer, viewport: ViewportRef});
				}
			}}
		onMouseMove={(e)=>
			{
				const viewportRect = ViewportRef.current.getBoundingClientRect();
				const localMouseX = ((e.clientX - viewportRect.x) - xOffset) / zoom;
				const localMouseY = ((e.clientY - viewportRect.y) - yOffset) / zoom;
				UpdateFooterPixelCoords(
					parseInt(localMouseX),
					parseInt(localMouseY)
				);

				//Move canvas
				if(mbuttonPressed[1]) 
				{
					setXOffset(oldXOffset + (e.clientX - mbuttonDownPosition[1].x));
					setYOffset(oldYOffset + (e.clientY - mbuttonDownPosition[1].y));
				}


				if(e.button === 0 && editor.currentTool.onMouseMove && editor.currentFile.currentLayer.context) 
				{
					editor.currentTool.onMouseMove({setTransformRectActive, setTransformRect:setTransformRect,xOffset:xOffset, yOffset:yOffset, zoom:zoom, editor: editor, px: localMouseX, py: localMouseY, layer: editor.currentFile.currentLayer, viewport: ViewportRef});
				}
			}}
		onMouseUp={(e)=>
			{
				const viewportRect = ViewportRef.current.getBoundingClientRect();
				const localMouseX = ((e.clientX - viewportRect.x) - xOffset) / zoom;
				const localMouseY = ((e.clientY - viewportRect.y) - yOffset) / zoom;

				const mbuttonPressedTemp = mbuttonPressed.slice();
				mbuttonPressedTemp[e.button] = false;
				setMbuttonPressed(mbuttonPressedTemp);


				const mbuttonUpPositionTemp = mbuttonUpPosition.slice();
				mbuttonUpPositionTemp[e.button] = {x: e.clientX, y: e.clientY};
				setMbuttonUpPosition(mbuttonUpPositionTemp);


				if(e.button === 0 && editor.currentTool.onMouseUp && editor.currentFile.currentLayer.context) 
				{
					editor.currentTool.onMouseUp({setTransformRectActive, setTransformRect, xOffset, yOffset, zoom, editor, px: localMouseX, py: localMouseY, layer: editor.currentFile.currentLayer, viewport: ViewportRef});
				}
			}}

		onWheel={(e)=>
			{
				const viewportRect = ViewportRef.current.getBoundingClientRect();
				const zoomFactor = 1.1;
				const relativeMouseX = (e.clientX - viewportRect.x);
				const relativeMouseY = (e.clientY - viewportRect.y);
				let xOffsetDelta = xOffset - relativeMouseX;
				let yOffsetDelta = yOffset - relativeMouseY;

				if(e.deltaY > 0) 
				{
					setZoom(zoom / zoomFactor);
					xOffsetDelta /= zoomFactor;
					yOffsetDelta /= zoomFactor;
				}
				else if(e.deltaY < 0) 
				{
					setZoom(zoom * zoomFactor);
					xOffsetDelta *= zoomFactor;
					yOffsetDelta *= zoomFactor;
				}
				
				if(zoom > 1000.0) setZoom(1000.0);
				if(zoom < 64 / Math.max(canvasHeight, canvasWidth)) setZoom(64 / Math.max(canvasHeight, canvasWidth));
				setXOffset(relativeMouseX + xOffsetDelta);
				setYOffset(relativeMouseY + yOffsetDelta);
			}}
		>
			<ImageCanvas xOffset={xOffset} yOffset={yOffset} zoom={zoom} file={props.file}></ImageCanvas>
			<FreeTransformUI active={transformRectActive} onTransform={(x,y,w,h)=>{
				setTransformRect({x:x,y:y,w:w,h:h});
				if(editor.currentTool.onRectTransform) editor.currentTool.onRectTransform({x:x,y:y,w:w,h:h});
				}} x={transformRect.x} y={transformRect.y} w={transformRect.w} h={transformRect.h} xOffset={xOffset} yOffset={yOffset} zoom={zoom}></FreeTransformUI>
			
	</div>
	);
}
 
export default Viewport;