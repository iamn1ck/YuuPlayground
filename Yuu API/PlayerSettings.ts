import { Vector3 } from "./Basic Types/Vector3";
import { Files } from "./Files";


export type PlayerSettings = {
  version: number,
  username: string,
  visits: number,
  lastPos: Vector3,
}


export const PlayerSettings = {
  get,
  update,
}


let settings: PlayerSettings | undefined;


/**
 * Gets the player settings JSON object
 * @returns 
 */
function get(): PlayerSettings {
  if (settings === undefined) {
    settings = getEmptyPlayerSettings();

    const settingsString = Files.text.get('user://profile', '', 'settings', '.json');

    if (settingsString) {
      const oldSettings: PlayerSettings = JSON.parse(settingsString);

      // Would be wise to rethink this to consider the case of erased data (ie. going from a new version to an old on accident)

      if (oldSettings.username !== undefined) {
        settings.username = oldSettings.username;
      }
      if (oldSettings.visits !== undefined) {
        settings.visits = oldSettings.visits;
      }
      if (oldSettings.lastPos !== undefined) {
        settings.lastPos = oldSettings.lastPos;
      }
    }
  }

  return settings ?? getEmptyPlayerSettings();
}

function getEmptyPlayerSettings(): PlayerSettings {
  return {
    version: 1,
    username: 'unknown',
    visits: 0,
    lastPos: Vector3.up,
  }
}

/**
 * Updates the player settings file
 */
function update() {
  if (settings === undefined) {
    Files.text.update('user://profile', '', 'settings', '.json', JSON.stringify(get()));
  }
  else {
    Files.text.update('user://profile', '', 'settings', '.json', JSON.stringify(settings));
  }
}
