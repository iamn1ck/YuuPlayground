import { Quaternion } from "./Basic Types/Quaternion";
import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";
import { Controller } from "./Controller";
import { Entity } from "./Entity";
import { entity_Data } from "./Entity_Data";
import { entityRayClick_Data } from "./EntityRayClick_Data";
import { Events } from "./Events";
import { Paint } from "./Paint";
import { Player } from "./Player";
import { Raycast, RayHit } from "./Raycast";
import { registerStart } from "./RegisterStart";


// Need to bring back color on these when pointed at a paintable entity
// If hitting paintable, and the color is not already set, update the color, if not a paintable entity, use default color


registerStart(start);
function start() {
  Events.onPhysicsUpdate(onUpdate);

  connectControllerEvents('leftTrigger', leftRayProperties);
  connectControllerEvents('rightTrigger', rightRayProperties);
}

function connectControllerEvents(buttonConnected: ControllerButtonPressed, rayProperties: RayProperties) {
  Controller.subscribe(buttonConnected, 'Pressed', () => { callRayHitCallback(rayProperties, 'Clicked'); });
  Controller.subscribe(buttonConnected, 'Update', () => { callRayHitCallback(rayProperties, 'Held'); });
  Controller.subscribe(buttonConnected, 'Released', () => { callRayHitCallback(rayProperties, 'Released'); });
}

function onUpdate(deltaTime: number) {
  if (entity_Data.rayClickMap.size > 0) {
    rayClick();
  }
}


type RayProperties = {
  lastHitUVEntity: Entity | undefined,
  isVisible: boolean,
  isIndexPressed: boolean,
  currentEntity: Entity | undefined,
  currentClickedEntity: Entity | undefined,
  rayHit: RayHit | undefined,
  lastUV: Vector2 | undefined;
}

const leftRayProperties: RayProperties = {
  lastHitUVEntity: undefined,
  isVisible: true,
  isIndexPressed: false,
  currentEntity: undefined,
  currentClickedEntity: undefined,
  rayHit: undefined,
  lastUV: undefined,
}

const rightRayProperties: RayProperties = {
  lastHitUVEntity: undefined,
  isVisible: true,
  isIndexPressed: false,
  currentEntity: undefined,
  currentClickedEntity: undefined,
  rayHit: undefined,
  lastUV: undefined,
}


function rayClick() {
  if (entityRayClick_Data.leftPointer && entityRayClick_Data.rightPointer) {
    perHandRayClick(leftRayProperties, entityRayClick_Data.leftPointer, Player.leftHand.position.get(), Player.leftHand.forward.get(), Player.leftHand.rotation.get());
    perHandRayClick(rightRayProperties, entityRayClick_Data.rightPointer, Player.rightHand.position.get(), Player.rightHand.forward.get(), Player.rightHand.rotation.get());
  }
}

function perHandRayClick(rayProperties: RayProperties, pointer: Entity, pos: Vector3 | undefined, forward: Vector3 | undefined, rotation: Quaternion | undefined) {
  if (pos && forward && rotation) {
    rayProperties.currentEntity = undefined;

    const lastUV = rayProperties.lastUV;
    rayProperties.lastUV = undefined;

    const rayHit = Raycast.directional(pos, forward, 5, { getEntity: true, getUVsFromMeshEntity: rayProperties.lastHitUVEntity });

    if (rayHit) {
      rayProperties.rayHit = rayHit;
    }

    if (rayHit?.entity) {
      rayProperties.currentEntity = rayHit.entity;

      const hitUVEntity = entity_Data.uvEntities.includes(rayHit.entity.nodeID ?? -1);
      const hitPaintableEntity = entity_Data.paintableEntities.includes(rayHit.entity.nodeID ?? -1);
      const hitClickableEntity = entity_Data.rayClickMap.has(rayHit.entity.nodeID ?? -1);

      if (hitPaintableEntity || hitClickableEntity) {
        const placementPos = pos.add(forward.multiply(rayHit.distance / 2));

        pointer.pos = placementPos;
        pointer.scale = new Vector3(0.001, 0.005, rayHit.distance);
        pointer.rot = rotation;

        if (!rayProperties.isVisible) {
          rayProperties.isVisible = true;
          pointer.visible.set(true);
        }

        const texture = rayHit.entity.mesh.texture.get();

        if (texture && rayProperties.isIndexPressed) {
          if (hitPaintableEntity && rayProperties.lastHitUVEntity === rayHit.entity) {
            if (rayHit.uv) {
              if (lastUV) {
                Paint.uvPath(texture, lastUV, rayHit.uv);
              }

              rayProperties.lastUV = rayHit.uv;
            }
          }
        }
      }

      rayProperties.lastHitUVEntity = hitUVEntity ? rayHit.entity : undefined;
    }
    else {
      if (rayProperties.isVisible) {
        rayProperties.isVisible = false;
        pointer.visible.set(false);
      }
    }
  }
}

function callRayHitCallback(rayProperties: RayProperties, type: 'Clicked' | 'Held' | 'Released') {
  if (type === 'Clicked') {
    rayProperties.isIndexPressed = true;
    rayProperties.currentClickedEntity = undefined;
  }

  if (rayProperties.currentEntity && rayProperties.rayHit) {
    const payload = entity_Data.rayClickMap.get(rayProperties.currentEntity.nodeID ?? -1);

    if (payload) {
      if (type === 'Held') {
        if (payload.heldFunction && rayProperties.currentClickedEntity === rayProperties.currentEntity) {
          payload.heldFunction(rayProperties.rayHit);
        }
      }
      else if (type === 'Clicked') {
        rayProperties.currentClickedEntity = rayProperties.currentEntity;

        if (payload.clickFunction) {
          payload.clickFunction(rayProperties.rayHit);
        }
      }
      else if (type === 'Released') {
        if (payload.releaseFunction && rayProperties.currentClickedEntity === rayProperties.currentEntity) {
          payload.releaseFunction(rayProperties.rayHit);
        }
      }
    }
  }

  if (type === 'Released') {
    rayProperties.isIndexPressed = false;
    rayProperties.currentClickedEntity = undefined;
    rayProperties.lastUV = undefined;
  }
}