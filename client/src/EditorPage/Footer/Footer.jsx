import { createRef } from "react";
import "./Footer.css";

const xPixelDisplayRef = createRef();
const yPixelDisplayRef = createRef();

export const UpdateFooterPixelCoords = (x, y)=>
{
	if(xPixelDisplayRef.current)
		xPixelDisplayRef.current.innerText = `x: ${x}`;
	if(yPixelDisplayRef.current)
		yPixelDisplayRef.current.innerText = `y: ${y}`;
}

function Footer(props) 
{
	return (
		<div className="Footer">
			<div className="PixelCoords">
				<div ref={xPixelDisplayRef}>
					x: 0
				</div>
				<div ref={yPixelDisplayRef}>
					y: 0
				</div>
			</div>
		</div>
	);
}
 
export default Footer;