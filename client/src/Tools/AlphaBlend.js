export default class AlphaBlend 
{
	static Normal(originalColor, color) 
	{
		const lerp = (color[3] * originalColor[3] / 255 + 255 - originalColor[3]) / 255;
		const result = [0,0,0,0];

		result[0] = parseInt(color[0] * lerp) + parseInt(originalColor[0] * (1 - lerp));
		result[1] = parseInt(color[1] * lerp) + parseInt(originalColor[1] * (1 - lerp));
		result[2] = parseInt(color[2] * lerp) + parseInt(originalColor[2] * (1 - lerp));
		result[3] = parseInt(originalColor[3] * (1.0 - color[3] / 255) + color[3]);
		return result;
	}

	static Lerp(originalColor, color) 
	{
		const lerp = (color[3])/255;
		const result = [0,0,0,0];

		result[0] = parseInt(color[0] * lerp) + parseInt(originalColor[0] * (1 - lerp));
		result[1] = parseInt(color[1] * lerp) + parseInt(originalColor[1] * (1 - lerp));
		result[2] = parseInt(color[2] * lerp) + parseInt(originalColor[2] * (1 - lerp));
		result[3] = originalColor[3];
		return result;
	}

	static Set(originalColor, color) 
	{
		return color;
	}
	
	static Multiply(originalColor, color) 
	{
		const result = [0,0,0,0];
		
		result[0] = parseInt(color[0] * originalColor[0] / 255);
		result[1] = parseInt(color[1] * originalColor[1] / 255);
		result[2] = parseInt(color[2] * originalColor[2] / 255);
		result[3] = parseInt(color[3] * originalColor[3] / 255);
		return result;
	}
}