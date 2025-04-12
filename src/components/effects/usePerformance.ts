// ----------------- 辅助函数 -----------------
// 检测设备性能级别
export const detectPerformanceLevel = (): 'high' | 'medium' | 'low' => {
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  // 检测是否为低端设备 (根据处理器核心数)
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

  if (isMobile || isLowEndDevice) {
    return 'low';
  }

  // 判断显卡性能
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) {
    return 'low';
  }

  // 检查是否为WebGLRenderingContext
  let renderer = '';
  if (gl instanceof WebGLRenderingContext) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }
  }

  if (renderer) {
    // 高端显卡判断
    if (/(rtx|rx\s*\d{4}|geforce\s*\d{4}|radeon)/i.test(renderer) && !/(mobile)/i.test(renderer)) {
      return 'high';
    }

    // 中端显卡判断
    if (/(gtx|radeon|intel\s*iris)/i.test(renderer) && !/(mobile)/i.test(renderer)) {
      return 'medium';
    }
  }

  // 默认使用中等配置
  return 'medium';
};
