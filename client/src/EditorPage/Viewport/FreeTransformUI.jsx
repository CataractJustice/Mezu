import "./FreeTransformUI.css";

let sX = 0;
let sY = 0;
let oX = 0;
let oY = 0;
let oW = 0;
let oH = 0;

let controlCase = 0;

export default function FreeTransformUI(props) 
{
	const controlPointMargin = 8;
	const cpHalfWidth = 4;
	const xState = props.x;
	const yState = props.y;
	const wState = props.w;
	const hState = props.h;

	let x = parseInt(xState * props.zoom + props.xOffset);
	let y = parseInt(yState * props.zoom + props.yOffset);
	let w = parseInt(wState * props.zoom);
	let h = parseInt(hState * props.zoom);

	const setRect = (x, y, w, h) =>
	{
		if(w < 0) {w = -w; x -= w;}
		if(h < 0) {h = -h; y -= h;}
		if(props.onTransform) props.onTransform(x, y, w, h);
	}

	function cpCallback(e) 
	{
		sX = e.clientX;
		sY = e.clientY;
		oX = xState;
		oY = yState;
		oW = wState;
		oH = hState;
		console.log(controlCase);
		const fn = (le) => 
		{
			let dX = le.clientX - sX;
			let dY = le.clientY - sY;
			
			switch(controlCase) 
			{
			case 0:
				setRect(oX + dX / props.zoom,
				oY + dY / props.zoom,
				oW - dX / props.zoom,
				oH - dY / props.zoom);
			break;
			case 1:
				setRect(xState,
			oY + dY / props.zoom,
			wState,
			oH - dY / props.zoom);
			break;
			case 2:
				setRect(
					xState,
					oY + dY / props.zoom,
					oW + dX / props.zoom,
					oH - dY / props.zoom);
			break;
			case 3:
				setRect(oX + dX / props.zoom,
				yState,
				oW - dX / props.zoom,
				hState);
			break;
			case 4:
				setRect(xState, yState, oW + dX / props.zoom, hState);
			break;
			case 5:
				setRect(oX + dX / props.zoom,
				yState,
				oW - dX / props.zoom,
				oH + dY / props.zoom);
			break;
			case 6:
				setRect(xState, yState, wState, oH + dY / props.zoom);
			break;
			case 7:
				setRect(
					xState,
					yState,
					oW + dX / props.zoom,
					oH + dY / props.zoom
				);
			break;
			case 8:
				setRect(oX + dX / props.zoom,
				oY + dY / props.zoom,
				wState,
				hState);
			break;
			default:
			break;
			}
		}

		document.addEventListener("mousemove", fn);
		const mUp = () => 
		{
			document.removeEventListener("mousemove", fn);
			document.removeEventListener("mouseup", mUp);
		}
		document.addEventListener("mouseup", mUp);
	}
	
	return (
		<>
		<div className="FreeTransformUI"
		style={
			{
				left: x + "px",
				top: y + "px",
				width: w + "px",
				height: h + "px"
			}
		}
		>
		</div>
		<div className="FreeTransformControlPoint"
		style={
			{
				left: (x - controlPointMargin - cpHalfWidth) + "px",
				top: (y - controlPointMargin - cpHalfWidth) + "px",
				cursor: "nw-resize"
			}
		} onMouseDown={(e)=>{controlCase = 0; cpCallback(e)}} ></div>
		<div className="FreeTransformControlPoint"
		style={
			{
				left: (x + w / 2 - cpHalfWidth) + "px",
				top: (y - controlPointMargin - cpHalfWidth) + "px",
				cursor: "row-resize"
			}
		} onMouseDown={(e)=>{controlCase = 1; cpCallback(e)}} ></div>
		<div className="FreeTransformControlPoint"
		style={
			{
				left: (x + w + controlPointMargin - cpHalfWidth) + "px",
				top: (y - controlPointMargin - cpHalfWidth) + "px",
				cursor: "ne-resize"
			}
		} onMouseDown={(e)=>{controlCase = 2; cpCallback(e)}} ></div>
		<div className="FreeTransformControlPoint"
		style={
			{
				left: (x - controlPointMargin - cpHalfWidth) + "px",
				top: (y + h / 2 - cpHalfWidth) + "px",
				cursor: "col-resize"
			}
		} onMouseDown={(e)=>{controlCase = 3; cpCallback(e)}} ></div>
		<div className="FreeTransformControlPoint"
		style={
			{
				left: (x + w + controlPointMargin - cpHalfWidth) + "px",
				top: (y + h / 2 - cpHalfWidth) + "px",
				cursor: "col-resize"
			}
		} onMouseDown={(e)=>{controlCase = 4; cpCallback(e)}} ></div>
		<div className="FreeTransformControlPoint"
		style={
			{
				left: (x - controlPointMargin - cpHalfWidth) + "px",
				top: (y + h + controlPointMargin - cpHalfWidth) + "px",
				cursor: "sw-resize"
			}
		} onMouseDown={(e)=>{controlCase = 5; cpCallback(e)}} ></div>
		<div className="FreeTransformControlPoint"
		style={
			{
				left: (x + w / 2 - cpHalfWidth) + "px",
				top: (y + h + controlPointMargin - cpHalfWidth) + "px",
				cursor: "row-resize"
			}
		} onMouseDown={(e)=>{controlCase = 6; cpCallback(e)}} ></div>
		<div className="FreeTransformControlPoint"
		style={
			{
				left: (x + w + controlPointMargin - cpHalfWidth) + "px",
				top: (y + h + controlPointMargin - cpHalfWidth) + "px",
				cursor: "se-resize"
			}
		} onMouseDown={(e)=>{controlCase = 7; cpCallback(e)}} ></div>
		<div className="FreeTransformControlPoint" style={
			{
				left: (x + w / 2 - cpHalfWidth) + "px",
				top: (y + h / 2 - cpHalfWidth) + "px",
				cursor: "move"
			}
		} onMouseDown={(e)=>{controlCase = 8; cpCallback(e)}} >

		</div>
		</>
	);
}