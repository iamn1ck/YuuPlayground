import { Async } from "./Yuu API/Async";
import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Entity } from "./Yuu API/Entity";
import { Paint } from "./Yuu API/Paint";
import { Player } from "./Yuu API/Player";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Texture } from "./Yuu API/Texture";


export const playgroundDemos = {
  colorPicker,
  canvas,
  spawnPaintableSphere,
  spawnShaderSphere,
  spawnDissolveCube,
  spawnDissolveCubeBig,
  spawnDissolveCubeSmall,
  spawnDissolveCubeBest,
  spawnDissolveCubeRm,
  spawnDissolveCubeRm1,
  spawnDissolveCubeRm2,
  spawnDissolveCubeRm3,
  spawnDissolveCubeNoUniform
}


let colorPickerPlane: Entity | undefined;

async function colorPicker(pos: Vector3, rot: Quaternion, scale: Vector3) {
  colorPickerPlane = spawnPrimitive.plane('Front', pos, scale, rot, Color.white, 0.05, 'Concave', 'Static', undefined);

  const width = 128;
  const height = Math.floor(width * (scale.y / scale.x));

  const texture = new Texture(width, height);
  texture.fillWithColor(Color.white, 0);
  const queue: [Vector2, Color][] = [];

  // This causes 1 frame of head lock, could be moved into a while loop with a brief await
  // Alternatively just save the file into the default app
  const hueHeight = height * 0.975;

  let y = 0;
  while (y < height) {
    const hue = y / hueHeight;

    for (let x = 1; x < width - 1; x++) {
      let xPercent = x / width;

      if (xPercent < 0.65) {
        xPercent *= 0.76923;
      }
      else {
        xPercent -= 0.15;
      }

      const value = Math.min(1, y > hueHeight ? xPercent : (xPercent * 2));
      let saturation = 0;
      if (y <= hueHeight) {
        saturation = 1 - (Math.max(0, xPercent - 0.5) * 2);
      }

      queue.push([new Vector2(x, y), Color.fromHSV(hue, saturation, value)]);
    }

    if (y % 50 === 0) {
      await Async.wait(15);
    }
    y++;
  }

  let count = 0;

  while (queue.length > 0) {
    count++;
    const current = queue.pop();

    if (current) {
      texture.setPixelsColor([current[0]], current[1], 1);
    }

    if (count > 3_000) {
      count = 0;
      await Async.wait(15);
    }
  }

  colorPickerPlane.rayClick.initialize(true);
  colorPickerPlane.rayClick.setHeldFunction((rayHit) => {
    if (rayHit.uv) {
      const colorPicked = colorPickerPlane?.mesh.texture.get()?.getUVColor(rayHit.uv);

      if (colorPicked) {
        Paint.properties.color.set(colorPicked.color);
      }
    }
  });

  colorPickerPlane.mesh.texture.set(texture, true);
  colorPickerPlane.mesh.texture.setDrawMode('NearestNeighbor');

  texture.updateTexture();
  texture.updateMipMaps();
}

let canvasPlane: Entity | undefined;

function canvas(pos: Vector3, rot: Quaternion, scale: Vector3) {
  const easel = new Entity(pos, rot, scale, undefined, 'Static');

  const woodColor = new Color(0.85, 0.75, 0.65);

  spawnPrimitive.cube(new Vector3(0, -0.1, -0.65), new Vector3(0.05, 2.25, 0.05), Quaternion.fromEuler(new Vector3((Math.PI / 6), 0, 0)), woodColor, 1, true, 'Static', easel);
  spawnPrimitive.cube(new Vector3(-0.5, 0, 0.5), new Vector3(0.05, 2.55, 0.02), Quaternion.fromEuler(new Vector3((-Math.PI / 6), 0, -(Math.PI / 6))), woodColor, 1, true, 'Static', easel);
  spawnPrimitive.cube(new Vector3(0.5, 0, 0.5), new Vector3(0.05, 2.55, 0.04), Quaternion.fromEuler(new Vector3((-Math.PI / 6), 0, (Math.PI / 6))), woodColor, 1, true, 'Static', easel);
  spawnPrimitive.cube(new Vector3(0, 0, 0.55), new Vector3(0.05, 1.5, 0.02), Quaternion.fromEuler(new Vector3(0, (-Math.PI / 4), (Math.PI / 2))), woodColor, 1, false, 'Static', easel);

  const canvasPos = new Vector3(0, 0.525, 0.185);
  const canvasScale = new Vector3(1.25, 1.25, 0.01);
  canvasPlane = spawnPrimitive.plane('Front', canvasPos, canvasScale, Quaternion.fromEuler(new Vector3(0, (-Math.PI / 5.35), (-Math.PI / 2))), Color.white, 1, 'Concave', 'Static', easel);
  spawnPrimitive.cube(canvasPos, canvasScale, Quaternion.fromEuler(new Vector3(0, (-Math.PI / 5.35), (-Math.PI / 2))), Color.white, 0, false, 'Static', easel);
  spawnPrimitive.plane('Back', new Vector3(0, 0.525, 0.185), new Vector3(1.25, 1.25, 0.01), Quaternion.fromEuler(new Vector3(0, (-Math.PI / 5.35), (-Math.PI / 2))), Color.white, 1, 'None', 'Static', easel);

  canvasPlane.mesh.texture.set(new Texture(2048, 2048), false);
  canvasPlane.mesh.texture.isPaintable.set(true);


  const brushTexture = Paint.getBrushTexture();

  const brushPreview = spawnPrimitive.plane('Front', pos.add(new Vector3(0, 1.35, -0.25)), new Vector3(0.5, 0.5, 0.5), Quaternion.one, Color.white, 0.5, 'None', 'Static', undefined);

  brushPreview.mesh.texture.set(brushTexture, false);
}

let paintableSphere: Entity | undefined;

