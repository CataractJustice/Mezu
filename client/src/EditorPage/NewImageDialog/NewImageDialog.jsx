import { useContext, useState } from "react";
import ImageFile from "../../ImageFile/ImageFile";
import ImageLayerInternal from "../../ImageLayerInternal/ImageLayerInternal";
import { EditorContext } from "../Editor";
import "./NewImageDialog.css";

function NewImageDialog(props) 
{
	const [imageWidth, setImageWidth] = useState(640);
	const [imageHeight, setImageHeight] = useState(480);
	const [imageColor, setImageColor] = useState('#ffffff');
	const editor = useContext(EditorContext);
	let previewWidth;
	let previewHeight;
	
	if(imageWidth > imageHeight) 
	{
		previewWidth = 1.0;
		previewHeight = imageHeight / imageWidth;
	}
	else 
	{
		previewHeight = 1.0;
		previewWidth = imageWidth / imageHeight;
	}

	return (
		<div className="NewImageDialog">
			<div className="NewImagePreviewContainer">
				<div className="NewImagePreview"
				style={{
					width: `${previewWidth*100}%`,
					height: `${previewHeight*100}%`,
					backgroundColor: imageColor
				}}
				>

				</div>
			</div>
			<div className="NewImagePropertiesContainer">
				<div className="NewImageDimension">
					<div>Width </div>
					<input type="number" value={imageWidth} min={1} max={15000}
					onChange={(e)=>
						{
							setImageWidth(parseInt(e.target.value));
						}}
					></input>
				</div>
				<div className="NewImageDimension">
					<div>Height </div>
					<input type="number" value={imageHeight} min={1} max={15000}
					onChange={(e)=>
						{
							setImageHeight(parseInt(e.target.value));
						}}
					></input>
				</div>
				<div className="NewImageColor">
					<div>Color</div>
					<input type="color" value={imageColor}
					onChange={(e)=>
						{
							setImageColor(e.target.value);
						}}
					></input>
				</div>
				<button onClick={()=>{
					props.onClose();
					const newImage = new ImageFile(imageWidth, imageHeight, "New image");
					const defaultLayer = new ImageLayerInternal(newImage);
					defaultLayer.title = "Default";
					defaultLayer.context.fillStyle = imageColor;
					defaultLayer.context.fillRect(0, 0, imageWidth, imageHeight);
					newImage.layers.push(defaultLayer);
					editor.addOpenFile(newImage);

				}}>Create</button>
			</div>
		</div>
	);
}
 
export default NewImageDialog;