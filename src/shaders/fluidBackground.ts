export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2  uMouse;
  uniform vec2  uResolution;
  // Ripples — vec4(originX, originY[0..1, y-up], startTime, strength[0|1]).
  // 6 slots in a ring buffer; inactive slots carry strength=0.
  uniform vec4  uRipples[6];
  varying vec2  vUv;
  varying float vElevation;
  varying float vRipple;

  // ── Ripple field — concentric damped wave, stone-in-lake ──
  // age     : seconds since click
  // front   : expanding ring radius in aspect-corrected uv
  // env     : gaussian envelope around the ring front (wider → multi-crest visible)
  // phase   : sin oscillation inside envelope, frequency tuned so ~3 rings sit in band
  // decay   : time decay + lifetime falloff
  float rippleField(vec2 uvPos, float aspect, float time){
    float total = 0.0;
    for(int i=0; i<6; i++){
      vec4 r = uRipples[i];
      if(r.w < 0.5) continue;
      float age = time - r.z;
      if(age < 0.0 || age > 3.6) continue;
      vec2 ro = vec2((r.x - 0.5) * aspect, r.y - 0.5);
      vec2 pr = vec2((uvPos.x - 0.5) * aspect, uvPos.y - 0.5);
      float d = length(pr - ro);
      float front = age * 0.40;
      float env = exp(-pow((d - front) / 0.22, 2.0));
      float phase = d * 42.0 - age * 11.0;
      float decay = exp(-age * 0.75) * (1.0 - smoothstep(2.6, 3.6, age));
      total += cos(phase) * env * decay;
    }
    return total;
  }

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod(i,289.0);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=1.0/7.0;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main(){
    vUv=uv;
    float scroll=uScrollProgress;
    float tBase=uTime*0.036;
    float tRipple=uTime*0.054;
    vec3 pos=position;
    float n1=snoise(vec3(pos.xy*0.5,tBase+scroll*0.45))*0.16;
    float n2=snoise(vec3(pos.xy*1.6,tRipple*1.25+scroll*0.28))*0.05;
    vec2 mouse=(uMouse-0.5)*2.0;
    float mouseDist=length(pos.xy-mouse);
    float mousePush=smoothstep(1.4,0.0,mouseDist)*0.10;

    float aspect=uResolution.x/max(uResolution.y,1.0);
    float rip=rippleField(uv,aspect,uTime);
    vRipple=rip;

    float elevation=n1+n2+mousePush;
    pos.z+=elevation;
    vElevation=elevation;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uScrollProgress;
  uniform vec2  uResolution;
  uniform vec4  uRipples[6];
  varying vec2  vUv;
  varying float vElevation;
  varying float vRipple;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod(i,289.0);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=1.0/7.0;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  float fbm(vec3 p){
    float val=0.0;
    float amp=0.5;
    float frq=1.0;
    mat2 rot=mat2(cos(1.618),sin(1.618),-sin(1.618),cos(1.618));
    for(int i=0;i<6;i++){
      val+=amp*snoise(p*frq);
      p.xy*=rot;
      p.yz*=rot;
      frq*=2.0;
      amp*=0.5;
    }
    return val;
  }

  void main(){
    float aspect=uResolution.x/uResolution.y;
    vec2 p=(vUv-0.5)*vec2(aspect,1.0);
    float scroll=uScrollProgress;

    float tSlow=uTime*0.032;
    float tRipple=uTime*0.048;

    vec2 scrollDrift=vec2(scroll*0.95,-scroll*0.62);
    vec2 ps=p+scrollDrift;

    float flowAngle=(uTime*0.011+scroll*0.35);
    mat2 rotFlow=mat2(cos(flowAngle),sin(flowAngle),-sin(flowAngle),cos(flowAngle));
    vec2 psr=rotFlow*ps;

    vec2 mouse=(uMouse-0.5)*vec2(aspect,1.0);
    float mouseProximity=1.0-smoothstep(0.0,0.32,length(p-mouse));

    float scScroll=scroll;
    vec2 q=vec2(
      fbm(vec3(psr*0.28,tSlow+scScroll*0.32)),
      fbm(vec3(psr*0.28+vec2(5.2,1.3),tSlow+scScroll*0.24))
    );
    vec2 r=vec2(
      fbm(vec3(psr*0.28+2.8*q+vec2(1.7,9.2),tSlow*0.7+scScroll*1.55)),
      fbm(vec3(psr*0.28+2.8*q+vec2(8.3,2.8),tRipple*0.88+scScroll*1.25))
    );
    float f=fbm(vec3(psr*0.28+2.0*r+vec2(mouseProximity*0.12),tRipple*0.42+scScroll*0.62));

    vec3 l0=vec3(0.032, 0.033, 0.037);
    vec3 l1=vec3(0.068, 0.070, 0.079);
    vec3 l2=vec3(0.112, 0.117, 0.134);
    vec3 l3=vec3(0.150, 0.159, 0.187);
    vec3 l4=vec3(0.185, 0.197, 0.232);

    vec3 col=l0;
    col=mix(col,l1,smoothstep(-0.45,0.55,f)*0.92);
    col=mix(col,l2,smoothstep(-0.1,0.72,f)*0.78);

    float crest=smoothstep(0.05,0.85,f)*smoothstep(0.10,0.75,length(q));
    float peak=smoothstep(0.40,0.95,f*length(r));

    float breatheCrest=0.94+0.06*sin(uTime*0.15);
    float breathePeak=0.96+0.04*sin(uTime*0.11+1.7);

    col=mix(col,l3,crest*0.55*breatheCrest);
    col=mix(col,l4,peak*0.35*breathePeak);

    col+=l2*smoothstep(0.04,0.18,vElevation)*0.30;
    col+=l3*smoothstep(0.10,0.22,vElevation)*0.15;
    float wake=mouseProximity*mouseProximity*mouseProximity;
    col+=l2*wake*0.35;
    col+=l3*wake*0.20;
    col+=l4*wake*0.08;

    // ── Ripple tint — crests carry cool silver moonlight, troughs deepen shadow.
    // Impact core adds soft dim glow at click point that fades fastest.
    // Sits atop existing shadow palette — dim, not washy. Luxury restraint.
    float crestRip=max(vRipple,0.0);
    float troughRip=max(-vRipple,0.0);
    vec3 moonTint=vec3(0.62,0.70,0.86);
    col+=moonTint*crestRip*0.32;
    col+=l4*crestRip*0.10;
    col-=l1*troughRip*0.14;

    // Soft inner glow at every active impact point.
    float coreGlow=0.0;
    for(int i=0;i<6;i++){
      vec4 rr=uRipples[i];
      if(rr.w<0.5) continue;
      float age=uTime-rr.z;
      if(age<0.0||age>3.6) continue;
      vec2 ro=vec2((rr.x-0.5)*aspect,rr.y-0.5);
      float d=length(p-ro);
      coreGlow+=exp(-pow(d/0.11,2.0))*exp(-age*1.8);
    }
    col+=moonTint*coreGlow*0.16;

    float vig=1.0-smoothstep(0.06,0.98,length(p*0.78));
    col*=pow(vig,1.24);
    col*=0.74+0.19*(f*0.6+0.4*length(q));
    float lum=dot(col,vec3(0.2126,0.7152,0.0722));
    col=mix(vec3(lum),col,0.90);
    col=max(col,vec3(0.0));

    gl_FragColor=vec4(col,1.0);
  }
`;
