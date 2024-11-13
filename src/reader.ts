import { ReplayData, ReplayType, Mode, Style, ButtonOffset, ReplayV2Flag } from "./types"

const MAGIC = 0x676f6b7a

class ReplayReader {
  private view: DataView
  private offset: number

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer)
    this.offset = 0
  }

  readInt8() {
    const value = this.view.getInt8(this.offset)
    this.offset += 1
    return value
  }

  readInt16() {
    const value = this.view.getInt16(this.offset, true)
    this.offset += 2
    return value
  }

  readInt32() {
    const value = this.view.getInt32(this.offset, true)
    this.offset += 4
    return value
  }

  readFloat32() {
    const value = this.view.getFloat32(this.offset, true)
    this.offset += 4
    return value
  }

  readUint8() {
    const value = this.view.getUint8(this.offset)
    this.offset += 1
    return value
  }

  readString(length?: number) {
    if (length === undefined) {
      length = this.readUint8()
    }

    let chars: number[] = []
    for (let i = 0; i < length; ++i) {
      chars.push(this.readUint8())
    }

    return utf8ArrayToStr(chars)
  }
}

export function read(buffer: ArrayBuffer) {
  try {
    if (buffer) {
      const reader = new ReplayReader(buffer)

      const magic = reader.readInt32()

      if (magic !== MAGIC) {
        throw new Error("Invalid replay file")
      }

      const replayData = {} as ReplayData

      replayData.formatVersion = reader.readInt8()
      replayData.replayType = reader.readUint8() as ReplayType
      replayData.pluginVersion = reader.readString()
      replayData.map = reader.readString()
      replayData.mapFileSize = reader.readInt32()
      replayData.serverIp = reader.readInt32()
      replayData.timeStamp = reader.readInt32()
      replayData.playerName = reader.readString()
      replayData.steamId = reader.readInt32()
      replayData.mode = reader.readUint8() as Mode
      replayData.style = reader.readUint8() as Style
      replayData.sensitivity = reader.readInt32()
      replayData.mYaw = reader.readInt32()
      replayData.tickRate = reader.readFloat32()
      replayData.tickCount = reader.readInt32()
      replayData.weapon = reader.readInt32()
      replayData.knife = reader.readInt32()

      replayData.time = reader.readFloat32()
      replayData.course = reader.readUint8()
      replayData.teleports = reader.readInt32()
      replayData.tickDataArray = []

      let array = new Array<number>(20)
      for (let tick = 0; tick < replayData.tickCount; tick++) {
        let deltaFlags = reader.readInt32()
        // NOTE(GameChaos): read delta-compressed tickdata.
        for (let i = 1; i < 20; i++) {
          let currentFlag = 1 << i
          if (deltaFlags & currentFlag) {
            if (i == 0 || i == 1 || i == 5 || i == 6 || i == 16 || i == 19) {
              array[i] = reader.readInt32()
            } else {
              array[i] = reader.readFloat32()
            }
          }
        }

        let tickData = createTickData()

        tickData.tick = tick
        tickData.position.x = array[7]
        tickData.position.y = array[8]
        tickData.position.z = array[9]

        tickData.angles.x = array[10]
        tickData.angles.y = array[11]
        let flags = array[16]

        tickData.buttons = 0
        tickData.buttons |= ((flags & ReplayV2Flag.Attack) != 0 ? 1 : 0) << ButtonOffset.Attack
        tickData.buttons |= ((flags & ReplayV2Flag.Attack2) != 0 ? 1 : 0) << ButtonOffset.Attack2
        tickData.buttons |= ((flags & ReplayV2Flag.Jump) != 0 ? 1 : 0) << ButtonOffset.Jump
        tickData.buttons |= ((flags & ReplayV2Flag.Duck) != 0 ? 1 : 0) << ButtonOffset.Duck
        tickData.buttons |= ((flags & ReplayV2Flag.Forward) != 0 ? 1 : 0) << ButtonOffset.Forward
        tickData.buttons |= ((flags & ReplayV2Flag.Back) != 0 ? 1 : 0) << ButtonOffset.Back
        tickData.buttons |= ((flags & ReplayV2Flag.Left) != 0 ? 1 : 0) << ButtonOffset.Left
        tickData.buttons |= ((flags & ReplayV2Flag.Right) != 0 ? 1 : 0) << ButtonOffset.Right
        tickData.buttons |= ((flags & ReplayV2Flag.Moveleft) != 0 ? 1 : 0) << ButtonOffset.Moveleft
        tickData.buttons |= ((flags & ReplayV2Flag.Moveright) != 0 ? 1 : 0) << ButtonOffset.Moveright
        tickData.buttons |= ((flags & ReplayV2Flag.Reload) != 0 ? 1 : 0) << ButtonOffset.Reload
        tickData.buttons |= ((flags & ReplayV2Flag.Speed) != 0 ? 1 : 0) << ButtonOffset.Speed
        tickData.buttons |= ((flags & ReplayV2Flag.Use) != 0 ? 1 : 0) << ButtonOffset.Use
        tickData.buttons |= ((flags & ReplayV2Flag.Bullrush) != 0 ? 1 : 0) << ButtonOffset.Bullrush

        tickData.flags = 0
        tickData.flags |= ((flags & ReplayV2Flag.Onground) != 0 ? 1 : 0) << 0
        tickData.flags |= ((flags & ReplayV2Flag.Ducking) != 0 ? 1 : 0) << 1
        tickData.flags |= ((flags & ReplayV2Flag.Swim) != 0 ? 1 : 0) << 11

        replayData.tickDataArray.push(tickData)
      }
      console.log(replayData.tickDataArray)
      return replayData
    }
  } catch (error) {
    console.log(error)
  }
}

export async function fetchReplay(map: string, replayName: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_RESOURCE_BASE_URL}/replays/${map}/${replayName}.replay`)

    const buffer = await response.arrayBuffer()

    return buffer
  } catch (error) {
    console.log(error)
  }
}

function createTickData() {
  return {
    tick: 0,
    position: { x: 0, y: 0, z: 0 },
    angles: { x: 0, y: 0 },
    buttons: 0,
    flags: 0,
  }
}

// http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

function utf8ArrayToStr(array: number[]): string {
  var out, i, len, c
  var char2, char3

  out = ""
  len = array.length
  i = 0
  while (i < len) {
    c = array[i++]
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c)
        break
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++]
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f))
        break
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++]
        char3 = array[i++]
        out += String.fromCharCode(((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0))
        break
    }
  }

  return out
}