function spawnPaintableSphere(pos: Vector3) {
  paintableSphere = spawnPrimitive.sphere(16, 16, pos, 1, Quaternion.fromEuler(new Vector3(0, Math.PI, 0)), Color.white, 1, 'Concave', 'Static', undefined);

  paintableSphere.mesh.texture.set(new Texture(2048, 2048), false);
  paintableSphere.mesh.texture.setMipMaps(false);

  paintableSphere.mesh.texture.isPaintable.set(true);
}

function spawnShaderSphere(pos: Vector3) {
  const shaderSphere = spawnPrimitive.sphere(32, 32, pos, 2, Quaternion.fromEuler(new Vector3(0, 180, 0)), Color.white, 1, 'None', 'Static', undefined);

  shaderSphere.trigger.initialize(1, undefined);
  shaderSphere.trigger.setOccupiedFunction((occupiedTriggerPayload) => {
    Player.position.set(occupiedTriggerPayload.pos.add(new Vector3(0, 5, 0)));
  });

  const texture2 = new Texture(8, 8);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const isLeft = x < 4;
      const isTop = y < 4;
      let r = 0, g = 0, b = 0;
      if (isTop && isLeft)       { r = 1; g = 0; b = 0; } // top-left: red
      else if (isTop && !isLeft) { r = 0; g = 1; b = 0; } // top-right: green
      else if (!isTop && isLeft) { r = 0; g = 0; b = 1; } // bottom-left: blue
      else                       { r = 1; g = 1; b = 1; } // bottom-right: white
      Godot.image.setPixelsColor(texture2.imageID, new Int32Array([x, y]), r, g, b, 1.0);
    }
  }

  Godot.image.updateTexture(texture2.imageID);
  shaderSphere.mesh.texture.set(texture2, false);
  shaderSphere.mesh.texture.setMipMaps(false);

  Godot.shader.applyToMesh(shaderSphere.mesh.nodeID ?? -1, shaderCodeSpiral);

  const initialPlayerPos = Player.position.get();
  if (initialPlayerPos) {
    const nodeId = shaderSphere.mesh.nodeID ?? -1;
    Godot.shader.updateColor(nodeId, 'player_pos', initialPlayerPos.x, initialPlayerPos.y, initialPlayerPos.z);
    Godot.shader.updateColor(nodeId, 'sphere_pos', pos.x, pos.y, pos.z);
  }

  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      const distance = playerPos.distanceTo(pos);
      // Map distance: 1.0 (white) at sphere surface (0.5m) down to 0.0 (black) at 8.0m
      // if difference is above 10 cap it at 10, if below 2 cap it at 2
      const proximityMinMax = Math.max(2, Math.min(10, distance));

      const nodeId = shaderSphere.mesh.nodeID ?? -1;
      Godot.shader.updateNumber(nodeId, 'proximity', proximityMinMax);
      Godot.shader.updateColor(nodeId, 'player_pos', playerPos.x, playerPos.y, playerPos.z);
      Godot.shader.updateColor(nodeId, 'sphere_pos', pos.x, pos.y, pos.z);
    }
  }, 50);
}

// create a cube and attach shadercode new/
async function spawnDissolveCube(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(1,1,1), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shaderCodeStatic);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      const distance = playerPos.distanceTo(pos);
      const normalizedDistance =
        distance <= 5 ? 0 :
          distance >= 6 ? 1 :
            distance - 5;

      const nodeId = cube.mesh.nodeID ?? -1;
      Godot.shader.updateNumber(nodeId, 'dissolve', normalizedDistance);
    }
  }, 50);
}

// create a cube and attach shadercode new/
async function spawnDissolveCubeSmall(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(0.25,0.25,0.25), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shaderCodeNew);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      const distance = playerPos.distanceTo(pos);
      const normalized = distance <= 2 ? 0 :
        distance >= 3 ? 1 :
          distance - 2;

      const nodeId = cube.mesh.nodeID ?? -1;
      Godot.shader.updateNumber(nodeId, 'dissolve', normalized);
    }
  }, 50);
}


// create a cube and attach shadercode new/
async function spawnDissolveCubeBig(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(10,1,10), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shaderCodeNew);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      const distance = playerPos.distanceTo(pos);
      const normalizedDistance =
        distance <= 5 ? 0 :
          distance >= 6 ? 1 :
            distance - 5;

      const nodeId = cube.mesh.nodeID ?? -1;
      Godot.shader.updateNumber(nodeId, 'dissolve', normalizedDistance);
    }
  }, 50);
}


// create a cube and attach shadercode new/
async function spawnDissolveCubeNoUniform(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(1,5,10), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(true)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shaderCodeNoUniform);
  
  // no uniform needed for the
  // Async.setInterval(() => {
  //   const playerPos = Player.position.get();
  //   if (playerPos) {
  //     const distance = playerPos.distanceTo(pos);
  //     const normalizedDistance =
  //       distance <= 5 ? 0 :
  //         distance >= 6 ? 1 :
  //           distance - 5;

  //     const nodeId = cube.mesh.nodeID ?? -1;
  //     Godot.shader.updateNumber(nodeId, 'dissolve', normalizedDistance);
  //   }
  // }, 50);
}

// create a cube and attach shadercode new/
async function spawnDissolveCubeBest(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(10,1,10), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shaderGrid);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      Godot.shader.updateColor(nodeId, 'camera_coords', playerPos.x, playerPos.y, playerPos.z);

    }
  }, 50);
}

// create a cube and attach shadercode new/
async function spawnDissolveCubeRm(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(10,2,10), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shader33);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      Godot.shader.updateColor(nodeId, 'player_position', playerPos.x, playerPos.y, playerPos.z);

    }
  }, 50);
}

// create a cube and attach shadercode new/
async function spawnDissolveCubeRm1(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(1,1,1), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shader34);
  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    if (playerPos) {
      Godot.shader.updateColor(nodeId, 'player_position', playerPos.x, playerPos.y, playerPos.z);

    }
  }, 50);
}


