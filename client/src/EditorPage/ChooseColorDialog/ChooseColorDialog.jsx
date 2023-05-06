import { useState } from "react";
import "./ChooseColorDialog.css";

function ChooseColorDialog(props) 
{
	const [color, setColor] = useState([255, 255, 255, 1]);

	return (
		<div className="ChooseColorDialog">
			<div className="ColorPreviewTransparentBg">

			<div className="ColorPreview" style={{
				backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]/255})`
			}
			}
			onClick={()=>{
				const colorInput = document.createElement("input");
				colorInput.type = "color";
				colorInput.onchange=(e)=>{
					const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e.target.value);

					const R = parseInt(hex[1], 16);
					const G = parseInt(hex[2], 16);
					const B = parseInt(hex[3], 16);
					setColor([R,G,B,color[3]]);
				};
				colorInput.click();
			}}>

			</div>
			</div>
			<div className="ColorProperiesContainer">
				<input type="range" min={0} max={255} step={1} onChange={(e)=>{
					setColor([color[0], color[1], color[2], e.target.value]);
				}}></input>
				<button onClick={()=>{props.onClose(color)}}></button>
			</div>
		</div>
	);
}
 
export default ChooseColorDialog;