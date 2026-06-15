import { registerStart } from "./Yuu API/RegisterStart";
import { playgroundDemos } from "./PlaygroundLaex";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { lexy } from "./PlaygroundLexy";

registerStart(start);
async function start() {

  playgroundDemos.spawnShaderSphere(new Vector3(-5, 2.5, -4));

  // playgroundDemos.spawnDissolveCubeRm2(new Vector3(5, 2.5, -4));
  playgroundDemos.spawnDissolveCubeNoUniform(new Vector3(4.5, 2.5, 0))
  playgroundDemos.spawnDissolveCubeNoUniform(new Vector3(-4.5, 2.5, 0))
  playgroundDemos.spawnDissolveCubeRm3(new Vector3(0, 2.5, -7))
  playgroundDemos.spawnDissolveCubeRm3(new Vector3(0, 2.5, 7))

  lexy.rainbowWave(new Vector3(-25,0,0));
  lexy.nissanGtr(new Vector3(25,0,0));

  lexy.sierPlane(new Vector3(0,0,-20));
}