// create a cube and attach shadercode new/
async function spawnDissolveCubeRm2(pos: Vector3) {

  const cube = spawnPrimitive.cubeScaled(pos, new Vector3(1,10,10), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shader35);

  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    const scale = cube.scale;
    if (playerPos) {
      Godot.shader.updateColor(nodeId, 'player_position', playerPos.x, playerPos.y, playerPos.z);
      Godot.shader.updateColor(nodeId, 'object_scale', scale.x, scale.y, scale.z);

    }
  }, 50);
}

// create a cube and attach shadercode new/
async function spawnDissolveCubeRm3(pos: Vector3) {

  const cube = spawnPrimitive.cubeScaled(pos, new Vector3(10,10,1), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(false)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, shader36);

  
  Async.setInterval(() => {
    const playerPos = Player.position.get();
    const scale = cube.scale;
    if (playerPos) {
      Godot.shader.updateColor(nodeId, 'player_position', playerPos.x, playerPos.y, playerPos.z);
      Godot.shader.updateColor(nodeId, 'object_scale', scale.x, scale.y, scale.z);

    }
  }, 50);
}

const shader36 = `
shader_type spatial;

// Exposed parameters
uniform float dissolve_start_distance = 5.0; // Distance where it starts fading out (solid here)
uniform float dissolve_end_distance = 1.0;   // Distance where it is completely gone (transparent here)
uniform float noise_scale = 50.0;

varying vec3 local_pos;

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

void vertex() {
    local_pos = VERTEX;
}

void fragment() {
    float n = noise3d(local_pos * noise_scale);

    float distance_to_player = length(VERTEX); 
      
    // INVERTED LOGIC:
    // If distance is >= 5.0 (start_distance), visibility is 1.0 (Solid)
    // If distance is <= 1.0 (end_distance), visibility is 0.0 (Dissolved)
    float visibility = smoothstep(dissolve_end_distance, dissolve_start_distance, distance_to_player);

    // If the noise value is higher than our current visibility, discard the pixel
    if (n >= visibility) {
        discard;
    }

    ALBEDO = vec3(1.0);
    EMISSION = vec3(1.0);
}`

const shader35 = `
shader_type spatial;
render_mode depth_draw_opaque, cull_disabled;

// Material Properties
uniform vec4 base_color : source_color = vec4(0.8, 0.8, 0.8, 1.0);
uniform float metallic = 0.0;
uniform float roughness = 0.5;

// Proximity/Bubble Properties
uniform vec3 player_position = vec3(0.0, 0.0, 0.0);
uniform float bubble_inner_radius = 1.0; 
uniform float bubble_outer_radius = 5.0; 

// Internal Solid Cube Properties
uniform vec4 grid_color : source_color = vec4(0.0, 1.0, 0.8, 1.0);
uniform float grid_scale = 2.0;
uniform float cube_fill = 0.6; // How much of the 3D cell the solid cube takes up (0.0 to 1.0)
uniform int grid_steps = 64; 

// ---> NEW: Add the scale uniform here
uniform vec3 object_scale = vec3(1.0, 1.0, 1.0);

varying vec3 world_pos;
varying vec3 local_pos;

// White Noise generation function
float random(vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void vertex() {
    world_pos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
    local_pos = VERTEX;
}

void fragment() {
    float range_diff = max(bubble_outer_radius - bubble_inner_radius, 0.0001); 
    float noise = random(FRAGCOORD.xy);
    
    if (FRONT_FACING) {
        // --- OUTSIDE THE OBJECT ---
        float dist_to_player = length(world_pos - player_position);
        float mapped_dist = clamp((dist_to_player - bubble_inner_radius) / range_diff, 0.0, 1.0);
        float alpha_clip = (mapped_dist > noise) ? 1.0 : 0.0;
        
        ALBEDO = base_color.rgb;
        METALLIC = metallic;
        ROUGHNESS = roughness;
        ALPHA = alpha_clip;
        
    } else {
        // --- INSIDE THE OBJECT (SOLID CUBE RAYMARCHING) ---
        vec3 local_ro = (inverse(MODEL_MATRIX) * vec4(CAMERA_POSITION_WORLD, 1.0)).xyz;
        vec3 local_rd = normalize(local_pos - local_ro);
        
        float ray_length = length(local_pos - local_ro);
        float step_size = ray_length / float(grid_steps);
        
        float hit = 0.0;
        vec3 p = local_ro; 
        vec3 hit_normal = vec3(0.0);
        
        for (int i = 0; i < grid_steps; i++) {
            p += local_rd * step_size;
            vec3 world_p = (MODEL_MATRIX * vec4(p, 1.0)).xyz;
            float hit_dist_to_player = length(world_p - player_position);
            
            // Only evaluate if we are inside the bubble boundary
            if (hit_dist_to_player <= bubble_outer_radius) {
                
                // ---> NEW: Multiply p by object_scale before fracturing
                vec3 cell_pos = fract(p * grid_scale * object_scale) - 0.5;
                vec3 abs_pos = abs(cell_pos);
                
                // Check if the current point is inside the cube's volume
                if (max(max(abs_pos.x, abs_pos.y), abs_pos.z) < (cube_fill * 0.5)) {
                    
                    float hit_mapped_dist = clamp((hit_dist_to_player - bubble_inner_radius) / range_diff, 0.0, 1.0);
                    
                    // Screen-door dither check
                    if (hit_mapped_dist > noise) {
                        hit = 1.0;
                        
                        // Depth Correction
                        vec4 hit_view = VIEW_MATRIX * vec4(world_p, 1.0);
                        vec4 hit_clip = PROJECTION_MATRIX * hit_view;
                        DEPTH = hit_clip.z / hit_clip.w;
                        
                        // Calculate normal for the specific face of the cube we hit
                        vec3 n = step(max(abs_pos.yzx, abs_pos.zxy), abs_pos.xyz) * sign(cell_pos);
                        
                        // Transform the local normal to View Space for Godot's lighting engine
                        hit_normal = normalize((VIEW_MATRIX * MODEL_MATRIX * vec4(n, 0.0)).xyz);
                        
                        break; 
                    }
                }
            }
        }
        
        ALBEDO = grid_color.rgb;
        EMISSION = grid_color.rgb * 0.2; // Lowered emission slightly so directional lighting is visible
        METALLIC = 0.0;
        ROUGHNESS = 0.8;
        ALPHA = hit;
        
        // Apply the calculated normal if we hit a solid face
        if (hit > 0.0) {
            NORMAL = hit_normal;
        }
    }
    
    // Discard empty space and dithered holes
    ALPHA_SCISSOR_THRESHOLD = 0.5;
}`


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

