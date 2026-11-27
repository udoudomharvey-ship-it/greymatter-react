export const VERT = /* glsl */ `
attribute vec2 aProf;
varying vec2 vUv;
varying vec3 vPos;
varying vec2 vProf;
void main(){
  vUv = uv;
  vProf = aProf;
  vPos = position;
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}
`

export const FRAG = /* glsl */ `
precision highp float;
uniform float uTime, uDark, uAmber, uTotal, uSP, uHh, uPulse, uCount;
uniform vec3 uBg, uBase, uMint, uAmb;
varying vec2 vUv;
varying vec3 vPos;
varying vec2 vProf;

float ln(float d, float w){ return 1.0 - smoothstep(0.0, w, d); }

void main(){
  float dcam = distance(vPos, cameraPosition);
  float w0 = clamp(0.006 + dcam * 0.0009, 0.006, 0.05);

  // a soft pool of gallery light on the wall that belongs to each section
  float stIdx = floor(vUv.x / uSP + 0.5);
  float valid = step(1.0, stIdx) * step(stIdx, uCount - 1.0);
  float side = mod(stIdx, 2.0) < 0.5 ? 1.0 : -1.0;
  float pc = side > 0.0 ? 0.0 : uTotal * 0.5;
  float dp = vUv.y - pc;
  dp -= uTotal * floor(dp / uTotal + 0.5);
  vec2 q = vec2(vUv.x - stIdx * uSP, dp) / 2.8;
  float pool = exp(-dot(q, q) * 0.9) * valid;

  // smooth curve into floor and ceiling
  float hy = vProf.y / uHh;
  float shade = 1.0 - 0.10 * smoothstep(0.35, 1.0, abs(hy));
  float fl = smoothstep(-0.5, -1.0, hy);

  vec3 acc = mix(uMint, uAmb, uAmber);
  float lamp = 1.0 / (1.0 + 0.012 * dcam * dcam);
  float fog = 1.0 - exp(-dcam * 0.03);

  vec3 base = uBase * shade * (1.0 - 0.07 * fl);
  base *= mix(0.95 + 0.05 * lamp + 0.05 * pool, 0.72 + 0.35 * lamp + 0.35 * pool, uDark);

  // the only accents: a ceiling light strip and two floor guide lines
  float strip = ln(abs(vProf.x), 0.04 + w0) * step(0.86, hy);
  float fln = ln(abs(abs(vProf.x) - 1.3), w0) * step(hy, -0.86);
  float L = max(strip, fln * 0.7);
  float pulse = 0.5 + 0.5 * sin(vUv.x * 0.22 - uTime * 1.4 * uPulse);

  vec3 col = mix(base, acc, L * mix(0.5, 0.9, uDark));
  col += acc * L * (0.3 + 0.5 * pulse) * lamp * uDark;
  col = mix(col, uBg, fog);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`
