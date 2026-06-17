import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Entity } from "./Yuu API/Entity";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { CubeEntity } from "./CubeGun";
import { Events } from "./Yuu API/Events";

export const antichamber = {
  spawnDoor,
  spawnStaticDoor,
  spawnLaserDoor,
  spawnMultiLaserDoor,
}

// create a cube and attach shadercode new/
async function spawnDoor(pos: Vector3) {
  const doorPos = new Vector3(pos.x, pos.y + 2, pos.z);

  // door can still be glitched through with 'physics' instead of animated/static
  // but I need the game physics so the doors catch on the blocks and its probably more efficient
  // do the level legit instead of glitching through the doors
  // another idea -- use animated plane in front of the door that moves up and down with the physics update
  const door = spawnPrimitive.door(doorPos, new Vector3(1, 1, 1), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);
  const nodeId = door.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, doorShader);

  let isGravityReversed = false;

  // Create a visible trigger on one side of the door
  const triggerPos = new Vector3(5,1,0);
  const triggerEntity = new Entity(triggerPos, Quaternion.one, new Vector3(0.1, 0.1, 4), undefined, 'Static');

  triggerEntity.trigger.initialize(new Vector3(0.1, 0.1, 4));
  triggerEntity.trigger.setVisible(true, Color.red);

  triggerEntity.trigger.setOccupiedFunction(() => {
    isGravityReversed = true;
    triggerEntity.trigger.setVisible(true, Color.green);
    if (nodeId !== -1) {
      Godot.shader.updateColor(nodeId, "border_color", 0.1, 1.0, 0.1);
    }
  });

  triggerEntity.trigger.setEmptyFunction(() => {
    isGravityReversed = false;
    triggerEntity.trigger.setVisible(true, Color.red);
    if (nodeId !== -1) {
      Godot.shader.updateColor(nodeId, "border_color", 1.0, 1.0, 1.0);
    }
  });

  Events.onPhysicsUpdate((deltaTime) => {
    if (door.exists()) {
      door.rot = Quaternion.one;
      
      const curPos = door.pos;
      let vel = door.velocity.get();
      if (vel) {
        let yVel = vel.y;
        if (isGravityReversed) {
          // Accelerate upwards: counteract default downward gravity (9.8 m/s^2)
          // and apply an upward gravity (9.8 m/s^2). Net upward acceleration is 19.6 m/s^2.
          yVel += 19.6 * deltaTime;
        }
        door.velocity.set(new Vector3(0, yVel, 0));
      }

      // Clamp door position to keep it between the ground (pos.y) and 2x the door height (pos.y + 2 * 2)
      let curY = curPos.y;
      const doorHeight = 2;
      const minY = 0;
      const maxY = pos.y + 1.98 * doorHeight;
      if (curY < minY) {
        curY = minY;
        const currentVel = door.velocity.get();
        if (currentVel && currentVel.y < 0) {
          door.velocity.set(new Vector3(0, 0, 0));
        }
      } else if (curY > maxY) {
        curY = maxY;
        const currentVel = door.velocity.get();
        if (currentVel && currentVel.y > 0) {
          door.velocity.set(new Vector3(0, 0, 0));
        }
      }
      door.pos = new Vector3(pos.x, curY, pos.z);
    }
  });

  const supportPos = new Vector3(pos.x, pos.y, pos.z+1.9);
  const supportCube = new CubeEntity(supportPos, true, new Vector3(0.1,0.1,0.1), Color.blue, 'Static');
  const support = supportCube.entity;
  support.collidable.set(true);
}

