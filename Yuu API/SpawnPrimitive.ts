import { Color } from "./Basic Types/Color";
import { Quaternion } from "./Basic Types/Quaternion";
import { Vector2 } from "./Basic Types/Vector2";
import { Vector3 } from "./Basic Types/Vector3";
import { Entity } from "./Entity";
import { getDoor } from "./doorModel";
import { getNissanGtr32Exp } from "./nissan";
import { getYuuchamber2 } from "./yuuchamber2Model";


export const spawnPrimitive = {
  cube,
  plane,
  sphere,
  cone,
  cubeScaled,
  door,
  chamber,
  nissanGtr32Exp
}

/**
 * Create A Cube Entity
 * @param pos to be created at
 * @param scale to start at
 * @param rot to start at
 * @param color to tint
 * @param alphaTransparency 0 is invisible, 1 is solid
 * @param hasCollider if true creates a collider
 * @param type for animation and physics
 * @returns Entity created
 */
function cube(pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alphaTransparency: number, hasCollider: boolean, type: BaseNodeTypes, parent: Entity | undefined): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);

  entity.mesh.create(...getShadeSmoothStretchedUVCube());

  entity.mesh.color.set(color, Math.min(1, alphaTransparency));

  if (hasCollider && entity.mesh.nodeID) {
    entity.collider.createBox(Vector3.one);
  }

  entity.scale = scale;

  return entity;
}

function cubeScaled(pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alphaTransparency: number, hasCollider: boolean, type: BaseNodeTypes, parent: Entity | undefined): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);

  entity.mesh.create(...getShadeSmoothStretchedUVCube());

  entity.mesh.color.set(color, Math.min(1, alphaTransparency));

  if (hasCollider && entity.mesh.nodeID) {
    entity.collider.createBox(Vector3.one); // Note: Keep this at Vector3.one since the entity scale handles the collider size too
  }

  // Keep your original entity scaling intact!
  entity.scale = scale;

  return entity;
}



/**
 * Create A Plane Entity
 * @param drawSide to choose which side(s) of the plane to create, ie. 'Front', 'Back', or 'Both'
 * @param pos to be created at
 * @param scale to start at
 * @param rot to start at
 * @param color to tint
 * @param alphaTransparency 0 is invisible, 1 is solid
 * @param hasCollider if true creates a collider
 * @param type for animation and physics
 * @returns Entity created
 */
function plane(drawSide: 'Front' | 'Back' | 'Both', pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alphaTransparency: number, colliderType: 'None' | 'Convex' | 'Concave', type: BaseNodeTypes, parent: Entity | undefined): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);

  entity.mesh.create(...getShadeSmoothPlane(drawSide));
  entity.mesh.color.set(color, Math.min(1, alphaTransparency));

  if (colliderType !== 'None' && entity.mesh.nodeID) {
    // Swap with plane collider in the future
    // Is plane collider one sided ?? Mesh collider is double sided !!
    entity.collider.createFromMeshNode(entity.mesh.nodeID, colliderType);
  }

  entity.scale = scale;

  return entity;
}



/**
 * Create A Sphere Entity
 * @param columns number of segments around the horizontal, minimum of 3
 * @param rows number of segments along the vertical, minimum of 2, 
 * @param pos to be created at
 * @param scale to start at
 * @param rot to start at
 * @param color to tint
 * @param alphaTransparency 0 is invisible, 1 is solid
 * @param hasCollider if true creates a collider
 * @param type for animation and physics
 * @returns Entity created
 */
function sphere(columns: number, rows: number, pos: Vector3, diameter: number, rot: Quaternion, color: Color, alphaTransparency: number, colliderType: 'None' | 'Sphere' | 'Convex' | 'Concave', type: BaseNodeTypes, parent: Entity | undefined): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);

  addSphereToEntity(entity, columns, rows, diameter, color, alphaTransparency, colliderType);

  return entity;
}

