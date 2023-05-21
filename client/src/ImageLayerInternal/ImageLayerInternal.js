
export const BlendModes = 
{
	normal: "normal",
	multiply: "multiply",
	screen: "screen",
	overlay: "overlay",
	darken: "darken",
	lighten: "lighten",
	colorDodge: "color-dodge",
	colorBurn: "color-burn",
	hardLight: "hard-light",
	softLight: "soft-light",
	difference: "difference",
	exclusion: "exclusion",
	hue: "hue",
	saturation: "saturation",
	color: "color",
	luminosity: "luminosity"
}

export default class ImageLayerInternal
{
	constructor(imageFile) 
	{
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.canvas.width = imageFile.width;
		this.canvas.height = imageFile.height;
		this.canvas.className = "CanvasLayer";

		this.bufferCanvas = document.createElement("canvas");
		this.bufferContext = this.bufferCanvas.getContext("2d");
		this.bufferCanvas.width = imageFile.width;
		this.bufferCanvas.height = imageFile.height;
		this.bufferCanvas.className = "BufferCanvas";

		this.title = "Layer";
		this.hidden = false;
		this.blendMode = BlendModes.normal;
	}

	setHidden(hidden) 
	{
		if(this.hidden !== hidden) 
		{
			this.canvas.style.display = hidden ? "none" : "";
			this.bufferCanvas.style.display = hidden ? "none" : "";
			this.hidden = hidden;
		}
	}

	setBlendMode(blendMode) 
	{
		this.canvas.style.mixBlendMode = blendMode;
		this.bufferCanvas.style.mixBlendMode = blendMode;
		this.blendMode = blendMode;
	}
}