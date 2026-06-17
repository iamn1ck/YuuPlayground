import { registerStart } from "./Yuu API/RegisterStart";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { antichamber } from "./Antichamber";
import { initializeCubeGun, CubeEntity } from "./CubeGun";
import { scene } from "./Scene";
import { win } from "./WinRoom";

registerStart(start);
async function start() {

  // gravity door with block under it
  antichamber.spawnDoor(new Vector3(9,1,0));



  // static door at 18,0,0
  antichamber.spawnStaticDoor(new Vector3(18, 2, 0));

  // gravity door down physics, laser makes it go up
  // 22.25x, 0, 0
  // door connected to laser, laser position 13.5x
  antichamber.spawnLaserDoor(new Vector3(22.2, 2, 0), new Vector3(13.5, 1.0, 0));


  // gravity door at 31.75x, 0,0
  // laser at 36,0,0
  antichamber.spawnLaserDoor(new Vector3(31.9, 2, 0), new Vector3(35.6, 1.0, 0), new Vector3(0.1, 0.1, 0.1));
  new CubeEntity(new Vector3(35.6, 1.0, 0));
  new CubeEntity(new Vector3(44.5, 1.0, 0));
  
  // gravity door up, blocked with cube on 35.5 laser makes it go up


  antichamber.spawnStaticDoor(new Vector3(35.5, 2, 0));
  antichamber.spawnStaticDoor(new Vector3(39, 2, 0));

  // static door at 35.5,0,0
  // static door at 39,0,0


  // gravity door down, laser makes it go up
  antichamber.spawnLaserDoor(new Vector3(42.5, 2, 0), new Vector3(38.9, 1.0, 0), new Vector3(0.1, 0.1, 0.1));

  // static door at 54,0,0
  antichamber.spawnStaticDoor(new Vector3(54, 2, 0));

  // these doors should be rotated 90 degrees
  const rot90 = Quaternion.fromEuler(new Vector3(0, Math.PI / 2, 0));
  antichamber.spawnLaserDoor(new Vector3(56, 2, -1.5), new Vector3(53.9, 1.0, 0), new Vector3(0.1, 0.1, 0.1), false, rot90);
  antichamber.spawnLaserDoor(new Vector3(56, 2, 0), new Vector3(53.9, 1.0, 0), new Vector3(0.1, 0.1, 0.1), true, rot90);
  antichamber.spawnLaserDoor(new Vector3(56, 2, 1.5), new Vector3(53.9, 1.0, 0), new Vector3(0.1, 0.1, 0.1), false, rot90);



  antichamber.spawnStaticDoor(new Vector3(58, 2, 0));


  // 3 doors 
  // gravity down, laser makes it go up
  // gravity up, laser make it go down
  // gravity down, laser make it go up


  // static door at 58,0,0

  // final 3 lasers door for winning
  antichamber.spawnMultiLaserDoor(
    new Vector3(64, 2, 0),
    [
      new Vector3(63.4, 1.0, 2),
      new Vector3(63.4, 1.0, 3),
      new Vector3(63.4, 1.0, 4)
    ],
    new Vector3(0.1, 0.1, 0.1)
  );

 
  win.winRoom()


  initializeCubeGun();
  // scene.spawnChamber();
  scene.spawnScene();
}