function addSphereToEntity(entity: Entity, columns: number, rows: number, diameter: number, color: Color, alphaTransparency: number, colliderType: 'None' | 'Sphere' | 'Convex' | 'Concave') {
  entity.mesh.create(...getSphere(columns, rows));
  entity.mesh.color.set(color, Math.min(1, alphaTransparency));

  if (entity.mesh.nodeID && colliderType !== 'None') {
    if (colliderType === 'Sphere') {
      entity.collider.createSphere(0.5);
    }
    else if (colliderType === 'Convex') {
      entity.collider.createFromMeshNode(entity.mesh.nodeID, 'Convex');
    }
    else if (colliderType === 'Concave') {
      entity.collider.createFromMeshNode(entity.mesh.nodeID, 'Concave');
    }
  }

  entity.scale = new Vector3(diameter, diameter, diameter);
}

/**
 * Create A Cone Entity
 * @param columns number of segments around, minimum of 3
 * @param pos to be created at
 * @param scale to start at
 * @param rot to start at
 * @param color to tint
 * @param alphaTransparency 0 is invisible, 1 is solid
 * @param hasCollider if true creates a collider
 * @param type for animation and physics
 * @returns Entity created
 */
function cone(columns: number, pos: Vector3, diameter: number, rot: Quaternion, color: Color, alphaTransparency: number, colliderType: 'None' | 'Cylinder' | 'Convex', type: BaseNodeTypes, parent: Entity | undefined): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);

  addConeToEntity(entity, columns, diameter, color, alphaTransparency, colliderType);

  return entity;
}

function addConeToEntity(entity: Entity, columns: number, diameter: number, color: Color, alphaTransparency: number, colliderType: 'None' | 'Cylinder' | 'Convex') {
  entity.mesh.create(...getCone(columns));
  entity.mesh.color.set(color, Math.min(1, alphaTransparency));

  if (entity.mesh.nodeID && colliderType !== 'None') {
    if (colliderType === 'Cylinder') {
      entity.collider.createCylinder(0.5, 0.5);
    }
    else if (colliderType === 'Convex') {
      entity.collider.createFromMeshNode(entity.mesh.nodeID, 'Convex');
    }
  }

  entity.scale = new Vector3(diameter, diameter, diameter);
}


// UTILS

function getQuadTriangles(nw: number, ne: number, se: number, sw: number) {
  return [nw, ne, sw, sw, ne, se];
  // return [ne, nw, sw, sw, se, ne]; //Alternate winding (Unity is counter clockwise, Godot is clockwise)
}


const lowerValue = 0.001;
const upperValue = 0.999;

// BASIC SHAPES

let stretchedUVCube: [Vector3[], Vector2[], number[]] | undefined;

