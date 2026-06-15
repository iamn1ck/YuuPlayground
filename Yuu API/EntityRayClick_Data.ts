import { Color } from "./Basic Types/Color";
import { Quaternion } from "./Basic Types/Quaternion";
import { Vector3 } from "./Basic Types/Vector3";
import { spawnPrimitive } from "./SpawnPrimitive";


export const entityRayClick_Data = {
  leftPointer: spawnPrimitive.cube(new Vector3(0, -10, 0), Vector3.one, Quaternion.one, Color.black, 0.5, false, 'Empty', undefined),
  rightPointer: spawnPrimitive.cube(new Vector3(0, -10, 0), Vector3.one, Quaternion.one, Color.black, 0.5, false, 'Empty', undefined),
}


