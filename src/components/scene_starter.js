
function visualizer () {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ alpha: true })

  renderer.setSize(window.innerWidth, window.innerHeight)
  document.querySelector('#WebGL-output').appendChild(renderer.domElement)

  camera.position.z = 10

  camera.lookAt(scene.position)

  window.addEventListener('resize', resize, false)

  function resize () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  return {
    update (audio) {
      renderer.render(scene, camera)
    }
  }
}

const scene = visualizer()

export default scene
