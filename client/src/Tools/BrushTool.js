import { useState } from "react";
import ContextModifyAction from "../ActionList/ContextModifyAction";
import BrushGenerator from "./BrushGenerator";
import BrushMaskDisplay from "./BrushMaskPreview";
import BrushOutline from "./BrushOutline";
import "./BrushTool.css";

const brushMaxSteps = 128;

function BrushFalloffSelect(props) 
{
	return <div className="BrushFalloffSelect" onClick={()=>{
		props.setFalloffFunction({fn: props.falloffFunction});
	}}
	style={
		{
			backgroundColor: props.currentFalloffFunction.fn === props.falloffFunction ? "var(--inset-color)" : ""
		}
	}>
		{props.children}
	</div>
}

function BrushShapeSelect(props) 
{
	return <div className="BrushShapeSelect" onClick={()=>{
		props.setShapeFunction({fn: props.shapeFunction});
	}}
	style={
		{
			backgroundColor: props.currentShapeFunction.fn === props.shapeFunction ? "var(--inset-color)" : ""
		}
	}>
		{props.children}
	</div>
}

function PropsComponent(props) 
{
	const [size, setSize] = useState(8);
	const [falloff, setFalloff] = useState(8);
	const [minStep, setMinStep] = useState(1);
	const [falloffFunction, setFalloffFunction] = useState({fn: BrushGenerator.Quadratic});
	const [shapeFunction, setShapeFunction] = useState({fn: BrushGenerator.CircleSDF});
	props.tool.setMask(BrushGenerator.GenerateBySDF(size+falloff, size+falloff, size, falloff, shapeFunction.fn, falloffFunction.fn));
	props.tool.brushStep = minStep;
	
	return <div className="CurrentBrushProps">
		<div className="CurrentBrushPreview">
			<BrushMaskDisplay mask={props.tool.brushMask}></BrushMaskDisplay>
		</div>
		<div className="BrushRange TitledFrame">
			<div className="TitledFrameTitle">Brush size</div>
			<input type="range" value={size} min={1} max={128} step={1} onChange={(e)=>{
			setSize(parseInt(e.target.value));
			}}></input><div>{`${size}px`}</div>
		</div>
		<div className="BrushRange TitledFrame">
			<div className="TitledFrameTitle">Brush falloff</div>
			<input type="range" value={falloff} min={0} max={128} step={1} onChange={(e)=>{
			setFalloff(parseInt(e.target.value));
			}}></input><div>{`${falloff}px`}</div>
		</div>
		<div className="BrushRange TitledFrame">
			<div className="TitledFrameTitle">Brush minimum step</div>
			<input type="range" value={minStep} min={1} max={128} step={1} onChange={(e)=>{
			setMinStep(parseInt(e.target.value));
			}}></input><div>{`${minStep}px`}</div>
		</div>
		<div className="BrushShapeSelectContainer TitledFrame">
			<div className="TitledFrameTitle">Brush shape</div>
			<BrushShapeSelect currentShapeFunction={shapeFunction} setShapeFunction={setShapeFunction} shapeFunction={BrushGenerator.CircleSDF}>⃝</BrushShapeSelect>
			<BrushShapeSelect currentShapeFunction={shapeFunction} setShapeFunction={setShapeFunction} shapeFunction={BrushGenerator.SquareSDF}>□</BrushShapeSelect>
		</div>
		<div className="BrushFalloffSelectContainer TitledFrame">
			<div className="TitledFrameTitle">Brush falloff</div>
			<BrushFalloffSelect currentFalloffFunction={falloffFunction} setFalloffFunction={setFalloffFunction} falloffFunction={BrushGenerator.Linear}>L</BrushFalloffSelect>
			<BrushFalloffSelect currentFalloffFunction={falloffFunction} setFalloffFunction={setFalloffFunction} falloffFunction={BrushGenerator.Quadratic}>Q</BrushFalloffSelect>
			<BrushFalloffSelect currentFalloffFunction={falloffFunction} setFalloffFunction={setFalloffFunction} falloffFunction={BrushGenerator.Root}>R</BrushFalloffSelect>
		</div>
	</div>;
}

