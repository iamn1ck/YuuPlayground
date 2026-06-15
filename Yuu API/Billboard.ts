import { Quaternion } from "./Basic Types/Quaternion";
import { Vector3 } from "./Basic Types/Vector3";
import { Entity } from "./Entity";
import { Events } from "./Events";
import { Player } from "./Player";
import { registerStart } from "./RegisterStart";


registerStart(worldStart);
function worldStart() {
  Events.onUpdate(billboardOnUpdate);
}


export type BillboardMode = 'YLock' | 'Freely';


const billboardMap = new Map<Entity, BillboardMode>();

function billboardOnUpdate(deltaTime: number) {
  const localPlayerPos = Player.head.position.get();
  
  if (localPlayerPos) {
    billboardMap.forEach((mode, entity) => {
      const pos = entity.pos;

      const direction = localPlayerPos.subtract(pos);

      if (mode === 'YLock') {
        direction.y = 0;
      }

      direction.normalizeInPlace();

      entity.rot = Quaternion.lookAt(direction, Vector3.up);
    });
  }
}


export const Billboard = {
  start,
  stop,
}


function start(entity: Entity, mode: BillboardMode) {
  billboardMap.set(entity, mode);
}

function stop(entity: Entity) {
  billboardMap.delete(entity);
}

