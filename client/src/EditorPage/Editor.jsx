import { createContext, useState } from "react";
import ActionList from "../ActionList/ActionList";
import ImageLayerInternal from "../ImageLayerInternal/ImageLayerInternal";
import ColorPicker from "./ColorPicker/ColorPicker";
import "./Editor.css";
import FileTabs from "./FileTabs/FileTabs";
import Footer from "./Footer/Footer";
import ImageLayersList from "./Layers/ImageLayersList";
import MenuBar from "./MenuBar/MenuBar";
import ToolGrid from "./ToolGrid/ToolGrid";
import ToolProps from "./ToolProps/ToolProps";

export const EditorContext = createContext();
const actionList = new ActionList();

function useREACTToStateUpdatePlease(){
	// eslint-disable-next-line
    const [value, setValue] = useState(0);
    return () => setValue(value => value + 1);
}

function Editor() 
{
	const [openFiles, setOpenFiles] = useState([]);
	const [currentFile, setCurrentFile] = useState({});
	const [currentTool, setCurrentTool] = useState({});
	const [primaryColor, setPrimaryColor] = useState([0,0,0,255]);
	const [secondaryColor, setSecondaryColor] = useState([255,255,255,255]);

	const REACTPLEASE = useREACTToStateUpdatePlease();

	const swapToolColors = () => 
	{
		const primaryTemp = primaryColor;
		setPrimaryColor(secondaryColor);
		setSecondaryColor(primaryTemp);
	};

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
		<EditorContext.Provider value={{REACTPLEASE, swapToolColors, primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor, actionList, openFiles, setOpenFiles, currentTool, setCurrentTool, addOpenFile, closeFile, currentFile, setCurrentFile, addLayerToCurrentImage, setCurrentImageCurrentLayer}}>
			<div className="EditorBody">
				<MenuBar></MenuBar>
				<div className="EditorMid">
					<div className="EditorLeftBar">
						<ToolGrid></ToolGrid>
						<ColorPicker></ColorPicker>
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