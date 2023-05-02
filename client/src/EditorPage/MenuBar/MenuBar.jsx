import { useContext, useState } from "react";
import DialogPopup from "../../Components/DialogPopup";
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
					<div className="MenuDropdownItem">Open</div>
					<div className="MenuDropdownItem">Save as</div>
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