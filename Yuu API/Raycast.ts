import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";
import { Entity } from "./Entity";


export const Raycast = {
  directional,
  to,
}


/**
 * Fire a raycast in a given direction
 * @param from pos to fire ray
 * @param direction to fire ray towards
 * @param length of the ray
 * @param properties are optional and adjusts how much compute is used by the raycast
 * @returns RayHit or undefined if nothing is hit
 */
function directional(from: Vector3, direction: Vector3, length: number, properties: Partial<RayProperties> = {}): RayHit | undefined {
  const dest = from.add(direction.multiply(length));

  return to(from, dest, properties);
}

/**
 * Fire a raycast to a destination
 * @param from pos to fire ray
 * @param to to fire ray towards
 * @param properties are optional and adjusts how much compute is used by the raycast
 * @returns RayHit or undefined if nothing is hit
 */
function to(from: Vector3, dest: Vector3, properties: Partial<RayProperties> = {}): RayHit | undefined {
  const getEntity = (properties.getEntity !== undefined) ? properties.getEntity : false;
  const getUVs = (properties.getUVsFromMeshEntity !== undefined) ? (properties.getUVsFromMeshEntity.mesh.nodeID ?? -1) : -1;

  const payload = Godot.raycast(from.x, from.y, from.z, dest.x, dest.y, dest.z, getUVs);

  if (payload) {
    const hitPos = new Vector3(payload.hitPosX, payload.hitPosY, payload.hitPosZ);

    let entity: Entity | undefined;

    if (getEntity && payload.nodeID !== -1) {
      entity = Entity.getEntityByID(payload.nodeID);
    }

    let uv: Vector2 | undefined;

    if (payload.uvX !== -1 && payload.uvY !== -1) {
      uv = new Vector2(payload.uvX, payload.uvY);
    }

    return {
      pos: hitPos,
      normal: new Vector3(payload.normalX, payload.normalY, payload.normalZ),
      distance: from.distanceTo(hitPos),
      entity: entity,
      uv: uv,
    };
  }
  else {
    return undefined;
  }
}


export type RayHit = {
  pos: Vector3,
  normal: Vector3,
  distance: number,
  entity: Entity | undefined,
  uv: Vector2 | undefined,
}

export type RayProperties = { getEntity: boolean, getUVsFromMeshEntity: Entity | undefined }