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

float rand(float x){
    return fract(sin(x)*100000.);
}

float rand2D(vec2 st){
    return fract(sin(dot(st.xy,
        vec2(12.9898,12.233)*u_mouse.y))*(43758.5453123+u_mouse.x));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

    float y = rand(st.x);
    y = rand2D(st);
    //float pct = plot(st,y);
    vec3 color = 1.-y*vec3(1.);

	gl_FragColor = vec4(color,1.0);
}
`
createCanvas(fragmentShaderSrc)