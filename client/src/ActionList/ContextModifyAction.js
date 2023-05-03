export default class ContextModifyAction 
{
	constructor(props) 
	{
		this.context = props.context;
		this.imageDataBefore = props.before;
		this.imageDataAfter = props.after;
		this.x = props.x;
		this.y = props.y;
	}

	undo() 
	{
		this.context.putImageData(this.imageDataBefore, this.x ? this.x : 0, this.y ? this.y : 0);
	}

	redo() 
	{
		this.context.putImageData(this.imageDataAfter, this.x ? this.x : 0, this.y ? this.y : 0);
	}
}