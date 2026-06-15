import { Async } from "./Yuu API/Async";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { createUIElement } from "./Yuu API/CreateUIElement";
import { Entity } from "./Yuu API/Entity";
import { BrushTypes, Paint } from "./Yuu API/Paint";
import { BrushShapes, paintShapes } from "./Yuu API/PaintShapes";
import { Player } from "./Yuu API/Player";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Texture } from "./Yuu API/Texture";


export const lexy = {
  spawnDrawSettingButtons,
  rainbowWave,
  nissanGtr,
  sierPlane
}

function spawnDrawSettingButtons(pos: Vector3) {
  createDrawSettingButton(pos, 'Size', 'px', 512, 1, 0.5, Paint.properties.radius.get, Paint.properties.radius.set);
  createDrawSettingButton(pos.add(new Vector3(0.35, 0, 0)), 'Alpha', '%', 1, 0.01, 0.01, Paint.properties.alpha.get, Paint.properties.alpha.set);
  createDrawSettingButton(pos.add(new Vector3(-0.35, 0, 0)), 'Hardness', '%', 1, 0.01, 0.01, Paint.properties.hardness.get, Paint.properties.hardness.set);

  createAltDrawSettingButton(pos.add(new Vector3(0.35, 0.18, 0)), 'Shape', Paint.properties.brushShape.get, Paint.properties.brushShape.set);
  createAltDrawSettingButton(pos.add(new Vector3(-0.35, 0.18, 0)), 'Type', Paint.properties.brushType.get, Paint.properties.brushType.set); //fix setting payload to match both shape and type
}

function createDrawSettingButton(pos: Vector3, settingName: BrushSetting, unitPostfix: string, max: number, min: number, defaultIncrementAmount: number, getCurValueFunc: () => number, updateValueFunc: (value: number) => void) {
  let curValue = (settingName === 'Size') ? getCurValueFunc() * 2 : (getCurValueFunc() * 100);

  const settingTextEntity = new Entity(pos, Quaternion.one, Vector3.one, undefined, 'Static');
  settingTextEntity.text.create((settingName + ': ' + curValue.toString() + unitPostfix), 3, 0);
  settingTextEntity.text.color.set(Color.black);

  const decreaseButton = createUIElement.button(new Vector3(-0.04, -0.075, 0), new Vector3(0.075, 0.05, 0.10), Quaternion.one, '-', Color.white, 5, Color.red, settingTextEntity);
  const increaseButton = createUIElement.button(new Vector3(0.04, -0.075, 0), new Vector3(0.075, 0.05, 0.10), Quaternion.one, '+', Color.white, 5, Color.green, settingTextEntity);

  setRayClickFunctions(decreaseButton, false, settingName, unitPostfix, max, min, defaultIncrementAmount, settingTextEntity, getCurValueFunc, updateValueFunc);
  setRayClickFunctions(increaseButton, true, settingName, unitPostfix, max, min, defaultIncrementAmount, settingTextEntity, getCurValueFunc, updateValueFunc);
}



function createAltDrawSettingButton(pos: Vector3, settingType: 'Shape' | 'Type', getCurValueFunc: () => string, updateValueFunc: ((setting: BrushShapes) => void) | ((setting: BrushTypes) => void)) {  //fix setting payload to match both
  let curSelection = getCurValueFunc();

  const settingTextEntity = new Entity(pos, Quaternion.one, Vector3.one, undefined, 'Static');
  settingTextEntity.text.create((settingType + ': ' + curSelection), 3, 0);
  settingTextEntity.text.color.set(Color.black);

  const cycleLeftButton = createUIElement.button(new Vector3(-0.04, -0.075, 0), new Vector3(0.075, 0.05, 0.10), Quaternion.one, '<', Color.white, 5, Color.red, settingTextEntity);
  const cycleRightButton = createUIElement.button(new Vector3(0.04, -0.075, 0), new Vector3(0.075, 0.05, 0.10), Quaternion.one, '>', Color.white, 5, Color.green, settingTextEntity);

  //setRayClickFuncs
  setRayClickFuncsAlt(cycleLeftButton, settingTextEntity, false, settingType, getCurValueFunc, updateValueFunc);
  setRayClickFuncsAlt(cycleRightButton, settingTextEntity, true, settingType, getCurValueFunc, updateValueFunc);
}

