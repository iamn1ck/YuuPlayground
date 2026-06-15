

/**
 * Options used to select what type of animation & physics a node will have, if any
 * - Empty: Node3D: Generic node type
 * - Static: StaticBody3D: For colliders that never move
 * - Animated: AnimatableBody3D: For colliders that are animated
 * - Physics: RigidBody3D: For colliders that use the physics engine
 *  */
type BaseNodeTypes = 'Empty' | 'Static' | 'Animated' | 'Physics';

/**
 * Options used to select what type of collider the physics engine will use
 * - Convex: most optimized collider, works on both static and animated colliders, doesn't support accurate indents or holes (ie. doorway or cave entrance)
 * - Concave: for static colliders, best in specific use cases where you need more accurate collision, ie. a doorway, cave entrance 
 *  */
type ColliderTypes = 'Convex' | 'Concave';

type ControllerButtonPressed = 'rightA' | 'rightB' | 'leftX' | 'leftY' | 'leftMenu' | 'leftTrigger' | 'rightTrigger' | 'leftGrip' | 'rightGrip' | 'leftThumbstick' | 'rightThumbstick'; // 'rightHome' is used for the right menu button, but on Quest is never triggered as the app is exited when the button is clicked


// declare namespace console {
//   function log(msg: any): boolean;
//   function debug(msg: any): boolean;
//   function warn(msg: any): boolean;
//   function error(msg: any): boolean;
// }


declare namespace Godot {
  const async: {
    /**
   * Cause a callback function to run after a delay of ms
   * @param func to run
   * @param ms to wait
   * @returns number id to use for clearing the timer, returns -1 if there is an error
   */
    setTimeout: (func: () => void, ms: number) => number;

    /**
     * Cause a callback function to run after a delay of ms, and loop with the same delay until the timer is cleared
     * @param func to run
     * @param ms to wait
     * @returns number id to use for clearing the timer, returns -1 if there is an error
     */
    setInterval: (func: () => void, ms: number) => number;

    /**
     * Using the id returned by the setTimeout & setInterval functions, you can unsubscribe
     * @param id to unsubscribe
     * @returns boolean true if the timer was found and cleared
     */
    clearTimer: (id: number) => boolean;
  }

  const events: {
    /**
   * Subscribe a function to the process / frame update
   * @param func to subscribe
   * @returns number id that can be used to unsubscribe, returns -1 if there is an error
   */
    onUpdate: (func: (deltaTime: number) => void) => number;

    /**
     * Subscribe a function to the physics process update
     * @param func to subscribe
     * @returns number id that can be used to unsubscribe, returns -1 if there is an error
     */
    onPhysicsUpdate: (func: (deltaTime: number) => void) => number;

    /**
     * Subscribe a function to receive keyboard input
     * @param func to subscribe
     * @returns number id that can be used to unsubscribe, returns -1 if there is an error
     */
    onKeyboardInput: (func: (input: string) => void) => number;

    /**
     * Subscribe a function to receive controller inputs
     * @param func to subscribe
     * @returns number id that can be used to unsubscribe, returns -1 if there is an error
     */
    onControllerInput: (func: (inputsPressed: ControllerButtonPressed[]) => void) => number;

    /**
     * Using the id returned by the subscribe function, you can unsubscribe
     * @param id to unsubscribe
     * @returns boolean true if the id was found and unsubscribed
     */
    unsubscribe: (id: number) => boolean;
  }



  // Things needed to be able to "travel to a new world"
  // - Download zip from git hub
  // - Unzip (should be done on separate thread)
  // - Get contents of a folder

  // Ideally a user could type in their git repo, it would download into a templates folder
  // The user could then select a template to open
  // Eventually these would not just open, but would become world save files (will need some way to update the code once created)
  // Will also need a way to delete templates (maybe built in can't be deleted)
  // Long term need a way to transfer read/write files locally over LAN


