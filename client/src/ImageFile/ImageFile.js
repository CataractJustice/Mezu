
export default function ImageFile(width, height, name) 
{
	this.width = width;
	this.height = height;
	this.name = name;
	this.saved = false;
	this.layers = [];
	this.currentLayer = {};
	this.uuid = crypto.randomUUID();
}