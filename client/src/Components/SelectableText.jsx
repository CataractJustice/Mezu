import "./SelectableText.css";

function SelectableText(props) 
{
	return (
		<div className="SelectableTextContainer">
			<div className="SelectableText">{props.children}</div>
			<div className="SelectableTextCheckMark" style={{
				display: props.selected ? "block" : "none"
			}}>✓</div>
		</div>
	);
}
 
export default SelectableText;