  const files: {
    zip: {
      compressFolder: (dirPathToCompress: string, saveZipToDirPath: string, zipFileName: string) => boolean;
      extractFiles: (zipDirPath: string, saveDirPath: string, unzippedFolderName: string) => boolean;
    }
    folder: {
      /**
       * Create a folder at the specified dirPath
       * @param dirPath to create a folder in, path to directory will be created if it doesn't exist
       * @param folderName to create
       * @returns boolean true if successful
       */
      create: (dirPath: string, folderName: string) => boolean;
      /**
       * Get the contents of a dirPath
       * @param dirPath to get contents of
       * @param isRecursive if true will return contents of sub folders as well
       * @returns array of [directory path, file/folder name, file extension, "?" if no extension, or "" empty string for folders]
       */
      getContents: (dirPath: string, isRecursive: boolean) => [string, string, string][];
    }
    text: {
      /**
       * Create a text file at the specified directory with corresponding name and extension (overwrites if it already exists)
       * @param dirPath location to save the file
       * @param fileName to use
       * @param fileExtension to append (ie. '.txt')
       * @param content to be saved in the file
       * @returns true if successful
       */
      create: (dirPath: string, fileName: string, fileExtension: string, content: string) => boolean;
      /**
       * Updates if the file exists or creates a text file if it doesn't already exist
       * @param dirPath location to save the file
       * @param fileName to use
       * @param fileExtension to append (ie. '.txt')
       * @param content to be saved in the file
       * @returns true if successful
       */
      update: (dirPath: string, fileName: string, fileExtension: string, content: string) => boolean;
      /**
       * Get the contents of a text file
       * @param dirPath location of the file
       * @param fileName to get
       * @param fileExtension ie. '.txt'
       * @returns string contents, or undefined if unsuccessful
       */
      get: (dirPath: string, fileName: string, fileExtension: string) => string | undefined;
    }
  }

  const image: {
    /**
     * Create an image
     * @param width in pixels
     * @param height in pixels
     * @returns number id of image
     */
    create: (width: number, height: number) => number | undefined;

    /**
     * Delete an image from memory
     * @param id of image
     * @returns boolean true if image exists and was deleted
     */
    delete: (id: number) => boolean;

    /**
     * Apply a texture to a mesh node
     * @param nodeID of the mesh
     * @param imageID of the image
     * @returns boolean true if successful
     */
    applyAsTextureToMesh: (nodeID: number, imageID: number) => boolean;

    /**
     * Get the color of a pixel
     * @param imageID to get pixel data from
     * @param x of pixel coord
     * @param y of pixel coord
     * @returns color data or undefined if invalid
     */
    getPixelColor: (imageID: number, x: number, y: number) => { r: number, g: number, b: number, a: number } | undefined;

    /**
     * Set the color of a pixel
     * @param imageID to effect
     * @param pixels array of x, y values
     * @param r of color
     * @param g of color
     * @param b of color
     * @param a alpha value
     * @returns boolean true if successful
     */
    setPixelsColor: (imageID: number, pixels: Int32Array, r: number, g: number, b: number, a: number) => boolean;

    /**
     * Blend new color with the existing pixel color
     * @param imageID to effect
     * @param pixels array of x, y values
     * @param r of color
     * @param g of color
     * @param b of color
     * @param a alpha value
     * @param originalPercentRemaining amount of the original color to keep (ranging from 0 to 1)
     * @returns boolean true if successful
     */
    blendPixelsColor: (imageID: number, pixels: Int32Array, r: number, g: number, b: number, a: number, originalPercentRemaining: number) => boolean;

    /** Fill an entire image with a given color
    * @param imageID to effect
    * @param r of color
    * @param g of color
    * @param b of color
    * @param a alpha value, if using undefined it keeps the original alpha (but is less optimized)
    * @returns boolean true if successful
    */
    fillWithColor: (imageID: number, r: number, g: number, b: number, a: number | undefined) => boolean;

    /**
     * Goes through all pixels in an image, and if they match the first color, they are set to the new color
     * @param imageID to effect
     * @param r1 red of color to swap
     * @param g1 green of color to swap
     * @param b1 blue of color to swap
     * @param a1 alpha of color to swap
     * @param r2 red of color to apply
     * @param g2 green of color to apply
     * @param b2 blue of color to apply
     * @param a2 alpha of color to apply
     * @returns boolean true if successful
     */
    swapColorWithNewColor: (imageID: number, r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number | undefined) => boolean;

    /**
     * Goes through pixels in an image, from the starting pixel, and if they match the first pixel color, they are set to the new color
     * @param imageID to effect
     * @param x of pixel to connected fill
     * @param y of pixel to connected fill
     * @param r2 red of color to apply
     * @param g2 green of color to apply
     * @param b2 blue of color to apply
     * @param a2 alpha of color to apply
     * @returns boolean true if successful
     */
    fillConnectedColorWithNewColor: (imageID: number, x: number, y: number, r2: number, g2: number, b2: number, a2: number | undefined) => boolean;

    /** Fill a rectangle on an image with a given color
    * @param imageID to effect
    * @param r of color
    * @param g of color
    * @param b of color
    * @param a alpha value
    * @param x pixel coordinate
    * @param y pixel coordinate
    * @param width of rectangle in pixels
    * @param height of rectangle in pixels
    * @returns boolean true if successful
    */
    fillRectWithColor: (imageID: number, r: number, g: number, b: number, a: number, x: number, y: number, width: number, height: number) => boolean;

    /** Fill a rectangle on an image with a rectangle from another image
    * @param destImageID to effect
    * @param destX pixel coordinate
    * @param destY pixel coordinate
    * @param rectImageID to copy from to fill the dest rect with
    * @param copyFromX pixel coordinate
    * @param copyFromY pixel coordinate
    * @param width of rectangle in pixels
    * @param height of rectangle in pixels
    * @returns boolean true if successful
    */
    fillRectWithImage: (destImageID: number, destX: number, destY: number, rectImageID: number, copyFromX: number, copyFromY: number, width: number, height: number) => boolean;

    /** Fill a rectangle on an image with a rectangle from another image using alpha
    * @param destImageID to effect
    * @param destX pixel coordinate
    * @param destY pixel coordinate
    * @param rectImageID to copy from to fill the dest rect with
    * @param copyFromX pixel coordinate
    * @param copyFromY pixel coordinate
    * @param width of rectangle in pixels
    * @param height of rectangle in pixels
    * @returns boolean true if successful
    */
    blendRectWithImage: (destImageID: number, destX: number, destY: number, rectImageID: number, copyFromX: number, copyFromY: number, width: number, height: number) => boolean;

    /**
    * Updates the texture
    * @param imageID to update
    * @returns boolean true if successful
    */
    updateTexture: (imageID: number) => boolean;

    /**
    * Updates the mip maps
    * @param imageID to update
    * @returns boolean true if successful
    */
    updateMipMaps: (imageID: number) => boolean;

    /**
    * Deletes the mip maps
    * @param imageID to delete from
    * @returns boolean true if successful
    */
    deleteMipMaps: (imageID: number) => boolean;
  }