function getShadeSmoothStretchedUVCube(): [Vector3[], Vector2[], number[]] {
  if (stretchedUVCube === undefined) {
    const verts: Vector3[] = [
      new Vector3(0.5, 0.5, -0.5), //Top Forward Left
      new Vector3(0.5, 0.5, 0.5), //Top Forward Right
      new Vector3(-0.5, 0.5, -0.5), //Top Back Left
      new Vector3(-0.5, 0.5, 0.5), //Top Back Right

      new Vector3(0.5, -0.5, -0.5), //Bottom Forward Left
      new Vector3(0.5, -0.5, 0.5), //Bottom Forward Right
      new Vector3(-0.5, -0.5, -0.5), //Bottom Back Left
      new Vector3(-0.5, -0.5, 0.5), //Bottom Back Right

      new Vector3(-0.5, 0.5, -0.5), //Top Back Left
      new Vector3(-0.5, 0.5, 0.5), //Top Back Right
      new Vector3(-0.5, -0.5, -0.5), //Bottom Back Left
      new Vector3(-0.5, -0.5, 0.5), //Bottom Back Right

      new Vector3(-0.5, 0.5, 0.5), //Top Back Right
      new Vector3(0.5, 0.5, 0.5), //Top Forward Right
      new Vector3(-0.5, -0.5, 0.5), //Bottom Back Right
      new Vector3(0.5, -0.5, 0.5), //Bottom Forward Right

      new Vector3(0.5, 0.5, -0.5), //Top Forward Left
      new Vector3(-0.5, 0.5, -0.5), //Top Back Left
      new Vector3(0.5, -0.5, -0.5), //Bottom Forward Left
      new Vector3(-0.5, -0.5, -0.5), //Bottom Back Left

      new Vector3(0.5, 0.5, 0.5), //Top Forward Right
      new Vector3(0.5, 0.5, -0.5), //Top Forward Left
      new Vector3(0.5, -0.5, 0.5), //Bottom Forward Right
      new Vector3(0.5, -0.5, -0.5), //Bottom Forward Left
    ];

    const uvs: Vector2[] = [
      new Vector2(0.5, 1 - 0.125),
      new Vector2(0.75, 1 - 0.125),
      new Vector2(0.5, 1 - 0.375),
      new Vector2(0.75, 1 - 0.375),

      new Vector2(0.5, 1 - 0.875),
      new Vector2(0.75, 1 - 0.875),
      new Vector2(0.5, 1 - 0.625),
      new Vector2(0.75, 1 - 0.625),

      new Vector2(0.5, 1 - 0.375),
      new Vector2(0.75, 1 - 0.375),
      new Vector2(0.5, 1 - 0.625),
      new Vector2(0.75, 1 - 0.625),

      new Vector2(0.75, 1 - 0.375),
      new Vector2(upperValue, 1 - 0.375),
      new Vector2(0.75, 1 - 0.625),
      new Vector2(upperValue, 1 - 0.625),

      new Vector2(0.25, 1 - 0.375),
      new Vector2(0.5, 1 - 0.375),
      new Vector2(0.25, 1 - 0.625),
      new Vector2(0.5, 1 - 0.625),

      new Vector2(lowerValue, 1 - 0.375),
      new Vector2(0.25, 1 - 0.375),
      new Vector2(lowerValue, 1 - 0.625),
      new Vector2(0.25, 1 - 0.625),
    ];

    const triangles: number[] = [
      ...getQuadTriangles(0, 1, 3, 2), //Top
      ...getQuadTriangles(6, 7, 5, 4), //Bottom
      ...getQuadTriangles(8, 9, 11, 10), //Back
      ...getQuadTriangles(12, 13, 15, 14), //Right
      ...getQuadTriangles(16, 17, 19, 18), //Left
      ...getQuadTriangles(20, 21, 23, 22), //Front
    ];

    stretchedUVCube = [verts, uvs, triangles];
  }

  return stretchedUVCube;
}

function getShadeSmoothPlane(drawSide: 'Front' | 'Back' | 'Both'): [Vector3[], Vector2[], number[]] {
  const verts: Vector3[] = [
    new Vector3(-0.5, 0.5, 0), //Top Left
    new Vector3(0.5, 0.5, 0), //Top Right
    new Vector3(0.5, -0.5, 0), //Bottom Right
    new Vector3(-0.5, -0.5, 0), //Bottom Left
  ];

  const uvs: Vector2[] = [
    new Vector2(0, 1), //Top Left
    new Vector2(1, 1), //Top Right
    new Vector2(1, 0), //Bottom Right
    new Vector2(0, 0), //Bottom Left
  ];

  const triangles: number[] = [];

  if (drawSide === 'Front' || drawSide === 'Both') {
    triangles.push(...getQuadTriangles(0, 1, 2, 3));
  }
  if (drawSide === 'Back' || drawSide === 'Both') {
    triangles.push(...getQuadTriangles(1, 0, 3, 2));
  }

  return [verts, uvs, triangles];
}


const sphereMap = new Map<string, [Vector3[], Vector2[], number[]]>();

