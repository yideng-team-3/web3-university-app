'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
  Line,
  Legend,
} from 'recharts';
import { useLanguage } from '@/components/language/Context';
import {
  ChartMouseEvent,
  CoinDataPoint,
  CrosshairValues,
  CustomTooltipProps,
} from '@/types/yd-coin-chart';

const YiDengCoinChart = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<CoinDataPoint[]>([]);
  const [crosshairValues, setCrosshairValues] = useState<CrosshairValues | null>(null);
  const [viewMode, setViewMode] = useState<'area' | 'volume' | 'candle' | 'ohlc'>('area');
  const chartRef = useRef<HTMLDivElement>(null);
  // 使用当前日期
  const [currentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // 生成模拟数据
    const generateMockData = (): CoinDataPoint[] => {
      const mockData: CoinDataPoint[] = [];
      let price = 450; // 起始价格（较高）

      // 生成从3月2日到今天的数据
      const today = new Date();
      const startDate = new Date(today.getFullYear(), 2, 2); // 3月2日

      const currentDay = new Date(startDate);

      // 先生成一个整体下降趋势
      while (currentDay <= today) {
        if (currentDay.getDay() !== 0 && currentDay.getDay() !== 6) {
          // 排除周末
          // 创建一些波动性以增加真实感
          const dayProgress =
            (currentDay.getTime() - startDate.getTime()) / (today.getTime() - startDate.getTime());

          // 随着时间推移，逐渐下降
          const trend = -170 * dayProgress;

          // 添加随机波动
          const volatility = (Math.random() - 0.5) * 20;

          // 计算新价格，并确保在250-450之间
          price = Math.max(250, Math.min(450, price + volatility + trend * 0.1));

          // 随机生成开盘价（前一天收盘价附近）
          const open =
            mockData.length === 0
              ? price + Math.random() * 10
              : mockData[mockData.length - 1].price;

          // 高点至少是开盘价和收盘价中的较高者
          const maxPrice = Math.max(price, open);
          const high = maxPrice + Math.random() * 5;

          // 低点至少是开盘价和收盘价中的较低者
          const minPrice = Math.min(price, open);
          const low = Math.max(minPrice - Math.random() * 5, price * 0.95); // 确保不会太低

          const dayData: CoinDataPoint = {
            date: currentDay.toISOString().split('T')[0],
            price: parseFloat(price.toFixed(2)),
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            volume: Math.floor(Math.random() * 45000 + 15000),
          };

          mockData.push(dayData);
        }

        // 移到下一天
        currentDay.setDate(currentDay.getDate() + 1);
      }

      // 确保最后一天的价格为270.23
      if (mockData.length > 0) {
        mockData[mockData.length - 1].price = 270.23;
        mockData[mockData.length - 1].open = 312.84;
        mockData[mockData.length - 1].high = 315.45;
        mockData[mockData.length - 1].low = 270.0;
        mockData[mockData.length - 1].volume = 38000;
      }

      return mockData;
    };

    setData(generateMockData());
  }, []);

  // 鼠标移动处理函数
  const handleMouseMove = (e: ChartMouseEvent): void => {
    if (e && e.activePayload && e.activePayload.length && e.activeCoordinate) {
      setCrosshairValues({
        x: e.activeCoordinate.x,
        y: e.activeCoordinate.y,
        data: e.activePayload[0].payload,
      });
    }
  };

  // 鼠标离开处理函数
  const handleMouseLeave = (): void => {
    setCrosshairValues(null);
  };

  // 自定义tooltip组件
  const CustomTooltip = ({ active, payload }: CustomTooltipProps): React.ReactElement | null => {
    if (active && payload && payload.length) {
      const tooltipData = payload[0].payload;
      return (
        <div className="cyberpunk-card p-4 text-sm">
          <p className="text-white font-bold mb-2">{tooltipData.date}</p>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-gray-400">
              {t('chart.open')}: <span className="text-white">${tooltipData.open}</span>
            </p>
            <p className="text-gray-400">
              {t('chart.close')}: <span className="text-white">${tooltipData.price}</span>
            </p>
            <p className="text-green-400">
              {t('chart.high')}: <span className="text-white">${tooltipData.high}</span>
            </p>
            <p className="text-red-400">
              {t('chart.low')}: <span className="text-white">${tooltipData.low}</span>
            </p>
            <p className="text-gray-400">
              {t('chart.volume')}:{' '}
              <span className="text-white">{tooltipData.volume.toLocaleString()}</span>
            </p>
            <p className="text-yellow-400">
              {t('chart.change')}:
              <span
                className={
                  tooltipData.price > tooltipData.open ? 'text-green-400 ml-1' : 'text-red-400 ml-1'
                }
              >
                {((tooltipData.price / tooltipData.open - 1) * 100).toFixed(2)}%
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // 处理图表模式切换的函数
  const toggleChartMode = (): void => {
    setViewMode(prev => {
      if (prev === 'area') return 'volume';
      if (prev === 'volume') return 'candle';
      if (prev === 'candle') return 'ohlc';
      return 'area';
    });
  };

  // 获取图表显示文本
  const getChartModeText = (): string => {
    switch (viewMode) {
      case 'area':
        return '成交量';
      case 'volume':
        return 'K线图';
      case 'candle':
        return 'OHLC图';
      default:
        return '区域图';
    }
  };

  // 渲染不同的图表内容
  const renderChart = (): React.ReactElement => {
    // 区域图
    if (viewMode === 'area') {
      return (
        <AreaChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#05d9e8" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#05d9e8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#8884d8' }}
            tickLine={{ stroke: '#8884d8' }}
            tickFormatter={(value: string) => {
              const date = new Date(value);
              return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }}
            tickCount={6}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#8884d8' }}
            tickLine={{ stroke: '#8884d8' }}
            tickCount={5}
            tickFormatter={(value: number) => value.toFixed(2)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#05d9e8"
            fillOpacity={1}
            fill="url(#colorPrice)"
            strokeWidth={2}
          />

          {/* 十字线 */}
          {crosshairValues && (
            <>
              <ReferenceLine x={crosshairValues.data.date} stroke="#ff2a6d" strokeDasharray="3 3" />
              <ReferenceLine
                y={crosshairValues.data.price}
                stroke="#ff2a6d"
                strokeDasharray="3 3"
              />
            </>
          )}
        </AreaChart>
      );
    }

    // 成交量图
    if (viewMode === 'volume') {
      return (
        <ComposedChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#8884d8' }}
            tickLine={{ stroke: '#8884d8' }}
            tickFormatter={(value: string) => {
              const date = new Date(value);
              return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }}
            tickCount={6}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            dataKey="volume"
            tick={{ fill: '#8884d8' }}
            tickLine={{ stroke: '#8884d8' }}
            tickFormatter={(value: number) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toString();
            }}
            tickCount={5}
            domain={[0, 'dataMax + 10000']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="volume" name="成交量" fill="#555555" opacity={0.8}>
            {data.map((entry, index) => {
              const dateObj = new Date(entry.date);
              const day = dateObj.getDate();
              const fill = day % 2 === 0 ? '#555555' : '#444444';

              return (
                <rect
                  key={`bar-${index}`}
                  x={`${index * (100 / data.length)}%`}
                  y={`${100 - (entry.volume / 60000) * 100}%`}
                  width={`${(100 / data.length) * 0.8}%`}
                  height={`${(entry.volume / 60000) * 100}%`}
                  fill={fill}
                  rx={2}
                  ry={2}
                />
              );
            })}
          </Bar>

          {/* 十字线 */}
          {crosshairValues && (
            <ReferenceLine x={crosshairValues.data.date} stroke="#ff2a6d" strokeDasharray="3 3" />
          )}

          {/* 图例 */}
          <text x={20} y={20} fill="#aaaaaa" textAnchor="start" dominantBaseline="hanging">
            成交量
          </text>
        </ComposedChart>
      );
    }

    // K线图
    if (viewMode === 'candle') {
      return (
        <ComposedChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#8884d8' }}
            tickLine={{ stroke: '#8884d8' }}
            tickFormatter={(value: string) => {
              const date = new Date(value);
              return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }}
            tickCount={6}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#8884d8' }}
            tickLine={{ stroke: '#8884d8' }}
            tickCount={5}
            tickFormatter={(value: number) => value.toFixed(2)}
            yAxisId="price"
          />
          <YAxis
            dataKey="volume"
            orientation="right"
            tick={{ fill: '#8884d8' }}
            tickLine={{ stroke: '#8884d8' }}
            yAxisId="volume"
            tickFormatter={(value: number) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
              return value.toString();
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* K线图 */}
          <Bar dataKey="open" fill="transparent" yAxisId="price" name="开盘价" />
          <Bar dataKey="high" fill="transparent" yAxisId="price" name="最高价" />
          <Bar dataKey="low" fill="transparent" yAxisId="price" name="最低价" />
          <Bar dataKey="price" fill="transparent" name="收盘价" yAxisId="price" />

          {/* 手动渲染K线 */}
          {data.map((entry, index) => {
            const isPositive = entry.price >= entry.open;
            const color = isPositive ? '#01b574' : '#f23645';
            const barWidth = 8; // 可根据数据量调整
            const x = index * (100 / data.length) + (100 / data.length - barWidth) / 2;

            // 这里的计算是示意性的，实际值需要根据SVG坐标系统和数据范围计算
            const yMax = 270;
            const yRange = 180;
            const yHigh = 100 - ((entry.high - yMax) / yRange) * 100;
            const yLow = 100 - ((entry.low - yMax) / yRange) * 100;
            const yOpen = 100 - ((entry.open - yMax) / yRange) * 100;
            const yClose = 100 - ((entry.price - yMax) / yRange) * 100;

            return (
              <g key={`candle-${index}`}>
                {/* 上下影线 */}
                <line
                  x1={`${x + barWidth / 2}%`}
                  y1={`${yHigh}%`}
                  x2={`${x + barWidth / 2}%`}
                  y2={`${yLow}%`}
                  stroke={color}
                  strokeWidth={1}
                />
                {/* 实体 */}
                <rect
                  x={`${x}%`}
                  y={`${Math.min(yOpen, yClose)}%`}
                  width={`${barWidth}%`}
                  height={`${Math.abs(yOpen - yClose)}%`}
                  fill={color}
                />
              </g>
            );
          })}

          {/* 成交量柱状图 */}
          <Bar dataKey="volume" fill="#555555" opacity={0.5} yAxisId="volume" name="成交量" />

          {/* 十字线 */}
          {crosshairValues && (
            <>
              <ReferenceLine x={crosshairValues.data.date} stroke="#ff2a6d" strokeDasharray="3 3" />
              <ReferenceLine
                y={crosshairValues.data.price}
                stroke="#ff2a6d"
                strokeDasharray="3 3"
                yAxisId="price"
              />
            </>
          )}
        </ComposedChart>
      );
    }

    // OHLC图 (默认)
    return (
      <ComposedChart
        data={data}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#8884d8' }}
          tickLine={{ stroke: '#8884d8' }}
          tickFormatter={(value: string) => {
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          }}
          tickCount={6}
          interval="preserveStartEnd"
          minTickGap={30}
        />
        <YAxis
          domain={['auto', 'auto']}
          tick={{ fill: '#8884d8' }}
          tickLine={{ stroke: '#8884d8' }}
          tickCount={5}
          tickFormatter={(value: number) => value.toFixed(2)}
          yAxisId="price"
        />
        <YAxis
          dataKey="volume"
          orientation="right"
          tick={{ fill: '#8884d8' }}
          tickLine={{ stroke: '#8884d8' }}
          yAxisId="volume"
          tickFormatter={(value: number) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
            return value.toString();
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {/* OHLC图 */}
        <Line
          type="monotone"
          dataKey="high"
          stroke="#01b574"
          dot={false}
          yAxisId="price"
          name="最高价"
        />
        <Line
          type="monotone"
          dataKey="low"
          stroke="#f23645"
          dot={false}
          yAxisId="price"
          name="最低价"
        />
        <Line
          type="monotone"
          dataKey="open"
          stroke="#ff2a6d"
          dot={false}
          yAxisId="price"
          name="开盘价"
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#05d9e8"
          dot={false}
          yAxisId="price"
          name="收盘价"
        />

        {/* 成交量柱状图 */}
        <Bar dataKey="volume" fill="#555555" opacity={0.5} yAxisId="volume" name="成交量" />

        {/* 十字线 */}
        {crosshairValues && (
          <>
            <ReferenceLine x={crosshairValues.data.date} stroke="#ff2a6d" strokeDasharray="3 3" />
            <ReferenceLine
              y={crosshairValues.data.price}
              stroke="#ff2a6d"
              strokeDasharray="3 3"
              yAxisId="price"
            />
          </>
        )}
      </ComposedChart>
    );
  };

  return (
    <div
      className="cyberpunk-card p-2 h-100 relative overflow-hidden"
      style={{
        backgroundColor: 'rgba(10, 11, 30, 0.9)',
        borderRadius: '12px',
        border: '1px solid #05d9e8',
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3
          className="cyberpunk-title text-xl"
          style={{
            background: 'linear-gradient(to right, #05d9e8, #c16ecf)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}
        >
          YIDENG COIN
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleChartMode}
            className="text-xs bg-gray-800 px-2 py-1 rounded text-neon-blue hover:bg-gray-700"
            style={{ border: '1px solid #05d9e8' }}
          >
            {getChartModeText()}
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-2">
        {crosshairValues ? (
          <div className="flex justify-between">
            <span className="text-neon-blue">
              {crosshairValues.data.date} • ${crosshairValues.data.price.toFixed(2)}
            </span>
            <span className="text-neon-green">
              24h: <span className="text-red-400">-12.43%</span>
            </span>
          </div>
        ) : (
          <div className="flex justify-between">
            <span className="text-neon-blue">
              {currentDate} • ${data.length > 0 ? data[data.length - 1].price.toFixed(2) : '0.00'}
            </span>
            <span className="text-neon-green">
              24h: <span className="text-red-400">-12.43%</span>
            </span>
          </div>
        )}
      </div>

      <div
        ref={chartRef}
        style={{ backgroundColor: '#0a0b1e', borderRadius: '8px', height: '90%' }}
      >
        <ResponsiveContainer width="100%" height="90%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* 价格指标 */}
      <div className="absolute bottom-4 right-4 flex space-x-4">
        <div className="text-xs">
          <span className="text-gray-400">{t('chart.marketCap')}: </span>
          <span className="text-neon-green">$45.2M</span>
        </div>
        <div className="text-xs">
          <span className="text-gray-400">{t('chart.24hVol')}: </span>
          <span className="text-neon-blue">$3.8M</span>
        </div>
      </div>
    </div>
  );
};

export default YiDengCoinChart;
