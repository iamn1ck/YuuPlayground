import { arrayUtils } from "../ArrayUtils";
import { Events } from "../Events";
import { registerStart } from "../RegisterStart";


export class Socket {
  public id: number;

  constructor() {
    this.id = Godot.networking.socket.create();

    sockets.push(this);
  }

  initialize(url: string) {
    if (this.id != -1) {
      Godot.networking.socket.connectToURL(this.id, url);
    }
  }

  close() {
    if (this.id != -1) {
      Godot.networking.socket.close(this.id);

      this.id = -1;

      arrayUtils.removeItemFromArray(sockets, this);
    }
  }

  isSocketOpen(): boolean {
    return Godot.networking.socket.isSocketOpen(this.id);
  }

  sendText(msg: string) {
    if (this.id != -1) {
      Godot.networking.socket.sendText(this.id, msg);
    }
  }

  getPackets(): string[] {
    if (this.id != -1) {
      return Godot.networking.socket.getPackets(this.id);
    }
    else {
      return [];
    }
  }
}


const sockets: Socket[] = [];

registerStart(start);
function start() {
  Events.onUpdate(onUpdate);
}

function onUpdate(deltaTime: number) {
  sockets.forEach((socket) => {
    if (socket.id !== -1) {
      Godot.networking.socket.poll(socket.id);
    }
  });
}
