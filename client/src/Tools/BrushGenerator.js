export default class BrushGenerator 
{
	static CircleSDF(x, y) 
	{
		return Math.sqrt(x*x+y*y) - 0.5;
	}

	static SquareSDF(x, y) 
	{
		const cornerDx = Math.abs(x) - 0.5;
		const cornerDy = Math.abs(y) - 0.5;
		const edgeDst = Math.max(cornerDx, cornerDy);
		return  (cornerDx < 0.0 || cornerDy < 0.0) ? edgeDst : Math.sqrt(cornerDx*cornerDx + cornerDy*cornerDy);
	}

	static Linear(distance) 
	{
		return 1.0 - distance;
	}

	static Quadratic(distance) 
	{
		return 1.0 - ((distance > 0.0) ? (distance*distance) : (0.0));
	}

	static Root(distance) 
	{
		return 1.0 - (distance > 0.0 ? Math.sqrt(distance) : 0.0);
	}

	static Hard(distance) 
	{
		return distance > 0.0 ? 0.0 : 1.0;
	}

	static GenerateBySDF(maskWidth, maskHeight, size, falloff, signedDistanceField, distanceMaskFunction) 
	{
		if(falloff === 0) 
		{
			distanceMaskFunction = this.Hard;
			falloff = 1;
		}
		const mask = new ImageData(maskWidth, maskHeight);
		for(let j = 0; j < maskHeight; j++) 
		{
			for(let i = 0; i < maskWidth; i++) 
			{

				mask.data[(i + j * maskWidth) * 4 + 0] = 255;
				mask.data[(i + j * maskWidth) * 4  + 1] = 255;
				mask.data[(i + j * maskWidth) * 4  + 2] = 255;
				mask.data[(i + j * maskWidth) * 4  + 3] = parseInt(255 * Math.min(1.0, Math.max(0.0, distanceMaskFunction(signedDistanceField((i-maskWidth/2) / size, (j-maskHeight/2) / size) * size * 2.0 / falloff)))); 
			}
		}
		return mask;
	}

	static DefaultBrushes() 
	{
		const size = 16;
		const falloff = 8;
		const maskSize = size + falloff;
		//circle brush with radius of 16px and additional quadratic falloff of 8px
		const CircleBrush = BrushGenerator.GenerateBySDF(maskSize, maskSize, BrushGenerator.CircleSDF, size, falloff, BrushGenerator.Quadratic);
		//square brush with 16px edge length and additional quadratic falloff of 8px
		const SquareBrush = BrushGenerator.GenerateBySDF(maskSize, maskSize, BrushGenerator.SquareSDF, size, falloff, BrushGenerator.Quadratic);
		return [CircleBrush, SquareBrush];
	}
}