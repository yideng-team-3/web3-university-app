import React, { useEffect, useRef, memo } from 'react';
import * as THREE from 'three';

// 单例模式控制器
let isParticlesInitialized = false;
let animationFrameId: number | null = null;
let sceneInstance: THREE.Scene | null = null;
let cameraInstance: THREE.PerspectiveCamera | null = null;
let rendererInstance: THREE.WebGLRenderer | null = null;
let particleGroupsInstance: ParticleGroup[] = [];

// 为粒子系统创建自定义类型
interface ParticleSystemUserData {
  opacityArray: Float32Array;
  scaleArray: Float32Array;
  speedArray: Float32Array;
  phaseArray: Float32Array;
  initialPositions: Float32Array;
  time: number;
  rotationSpeed: number;
  waveSpeed: number;
  waveAmplitude: number;
}

// 为粒子组创建自定义类型
interface ParticleGroup extends THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> {
  userData: ParticleSystemUserData;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
}

// 性能配置对象
const performanceConfig = {
  highPerformance: {
    particleCount1: 2000,
    particleCount2: 1000,
    particleCount3: 500,
    particleCount4: 200
  },
  mediumPerformance: {
    particleCount1: 1000,
    particleCount2: 500,
    particleCount3: 250,
    particleCount4: 100
  },
  lowPerformance: {
    particleCount1: 500, 
    particleCount2: 250,
    particleCount3: 125,
    particleCount4: 50
  }
};

