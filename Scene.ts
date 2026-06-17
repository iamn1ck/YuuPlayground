import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Vector2 } from "./Yuu API/Basic Types/Vector2";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";
import { Entity } from "./Yuu API/Entity";
import { getCube001 } from "./Yuu API/cube001Model";
import { getCube002 } from "./Yuu API/cube002Model";
import { getCube003 } from "./Yuu API/cube003Model";
import { getCube004 } from "./Yuu API/cube004Model";
import { getCube005 } from "./Yuu API/cube005Model";
import { getCube006 } from "./Yuu API/cube006Model";
import { getCube007 } from "./Yuu API/cube007Model";
import { getCube008 } from "./Yuu API/cube008Model";
import { getCube009 } from "./Yuu API/cube009Model";
import { getCube010 } from "./Yuu API/cube010Model";
import { getCube011 } from "./Yuu API/cube011Model";
import { getCube012 } from "./Yuu API/cube012Model";
import { getCube013 } from "./Yuu API/cube013Model";
import { getCube014 } from "./Yuu API/cube014Model";
import { getCube015 } from "./Yuu API/cube015Model";
import { getCube016 } from "./Yuu API/cube016Model";
import { getCube017 } from "./Yuu API/cube017Model";
import { getCube018 } from "./Yuu API/cube018Model";
import { getCube019 } from "./Yuu API/cube019Model";
import { getCube020 } from "./Yuu API/cube020Model";
import { getCube021 } from "./Yuu API/cube021Model";
import { getCube022 } from "./Yuu API/cube022Model";
import { getCube023 } from "./Yuu API/cube023Model";
import { getCube024 } from "./Yuu API/cube024Model";
import { getCube025 } from "./Yuu API/cube025Model";
import { getCube026 } from "./Yuu API/cube026Model";
import { getCube027 } from "./Yuu API/cube027Model";
import { getCube028 } from "./Yuu API/cube028Model";
import { getCube029 } from "./Yuu API/cube029Model";
import { getCube040 } from "./Yuu API/cube040Model";
import { getCube030 } from "./Yuu API/cube030Model";
import { getCube031 } from "./Yuu API/cube031Model";
import { getCube033 } from "./Yuu API/cube033Model";

export const scene = {
  spawnChamber,
  spawnScene,
}

function spawnModel(
  getMesh: () => [Vector3[], Vector2[], number[]],
  pos: Vector3,
  scale: Vector3,
  rot: Quaternion,
  color: Color = new Color(1, 1, 1),
  alphaTransparency: number = 1,
  hasCollider: boolean = true,
  type: BaseNodeTypes = 'Static',
  parent: Entity | undefined = undefined
): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);
  entity.mesh.create(...getMesh());
  entity.mesh.color.set(color, Math.min(1, alphaTransparency));
  if (hasCollider && entity.mesh.nodeID) {
    entity.collider.createFromMeshNode(entity.mesh.nodeID, 'Concave');
  }
  entity.scale = scale;
  return entity;
}

// create a cube and attach shadercode new/
async function spawnChamber() {
  const chamber = spawnPrimitive.chamber(new Vector3(0, 2, 0), new Vector3(2, 2, 2), Quaternion.one, new Color(0.1, 0.5, 0.1), 1, true, 'Static', undefined);

  const nodeId = chamber.mesh.nodeID ?? -1;
  Godot.shader.applyToMesh(nodeId, chamberShader);
}

export async function spawnScene() {
  // Spawn Cube.001
  spawnModel(
    getCube001,
    new Vector3(0.000000, 3.750000, -4.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.002
  spawnModel(
    getCube002,
    new Vector3(-4.250000, 3.750000, 0.000000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.003
  spawnModel(
    getCube003,
    new Vector3(0.000000, 3.750000, 4.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.004
  spawnModel(
    getCube004,
    new Vector3(18.000000, 3.750000, 4.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.005
  spawnModel(
    getCube005,
    new Vector3(35.500000, 3.750000, -4.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.006
  spawnModel(
    getCube006,
    new Vector3(39.000000, 3.750000, 4.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.007
  spawnModel(
    getCube007,
    new Vector3(4.250000, 3.750000, 3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.008
  spawnModel(
    getCube008,
    new Vector3(9.000000, 3.750000, 2.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.009
  spawnModel(
    getCube009,
    new Vector3(13.750000, 3.750000, 3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.010
  spawnModel(
    getCube010,
    new Vector3(13.750000, 3.750000, -3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.011
  spawnModel(
    getCube011,
    new Vector3(4.250000, 3.750000, -3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.012
  spawnModel(
    getCube012,
    new Vector3(9.000000, 3.750000, -2.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.013
  spawnModel(
    getCube013,
    new Vector3(18.000000, 3.750000, -4.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.014
  spawnModel(
    getCube014,
    new Vector3(22.250000, 3.750000, 3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.015
  spawnModel(
    getCube015,
    new Vector3(22.250000, 3.750000, -3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.016
  spawnModel(
    getCube016,
    new Vector3(28.750000, 3.750000, 2.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.017
  spawnModel(
    getCube017,
    new Vector3(27.000000, 3.750000, -2.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.018
  spawnModel(
    getCube018,
    new Vector3(31.750000, 3.750000, -3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.019
  spawnModel(
    getCube019,
    new Vector3(35.250000, 3.750000, 3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.020
  spawnModel(
    getCube020,
    new Vector3(39.250000, 3.750000, -3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.021
  spawnModel(
    getCube021,
    new Vector3(46.500000, 3.750000, -2.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.022
  spawnModel(
    getCube022,
    new Vector3(46.250000, 3.750000, 2.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.023
  spawnModel(
    getCube023,
    new Vector3(42.750000, 3.750000, 3.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.024
  spawnModel(
    getCube024,
    new Vector3(53.750000, 3.750000, -6.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.025
  spawnModel(
    getCube025,
    new Vector3(49.750000, 3.750000, 4.750000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.026
  spawnModel(
    getCube026,
    new Vector3(67.000000, 3.750000, -10.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.027
  spawnModel(
    getCube027,
    new Vector3(65.000000, 3.750000, 7.250000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.028
  spawnModel(
    getCube028,
    new Vector3(80.250000, 3.750000, -1.500000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.029
  spawnModel(
    getCube029,
    new Vector3(47.299999, 1.500000, 0.000000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000),
    Color.yellow
  );

  // Spawn Cube.040
  spawnModel(
    getCube040,
    new Vector3(37.750000, -0.250000, 0.000000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.030
  spawnModel(
    getCube030,
    new Vector3(64.224998, 3.750000, -6.000000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.031
  spawnModel(
    getCube031,
    new Vector3(64.224998, 3.750000, 4.500000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );

  // Spawn Cube.033
  spawnModel(
    getCube033,
    new Vector3(58.250000, 3.750000, 4.400000),
    new Vector3(1.000000, 1.000000, 1.000000),
    new Quaternion(0.000000, 0.000000, 0.000000, 1.000000)
  );
}

const chamberShader = `
shader_type spatial;
render_mode cull_disabled;

uniform vec4 wall_color : source_color = vec4(0.8, 0.8, 0.8, 1.0);

void fragment() {
    ALBEDO = wall_color.rgb;
}
`;
