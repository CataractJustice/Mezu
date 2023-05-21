import { useContext, useState } from "react";
import DialogPopup from "../../Components/DialogPopup";
import SelectableText from "../../Components/SelectableText";
import ImageFile from "../../ImageFile/ImageFile";
import ImageLayerInternal from "../../ImageLayerInternal/ImageLayerInternal";
import { currentTheme, EditorContext, setTheme, Themes } from "../Editor";
import NewImageDialog from "../NewImageDialog/NewImageDialog";
import "./MenuBar.css";
import MenuBarItem from "./MenuBarItem";
import MenuDropdown from "./MenuDropdown";

function MenuBar() 
{
	const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
	const [theme, setThemeState] = useState(currentTheme);
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
								image.onload = ()=>{
									if(!validImage) return;
									const editorImageFile = new ImageFile(image.width, image.height, fileName);
									const imageLayer = new ImageLayerInternal(editorImageFile);
									imageLayer.context.drawImage(image, 0, 0);
									editorImageFile.layers.push(imageLayer);
									editor.addOpenFile(editorImageFile);
									editor.setCurrentFile(editorImageFile);
									editorImageFile.currentLayer = imageLayer;
								};
							};
							reader.readAsDataURL(e.target.files[0]);
						};
						fileUpload.click();
					}}
					>Open</div>
					<div className="MenuDropdownItem" onClick={()=>{
						const link = document.createElement("a");
						link.download = editor.currentFile.name;
						link.href = editor.currentFile.ComposedCanvas().toDataURL();
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
			<MenuBarItem>
			<MenuDropdown title="View">
				<div className="MenuDropdownItem">
				<MenuDropdown title="Theme">
				{
					Object.keys(Themes).map((key, index) => {
						return <div key={key} className="MenuDropdownItem" onClick={()=>{setTheme(Themes[key])
							setThemeState(Themes[key]);
						}}>
							<SelectableText selected={theme === Themes[key]}>{key}</SelectableText>
						</div>
					})
				}
				</MenuDropdown>
				</div>
			</MenuDropdown>
			</MenuBarItem>
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