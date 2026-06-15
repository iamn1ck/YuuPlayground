import { Quaternion } from "./Basic Types/Quaternion";
import { Vector3 } from "./Basic Types/Vector3";


export const Player = {
    position: {
        set: (pos: Vector3): boolean => { return Godot.localPlayer.position.set(pos.x, pos.y, pos.z); },
        get: (): Vector3 | undefined => { const pos = Godot.localPlayer.position.get(); if (pos) { return new Vector3(pos.x, pos.y, pos.z); } else { return undefined; } },
    },
    rotation: {
        set: (rot: Quaternion): boolean => { return Godot.localPlayer.rotation.set(rot.x, rot.y, rot.z, rot.w); },
        get: (): Quaternion | undefined => { const rot = Godot.localPlayer.rotation.get(); if (rot) { return new Quaternion(rot.x, rot.y, rot.z, rot.w); } else { return undefined; } },
    },
    forward: {
        get: (): Vector3 | undefined => { const forward = Godot.localPlayer.forward.get(); if (forward) { return new Vector3(forward.x, forward.y, forward.z); } else { return undefined; } },
    },
    up: {
        get: (): Vector3 | undefined => { const up = Godot.localPlayer.up.get(); if (up) { return new Vector3(up.x, up.y, up.z); } else { return undefined; } },
    },
    right: {
        get: (): Vector3 | undefined => { const right = Godot.localPlayer.right.get(); if (right) { return new Vector3(right.x, right.y, right.z); } else { return undefined; } },
    },
    head: {
        position: {
            get: (): Vector3 | undefined => { const pos = Godot.localPlayer.head.position.get(); if (pos) { return new Vector3(pos.x, pos.y, pos.z); } else { return undefined; } },
        },
        rotation: {
            get: (): Quaternion | undefined => { const rot = Godot.localPlayer.head.rotation.get(); if (rot) { return new Quaternion(rot.x, rot.y, rot.z, rot.w); } else { return undefined; } },
        },
        forward: {
            get: (): Vector3 | undefined => { const forward = Godot.localPlayer.head.forward.get(); if (forward) { return new Vector3(forward.x, forward.y, forward.z); } else { return undefined; } },
        },
        up: {
            get: (): Vector3 | undefined => { const up = Godot.localPlayer.head.up.get(); if (up) { return new Vector3(up.x, up.y, up.z); } else { return undefined; } },
        },
        right: {
            get: (): Vector3 | undefined => { const right = Godot.localPlayer.head.right.get(); if (right) { return new Vector3(right.x, right.y, right.z); } else { return undefined; } },
        },
    },
    body: {
        position: {
            get: (): Vector3 | undefined => { const pos = Godot.localPlayer.body.position.get(); if (pos) { return new Vector3(pos.x, pos.y, pos.z); } else { return undefined; } },
        },
        rotation: {
            get: (): Quaternion | undefined => { const rot = Godot.localPlayer.body.rotation.get(); if (rot) { return new Quaternion(rot.x, rot.y, rot.z, rot.w); } else { return undefined; } },
        },
        forward: {
            get: (): Vector3 | undefined => { const forward = Godot.localPlayer.body.forward.get(); if (forward) { return new Vector3(forward.x, forward.y, forward.z); } else { return undefined; } },
        },
        up: {
            get: (): Vector3 | undefined => { const up = Godot.localPlayer.body.up.get(); if (up) { return new Vector3(up.x, up.y, up.z); } else { return undefined; } },
        },
        right: {
            get: (): Vector3 | undefined => { const right = Godot.localPlayer.body.right.get(); if (right) { return new Vector3(right.x, right.y, right.z); } else { return undefined; } },
        },
    },
    leftHand: {
        position: {
            get: (): Vector3 | undefined => { const pos = Godot.localPlayer.leftHand.position.get(); if (pos) { return new Vector3(pos.x, pos.y, pos.z); } else { return undefined; } },
        },
        rotation: {
            get: (): Quaternion | undefined => { const rot = Godot.localPlayer.leftHand.rotation.get(); if (rot) { return new Quaternion(rot.x, rot.y, rot.z, rot.w); } else { return undefined; } },
        },
        forward: {
            get: (): Vector3 | undefined => { const forward = Godot.localPlayer.leftHand.forward.get(); if (forward) { return new Vector3(forward.x, forward.y, forward.z); } else { return undefined; } },
        },
        up: {
            get: (): Vector3 | undefined => { const up = Godot.localPlayer.leftHand.up.get(); if (up) { return new Vector3(up.x, up.y, up.z); } else { return undefined; } },
        },
        right: {
            get: (): Vector3 | undefined => { const right = Godot.localPlayer.leftHand.right.get(); if (right) { return new Vector3(right.x, right.y, right.z); } else { return undefined; } },
        },
    },
    rightHand: {
        position: {
            get: (): Vector3 | undefined => { const pos = Godot.localPlayer.rightHand.position.get(); if (pos) { return new Vector3(pos.x, pos.y, pos.z); } else { return undefined; } },
        },
        rotation: {
            get: (): Quaternion | undefined => { const rot = Godot.localPlayer.rightHand.rotation.get(); if (rot) { return new Quaternion(rot.x, rot.y, rot.z, rot.w); } else { return undefined; } },
        },
        forward: {
            get: (): Vector3 | undefined => { const forward = Godot.localPlayer.rightHand.forward.get(); if (forward) { return new Vector3(forward.x, forward.y, forward.z); } else { return undefined; } },
        },
        up: {
            get: (): Vector3 | undefined => { const up = Godot.localPlayer.rightHand.up.get(); if (up) { return new Vector3(up.x, up.y, up.z); } else { return undefined; } },
        },
        right: {
            get: (): Vector3 | undefined => { const right = Godot.localPlayer.rightHand.right.get(); if (right) { return new Vector3(right.x, right.y, right.z); } else { return undefined; } },
        },
    },
    foot: {
        position: {
            get: (): Vector3 | undefined => { const pos = Godot.localPlayer.foot.position.get(); if (pos) { return new Vector3(pos.x, pos.y, pos.z); } else { return undefined; } },
        },
        rotation: {
            get: (): Quaternion | undefined => { const rot = Godot.localPlayer.foot.rotation.get(); if (rot) { return new Quaternion(rot.x, rot.y, rot.z, rot.w); } else { return undefined; } },
        },
        forward: {
            get: (): Vector3 | undefined => { const forward = Godot.localPlayer.foot.forward.get(); if (forward) { return new Vector3(forward.x, forward.y, forward.z); } else { return undefined; } },
        },
        up: {
            get: (): Vector3 | undefined => { const up = Godot.localPlayer.foot.up.get(); if (up) { return new Vector3(up.x, up.y, up.z); } else { return undefined; } },
        },
        right: {
            get: (): Vector3 | undefined => { const right = Godot.localPlayer.foot.right.get(); if (right) { return new Vector3(right.x, right.y, right.z); } else { return undefined; } },
        },
    },
}