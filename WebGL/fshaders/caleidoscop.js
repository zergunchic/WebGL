var fragmentShaderSrc = 
`
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

void tiles( inout vec2 st, float tileAmount){
    st*=tileAmount;
    st.y-=2.;
    st=fract(st);
}

void rotate( inout vec2 st, float angle){
  st.x *= cos(radians(angle));
  st.y *= sin(radians(angle));
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    
    tiles(st, 4.);
    
    float index = floor(st.y);
    
    if((index - 2.*floor(index/2.))==0.){
        rotate(st, 45.);
    };

  float y = sin(PI*st.x+u_time) ;
  float pct = plot(st,y*.5+.3);
  float r = mix(0.1,1.,st.y);
  float g = mix(.1,.5, st.y);
  float b = mix(0.6,1., st.y);
  vec3 color = pct*vec3(r,g,b);

	gl_FragColor = vec4(color,1.0);
}
`
createCanvas(fragmentShaderSrc)