import { useContext } from "react";
import { EditorContext } from "../Editor";
import "./ImageLayer.css";

function ImageLayer(props) 
{
	const editor = useContext(EditorContext);
	const previewImage = props.layer.canvas.toDataURL();
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
			<input className="ImageLayerTitleInput" type="text" value={props.layer.title} onChange={()=>{/*silence error*/}}></input>
			<div className="ImageLayerOptions">
				<div className="ImageLayerOptionButton">H</div>
				<div className="ImageLayerOptionButton">D</div>
				<div className="ImageLayerOptionButton">M</div>
			</div>
		</div>
	);
}
 
export default ImageLayer;