function setRayClickFunctions(clickableEntity: Entity, isIncrease: boolean, settingName: BrushSetting, unitPostfix: string, max: number, min: number, defaultIncrementAmount: number, textEntity: Entity, getCurValueFunc: () => number, updateValueFunc: (value: number) => void) {
  clickableEntity.rayClick.setClickFunction(() => { adjustDrawSetting(isIncrease, false, settingName, unitPostfix, max, min, defaultIncrementAmount, textEntity, getCurValueFunc, updateValueFunc); });
  clickableEntity.rayClick.setHeldFunction(() => { adjustDrawSetting(isIncrease, true, settingName, unitPostfix, max, min, defaultIncrementAmount, textEntity, getCurValueFunc, updateValueFunc); });
  clickableEntity.rayClick.setReleaseFunction(() => { counter = 0; });
}

function setRayClickFuncsAlt(clickableEntity: Entity, textEntity: Entity, isIncrease: boolean, settingType: 'Shape' | 'Type', getCurValueFunc: () => string, updateValueFunc: ((setting: BrushShapes) => void) | ((setting: BrushTypes) => void)) {
  clickableEntity.rayClick.setClickFunction(() => { cycleDrawSetting(isIncrease, settingType, textEntity, getCurValueFunc, updateValueFunc); });
  clickableEntity.rayClick.setHeldFunction(() => {});
  clickableEntity.rayClick.setReleaseFunction(() => {});
}


let counter = 0;
type BrushSetting = 'Size' | 'Alpha' | 'Hardness';

function adjustDrawSetting(isIncrease: boolean, isHeld: boolean, settingName: BrushSetting, unitPostfix: string, max: number, min: number, defaultIncrementAmount: number, textEntity: Entity, getCurValueFunc: () => number, updateValueFunc: (value: number) => void) {
  let curValue = 1;
  let changeBy = isIncrease ? defaultIncrementAmount : (-defaultIncrementAmount);
  let newValue = 1;

  if (isHeld) {
    counter++;

    if (counter > 30) {
      changeBy *= Math.max((0.1 * defaultIncrementAmount), counter / 1_000);
    }
    else {
      changeBy = 0;
    }
  }
  curValue = getCurValueFunc();

  newValue = Math.min(max, Math.max(min, curValue + changeBy));

  if (curValue !== newValue) {
    updateValueFunc(newValue);
  }

  const valueToDisplay = (settingName === 'Size') ? newValue * 2 : (newValue * 100);

  textEntity.text.display.set(settingName + ': ' + Math.floor(valueToDisplay) + unitPostfix);
}


const brushShapeArray: BrushShapes[] = [
  'Round',
  'Square',
  'Star',
  'Flower',
  'Triangle',
  'Heart',
  'Line',
];

const brushTypeArray: BrushTypes[] = [
  'Simple',
  'Spray',
  'EyeDropper',
  'DumpBucket',
  'SuperDump',
];

function cycleDrawSetting(isIncrease: boolean, settingType: string, textEntity: Entity, getCurValueFunc: () => string, updateValueFunc: ((setting: BrushShapes) => void) | ((setting: BrushTypes) => void)) {
  const curSelection = getCurValueFunc();

  const arrayToCycle = (settingType === 'Shape') ? brushShapeArray : brushTypeArray;

  let index = arrayToCycle.findIndex(setting => setting === curSelection);

  index = (index + (isIncrease ? 1 : (arrayToCycle.length - 1))) % arrayToCycle.length;

  const newSelection = arrayToCycle[index];

  textEntity.text.display.set(settingType + ': ' + newSelection);

  updateValueFunc(newSelection as BrushShapes & BrushTypes);
}



//OLD CODE:

function sierPlane(pos: Vector3){
  const plane = spawnPrimitive.plane('Front', pos, new Vector3(1, 1, 1), Quaternion.one, Color.white, 1, 'Concave', 'Static', undefined);
  const nodeId = plane.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, dvdsier);

}


