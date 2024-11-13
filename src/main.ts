import * as THREE from "three"
import { FlyControls } from "three/examples/jsm/Addons.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { read, fetchReplay } from "./reader"
import type { ReplayData } from "./types"
import { transformVector } from "./calc"

async function renderMap(map: string) {
  const buffer = await fetchReplay(map, "0_KZT_NRM_NUB")

  if (!buffer) return

  const replayData = read(buffer) as ReplayData

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(renderer.domElement)

  const fov = 75
  const aspect = window.innerWidth / window.innerHeight // the canvas default
  const near = 0.1
  const far = 100000
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 10000

  camera.lookAt(0, 0, 0)

  const controls = new FlyControls(camera, renderer.domElement)

  controls.rollSpeed = 0.005
  controls.movementSpeed = 50
  controls.dragToLook = true

  const scene = new THREE.Scene()

  {
    const color = 0xffffff
    const intensity = 5
    const light = new THREE.DirectionalLight(color, intensity)

    light.target.position.set(0, 0, 0)
    scene.add(light)
    scene.add(light.target)
  }

  {
    const color = 0xffffff
    const intensity = 0.5
    const light = new THREE.AmbientLight(color, intensity)
    scene.add(light)
  }

  const loader = new GLTFLoader()

  loader.load(
    `${import.meta.env.VITE_RESOURCE_BASE_URL}/maps/${map}/${map}.glb`,
    function (gltf) {
      const model = gltf.scene

      model.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2)
      model.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2)

      const scale = 1 / 0.0254

      model.scale.set(scale, scale, scale)
      scene.add(model)
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
    },
    function (error) {
      console.error(error)
    }
  )

  let currentTick = 0
  const tickCount = replayData.tickDataArray.length

  function render() {
    controls.update(1)

    if (currentTick < tickCount) {
      const { position, angles } = replayData.tickDataArray[currentTick]

      camera.position.set(position.x, position.y, position.z)

      const yaw = angles.y * (Math.PI / 180)
      const pitch = angles.x * (Math.PI / 180)

      const lookAt = [0, 0, 0]

      lookAt[0] = Math.cos(yaw) * Math.cos(pitch)
      lookAt[1] = -Math.sin(yaw) * Math.cos(yaw)
      lookAt[2] = -Math.sin(pitch)

      const realLookAt = [lookAt[0] + position.x, lookAt[1] + position.y, lookAt[2] + position.z]

      // console.log(position, lookAt, realLookAt)

      camera.lookAt(realLookAt[0], realLookAt[1], realLookAt[2])

      currentTick++
    }

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

renderMap("test")
