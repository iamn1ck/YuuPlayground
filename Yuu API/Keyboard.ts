import { Events } from "./Events";


export const Keyboard = {
  show,
  hide,
  onKeyboardInput: Godot.events.onKeyboardInput,
  unsubscribe: Events.unsubscribe,
  clipboard: {
    set: setClipboard,
    get: getClipboard,
  },
}


function show(defaultText: string) {
  Godot.keyboard.show(defaultText);
}

function hide() {
  Godot.keyboard.hide();
}

function setClipboard(text: string) {
  Godot.keyboard.clipboard.set(text);
}

function getClipboard(): string {
  return Godot.keyboard.clipboard.get() ?? '';
}