const dvdsier = `
// Change to 'shader_type canvas_item;' if you are using this in 2D
shader_type spatial;
render_mode blend_mix, depth_draw_opaque, cull_back, diffuse_burley, specular_schlick_ggx;

uniform float scale = 6.0;

uniform float bottom_edge_value = 0.0;
uniform float triangle_height = 0.866025404;   
uniform float value_sqrt3 = 1.732050807;

// --- DVD BOUNCE UNIFORMS ---
uniform float speed_x = 0.31;
uniform float speed_y = 0.43;

// The "radius" or total size of the bounding rectangle around your triangles (in 0.0 to 1.0 space)
// Tweak these until the shape perfectly hits the right and top edges.
uniform float rect_size_x = 0.35;
uniform float rect_size_y = 0.35;

// Because your triangles have hardcoded offsets (like -1.0, -1.5), they might not 
// naturally start in the exact bottom-left corner. Use this to shift the starting position.
uniform vec2 start_offset = vec2(-0.05, -0.05);

float equilateral_triangle(vec2 uv) {
    float x = uv.x - 0.5;
    float y = uv.y - 0.5;
    
    float mask_bottom = step(bottom_edge_value, y);
    float mask_sides = step(y, triangle_height - abs(x) * value_sqrt3);
    
    return mask_bottom * mask_sides;
}

void fragment() {
    // 1. Calculate maximum travel distance (1.0 is the full quad, minus the size of the shape)
    float max_travel_x = 1.0 - rect_size_x;
    float max_travel_y = 1.0 - rect_size_y;

    // 2. Calculate the ping-pong bounce effect (0.0 to 1.0)
    float bounce_x = abs(mod(TIME * speed_x, 2.0) - 1.0);
    float bounce_y = abs(mod(TIME * speed_y, 2.0) - 1.0);
    
    // 3. Multiply by max travel and add the starting offset to keep it inside the quad
    vec2 bounce_offset = vec2(bounce_x * max_travel_x, bounce_y * max_travel_y) + start_offset;
    
    // 4. Apply the offset to the UV before scaling
    vec2 base_uv = (UV - bounce_offset) * scale;
    
    float mask = 0.0;
    
    // The main tree sequence
    mask += equilateral_triangle(base_uv + vec2(-1.0, -1.29999995));
    mask += equilateral_triangle(base_uv + vec2(-0.5, -0.4330127));
    mask += equilateral_triangle(base_uv + vec2(-1.5, -0.4330127));
    
    mask = clamp(mask, 0.0, 1.0);
    
    ALBEDO = vec3(mask);
}`

const cleansier =`
// Change to 'shader_type canvas_item;' if you are using this in 2D
shader_type spatial;
render_mode blend_mix, depth_draw_opaque, cull_back, diffuse_burley, specular_schlick_ggx;

// From the initial "Vector Math (SCALE)" node
uniform float scale = 6.0;

// Variables pulled from your inner "Value" nodes inside the Group
uniform float bottom_edge_value = 0.0;

// FIX: The offsets assume a side length of 1.0. 
// Therefore, the height from the base must be sqrt(3)/2 (approx 0.866025).
// Previously this was roughly 0.577, which made the triangles shrink and separate.
uniform float triangle_height = 0.866025404;   
uniform float value_sqrt3 = 1.732050807; // "sqrt(3)" node

// This function perfectly replicates the internal logic of your "Group" nodes
float equilateral_triangle(vec2 uv) {
    // Separate XYZ -> Subtract 0.5 (Defaults on the Math subtract nodes)
    float x = uv.x - 0.5;
    float y = uv.y - 0.5;
    
    // Math.003 (Greater Than): (Y - 0.5) > Bottom Edge Value
    float mask_bottom = step(bottom_edge_value, y);
    
    // Math.002 (Absolute): abs(X - 0.5)
    // Math.004 (Multiply): abs(X - 0.5) * sqrt(3)
    // Math.005 (Subtract): Height - (abs(X - 0.5) * sqrt(3))
    // Math.006 (Less Than): (Y - 0.5) < Math.005
    float mask_sides = step(y, triangle_height - abs(x) * value_sqrt3);
    
    // Math.007 (Multiply): Intersect the two masks
    return mask_bottom * mask_sides;
}

void fragment() {
    // "Texture Coordinate" -> "Vector Math" (Scale)
    vec2 base_uv = UV * scale;
    
    float mask = 0.0;
    
    // The main tree sequence: adding displaced triangles together.
    mask += equilateral_triangle(base_uv + vec2(-1.0, -1.29999995));
    mask += equilateral_triangle(base_uv + vec2(-0.5, -0.4330127));
    mask += equilateral_triangle(base_uv + vec2(-1.5, -0.4330127));
    
    // Clamp to prevent values from blowing out where triangles overlap
    mask = clamp(mask, 0.0, 1.0);
    
    // Connect to "Material Output" (Surface)
    ALBEDO = vec3(mask);
}`

