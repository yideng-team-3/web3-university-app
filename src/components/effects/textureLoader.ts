import * as THREE from 'three';
import { TEXTURE_PATHS } from './constants';
// ----------------- 辅助函数 -----------------
// 加载纹理
export const loadTextures = (): Promise<Record<string, THREE.Texture>> => 
  new Promise(resolve => {
    const textures: Record<string, THREE.Texture> = {};
    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;
    const totalCount = Object.keys(TEXTURE_PATHS).length;

    // 检查是否所有纹理都已加载
    function checkComplete() {
      loadedCount += 1;
      if (loadedCount === totalCount) {
        resolve(textures);
      }
    }

    // 创建备用纹理 - 如果加载失败使用
    const createFallbackTexture = (key: string): THREE.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 128; // 增大尺寸以获得更好的效果
      canvas.height = 128;
      const context = canvas.getContext('2d');
      if (context) {
        // 根据不同的纹理类型创建不同的备用纹理
        if (key === 'glow') {
          // 创建径向渐变 - 发光效果
          const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
          gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          context.fillStyle = gradient;
          context.fillRect(0, 0, 128, 128);
        } else if (key === 'star') {
          // 创建星星形状
          context.fillStyle = 'rgba(0, 0, 0, 0)';
          context.fillRect(0, 0, 128, 128);
          context.translate(64, 64);
          context.beginPath();
          for (let i = 0; i < 5; i += 1) {
            context.lineTo(0, 32);
            context.rotate(Math.PI * 0.8);
            context.lineTo(0, 12);
            context.rotate(Math.PI * 0.8);
          }
          context.closePath();
          context.fillStyle = 'white';
          context.fill();
          // 添加发光效果
          context.shadowBlur = 15;
          context.shadowColor = 'white';
          context.fill();
        } else if (key === 'smoke') {
          // 创建烟雾纹理
          const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
          gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
          gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          context.fillStyle = gradient;
          context.fillRect(0, 0, 128, 128);

          // 添加随机噪点
          context.globalCompositeOperation = 'overlay';
          for (let i = 0; i < 30; i += 1) {
            const x = Math.random() * 128;
            const y = Math.random() * 128;
            const r = Math.random() * 10 + 5;
            const g = context.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            g.addColorStop(1, 'rgba(255, 255, 255, 0)');
            context.fillStyle = g;
            context.beginPath();
            context.arc(x, y, r, 0, Math.PI * 2);
            context.fill();
          }
        } else if (key === 'sparkle') {
          // 创建闪光纹理
          context.fillStyle = 'rgba(0, 0, 0, 0)';
          context.fillRect(0, 0, 128, 128);

          // 主光芒
          context.strokeStyle = 'white';
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(64, 24);
          context.lineTo(64, 104);
          context.moveTo(24, 64);
          context.lineTo(104, 64);
          context.stroke();

          // 对角线光芒
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(34, 34);
          context.lineTo(94, 94);
          context.moveTo(94, 34);
          context.lineTo(34, 94);
          context.stroke();

          // 中心光晕
          const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 20);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(64, 64, 20, 0, Math.PI * 2);
          context.fill();
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      return texture;
    };

    // 为每个纹理路径加载纹理
    Object.entries(TEXTURE_PATHS).forEach(([key, path]) => {
      textureLoader.load(
        path,
        texture => {
          // 成功加载
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          textures[key] = texture;

          checkComplete();
        },
        undefined, // 进度回调
        () => {
          // 错误回调 - 使用备用纹理
          // eslint-disable-next-line no-console
          console.warn(`无法加载纹理 ${path}, 使用备用纹理`);
          textures[key] = createFallbackTexture(key);

          checkComplete();
        },
      );
    });
  });