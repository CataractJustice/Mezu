import { useContext, useState } from "react";
import DialogPopup from "../../Components/DialogPopup";
import ImageFile from "../../ImageFile/ImageFile";
import ImageLayerInternal from "../../ImageLayerInternal/ImageLayerInternal";
import { EditorContext } from "../Editor";
import NewImageDialog from "../NewImageDialog/NewImageDialog";
import "./MenuBar.css";
import MenuBarItem from "./MenuBarItem";
import MenuDropdown from "./MenuDropdown";

function MenuBar() 
{
	const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
	const editor = useContext(EditorContext);
	return (
		<>
		<div className="MenuBar">
			<MenuBarItem>
				<MenuDropdown title="File">
					<div className="MenuDropdownItem"
					onClick={()=>{setNewFileDialogOpen(true)}}
					>New</div>
					<div className="MenuDropdownItem"
					onClick={()=>{
						const fileUpload = document.createElement("input");
						fileUpload.type = "file";
						fileUpload.accept = "image/*";
						fileUpload.onchange = (e) => 
						{
							const reader = new FileReader();
							const fileName = e.target.files[0].name;
							reader.onload = (e) => 
							{
								let validImage = true;
								const image = new Image();
								image.src = e.target.result;
								image.onerror = ()=>
								{
									validImage = false;
								}
								setTimeout(()=>{
									if(!validImage) return;
									const editorImageFile = new ImageFile(image.width, image.height, fileName);
									const imageLayer = new ImageLayerInternal(editorImageFile);
									imageLayer.context.drawImage(image, 0, 0);
									editorImageFile.layers.push(imageLayer);
									editor.addOpenFile(editorImageFile);
								}, 100);
							};
							reader.readAsDataURL(e.target.files[0]);
						};
						fileUpload.click();
					}}
					>Open</div>
					<div className="MenuDropdownItem" onClick={()=>{
						const layers = editor.currentFile.layers;
						const mergeCanvas = document.createElement("canvas");
						mergeCanvas.width = editor.currentFile.width;
						mergeCanvas.height = editor.currentFile.height;
						const mergeContext = mergeCanvas.getContext("2d");
						for(const layer of layers) 
						{
							mergeContext.drawImage(layer.canvas, 0, 0);
						}

						const link = document.createElement("a");
						link.download = editor.currentFile.name;
						link.href = mergeCanvas.toDataURL();
						link.click();
					}}>
						Save
					</div>
					<div className="MenuDropdownItem"
					onClick={()=>{editor.actionList.undo()}}
					>Undo</div>
					<div className="MenuDropdownItem"
					onClick={()=>{editor.actionList.redo()}}
					>Redo</div>
				</MenuDropdown>
			</MenuBarItem>
			<MenuBarItem>View</MenuBarItem>
			<MenuBarItem>Image</MenuBarItem>
		</div>

		<DialogPopup
		onClose={()=>{setNewFileDialogOpen(false)}}
		open={newFileDialogOpen}
		>
			<NewImageDialog onClose={()=>{setNewFileDialogOpen(false)}}></NewImageDialog>
		</DialogPopup>
		</>
	);
}
 
export default MenuBar;