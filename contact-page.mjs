import{t as e}from"./rolldown-runtime.B6Nc_XXV.mjs";import{F as t,M as n,T as r,_ as i,c as a,j as o,k as ee,l as s,s as c,u as l,y as te}from"./react.yheFOSLC.mjs";import{C as u,a as d,r as f,t as p}from"./motion.BwYVu1Yh.mjs";import{B as m,C as h,D as g,J as _,M as v,O as y,P as ne,T as b,_t as x,at as S,c as re,ct as ie,dt as ae,gt as oe,j as C,l as w,lt as T,n as E,o as D,r as O,s as k,st as se,t as ce,ut as A,yt as j}from"./framer.D7idUeKj.mjs";import{n as M,r as le}from"./umAUAhsNQ.CFHEzTha.mjs";var N,P=e((()=>{_(),N=v({title:`Wave Gradient`,fragment:`
#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
    float s = u_seed;
    vec2 k1 = vec2(2127.1 + s * 13.37, 81.17 + s * 7.31);
    vec2 k2 = vec2(1269.5 + s * 11.13, 283.37 + s * 5.79);
    p = vec2(dot(p, k1), dot(p, k2));
    return fract(sin(p) * (43758.5453 + s * 1.618));
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(
        mix(dot(-1.0 + 2.0 * hash(i), f),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
    return 0.5 + 0.5 * n;
}

vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

float seedF(float base) {
    return base * (1.0 + 0.5 * sin(u_seed * 3.17 + base));
}

vec2 warpUV(vec2 uv) {
    float t = u_time * u_waveSpeed;

    float angleOffset = sin(u_seed * 2.73) * 30.0;
    mat2 dirRot = Rot(radians(u_waveAngle + angleOffset));
    vec2 ruv = dirRot * uv;

    float fxMod = seedF(u_waveFreqX);
    float fyMod = seedF(u_waveFreqY);

    float phaseX = fract(sin(u_seed * 7.19) * 437.58) * 6.2832;
    float phaseY = fract(cos(u_seed * 3.41) * 291.37) * 6.2832;

    // Core wave with seed-dependent harmonics
    float harmonic = sin(u_seed * 1.23) * 0.5;
    float a = fyMod * ruv.y - sin(ruv.x * fxMod + ruv.y - t + phaseX);
    a += harmonic * sin(ruv.x * fxMod * 2.0 + ruv.y * 0.5 + t * 0.7 + phaseY);

    // Smoothstep mask (unchanged)
    a = smoothstep(
        cos(a) * u_maskSoftness,
        sin(a) * u_maskSoftness + 3.,
        cos(a - fyMod * ruv.y) - sin(a - fxMod * ruv.x)
    );

    a *= u_waveAmplitude;

    uv = cos(a) * uv + sin(a) * vec2(-uv.y, uv.x);
    return uv;
}

void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 uv = fragCoord / u_resolution.xy;
    float ratio = u_resolution.x / u_resolution.y;
    float t = u_time * u_waveSpeed;

    vec2 tuv = uv - 0.5;

    vec2 seedShift = vec2(sin(u_seed * 4.37), cos(u_seed * 5.91)) * 100.0;
    float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) + seedShift);
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));
    tuv.y *= ratio;

    // Seed-rotate uv2 before warping
    vec2 uv2 = (fragCoord * 2.0 - u_resolution.xy) / (u_resolution.x + u_resolution.y) * 2.0;
    float preRotAngle = fract(sin(u_seed * 5.63) * 173.29) * 6.2832;
    uv2 *= Rot(preRotAngle);
    vec2 warped = warpUV(uv2) * 0.5 + 0.5;

    vec2 blendUV = mix(tuv, warped - 0.5, u_blendAmount);

    float layerRot1 = -5.0 + sin(u_seed * 1.83) * 20.0;
    float layerRot2 = 10.0 + cos(u_seed * 2.47) * 20.0;

    vec3 c0 = getColor(0);
    vec3 c1 = getColor(1);
    vec3 c2 = getColor(2);
    vec3 c3 = getColor(3);

    vec3 layer1 = mix(c0, c2, S(-0.3, 0.3, (blendUV * Rot(radians(layerRot1))).x));
    vec3 layer2 = mix(c3, c1, S(-0.3, 0.3, (blendUV * Rot(radians(layerRot2))).x));
    vec3 col = mix(layer1, layer2, S(0.3, -0.3, blendUV.y));

    col = mix(col, col * col + 0.5 * sqrt(col), 0.3);

    fragColor = vec4(col, 1.0);
}
`,propertyControls:{colors:{type:O.Array,title:`Colors`,control:{type:O.Color},maxCount:4,defaultValue:[`#FF3624`,`#9EABFF`,`#FFAE00`,`#E29EFF`]},seed:{type:O.Number,title:`Seed`,defaultValue:32,min:0,max:100,step:1},waveSpeed:{type:O.Number,title:`Speed`,defaultValue:1.5,min:0,max:3,step:.01},waveFreqX:{type:O.Number,title:`Freq X`,defaultValue:.9,min:.1,max:6,step:.1},waveFreqY:{type:O.Number,title:`Freq Y`,defaultValue:6,min:.1,max:6,step:.1},waveAngle:{type:O.Number,title:`Angle`,defaultValue:105,min:-180,max:180,step:1},waveAmplitude:{type:O.Number,title:`Amplitude`,defaultValue:2.1,min:.5,max:3,step:.01},maskSoftness:{type:O.Number,title:`Softness`,defaultValue:.74,min:.01,max:2,step:.01},blendAmount:{type:O.Number,title:`Blend`,defaultValue:.54,min:0,max:1,step:.01}}})})),F,ue=e((()=>{_(),F=v({title:`Liquid Gradient`,resolutionScale:`consistent`,fragment:`
// === CONSTANTS ===
const float GOLDEN_ANGLE = 2.3999632;
const float TAU = 6.28318530;

// === PCG hash - https://www.jcgt.org/published/0009/03/02/
uvec3 hash3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}

// Seed
vec3 seedRandom(float seedVal) {
    uvec3 s = uvec3(
        floatBitsToUint(seedVal),
        floatBitsToUint(seedVal * 1.5 + 7.31),
        floatBitsToUint(seedVal * 2.7 + 13.37)
    );
    s = hash3(s);
    return vec3(s) / float(0xFFFFFFFFu);
}

// === COLOR SPACE UTILITIES ===
vec3 toLinear(vec3 c) {
    return pow(c, vec3(2.2));
}

vec3 toSrgb(vec3 c) {
    return pow(clamp(c, 0.0, 1.0), vec3(0.4545));
}

vec3 linearToOklab(vec3 c) {
    float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
    float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
    float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
    
    l = pow(max(l, 0.0), 1.0/3.0);
    m = pow(max(m, 0.0), 1.0/3.0);
    s = pow(max(s, 0.0), 1.0/3.0);
    
    return vec3(
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    );
}

vec3 oklabToLinear(vec3 c) {
    float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
    float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
    float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
    
    l = l * l * l;
    m = m * m * m;
    s = s * s * s;
    
    return vec3(
        +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
}

vec3 oklabToLch(vec3 lab) {
    return vec3(lab.x, length(lab.yz), atan(lab.z, lab.y));
}

vec3 lchToOklab(vec3 lch) {
    return vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
}

vec3 mixLch(vec3 lab0, vec3 lab1, float t) {
    vec3 lch0 = oklabToLch(lab0);
    vec3 lch1 = oklabToLch(lab1);
    
    if (lch0.y < 0.05) lch0.z = lch1.z;
    if (lch1.y < 0.05) lch1.z = lch0.z;
    
    float dh = lch1.z - lch0.z;
    if (dh > 3.14159265) dh -= 6.28318530;
    if (dh < -3.14159265) dh += 6.28318530;
    
    return lchToOklab(vec3(
        mix(lch0.x, lch1.x, t),
        mix(lch0.y, lch1.y, t),
        lch0.z + dh * t
    ));
}

// === PALETTE SAMPLING ===
vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

vec3 paletteN(float t, int count) {
    if (count < 1) return vec3(0.0);
    if (count < 2) return toLinear(getColor(0));
    
    float segmentSize = 1.0 / float(count - 1);
    t = clamp(t, 0.0, 1.0);
    int idx = min(int(floor(t / segmentSize)), count - 2);
    float localT = clamp((t - float(idx) * segmentSize) / segmentSize, 0.0, 1.0);
    
    vec3 lab0 = linearToOklab(toLinear(getColor(idx)));
    vec3 lab1 = linearToOklab(toLinear(getColor(idx + 1)));
    
    return oklabToLinear(mixLch(lab0, lab1, localT));
}

// === DITHER ===
float IGN(vec2 uv) {
    return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
}

float quickNoise(vec2 I) {
    return fract(sin(dot(I, vec2(12.9898, 78.233))) * 43758.5453);
}

// Dither Mode: 0=Off, 1=IGN, 2=quickNoise
float getDither(vec2 I, float mode) {
    if (mode < 0.5) return 0.5;          // 0: Off
    if (mode < 1.5) return IGN(I);       // 1: Smooth
    return quickNoise(I);                // 2: Grain
}

// === POST-PROCESS ===
vec3 softGamutMap(vec3 linearRgb) {
    float maxC = max(linearRgb.r, max(linearRgb.g, linearRgb.b));
    float minC = min(linearRgb.r, min(linearRgb.g, linearRgb.b));
    
    if (minC >= 0.0 && maxC <= 1.0) return linearRgb;
    
    vec3 lab = linearToOklab(max(linearRgb, 0.0));
    float L = clamp(lab.x, 0.0, 1.0);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);
    
    float maxChroma = 0.4 * (1.0 - pow(abs(2.0 * L - 1.0), 2.0));
    
    if (C > maxChroma * 0.7) {
        float knee = maxChroma * 0.7;
        C = knee + (maxChroma - knee) * tanh((C - knee) / (maxChroma - knee + 0.001));
    }
    
    return clamp(oklabToLinear(vec3(L, C * cos(h), C * sin(h))), 0.0, 1.0);
}

vec3 applyContrastSaturation(vec3 linearRgb, float contrast, float saturation) {
    vec3 lab = linearToOklab(linearRgb);
    float C = length(lab.yz);
    float h = atan(lab.z, lab.y);
    
    lab.x = clamp((lab.x - 0.5) * contrast + 0.5, 0.0, 1.0);
    C *= saturation;
    lab.y = C * cos(h);
    lab.z = C * sin(h);
    
    return oklabToLinear(lab);
}

// === MAIN ===
void main() {
    vec2 fragCoord = v_uv * u_resolution;
    vec2 r = u_resolution;
    vec2 p = (fragCoord * 2.0 - r) / r.y;
    
    int colorCount = u_colors_length;
    
    // Early out: no colors -> black
    if (colorCount < 1) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    float t = u_time * 0.3;
    
    // Map time onto a circle so animation seamlessly wraps.
    float looping = step(0.5, u_loop);
    float phase = TAU * u_time / max(u_loop, 0.01);
    float radius = u_loop * u_speed * 0.3 / TAU;
    float tA = sin(phase) * radius;
    float tB = (1.0 - cos(phase)) * radius;
    
    // Seed-based offsets
    vec3 seedOffset = seedRandom(u_seed);
    vec3 seedOffset2 = seedRandom(u_seed + 100.0);
    
    // Golden angle rotation
    float seedAngle = u_seed * GOLDEN_ANGLE;
    vec2 seedPhase = (seedOffset2.xy - 0.5) * TAU;
    
    // Seed-based rotation
    float cs = cos(seedAngle);
    float sn = sin(seedAngle);
    p = mat2(cs, -sn, sn, cs) * p;
    
    // Get dither value
    float dither = getDither(floor(fragCoord / u_pixelRatio), u_ditherMode);
    
    // === TURBULENCE ===
    float totalVal = 0.0;
    float totalWeight = 0.0;
    int turbIter = int(u_turbIter);
    
    float freq = 1.0 / max(u_turbFreq, 0.01);
    
    for (float i = 0.0; i < 4.0; i++) {
        float eph = i / 4.0;
       
        vec2 q = p * u_scale;
        float sq = eph * eph;
        
        if (u_jellify > 0.5) {
            q.yx *= mix(1.0, 0.5, 1.0 - exp(-sq));
        }
        
        float a = seedPhase.x;
        float d = seedPhase.y;
        
        for (int j = 2; j < 13; j++) {
            if (j >= turbIter) break;
            float fj = float(j);
            // When looping, use circular time. Otherwise original t.
            float t1 = mix(t * u_speed, tA, looping);
            float t2 = mix(t * u_speed, tB, looping);
            q += u_turbAmp * sin(q.yx / freq * fj + t1 + vec2(a, d) + seedOffset.xy * fj) / fj;
            a += cos(fj + d * 1.2 + q.x * 2.0 - t1 + seedOffset2.z + t2 * 0.3 * looping);
            d += sin(fj * q.y + a + seedOffset.z + t1 + seedOffset2.y + t2 * 0.3 * looping);
        }
        
        float v = 0.5 + 0.5 * sin(length(q.yx + vec2(a, d) * 0.2) * u_waveFreq + i * i + seedOffset.x);
        float weight = smoothstep(0.0, 0.5, eph) * smoothstep(1.0, 0.5, eph);
        totalVal += v * weight;
        totalWeight += weight;
    }
    
    float val = totalVal / totalWeight;
    val = clamp((val - 0.3) / 0.4, 0.0, 1.0);
    val = pow(val, exp(-u_distBias));
    val = clamp(val + (dither - 0.5) * u_dither, 0.0, 1.0);
    
    vec3 col = paletteN(val, colorCount);
    col *= u_exposure;
    col = applyContrastSaturation(col, u_contrast, u_saturation);
    col = softGamutMap(col);
    col = toSrgb(col);
    
    fragColor = vec4(col, 1.0);
}
`,propertyControls:{colors:{type:O.Array,title:`Colors`,control:{type:O.Color},maxCount:8,defaultValue:[`#00001A`,`#2962FF`,`#40BCFF`,`#FFB8B5`,`#FFC14F`]},seed:{type:O.Number,title:`Seed`,defaultValue:648,min:0,max:1e3,step:1},speed:{type:O.Number,title:`Speed`,defaultValue:.3,min:0,max:2,step:.01},loop:{type:O.Number,title:`Loop`,defaultValue:0,min:0,max:60,step:.5,hiddenWhenUnset:!0,displayStepper:!0},scale:{type:O.Number,title:`Scale`,defaultValue:.42,min:.1,max:2,step:.01},turbAmp:{type:O.Number,title:`Amplitude`,defaultValue:.6,min:0,max:1,step:.01},turbFreq:{type:O.Number,title:`Frequency`,defaultValue:.1,min:.1,max:2,step:.01},turbIter:{type:O.Number,title:`Definition`,defaultValue:7,min:3,max:10,step:1,displayStepper:!0},waveFreq:{type:O.Number,title:`Bands`,defaultValue:3.8,min:.1,max:5,step:.1},distBias:{type:O.Number,title:`Bias`,defaultValue:0,min:-1,max:1,step:.1,hiddenWhenUnset:!0},jellify:{type:O.Boolean,title:`Jellify`,defaultValue:!1,hiddenWhenUnset:!0},ditherMode:{type:O.Enum,title:`Noise`,options:[0,1,2],optionTitles:[`Off`,`Smooth`,`Grain`],defaultValue:0},dither:{type:O.Number,title:`Amount`,defaultValue:.05,min:0,max:.2,step:.01,hidden:e=>e.ditherMode===0},exposure:{type:O.Number,title:`Exposure`,defaultValue:1.1,min:.5,max:2,step:.1,section:`Filters`,displayStepper:!0,hiddenWhenUnset:!0},contrast:{type:O.Number,title:`Contrast`,defaultValue:1.1,min:.5,max:2,step:.1,section:`Filters`,displayStepper:!0,hiddenWhenUnset:!0},saturation:{type:O.Number,title:`Saturation`,defaultValue:1,min:0,max:2,step:.1,section:`Filters`,displayStepper:!0,hiddenWhenUnset:!0}}})}));function I(e,...t){let n={};return t?.forEach(t=>t&&Object.assign(n,e[t])),n}var L,R,z,B,V,de,H,U,W,G,K,q,J,Y,X,Z,fe=e((()=>{c(),_(),p(),r(),L=j(u.div),R={Rg61MhywJ:{hover:!0,pressed:!0}},z=[`Rg61MhywJ`,`zNkuqWxeD`,`I8EdpZ_Ls`,`kkGSMI0fp`,`UwtCtGrpQ`],B=`framer-HDh8C`,V={I8EdpZ_Ls:`framer-v-1e46sy8`,kkGSMI0fp:`framer-v-19p7bw7`,Rg61MhywJ:`framer-v-jxmfz4`,UwtCtGrpQ:`framer-v-61lr07`,zNkuqWxeD:`framer-v-1nbmguo`},de={delay:0,duration:.2,ease:[.44,0,.56,1],type:`tween`},H={delay:0,duration:1,ease:[0,0,1,1],type:`tween`},U={opacity:1,rotate:360,rotateX:0,rotateY:0,scale:1,skewX:0,skewY:0,x:0,y:0},W=(e,t)=>`translateX(-50%) ${t}`,G=({value:e,children:t})=>{let r=o(d),i=e??r.transition,a=n(()=>({...r,transition:i}),[JSON.stringify(i)]);return s(d.Provider,{value:a,children:t})},K={Default:`Rg61MhywJ`,Disabled:`I8EdpZ_Ls`,Error:`UwtCtGrpQ`,Loading:`zNkuqWxeD`,Success:`kkGSMI0fp`},q=u.create(t),J=({height:e,id:t,width:n,...r})=>({...r,variant:K[r.variant]??r.variant??`Rg61MhywJ`}),Y=(e,t)=>e.layoutDependency?t.join(`-`)+e.layoutDependency:t.join(`-`),X=x(i(function(e,n){let r=ee(null),i=n??r,a=te(),{activeLocale:o,setLocale:c}=A();S();let{style:d,className:p,layoutId:m,variant:g,..._}=J(e),{baseVariant:v,classNames:y,clearLoadingGesture:ne,gestureHandlers:b,gestureVariant:x,isLoading:re,setGestureState:ie,setVariant:ae,variants:w}=oe({cycleOrder:z,defaultVariant:`Rg61MhywJ`,enabledGestures:R,ref:i,variant:g,variantClassNames:V}),T=Y(e,w),E=C(B),D=()=>v!==`zNkuqWxeD`,O=()=>v===`zNkuqWxeD`;return s(f,{id:m??a,children:s(q,{animate:w,initial:!1,children:s(G,{value:de,children:l(u.button,{..._,...b,className:C(E,`framer-jxmfz4`,p,y),"data-framer-name":`Default`,"data-reset":`button`,layoutDependency:T,layoutId:`Rg61MhywJ`,ref:i,style:{backgroundColor:`rgb(51, 51, 51)`,borderBottomLeftRadius:10,borderBottomRightRadius:10,borderTopLeftRadius:10,borderTopRightRadius:10,opacity:1,...d},variants:{"Rg61MhywJ-hover":{backgroundColor:`rgba(51, 51, 51, 0.85)`,opacity:1},"Rg61MhywJ-pressed":{opacity:1},I8EdpZ_Ls:{opacity:.5},kkGSMI0fp:{opacity:1},UwtCtGrpQ:{backgroundColor:`rgba(255, 34, 68, 0.15)`,opacity:1}},...I({"Rg61MhywJ-hover":{"data-framer-name":void 0},"Rg61MhywJ-pressed":{"data-framer-name":void 0},I8EdpZ_Ls:{"data-framer-name":`Disabled`},kkGSMI0fp:{"data-framer-name":`Success`},UwtCtGrpQ:{"data-framer-name":`Error`},zNkuqWxeD:{"data-framer-name":`Loading`}},v,x),children:[D()&&s(h,{__fromCanvasComponent:!0,children:s(t,{children:s(u.p,{style:{"--font-selector":`SW50ZXItU2VtaUJvbGQ=`,"--framer-font-family":`"Inter", "Inter Placeholder", sans-serif`,"--framer-font-size":`14px`,"--framer-font-weight":`600`,"--framer-text-color":`var(--extracted-r6o4lv, rgb(255, 255, 255))`},children:`Submit`})}),className:`framer-1ylka0v`,fonts:[`Inter-SemiBold`],layoutDependency:T,layoutId:`aupLp1P7E`,style:{"--extracted-r6o4lv":`rgb(255, 255, 255)`,"--framer-link-text-color":`rgb(0, 153, 255)`,"--framer-link-text-decoration":`underline`},variants:{UwtCtGrpQ:{"--extracted-r6o4lv":`rgb(255, 34, 68)`}},verticalAlignment:`top`,withExternalLayout:!0,...I({kkGSMI0fp:{children:s(t,{children:s(u.p,{style:{"--font-selector":`SW50ZXItU2VtaUJvbGQ=`,"--framer-font-family":`"Inter", "Inter Placeholder", sans-serif`,"--framer-font-size":`14px`,"--framer-font-weight":`600`,"--framer-text-color":`var(--extracted-r6o4lv, rgb(255, 255, 255))`},children:`Thank you`})})},UwtCtGrpQ:{children:s(t,{children:s(u.p,{style:{"--font-selector":`SW50ZXItU2VtaUJvbGQ=`,"--framer-font-family":`"Inter", "Inter Placeholder", sans-serif`,"--framer-font-size":`14px`,"--framer-font-weight":`600`,"--framer-text-color":`var(--extracted-r6o4lv, rgb(255, 34, 68))`},children:`Something went wrong`})})}},v,x)}),O()&&s(u.div,{className:`framer-1hu553w`,"data-framer-name":`Spinner`,layoutDependency:T,layoutId:`GNADUy1jV`,style:{mask:`url('https://framerusercontent.com/images/pGiXYozQ3mE4cilNOItfe2L2fUA.svg?width=20&height=20') alpha no-repeat center / cover add`,WebkitMask:`url('https://framerusercontent.com/images/pGiXYozQ3mE4cilNOItfe2L2fUA.svg?width=20&height=20') alpha no-repeat center / cover add`},children:s(L,{__framer__loop:U,__framer__loopEffectEnabled:!0,__framer__loopPauseOffscreen:!0,__framer__loopRepeatDelay:0,__framer__loopRepeatType:`loop`,__framer__loopTransition:H,__perspectiveFX:!1,__smartComponentFX:!0,__targetOpacity:1,className:`framer-15z0lj4`,"data-framer-name":`Conic`,layoutDependency:T,layoutId:`M7qDTjw3X`,style:{background:`conic-gradient(from 180deg at 50% 50%, rgb(68, 204, 255) 0deg, rgb(68, 204, 255) 360deg)`,backgroundColor:`rgb(68, 204, 255)`,mask:`none`,WebkitMask:`none`},variants:{zNkuqWxeD:{background:`conic-gradient(from 0deg at 50% 50%, rgba(255, 255, 255, 0) 7.208614864864882deg, rgb(255, 255, 255) 342deg)`,backgroundColor:`rgba(0, 0, 0, 0)`,mask:`url('https://framerusercontent.com/images/pGiXYozQ3mE4cilNOItfe2L2fUA.svg?width=20&height=20') alpha no-repeat center / cover add`,WebkitMask:`url('https://framerusercontent.com/images/pGiXYozQ3mE4cilNOItfe2L2fUA.svg?width=20&height=20') alpha no-repeat center / cover add`}},children:s(u.div,{className:`framer-6aq4xb`,"data-framer-name":`Rounding`,layoutDependency:T,layoutId:`T4dBhag3V`,style:{backgroundColor:`rgb(255, 255, 255)`,borderBottomLeftRadius:1,borderBottomRightRadius:1,borderTopLeftRadius:1,borderTopRightRadius:1},transformTemplate:W})})})]})})})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-HDh8C.framer-1j7qjtx, .framer-HDh8C .framer-1j7qjtx { display: block; }`,`.framer-HDh8C.framer-jxmfz4 { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 40px; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 240px; }`,`.framer-HDh8C .framer-1ylka0v { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }`,`.framer-HDh8C .framer-1hu553w { aspect-ratio: 1 / 1; flex: none; gap: 10px; height: var(--framer-aspect-ratio-supported, 20px); overflow: hidden; position: relative; width: 20px; }`,`.framer-HDh8C .framer-15z0lj4 { bottom: 0px; flex: none; left: 0px; overflow: visible; position: absolute; right: 0px; top: 0px; }`,`.framer-HDh8C .framer-6aq4xb { aspect-ratio: 1 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 2px); left: 50%; overflow: visible; position: absolute; top: 0px; width: 2px; }`,`.framer-HDh8C.framer-v-1nbmguo.framer-jxmfz4, .framer-HDh8C.framer-v-1e46sy8.framer-jxmfz4, .framer-HDh8C.framer-v-19p7bw7.framer-jxmfz4, .framer-HDh8C.framer-v-61lr07.framer-jxmfz4 { cursor: unset; }`,`.framer-HDh8C.framer-v-1nbmguo .framer-15z0lj4 { overflow: hidden; }`],`framer-HDh8C`),Z=X,X.displayName=`Button`,X.defaultProps={height:40,width:240},y(X,{variant:{options:[`Rg61MhywJ`,`zNkuqWxeD`,`I8EdpZ_Ls`,`kkGSMI0fp`,`UwtCtGrpQ`],optionTitles:[`Default`,`Loading`,`Disabled`,`Success`,`Error`],title:`Variant`,type:O.Enum}}),g(X,[{explicitInter:!0,fonts:[{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,url:`https://framerusercontent.com/assets/hyOgCu0Xnghbimh0pE8QTvtt2AU.woff2`,weight:`600`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,url:`https://framerusercontent.com/assets/NeGmSOXrPBfEFIy5YZeHq17LEDA.woff2`,weight:`600`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+1F00-1FFF`,url:`https://framerusercontent.com/assets/oYaAX5himiTPYuN8vLWnqBbfD2s.woff2`,weight:`600`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0370-03FF`,url:`https://framerusercontent.com/assets/lEJLP4R0yuCaMCjSXYHtJw72M.woff2`,weight:`600`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,url:`https://framerusercontent.com/assets/cRJyLNuTJR5jbyKzGi33wU9cqIQ.woff2`,weight:`600`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,url:`https://framerusercontent.com/assets/yDtI2UI8XcEg1W2je9XPN3Noo.woff2`,weight:`600`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,url:`https://framerusercontent.com/assets/A0Wcc7NgXMjUuFdquHDrIZpzZw0.woff2`,weight:`600`}]}],{supportsExplicitInterCodegen:!0})})),pe,me,he,ge,_e,Q,ve,ye,be,xe,$,Se,Ce;e((()=>{c(),_(),p(),r(),P(),ue(),fe(),M(),pe=m(Z),me={},he=[],ge=`framer-8WXyF`,_e={KCsFHgXVt:`framer-v-ycydzw`},Q=(e,t,n)=>e&&t?`position`:n,ve=(...e)=>{for(let t of e)if(t&&typeof t==`string`)return t},ye=(e,t,n)=>{switch(e.state){case`success`:return t.success??n;case`pending`:return t.pending??n;case`error`:return t.error??n;case`incomplete`:return t.incomplete??n;default:return n}},be=({value:e})=>T()?null:s("style",{dangerouslySetInnerHTML:{__html:e},"data-framer-html-style":``}),xe=({height:e,id:t,width:n,...r})=>({...r}),$=x(i(function(e,r){let i=ee(null),c=r??i,p=te(),{activeLocale:m,setLocale:g}=A(),_=S(),{style:v,className:y,layoutId:ne,variant:x,...oe}=xe(e);ae(n(()=>le({},m),[m]));let[T,O]=ie(x,me,!1),j=C(ge),M=o(w)?.isLayoutTemplate,P=Q(M,!!o(d)?.transition?.layout);return se({}),s(w.Provider,{value:{activeVariantId:T,primaryVariantId:`KCsFHgXVt`,variantClassNames:_e},children:l(f,{id:ne??p,children:[s(be,{value:`html body { background: var(--token-e5a910e4-bdea-462a-af15-d6d1132b60b2, rgb(10, 10, 12)); }`}),l(u.div,{...oe,className:C(j,`framer-ycydzw`,y),ref:c,style:{...v},children:[s(E,{className:`framer-11wrf32-container`,layout:P,children:s(b,{__fromCanvasComponent:!0,animated:N.animated,buffers:N.buffers,fallbackImage:`https://framerusercontent.com/images/6vNougUS79VxjFaTtsrQEidrRw.png?width=2444&height=1064`,fragmentShader:N.fragment,height:`100%`,heightmapSource:N.heightmapSource,mode:`progressive`,mouse:N.mouse&&{enabled:N.mouse===`enabledByDefault`},resolutionScale:N.resolutionScale,skipInitialFallback:!1,uniforms:{u_blendAmount:{type:`number`,value:.54},u_colors:{type:`array`,value:[`rgb(255, 54, 36)`,`rgb(158, 171, 255)`,`rgb(255, 174, 0)`,`rgb(226, 158, 255)`]},u_maskSoftness:{type:`number`,value:.74},u_seed:{type:`number`,value:32},u_waveAmplitude:{type:`number`,value:2.1},u_waveAngle:{type:`number`,value:105},u_waveFreqX:{type:`number`,value:.9},u_waveFreqY:{type:`number`,value:6},u_waveSpeed:{type:`number`,value:1.5}},vertexShader:N.vertex,width:`100%`})}),s(u.div,{className:`framer-2ag8op`,children:s(u.div,{children:[s(u.style,{dangerouslySetInnerHTML:{__html:`.mf-form{display:flex;flex-direction:column;gap:20px;padding:20px;width:100%;box-sizing:border-box;}`+`.mf-label{display:flex;flex-direction:column;gap:10px;width:100%;}`+`.mf-label-text{font-family:"Inter",sans-serif;font-size:12px;font-weight:500;color:rgb(136,136,136);}`+`.mf-input,.mf-select{width:100%;height:40px;background:rgba(187,187,187,0.15);border:1px solid rgba(136,136,136,0.1);border-radius:10px;padding:0 12px;font-family:"Inter",sans-serif;font-size:14px;color:#999;outline:none;box-sizing:border-box;}`+`.mf-input::placeholder{color:#999;}`+`.mf-input:focus,.mf-select:focus{border-color:#0099ff;}`+`.mf-select-wrap{position:relative;width:100%;}`+`.mf-select-wrap::after{content:"\u203A";position:absolute;right:14px;top:50%;transform:translateY(-50%) rotate(90deg);color:#999;pointer-events:none;}`+`.mf-select{appearance:none;-webkit-appearance:none;padding-right:36px;cursor:pointer;background:rgba(187,187,187,0.15);border:1px solid rgba(136,136,136,0.1);border-radius:10px;height:40px;width:100%;padding-left:12px;font-family:"Inter",sans-serif;font-size:14px;color:#999;outline:none;box-sizing:border-box;}`+`.mf-select option{background:#1a1a1a;color:#999;}`+`.mf-btn{width:100%;height:40px;background:rgb(51,51,51);border:none;border-radius:10px;color:#fff;font-family:"Inter",sans-serif;font-size:14px;font-weight:600;cursor:pointer;}`+`.mf-btn:hover{background:rgba(51,51,51,0.85);}`+`.mf-btn:disabled{opacity:0.6;cursor:not-allowed;}`+`#mf-toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%);padding:14px 28px;border-radius:10px;font-family:"Inter",sans-serif;font-size:14px;font-weight:500;z-index:9999;opacity:0;transition:opacity 0.3s;pointer-events:none;}`+`#mf-toast.show{opacity:1;}`+`#mf-toast.success{background:#1a3a1a;color:#4ade80;border:1px solid #4ade80;}`+`#mf-toast.error{background:#3a1a1a;color:#f87171;border:1px solid #f87171;}`}}),s(u.div,{id:`mf-toast`}),s(u.form,{className:`mf-form`,onSubmit:async function(ev){ev.preventDefault();var btn=ev.target.querySelector(".mf-btn");var toast=document.getElementById("mf-toast");btn.disabled=true;btn.textContent="Sending...";try{var res=await fetch("https://formspree.io/f/xkoaqqwn",{method:"POST",headers:{Accept:"application/json"},body:new FormData(ev.target)});if(res.ok){ev.target.reset();toast.textContent="Message sent! We will be in touch.";toast.className="success show";toast.id="mf-toast";setTimeout(function(){toast.className="";toast.id="mf-toast";},4000);}else{throw new Error("fail");}}catch(e){toast.textContent="Something went wrong. Please try again.";toast.className="error show";toast.id="mf-toast";setTimeout(function(){toast.className="";toast.id="mf-toast";},4000);}finally{btn.disabled=false;btn.textContent="Submit";}},children:[l(u.label,{className:`mf-label`,children:[s(u.span,{className:`mf-label-text`,children:`Name`}),s(u.input,{className:`mf-input`,name:`Name`,type:`text`,placeholder:`Jane Smith`,required:true})]}),l(u.label,{className:`mf-label`,children:[s(u.span,{className:`mf-label-text`,children:`Email`}),s(u.input,{className:`mf-input`,name:`Email`,type:`email`,placeholder:`jane@framer.com`,required:true})]}),l(u.label,{className:`mf-label`,children:[s(u.span,{className:`mf-label-text`,children:`Phone Number`}),s(u.input,{className:`mf-input`,name:`Phone`,type:`tel`,placeholder:`+1 (555) 000-0000`})]}),l(u.label,{className:`mf-label`,children:[s(u.span,{className:`mf-label-text`,children:`Primary Need`}),s(u.div,{className:`mf-select-wrap`,children:s(u.select,{className:`mf-select`,name:`Primary Need`,defaultValue:`Revenue Infrastructure`,children:[s(u.option,{value:`Revenue Infrastructure`,children:`Revenue Infrastructure`}),s(u.option,{value:`Growth Infrastructure`,children:`Growth Infrastructure`}),s(u.option,{value:`Automation Infrastructure`,children:`Automation Infrastructure`}),s(u.option,{value:`Full Operations System`,children:`Full Operations System`})]})})]}),s(u.button,{className:`mf-btn`,type:`submit`,children:`Submit`})]})]})},s(E,{className:`framer-47ins-container`,layout:P,children:s(b,{__fromCanvasComponent:!0,animated:F.animated,buffers:F.buffers,fallbackImage:`https://framerusercontent.com/images/D0ogXxkwsrapIGnak01Tw2WXBEY.png?width=2408&height=1182`,fragmentShader:F.fragment,height:`100%`,heightmapSource:F.heightmapSource,mode:`progressive`,mouse:F.mouse&&{enabled:F.mouse===`enabledByDefault`},resolutionScale:F.resolutionScale,skipInitialFallback:!1,uniforms:{u_colors:{type:`array`,value:[`rgb(0, 0, 26)`,`rgb(41, 98, 255)`,`rgb(64, 188, 255)`,`rgb(255, 184, 181)`,`rgb(255, 193, 79)`]},u_contrast:{type:`number`,value:1.1},u_distBias:{type:`number`,value:0},u_dither:{type:`number`,value:.05},u_ditherMode:{type:`enum`,value:0},u_exposure:{type:`number`,value:1.1},u_jellify:{type:`boolean`,value:!1},u_loop:{type:`number`,value:0},u_saturation:{type:`number`,value:1},u_scale:{type:`number`,value:.42},u_seed:{type:`number`,value:648},u_speed:{type:`number`,value:.3},u_turbAmp:{type:`number`,value:.6},u_turbFreq:{type:`number`,value:.1},u_turbIter:{type:`number`,value:7},u_waveFreq:{type:`number`,value:3.8}},vertexShader:F.vertex,width:`100%`})})]}),s("div",{id:`overlay`})]})})}),[`@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,`.framer-8WXyF.framer-7ngxbf, .framer-8WXyF .framer-7ngxbf { display: block; }`,`.framer-8WXyF.framer-ycydzw { align-content: center; align-items: center; background-color: var(--token-e5a910e4-bdea-462a-af15-d6d1132b60b2, #0a0a0c); display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 1080px; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 1200px; }`,`.framer-8WXyF .framer-11wrf32-container { flex: none; height: 532px; position: relative; width: 1222px; }`,`.framer-8WXyF .framer-2ag8op { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 20px; position: relative; width: 1023px; }`,`.framer-8WXyF .framer-grra0, .framer-8WXyF .framer-152858g, .framer-8WXyF .framer-kyoggk { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; padding: 0px; position: relative; width: 100%; }`,`.framer-8WXyF .framer-1ysvslv, .framer-8WXyF .framer-zgn449, .framer-8WXyF .framer-5jtdcv { flex: none; height: auto; position: relative; white-space: pre; width: auto; }`,`.framer-8WXyF .framer-7qc9ad, .framer-8WXyF .framer-12j9n48 { --framer-input-background: rgba(187, 187, 187, 0.15); --framer-input-border-bottom-width: 1px; --framer-input-border-color: rgba(136, 136, 136, 0.1); --framer-input-border-left-width: 1px; --framer-input-border-radius-bottom-left: 10px; --framer-input-border-radius-bottom-right: 10px; --framer-input-border-radius-top-left: 10px; --framer-input-border-radius-top-right: 10px; --framer-input-border-right-width: 1px; --framer-input-border-style: solid; --framer-input-border-top-width: 1px; --framer-input-focused-border-color: #0099ff; --framer-input-focused-border-style: solid; --framer-input-focused-border-width: 1px; --framer-input-font-color: #999999; --framer-input-font-family: "Inter"; --framer-input-font-letter-spacing: 0em; --framer-input-font-line-height: 1.2em; --framer-input-font-size: 14px; --framer-input-font-weight: 400; --framer-input-icon-mask-image: none; --framer-input-padding: 12px; --framer-input-placeholder-color: #999999; flex: none; height: 40px; position: relative; width: 100%; }`,`.framer-8WXyF .framer-13srszh { --framer-input-background: rgba(187, 187, 187, 0.15); --framer-input-border-bottom-width: 1px; --framer-input-border-color: rgba(136, 136, 136, 0.1); --framer-input-border-left-width: 1px; --framer-input-border-radius-bottom-left: 10px; --framer-input-border-radius-bottom-right: 10px; --framer-input-border-radius-top-left: 10px; --framer-input-border-radius-top-right: 10px; --framer-input-border-right-width: 1px; --framer-input-border-style: solid; --framer-input-border-top-width: 1px; --framer-input-focused-border-color: #0099ff; --framer-input-focused-border-style: solid; --framer-input-focused-border-width: 1px; --framer-input-font-color: #999999; --framer-input-font-family: "Inter"; --framer-input-font-letter-spacing: 0em; --framer-input-font-line-height: 1.2em; --framer-input-font-size: 14px; --framer-input-font-weight: 400; --framer-input-icon-color: #999999; --framer-input-invalid-text-color: #999999; --framer-input-padding: 12px; flex: none; height: 40px; position: relative; width: 100%; }`,`.framer-8WXyF .framer-1hx7bl6-container { flex: none; height: 40px; position: relative; width: 100%; }`,`.framer-8WXyF .framer-47ins-container { flex: none; height: 591px; position: relative; width: 1204px; }`],`framer-8WXyF`),Se=$,$.displayName=`Page`,$.defaultProps={height:1456,width:1200},g($,[{explicitInter:!0,fonts:[{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,url:`https://framerusercontent.com/assets/5A3Ce6C9YYmCjpQx9M4inSaKU.woff2`,weight:`500`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,url:`https://framerusercontent.com/assets/Qx95Xyt0Ka3SGhinnbXIGpEIyP4.woff2`,weight:`500`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+1F00-1FFF`,url:`https://framerusercontent.com/assets/6mJuEAguuIuMog10gGvH5d3cl8.woff2`,weight:`500`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0370-03FF`,url:`https://framerusercontent.com/assets/xYYWaj7wCU5zSQH0eXvSaS19wo.woff2`,weight:`500`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,url:`https://framerusercontent.com/assets/otTaNuNpVK4RbdlT7zDDdKvQBA.woff2`,weight:`500`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,url:`https://framerusercontent.com/assets/UjlFhCnUjxhNfep4oYBPqnEssyo.woff2`,weight:`500`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,url:`https://framerusercontent.com/assets/DolVirEGb34pEXEp8t8FQBSK4.woff2`,weight:`500`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,url:`https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,url:`https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+1F00-1FFF`,url:`https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0370-03FF`,url:`https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,url:`https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,url:`https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2`,weight:`400`},{cssFamilyName:`Inter`,source:`framer`,style:`normal`,uiFamilyName:`Inter`,unicodeRange:`U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,url:`https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2`,weight:`400`}]},...pe],{supportsExplicitInterCodegen:!0}),$.loader={load:(e,t)=>(t.locale,Promise.allSettled([ne(Z,{},t)]))},Ce={exports:{default:{type:`reactComponent`,name:`FramerumAUAhsNQ`,slots:[],annotations:{framerAutoSizeImages:`true`,framerAcceptsLayoutTemplate:`true`,framerCanvasComponentVariantDetails:`{"propertyName":"variant","data":{"default":{"layout":["fixed","fixed"]}}}`,framerDisplayContentsDiv:`false`,framerScrollSections:`false`,framerContractVersion:`1`,framerColorSyntax:`true`,framerIntrinsicWidth:`1200`,framerImmutableVariables:`true`,framerIntrinsicHeight:`1456`,framerLayoutTemplateFlowEffect:`true`,framerResponsiveScreen:`true`,framerComponentViewportWidth:`true`}},Props:{type:`tsType`,annotations:{framerContractVersion:`1`}},queryParamNames:{type:`variable`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}}))();export{Ce as __FramerMetadata__,Se as default,he as queryParamNames};
//# sourceMappingURL=79Y2naR68ldF1ijRvc31Dx4CGZEJYPBwjR9M0Yy16sM.DtUiqT0f.mjs.map