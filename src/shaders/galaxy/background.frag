varying vec2 vUv;

// uniform float time;
// uniform vec2 mouse;
// uniform vec2 resolution;

vec4    u_color1 = vec4(5./255., 0, 46./255., 1.0);
vec4    u_color2 = vec4(35./255., 3./255., 131./255., 1.0);

float   radius = 2.;
vec4 convertColor (vec4 color) {

	return vec4((color.rgb /255.), 1.0);
}

void main(void)
{
  //   vec2 vUv = (gl_FragCoord.xy / resolution.xy) -0.5;
	// vUv.x *= resolution.x / resolution.y;
    
    vec2 uv = vec2(vUv.x - 0.5, vUv.y - 0.4);
    uv.y += 0.5;


    gl_FragColor = mix(u_color2,u_color1,uv.y);
}