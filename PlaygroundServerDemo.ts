import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Entity } from "./Yuu API/Entity";
import { yuuSignalingServer } from "./Yuu API/Networking/YuuSignalingServer";


let keyboardInputEventID = 0;
let keyboardText = 'Server Demo';
let asyncID = 0;
let keyboardTextEntity: Entity | undefined;

export function serverKeyboardDemo(pos: Vector3) {
  keyboardTextEntity = new Entity(pos, Quaternion.one, Vector3.one, undefined, 'Empty');
  keyboardTextEntity.text.create(keyboardText, 20, 0);

  const greenTrigger = new Entity(pos.add(new Vector3(-0.5, 0, 1)), Quaternion.one, Vector3.one, undefined, 'Empty');
  greenTrigger.trigger.initialize(0.25, 1);
  greenTrigger.trigger.setVisible(true, Color.green);
  greenTrigger.trigger.setOccupiedFunction((payload) => { create(); });

  const redTrigger = new Entity(pos.add(new Vector3(0.5, 0, 1)), Quaternion.one, Vector3.one, undefined, 'Empty');
  redTrigger.trigger.initialize(0.25, 1);
  redTrigger.trigger.setVisible(true, Color.red);
  redTrigger.trigger.setOccupiedFunction((payload) => { join(); });

}

async function create() {
  const code = await yuuSignalingServer.getServerCode(true, 'Laex05', 'Grid', '');

  keyboardTextEntity?.text.display.set(code);
}

function join() {
  // keyboardText = '';
  // updateKeyboardTextDisplayed();

  // Keyboard.show(keyboardText);
  // Events.unsubscribe(keyboardInputEventID);
  // keyboardInputEventID = Events.onKeyboardInput((input) => { applyKeyboardInput(input); });


  // Keyboard.hide();
  // Events.unsubscribe(keyboardInputEventID);
}

// function applyKeyboardInput(input: string) {
//   if (input === 'Backspace') {
//     keyboardText = keyboardText.substring(0, keyboardText.length - 2);
//   }
//   else if (input.length > 1) {
//     console.log('No Handling For Input: ' + input);
//   }
//   else {
//     keyboardText += input;
//   }

//   updateKeyboardTextDisplayed();
// }

// function updateKeyboardTextDisplayed() {
//   Async.clearTimer(asyncID);
//   asyncID = Async.setTimeout(() => {
//     keyboardTextEntity?.text.display.set(keyboardText);
//   }, 10);
// }