
export default class RectTransformTool 
{
	constructor(args) 
	{
		this.onTransform = args.onTransform;
	}

	onRectTransform(rect) 
	{
		this.onTransform(rect);
	}
}