function reduceAlpha(a) 
{
	let alpha = a;
	if(alpha < 255) alpha = ((alpha === 0) ? (0) : (128));
	return alpha;
}

export default function BrushOutline(mask) 
{
	const image = new ImageData(mask.width * 2, mask.height * 2);

	for(let i = 0; i < image.width; i++) 
	{
		for(let j = 0; j < image.height; j++)
		{
			image.data[(i + j * image.width)*4+0]	= mask.data[(parseInt(i/2) + parseInt(j/2) * mask.width)*4+0];
			image.data[(i + j * image.width)*4+1]	= mask.data[(parseInt(i/2) + parseInt(j/2) * mask.width)*4+1];
			image.data[(i + j * image.width)*4+2]	= mask.data[(parseInt(i/2) + parseInt(j/2) * mask.width)*4+2];
			image.data[(i + j * image.width)*4+3]	= mask.data[(parseInt(i/2) + parseInt(j/2) * mask.width)*4+3];	
		}
	}

	const outlineImage = new ImageData(image.width, image.height);
	
	for(let i = 0; i < image.width; i++) 
	{
		for(let j = 0; j < image.height; j++)
		{
			const p = (i + j * image.width) * 4 + 3;
			let alpha = reduceAlpha(image.data[p]);
			if(
				(i > 0 && reduceAlpha(image.data[p - 4]) > alpha) ||
				(i < image.width - 1 && reduceAlpha(image.data[p + 4]) > alpha) ||
				(j > 0 && reduceAlpha(image.data[p - image.width * 4]) > alpha) ||
				(j < image.height - 1 && reduceAlpha(image.data[p + image.width * 4]) > alpha)
			) {
				outlineImage.data[p] = 128;
				outlineImage.data[p-1] = 255;
				outlineImage.data[p-2] = 255;
				outlineImage.data[p-3] = 255;
			}
			if(
				(i > 0 && reduceAlpha(image.data[p - 4]) < alpha) ||
				(i < image.width - 1 && reduceAlpha(image.data[p + 4]) < alpha) ||
				(j > 0 && reduceAlpha(image.data[p - image.width * 4]) < alpha) ||
				(j < image.height - 1 && reduceAlpha(image.data[p + image.width * 4]) < alpha)
			) {
				outlineImage.data[p] = 128;
				outlineImage.data[p-1] = 0;
				outlineImage.data[p-2] = 0;
				outlineImage.data[p-3] = 0;
			}
		}
	}
	return outlineImage;
}