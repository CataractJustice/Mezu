import { useState } from "react";
import "./MenuDropdown.css";

function MenuDropdown(props) 
{
	const [dropdownOpen, setDropdownOpen] = useState(false);
	return (
		<div className="MenuDropdown"
		onClick={()=>{
			setDropdownOpen(true);
		}}
		>
			{props.title}
			<div className="MenuDropdownItemsList"
			onMouseLeave={()=>{setDropdownOpen(false)}}
			style={{display: dropdownOpen ? "block" : "none"}}
			>
				{props.children}
			</div>
		</div>
	);
}
 
export default MenuDropdown;