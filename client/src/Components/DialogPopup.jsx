import "./DialogPopup.css";

function DialogPopup(props) 
{
	return (
		<div className="DialogPopupContainer" style={{
			display: props.open ? "flex" : "none"
		}}>
			<div className="DialogPopupContainerCenter">
				<div className="DialogPopupCloseButton" onClick={props.onClose}>
				⤬
				</div>
				{props.children}
			</div>
		</div>
	);
}
 
export default DialogPopup;