export default class BrushTool 
{
	toolName;
	imageDataBefore;
	imageDataAfter;
	editBoundingBox;
	brushDrawnAlphaMask;
	brushMask;
	brushOutline;
	brushOutlineDOM;
	brushOutlineDOMImage;
	brushStep;
	colorFunction;
	blendFunction;
	active;
	lastX;
	lastY;
	cbx;
	cby;
	smooth;
	lastMPX;
	lastMPY;
	constructor(args) 
	{
		console.log("????????");
		this.active = false;
		this.brushStep = 1;
		this.toolName = args.title;
		this.colorFunction = args.colorFunction;
		this.blendFunction = args.blendFunction;
		this.PropsComponent = PropsComponent;
		this.smooth = 0;
		this.brushOutlineDOM = document.createElement("div");
		this.brushOutlineDOMImage = document.createElement("canvas");
		console.log(this.brushOutlineDOMImage);
		this.brushOutlineDOMImage.style.width = "100%";
		this.brushOutlineDOMImage.style.height = "100%";
		this.brushOutlineDOM.append(this.brushOutlineDOMImage);
		this.brushOutlineDOM.style.position = "absolute";
		this.setMask(BrushGenerator.GenerateBySDF(32,32,16,16,BrushGenerator.SquareSDF, BrushGenerator.Quadratic));
	}

	onMouseDown(args) 
	{
		if(this.active) 
		{
			this.onMouseUp(args);
		}
		this.brushDrawnAlphaMask = new Uint8ClampedArray(args.layer.canvas.width * args.layer.canvas.height);
		const bx = parseInt(args.px) - parseInt(this.brushMask.width/2);
		const by = parseInt(args.py) - parseInt(this.brushMask.height/2);
		this.editBoundingBox = {
			minX: bx,
			minY: by,
			maxX: bx + parseInt(this.brushMask.width),
			maxY: by + parseInt(this.brushMask.height)
		}
		this.imageDataBefore = args.layer.context.getImageData(0, 0, args.layer.canvas.width, args.layer.canvas.height);
		this.active = true;
		this.cbx = bx;
		this.cby = by;
		this.lastX = bx;
		this.lastY = by;
		this.brushDraw(args, bx, by);
	}

	onMouseMove(args) 
	{
		this.lastMPX = args.px;
		this.lastMPY = args.py;
		this.update(args);
		if(!this.active) return;		const bx = parseInt(args.px) - parseInt(this.brushMask.width/2);
		const by = parseInt(args.py) - parseInt(this.brushMask.height/2);
		if(Math.sqrt((this.lastX - bx) * (this.lastX - bx) + (this.lastY - by) * (this.lastY - by)) < this.brushStep) return; 
		this.editBoundingBox = {
			minX: Math.min(bx, this.editBoundingBox.minX),
			minY: Math.min(by, this.editBoundingBox.minY),
			maxX: Math.max(bx + this.brushMask.width, this.editBoundingBox.maxX),
			maxY: Math.max(by + this.brushMask.height, this.editBoundingBox.maxY)
		}

		this.cbx = bx * (1.0 - this.smooth) + this.cbx * (this.smooth);
		this.cby = by * (1.0 - this.smooth) + this.cby * (this.smooth);
		//
		this.drawTo(args, this.cbx, this.cby);
		this.lastX = this.cbx;
		this.lastY = this.cby;
	}

	onMouseUp(args) 
	{
		this.active = false;

		const rectX = this.editBoundingBox.minX;
		const rectY = this.editBoundingBox.minY
		const rectW = this.editBoundingBox.maxX - this.editBoundingBox.minX + 1;
		const rectH = this.editBoundingBox.maxY - this.editBoundingBox.minY + 1;

		//get state of image before edit in edited section
		const tempImageData = args.layer.context.getImageData(rectX, rectY, rectW, rectH);
		args.layer.context.putImageData(this.imageDataBefore, 0, 0);
		this.imageDataBefore = args.layer.context.getImageData(rectX, rectY, rectW, rectH);
		args.layer.context.putImageData(tempImageData, rectX, rectY);
		this.imageDataAfter = args.layer.context.getImageData(rectX, rectY, rectW, rectH);

		args.editor.actionList.push(new ContextModifyAction({context: args.layer.context, x: rectX, y: rectY, before: this.imageDataBefore, after: this.imageDataAfter}));
	}

