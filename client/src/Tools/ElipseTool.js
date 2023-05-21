import { useState } from "react";
import ContextModifyAction from "../ActionList/ContextModifyAction";
import SelectableText from "../Components/SelectableText";
import MenuDropdown from "../EditorPage/MenuBar/MenuDropdown";
import RectTransformTool from "./RectTransformTool";

function PropsComponent(props) 
{
	const [fill, setFill] = useState(false);
	const [lineWidth, setLineWidth] = useState(1);
	const lineJoins = ["bevel", "round", "miter"];
	/*
	const [rectX, setRectX] = useState(props.tool.currentRect.x);
	const [rectY, setRectY] = useState(props.tool.currentRect.y);
	const [rectW, setRectW] = useState(props.tool.currentRect.w);
	const [rectH, setRectH] = useState(props.tool.currentRect.h);
	
	props.tool.setRectXPropsState = setRectX;
	props.tool.setRectYPropsState = setRectY;
	props.tool.setRectWPropsState = setRectW;
	props.tool.setRectHPropsState = setRectH;
	*/

	return (<>
	<div className="RectField TitledFrame">
			<div className="TitledFrameTitle">Line width</div>
			<input type="range" value={lineWidth} min={1} max={128} step={1} onChange={(e)=>{
			setLineWidth(parseInt(e.target.value));
			props.tool.lineWidth = parseInt(e.target.value);
			}}></input><div>{`${lineWidth}px`}</div>
	</div>
	<div className="RectField TitledFrame">
			<div className="TitledFrameTitle">Fill</div>
			<input type={"checkbox"} value={fill} onChange={(e)=>{
			setFill(e.target.value);
			props.tool.fill = e.target.value;
			}}></input>
	</div>

	<div className="RectField TitledFrame">
			<div className="TitledFrameTitle">Line join</div>
			<MenuDropdown title="Blend mode">
					{
						lineJoins.map((lineJoin, index) => {
							
							return (
								<div className="MenuDropdownItem" onClick={()=>{
									props.tool.lineJoin = lineJoin;
								}} key={lineJoin}><SelectableText selected={props.tool.lineJoin===lineJoin}>{lineJoin}</SelectableText></div>
							);
						})
					}
			</MenuDropdown>
	</div>

	
	{/*
	props.tool.rectActive ? <>
	<input type={"number"} value={rectX} onChange={(e)=>{
		setRectX(parseInt(e.target.value));
		props.tool.currentRect.x = parseInt(e.target.value);
		props.tool.setCurrentRect({x: parseInt(e.target.value), y: rectY, w: rectW, h: rectH});
	}}></input>

	<input type={"number"} value={rectY} onChange={(e)=>{
		setRectY(parseInt(e.target.value));
		props.tool.currentRect.y = parseInt(e.target.value);
		props.tool.setCurrentRect({x: rectX, y: parseInt(e.target.value), w: rectW, h: rectH});
	}}></input>

	<input type={"number"} value={rectW} onChange={(e)=>{
		setRectW(parseInt(e.target.value));
		props.tool.currentRect.w = parseInt(e.target.value);
		props.tool.setCurrentRect({x: rectX, y: rectY, w: parseInt(e.target.value), h: rectH});
	}}></input>

	<input type={"number"} value={rectH} onChange={(e)=>{
		setRectH(parseInt(e.target.value));
		props.tool.currentRect.h = parseInt(e.target.value);
		props.tool.setCurrentRect({x: rectX, y: rectY, w: rectW, h: parseInt(e.target.value)});
	}}></input>
	</> : <></>
*/}
	</>);
}

export default class ElipseTool 
{
	currentRect;
	currentLayer;
	currentEditor;
	rectActive;
	active;
	stroke;
	fill;
	before;
	after;
	lineWidth;
	lineJoin;
	
	constructor(args) 
	{
		this.currentRect = {x: 0, y: 0, w: 0, h: 0};
		this.rectActive = false;
		this.active = false;
		this.toolName = "Elipse";
		this.PropsComponent = PropsComponent;
		this.fill = false;
		this.lineWidth = 1;
		this.lineJoin = "miter";
	}

	onMouseDown(args) 
	{
		this.applyBuffer();
		this.active = true;
		this.rectActive = true;
		const offset = 1;
		this.currentRect = {x: parseInt(args.px) + offset, y: parseInt(args.py) + offset, w: 0, h: 0};
		this.currentLayer = args.layer;
		this.currentEditor = args.editor;
	}

