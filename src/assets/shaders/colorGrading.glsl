// Color Grading Shader
// KNOUX Player X - Version 1.0.0

const colorGradingShader = 
precision mediump float;

uniform sampler2D u_texture;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_hue;
uniform vec3 u_tint;

varying vec2 v_texCoord;

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec4 color = texture2D(u_texture, v_texCoord);
    
    // Apply brightness
    color.rgb += u_brightness;
    
    // Apply contrast
    color.rgb = ((color.rgb - 0.5) * max(u_contrast, 0.0)) + 0.5;
    
    // Apply saturation
    float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb = mix(vec3(luminance), color.rgb, u_saturation);
    
    // Apply hue
    vec3 hsv = rgb2hsv(color.rgb);
    hsv.x = mod(hsv.x + u_hue, 1.0);
    color.rgb = hsv2rgb(hsv);
    
    // Apply tint
    color.rgb *= u_tint;
    
    gl_FragColor = color;
}
;

export default colorGradingShader;
