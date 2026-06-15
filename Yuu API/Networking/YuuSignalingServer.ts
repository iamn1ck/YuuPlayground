import { Async } from "../Async";
import { Socket } from "./Socket";


export const yuuSignalingServer = {
  getServerCode,
  findServer,
}


let socket: Socket | undefined;

function initializeNewSocket(): Socket {
  if (socket) {
    socket.close();
  }
  
  return new Socket();
}

/**
 * 
 * @param isPublic 
 * @param username 
 * @param planetName 
 * @param desiredCode optional 4 numeric digits, can use previous code or an empty string for random
 * @returns 
 */
async function getServerCode(isPublic: boolean, username: string, planetName: string, desiredCode: string): Promise<string> {
  socket = initializeNewSocket();

  socket.initialize('wss://24.19.229.186:8080');

  let count = 0;
  while (!socket.isSocketOpen() && count < 600) {
    await Async.wait(50);

    count++;
  }

  if (socket.isSocketOpen()) {
    // Verify the room code is 4 numeric digits
    const message: CreateRoom = {
      type: 'create',
      data: {
        roomCode: desiredCode,
        isPublic: isPublic,
        hostName: username,
        planetName: planetName,
      }
    }

    socket.sendText(JSON.stringify(message));
  }

  count = 0;
  let packets: string[] = [];
  while (packets.length === 0 && count < 600) {
    await Async.wait(50);

    packets = socket.getPackets();
    count++;
  }

  if (packets.length > 0) {
    const parsed = JSON.parse(packets[0]);

    if (parsed.type === 'created') {
      const data: { roomCode: string, hostName: string, planetName: string, total: number } = parsed.data;
    
      return data.roomCode;
    }
  }

  return '';
}

function findServer(code: string) {
  socket = initializeNewSocket();


}


type CreateRoom = {
  type: "create",
  data: {
    roomCode: string,
    isPublic: boolean,
    hostName: string,
    planetName: string,
  }
}