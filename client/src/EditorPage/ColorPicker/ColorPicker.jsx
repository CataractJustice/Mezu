import { useState } from "react";
import { useContext } from "react";
import DialogPopup from "../../Components/DialogPopup";
import ChooseColorDialog from "../ChooseColorDialog/ChooseColorDialog";
import { EditorContext } from "../Editor";

export default function ColorPicker(props) 
{
	const editor = useContext(EditorContext);
	const [dialogOpen, setDialogOpen] = useState(false);
	
	return (<><div className="ColorPickerContainer TitledFrame">
		<div className="TitledFrameTitle">Color</div>
		<div className="ColorPreviews" onClick={()=>{
			setDialogOpen(true)
		}}>
			<div className="ColorPickerPrimaryColor" style={{
				backgroundColor: `rgba(${editor.primaryColor[0]}, ${editor.primaryColor[1]}, ${editor.primaryColor[2]}, ${editor.primaryColor[3]/255})`
			}}>
				P
			</div>
			<div className="ColorPickerSecondaryColor" style={{
				backgroundColor: `rgba(${editor.secondaryColor[0]}, ${editor.secondaryColor[1]}, ${editor.secondaryColor[2]}, ${editor.secondaryColor[3]/255})`
			}}>
				S
			</div>
		</div>
		<div className="ColorPickerSwapColorsButton">
			W
		</div>
	</div>
	
	<DialogPopup open={dialogOpen} onClose={()=>{setDialogOpen(false)}}>
	<ChooseColorDialog onClose={(color)=>{
		console.log(color);
		setDialogOpen(false);
		editor.setPrimaryColor(color);
	}}></ChooseColorDialog>
	</DialogPopup></>);
}