  const node: {
    /**
     * List of available GodotNode types that can be created
     */
    create: {
      /**
       * Create a base node
       * @param parentID provide node id if you want it to be a sub node, undefined creates a top level node
       * @param type is used to select what type of animation & physics it will have, if any
       * @returns the id of the created node
       */
      base: (parentID: number | undefined, type: BaseNodeTypes) => number | undefined;

      /**
       * Create a mesh child node
       * @param parentID node to attach mesh as a child node to
       * @param verts XYZ Positions (each vert position is a multiple of 3)
       * @param uvs UV Texture Mapping (2 for each vert, represents the XY position on a texture image)
       * @param triangles Each Triangle Is A Set Of 3 Vert Indexes (order determines normal orientation)
       * @returns Number id of the newly created mesh node, or undefined if there is an error
       * 
       * `Single Triangle Example:` Bottom Left, Bottom Right, Top Left
       * 
       * `verts:` new Float32Array([
       * 
       * 0, 0, 0,
       * 
       * 1, 0, 0,
       * 
       * 0, 1, 0,
       * 
       * ])
       * 
       * `uvs:` new Float32Array([
       * 
       * 0, 0,
       * 
       * 1, 0,
       * 
       * 0, 1,
       * 
       * ])
       * 
       * `triangles:` new Int32Array([
       * 
       * 0, 1, 2
       * 
       * ])
       */
      mesh: (parentID: number, verts: Float32Array, uvs: Float32Array, triangles: Int32Array) => number | undefined;

      collider: {
        /**
         * Create a collider from a mesh node
         * @param parentID to attach as a child to
         * @param meshNodeID node to get mesh from
         * @param type used to select what type of collider the physics engine will use
         * @returns the id of the created node
         */
        fromMeshNode: (parentID: number, meshNodeID: number, type: ColliderTypes) => number | undefined;
        /**
         * Create a sphere collider
         * @param parentID to attach as a child to
         * @param radius distance from the center of the sphere to the edge of the sphere collider
         * @returns the id of the created node
         */
        sphere: (parentID: number, radius: number) => number | undefined;
        /**
         * Create a cylinder collider
         * @param parentID to attach as a child to
         * @param radius distance from the center to the edge of the cylinder collider
         * @param height distance from the top to the bottom of the cylinder collider
         * @returns the id of the created node
         */
        cylinder: (parentID: number, radius: number, height: number) => number | undefined;
        /**
         * Create a capsule collider
         * @param parentID to attach as a child to
         * @param radius distance from the center to the edge of the capsule collider
         * @param height distance from the top to the bottom of the capsule collider
         * @returns the id of the created node
         */
        capsule: (parentID: number, radius: number, height: number) => number | undefined;
        /**
         * Create a box collider
         * @param parentID to attach as a child to
         * @param x distance across the x axis
         * @param y distance across the y axis
         * @param z distance across the z axis
         * @returns the id of the created node
         */
        box: (parentID: number, x: number, y: number, z: number) => number | undefined;
      };

      /**
       * Creates a text node
       * @param parentID to host the text
       * @param text to be displayed
       * @param fontSize to be used, ie. 40
       * @param outlineSize to be used, (int, ie. 0, 1, 2+)
       * @returns the id of the created node
       */
      text: (parentID: number, text: string, fontSize: number, outlineSize: number) => number | undefined;
    };

    /**
     * Useful for changing a base node to a different animation node type.
     * Note that changing does create a new node, and moves children to the new node.
     * Therefore this should be done sparingly.
     * @param id of the node to change
     * @type to change the node to
     * @returns id of the new node if successful and undefined if there is an error
     */
    changeType: (id: number, type: BaseNodeTypes) => number | undefined;

    visible: {
      set: (id: number, isVisible: boolean) => boolean,
      get: (id: number) => boolean | undefined,
    };

    collidable: {
      set: (id: number, isCollidable: boolean) => boolean,
      get: (id: number) => boolean | undefined,
    };

    /**
    * List of available transform options
    */
    transform: {
      position: {
        /**
         * Sets the position of a node
         * @param id of the node to move
         * @param x of position
         * @param y of position
         * @param z of position
         * @returns boolean true if successful
         */
        set: (id: number, x: number, y: number, z: number) => boolean;

        /**
         * Gets the position of a node
         * @param id of the node
         * @returns undefined or a JSON Object with x, y, z values
         */
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },

      scale: {
        /**
         * Sets the scale of a node
         * @param id of the node to scale
         * @param x of scale
         * @param y of scale
         * @param z of scale
         * @returns boolean true if successful
         */
        set: (id: number, x: number, y: number, z: number) => boolean;

        /**
         * Gets the scale of a node
         * @param id of the node
         * @returns undefined or a JSON Object with x, y, z values
         */
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },

      rotation: {
        /**
         * Sets the rotation of a node
         * @param id of the node to rotate
         * @param x of the quaternion rotation
         * @param y of the quaternion rotation
         * @param z of the quaternion rotation
         * @param w of the quaternion rotation
         * @returns boolean true if successful
         */
        set: (id: number, x: number, y: number, z: number, w: number) => boolean;

        /**
         * Gets the quaternion rotation of a node
         * @param id of the node
         * @returns undefined or a JSON Object with x, y, z, w values
         */
        get: (id: number) => ({ x: number, y: number, z: number, w: number } | undefined);
      },

      forward: {
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: (id: number) => ({ x: number, y: number, z: number } | undefined);
      },
    }

    velocity: {
      /**
         * Sets the velocity of a Physics node
         * @param id of the node
         * @param x of velocity
         * @param y of velocity
         * @param z of velocity
         * @returns boolean true if successful
         */
      set: (id: number, x: number, y: number, z: number) => boolean;

      /**
       * Gets the velocity of a Physics node
       * @param id of the node
       * @returns undefined or a JSON Object with x, y, z values
       */
      get: (id: number) => ({ x: number, y: number, z: number } | undefined);
    }

    /**
     * Change the material properties of a mesh node
     */
    material: {
      /**
       * Adjust the color of the material
       */

      tintColor: {
        /**
         * Tint a material, any alpha lower than 1 will change the material to transparent
         * @param id of the node to affect
         * @param r of the color
         * @param g of the color
         * @param b of the color
         * @param a 1 is solid, anything less is transparent
         * @returns boolean true if successful
         */
        set: (id: number, r: number, g: number, b: number, a: number) => boolean;
        get: (id: number) => ({ r: number, g: number, b: number, a: number } | undefined);
      },

      /**
       * Change the emission color of a mesh node
       */
      emissionColor: {
        /**
         * Sets the emission color for a mesh, the color black disables emission
         * @param id of the mesh node
         * @param r of the color
         * @param g of the color
         * @param b of the color
         * @returns boolean true if successful
         */
        set: (id: number, r: number, g: number, b: number) => boolean;
        get: (id: number) => ({ r: number, g: number, b: number } | undefined);
      },

      /**
       * Change the emission strength of a mesh node
       */
      emissionStrength: {
        set: (id: number, value: number) => boolean;
        get: (id: number) => (number | undefined);
      },

      /**
       * The roughness of a mesh node, 0 none, 1 max
       */
      roughness: {
        set: (id: number, value: number) => boolean;
        get: (id: number) => (number | undefined);
      },

      /**
       * The metallic strength of a mesh node, 0 none, 1 max
       */
      metallic: {
        set: (id: number, value: number) => boolean;
        get: (id: number) => (number | undefined);
      },

      /**
       * Set the color of a pixel
       * @param id of the mesh node
       * @param mode to apply, where Linear blurs between pixels, and NearestNeighbor creates hard edges
       * @param useMipMaps set to true enables mipMaps
       * @returns boolean true if successful
       */
      setTextureDrawMode: (id: number, mode: 'Linear' | 'NearestNeighbor', useMipMaps: boolean) => boolean;
    }

    text: {
      display: {
        set: (id: number, text: string) => boolean,
        get: (id: number) => string | undefined,
      },

      fontSize: {
        set: (id: number, size: number) => boolean,
        get: (id: number) => number | undefined,
      },

      color: {
        set: (id: number, r: number, g: number, b: number) => boolean,
        get: (id: number) => { r: number, g: number, b: number } | undefined,
      },

      outline: {
        /**
         * Adjust the outline size of a text node
         * @param id of the text node
         * @param size of the outline (int values, ie. 0, 1, 2+)
         * @returns true if successful
         */
        set: (id: number, size: number) => boolean,
        get: (id: number) => number | undefined,
        color: {
          set: (id: number, r: number, g: number, b: number) => boolean,
          get: (id: number) => { r: number, g: number, b: number } | undefined,
        },
      },

      doubleSided: {
        set: (id: number, isDoubleSided: boolean) => boolean,
        get: (id: number) => boolean | undefined,
      },

      billboard: {
        set: (id: number, isEnabled: boolean) => boolean,
        get: (id: number) => boolean | undefined,
      },
    };

    /**
     * Destroys a given node and its children
     * @param id of the node to destroy
     * @returns boolean true if id was found and node was destroyed
     */
    destroy: (id: number) => boolean;
  }


