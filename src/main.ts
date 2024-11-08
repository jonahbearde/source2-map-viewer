import * as THREE from "three"
import { FlyControls } from "three/examples/jsm/Addons.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { read } from "./reader"

async function render(map: string) {
  await read(map, "0_KZT_NRM_NUB")

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
  camera.position.z = 12000

  camera.lookAt(0, 0, 0)

  const controls = new FlyControls(camera, renderer.domElement)

  controls.rollSpeed = 0.02
  controls.movementSpeed = 100
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
    `/maps/${map}/${map}.glb`,
    function (gltf) {
      const model = gltf.scene
      
      model.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2)
      model.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2)

      model.scale.set(40, 40, 40)
      scene.add(model)
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
    },
    function (error) {
      console.error(error)
    }
  )

  function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }

    return needResize
  }

  function render(time: number) {
    time *= 0.001

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    controls.update(1)

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

render('kz_ltt')