async function spawnLaserDoor(pos: Vector3, laserPos: Vector3, laserSize: Vector3 = new Vector3(0.1, 0.1, 4), invertLogic: boolean = false, rotation: Quaternion = Quaternion.one) {
  const doorPos = invertLogic ? new Vector3(pos.x, pos.y + 2, pos.z) : new Vector3(pos.x, pos.y, pos.z);

  const door = spawnPrimitive.door(doorPos, new Vector3(1, 1, 1), rotation, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);
  const nodeId = door.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, doorShader);
  
  if (nodeId !== -1) {
    if (invertLogic) {
      Godot.shader.updateColor(nodeId, "border_color", 0.1, 1.0, 0.1); // Initialize to green (starts open)
    } else {
      Godot.shader.updateColor(nodeId, "border_color", 1.0, 1.0, 1.0); // Initialize to white (starts closed)
    }
  }

  let isBlocked = false;

  // Create a visible trigger on one side of the door
  const triggerPos = new Vector3(laserPos.x, laserPos.y, laserPos.z)
  const triggerEntity = new Entity(triggerPos, Quaternion.one, laserSize, undefined, 'Static');

  triggerEntity.trigger.initialize(laserSize);
  triggerEntity.trigger.setVisible(true, Color.red);


  triggerEntity.trigger.setOccupiedFunction(() => {
    isBlocked = true;
    triggerEntity.trigger.setVisible(true, Color.green);
    if (nodeId !== -1) {
      const activeColor = invertLogic ? new Color(1.0, 1.0, 1.0) : new Color(0.1, 1.0, 0.1);
      Godot.shader.updateColor(nodeId, "border_color", activeColor.r, activeColor.g, activeColor.b);
    }
  });

  triggerEntity.trigger.setEmptyFunction(() => {
    isBlocked = false;
    triggerEntity.trigger.setVisible(true, Color.red);
    if (nodeId !== -1) {
      const emptyColor = invertLogic ? new Color(0.1, 1.0, 0.1) : new Color(1.0, 1.0, 1.0);
      Godot.shader.updateColor(nodeId, "border_color", emptyColor.r, emptyColor.g, emptyColor.b);
    }
  });

  Events.onPhysicsUpdate((deltaTime) => {
    if (door.exists()) {
      door.rot = rotation;
      
      const curPos = door.pos;
      let vel = door.velocity.get();
      if (vel) {
        let yVel = vel.y;
        const shouldGoUp = invertLogic ? !isBlocked : isBlocked;
        if (shouldGoUp) {
          // Accelerate upwards: counteract default downward gravity (9.8 m/s^2)
          // and apply an upward gravity (9.8 m/s^2). Net upward acceleration is 19.6 m/s^2.
          yVel += 19.6 * deltaTime;
        }
        door.velocity.set(new Vector3(0, yVel, 0));
      }

      // Clamp door position to keep it between the ground (pos.y) and 2x the door height (pos.y + 2 * 2)
      let curY = curPos.y;
      const doorHeight = 2;
      const minY = pos.y;
      const maxY = pos.y + 1.5 * doorHeight;
      if (curY < minY) {
        curY = minY;
        const currentVel = door.velocity.get();
        if (currentVel && currentVel.y < 0) {
          door.velocity.set(new Vector3(0, 0, 0));
        }
      } else if (curY > maxY) {
        curY = maxY;
        const currentVel = door.velocity.get();
        if (currentVel && currentVel.y > 0) {
          door.velocity.set(new Vector3(0, 0, 0));
        }
      }
      door.pos = new Vector3(pos.x, curY, pos.z);
    }
  });
}

async function spawnMultiLaserDoor(
  pos: Vector3, 
  laserPositions: Vector3[], 
  laserSize: Vector3 = new Vector3(0.1, 0.1, 4), 
  invertLogic: boolean = false, 
  rotation: Quaternion = Quaternion.one
) {
  const doorPos = invertLogic ? new Vector3(pos.x, pos.y + 2, pos.z) : new Vector3(pos.x, pos.y, pos.z);

  const door = spawnPrimitive.door(doorPos, new Vector3(1, 1, 1), rotation, new Color(0.1, 0.5, 0.1), 1, true, 'Physics', undefined);
  const nodeId = door.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, doorShader);
  
  if (nodeId !== -1) {
    if (invertLogic) {
      Godot.shader.updateColor(nodeId, "border_color", 0.1, 1.0, 0.1); // Initialize to green (starts open)
    } else {
      Godot.shader.updateColor(nodeId, "border_color", 1.0, 1.0, 1.0); // Initialize to white (starts closed)
    }
  }

  let activeStates = laserPositions.map(() => false);

  laserPositions.forEach((laserPos, index) => {
    // Create a visible trigger at each laser position
    const triggerPos = new Vector3(laserPos.x, laserPos.y, laserPos.z);
    const triggerEntity = new Entity(triggerPos, Quaternion.one, laserSize, undefined, 'Static');

    triggerEntity.trigger.initialize(laserSize);
    triggerEntity.trigger.setVisible(true, Color.red);

    triggerEntity.trigger.setOccupiedFunction(() => {
      activeStates[index] = true;
      triggerEntity.trigger.setVisible(true, Color.green);
      updateDoorState();
    });

    triggerEntity.trigger.setEmptyFunction(() => {
      activeStates[index] = false;
      triggerEntity.trigger.setVisible(true, Color.red);
      updateDoorState();
    });
  });

  let allSatisfied = false;

  function updateDoorState() {
    const totalActive = activeStates.filter(s => s).length;
    allSatisfied = totalActive === laserPositions.length;
    
    if (nodeId !== -1) {
      const isDoorOpen = invertLogic ? !allSatisfied : allSatisfied;
      if (isDoorOpen) {
        Godot.shader.updateColor(nodeId, "border_color", 0.1, 1.0, 0.1); // open border (green)
      } else {
        Godot.shader.updateColor(nodeId, "border_color", 1.0, 1.0, 1.0); // closed border (white)
      }
    }
  }

  Events.onPhysicsUpdate((deltaTime) => {
    if (door.exists()) {
      door.rot = rotation;
      
      const curPos = door.pos;
      let vel = door.velocity.get();
      if (vel) {
        let yVel = vel.y;
        const shouldGoUp = invertLogic ? !allSatisfied : allSatisfied;
        if (shouldGoUp) {
          // Accelerate upwards
          yVel += 19.6 * deltaTime;
        }
        door.velocity.set(new Vector3(0, yVel, 0));
      }

      // Clamp door position to keep it between the ground (pos.y) and 1.5x the door height
      let curY = curPos.y;
      const doorHeight = 2;
      const minY = pos.y;
      const maxY = pos.y + 1.5 * doorHeight;
      if (curY < minY) {
        curY = minY;
        const currentVel = door.velocity.get();
        if (currentVel && currentVel.y < 0) {
          door.velocity.set(new Vector3(0, 0, 0));
        }
      } else if (curY > maxY) {
        curY = maxY;
        const currentVel = door.velocity.get();
        if (currentVel && currentVel.y > 0) {
          door.velocity.set(new Vector3(0, 0, 0));
        }
      }
      door.pos = new Vector3(pos.x, curY, pos.z);
    }
  });
}