	drawTo(args, bx, by) 
	{
		const dx = bx - this.lastX;
		const dy = by - this.lastY;
		const length = Math.sqrt(dx*dx+dy*dy);
		if(!length) return;
		const steps = length / this.brushStep;
		const adjustedMaxSteps = brushMaxSteps / (1.0 + (this.brushMask.width * this.brushMask.height) / 500.0)
		const stepLength = (steps > adjustedMaxSteps) ? (length / adjustedMaxSteps) : (this.brushStep);
		let drawnOnce = false;
		for(let i = stepLength; i <= length || !drawnOnce; i += stepLength) 
		{
			drawnOnce = true;
			const lerp = i / length;
			const x = this.lastX * (1.0 - lerp) + bx * lerp;
			const y = this.lastY * (1.0 - lerp) + by * lerp;
			this.brushDraw(args, parseInt(x), parseInt(y));
		}
	}

	brushDraw(args, bx, by) 
	{
		const stampImage = args.layer.context.getImageData(bx, by, this.brushMask.width, this.brushMask.height);
		let pixelPos = 0;
		for(let j = 0; j < this.brushMask.height; j++) 
		{
			for(let i = 0; i < this.brushMask.width; i++) 
			{
				const canvasPixel = (bx + i + (by + j) * args.layer.canvas.width) * 4;
				const newAlpha = this.brushMask.data[pixelPos + 3] > this.brushDrawnAlphaMask[canvasPixel/4];
				if(
					bx + i < 0 ||
					bx + i >= args.layer.canvas.width ||
					by + j < 0 ||
					by + j >= args.layer.canvas.height ||
					!newAlpha
				) 
				{
					pixelPos += 4;
					continue;
				};

				const originalColor = [this.imageDataBefore.data[canvasPixel], this.imageDataBefore.data[canvasPixel + 1], this.imageDataBefore.data[canvasPixel + 2], this.imageDataBefore.data[canvasPixel + 3]];
				
				const color = this.colorFunction({
					viewportArgs: args,
					px: bx + i,
					py: by + j,
					originalColor: originalColor,
					originalData: this.imageDataBefore,
					brushMaskColor: [this.brushMask.data[pixelPos], this.brushMask.data[pixelPos + 1], this.brushMask.data[pixelPos + 2], this.brushMask.data[pixelPos + 3]]
				});

				this.brushDrawnAlphaMask[canvasPixel/4] = this.brushMask.data[pixelPos + 3];

				const finalColor = this.blendFunction(originalColor, color);
				
				stampImage.data[pixelPos + 0] = finalColor[0];
				stampImage.data[pixelPos + 1] = finalColor[1];
				stampImage.data[pixelPos + 2] = finalColor[2];
				stampImage.data[pixelPos + 3] = finalColor[3];
				pixelPos += 4;
			}
		}
		args.layer.context.putImageData(stampImage, bx, by);
	}
	
	setMask(mask) 
	{
		this.brushMask = mask;
		this.brushMaskOutline = BrushOutline(mask);
		this.brushOutlineDOMImage.width = this.brushMaskOutline.width;
		this.brushOutlineDOMImage.height = this.brushMaskOutline.height;
		this.brushOutlineDOMImage.getContext("2d").putImageData(this.brushMaskOutline, 0, 0);
	}

	update(args) 
	{
		this.brushOutlineDOM.style.left = (args.xOffset + (this.lastMPX-parseInt(this.brushMask.width/2)) * args.zoom) + "px";
		this.brushOutlineDOM.style.top = (args.yOffset + (this.lastMPY-parseInt(this.brushMask.height/2)) * args.zoom) + "px";
		this.brushOutlineDOM.style.width = (this.brushMask.width * args.zoom) + "px";
		this.brushOutlineDOM.style.height = (this.brushMask.height * args.zoom) + "px";
		args.viewport.current.append(this.brushOutlineDOM);
	}

	setSelected(selected) 
	{
		if(!selected) this.brushOutlineDOM.parentNode.removeChild(this.brushOutlineDOM);
	}
}	