const sier = `
// Change to 'shader_type canvas_item;' if you are using this in 2D
shader_type spatial;
render_mode blend_mix, depth_draw_opaque, cull_back, diffuse_burley, specular_schlick_ggx;

// From the initial "Vector Math (SCALE)" node
uniform float scale = 6.0;

// Variables pulled from your inner "Value" nodes inside the Group
uniform float bottom_edge_value = 0.0;
uniform float value_2h3 = 0.577350269;   // "2h/3" node: roughly sqrt(3)/3
uniform float value_sqrt3 = 1.732050807; // "sqrt(3)" node

// This function perfectly replicates the internal logic of your "Group" nodes
float equilateral_triangle(vec2 uv) {
    // Separate XYZ -> Subtract 0.5 (Defaults on the Math subtract nodes)
    float x = uv.x - 0.5;
    float y = uv.y - 0.5;
    
    // Math.003 (Greater Than): (Y - 0.5) > Bottom Edge Value
    float mask_bottom = step(bottom_edge_value, y);
    
    // Math.002 (Absolute): abs(X - 0.5)
    // Math.004 (Multiply): abs(X - 0.5) * sqrt(3)
    // Math.005 (Subtract): 2h/3 - (abs(X - 0.5) * sqrt(3))
    // Math.006 (Less Than): (Y - 0.5) < Math.005
    float mask_sides = step(y, value_2h3 - abs(x) * value_sqrt3);
    
    // Math.007 (Multiply): Intersect the two masks
    return mask_bottom * mask_sides;
}

void fragment() {
    // "Texture Coordinate" -> "Vector Math" (Scale)
    vec2 base_uv = UV * scale;
    
    float mask = 0.0;
    
    // The main tree sequence: adding displaced triangles together.
    // These specific vectors match the Vector Math (ADD) values from your JSON.
    mask += equilateral_triangle(base_uv + vec2(-1.0, -1.29999995));
    mask += equilateral_triangle(base_uv + vec2(-0.5, -0.4330127));
    mask += equilateral_triangle(base_uv + vec2(-1.5, -0.4330127));
    
    // Note: If your graph has more groups than shown in the primary snippet, 
    // simply copy the line above and paste the corresponding X and Y Vector Math ADD values.
    
    // Clamp to prevent values from blowing out where triangles might overlap
    mask = clamp(mask, 0.0, 1.0);
    
    // Connect to "Material Output" (Surface)
    ALBEDO = vec3(mask);
}`




async function rainbowWave(pos: Vector3) {

  const rw = spawnPrimitive.rainbowWaveLoop2(pos, new Vector3(2, 2, 2), Quaternion.one, Color.white, 1, 'Concave', 'Static', undefined);

  const nodeId = rw.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, rainbowShader);
  

  // Async.setInterval(() => {
  //   const playerPos = Player.position.get();
  //   if (playerPos) {
  //     const distance = playerPos.distanceTo(pos);
  //     const normalizedDistance =
  //       distance <= 5 ? 0 :
  //         distance >= 6 ? 1 :
  //           distance - 5;

  //     const nodeId = rw.mesh.nodeID ?? -1;
  //     Godot.shader.updateNumber(nodeId, 'input_value', normalizedDistance);
  //   }
  // }, 50);
}

async function nissanGtr(pos: Vector3) {

  const rw = spawnPrimitive.nissanGtr32Exp(pos, new Vector3(2, 2, 2), Quaternion.one, Color.white, 1, 'Concave', 'Static', undefined);

  const nodeId = rw.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, rs2);
  

  // Async.setInterval(() => {
  //   const playerPos = Player.position.get();
  //   if (playerPos) {
  //     const distance = playerPos.distanceTo(pos);
  //     const normalizedDistance =
  //       distance <= 5 ? 0 :
  //         distance >= 6 ? 1 :
  //           distance - 5;

  //     const nodeId = rw.mesh.nodeID ?? -1;
  //     Godot.shader.updateNumber(nodeId, 'input_value', normalizedDistance);
  //   }
  // }, 50);
}



const shaderCodeNew = `
  shader_type spatial;

  uniform float dissolve : hint_range(0.0, 1.0) = 0.0;
  uniform float noise_scale = 50.0;

  float hash(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.1));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise3d(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);

      f = f * f * (3.0 - 2.0 * f);

      float n000 = hash(i + vec3(0,0,0));
      float n100 = hash(i + vec3(1,0,0));
      float n010 = hash(i + vec3(0,1,0));
      float n110 = hash(i + vec3(1,1,0));
      float n001 = hash(i + vec3(0,0,1));
      float n101 = hash(i + vec3(1,0,1));
      float n011 = hash(i + vec3(0,1,1));
      float n111 = hash(i + vec3(1,1,1));

      return mix(
          mix(
              mix(n000, n100, f.x),
              mix(n010, n110, f.x),
              f.y
          ),
          mix(
              mix(n001, n101, f.x),
              mix(n011, n111, f.x),
              f.y
          ),
          f.z
      );
  }

  void fragment() {
      float n = noise3d(VERTEX * noise_scale);

      // Equivalent to Blender's Less Than node
      if (n >= dissolve) {
          discard;
      }

      ALBEDO = vec3(1.0);
      EMISSION = vec3(1.0);
  }
`;