	onMouseMove(args) 
	{
		if(!this.active) return;

		this.currentRect.w = parseInt(args.px) - this.currentRect.x;
		this.currentRect.h = parseInt(args.py) - this.currentRect.y;
		//this.currentRect.w += (this.currentRect.w) >= 0 ? 1 : 1;
		//this.currentRect.h += (this.currentRect.h) >= 0 ? 1 : 1;

		if(this.setRectXPropsState) 
		{
			this.setRectXPropsState(this.currentRect.x);
			this.setRectYPropsState(this.currentRect.y);
			this.setRectWPropsState(this.currentRect.w);
			this.setRectHPropsState(this.currentRect.h);
		}

		this.setCurrentRect(this.currentRect);
		args.setTransformRect({
			x: this.currentRect.w >= 0 ? this.currentRect.x : this.currentRect.x + this.currentRect.w,
			y: this.currentRect.h >= 0 ? this.currentRect.y : this.currentRect.y + this.currentRect.h,
			w: Math.abs(this.currentRect.w),
			h: Math.abs(this.currentRect.h)
		});
	}

	setCurrentRect(rect) 
	{
		
		this.currentLayer.bufferContext.lineWidth = this.lineWidth;
		this.currentLayer.bufferContext.lineJoin = this.lineJoin;
		this.currentRect = rect;

		this.currentLayer.bufferContext.clearRect(0, 0, this.currentLayer.canvas.width, this.currentLayer.canvas.height);

		this.currentLayer.bufferContext.beginPath();
		this.currentLayer.bufferContext.moveTo(this.currentRect.x + (Math.sin(0) + 1) * this.currentRect.w / 2, this.currentRect.y + (Math.cos(0) + 1) * this.currentRect.h / 2);

		for(let i = 0; i < Math.PI*2; i += Math.PI / 256) 
		{
			this.currentLayer.bufferContext.lineTo(this.currentRect.x + (Math.sin(i) + 1) * this.currentRect.w / 2, this.currentRect.y + (Math.cos(i) + 1) * this.currentRect.h / 2);
		} 
		this.currentLayer.bufferContext.closePath();
		if(this.fill) 
		{
			this.currentLayer.bufferContext.fillStyle = `rgba(${this.currentEditor.secondaryColor[0]},${this.currentEditor.secondaryColor[1]},${this.currentEditor.secondaryColor[2]},${this.currentEditor.secondaryColor[3]/255})`;
			this.currentLayer.bufferContext.fill();
		}

		this.currentLayer.bufferContext.strokeStyle = `rgba(${this.currentEditor.primaryColor[0]},${this.currentEditor.primaryColor[1]},${this.currentEditor.primaryColor[2]},${this.currentEditor.primaryColor[3]/255})`;
		this.currentLayer.bufferContext.stroke();
	}
	
	onMouseUp() 
	{
		this.active = false;
		this.currentEditor.setCurrentTool(new RectTransformTool({onTransform: (rect)=>{this.setCurrentRect(rect);}}));
	}

	applyBuffer() 
	{
		this.rectActive = false;
		if(this.currentRect.w === 0 || this.currentRect.h === 0) return;
		const padding = 2 + this.lineWidth;
		const normalRect = {
			x: this.currentRect.w >= 0 ? this.currentRect.x : this.currentRect.x + this.currentRect.w,
			y: this.currentRect.h >= 0 ? this.currentRect.y : this.currentRect.y + this.currentRect.h,
			w: Math.abs(this.currentRect.w),
			h: Math.abs(this.currentRect.h)
		};
		this.before = this.currentLayer.context.getImageData(normalRect.x - padding, normalRect.y - padding, normalRect.w + padding * 2, normalRect.h + padding * 2);
		this.currentLayer.context.drawImage(this.currentLayer.bufferCanvas, 0, 0);
		this.after = this.currentLayer.context.getImageData(normalRect.x - padding, normalRect.y - padding, normalRect.w + padding * 2, normalRect.h + padding * 2);
		this.currentLayer.bufferContext.clearRect(0, 0,this.currentLayer.canvas.width, this.currentLayer.canvas.height);
		this.currentEditor.actionList.push(new ContextModifyAction({context: this.currentLayer.context, before: this.before, after: this.after, x: normalRect.x - padding, y: normalRect.y - padding}));
	}

	setSelected(selected) 
	{
		//if(!selected) this.applyBuffer();
	}
}