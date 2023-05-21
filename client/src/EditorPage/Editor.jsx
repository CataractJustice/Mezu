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

function rgb(r,g,b) 
{
	return [r, g, b];
}

function LerpTheme(ThemeA, ThemeB, lerp) 
{
	const newTheme = {};
	for(let varkey in ThemeA) 
	{
		newTheme[varkey] = [
			parseInt(ThemeA[varkey][0] * (1.0 - lerp) + ThemeB[varkey][0] * lerp),
			parseInt(ThemeA[varkey][1] * (1.0 - lerp) + ThemeB[varkey][1] * lerp),
			parseInt(ThemeA[varkey][2] * (1.0 - lerp) + ThemeB[varkey][2] * lerp),
		];
	}
	console.log(newTheme);
	return newTheme;
}

export const Themes = 
{
	"Light": {
		"--bg-color": rgb(218, 218, 218),
		"--fg-color": rgb(255, 255, 255),
		"--secondary-color": rgb(255, 235, 123),
		"--inset-color": rgb(202, 229, 255),
		"--font-color": rgb(0, 0, 0)
	},
	"Dark": {
		"--bg-color": rgb(32, 34, 36),
		"--fg-color": rgb(48, 54, 61),
		"--secondary-color": rgb(101, 104, 138),
		"--inset-color": rgb(42, 44, 46),
		"--font-color": rgb(240, 242, 244)
	}
}

export let currentTheme = Themes["Dark"];

export function setTheme(theme) 
{
	const root = document.querySelector(':root');

	const stepDelay = 5;
	const step = 0.04;
	let currentLerp = 0.0;

	const lerpStep = () => {
		let lerpfinish = false;
		currentLerp += step;
		if(currentLerp >= 1.0) 
		{
			currentLerp = 1.0;
			lerpfinish = true;
		}

		let lerpedTheme = LerpTheme(currentTheme, theme, currentLerp);

		for(let varkey in lerpedTheme) 
		{
			if(varkey === "--font-color") console.log(`rgb(${theme[varkey][0]}, ${theme[varkey][1]}, ${theme[varkey][2]})`);
			root.style.setProperty(varkey, `rgb(${lerpedTheme[varkey][0]}, ${lerpedTheme[varkey][1]}, ${lerpedTheme[varkey][2]})`);
		}

		if(!lerpfinish) 
		{
			setTimeout(lerpStep, stepDelay);
		}
		else 
		{
			currentTheme = theme;
		}
	}

	lerpStep();
}

function Editor() 
{
	const [openFiles, setOpenFiles] = useState([]);
	const [currentFile, setCurrentFile] = useState({});
	const [currentTool, setCurrentToolState] = useState({});
	const [primaryColor, setPrimaryColor] = useState([0,0,0,255]);
	const [secondaryColor, setSecondaryColor] = useState([255,255,255,255]);

	const REACTPLEASE = useREACTToStateUpdatePlease();

	const setCurrentTool = (tool) => 
	{
		if(currentTool.setSelected) currentTool.setSelected(false);
		setCurrentToolState(tool);
		if(tool.setSelected) tool.setSelected(true);
	}

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
		<EditorContext.Provider value={{REACTPLEASE, swapToolColors, primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor, actionList, openFiles, setOpenFiles, currentTool, setCurrentTool, setCurrentToolState, addOpenFile, closeFile, currentFile, setCurrentFile, addLayerToCurrentImage, setCurrentImageCurrentLayer}}>
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