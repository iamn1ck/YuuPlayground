import { Events } from "./Events";
import { registerStart } from "./RegisterStart";


type ControllerEventType = 'Update' | 'Pressed' | 'Released';


export const Controller = {
  subscribe,
  unsubscribe,
}


const buttonSubscriptions = new Map<ControllerButtonPressed, Map<number, { type: ControllerEventType, func: () => void }>>();

let id = 0;

/**
 * Subscribe a function
 * @param controller 
 * @param buttons 
 * @param type 
 * @returns number id to unsubscribe function
 */
function subscribe(button: ControllerButtonPressed, type: ControllerEventType, func: () => void): number {
  id++;

  let buttonSubscriptionsMap = buttonSubscriptions.get(button);

  if (buttonSubscriptionsMap === undefined) {
    buttonSubscriptionsMap = new Map<number, { type: ControllerEventType, func: () => void }>();
    buttonSubscriptions.set(button, buttonSubscriptionsMap);
  }

  buttonSubscriptionsMap.set(id, { type: type, func: func });

  return id;
}


/**
 * Unsubscribe a controller callback function
 * @param id of the subscription
 * @returns true if id existed and has been unsubscribed, or false if the id does not exist
 */
function unsubscribe(id: number) {
  buttonSubscriptions.forEach((buttonPayload) => {
    let has = false;
    buttonPayload.forEach((payload, subscriptionID) => {
      if (subscriptionID === id) {
        has = true;
      }
    });

    if (has) {
      return buttonPayload.delete(id);
    }
  });

  return false;
}



registerStart(start);
function start() {
  Events.onPhysicsUpdate(onUpdate);
  Godot.events.onControllerInput(onControllerInput);
}


function onUpdate(deltaTime: number) {
  callSubscriptions();
}


let buttonsPressed: ControllerButtonPressed[] = [];
let buttonsPressedLast: ControllerButtonPressed[] = [];

function onControllerInput(inputsPressed: ControllerButtonPressed[]) {
  buttonsPressed = inputsPressed;
}

function callSubscriptions() {
  buttonsPressed.forEach((buttonPressed) => {
    const subscriptionMap = buttonSubscriptions.get(buttonPressed);
  
    if (subscriptionMap) {
      const isFirstPress = !buttonsPressedLast.includes(buttonPressed);
  
      subscriptionMap.forEach((payload) => {
        let callFunc = false;
  
        if (payload.type === 'Update') {
          callFunc = true;
        }
        else if (payload.type === 'Pressed' && isFirstPress) {
          callFunc = true;
        }
  
        if (callFunc) {
          payload.func();
        }
      });
    }
  });
  
  callReleaseSubscriptions(buttonsPressed, buttonsPressedLast);
  
  buttonsPressedLast = buttonsPressed;
  buttonsPressed = [];
}

function callReleaseSubscriptions(inputsPressed: ControllerButtonPressed[], lastPressed: ControllerButtonPressed[]) {
  lastPressed.forEach((buttonPressed) => {
    if (!inputsPressed.includes(buttonPressed)) {
      const subscriptionMap = buttonSubscriptions.get(buttonPressed);

      if (subscriptionMap) {
        subscriptionMap.forEach((payload) => {
          if (payload.type === 'Released') {
            payload.func();
          }
        });
      }
    }
  });
}