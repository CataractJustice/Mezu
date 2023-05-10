import { createRef } from "react";
import "./ChooseColorDialog.css";

function ChooseColorDialog(props) 
{
	let colorVal = [props.color[0], props.color[1], props.color[2], props.color[3]];
	const previewRef = createRef();

	return (
		<div className="ChooseColorDialog">
			<div className="ColorPreviewTransparentBg">

			<div className="ColorPreview" ref={previewRef} style={{
				backgroundColor: `rgba(${props.color[0]}, ${props.color[1]}, ${props.color[2]}, ${props.color[3]/255})`
			}
			}
			onClick={()=>{
				const colorInput = document.createElement("input");
				colorInput.type = "color";
				colorInput.value = `rgba(${props.color[0]}, ${props.color[1]}, ${props.color[2]}, ${props.color[3]/255})`;
				colorInput.onchange=(e)=>{
					const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e.target.value);

					const R = parseInt(hex[1], 16);
					const G = parseInt(hex[2], 16);
					const B = parseInt(hex[3], 16);
					colorVal = [R,G,B, colorVal[3]];
					if(previewRef.current) previewRef.current.style.backgroundColor = `rgba(${colorVal[0]}, ${colorVal[1]}, ${colorVal[2]}, ${colorVal[3]/255})`;
				};
				colorInput.click();
			}}>

			</div>
			</div>
			<div className="ColorProperiesContainer">
				<input type="range" min={0} max={255} step={1} onChange={(e)=>{
					colorVal = ([colorVal[0], colorVal[1], colorVal[2], parseInt(e.target.value)]);
					if(previewRef.current) previewRef.current.style.backgroundColor = `rgba(${colorVal[0]}, ${colorVal[1]}, ${colorVal[2]}, ${colorVal[3]/255})`;
				}}></input>
				<button onClick={()=>{props.onClose(colorVal)}}>Ok</button>
			</div>
		</div>
	);
}
 
export default ChooseColorDialog;