const rs2 = `
shader_type spatial;
// Removed "blend_mix" and "depth_draw_opaque" to force a solid, opaque material
render_mode cull_back, diffuse_burley, specular_schlick_ggx;

// Controls how fast the spiral animates
uniform float time_scale = 1.0;

// Varying to pass local vertex position from vertex to fragment shader
varying vec3 local_pos;

void vertex() {
    // Equivalent to Blender's Texture Coordinate -> Object
    local_pos = VERTEX;
}

// Custom HSV to RGB function
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void fragment() {
    // 1. Get the local position of the object
    vec3 pos = local_pos;
    
    // 2. Isolate the Y-axis (Vertical) and wrap it
    float y_wrap = fract(pos.y);
    
    // 3. Drive the value purely with Godot's built-in TIME and wrap it
    float val_wrap = fract(TIME * time_scale);
    
    // 4. Combine the object's Y data with the continuous time data
    float final_factor = fract(y_wrap + val_wrap);
    
    // 5. Output to the color ramp replacement (HSV Hue mapping)
    vec3 final_color = hsv2rgb(vec3(final_factor, 1.0, 1.0));
    
    // 6. Set the final surface color
    ALBEDO = final_color;
    
    // 7. Explicitly force the material to be fully opaque
    ALPHA = 1.0;
}
`

const rainbowShader = `
shader_type spatial;
// Removed "blend_mix" and "depth_draw_opaque" to force a solid, opaque material
render_mode cull_back, diffuse_burley, specular_schlick_ggx;

// Controls how fast the spiral animates
uniform float time_scale = 1.0;

// Varying to pass local vertex position from vertex to fragment shader
varying vec3 local_pos;

void vertex() {
    // Equivalent to Blender's Texture Coordinate -> Object
    local_pos = VERTEX;
}

// Custom HSV to RGB function
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void fragment() {
    // 1. Get the local position of the object
    vec3 pos = local_pos;
    
    // 2. Isolate the Z-axis and wrap it (fract behaves like Blender's Wrap)
    float z_wrap = fract(pos.z);
    
    // 3. Drive the value purely with Godot's built-in TIME and wrap it
    float val_wrap = fract(TIME * time_scale);
    
    // 4. Combine the object's Z data with the continuous time data
    float final_factor = fract(z_wrap + val_wrap);
    
    // 5. Output to the color ramp replacement (HSV Hue mapping)
    vec3 final_color = hsv2rgb(vec3(final_factor, 1.0, 1.0));
    
    // 6. Set the final surface color
    ALBEDO = final_color;
    
    // 7. Explicitly force the material to be fully opaque
    ALPHA = 1.0;
}
`

//The color on this needs to be 100% bright after the avg is determined
const shaderCodeSpiral = `
  shader_type spatial;

  uniform float proximity;

  void fragment() {
    vec2 uv = UV - 0.5;
    uv *= proximity;

    float fracX = fract(uv.x);
    float fracY = fract(uv.y);

    float blenderX = abs(fracX - 0.5);
    float blenderY = abs(fracY - 0.5);

    float maxUV = max(blenderX, blenderY);

    float mulled = maxUV * 0.5;
    mulled -= 0.25;

    float result = abs(mulled); 

    ALBEDO = vec3(result);
    ALPHA = 1.0;
  }
`;



function createVisibleTrigger(diameter: number, pos: Vector3, rot: Quaternion): Entity {
  const triggerEntity = new Entity(pos, rot, new Vector3(diameter, diameter, diameter), undefined, 'Static');

  triggerEntity.trigger.initialize(diameter / 2, undefined);
  triggerEntity.trigger.setVisible(true, Color.green);

  return triggerEntity;
}



let floorCanvasEntity: Entity | undefined;
let floorTexture: Texture | undefined;

let floorCanvasCenter = Vector3.zero;

let drawAsyncID = 0;

export type BrushType = 'Square' | 'Round' | 'NoiseSquare' | 'NoiseRound' | 'Spray';

let hue = Math.random();
let drawColor = Color.fromHSV(hue, 1, 1);
let brushType: BrushType = 'Square';
let brushRadius = 50;
let alpha = 1;
let hardness = 0.5;
let noiseDensity = 0.75;

function createPaintableFloorCanvas(pos: Vector3, canvasColor: Color, imageSize: number) {
  floorCanvasEntity = spawnPrimitive.plane('Front', pos, new Vector3(10, 10, 10), Quaternion.fromEuler(new Vector3(-Math.PI / 2, 0, 0)), canvasColor, 1, 'Concave', 'Static', undefined);

  spawnDrawToolAdjustmentTriggers(pos.add(new Vector3(0, 0, -8)));

  floorCanvasCenter = pos;

  floorTexture = new Texture(imageSize, imageSize);
  floorCanvasEntity.mesh.texture.set(floorTexture, true);


  floorCanvasEntity.trigger.initialize((5), (0.6)); //Swap with square trigger when available
  floorCanvasEntity.trigger.setOccupiedFunction(() => {
    Async.clearTimer(drawAsyncID);

    drawAsyncID = Async.setInterval(() => {
      if (floorCanvasEntity && floorTexture) {
        draw(floorTexture, imageSize, drawColor, brushType, brushRadius, alpha, hardness, noiseDensity);
      }
    }, 15);
  });

  floorCanvasEntity.trigger.setEmptyFunction(() => {
    Async.clearTimer(drawAsyncID);
  })
}