const shaderCodeStatic = `
shader_type spatial;

  uniform float dissolve : hint_range(0.0, 1.0) = 0.0;
  uniform float noise_scale = 50.0;

  // 1. Declare a varying to pass the local position from the vertex shader
  varying vec3 local_pos;

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

  void vertex() {
      // 2. Capture the local vertex position. 
      // Inside vertex(), VERTEX is in Object Space.
      local_pos = VERTEX;
  }

  void fragment() {
      // 3. Use 'local_pos' instead of 'VERTEX' for the noise generation
      float n = noise3d(local_pos * noise_scale);

      if (n >= dissolve) {
          discard;
      }

      ALBEDO = vec3(1.0);
      EMISSION = vec3(1.0);
  }`



// when you get closer it appears
const shaderCodeNoUniform = `
shader_type spatial;

// Exposed parameters to control the distance-based dissolve in the Inspector
uniform float dissolve_start_distance = 5.0; // Distance in meters where dissolving begins
uniform float dissolve_end_distance = 1.0;   // Distance in meters where it is completely dissolved
uniform float noise_scale = 50.0;

// Varying to pass the stable local position from the vertex to the fragment shader
varying vec3 local_pos;

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

void vertex() {
    // VERTEX here is in Object Space. We save it to 'local_pos' 
    // so the noise pattern stays completely locked to the physical mesh.
    local_pos = VERTEX;
}

void fragment() {
    // Generate the noise using the stable local coordinates
    float n = noise3d(local_pos * noise_scale);

    // In the fragment shader, VERTEX is in View Space (relative to the camera).
    // The length of this vector gives us the exact distance from the player to this pixel.
    float distance_to_player = length(VERTEX); 
      
    // Calculate how dissolved the material should be based on the distance.
    // smoothstep creates a smooth transition from 0.0 to 1.0 between the two distances.
    float current_dissolve = smoothstep(dissolve_start_distance, dissolve_end_distance, distance_to_player);

    if (n >= current_dissolve) {
        discard;
    }

    ALBEDO = vec3(1.0);
    EMISSION = vec3(1.0);
}
    `

//The color on this needs to be 100% bright after the avg is determined
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


const shaderGrid = `
shader_type spatial;
// cull_disabled allows the camera to go inside the box without it turning invisible
render_mode blend_mix, depth_draw_opaque, cull_disabled, unshaded;

// Standard 3D pseudo-random noise function
float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 144.7272))) * 43758.5453);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
                   mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
               mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
                   mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y), f.z);
}

// Helper function: Calculates where the camera's ray enters and exits a Godot BoxMesh
vec2 intersectAABB(vec3 rayOrigin, vec3 rayDir, vec3 boxMin, vec3 boxMax) {
    vec3 tMin = (boxMin - rayOrigin) / rayDir;
    vec3 tMax = (boxMax - rayOrigin) / rayDir;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    return vec2(tNear, tFar);
}

void fragment() {
    // 1. Setup the Ray: Where is the camera, and what direction is it looking? (Object Space)
    vec3 ro = (inverse(MODEL_MATRIX) * vec4(INV_VIEW_MATRIX[3].xyz, 1.0)).xyz;
    vec3 pixel_pos_obj = (inverse(MODEL_MATRIX) * vec4(INV_VIEW_MATRIX * vec4(VERTEX, 1.0))).xyz;
    vec3 rd = normalize(pixel_pos_obj - ro);

    // 2. Find where the ray enters and exits the standard Godot BoxMesh (-0.5 to 0.5)
    vec2 hit = intersectAABB(ro, rd, vec3(-0.5), vec3(0.5));
    float tNear = hit.x;
    float tFar = hit.y;

    // If the ray entirely misses the box, throw the pixel away
    if (tNear > tFar || tFar < 0.0) {
        discard;
    }

    // Don't draw behind the camera if we are standing inside the box
    tNear = max(tNear, 0.0);

    // 3. RAYMARCHING CONFIGURATION
    // Higher MAX_STEPS = better quality/sharper voxels, but costs more GPU.
    int MAX_STEPS = 64; 
    float step_size = (tFar - tNear) / float(MAX_STEPS);
    float t = tNear;

    float accumulated_alpha = 0.0;
    vec3 accumulated_emission = vec3(0.0);
    float fade_distance = 30.0;

    // 4. Step through the 3D volume
    for(int i = 0; i < MAX_STEPS; i++) {
        // Find the exact 3D coordinate of our current step
        vec3 sample_pos = ro + rd * t; 

        // --- Your Voxel Math ---
        float grid_scale = 10.0; 
        vec3 fract_pos = fract((sample_pos * grid_scale) + vec3(0.5));

        float math_x  = (fract_pos.x < 0.9) ? 1.0 : 0.0;
        float math1_x = (fract_pos.x > 0.1) ? 1.0 : 0.0;
        float math2   = math_x * math1_x;

        float math3_y = (fract_pos.y < 0.9) ? 1.0 : 0.0;
        float math4_y = (fract_pos.y > 0.1) ? 1.0 : 0.0;
        float math5   = math3_y * math4_y;

        float math6_z = (fract_pos.z < 0.9) ? 1.0 : 0.0;
        float math7_z = (fract_pos.z > 0.1) ? 1.0 : 0.0;
        float math8   = math6_z * math7_z;

        float math10 = (math2 * math5) * math8;

        // If we are currently inside the bounds of a voxel, calculate the noise/camera distance
        if (math10 > 0.0) {
            
            // Get view space position of this specific inner voxel
            vec3 view_pos = (VIEW_MATRIX * MODEL_MATRIX * vec4(sample_pos, 1.0)).xyz;
            vec3 scaled_vertex = view_pos / fade_distance;

            float math11 = abs(scaled_vertex.x);
            float math12 = abs(scaled_vertex.y);
            float math13 = abs(scaled_vertex.z);

            float math14 = pow(math11, 0.5);
            float math15 = pow(math12, 0.5);
            float math16 = pow(math13, 0.5);

            float math19 = pow((math14 + math15) + math16, 0.5);
            float math20 = (math19 < 2.0) ? 1.0 : 0.0;

            float n_val = noise(sample_pos * 50.0); 
            float map_range = clamp(math19, 0.0, 1.0); 
            float math21 = (n_val > map_range) ? 1.0 : 0.0;

            float math24 = math20 * math21 * 0.5;

            // If the noise allows this voxel to exist, accumulate density!
            if (math24 > 0.0) {
                // Adjust this to make the voxels more solid or more ghost-like
                float density_per_step = 0.15; 
                
                accumulated_alpha += density_per_step;
                accumulated_emission += vec3(0.0, 0.4, 0.6) * density_per_step;
            }
        }

        // Early exit: If the pixel is already fully opaque, stop doing math
        if (accumulated_alpha >= 1.0) {
            accumulated_alpha = 1.0;
            break;
        }

        // Move the ray forward
        t += step_size;
    }

    // Clean up empty space so it doesn't render dark artifacts
    if (accumulated_alpha <= 0.01) {
        discard; 
    }

    // Final Output
    ALBEDO = vec3(0.0, 0.8, 1.0);
    EMISSION = accumulated_emission;
    ALPHA = accumulated_alpha;
}
`

