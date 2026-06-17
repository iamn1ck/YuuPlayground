import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Async } from "./Yuu API/Async";
import { Player } from "./Yuu API/Player";
import { Texture } from "./Yuu API/Texture";

export const win = {
  winRoom,
}

// create a cube and attach shadercode new/
async function winRoom() {
  spawnShaderSphere(new Vector3(70, 2.5, -2));

  spawnDissolveCube(new Vector3(75, 2.5, -1))
  spawnDissolveCube(new Vector3(75, 2.5, -2))

  nissanGtr(new Vector3(70,1,3));

  sierpinskiPlane(new Vector3(78, 1,0));
}


function sierpinskiPlane(pos: Vector3){
  const plane = spawnPrimitive.plane('Front', pos, new Vector3(1, 1, 1), Quaternion.one, Color.white, 1, 'Concave', 'Static', undefined);
  const nodeId = plane.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, dvdSierpinskiShader);

}

async function nissanGtr(pos: Vector3) {

  const rw = spawnPrimitive.nissanGtr32Exp(pos, new Vector3(2, 2, 2), Quaternion.one, Color.white, 1, 'Concave', 'Static', undefined);

  const nodeId = rw.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, rainbowShader);
}

// create a cube and attach shadercode new/
async function spawnDissolveCube(pos: Vector3) {

  const cube = spawnPrimitive.cube(pos, new Vector3(1,1,1), Quaternion.one, new Color(0.1,0.5,0.1), 1, true, 'Static', undefined);

  cube.collidable.set(true)

  const nodeId = cube.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, dissolveShader);
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

const dvdSierpinskiShader = `
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


// when you get closer it appears
const dissolveShader = `
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