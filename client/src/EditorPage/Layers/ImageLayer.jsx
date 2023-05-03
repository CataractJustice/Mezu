import { useState } from "react";
import { useContext } from "react";
import { EditorContext } from "../Editor";
import "./ImageLayer.css";

function ImageLayer(props) 
{
	const editor = useContext(EditorContext);
	const previewImage = props.layer.canvas.toDataURL();
	const [hidden, setHidden] = useState(props.layer.hidden);
	const [title, settitle] = useState(props.layer.title);
	const aspectW = props.layer.canvas.width > props.layer.canvas.height ? 1.0 : props.layer.canvas.width / props.layer.canvas.height;
	const aspectH = props.layer.canvas.height > props.layer.canvas.width ? 1.0 : props.layer.canvas.height / props.layer.canvas.width;
	return (
		<div className="ImageLayer" style={
			{backgroundColor: editor.currentFile.currentLayer === props.layer ? 'var(--inset-color)' : ""}
		}
		onClick={()=>{
			editor.setCurrentImageCurrentLayer(props.layer);
		}}
		>
			<div className="ImageLayerPreviewContainer">
				<img className="ImageLayerPreviewImage" src={previewImage} style={{
					width: `${aspectW*100}%`,
					height: `${aspectH*100}%`
				}} alt={""}></img>
			</div>
			<input className="ImageLayerTitleInput" type="text" value={title} onChange={(e)=>{
				settitle(e.target.value);
				props.layer.title = e.target.value;
			}}></input>
			<div className="ImageLayerOptions">
				<div className="ImageLayerOptionButton" onClick={()=>{
					setHidden(!props.layer.hidden);
					props.layer.setHidden(!props.layer.hidden);
				}}>{hidden ? "H" : "h"}</div>
				<div className="ImageLayerOptionButton">D</div>
				<div className="ImageLayerOptionButton">M</div>
			</div>
		</div>
	);
}
 
export default ImageLayer;