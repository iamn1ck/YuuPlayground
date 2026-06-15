import { Color } from "./Basic Types/Color";
import { Quaternion } from "./Basic Types/Quaternion";
import { Vector3 } from "./Basic Types/Vector3";
import { Entity } from "./Entity";
import { spawnPrimitive } from "./SpawnPrimitive";


export const createUIElement = {
  button,

  // To be added:

  // These are interesting because the way they work requires call back events
  //   ie. - slider needs to report first click, onUpdate, and release -- should report percent across
  //       - string list needs a way to update the contents of the list, and will need to update on hover, and then a callback for when it is clicked

  // slider,
  // stringList,
}

/**
 * Create a simple button, an entity is returned that you can subscribe ray clicks from.
 * @param pos to place at
 * @param scale to use
 * @param rot to use
 * @param text to display on button
 * @param textColor to apply
 * @param fontSize to use
 * @param backgroundColor to use
 * @param parent optional, if used, pos is relative
 */
function button(pos: Vector3, scale: Vector3, rot: Quaternion, text: string, textColor: Color, fontSize: number, backgroundColor: Color, parent: Entity | undefined): Entity {
  const button = spawnPrimitive.plane('Front', pos.add(new Vector3(0, 0, 0.0005)), scale, rot, backgroundColor, 1, 'Concave', 'Static', parent);

  const buttonText = new Entity(new Vector3(0, 0, 0.001), Quaternion.one, Vector3.one, button, 'Static');

  buttonText.text.create(text, fontSize, 0);
  buttonText.text.doubleSided.set(false);
  buttonText.text.color.set(textColor);

  button.rayClick.initialize(false);

  return button;
}