function getSphere(columns: number, rows: number): [Vector3[], Vector2[], number[]] {
  const c = Math.max(3, columns);
  const r = Math.max(2, rows);

  const preGeneratedSphere = sphereMap.get(c.toString() + r.toString());

  if (preGeneratedSphere) {
    return preGeneratedSphere;
  }
  else {
    const columnPointLocationsInRadians: number[] = [];

    const circumference = Math.PI * 2;

    for (let i = 0; i <= c; i++) {
      columnPointLocationsInRadians.push((i / c) * circumference);
    }

    const radiusAndYForEachRow: { radius: number, y: number }[] = [];

    for (let i = 0; i <= r; i++) {
      const rowPointInRadiansAlongVerticalHalfCircle = (i / r) * Math.PI;

      const radiusAtRow = Math.sin(rowPointInRadiansAlongVerticalHalfCircle) / 2;
      const yAtRow = Math.cos(rowPointInRadiansAlongVerticalHalfCircle) / 2;

      radiusAndYForEachRow.push({ radius: radiusAtRow, y: yAtRow });
    }

    const eachRowsVertexIndexes: number[][] = [];

    const verts: Vector3[] = [];
    const uvs: Vector2[] = [];

    radiusAndYForEachRow.forEach((payload, indexR) => {
      if (payload.radius === 0) {
        const vertY = (indexR === 0) ? 0.5 : -0.5;
        const uvY = (indexR === 0) ? upperValue : lowerValue;

        const rowIndexes: number[] = [];

        columnPointLocationsInRadians.forEach((amount, indexC) => {
          if (indexC < c) {
            rowIndexes.push(verts.length);
            verts.push(new Vector3(0, vertY, 0));

            uvs.push(new Vector2((indexC + 0.5) / c, uvY));
          }
        });

        eachRowsVertexIndexes.push(rowIndexes);
      }
      else {
        const rowIndexes: number[] = [];
        const uvY = 1 - (indexR / r);

        columnPointLocationsInRadians.forEach((amount, indexC) => {
          const x = Math.sin(amount);
          const z = Math.cos(amount);

          const pos = new Vector3(x, 0, z).multiply(payload.radius);

          pos.y = payload.y;

          rowIndexes.push(verts.length);
          verts.push(pos);
          uvs.push(new Vector2((indexC / c), uvY));
        });

        eachRowsVertexIndexes.push(rowIndexes);
      }
    });

    const triangles: number[] = [];

    eachRowsVertexIndexes.forEach((rowVertexIndexes, indexR) => {
      if (indexR !== 0) {
        if (indexR === 1) {
          rowVertexIndexes.forEach((start, indexC) => {
            if (indexC < c) {
              const top = eachRowsVertexIndexes[0][indexC];
              const right = rowVertexIndexes[indexC + 1]

              triangles.push(start, top, right);
            }
          });
        }
        else if (indexR !== eachRowsVertexIndexes.length - 1) {
          {
            rowVertexIndexes.forEach((sw, indexC) => {
              if (indexC < c) {
                const nw = eachRowsVertexIndexes[indexR - 1][indexC];
                const ne = eachRowsVertexIndexes[indexR - 1][indexC + 1]
                const se = rowVertexIndexes[indexC + 1]

                triangles.push(...getQuadTriangles(nw, ne, se, sw));
              }
            });
          }
        }
        else {
          rowVertexIndexes.forEach((bottom, indexC) => {
            if (indexC < c) {
              const left = eachRowsVertexIndexes[indexR - 1][indexC];
              const right = eachRowsVertexIndexes[indexR - 1][indexC + 1]
  
              triangles.push(bottom, left, right);
            }
          });
        }
      }
    });

    sphereMap.set(c.toString() + r.toString(), [verts, uvs, triangles]);

    return [verts, uvs, triangles];
  }
}


const coneMap = new Map<number, [Vector3[], Vector2[], number[]]>();

