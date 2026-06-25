/**
 * 自定义底部 Tab Bar
 * 两个独立胶囊按钮，分离式设计
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../constants/Colors';
import FONTS from '../constants/Fonts';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      key: 'HomeTab',
      title: '搜索',
      icon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
    },
    {
      key: 'FavoriteTab',
      title: '生词本',
      icon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
    },
  ];

  return (
    <View style={[styles.container, { bottom: insets.bottom + 16 }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: tab.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.key);
            }
          };

          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                isFocused ? styles.tabItemActive : styles.tabItemInactive,
              ]}
              onPress={onPress}
              activeOpacity={0.7}
            >
              {tab.icon({
                color: isFocused ? '#FFFFFF' : COLORS.textTertiary,
                size: 28,
              })}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? '#FFFFFF' : COLORS.textTertiary,
                    fontFamily: FONTS.primary,
                  },
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  tabItemInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default CustomTabBar;
