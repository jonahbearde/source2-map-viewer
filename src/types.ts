export enum Mode {
  Vanilla = 0,
  KzSimple,
  KzTimer,
}

export enum Style {
  Normal = 0,
}

export enum ReplayType {
  Run,
  Cheater,
  Jump,
}

export enum Button {
  None = 0,
  Attack = 1 << 0,
  Jump = 1 << 1,
  Duck = 1 << 2,
  Forward = 1 << 3,
  Back = 1 << 4,
  Use = 1 << 5,
  Cancel = 1 << 6,
  Left = 1 << 7,
  Right = 1 << 8,
  MoveLeft = 1 << 9,
  MoveRight = 1 << 10,
  Attack2 = 1 << 11,
  Run = 1 << 12,
  Reload = 1 << 13,
  Alt1 = 1 << 14,
  Alt2 = 1 << 15,
  Score = 1 << 16,
  Speed = 1 << 17,
  Walk = 1 << 18,
  Zoom = 1 << 19,
  Weapon1 = 1 << 20,
  Weapon2 = 1 << 21,
  BullRush = 1 << 22, // ...what?
  Grenade1 = 1 << 23,
  Grenade2 = 1 << 24,
}

export enum EntityFlag {
  None = 0,
  OnGround = 1 << 0,
  Ducking = 1 << 1,
  WaterJump = 1 << 2,
  OnTrain = 1 << 3,
  InRain = 1 << 4,
  Frozen = 1 << 5,
  AtControls = 1 << 6,
  Client = 1 << 7,
  FakeClient = 1 << 8,
  InWater = 1 << 9,
  Fly = 1 << 10,
  Swim = 1 << 11,
  Conveyor = 1 << 12,
  Npc = 1 << 13,
  GodMode = 1 << 14,
  NoTarget = 1 << 15,
  AimTarget = 1 << 16,
  PartialGround = 1 << 17,
  StaticProp = 1 << 18,
  Graphed = 1 << 19,
  Grenade = 1 << 20,
  StepMovement = 1 << 21,
  DontTouch = 1 << 22,
  BaseVelocity = 1 << 23,
  WorldBrush = 1 << 24,
  Object = 1 << 25,
  KillMe = 1 << 26,
  OnFire = 1 << 27,
  Dissolving = 1 << 28,
  TransRagdoll = 1 << 29,
  UnblockableByPlayer = 1 << 30,
  Freezing = 1 << 31,
}

export enum ReplayV2Flag {
  MovetypeMask = 0xf,
  Attack = 1 << 4,
  Attack2 = 1 << 5,
  Jump = 1 << 6,
  Duck = 1 << 7,
  Forward = 1 << 8,
  Back = 1 << 9,
  Left = 1 << 10,
  Right = 1 << 11,
  Moveleft = 1 << 12,
  Moveright = 1 << 13,
  Reload = 1 << 14,
  Speed = 1 << 15,
  Use = 1 << 16,
  Bullrush = 1 << 17,
  Onground = 1 << 18,
  Ducking = 1 << 19,
  Swim = 1 << 20,
  UnderWater = 1 << 21,
  TeleportTick = 1 << 22,
  TakeoffTick = 1 << 23,
  HitPerf = 1 << 24,
  SecondaryEquipped = 1 << 25,
}

export enum ButtonOffset {
  Attack = 0,
  Jump = 1,
  Duck = 2,
  Forward = 3,
  Back = 4,
  Use = 5,
  Cancel = 6,
  Left = 7,
  Right = 8,
  Moveleft = 9,
  Moveright = 10,
  Attack2 = 11,
  Run = 12,
  Reload = 13,
  Alt1 = 14,
  Alt2 = 15,
  Score = 16,
  Speed = 17,
  Walk = 18,
  Zoom = 19,
  Weapon1 = 20,
  Weapon2 = 21,
  Bullrush = 22,
  Grenade1 = 23,
  Grenade2 = 24,
  Attack3 = 25,
}

interface TickData {
  tick: number
  position: { x: number; y: number; z: number }
  angles: { x: number; y: number }
  buttons: Button
  flags: EntityFlag
}

export interface ReplayData {
  formatVersion: number
  replayType: ReplayType
  pluginVersion: string
  map: string
  mapFileSize: number
  serverIp: number
  timeStamp: number
  playerName: string
  steamId: number
  mode: Mode
  style: Style
  sensitivity: number
  mYaw: number
  tickRate: number
  tickCount: number
  weapon: number
  knife: number
  time: number
  course: number
  teleports: number
  tickDataArray: TickData[]
}
