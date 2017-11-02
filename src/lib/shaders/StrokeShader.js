THREE.StrokeShader = {
  uniforms: {
    tDiffuse: {
      type: 't',
      value: null
    },
    h: {
      type: 'f',
      value: 1 / 512
    },
    cells: {
      type: 'v2v',
      value: []
    }
  },
  vertexShader: ['varying vec2 vUv;', 'void main() {', 'vUv = uv;', 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', '}'].join('\n'),
  fragmentShader: ['uniform sampler2D tDiffuse;', 'uniform float h;', 'uniform vec2 cells[8];', 'const float PI = 3.14159265358979323846264;', 'varying vec2 vUv;', 'void main() {', 'vec4 color = vec4( 0.0 );', 'gl_FragColor = color;', 'for (int i = 0; i < 8; i++) {', 'vec2 pos = cells[i] * h;', 'vec4 texel = texture2D(tDiffuse, vUv + pos);', 'if (texel.g > 0.0) {', 'gl_FragColor = vec4(0.0236, 0.58, 0.467, 1.0);', 'break;', '}', '}', '}'].join('\n')
}
