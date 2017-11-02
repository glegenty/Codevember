import planetFrag from 'shaders/galaxy/planet.frag'
import planetVert from 'shaders/galaxy/planet.vert'
import dat from 'dat-gui'
export default (function () {

  // const uniforms = {
  //   u_time: { type: 'f', value: 0.2 },
  //   scale: { type: 'f', value: 0.2 },
  //   mouse: { type: 'v2', value: new THREE.Vector2() },
  //   u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  //   uDirLightPos:	{ type: 'v3', value: new THREE.Vector3() },
  //   uDirLightColor: { type: 'c', value: new THREE.Color( 0xffffff ) },
  //   uMaterialColor:  { type: 'c', value: new THREE.Color( 0xffffff ) },
  //   uKd: {
  //     type: 'f',
  //     value: 0.7
  //   },
  //   uBorder: {
  //     type: 'f',
  //     value: 0.4
  //   }
  // }

  const uniforms = {
    uTime: {
      type: 'f',
      value: 0.0
    }
  }
  const sphereGeo = new THREE.SphereGeometry(4, 20, 20)

  const nbPart = 256
  const radius = {
    min: 6,
    max: 7 
  }
  
  const ringGeo = [
    new THREE.BoxGeometry( 1, 1, 1 ),
    new THREE.SphereGeometry( 1, 32, 32 ),
    new THREE.IcosahedronGeometry( 1, 0),
    
    
  ]
  const ringBase = {
    specular: 0x333333,
    shininess: 0
  }
  const ringMat = [
    new THREE.MeshToonMaterial( Object.assign({color: 0xff4a9c }, ringBase) ),
    new THREE.MeshToonMaterial( Object.assign({color: 0x62aaae}, ringBase) ),
    new THREE.MeshToonMaterial( Object.assign({color: 0x5400d7}, ringBase) )
    
  ];
  const ring = new THREE.Object3D()
  const pivot = new THREE.Group()
  const cubesRad = []
  for (let i = 0; i < nbPart; i++) {
    let randomGeo = Math.floor(Math.random() * 3)
    let randomMat = Math.floor(Math.random() * 3)
    
    let cube = new THREE.Mesh( ringGeo[randomGeo], ringMat[randomMat] );
    var angle = Math.random()*Math.PI*2;
    let randomRadius = Math.random()*(radius.max-radius.min+1)+radius.min
    cubesRad.push(randomRadius)
    cube.position.x = Math.cos(angle)*randomRadius;
    cube.position.z = Math.sin(angle)*randomRadius;
    cube.position.y = Math.random()*(0.2-(-0.2)+0.2)+(-0.2)
    let randomScale = Math.random()*(0.12-0.1 + 0.1)+0.1
    
    cube.scale.set(randomScale, randomScale, randomScale) 
    ring.add( cube );
  }
  pivot.rotation.z = Math.PI / 4
  pivot.rotation.y = Math.PI / 6
  
  
  pivot.add(ring)
  ring.position.set(0,0,0)
  console.log(ring)
  const planetMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: planetVert,
    fragmentShader: planetFrag,
    transparent: true
    // side: THREE.DoubleSide,
    // shading: THREE.FlatShading
  })
  // const gui = new dat.GUI()  
  const toonOpts = {
    color: 0x0087d6,
    specular: 0x333333,
    shininess: 2,
    bumpScale: 0
  }
  // gui.add(toonOpts, 'color')
  // gui.add(toonOpts, 'specular')
  // gui.add(toonOpts, 'shininess')
  // gui.add(toonOpts, 'bumpScale')
  
  const material = new THREE.MeshToonMaterial(toonOpts)
  const sphere = new THREE.Mesh(sphereGeo, material)
  return {
    mesh : sphere,
    ring: pivot,
    render (time, audio) {
      let i = 0
      planetMat.uniforms[ 'uTime' ].value = .001 * time;
      // ring.children.forEach((element) => {
      //   let freq = audio[i] / 255 + 1
      //   // element.scale.set([1, 1, 1])
      // })
      // ring.children.forEach((object) => {
      //   // let angle = Math.PI / 6 * time /1000
        
      //   let radius = cubesRad[i]
      //   object.position.x = Math.cos(time / 100)*radius;
      //   object.position.z = Math.sin(time / 100)*radius;
      //   i++
      // })
      ring.rotation.y += 0.005
      
      sphere.rotation.y -= 0.009
    }
  }

})()

