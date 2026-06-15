import { Vector3 } from "./Basic Types/Vector3";
import { Entity } from "./Entity";
import { entity_Data } from "./Entity_Data";
import { Events } from "./Events";
import { registerStart } from "./RegisterStart";


registerStart(start);
function start() {
  Events.onPhysicsUpdate(onUpdate);
}

function onUpdate(deltaTime: number) {
  const playerPositions: Vector3[] = [];

  // What about triggers that only detect specific body parts
  addToArray(playerPositions, Godot.localPlayer.head.position.get());
  addToArray(playerPositions, Godot.localPlayer.body.position.get());
  addToArray(playerPositions, Godot.localPlayer.leftHand.position.get());
  addToArray(playerPositions, Godot.localPlayer.rightHand.position.get());
  addToArray(playerPositions, Godot.localPlayer.foot.position.get());

  entity_Data.triggerMap.forEach((payload, entityNodeID) => {
    // Current Sphere / Cylinder triggers only work upright
    // Need Cube triggers with directions badly


    // Is this necessary if we make sure that deleting the entity deletes the trigger?

    const entity = Entity.getEntityByID(entityNodeID);

    if (entity) {
      const entityPos = entity.pos;

      let parent = entity.parent;

      // This is way overkill for a static trigger, definitely shouldn't do this on update if it isn't animated
      while (parent) {
        entityPos.addInPlace(parent.pos);

        parent = parent.parent;
      }

      let didTrigger = false;
      const positions: Vector3[] = []

      playerPositions.forEach((pos) => {
        let isInTrigger = false;

        if (payload.yRadius === undefined) {
          isInTrigger = entityPos.distanceTo(pos) < payload.triggerRadius;
        }
        else {
          const distVec = entityPos.subtract(pos);

          if (Math.abs(distVec.y) < payload.yRadius) {
            if (((distVec.x * distVec.x) + (distVec.z * distVec.z)) < (payload.triggerRadius * payload.triggerRadius)) {
              isInTrigger = true;
            }
          }
        }

        if (isInTrigger) {
          payload.activeCount++;
          didTrigger = true;
          [positions.push(pos)];

          if (payload.activeCount === 1) {
            if (payload.occupiedTriggeredFunction) {
              payload.occupiedTriggeredFunction({ pos: pos });
            }
          }
        }
      });

      if (didTrigger) {
        if (payload.onUpdateTriggeredFunction) {
          payload.onUpdateTriggeredFunction({ positions: positions });
        }
      }
      else {
        if (payload.activeCount > 0) {
          payload.activeCount = 0;

          if (payload.emptyTriggeredFunction) {
            payload.emptyTriggeredFunction();
          }
        }
      }
    }
  });
}


function addToArray(array: Vector3[], item: { x: number; y: number; z: number; } | undefined) {
  if (item) {
    array.push(new Vector3(item.x, item.y, item.z));
  }
}