function spawnDrawToolAdjustmentTriggers(pos: Vector3) {
  const colorBall = spawnPrimitive.sphere(6, 6, pos.add(new Vector3(-1.5, 1.5, 0)), 0.5, Quaternion.one, drawColor, 1, 'None', 'Static', undefined);
  colorBall.trigger.initialize(0.25, undefined);
  colorBall.trigger.setOccupiedFunction(() => { adjustSetting(colorBall, 'Color', undefined, undefined); });

  const brushTypeTrigger = createVisibleTrigger(0.5, pos.add(new Vector3(0, 1.5, 0)), Quaternion.one);
  brushTypeTrigger.text.create('Brush Type:\n' + brushType.toString(), 10, 0);
  brushTypeTrigger.trigger.setOccupiedFunction(() => { adjustSetting(brushTypeTrigger, 'BrushType', undefined, undefined); });

  const brushRadiusTrigger = createVisibleTrigger(0.5, pos.add(new Vector3(1.5, 1.5, 0)), Quaternion.one);
  brushRadiusTrigger.text.create('Brush Radius:\n' + brushRadius.toString(), 10, 0);
  brushRadiusTrigger.trigger.setOccupiedFunction(() => { adjustSetting(brushRadiusTrigger, 'BrushRadius', 10, 100); });

  const alphaTrigger = createVisibleTrigger(0.5, pos.add(new Vector3(3, 1.5, 0)), Quaternion.one);
  alphaTrigger.text.create('Alpha:\n' + alpha.toString(), 10, 0);
  alphaTrigger.trigger.setOccupiedFunction(() => { adjustSetting(alphaTrigger, 'Alpha', 0.25, 1); });

  const hardnessTrigger = createVisibleTrigger(0.5, pos.add(new Vector3(4.5, 1.5, 0)), Quaternion.one);
  hardnessTrigger.text.create('Hardness:\n' + hardness.toString(), 10, 0);
  hardnessTrigger.trigger.setOccupiedFunction(() => { adjustSetting(hardnessTrigger, 'Hardness', 0.25, 1); });

  const noiseDensityTrigger = createVisibleTrigger(0.5, pos.add(new Vector3(6, 1.5, 0)), Quaternion.one);
  noiseDensityTrigger.text.create('Noise Density:\n' + noiseDensity.toString(), 10, 0);
  noiseDensityTrigger.trigger.setOccupiedFunction(() => { adjustSetting(noiseDensityTrigger, 'NoiseDensity', 0.25, 1); });
}

type DrawSetting = 'Color' | 'BrushType' | 'BrushRadius' | 'Alpha' | 'Hardness' | 'NoiseDensity';

let brushIndex = 0;

function adjustSetting(entityToUpdate: Entity, setting: DrawSetting, incrementAmount: number | undefined, max: number | undefined) {
  const triggerPos = entityToUpdate.pos;
  const rightHand = Player.rightHand.position.get();
  const leftHand = Player.leftHand.position.get();

  let isRightHand = true;

  if (rightHand && leftHand) {
    isRightHand = (rightHand.distanceTo(triggerPos)) <= (leftHand.distanceTo(triggerPos));
  }

  if (setting === 'Color') {
    hue += isRightHand ? (1 / 40) : (39 / 40);
    hue = (hue % 1);

    drawColor = Color.fromHSV(hue, 1, 1);  //change to get color from color picker
    entityToUpdate.mesh.material.tintColor.set(drawColor, 1);
  }

  else if (setting === 'BrushType') {
    const brushTypeArray: BrushType[] = [
      'Square',
      'Round',
      'NoiseSquare',
      'NoiseRound',
      'Spray',
    ];

    brushIndex = isRightHand ? ((brushIndex + 1) % brushTypeArray.length) : (((brushIndex - 1) + brushTypeArray.length) % brushTypeArray.length);
    brushType = brushTypeArray[brushIndex];

    entityToUpdate.text.display.set('Brush Type:\n' + brushType.toString());
  }

  else if (incrementAmount && max) {
    if (setting === 'BrushRadius') {
      brushRadius = isRightHand ? (Math.min(max, brushRadius + incrementAmount)) : (Math.max(0, brushRadius - incrementAmount));
      entityToUpdate.text.display.set('Brush Radius:\n' + brushRadius.toString());
    }
    else if (setting === 'Alpha') {
      alpha = isRightHand ? (Math.min(max, alpha + incrementAmount)) : (Math.max(0, alpha - incrementAmount));
      entityToUpdate.text.display.set('Alpha:\n' + alpha.toString());
    }
    else if (setting === 'Hardness') {
      hardness = isRightHand ? (Math.min(max, hardness + incrementAmount)) : (Math.max(0, hardness - incrementAmount));
      entityToUpdate.text.display.set('Hardness:\n' + hardness.toString());
    }
    else if (setting === 'NoiseDensity') {
      noiseDensity = isRightHand ? (Math.min(max, noiseDensity + incrementAmount)) : (Math.max(0, noiseDensity - incrementAmount));
      entityToUpdate.text.display.set('Noise Density:\n' + noiseDensity.toString());
    }
  }
}


