import { useContext } from "react";
import "../../Components/TitledFrame.css";
import { EditorContext } from "../Editor";
import ImageLayer from "./ImageLayer";
import "./ImageLayersList.css";

function ImageLayersList() 
{
	const editor = useContext(EditorContext);
	return (
		<div className="ImageLayersList TitledFrame">
			<div className="TitledFrameTitle">Layers</div>
			<div className="ImageLayersListScrolledContainer">
				{
					editor.currentFile.layers ? editor.currentFile.layers.map((layer, index)=>{
						return <ImageLayer key={index} layer={layer}></ImageLayer>
					}) : <></>
				}
			</div>
			<div className="AddLayerButton" title="Add layer" onClick={editor.addLayerToCurrentImage}>+</div>
		</div>
	);
}
 
export default ImageLayersList;