  const skyDome: {
    ambientLight: {
      /**
       * Color of the ambient light in the world.
       */
      baseColor: {
        set: (r: number, g: number, b: number) => boolean;
        get: () => ({ r: number, g: number, b: number } | undefined);
      },
      /**
       * Increase or decrease the brightness of the scene. Defaults to 1.
       */
      energy: {
        set: (value: number) => boolean;
        get: () => (number | undefined);
      },
      /**
       * Allows the sky color to cast colored light on the scene (from above and below).
       * Values range from 0 (no contribution) to 1 (max contribution). Defaults to 0.
       */
      skyColorContribution: {
        set: (value: number) => boolean;
        get: () => (number | undefined);
      },
    };
    skyMaterial: {
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
      setProceduralSkyMaterial: (
        topColor: { r: number, g: number, b: number } | undefined,
        topHorizonColor: { r: number, g: number, b: number } | undefined,
        topCurve: number | undefined,
        bottomColor: { r: number, g: number, b: number } | undefined,
        bottomHorizonColor: { r: number, g: number, b: number } | undefined,
        bottomCurve: number | undefined,
      ) => boolean;
    };
  }

  const localPlayer: {
    position: {
      set: (x: number, y: number, z: number) => boolean;
      get: () => ({ x: number, y: number, z: number } | undefined);
    },
    rotation: {
      set: (x: number, y: number, z: number, w: number) => boolean;
      get: () => ({ x: number, y: number, z: number, w: number } | undefined);
    },
    forward: {
      get: () => ({ x: number, y: number, z: number } | undefined);
    },
    up: {
      get: () => ({ x: number, y: number, z: number } | undefined);
    },
    right: {
      get: () => ({ x: number, y: number, z: number } | undefined);
    },

    head: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
    body: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
    leftHand: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
    rightHand: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
    foot: {
      position: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      rotation: {
        get: () => ({ x: number, y: number, z: number, w: number } | undefined);
      },
      forward: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      up: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
      right: {
        get: () => ({ x: number, y: number, z: number } | undefined);
      },
    },
  }

