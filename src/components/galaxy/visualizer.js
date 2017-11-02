import backgroundVert from 'shaders/galaxy/background.vert'
import backgroundFrag from 'shaders/galaxy/background.frag'
import 'lib/postprocessing/EffectComposer.js'
import 'lib/postprocessing/RenderPass.js'
import 'lib/postprocessing/MaskPass.js'
import 'lib/postprocessing/ShaderPass.js'
import 'lib/shaders/CopyShader.js'
import 'lib/shaders/HorizontalBlurShader.js'
import 'lib/shaders/VerticalBlurShader.js'
import 'lib/shaders/DotMatrixShader.js'
import 'lib/shaders/AdditiveBlendShader.js'
import dat from 'dat-gui'
import planet from './planet'

function visualizer () {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ alpha: true })
  let time = 0 
  let BackgroundUnfiroms = {
    resolution: {
      type: 'v2',
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    }
  }
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.querySelector('#WebGL-output').appendChild(renderer.domElement)
  renderer.setClearColor(0x000042)
  camera.position.z = 0

  camera.lookAt(scene.position)
  scene.add(camera)
  planet.mesh.position.z = -15
  planet.ring.position.z = -15
  planet.ring.position.y = 0
  console.log(planet.mesh.position)
  scene.add(planet.mesh)
  scene.add(planet.ring)
  var starsGeometry = new THREE.Geometry()
  starsGeometry.colorsNeedUpdate = true
  console.log(starsGeometry)
  const colors = []
  const colorsData = [
    new THREE.Color(0x2800e7),
    new THREE.Color(0xffe8dd),
    new THREE.Color(0xaa00ff)
  ]
  for (var i = 0; i < 10000; i++) {
    var star = new THREE.Vector3()
    star.x = THREE.Math.randFloatSpread(1000)
    star.y = THREE.Math.randFloatSpread(1000)
    star.z = THREE.Math.randFloat(-100, -500) 
    starsGeometry.vertices.push(star)
    let randomColor = Math.floor(Math.random() * 3)
    // console.log(randomColor)
    colors[i] = colorsData[randomColor].clone()
  }

  var starsMaterial = new THREE.PointsMaterial({vertexColors: THREE.VertexColors, size: 1 })

  var starField = new THREE.Points(starsGeometry, starsMaterial)
  starField.geometry.colorsNeedUpdate = true
  starField.geometry.colors = colors
  // starField.position.z = -100
  console.log(starField)
  
  scene.add(starField)
  console.log(scene)
  addBackground()
  // LIGHTS //
  scene.add( new THREE.AmbientLight( 0xFFFFFF ) );
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set( 1, 1, 1 ).normalize();
  scene.add( directionalLight );
  var pointLight = new THREE.PointLight( 0xffffff, 2, 10 );
  pointLight.position.set(0, -250, 0)
  scene.add( pointLight );

  // POST PROCESSING
  var composer;

  let dotMatrixPass, dotMatrixParams;
  let hblurPass;
  let vblurPass;
  let blendPass;

  let screenW = window.innerWidth
  let screenH = window.innerHeight;
  //common render target params
  var renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false };
        
  //Init dotsComposer to render the dots effect
  //A composer is a stack of shader passes combined
        
  //a render target is an offscreen buffer to save a composer output
  const renderTargetDots = new THREE.WebGLRenderTarget( screenW, screenH, renderTargetParameters );
  //dots Composer renders the dot effect
  const dotsComposer = new THREE.EffectComposer( renderer,renderTargetDots );
        
  var renderPass = new THREE.RenderPass( scene, camera );
  //a shader pass applies a shader effect to a texture (usually the previous shader output)
  dotMatrixPass = new THREE.ShaderPass( THREE.DotMatrixShader );
  dotsComposer.addPass( renderPass );
  dotsComposer.addPass( dotMatrixPass );
        
        
  //Init glowComposer renders a blurred version of the scene
  const renderTargetGlow = new THREE.WebGLRenderTarget( screenW, screenH, renderTargetParameters );
  const glowComposer = new THREE.EffectComposer( renderer, renderTargetGlow );
        
  //create shader passes
  hblurPass = new THREE.ShaderPass( THREE.HorizontalBlurShader );
  vblurPass = new THREE.ShaderPass( THREE.VerticalBlurShader );
        
  glowComposer.addPass( renderPass );
  glowComposer.addPass( dotMatrixPass );
  glowComposer.addPass( hblurPass );
  glowComposer.addPass( vblurPass );
  //glowComposer.addPass( fxaaPass );
        
  //blend Composer runs the AdditiveBlendShader to combine the output of dotsComposer and glowComposer
  blendPass = new THREE.ShaderPass( THREE.AdditiveBlendShader );
  blendPass.uniforms[ 'tBase' ].value = dotsComposer.renderTarget1.texture;
  blendPass.uniforms[ 'tAdd' ].value = glowComposer.renderTarget1.texture;
  const blendComposer = new THREE.EffectComposer( renderer );
  blendComposer.addPass( blendPass );
  blendPass.renderToScreen = true;
  dotMatrixPass.uniforms[ "resolution" ].value = new THREE.Vector2(window.innerWidth,window.innerHeight);
  
  //////////////
  //Init DAT GUI control panel
  dotMatrixParams = {
    spacing: 2,
    size: 2.0,
    blur: 3.0
  }

  const glowParams = {
    amount: 0.2,
    blur: 1.9
  }

  // var gui = new dat.GUI();
  // dat.GUI.toggleHide();
  
  // var f1 = gui.addFolder('Dot Matrix');
  // f1.add(dotMatrixParams, 'spacing', 0, 50).step(1).onChange(onParamsChange);
  // f1.add(dotMatrixParams, 'size', 0, 10).step(0.1).onChange(onParamsChange);
  // f1.add(dotMatrixParams, 'blur', 0, 10).step(0.1).onChange(onParamsChange);

  // var f2 = gui.addFolder('Glow');
  // f2.add(glowParams, 'amount', 0, 10).step(0.1).onChange(onParamsChange);
  // f2.add(glowParams, 'blur', 0, 10).step(0.1).onChange(onParamsChange);

  function onParamsChange() {
    //copy gui params into shader uniforms
    dotMatrixPass.uniforms[ 'spacing' ].value = dotMatrixParams.spacing;
    dotMatrixPass.uniforms[ 'size' ].value = Math.pow(dotMatrixParams.size,2);
    dotMatrixPass.uniforms[ 'blur' ].value = Math.pow(dotMatrixParams.blur*2,2);

    hblurPass.uniforms[ 'h' ].value = glowParams.blur / screenW*2;
    vblurPass.uniforms[ 'v' ].value = glowParams.blur  / screenH*2;
    blendPass.uniforms[ 'amount' ].value = glowParams.amount;

  }
  onParamsChange()
  function addBackground () {

    const geometry = new THREE.PlaneGeometry(window.innerWidth * 2, window.innerHeight * 2, 1, 1)
    const material = new THREE.ShaderMaterial({
      uniforms: BackgroundUnfiroms,
      vertexShader: backgroundVert,
      fragmentShader: backgroundFrag

    })
    var backgroundMesh = new THREE.Mesh(geometry, material)
    backgroundMesh.name = 'background'
    backgroundMesh.position.set(0, 0, -1000)

    camera.add(backgroundMesh)
    // backgroundScene.add(backgroundCamera)
    // backgroundScene.add(backgroundMesh)
  }
  window.addEventListener('resize', resize, false)
  function resize () {
    screenW = window.innerWidth
    screenH = window.innerHeight
    
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  return {
    update (audio) {
      time++
      planet.render(time, audio)
      // renderer.render(scene, camera)
      dotsComposer.render(  );
      glowComposer.render(  );
      blendComposer.render(  );
    }
  }
}

const scene = visualizer()

export default scene
