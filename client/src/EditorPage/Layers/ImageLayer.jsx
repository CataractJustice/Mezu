import { useState } from "react";
import { createRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import SelectableText from "../../Components/SelectableText";
import { BlendModes } from "../../ImageLayerInternal/ImageLayerInternal";
import { EditorContext } from "../Editor";
import MenuDropdown from "../MenuBar/MenuDropdown";
import "./ImageLayer.css";

function ImageLayer(props) 
{
	//actual displayerd max edge length of preview image is defined in style
	//here is defined the resolution of the preview canvas
	//we do a bit more pixels than is actually displayed for antialiasing
	const previewWidthPx = 256;
	const editor = useContext(EditorContext);
	const [hidden, setHidden] = useState(props.layer.hidden);
	const [title, setTitle] = useState(props.layer.title);
	const aspectW = props.layer.canvas.width > props.layer.canvas.height ? 1.0 : props.layer.canvas.width / props.layer.canvas.height;
	const aspectH = props.layer.canvas.height > props.layer.canvas.width ? 1.0 : props.layer.canvas.height / props.layer.canvas.width;
	const canvasRef = createRef();

	useEffect(()=>{
		if(canvasRef.current) 
		{
			const ctx = canvasRef.current.getContext("2d");
			ctx.clearRect(0,0, aspectW * previewWidthPx, aspectH * previewWidthPx);
			ctx.drawImage(props.layer.canvas, 0, 0, aspectW * previewWidthPx, aspectH * previewWidthPx);
		}
	});

	return (
		<div className="ImageLayer" style={
			{backgroundColor: editor.currentFile.currentLayer === props.layer ? 'var(--inset-color)' : ""}
		}
		onClick={()=>{
			editor.setCurrentImageCurrentLayer(props.layer);
		}}
		>
			<div className="ImageLayerMoveContainer">
				<div className="ImageLayerMoveButton" onClick={()=>{editor.moveLayerUp(props.layer);}}>
				⇑
				</div>
				<div className="ImageLayerMoveButton" onClick={()=>{editor.moveLayerDown(props.layer);}}>
				⇓
				</div>
			</div>
			<div className="ImageLayerPreviewContainer">
				<canvas className="ImageLayerPreviewImage" ref={canvasRef} style={{
					width: `${aspectW*100}%`,
					height: `${aspectH*100}%`
				}} 
				width={parseInt(previewWidthPx * aspectW)}
				height={parseInt(previewWidthPx * aspectH)} alt={""}></canvas>
			</div>
			<div className="ImageLayerMiddleLayout">
				<input className="ImageLayerTitleInput" type="text" value={title} onChange={(e)=>{
					setTitle(e.target.value);
					props.layer.title = e.target.value;
				}}></input>
				<MenuDropdown title="Blend mode">
					{
						Object.keys(BlendModes).map((key, index) => {
							const blendTitle = key;
							
							return (
								<div className="MenuDropdownItem" onClick={()=>{
									props.layer.setBlendMode(BlendModes[key]);
								}} key={key}><SelectableText selected={props.layer.blendMode===key}>{blendTitle}</SelectableText></div>
							);
						})
					}
				</MenuDropdown>
			</div>
			<div className="ImageLayerOptions">
				<div className="ImageLayerOptionButton" onClick={()=>{
					setHidden(!props.layer.hidden);
					props.layer.setHidden(!props.layer.hidden);
				}}>{hidden ? "H" : "h"}</div>
				<div className="ImageLayerOptionButton" onClick={()=>{
					editor.deleteLayer(props.layer);
				}}>D</div>
				{/*<div className="ImageLayerOptionButton">M</div>*/}
			</div>
		</div>
	);
}
 
export default ImageLayer;