const shaderBest = `
shader_type spatial;
render_mode blend_mix, depth_draw_opaque, cull_disabled, unshaded;

// Replaces the "Camera" vector from Blender's Texture Coordinate node
uniform vec3 camera_coords = vec3(0.0, 0.0, 0.0);

varying vec3 obj_pos;

// Standard 3D pseudo-random noise function to mimic Blender's Noise Texture
float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 144.7272))) * 43758.5453);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
                   mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
               mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
                   mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y), f.z);
}

void vertex() {
    // Recreates the "Object" vector from Blender's Texture Coordinate node
    obj_pos = VERTEX;
}

void fragment() {
    // --- Sub-Graph 1 & 2: Voxel Grid Bounds (Separate XYZ & Math 0-10) ---
// --- Sub-Graph 1 & 2: Voxel Grid Bounds (Separate XYZ & Math 0-10) ---
    float grid_scale = 10.0; 
    
    // THE FIX: We add + 0.5 offset so the solid voxels intersect the Godot mesh faces
    vec3 fract_pos = fract((obj_pos * grid_scale) + vec3(0.5));

    // To see your voxels, you will likely need to adjust these to create a bounding box.
    float math_x  = (fract_pos.x < 0.9) ? 1.0 : 0.0;
    float math1_x = (fract_pos.x > 0.1) ? 1.0 : 0.0;
    float math2   = math_x * math1_x;

    float math3_y = (fract_pos.y < 0.9) ? 1.0 : 0.0;
    float math4_y = (fract_pos.y > 0.1) ? 1.0 : 0.0;
    float math5   = math3_y * math4_y;

    float math6_z = (fract_pos.z < 0.9) ? 1.0 : 0.0;
    float math7_z = (fract_pos.z > 0.1) ? 1.0 : 0.0;
    float math8   = math6_z * math7_z;

    float math9  = math2 * math5;
    float math10 = math9 * math8;

// NEW: We divide the view coordinates to stretch out the dissolve effect.
    // Set this to 20.0, 50.0, or 100.0 depending on how far you want to see it!
    float fade_distance = 30.0; 
    vec3 scaled_vertex = VERTEX / fade_distance;

    float math11 = abs(scaled_vertex.x);
    float math12 = abs(scaled_vertex.y);
    float math13 = abs(scaled_vertex.z);

    float math14 = pow(math11, 0.5);
    float math15 = pow(math12, 0.5);
    float math16 = pow(math13, 0.5);

    float math17 = math14 + math15;
    float math18 = math17 + math16;
    float math19 = pow(math18, 0.5);

    // Hard cutoff boundary (expanded slightly to account for the scale)
    float math20 = (math19 < 2.0) ? 1.0 : 0.0;

    // --- Sub-Graph 4: Noise Texture & Map Range ---
    // Noise Scale set to 50.0 based on Blender node properties
    float n_val = noise(obj_pos * 50.0); 
    
    // Now math19 will slowly rise to 1.0 as you reach "fade_distance"
    float map_range = clamp(math19, 0.0, 1.0); 

    // The voxels will slowly dissolve into noise as you back away
    float math21 = (n_val > map_range) ? 1.0 : 0.0;

    // --- Sub-Graph 5: Final Mixes ---
    float math22 = math20 * math21;
    float math23 = math10 * math22;
    
    // Math.024 multiplied by default input of 0.5
    float math24 = math23 * 0.5;

    // --- Principled Volume Output ---
    vec3 vol_color = vec3(0.0, 0.8, 1.0);
    vec3 vol_emission = vec3(0.0, 0.4, 0.6);

    ALBEDO = vol_color;
    EMISSION = vol_emission * math24;
    
    // Alpha controls the volumetric masking/density
    ALPHA = math24;
}`

// const shaderBest = `
// shader_type spatial;
// render_mode blend_add, depth_draw_opaque, cull_disabled, unshaded;

// // Colors pulled directly from your Principled Volume node
// uniform vec3 volume_color : source_color = vec3(0.0, 0.8, 1.0);
// uniform vec3 emission_color : source_color = vec3(0.0, 0.4, 0.6);

