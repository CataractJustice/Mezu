import "./MenuBarItem.css";

function MenuBarItem(props) 
{
	return (
		<div className="MenuBarItem">
			{props.children}
		</div>
	);
}
 
export default MenuBarItem;