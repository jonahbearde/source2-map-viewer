// ai generated...
function rotationMatrixZ(theta: number): number[][] {
  return [
    [Math.cos(theta), -Math.sin(theta), 0],
    [Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 1],
  ]
}

function crossProduct(v1: number[], v2: number[]): number[] {
  return [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]]
}

function normalize(v: number[]): number[] {
  const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
  return [v[0] / length, v[1] / length, v[2] / length]
}

function rotationMatrixAxis(axis: number[], angle: number): number[][] {
  const [x, y, z] = axis
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const oneMinusCos = 1 - cos

  return [
    [cos + x * x * oneMinusCos, x * y * oneMinusCos - z * sin, x * z * oneMinusCos + y * sin],
    [y * x * oneMinusCos + z * sin, cos + y * y * oneMinusCos, y * z * oneMinusCos - x * sin],
    [z * x * oneMinusCos - y * sin, z * y * oneMinusCos + x * sin, cos + z * z * oneMinusCos],
  ]
}

function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const result: number[][] = []
  for (let i = 0; i < a.length; i++) {
    result[i] = []
    for (let j = 0; j < b[0].length; j++) {
      result[i][j] = 0
      for (let k = 0; k < a[0].length; k++) {
        result[i][j] += a[i][k] * b[k][j]
      }
    }
  }
  return result
}

function applyTransformation(matrix: number[][], vector: number[]): number[] {
  const result: number[] = []
  for (let i = 0; i < matrix.length; i++) {
    result[i] = 0
    for (let j = 0; j < matrix[i].length; j++) {
      result[i] += matrix[i][j] * vector[j]
    }
  }
  return result
}

export function transformVector(yaw: number, pitch: number, vector: number[]): number[] {
  let Rz: number[][] = rotationMatrixZ(yaw)
  let yawedVector: number[] = applyTransformation(Rz, vector)

  let zAxis: number[] = [0, 0, 1]
  let pitchAxis: number[] = crossProduct(yawedVector, zAxis)
  pitchAxis = normalize(pitchAxis)

  let Rpitch: number[][] = rotationMatrixAxis(pitchAxis, pitch)
  let Rfinal: number[][] = multiplyMatrices(Rpitch, Rz)

  return applyTransformation(Rfinal, vector)
}
