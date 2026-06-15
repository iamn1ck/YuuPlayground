import { arrayUtils } from "../ArrayUtils";
import { Events } from "../Events";
import { registerStart } from "../RegisterStart";


export class Peer {
  id: number;

  constructor() {
    this.id = -2;

    peers.push(this);
  }

  close() {
    if (this.id !== -1) {
      Godot.networking.rtcPeer.close(this.id);

      this.id = -1;

      arrayUtils.removeItemFromArray(peers, this);
    }
  }

  getState(): ('New' | 'Connecting' | 'Connected' | 'Disconnected' | 'Closed' | 'Failed') {
    if (this.id !== -1) {
      const state = Godot.networking.rtcPeer.state(this.id);

      if (state) {
        return state;
      }
    }

    return 'Closed';
  }

}


const peers: Peer[] = [];

registerStart(start);
function start() {
  Events.onUpdate(onUpdate);
}

function onUpdate(deltaTime: number) {
  peers.forEach((peer) => {
    if (peer.id !== -1) {
      if (peer.id === -2) {
        peer.id = Godot.networking.rtcPeer.create();
      }
      else {
        Godot.networking.rtcPeer.poll(peer.id);
      }
    }
  });
}