// While this can make a 3 and 4 point pyramid, they might not work perfectly for snapping
function getCone(columns: number): [Vector3[], Vector2[], number[]] {
  const c = Math.max(3, columns);

  const preGeneratedCone = coneMap.get(c);

  if (preGeneratedCone) {
    return preGeneratedCone;
  }
  else {
    const columnPointLocationsInRadians: number[] = [];

    const circumference = Math.PI * 2;

    for (let i = 0; i <= c; i++) {
      columnPointLocationsInRadians.push((i / c) * circumference);
    }

    const radiusAndYForEachRow: { radius: number, y: number }[] = [
      { radius: 0, y: 0.5, },
      { radius: 0.5, y: -0.5, },
      { radius: 0, y: -0.5, },
    ];

    const eachRowsVertexIndexes: number[][] = [];

    const verts: Vector3[] = [];
    const uvs: Vector2[] = [];

    radiusAndYForEachRow.forEach((payload, indexR) => {
      if (payload.radius === 0) {
        const vertY = (indexR === 0) ? 0.5 : -0.5;
        const uvY = (indexR === 0) ? upperValue : lowerValue;

        const rowIndexes: number[] = [];

        columnPointLocationsInRadians.forEach((amount, indexC) => {
          if (indexC < c) {
            rowIndexes.push(verts.length);
            verts.push(new Vector3(0, vertY, 0));

            uvs.push(new Vector2((indexC + 0.5) / c, uvY));
          }
        });

        eachRowsVertexIndexes.push(rowIndexes);
      }
      else {
        const rowIndexes: number[] = [];
        const uvY = 0.5;

        columnPointLocationsInRadians.forEach((amount, indexC) => {
          const x = Math.sin(amount);
          const z = Math.cos(amount);

          const pos = new Vector3(x, 0, z).multiply(payload.radius);

          pos.y = payload.y;

          rowIndexes.push(verts.length);
          verts.push(pos);
          uvs.push(new Vector2(indexC / c, uvY));
        });

        eachRowsVertexIndexes.push(rowIndexes);
      }
    });

    const triangles: number[] = [];

    eachRowsVertexIndexes.forEach((rowVertexIndexes, indexR) => {
      if (indexR !== 0) {
        if (indexR === 1) {
          rowVertexIndexes.forEach((start, indexC) => {
            if (indexC < c) {
              const top = eachRowsVertexIndexes[0][indexC];
              const right = rowVertexIndexes[indexC + 1]

              triangles.push(start, top, right);
            }
          });
        }
        else {
          rowVertexIndexes.forEach((bottom, indexC) => {
            const left = eachRowsVertexIndexes[indexR - 1][indexC];
            const right = eachRowsVertexIndexes[indexR - 1][indexC + 1]

            triangles.push(bottom, left, right);
          });
        }
      }
    });

    coneMap.set(c, [verts, uvs, triangles]);

    return [verts, uvs, triangles];
  }
}



/**
 * Create A door
 
 */
function door(pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alphaTransparency: number, hasCollider: boolean, type: BaseNodeTypes, parent: Entity | undefined): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);

  entity.mesh.create(...getDoor());

  entity.mesh.color.set(color, Math.min(1, alphaTransparency));
  entity.scale = scale;

  if (hasCollider && entity.mesh.nodeID) {
    entity.collider.createFromMeshNode(entity.mesh.nodeID, 'Concave');
  }


  return entity;
}


/**
 * Create A door
 
 */
function chamber(pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alphaTransparency: number, hasCollider: boolean, type: BaseNodeTypes, parent: Entity | undefined): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);

  entity.mesh.create(...getYuuchamber2());

  entity.mesh.color.set(color, Math.min(1, alphaTransparency));

  if (hasCollider && entity.mesh.nodeID) {
    entity.collider.createFromMeshNode(entity.mesh.nodeID, 'Convex');
  }

  entity.scale = scale;

  return entity;
}


/**
 * Create A Nissan Gtr R32 Exp Entity
 
 */
function nissanGtr32Exp(pos: Vector3, scale: Vector3, rot: Quaternion, color: Color, alphaTransparency: number, colliderType: 'None' | 'Convex' | 'Concave', type: BaseNodeTypes, parent: Entity | undefined): Entity {
  const entity = new Entity(pos, rot, Vector3.one, parent, type);

  entity.mesh.create(...getNissanGtr32Exp());

  entity.mesh.color.set(color, Math.min(1, alphaTransparency));

  if (colliderType !== 'None' && entity.mesh.nodeID) {
    entity.collider.createFromMeshNode(entity.mesh.nodeID, colliderType);
  }

  entity.scale = scale;

  return entity;
}