async function spawnStaticDoor(pos: Vector3) {
  const door = spawnPrimitive.door(pos, new Vector3(1, 1, 1), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Static', undefined);
  const nodeId = door.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, doorShader);
  return door;
}

const doorShader = `
shader_type spatial;

// Added depth_draw_always to fix overlapping transparency issues.
// Note: I kept cull_disabled instead of cull_back so you can see the borders on the back of the cube through the front glass.
render_mode blend_mix, depth_draw_always, cull_disabled;

// --- Mask Uniforms ---
uniform float border_width : hint_range(0.0, 0.5) = 0.05; 
uniform float normal_threshold : hint_range(0.0, 1.0) = 0.5;
uniform bool invert_mask = false;

// --- Glass Uniforms ---
uniform vec4 glass_color : source_color = vec4(0.8, 0.9, 1.0, 0.3); 
uniform float roughness : hint_range(0.0, 1.0) = 0.05; 
uniform float metallic : hint_range(0.0, 1.0) = 0.9;   

// --- Border Uniforms ---
uniform vec4 border_color : source_color = vec4(1.0, 1.0, 1.0, 1.0);
uniform float border_emission = 1.0;

varying vec3 local_pos;

void vertex() {
    local_pos = VERTEX;
}

void fragment() {
    // --- 1. Flat Normal Calculation ---
    vec3 flat_normal = normalize(cross(dFdy(local_pos), dFdx(local_pos)));

    // --- 2. Y and Z Normal Mask ---
    float mask_y = abs(flat_normal.y);
    float mask_z = abs(flat_normal.z);
    float normal_mask = step(normal_threshold, max(mask_y, mask_z));

    // --- 3. UV Border Mask ---
    float edge_x = step(1.0 - border_width, UV.x) + step(UV.x, border_width);
    float edge_y = step(1.0 - border_width, UV.y) + step(UV.y, border_width);
    float uv_mask = max(edge_x, edge_y);

    // --- 4. Final Combine Factor ---
    // factor = 1.0 (Border), factor = 0.0 (Glass)
    float factor = clamp(max(uv_mask, normal_mask), 0.0, 1.0);
    if (invert_mask) {
        factor = 1.0 - factor;
    }

    // --- 5. Mix Materials based on Factor ---
    
    // Mix the base colors. 
    ALBEDO = mix(glass_color.rgb, border_color.rgb, factor);
    
    // Mix the alpha. Uses the glass_color.a for the center, and border_color.a for the edges.
    ALPHA = mix(glass_color.a, border_color.a, factor);
    
    // Apply PBR properties. 
    // The glass gets your roughness/metallic values. 
    // The border gets standard matte non-metallic values (1.0 roughness, 0.0 metallic).
    ROUGHNESS = mix(roughness, 1.0, factor);
    METALLIC = mix(metallic, 0.0, factor);
    
    // Apply emission only to the border
    EMISSION = border_color.rgb * border_emission * factor;
}
`