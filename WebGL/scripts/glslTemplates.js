var plot = `float plot(vec2 st, float pct) {    
    return  smoothstep( pct-0.02, pct, st.x)-smoothstep( pct, pct+0.02, st.x);
    }`
    
var tile = `vec2 tile(vec2 _st, float tileCount){
      _st *= tileCount;
      return fract(_st);
    }`
    
var rotate = `vec2 rotate2D(vec2 _st, float _angle){
      _st -= 0.5;
      _st =  mat2(cos(_angle),-sin(_angle),
            sin(_angle),cos(_angle)) * _st;
      _st += 0.5;
      return _st;
    }`
    
var box = `float box(vec2 _st, vec2 _size, float _smoothEdges){
      _size = vec2(0.5)-_size*0.5;
      vec2 aa = vec2(_smoothEdges*0.5);
      vec2 uv = smoothstep(_size,_size+aa,_st);
      uv *= smoothstep(_size,_size+aa,vec2(1.0)-_st);
      return uv.x*uv.y;
    }`
    
var circle = `float circle(vec2 _st, float _thin, float _smoothEdges,float size){
        float circleCenter = distance(_st,vec2(0.5));
        float circleDot =  smoothstep(size,size+_smoothEdges,circleCenter);
        circleDot -= smoothstep(size+_thin,size+_smoothEdges, circleCenter);
        return circleDot;
    }`