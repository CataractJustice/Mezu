
export default class ImageLayerInternal
{
	constructor(imageFile) 
	{
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.canvas.width = imageFile.width;
		this.canvas.height = imageFile.height;
		this.canvas.className = "CanvasLayer";
		this.title = "Layer";
		this.hidden = false;
	}

	setHidden(hidden) 
	{
		if(this.hidden !== hidden) 
		{
			this.canvas.style.display = hidden ? "none" : "";
			this.hidden = hidden;
		}
	}
}