// // NEW: Your custom camera/target coordinate
// uniform vec3 custom_camera_pos = vec3(0.0, 0.0, 0.0);

// varying vec3 local_pos;
// varying vec3 world_pos; // We need this to compare against your custom uniform

// void vertex() {
//     local_pos = VERTEX;
//     // Get the absolute world position of the vertex
//     world_pos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
// }

// // ----------------------------------------------------
// // FBM Noise (Unchanged)
// // ----------------------------------------------------
// float hash(vec3 p) {
//     p = fract(p * 0.3183099 + 0.1);
//     p *= 17.0;
//     return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
// }

// float noise(vec3 x) {
//     vec3 i = floor(x);
//     vec3 f = fract(x);
//     f = f * f * (3.0 - 2.0 * f);
//     return mix(mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
//                    mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
//                mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
//                    mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
// }

// float fbm(vec3 x) {
//     float v = 0.0;
//     float a = 0.5;
//     vec3 shift = vec3(100.0);
//     for (int i = 0; i < 3; ++i) { 
//         v += a * noise(x);
//         x = x * 2.0 + shift;
//         a *= 0.5;
//     }
//     return v;
// }

// void fragment() {
//     // ========================================================
//     // BRANCH 1: Object Coordinates & Voxel Logic 
//     // ========================================================
//     vec3 frac_obj = fract(local_pos);

//     float math_x = (frac_obj.x < 0.5) ? 1.0 : 0.0;
//     float math_001_x = (frac_obj.x > 0.5) ? 1.0 : 0.0;
//     // Note: Change '*' to '+' here if the grid is invisible
//     float math_002_x = math_x * math_001_x; 

//     float math_y = (frac_obj.y < 0.5) ? 1.0 : 0.0;
//     float math_004_y = (frac_obj.y > 0.5) ? 1.0 : 0.0;
//     float math_005_y = math_y * math_004_y;

//     float math_z = (frac_obj.z < 0.5) ? 1.0 : 0.0;
//     float math_007_z = (frac_obj.z > 0.5) ? 1.0 : 0.0;
//     float math_008_z = math_z * math_007_z;

//     float math_009 = math_002_x * math_005_y;
//     float math_010 = math_009 * math_008_z;

//     // ========================================================
//     // BRANCH 2: Camera Distance Logic (UPDATED FOR UNIFORM)
//     // ========================================================
//     // Calculate the vector from the pixel to your custom coordinate
//     vec3 cam_coord = world_pos - custom_camera_pos;
    
//     float abs_x = abs(cam_coord.x);
//     float abs_y = abs(cam_coord.y);
//     float abs_z = abs(cam_coord.z);

//     float pow_x = pow(abs_x, 0.5);
//     float pow_y = pow(abs_y, 0.5);
//     float pow_z = pow(abs_z, 0.5);

//     float math_017 = pow_x + pow_y;
//     float math_018 = math_017 + pow_z;
//     float math_019 = pow(math_018, 0.5);

//     float math_020 = (math_019 < 0.5) ? 1.0 : 0.0;

//     // ========================================================
//     // BRANCH 3: Noise 
//     // ========================================================
//     float noise_val = fbm(local_pos * 50.0);
//     float map_res = clamp(math_019, 0.0, 1.0);
//     float math_021 = (noise_val > map_res) ? 1.0 : 0.0;

//     // ========================================================
//     // FINAL MIX
//     // ========================================================
//     float math_022 = math_020 * math_021;
//     float math_023 = math_010 * math_022;
//     float math_024 = math_023 * 0.5;

//     ALBEDO = volume_color; 
//     ALPHA = math_024;
//     EMISSION = emission_color * math_024;
// }`

