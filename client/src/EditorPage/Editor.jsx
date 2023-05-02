import { createContext, useState } from "react";
import ActionList from "../ActionList/ActionList";
import ImageLayerInternal from "../ImageLayerInternal/ImageLayerInternal";
import "./Editor.css";
import FileTabs from "./FileTabs/FileTabs";
import Footer from "./Footer/Footer";
import ImageLayersList from "./Layers/ImageLayersList";
import MenuBar from "./MenuBar/MenuBar";
import ToolGrid from "./ToolGrid/ToolGrid";
import ToolProps from "./ToolProps/ToolProps";

export const EditorContext = createContext();
const actionList = new ActionList();

function Editor() 
{
	const [openFiles, setOpenFiles] = useState([]);
	const [currentFile, setCurrentFile] = useState({});
	const [currentTool, setCurrentTool] = useState({});
	const addOpenFile = (file)=>
	{
		setOpenFiles(openFiles.concat([file]));
	}
	const closeFile = (fileIndex) => 
	{
		const openFilesTemp = openFiles.slice();
		openFilesTemp.splice(fileIndex, 1);
		setOpenFiles(openFilesTemp);
	}
	const addLayerToCurrentImage = () => 
	{
		const openFilesTemp = openFiles.slice();
		openFilesTemp[openFilesTemp.indexOf(currentFile)].layers.push(new ImageLayerInternal(currentFile));
		setOpenFiles(openFilesTemp);
	}
	const setCurrentImageCurrentLayer = (layer) => 
	{
		const openFilesTemp = openFiles.slice();
		openFilesTemp[openFilesTemp.indexOf(currentFile)].currentLayer = layer;
		setOpenFiles(openFilesTemp);
	}
	return (
		<EditorContext.Provider value={{actionList, openFiles, setOpenFiles, currentTool, setCurrentTool, addOpenFile, closeFile, currentFile, setCurrentFile, addLayerToCurrentImage, setCurrentImageCurrentLayer}}>
			<div className="EditorBody">
				<MenuBar></MenuBar>
				<div className="EditorMid">
					<div className="EditorLeftBar">
						<ToolGrid></ToolGrid>
					</div>
					<FileTabs files={openFiles}></FileTabs>
					<div className="EditorRightBar">
						<ToolProps></ToolProps>
						<ImageLayersList></ImageLayersList>
					</div>
				</div>
				<Footer></Footer>
			</div>
		</EditorContext.Provider>
	);
}
 
export default Editor;