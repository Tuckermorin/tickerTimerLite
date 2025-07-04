// components/ChartLine.js
// Simple line chart component using react-native-svg

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Path, Circle, Line, Text as SvgText } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const ChartLine = ({ 
  data = [], 
  title = "Portfolio Performance",
  compareData = null,
  height = 250,
  showPoints = false 
}) => {
  const chartWidth = screenWidth - 40;
  const chartHeight = height - 80; // Leave space for labels
  const padding = 40;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      </View>
    );
  }

  // Calculate min/max values for scaling
  const allValues = [...data];
  if (compareData) {
    allValues.push(...compareData);
  }
  
  const minValue = Math.min(...allValues.map(d => d.value || d.portfolioValue || 0));
  const maxValue = Math.max(...allValues.map(d => d.value || d.portfolioValue || 0));
  const valueRange = maxValue - minValue || 1;

  // Scale functions
  const scaleX = (index) => (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding;
  const scaleY = (value) => chartHeight - padding - ((value - minValue) / valueRange) * (chartHeight - 2 * padding);

  // Generate path for main data line
  const generatePath = (dataset) => {
    if (!dataset || dataset.length === 0) return '';
    
    return dataset.reduce((path, point, index) => {
      const x = scaleX(index);
      const y = scaleY(point.value || point.portfolioValue || 0);
      return index === 0 ? `M${x},${y}` : `${path} L${x},${y}`;
    }, '');
  };

  const mainPath = generatePath(data);
  const comparePath = compareData ? generatePath(compareData) : '';

  // Generate Y-axis labels
  const yAxisLabels = [];
  const labelCount = 5;
  for (let i = 0; i <= labelCount; i++) {
    const value = minValue + (valueRange * i / labelCount);
    const y = scaleY(value);
    yAxisLabels.push({ value, y });
  }

  // Format currency
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.title}>{title}</Text>
      
      <Svg width={chartWidth} height={chartHeight} style={styles.chart}>
        {/* Grid lines */}
        {yAxisLabels.map((label, index) => (
          <Line
            key={index}
            x1={padding}
            y1={label.y}
            x2={chartWidth - padding}
            y2={label.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Y-axis labels */}
        {yAxisLabels.map((label, index) => (
          <SvgText
            key={index}
            x={padding - 10}
            y={label.y + 4}
            fontSize="10"
            fill="#8e8e93"
            textAnchor="end"
          >
            {formatCurrency(label.value)}
          </SvgText>
        ))}
        
        {/* Compare data line (if provided) */}
        {comparePath && (
          <Path
            d={comparePath}
            stroke="#ff6b6b"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        )}
        
        {/* Main data line */}
        <Path
          d={mainPath}
          stroke="#4facfe"
          strokeWidth="3"
          fill="none"
        />
        
        {/* Data points (if enabled) */}
        {showPoints && data.map((point, index) => {
          const x = scaleX(index);
          const y = scaleY(point.value || point.portfolioValue || 0);
          return (
            <Circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#4facfe"
              stroke="#fff"
              strokeWidth="2"
            />
          );
        })}
      </Svg>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#4facfe' }]} />
          <Text style={styles.legendText}>Your Strategy</Text>
        </View>
        {compareData && (
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ff6b6b' }]} />
            <Text style={styles.legendText}>Buy & Hold</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  chart: {
    alignSelf: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#8e8e93',
    fontSize: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: '#8e8e93',
    fontSize: 12,
  },
});

export default ChartLine;