import * as THREE from 'three';
// ----------------- 辅助函数 -----------------
// 创建HSL颜色
export const createHSLColor = (h: number, s: number, l: number): THREE.Color =>
  new THREE.Color().setHSL(h, s, l);