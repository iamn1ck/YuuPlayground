import { Async } from "./Async";
import { Color } from "./Basic Types/Color";
import { Vector2 } from "./Basic Types/Vector2";
import { entityRayClick_Data } from "./EntityRayClick_Data";
import { BrushShapes, paintShapes } from "./PaintShapes";
import { Texture } from "./Texture";


const playerBrushProperties: BrushProperties = {
  brush: 'Simple',
  shape: 'Round',

  color: Color.black,
  radius: 24,
  alpha: 1,
  hardness: 1,
}


export type BrushProperties = {
  brush: BrushTypes,
  shape: BrushShapes,

  color: Color,
  radius: number,
  alpha: number,
  hardness: number
}

export type BrushTypes = 'Simple' | 'Spray' | 'EyeDropper' | 'DumpBucket' | 'SuperDump' | 'Erase';


/**
 * To make it easier to paint you should use this Paint utility, which saves various brush properties and optimizes pixel updates to reduce lag.
 */
export const Paint = {
  uvPath,
  pixelPath,
  uv,
  pixel,
  properties: {
    color: {
      set: setColor,
      get: getColor,
    },
    radius: {
      set: setRadius,
      get: getRadius,
    },
    alpha: {
      set: setAlpha,
      get: getAlpha,
    },
    hardness: {
      set: setHardness,
      get: getHardness,
    },
    brushType: {
      set: setBrushType,
      get: getBrushType,
    },
    brushShape: {
      set: setBrushShape,
      get: getBrushShape,
    },
  },
  getBrushTexture,
}


/**
 * Paint along a path, manually provide uv coordinates, or consider firing a `raycast` to get UVs
 * @param uv1 start of path
 * @param uv2 end of path
 */
function uvPath(texture: Texture, uv1: Vector2, uv2: Vector2, brushProperties: BrushProperties = playerBrushProperties) {
  const coord1 = uvToPixelCoordinate(uv1, texture);
  const coord2 = uvToPixelCoordinate(uv2, texture);

  pixelPath(texture, coord1, coord2, brushProperties);
};


/**
 * Paint along a path, manually providing pixel coordinates, or consider firing a `raycast` to get UVs
 * @param coord1 start of path in pixels
 * @param coord2 end of path in pixels
 */
function pixelPath(texture: Texture, coord1: Vector2, coord2: Vector2, brushProperties: BrushProperties = playerBrushProperties) {
  let coords: Vector2[] = [];

  const distanceVec2 = coord2.subtract(coord1);

  if (Math.abs(distanceVec2.x) > (texture.width / 2)) {
    const isRightward = distanceVec2.x > 0;

    const rightCoord = isRightward ? coord1 : coord2;
    const leftCoord = isRightward ? coord2 : coord1;

    const xDistance = (texture.width - rightCoord.x) + leftCoord.x;
    const yDistance = rightCoord.y - leftCoord.y;

    const yCoord = Math.round(rightCoord.y + ((new Vector2(xDistance, yDistance).normalize().y * texture.height) * ((texture.width - rightCoord.x) / texture.width)));

    coords.push(...Vector2.getBresenhamLineCoords(leftCoord, new Vector2(texture.width - 1, yCoord)));
    coords.push(...Vector2.getBresenhamLineCoords(new Vector2(0, yCoord), rightCoord));
  }
  else if (Math.abs(distanceVec2.y) > (texture.height / 2)) {
    const isUpward = distanceVec2.y < 0;

    const topCoord = isUpward ? coord1 : coord2;
    const bottomCoord = isUpward ? coord2 : coord1;

    const yDistance = (texture.height - topCoord.y) + bottomCoord.y;
    const xDistance = topCoord.x - bottomCoord.x;

    const xCoord = Math.round(topCoord.x + ((new Vector2(xDistance, yDistance).normalize().x * texture.width) * ((texture.height - topCoord.y) / texture.height)));

    coords.push(...Vector2.getBresenhamLineCoords(bottomCoord, new Vector2(xCoord, texture.height - 1)));
    coords.push(...Vector2.getBresenhamLineCoords(new Vector2(xCoord, 0), topCoord));
  }
  else {
    coords = Vector2.getBresenhamLineCoords(coord1, coord2);
    coords.shift();
    coords.pop();
  }

  const modulusAmount = Math.ceil(brushProperties.radius / 10) * Math.max(1, Math.ceil(coords.length / 100));

  coords.forEach((pos, index) => {
    let canPaint = true;

    if (brushProperties.radius > 5) {
      canPaint = (index % modulusAmount === 0);
    }

    if (canPaint) {
      pixel(texture, pos, false, brushProperties);
    }
  });

  texture.updateTexture();
};

function uv(texture: Texture, uvCoord: Vector2, applyStroke: boolean, brushProperties: BrushProperties = playerBrushProperties) {
  const x = uvCoord.x * texture.width;
  const y = uvCoord.y * texture.height;

  pixel(texture, new Vector2(x, y), applyStroke, brushProperties);
};

/**
 * Paint a single point, for optimized painting, you will want to use `path`
 * @param pixelPos to paint
 */
