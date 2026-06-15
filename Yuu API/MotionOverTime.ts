import { Quaternion } from "./Basic Types/Quaternion";
import { Vector3 } from "./Basic Types/Vector3";
import { Entity } from "./Entity";
import { Events } from "./Events";
import { registerStart } from "./RegisterStart";


let id = 0;
const scalingEntities: EntityInMotion[] = [];
const movingEntities: EntityInMotion[] = [];
const rotatingEntities: EntityInMotion[] = [];

let timeSinceScriptEpoch = 0;


// Over Time Utility


export const overTime = {
  scaleTo: {
    /**
     * Start a scaling motion on an entity (cancels any previous scaling applied to the entity)
     * @param entity Entity to affect
     * @param scaleTo End scale
     * @param durationMs Time in Ms to reach the scaleTo
     * @returns `number` ID that can be used to cancel this scaleTo
     */
    start: addScalingEntity,

    /**
     * Cancel an object that is currently scaling
     * @param identifier Either the number ID assigned when scaleTo was started, or the entity that is scaling
     */
    cancel: cancelScalingEntity,
    
    /**
     * @returns an array of all currently scaling `EntityInMotion` 
     */
    getAll: getScalingEntities,
  },

  moveTo: {
    /**
     * Start moving an entity (cancels any previous moveTo applied to the entity)
     * @param entity Entity to affect
     * @param moveTo End position
     * @param durationMs Time in Ms to reach the moveTo
     * @returns `number` ID that can be used to cancel this moveTo
     */
    start: addMovingEntity,

    /**
     * Cancel an object that is currently moving
     * @param identifier Either the number ID assigned when moveTo was started, or the entity that is moving
     */
    cancel: cancelMovingEntity,
    
    /**
     * @returns an array of all currently moving `EntityInMotion` 
     */
    getAll: getMovingEntities,
  },

  rotateTo: {
    /**
     * Start rotating an entity (cancels any previous rotation applied to the entity)
     * @param entity Entity to affect
     * @param rotateTo End rotation
     * @param durationMs Time in Ms to reach the rotateTo
     * @returns `number` ID that can be used to cancel this rotateTo
     */
    start: addRotatingEntity,

    /**
     * Cancel an object that is currently rotating
     * @param identifier Either the number ID assigned when rotateTo was started, or the entity that is rotating
     */
    cancel: cancelRotatingEntity,
    
    /**
     * @returns an array of all currently rotating `EntityInMotion` 
     */
    getAll: getRotatingEntities,
  },
}


/* Scale To Over Time */

function getScalingEntities(): EntityInMotion[] {
  return scalingEntities;
}

function addScalingEntity(entity: Entity, scaleTo: Vector3, durationMs: number): number {
  cancelScalingEntity(entity);
  
  id++;

  addEntityInMotionToArray(entity, entity.scale, scaleTo, durationMs, id, scalingEntities);

  return id;
}

function cancelScalingEntity(identifier: number | Entity) {
  cancelFromArray(identifier, scalingEntities);
}


/* Move To Over Time */

function getMovingEntities(): EntityInMotion[] {
  return movingEntities;
}

function addMovingEntity(entity: Entity, moveTo: Vector3, durationMs: number): number {
  cancelMovingEntity(entity);
  
  id++;

  addEntityInMotionToArray(entity, entity.pos, moveTo, durationMs, id, movingEntities);

  return id;
}

function cancelMovingEntity(identifier: number | Entity) {
  cancelFromArray(identifier, movingEntities);
}


/* Rotate To Over Time */

function getRotatingEntities(): EntityInMotion[] {
  return rotatingEntities;
}

function addRotatingEntity(entity: Entity, rotateTo: Quaternion, durationMs: number): number {
  cancelRotatingEntity(entity);
  
  id++;

  addEntityInMotionToArray(entity, entity.rot, rotateTo, durationMs, id, rotatingEntities);

  return id;
}

function cancelRotatingEntity(identifier: number | Entity) {
  cancelFromArray(identifier, rotatingEntities);
}


/* Helper Functions */

function cancelFromArray(identifier: number | Entity, array: EntityInMotion[]) {
  let cancelIndex = -1;
  
  array.forEach((entityInMotion, index) => {
    if (entityInMotion.id === identifier || entityInMotion.entity === identifier) {
      cancelIndex = index;
    }
  });

  if (cancelIndex >= 0) {
    array.splice(cancelIndex, 1);
  }
}


