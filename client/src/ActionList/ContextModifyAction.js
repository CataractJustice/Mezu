export default class ContextModifyAction 
{
	constructor(context, base64Before, base64After) 
	{
		this.context = context;
		this.imageBefore = new Image();
		this.imageBefore.src = base64Before;
		this.imageAfter = new Image();
		this.imageAfter.src = base64After;
	}

	undo() 
	{
		this.context.drawImage(this.imageBefore, 0, 0);
	}

	redo() 
	{
		this.context.drawImage(this.imageAfter, 0, 0);
	}
}