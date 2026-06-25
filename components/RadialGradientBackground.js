/**
 * 径向渐变背景组件
 * 中心白色 → 四周淡抹茶绿
 * 使用多层线性渐变模拟径向渐变效果
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/Colors';

const RadialGradientBackground = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* 基础背景色 */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.bgEdge }]} />

      {/* 模拟径向渐变：多层叠加实现中心亮、四周暗的效果 */}
      {/* 外层：全屏淡绿 */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none" />

      {/* 中层：从上到下，上白下绿 */}
      <LinearGradient
        colors={[COLORS.bgCenter, COLORS.bgEdge]}
        style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
        pointerEvents="none"
      />

      {/* 内层：从下到上，下白上绿 */}
      <LinearGradient
        colors={[COLORS.bgEdge, COLORS.bgCenter]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
        pointerEvents="none"
      />

      {/* 左右方向：左白右绿 */}
      <LinearGradient
        colors={[COLORS.bgCenter, COLORS.bgEdge]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}
        pointerEvents="none"
      />

      {/* 右左方向：右白左绿 */}
      <LinearGradient
        colors={[COLORS.bgEdge, COLORS.bgCenter]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}
        pointerEvents="none"
      />

      {/* 中心高光圆（用半透明白色 View 模拟） */}
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.centerGlow,
        ]}
        pointerEvents="none"
      />

      {/* 内容层 */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  centerGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 300,
    width: '120%',
    height: '120%',
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    transform: [{ scale: 0.6 }],
  },
});

export default RadialGradientBackground;