const rmshader = `
shader_type spatial;
render_mode depth_draw_opaque, cull_disabled;

// Material Properties
uniform vec4 base_color : source_color = vec4(0.8, 0.8, 0.8, 1.0);
uniform float metallic = 0.0;
uniform float roughness = 0.5;

// Proximity/Bubble Properties
uniform vec3 player_position = vec3(0.0, 0.0, 0.0);
uniform float bubble_inner_radius = 1.0; 
uniform float bubble_outer_radius = 5.0; 

// Internal Solid Cube Properties
uniform vec4 grid_color : source_color = vec4(0.0, 1.0, 0.8, 1.0);
uniform float grid_scale = 2.0;
uniform float cube_fill = 0.25; // How much of the 3D cell the solid cube takes up (0.0 to 1.0)
uniform int grid_steps = 16; 


varying vec3 world_pos;
varying vec3 local_pos;

// White Noise generation function
float random(vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Helper function: Calculates where the camera's ray enters and exits a Godot BoxMesh
vec2 intersectAABB(vec3 rayOrigin, vec3 rayDir, vec3 boxMin, vec3 boxMax) {
    vec3 tMin = (boxMin - rayOrigin) / rayDir;
    vec3 tMax = (boxMax - rayOrigin) / rayDir;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    return vec2(tNear, tFar);
}

void vertex() {
    world_pos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
    local_pos = VERTEX;
}

void fragment() {
    float range_diff = max(bubble_outer_radius - bubble_inner_radius, 0.0001); 
    float noise = random(FRAGCOORD.xy);
    
    if (FRONT_FACING) {
        // --- OUTSIDE THE OBJECT ---
        float dist_to_player = length(world_pos - player_position);
        float mapped_dist = clamp((dist_to_player - bubble_inner_radius) / range_diff, 0.0, 1.0);
        float alpha_clip = (mapped_dist > noise) ? 1.0 : 0.0;
        
        ALBEDO = base_color.rgb;
        METALLIC = metallic;
        ROUGHNESS = roughness;
        ALPHA = alpha_clip;
        
    } else {
        // --- INSIDE THE OBJECT (SOLID CUBE RAYMARCHING) ---
        vec3 local_ro = (inverse(MODEL_MATRIX) * vec4(CAMERA_POSITION_WORLD, 1.0)).xyz;
        vec3 local_rd = normalize(local_pos - local_ro);
        
        vec2 bounds = intersectAABB(local_ro, local_rd, vec3(-0.5), vec3(0.5));
        float tNear = max(bounds.x, 0.0);
        float tFar = bounds.y;
        
        float hit = 0.0;
        vec3 hit_normal = vec3(0.0);
        
        if (tNear < tFar) {
            float step_size = (tFar - tNear) / float(grid_steps);
            float t = tNear;
            
            for (int i = 0; i < grid_steps; i++) {
                t += step_size;
                vec3 p = local_ro + local_rd * t;
                vec3 world_p = (MODEL_MATRIX * vec4(p, 1.0)).xyz;
                float hit_dist_to_player = length(world_p - player_position);
                
                // 3D Solid Cube Math
                vec3 cell_pos = fract(p * grid_scale) - 0.5;
                vec3 abs_pos = abs(cell_pos);
                
                // Check if the current point is inside the cube's volume
                if (max(max(abs_pos.x, abs_pos.y), abs_pos.z) < (cube_fill * 0.5)) {
                    float hit_mapped_dist = clamp((hit_dist_to_player - bubble_inner_radius) / range_diff, 0.0, 1.0);
                    
                    // Screen-door dither check
                    if (hit_mapped_dist > noise) {
                        hit = 1.0;
                        
                        // Depth Correction
                        vec4 hit_view = VIEW_MATRIX * vec4(world_p, 1.0);
                        vec4 hit_clip = PROJECTION_MATRIX * hit_view;
                        DEPTH = hit_clip.z / hit_clip.w;
                        
                        // Calculate normal for the specific face of the cube we hit
                        vec3 n = step(max(abs_pos.yzx, abs_pos.zxy), abs_pos.xyz) * sign(cell_pos);
                        
                        // Transform the local normal to View Space for Godot's lighting engine
                        hit_normal = normalize((VIEW_MATRIX * MODEL_MATRIX * vec4(n, 0.0)).xyz);
                        
                        break; 
                    }
                }
            }
        }
        
        ALBEDO = grid_color.rgb;
        EMISSION = grid_color.rgb * 0.2; // Lowered emission slightly so directional lighting is visible
        METALLIC = 0.0;
        ROUGHNESS = 0.8;
        ALPHA = hit;
        
        // Apply the calculated normal if we hit a solid face
        if (hit > 0.0) {
            NORMAL = hit_normal;
        }
    }
    
    // Discard empty space and dithered holes
    ALPHA_SCISSOR_THRESHOLD = 0.5;
}`

const shader33 = `
shader_type spatial;
render_mode depth_draw_opaque, cull_disabled;

// Material Properties
uniform vec4 base_color : source_color = vec4(0.8, 0.8, 0.8, 1.0);
uniform float metallic = 0.0;
uniform float roughness = 0.5;

// Proximity/Bubble Properties
uniform vec3 player_position = vec3(0.0, 0.0, 0.0);
uniform float bubble_inner_radius = 1.0; 
uniform float bubble_outer_radius = 2.0; 

// Internal Solid Cube Properties
uniform vec4 grid_color : source_color = vec4(0.0, 1.0, 0.8, 1.0);
uniform float grid_scale = 10.0;
uniform float cube_fill = 0.95; // How much of the 3D cell the solid cube takes up (0.0 to 1.0)
uniform int grid_steps = 16; 


varying vec3 world_pos;
varying vec3 local_pos;

// White Noise generation function
float random(vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Helper function: Calculates where the camera's ray enters and exits a Godot BoxMesh
vec2 intersectAABB(vec3 rayOrigin, vec3 rayDir, vec3 boxMin, vec3 boxMax) {
    vec3 tMin = (boxMin - rayOrigin) / rayDir;
    vec3 tMax = (boxMax - rayOrigin) / rayDir;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    return vec2(tNear, tFar);
}

void vertex() {
    world_pos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
    local_pos = VERTEX;
}

void fragment() {
    float range_diff = max(bubble_outer_radius - bubble_inner_radius, 0.0001); 
    float noise = random(FRAGCOORD.xy);
    
    if (FRONT_FACING) {
        // --- OUTSIDE THE OBJECT ---
        float dist_to_player = length(world_pos - player_position);
        float mapped_dist = clamp((dist_to_player - bubble_inner_radius) / range_diff, 0.0, 1.0);
        float alpha_clip = (mapped_dist > noise) ? 1.0 : 0.0;
        
        ALBEDO = base_color.rgb;
        METALLIC = metallic;
        ROUGHNESS = roughness;
        ALPHA = alpha_clip;
        
    } else {
        // --- INSIDE THE OBJECT (SOLID CUBE RAYMARCHING) ---
        vec3 local_ro = (inverse(MODEL_MATRIX) * vec4(CAMERA_POSITION_WORLD, 1.0)).xyz;
        vec3 local_rd = normalize(local_pos - local_ro);
        
        vec2 bounds = intersectAABB(local_ro, local_rd, vec3(-0.5), vec3(0.5));
        float tNear = max(bounds.x, 0.0);
        float tFar = bounds.y;
        
        float hit = 0.0;
        vec3 hit_normal = vec3(0.0);
        
        if (tNear < tFar) {
            float step_size = (tFar - tNear) / float(grid_steps);
            float t = tNear;
            
            for (int i = 0; i < grid_steps; i++) {
                t += step_size;
                vec3 p = local_ro + local_rd * t;
                vec3 world_p = (MODEL_MATRIX * vec4(p, 1.0)).xyz;
                float hit_dist_to_player = length(world_p - player_position);
                
                // 3D Solid Cube Math
                vec3 cell_pos = fract(p * grid_scale) - 0.5;
                vec3 abs_pos = abs(cell_pos);
                
                // Check if the current point is inside the cube's volume
                if (max(max(abs_pos.x, abs_pos.y), abs_pos.z) < (cube_fill * 0.5)) {
                    float hit_mapped_dist = clamp((hit_dist_to_player - bubble_inner_radius) / range_diff, 0.0, 1.0);
                    
                    // Screen-door dither check
                    if (hit_mapped_dist > noise) {
                        hit = 1.0;
                        
                        // Depth Correction
                        vec4 hit_view = VIEW_MATRIX * vec4(world_p, 1.0);
                        vec4 hit_clip = PROJECTION_MATRIX * hit_view;
                        DEPTH = hit_clip.z / hit_clip.w;
                        
                        // Calculate normal for the specific face of the cube we hit
                        vec3 n = step(max(abs_pos.yzx, abs_pos.zxy), abs_pos.xyz) * sign(cell_pos);
                        
                        // Transform the local normal to View Space for Godot's lighting engine
                        hit_normal = normalize((VIEW_MATRIX * MODEL_MATRIX * vec4(n, 0.0)).xyz);
                        
                        break; 
                    }
                }
            }
        }
        
        ALBEDO = grid_color.rgb;
        EMISSION = grid_color.rgb * 0.2; // Lowered emission slightly so directional lighting is visible
        METALLIC = 0.0;
        ROUGHNESS = 0.8;
        ALPHA = hit;
        
        // Apply the calculated normal if we hit a solid face
        if (hit > 0.0) {
            NORMAL = hit_normal;
        }
    }
    
    // Discard empty space and dithered holes
    ALPHA_SCISSOR_THRESHOLD = 0.5;
}
`

