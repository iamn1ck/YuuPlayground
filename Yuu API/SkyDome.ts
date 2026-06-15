import { Color } from "./Basic Types/Color";


export const SkyDome = {
  ambientLight: {
    /**
     * Color of the ambient light in the world.
     */
    baseColor: {
      set: (color: Color): boolean => { return Godot.skyDome.ambientLight.baseColor.set(color.r, color.g, color.b); },
      get: (): Color | undefined => { const color = Godot.skyDome.ambientLight.baseColor.get(); if (color) { return new Color(color.r, color.g, color.b); } else { return color; } },
    },
    /**
     * Increase or decrease the brightness of the scene. Defaults to 1.
     */
    energy: {
      set: (value: number): boolean => { return Godot.skyDome.ambientLight.energy.set(value); },
      get: (): number | undefined => { return Godot.skyDome.ambientLight.energy.get(); },
    },
    /**
     * Allows the sky color to cast colored light on the scene (from above and below).
     * Values range from 0 (no contribution) to 1 (max contribution). Defaults to 0.
     */
    skyColorContribution: {
      set: (value: number): boolean => { return Godot.skyDome.ambientLight.skyColorContribution.set(value); },
      get: (): number | undefined => { return Godot.skyDome.ambientLight.skyColorContribution.get(); },
    },
  },
  skyMaterial: {
    setProceduralSkyMaterial,
  },
}

/**
 * Updates the Procedural Sky Material, or creates one if it doesn't already exist. Undefined values are skipped.
 * @param topColor Sky Color
 * @param topHorizonColor Best to match bottomHorizonColor
 * @param topCurve How sharply the top and horizon colors fade together
 * @param bottomColor Ground Color
 * @param bottomHorizonColor Best to match topHorizonColor
 * @param bottomCurve How sharply the bottom and horizon colors fade together
 * @returns boolean true if successful
 */
function setProceduralSkyMaterial(
  topColor: Color | undefined,
  topHorizonColor: Color | undefined,
  topCurve: number | undefined,
  bottomColor: Color | undefined,
  bottomHorizonColor: Color | undefined,
  bottomCurve: number | undefined,
): boolean {
  return Godot.skyDome.skyMaterial.setProceduralSkyMaterial(
    topColor ? { r: topColor.r, g: topColor.g, b: topColor.b } : undefined,
    topHorizonColor ? { r: topHorizonColor.r, g: topHorizonColor.g, b: topHorizonColor.b } : undefined,
    topCurve,
    bottomColor ? { r: bottomColor.r, g: bottomColor.g, b: bottomColor.b } : undefined,
    bottomHorizonColor ? { r: bottomHorizonColor.r, g: bottomHorizonColor.g, b: bottomHorizonColor.b } : undefined,
    bottomCurve,
  );
}