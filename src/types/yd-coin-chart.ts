// 定义数据类型接口
export interface CoinDataPoint {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

// 定义tooltip参数类型
export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CoinDataPoint;
  }>;
  label?: string;
}

// 定义鼠标事件类型
export interface ChartMouseEvent {
  activePayload?: Array<{
    payload: CoinDataPoint;
  }>;
  activeCoordinate?: {
    x: number;
    y: number;
  };
}

// 定义crosshairValues的类型
export interface CrosshairValues {
  x: number;
  y: number;
  data: CoinDataPoint;
}
