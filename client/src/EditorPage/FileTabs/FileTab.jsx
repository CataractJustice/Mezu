import "./FileTab.css";

function FileTab(props) 
{
	return (
		<div className="FileTab" style={{backgroundColor: props.active ? "var(--inset-color)" : ""}}
		onClick={props.onClick}
		>
			<div className="FileTabTitle">{`${props.file.name} ${props.file.saved ? "" : "*"}`}</div>
			<div className="FileTabClose" onClick={props.onClose}>X</div>
		</div>
	);
}
 
export default FileTab;