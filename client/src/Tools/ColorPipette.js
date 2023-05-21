
function getColor(x, y, canvas) 
{
	return canvas.getContext("2d").getImageData(parseInt(x), parseInt(y), 1, 1).data
}

export const ColorPipette =
{
	toolName: "Color Pipette",
	active: false,
	composedCanvas: 0,
	onMouseDown: (args) => {
		ColorPipette.composedCanvas = args.editor.currentFile.ComposedCanvas();
		ColorPipette.active = true;
		args.editor.setPrimaryColor(getColor(args.px, args.py, ColorPipette.composedCanvas));
	},

	onMouseMove: (args) => 
	{
		if(ColorPipette.active) 
		{
			args.editor.setPrimaryColor(getColor(args.px, args.py, ColorPipette.composedCanvas));
		}
	},
	onMouseUp: () => 
	{
		ColorPipette.active = false;
	}
}