const shader34 = `
shader_type spatial;
render_mode depth_draw_opaque, cull_disabled;

// Material Properties
uniform vec4 base_color : source_color = vec4(0.8, 0.8, 0.8, 1.0);
uniform float metallic = 0.0;
uniform float roughness = 0.5;

// Proximity/Bubble Properties
uniform vec3 player_position = vec3(0.0, 0.0, 0.0);
uniform float bubble_inner_radius = 1.0; 
uniform float bubble_outer_radius = 5.0; 

// Internal Solid Cube Properties
uniform vec4 grid_color : source_color = vec4(0.0, 1.0, 0.8, 1.0);
uniform float grid_scale = 2.0;
uniform float cube_fill = 0.6; // How much of the 3D cell the solid cube takes up (0.0 to 1.0)
uniform int grid_steps = 64; 


varying vec3 world_pos;
varying vec3 local_pos;

// White Noise generation function
float random(vec2 uv) {
    return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void vertex() {
    world_pos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
    local_pos = VERTEX;
}

void fragment() {
    float range_diff = max(bubble_outer_radius - bubble_inner_radius, 0.0001); 
    float noise = random(FRAGCOORD.xy);
    
    if (FRONT_FACING) {
        // --- OUTSIDE THE OBJECT ---
        float dist_to_player = length(world_pos - player_position);
        float mapped_dist = clamp((dist_to_player - bubble_inner_radius) / range_diff, 0.0, 1.0);
        float alpha_clip = (mapped_dist > noise) ? 1.0 : 0.0;
        
        ALBEDO = base_color.rgb;
        METALLIC = metallic;
        ROUGHNESS = roughness;
        ALPHA = alpha_clip;
        
    } else {
        // --- INSIDE THE OBJECT (SOLID CUBE RAYMARCHING) ---
        vec3 local_ro = (inverse(MODEL_MATRIX) * vec4(CAMERA_POSITION_WORLD, 1.0)).xyz;
        vec3 local_rd = normalize(local_pos - local_ro);
        
        float ray_length = length(local_pos - local_ro);
        float step_size = ray_length / float(grid_steps);
        
        float hit = 0.0;
        vec3 p = local_ro; 
        vec3 hit_normal = vec3(0.0);
        
        for (int i = 0; i < grid_steps; i++) {
            p += local_rd * step_size;
            vec3 world_p = (MODEL_MATRIX * vec4(p, 1.0)).xyz;
            float hit_dist_to_player = length(world_p - player_position);
            
            // Only evaluate if we are inside the bubble boundary
            if (hit_dist_to_player <= bubble_outer_radius) {
                
                // 3D Solid Cube Math
                vec3 cell_pos = fract(p * grid_scale) - 0.5;
                vec3 abs_pos = abs(cell_pos);
                
                // Check if the current point is inside the cube's volume
                if (max(max(abs_pos.x, abs_pos.y), abs_pos.z) < (cube_fill * 0.5)) {
                    
                    float hit_mapped_dist = clamp((hit_dist_to_player - bubble_inner_radius) / range_diff, 0.0, 1.0);
                    
                    // Screen-door dither check
                    if (hit_mapped_dist > noise) {
                        hit = 1.0;
                        
                        // Depth Correction
                        vec4 hit_view = VIEW_MATRIX * vec4(world_p, 1.0);
                        vec4 hit_clip = PROJECTION_MATRIX * hit_view;
                        DEPTH = hit_clip.z / hit_clip.w;
                        
                        // Calculate normal for the specific face of the cube we hit
                        vec3 n = step(max(abs_pos.yzx, abs_pos.zxy), abs_pos.xyz) * sign(cell_pos);
                        
                        // Transform the local normal to View Space for Godot's lighting engine
                        // (w = 0.0 ensures we don't apply translations, only rotations)
                        hit_normal = normalize((VIEW_MATRIX * MODEL_MATRIX * vec4(n, 0.0)).xyz);
                        
                        break; 
                    }
                }
            }
        }
        
        ALBEDO = grid_color.rgb;
        EMISSION = grid_color.rgb * 0.2; // Lowered emission slightly so directional lighting is visible
        METALLIC = 0.0;
        ROUGHNESS = 0.8;
        ALPHA = hit;
        
        // Apply the calculated normal if we hit a solid face
        if (hit > 0.0) {
            NORMAL = hit_normal;
        }
    }
    
    // Discard empty space and dithered holes
    ALPHA_SCISSOR_THRESHOLD = 0.5;
}`