function addEntityInMotionToArray(entity: Entity, start: Vector3 | Quaternion, end: Vector3 | Quaternion, durationMs: number, id: number, array: EntityInMotion[]) {
  const entityInMotion: EntityInMotion = {
    entity: entity,
    startTime: timeSinceScriptEpoch,
    endTime: timeSinceScriptEpoch + durationMs,
    durationMs: durationMs,
    start: start.clone(),
    end: end.clone(),
    id: id,
  }

  array.push(entityInMotion);
}


// Motion Occurs On Physics Update


registerStart(start);
function start() {
  timeSinceScriptEpoch = Date.now();

  Events.onPhysicsUpdate(onPhysicsUpdate);
}

function onPhysicsUpdate(deltaTime: number) {
  timeSinceScriptEpoch += (deltaTime * 1000);

  updateScalingEntities(timeSinceScriptEpoch);
  updateMovingEntities(timeSinceScriptEpoch);
  updateRotatingEntities(timeSinceScriptEpoch);
}


function updateScalingEntities(curTimeSinceEpoch: number) {
  const curScaling = overTime.scaleTo.getAll();
  const curScalingToRemove: Entity[] = [];

  curScaling.forEach((entityInMotion) => {
    if (entityInMotion.endTime > curTimeSinceEpoch) {
      const percentComplete = (curTimeSinceEpoch - entityInMotion.startTime) / entityInMotion.durationMs;

      if (entityInMotion.start instanceof Vector3 && entityInMotion.end instanceof Vector3) {
        entityInMotion.entity.scale = Vector3.lerp(entityInMotion.start, entityInMotion.end, percentComplete);
      }
    }
    else {
      if (entityInMotion.end instanceof Vector3) {
        entityInMotion.entity.scale = entityInMotion.end;
      }

      curScalingToRemove.push(entityInMotion.entity);
    }
  });

  curScalingToRemove.forEach((entity) => {
    overTime.scaleTo.cancel(entity);
  });
}

function updateMovingEntities(curTimeSinceEpoch: number) {
  const curMoving = overTime.moveTo.getAll();
  const curMovingToRemove: Entity[] = [];

  curMoving.forEach((entityInMotion) => {
    if (entityInMotion.endTime > curTimeSinceEpoch) {
      const percentComplete = (curTimeSinceEpoch - entityInMotion.startTime) / entityInMotion.durationMs;

      if (entityInMotion.start instanceof Vector3 && entityInMotion.end instanceof Vector3) {
        entityInMotion.entity.pos = Vector3.lerp(entityInMotion.start, entityInMotion.end, percentComplete);
      }
    }
    else {
      if (entityInMotion.end instanceof Vector3) {
        entityInMotion.entity.pos = entityInMotion.end;
      }

      curMovingToRemove.push(entityInMotion.entity);
    }
  });

  curMovingToRemove.forEach((entity) => {
    overTime.moveTo.cancel(entity);
  });
}

function updateRotatingEntities(curTimeSinceEpoch: number) {
  const curRotating = overTime.rotateTo.getAll();
  const curRotatingToRemove: Entity[] = [];

  curRotating.forEach((entityInMotion) => {
    if (entityInMotion.endTime > curTimeSinceEpoch) {
      const percentComplete = (curTimeSinceEpoch - entityInMotion.startTime) / entityInMotion.durationMs;

      if (entityInMotion.start instanceof Quaternion && entityInMotion.end instanceof Quaternion) {
        entityInMotion.entity.rot = Quaternion.slerp(entityInMotion.start, entityInMotion.end, percentComplete);
      }
    }
    else {
      if (entityInMotion.end instanceof Quaternion) {
        entityInMotion.entity.rot = entityInMotion.end;
      }

      curRotatingToRemove.push(entityInMotion.entity);
    }
  });

  curRotatingToRemove.forEach((entity) => {
    overTime.rotateTo.cancel(entity);
  });
}


// Types


type EntityInMotion = {
  entity: Entity,
  startTime: number,
  endTime: number,
  durationMs: number,
  start: Vector3 | Quaternion,
  end: Vector3 | Quaternion,
  id: number,
}