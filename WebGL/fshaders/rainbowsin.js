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
    st.y = st.y*4.-2.;
    float y = sin(PI*st.x+u_time) ;
    float pct = plot(st,y);
    float r = mix(0.1,1.,st.y);
    float g = mix(.1,.5, st.y);
    float b = mix(0.6,1., st.y);
    vec3 color = pct*vec3(r,g,b);

	gl_FragColor = vec4(color,1.0);
}
`
createCanvas(fragmentShaderSrc)