function getNearestPixel(imageSize: number): Vector2 | undefined {
  const footPos = Player.foot.position.get();

  if (floorCanvasEntity && floorTexture && footPos) {
    const localX = footPos.x - floorCanvasCenter.x;
    const localZ = floorCanvasCenter.z - footPos.z;

    const u = Math.min(1, Math.max(0, ((localX / 10) + 0.5)));
    const v = Math.min(1, Math.max(0, ((localZ / 10) + 0.5)));

    const pixelX = Math.min((imageSize - 1), Math.floor(u * imageSize));
    const pixelY = Math.min((imageSize - 1), Math.floor(v * imageSize));

    return new Vector2(pixelX, pixelY);
  }
  else {
    return undefined;
  }
}


/**
 * Applies desired brush settings to a designated texture and updates it
   * @param texture to alter pixels of
   * @param imageSizePixels dimensions of texture ie. 1024 if a 1024x1024 image 
   * @param drawColor to draw with
   * @param brushType shape and style to draw with
   * @param brushRadius in pixels 
   * @param alpha to apply, 0-1 with 1 being fully opaque
   * @param hardness of brush, 0-1 with lower values producing a softer blended effect around the edges
   * @param noiseDensity 0-1 that reflects the concentration of pixels affected. Lower values are more sparse
 */

const numDrawRings = 5;