  const keyboard: {
    /**
     * Shows the keyboard
     * @param defaultText to start from, you can also use an empty string 
     * @returns boolean true if successful
    */
    show: (defaultText: string) => boolean;

    /**
     * Hides the keyboard
     * @returns boolean true if successful
    */
    hide: () => boolean;

    // Need callback for when keyboard is closed

    clipboard: {
      set: (text: string) => boolean;
      get: () => (string | undefined);
    }
  }

  const networking: {
    socket: {
      /**
       * Create a new socket connection, can be used as a client or remote peer
       * @returns number id of the "WebSocketPeer"
       */
      create: () => number;

      /**
       * Closes a socket connection
       * @param id to close
       * @returns boolean true if successful
       */
      close: (id: number) => boolean;

      /**
       * Connect a socket to a url
       * @param id of the socket
       * @param url to connect to
       * @returns boolean true if the socket was found
       */
      connectToURL: (id: number, url: string) => boolean;

      /**
       * Updates connection state and receives incoming packets. Call regularly to keep it in a clean state.
       * @param id of the socket
       * @returns boolean true if the socket was found
       */
      poll: (id: number) => boolean;

      /**
       * Checks the socket to see if the ready state is open
       * @param id of the socket
       * @returns boolean true if the get ready state is open
       */
      isSocketOpen: (id: number) => boolean;

      /**
       * Sends a message
       * @param id of the socket
       * @param msg to send
       * @returns boolean true if the socket was found and open
       */
      sendText: (id: number, msg: string) => boolean;

      /**
       * Get available packets (once gotten, they are removed from the queue)
       * @param id of the socket
       * @returns string[] of available packets
       */
      getPackets: (id: number) => string[];
    },

    /**
     * WebRTCPeerConnection is not thread safe and needs to be run on the main thread (ie. no async)
     */
    rtcPeer: {
      create: () => number;

      close: (id: number) => boolean;

      poll: (id: number) => boolean;

      state: (id: number) => ('New' | 'Connecting' | 'Connected' | 'Disconnected' | 'Closed' | 'Failed') | undefined;

      getOffer: (id: number) => { type: string, sdp: string } | undefined;

      setRemoteDescription: (id: number, type: string, sdp: string) => boolean;

      // sendText: (id: number, msg: string) => boolean;

      // getPackets: (id: number) => string[];
    },
  }

  /**
   * Fire a raycast from a pos, towards a destination, returns undefined if error or nothing was hit.
   * If hitting a concave shape with a texture and getUVs is set to true, UV coordinates will be calculated.
   * 
   * Return values of -1 will be used if no available data for nodeID, uvX, and uvY
   */
  const raycast: (posX: number, posY: number, posZ: number, destX: number, destY: number, destZ: number, getUVsFromMeshNodeID: number) => { hitPosX: number, hitPosY: number, hitPosZ: number, normalX: number, normalY: number, normalZ: number, nodeID: number, uvX: number, uvY: number } | undefined;

  const shader: {
    applyToMesh: (meshNodeID: number, shaderCode: string) => boolean;
    removeFromMesh: (meshNodeID: number) => boolean;
    updateNumber: (meshNodeID: number, parameterName: string, value: number) => boolean;
    updateColor: (meshNodeID: number, parameterName: string, r: number, g: number, b: number) => boolean;
  }
}
