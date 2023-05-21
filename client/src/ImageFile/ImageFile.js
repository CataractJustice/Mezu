
export default class ImageFile
{
	constructor(width, height, name) 
	{
		this.width = width;
		this.height = height;
		this.name = name;
		this.saved = false;
		this.layers = [];
		this.currentLayer = {};
		this.uuid = crypto.randomUUID();
	}
	
	ComposedCanvas() 
	{
		const mergeCanvas = document.createElement("canvas");
		mergeCanvas.width = this.width;
		mergeCanvas.height = this.height;
		const mergeContext = mergeCanvas.getContext("2d");

		for(const layer of this.layers) 
		{
			if(layer.hidden) continue;
			mergeContext.globalCompositeOperation = layer.blendMode;
			mergeContext.drawImage(layer.canvas, 0, 0);
		}

		return mergeCanvas;
	}
}