function draw(texture: Texture, imageSizePixels: number, drawColor: Color, brushType: BrushType, brushRadius: number, alpha: number, hardness: number, noiseDensity: number | undefined) {  //parameter to affect blendPixelsColor originalPercentRemaining?
  const centerPixel = getNearestPixel(imageSizePixels);

  const radius = Math.max(1, Math.round(brushRadius));

  const pixels: Vector2[] = [];
  const alphas: number[] = [];
  const dists: number[] = [];

  const isBlended = hardness < 1;

  if (centerPixel) {
    if (brushType === 'Square') {
      // if (!isBlended) {
      //   const startPixel = new Vector2(centerPixel.x - radius, centerPixel.y - radius);
      //   const rectSize = new Vector2((radius * 2) + 1, (radius * 2) + 1);

      //   texture.fillRectWithColor(startPixel, rectSize, drawColor, alpha);  //currently does not work when !isBlended/ hardness = 1... trying setPixelsColor to see if that works instead
      // }
      // else {
      for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
          const pixelDist = Math.max(Math.abs(x), Math.abs(y)) / radius;
          const pixelAlpha = computeAlphaViaHardness(pixelDist, alpha, hardness);

          pixels.push(new Vector2(centerPixel.x + x, centerPixel.y + y));
          alphas.push(pixelAlpha);
          dists.push(pixelDist);
        }
      }

      if (!isBlended) {
        texture.setPixelsColor(pixels, drawColor, alpha);
      }
      else {
        groupPixelsByRing(pixels, alphas, dists, numDrawRings).forEach((ring) => {
          texture.blendPixelsColor(ring.pixels, drawColor, ring.alpha, 0.85);
        });
      }
      // }
    }

    else if (brushType === 'Round') {
      for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
          const pixelDist = Math.sqrt((x * x) + (y * y)) / radius;

          if (pixelDist <= 1) {
            const pixelAlpha = computeAlphaViaHardness(pixelDist, alpha, hardness);

            pixels.push(new Vector2(centerPixel.x + x, centerPixel.y + y));
            alphas.push(pixelAlpha);
            dists.push(pixelDist);
          }
        }
      }

      if (!isBlended) {
        texture.setPixelsColor(pixels, drawColor, alpha);
      }
      else {
        groupPixelsByRing(pixels, alphas, dists, numDrawRings).forEach((ring) => {
          texture.blendPixelsColor(ring.pixels, drawColor, ring.alpha, 0.85);
        });
      }
    }

    else if (brushType === 'NoiseSquare') {
      for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
          if (!noiseDensity || Math.random() < noiseDensity) {
            const pixelDist = Math.max(Math.abs(x), Math.abs(y)) / radius;
            const pixelAlpha = computeAlphaViaHardness(pixelDist, alpha, hardness);

            pixels.push(new Vector2(centerPixel.x + x, centerPixel.y + y));
            alphas.push(pixelAlpha);
            dists.push(pixelDist);
          }
        }
      }

      if (!isBlended) {
        texture.setPixelsColor(pixels, drawColor, alpha);
      }
      else {
        groupPixelsByRing(pixels, alphas, dists, numDrawRings).forEach((ring) => {
          texture.blendPixelsColor(ring.pixels, drawColor, ring.alpha, 0.85);
        });
      }
    }

    else if (brushType === 'NoiseRound') {
      for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
          if (!noiseDensity || Math.random() < noiseDensity) {
            const pixelDist = Math.sqrt((x * x) + (y * y)) / radius;

            if (pixelDist <= 1) {
              const pixelAlpha = computeAlphaViaHardness(pixelDist, alpha, hardness);

              pixels.push(new Vector2(centerPixel.x + x, centerPixel.y + y));
              alphas.push(pixelAlpha);
              dists.push(pixelDist);
            }
          }
        }
      }

      if (!isBlended) {
        texture.setPixelsColor(pixels, drawColor, alpha);
      }
      else {
        groupPixelsByRing(pixels, alphas, dists, numDrawRings).forEach((ring) => {
          texture.blendPixelsColor(ring.pixels, drawColor, ring.alpha, 0.85);
        });
      }
    }

    else if (brushType === 'Spray') {
      const circ = Math.PI * (radius * radius);
      const sprayAttempts = Math.floor(circ * (noiseDensity ?? 0.35));  //0.35 a good baseline?

      for (let i = 0; i < sprayAttempts; i++) {
        const a = Math.floor(Math.random() * 100);
        const b = Math.floor(Math.random() * 100);

        const dist = Math.min(a, b) / 99;
        const angle = Math.random() * (Math.PI * 2);

        const offsetX = Math.round((dist * radius) * Math.cos(angle));
        const offsetY = Math.round((dist * radius) * Math.sin(angle));

        const pixelAlpha = computeAlphaViaHardness(dist, alpha, hardness);

        pixels.push(new Vector2(centerPixel.x + offsetX, centerPixel.y + offsetY));
        alphas.push(pixelAlpha);
        dists.push(dist);
      }

      if (!isBlended) {
        texture.setPixelsColor(pixels, drawColor, alpha);
      }
      else {
        groupPixelsByRing(pixels, alphas, dists, numDrawRings).forEach((ring) => {
          texture.blendPixelsColor(ring.pixels, drawColor, ring.alpha, 0.85);
        });
      }
    }
  }

  texture.updateTexture();
}


function groupPixelsByRing(pixels: Vector2[], alphas: number[], dists: number[], numRings: number): Array<{ pixels: Vector2[]; alpha: number }> {
  const bucketPixels = new Map<number, Vector2[]>();
  const bucketAlphaCount = new Map<number, number>();
  const bucketAlphaSum = new Map<number, number>();

  for (let i = 0; i < pixels.length; i++) {
    const ring = Math.min(numRings - 1, Math.floor(dists[i] * numRings));

    if (!bucketPixels.has(ring)) {
      bucketPixels.set(ring, []);
      bucketAlphaCount.set(ring, 0);
      bucketAlphaSum.set(ring, 0);
    }

    bucketPixels.get(ring)!.push(pixels[i]);
    bucketAlphaCount.set(ring, bucketAlphaCount.get(ring)! + 1);
    bucketAlphaSum.set(ring, bucketAlphaSum.get(ring)! + alphas[i]);
  }

  const array: Array<{ pixels: Vector2[]; alpha: number }> = [];

  bucketPixels.forEach((ringPixels, ring) => {
    const avgAlpha = bucketAlphaSum.get(ring)! / bucketAlphaCount.get(ring)!;
    array.push({ pixels: ringPixels, alpha: avgAlpha });
  });

  return array;
}


function computeAlphaViaHardness(dist: number, maxAlpha: number, hardness: number): number {
  const alphaAtMinHardness = maxAlpha * (0.5 + 0.5 * Math.cos(dist * Math.PI));

  return hardness * maxAlpha + (1 - hardness) * alphaAtMinHardness;
}
