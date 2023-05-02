
export default function ImageLayerInternal(imageFile)
{
	this.canvas = document.createElement("canvas");
	this.context = this.canvas.getContext("2d");
	this.canvas.width = imageFile.width;
	this.canvas.height = imageFile.height;
	this.canvas.className = "CanvasLayer";
	this.title = "Layer";
	this.hidden = false;
}