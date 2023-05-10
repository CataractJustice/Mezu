import { useContext } from "react";
import { EditorContext } from "../Editor";
import Viewport from "../Viewport/Viewport";
import FileTab from "./FileTab";
import "./FileTabs.css";

function FileTabs(props) 
{
	const editor = useContext(EditorContext);
	return (
		<div className="FileTabs">
			<div className="TabTitles">
			{
				props.files.map((file, index) => 
				{
					return <FileTab key={index} file={file} active={editor.currentFile.uuid===file.uuid} onClick={()=>{editor.setCurrentFile(file)}} onClose={
						()=>{
							editor.closeFile(index);
						}
					}></FileTab>
				})
			}
			</div>
			<div className="TabViewports">
				{
					props.files.map((file, index) => 
					{
						return <Viewport key={index} file={file} active={editor.currentFile.uuid===file.uuid}></Viewport>
					})
				}
			</div>
		</div>
	);
}
 
export default FileTabs;