function pixel(texture: Texture, pixelPos: Vector2, applyStroke: boolean, brushProperties: BrushProperties = playerBrushProperties) {
  const destX = pixelPos.x - brushProperties.radius;
  const destY = pixelPos.y - brushProperties.radius;

  const destPixel = new Vector2(Math.max(0, destX), Math.max(0, destY));

  if (destX < 0 || destY < 0) {
    const cutAmount = new Vector2(Math.max(0, destX * -1), Math.max(0, destY * -1));

    texture.blendRectWithImage(destPixel, brushTexture, brushStartPixel.add(cutAmount), brushSize.subtract(cutAmount));
  }
  else {
    texture.blendRectWithImage(destPixel, brushTexture, brushStartPixel, brushSize);
  }

  if (applyStroke) {
    texture.updateTexture();
  }
};

function getBrushTexture(): Texture {
  return brushTexture;
}


function uvToPixelCoordinate(uv: Vector2, texture: Texture): Vector2 {
  const x = Math.floor((uv.x * texture.width) + 0.5);
  const y = Math.floor((uv.y * texture.height) + 0.5);

  return new Vector2(x, y);
}


// Functions Below Update Properties That Need To Adjust The Brush Texture
// Maybe need a function to update the texture after a 1-5 frame delay (ie. if multiple properties are adjusted at once with code??, maybe a bool to update if set to true, defaulted to false? or true? idk)


function setColor(color: Color) {
  playerBrushProperties.color = color;

  updatePointers();
  updateBrush();
}

function getColor(): Color {
  return playerBrushProperties.color;
}

/**
 * Update the brush radius
 * @param radius of the brush in pixels
 */
function setRadius(radius: number) {
  playerBrushProperties.radius = Math.min(512, Math.max(1, radius));

  updateBrushSizeVectors();

  updateBrush();
}

function getRadius(): number {
  return playerBrushProperties.radius;
}

/**
 * Update the transparency of the brush
 * @param alpha ranges from 0 to 1
 */
function setAlpha(alpha: number) {
  playerBrushProperties.alpha = alpha;

  updatePointers();
  updateBrush();
}

function getAlpha(): number {
  return playerBrushProperties.alpha;
}

/**
 * Set the hardness, which is the percent of the radius to keep solid, the remainder fades linearly out
 * @param hardness values range from 0 to 1
 */
function setHardness(hardness: number) {
  playerBrushProperties.hardness = hardness;

  updateBrush();
}

function getHardness(): number {
  return playerBrushProperties.hardness;
}

function setBrushType(brushType: BrushTypes) {
  playerBrushProperties.brush = brushType;

  updateBrush();
}

function getBrushType(): BrushTypes {
  return playerBrushProperties.brush;
}

function setBrushShape(brushShape: BrushShapes) {
  playerBrushProperties.shape = brushShape;

  updateBrush();
}

function getBrushShape(): BrushShapes {
  return playerBrushProperties.shape;
}


function updatePointers() {
  entityRayClick_Data.leftPointer.mesh.color.set(playerBrushProperties.color, 0.25 + playerBrushProperties.alpha / 2);
  entityRayClick_Data.rightPointer.mesh.color.set(playerBrushProperties.color, 0.25 + playerBrushProperties.alpha / 2);
}

let brushStartPixel = Vector2.zero;
let brushSize = Vector2.zero;
updateBrushSizeVectors();

let asyncID = 0;
let asyncIDLast = 0;

function updateBrush() {
  // Might be a good interim until we get a shader...
  if (asyncID === 0) {
    updateBrushAsync();

    asyncID = Async.setTimeout(() => {
      asyncID = 0;
    }, 250);
  }

  Async.clearTimer(asyncIDLast);

  asyncIDLast = Async.setTimeout(() => {
    updateBrushAsync();
  }, 125);
}

function updateBrushAsync() {
  // add an if statement to do nothing if there are no changes

  const flooredRadius = Math.floor(playerBrushProperties.radius);

  brushTexture.fillWithColor(Color.black, 0);

  const shapeFunc = paintShapes.getShapeFunc(playerBrushProperties.shape);

  if (playerBrushProperties.hardness < 1) {
    const steps = Math.min(flooredRadius, Math.max(5, Math.ceil((1 - playerBrushProperties.hardness + 0.1) * flooredRadius)));

    for (let i = 1; i <= steps; i++) {
      const radius = (flooredRadius + 1) - i;

      const brushStartPixelCoord = 512 - radius;
      const startPixel = new Vector2(brushStartPixelCoord, brushStartPixelCoord);
      const alphaX = (i / steps);

      let alpha = alphaX * alphaX * alphaX * playerBrushProperties.alpha;

      shapeFunc({ brushTexture: brushTexture, brushStartPixel: startPixel, radius: radius, cropRadius: i === steps ? 0 : (radius - 1), color: playerBrushProperties.color, alpha: alpha });
    }
  }
  else {
    shapeFunc({ brushTexture: brushTexture, brushStartPixel: brushStartPixel, radius: flooredRadius, cropRadius: 0, color: playerBrushProperties.color, alpha: playerBrushProperties.alpha });
  }

  brushTexture.updateTexture();
}

function updateBrushSizeVectors() {
  const brushStartPixelCoord = 512 - playerBrushProperties.radius;
  brushStartPixel = new Vector2(brushStartPixelCoord, brushStartPixelCoord);

  const brushDiameter = playerBrushProperties.radius * 2;
  brushSize = new Vector2(brushDiameter, brushDiameter);
}

const brushTexture = new Texture(1024, 1024);
brushTexture.fillWithColor(Color.black, 0);
updateBrush();