const AutonomousParticlesBackground = memo(() => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // 如果已经初始化，不再重复创建
    if (isParticlesInitialized) {
      return undefined;
    }
    
    // 如果挂载点不存在，则提前返回
    if (!mountRef.current) return undefined;

    // 检测设备性能
    const getPerformanceLevel = () => {
      // 检测是否为移动设备
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // 检测是否为低端设备 (根据处理器核心数粗略判断)
      const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      
      if (isMobile || isLowEndDevice) {
        return 'lowPerformance';
      }
      
      // 判断显卡性能 (粗略估计，可根据实际情况调整)
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        return 'lowPerformance';
      }
      
      // 修复类型错误：判断是否为WebGLRenderingContext
      let renderer = '';
      if (gl instanceof WebGLRenderingContext) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
      
      if (renderer) {
        // 简单判断高端显卡
        if (/(rtx|rx|geforce|radeon)/i.test(renderer) && !/(mobile)/i.test(renderer)) {
          return 'highPerformance';
        }
      }
      
      // 默认使用中等配置
      return 'mediumPerformance';
    };
    
    const performanceLevel = getPerformanceLevel();
    const config = performanceConfig[performanceLevel as keyof typeof performanceConfig];
    
    // 场景设置
    const scene = new THREE.Scene();
    sceneInstance = scene;
    
    // 摄像机设置
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraInstance = camera;
    
    // 渲染器设置
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: performanceLevel !== 'lowPerformance', // 低端设备关闭抗锯齿
      powerPreference: 'high-performance' // 性能优先
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // 限制像素比
    rendererInstance = renderer;
    
    // 添加渲染器到DOM
    const currentRef = mountRef.current;
    currentRef.appendChild(renderer.domElement);
    
    // 创建粒子组
    const particleGroups: ParticleGroup[] = [];
    particleGroupsInstance = particleGroups;
    
    // 创建不同类型的粒子组
    function createParticleGroup(
      count: number, 
      range: number, 
      size: number, 
      color: THREE.Color, 
      minOpacity: number, 
      maxOpacity: number, 
      rotationSpeed: number, 
      waveSpeed: number, 
      waveAmplitude: number
    ): void {
      // 生成粒子
      const particlesGeometry = new THREE.BufferGeometry();
      const posArray = new Float32Array(count * 3);
      const opacityArray = new Float32Array(count);
      const scaleArray = new Float32Array(count);
      const speedArray = new Float32Array(count);
      const phaseArray = new Float32Array(count); // 相位差，使粒子运动不同步
      
      // 设置粒子位置、透明度和缩放
      for (let i = 0; i < count; i += 1) {
        // 粒子位置 - 在指定范围内随机分布
        posArray[i * 3] = (Math.random() - 0.5) * range;     // x
        posArray[i * 3 + 1] = (Math.random() - 0.5) * range; // y
        posArray[i * 3 + 2] = (Math.random() - 0.5) * range; // z
        
        // 粒子透明度 - 在最小和最大透明度之间随机
        opacityArray[i] = Math.random() * (maxOpacity - minOpacity) + minOpacity;
        
        // 粒子大小 - 随机变化
        scaleArray[i] = Math.random() * 2 + 0.5;
        
        // 粒子速度 - 随机变化
        speedArray[i] = Math.random() * 0.01 + 0.005;
        
        // 相位差 - 使每个粒子的运动不同步
        phaseArray[i] = Math.random() * Math.PI * 2;
      }
      
      particlesGeometry.setAttribute(
        'position', 
        new THREE.BufferAttribute(posArray, 3)
      );
      
      // 创建点材质
      const particlesMaterial = new THREE.PointsMaterial({
        size,
        color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      
      // 创建粒子系统
      const particleSystem = new THREE.Points(
        particlesGeometry, 
        particlesMaterial
      );
      
      // 转换为自定义粒子组类型
      const particleGroup = particleSystem as unknown as ParticleGroup;
      
      // 存储额外属性以便动画使用
      particleGroup.userData = {
        opacityArray,
        scaleArray,
        speedArray,
        phaseArray,
        initialPositions: posArray.slice(), // 复制初始位置
        time: Math.random() * 1000, // 随机初始时间，使每个组的动画不同步
        rotationSpeed,
        waveSpeed,
        waveAmplitude
      };
      
      // 添加到场景和粒子组
      scene.add(particleGroup);
      particleGroups.push(particleGroup);
    }
    
    // 1. 密集近距离粒子
    createParticleGroup(config.particleCount1, 4, 0.01, 
      new THREE.Color(0x05d9e8), // 霓虹蓝色
      0.6, 0.8,
      0.0015, // 旋转速度
      0.001,  // 波动速度
      0.5     // 波动幅度
    );
    
    // 2. 中等距离粒子
    createParticleGroup(config.particleCount2, 10, 0.02, 
      new THREE.Color(0xff2a6d), // 霓虹粉色
      0.3, 0.7,
      0.0010, // 旋转速度
      0.002,  // 波动速度
      0.7     // 波动幅度
    );
    
    // 3. 远距离大型粒子
    createParticleGroup(config.particleCount3, 15, 0.03, 
      new THREE.Color(0xd300c5), // 霓虹紫色
      0.2, 0.5,
      0.0005, // 旋转速度
      0.003,  // 波动速度
      1.0     // 波动幅度
    );
    
    // 4. 稀疏闪烁粒子
    createParticleGroup(config.particleCount4, 20, 0.04, 
      new THREE.Color(0x39ff14), // 霓虹绿色
      0.1, 0.9,
      0.0020, // 旋转速度
      0.004,  // 波动速度
      1.2     // 波动幅度
    );
    
    // 创建慢速旋转的全局运动 - 降低复杂度
    const globalMotionAmplitude = performanceLevel === 'lowPerformance' ? 0.3 : 0.5; // 全局运动幅度
    const globalMotionSpeed = performanceLevel === 'lowPerformance' ? 0.0001 : 0.0002;  // 全局运动速度
    let globalMotionTime = 0;          // 全局运动时间计数器
    
    // 创建慢速漂移的焦点区域
    const focalPoint = {
      x: 0,
      y: 0,
      z: 0,
      targetX: (Math.random() - 0.5) * 2,
      targetY: (Math.random() - 0.5) * 2,
      targetZ: (Math.random() - 0.5) * 2,
      changeTime: 0
    };
    
    // 动画循环优化
    const clock = new THREE.Clock();
    let lastTime = 0;
    const targetFPS = performanceLevel === 'lowPerformance' ? 30 : 60; // 目标帧率
    const interval = 1000 / targetFPS; // 每帧间隔时间(ms)
    
    const animate = () => {
      // 帧率控制
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;
      
      // 如果经过的时间小于目标帧率间隔，跳过此帧
      if (elapsed < interval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      // 更新上次渲染时间
      lastTime = currentTime - (elapsed % interval);
      
      const delta = clock.getDelta();
      
      // 更新全局运动时间
      globalMotionTime += delta * globalMotionSpeed;
      
      // 更新焦点区域 - 频率降低，减少计算
      if (performanceLevel !== 'lowPerformance' || Math.random() < 0.05) {
        focalPoint.changeTime += delta;
        
        // 每隔10秒更换一次焦点目标
        if (focalPoint.changeTime > 10) {
          focalPoint.targetX = (Math.random() - 0.5) * 2;
          focalPoint.targetY = (Math.random() - 0.5) * 2;
          focalPoint.targetZ = (Math.random() - 0.5) * 2;
          focalPoint.changeTime = 0;
        }
        
        // 平滑过渡焦点位置
        focalPoint.x += (focalPoint.targetX - focalPoint.x) * 0.01;
        focalPoint.y += (focalPoint.targetY - focalPoint.y) * 0.01;
        focalPoint.z += (focalPoint.targetZ - focalPoint.z) * 0.01;
      }
      
      // 更新所有粒子组
      particleGroups.forEach((particleSystem, groupIndex) => {
        // 低性能设备跳过部分组的更新
        if (performanceLevel === 'lowPerformance' && groupIndex > 0 && Math.random() < 0.3) {
          return;
        }
        
        const { 
          phaseArray, 
          initialPositions,
          rotationSpeed,
          waveSpeed,
          waveAmplitude
        } = particleSystem.userData;
        
        particleSystem.userData.time += delta;
        
        const positions = particleSystem.geometry.attributes.position.array;
        const count = positions.length / 3;
        
        // 创建脉动效果
        const pulseAmplitude = 0.15; // 脉动幅度
        const pulseFrequency = 0.2 + groupIndex * 0.1; // 各组有不同的脉动频率
        const pulseFactor = Math.sin(particleSystem.userData.time * pulseFrequency) * pulseAmplitude + 1;
        
        // 更新粒子位置 - 采用隔帧更新粒子位置的方式节约性能
        // 修复嵌套三元表达式
        let updateFraction;
        if (performanceLevel === 'lowPerformance') {
          updateFraction = 0.3;
        } else if (performanceLevel === 'mediumPerformance') {
          updateFraction = 0.6;
        } else {
          updateFraction = 1.0;
        }
        
        for (let i = 0; i < count; i += 1) {
          // 性能优化：部分粒子不更新位置
          if (Math.random() > updateFraction) {
            // 修复ESLint no-continue错误，改用if-else结构
          } else {
            // 获取初始位置
            const ix = initialPositions[i * 3];
            const iy = initialPositions[i * 3 + 1];
            const iz = initialPositions[i * 3 + 2];
            
            // 计算到焦点的距离影响 - 简化计算
            const dx = ix - focalPoint.x;
            const dy = iy - focalPoint.y;
            const dz = iz - focalPoint.z;
            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            const distanceFactor = 1 / (1 + distance * 0.1);
            
            // 复杂的波动效果
            const time = particleSystem.userData.time * waveSpeed + phaseArray[i];
            const xWave = Math.sin(time + ix) * waveAmplitude;
            const yWave = Math.cos(time * 0.8 + iy * 2) * waveAmplitude;
            const zWave = Math.sin(time * 1.2 + iz * 1.5) * waveAmplitude;
            
            // 全局波动效果 - 简化计算
            const globalFactor = performanceLevel === 'lowPerformance' ? 0.01 : 0.01;
            const globalX = Math.sin(globalMotionTime + i * globalFactor) * globalMotionAmplitude;
            const globalY = Math.cos(globalMotionTime * 1.3 + i * globalFactor) * globalMotionAmplitude;
            const globalZ = Math.sin(globalMotionTime * 0.7 + i * globalFactor) * globalMotionAmplitude;
            
            // 综合所有效果计算新位置
            positions[i * 3] = ix + xWave * pulseFactor + globalX;
            positions[i * 3 + 1] = iy + yWave * pulseFactor + globalY;
            positions[i * 3 + 2] = iz + zWave * pulseFactor + globalZ;
            
            // 朝焦点方向轻微吸引
            positions[i * 3] -= dx * distanceFactor * 0.03;
            positions[i * 3 + 1] -= dy * distanceFactor * 0.03;
            positions[i * 3 + 2] -= dz * distanceFactor * 0.03;
          }
        }
        
        // 更新位置缓冲区
        particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // 脉动透明度效果
        particleSystem.material.opacity = 0.6 + Math.sin(particleSystem.userData.time * 0.5) * 0.2;
        
        // 自动旋转 - 降低旋转速度
        const rotFactor = performanceLevel === 'lowPerformance' ? 0.5 : 1.0;
        particleSystem.rotation.x += rotationSpeed * (groupIndex % 2 === 0 ? 1 : -1) * rotFactor;
        particleSystem.rotation.y += rotationSpeed * 1.5 * rotFactor;
        particleSystem.rotation.z += rotationSpeed * 0.5 * (groupIndex % 2 === 0 ? -1 : 1) * rotFactor;
      });
      
      // 渲染场景
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // 启动动画
    animate();
    isParticlesInitialized = true;
    
    // 处理窗口大小变化 - 添加节流控制
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      
      resizeTimeout = setTimeout(() => {
        if (cameraInstance && rendererInstance) {
          cameraInstance.aspect = window.innerWidth / window.innerHeight;
          cameraInstance.updateProjectionMatrix();
          rendererInstance.setSize(window.innerWidth, window.innerHeight);
        }
      }, 200); // 200ms节流
    };
    
    window.addEventListener('resize', handleResize);
    
    // 添加可见性变化监听，当页面不可见时暂停动画
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面不可见，暂停动画
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        // 页面可见且初始化完成，恢复动画
        // 修复孤立 if 错误
        const shouldRestartAnimation = animationFrameId === null && isParticlesInitialized;
        if (shouldRestartAnimation) {
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 清理函数
    return () => {
      isParticlesInitialized = false;
      
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      if (currentRef && rendererInstance && currentRef.contains(rendererInstance.domElement)) {
        currentRef.removeChild(rendererInstance.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // 清理场景
      if (sceneInstance && particleGroupsInstance.length > 0) {
        particleGroupsInstance.forEach(system => {
          sceneInstance?.remove(system);
          system.geometry.dispose();
          // 确保material是单个材质而不是数组
          if (system.material instanceof THREE.Material) {
            system.material.dispose();
          }
        });
        
        // 清空粒子组
        particleGroupsInstance = [];
      }
      
      // 清理渲染器
      if (rendererInstance) {
        rendererInstance.dispose();
        rendererInstance = null;
      }
      
      // 清理相机和场景
      cameraInstance = null;
      sceneInstance = null;
    };
  }, []);
  
  return <div ref={mountRef} id="particles-canvas" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
});

// 添加显示名称以修复 react/display-name 警告
AutonomousParticlesBackground.displayName = 'AutonomousParticlesBackground';

export default AutonomousParticlesBackground;