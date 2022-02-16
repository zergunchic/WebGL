var fragmentShaderSrc = `

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.009, pct, st.y) -
          smoothstep( pct, pct+0.009, st.y);
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

  float y = 1.0 - pow(abs(sin(PI*st.x)), 0.+u_time*0.05 ) ;
  float pct = plot(st,y);
  vec3 color = 1.-pct*vec3(0.1,0.622,0.3);

	gl_FragColor = vec4(color,1.0);
}
`
createCanvas(fragmentShaderSrc)