import { Color } from "./Basic Types/Color";
import { Vector2 } from "./Basic Types/Vector2";
import { Texture } from "./Texture";


export const paintShapes = {
  getShapeFunc,
}


export type BrushShapes = 'Round' | 'Square' | 'Star' | 'Flower' | 'Triangle' | 'Heart' | 'Line';

type ShapeFuncProperties = { brushTexture: Texture, brushStartPixel: Vector2, radius: number, cropRadius: number, color: Color, alpha: number };


function getShapeFunc(brushShape: BrushShapes): (shapeFuncProperties: ShapeFuncProperties) => void {
  if (brushShape === 'Square') {
    return fillRect;
  }
  else if (brushShape === 'Round') {
    return fillRound;
  }
  else {
    // Replace with else if tree for all options
    return fillRect;
  }
}

function fillRect(shapeFuncProperties: ShapeFuncProperties) {
  const diameter = shapeFuncProperties.radius * 2;
  shapeFuncProperties.brushTexture.fillRectWithColor(shapeFuncProperties.brushStartPixel, new Vector2(diameter, diameter), shapeFuncProperties.color, shapeFuncProperties.alpha);
}

function fillRound(shapeFuncProperties: ShapeFuncProperties) {
  const pixels: Vector2[] = [];
  const radiusSquared = shapeFuncProperties.radius * shapeFuncProperties.radius;

  const centerPixel = shapeFuncProperties.brushStartPixel.add(new Vector2(shapeFuncProperties.radius, shapeFuncProperties.radius));

  for (let x = -shapeFuncProperties.radius; x < shapeFuncProperties.radius; x++) {
    for (let y = -shapeFuncProperties.radius; y < shapeFuncProperties.radius; y++) {
      const cSquared = (x * x) + (y * y);
      // Hey LEXY this "cropRadius" can be used to make a cylinder / hollow circle brush!! :D
      if (cSquared < radiusSquared && cSquared >= shapeFuncProperties.cropRadius) {
        pixels.push(centerPixel.add(new Vector2(x, y)));
      }
    }
  }

  shapeFuncProperties.brushTexture.setPixelsColor(pixels, shapeFuncProperties.color, shapeFuncProperties.alpha);
}
