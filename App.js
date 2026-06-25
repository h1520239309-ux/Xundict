/**
 * 寻 - 极简查词 App
 * 主入口文件 (SDK 56 + React Navigation v7)
 * UI: 浮动胶囊 Tab 栏 + 粉色甜美系 + 圆体手写字体
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, ActivityIndicator, Platform, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import CustomTabBar from './components/CustomTabBar';
import RadialGradientBackground from './components/RadialGradientBackground';
import { initDatabase } from './database/db';
import COLORS from './constants/Colors';

// 防止闪屏自动隐藏

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 搜索页 + 详情页的 Stack 导航
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bg,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontSize: 17,
          fontWeight: '600',
        },
        headerBackTitle: '返回',
        headerBackTitleStyle: {
          fontSize: 15,
          color: COLORS.primary,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params?.word || '单词详情',
        })}
      />
    </Stack.Navigator>
  );
};

// 生词本 Stack 导航
const FavoriteStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bg,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontSize: 17,
          fontWeight: '600',
        },
        headerBackTitle: '返回',
        headerBackTitleStyle: {
          fontSize: 15,
          color: COLORS.primary,
        },
      }}
    >
      <Stack.Screen
        name="FavoriteList"
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// 底部 Tab 导航 - 使用自定义 Tab Bar
const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: '搜索' }}
      />
      <Tab.Screen
        name="FavoriteTab"
        component={FavoriteStack}
        options={{ title: '生词本' }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [fontsLoaded, fontError] = useFonts({
    'Cause-Regular': require('./assets/fonts/Cause-Regular.ttf'),
    'Cause-Medium': require('./assets/fonts/Cause-Medium.ttf'),
    'Cause-Bold': require('./assets/fonts/Cause-Bold.ttf'),
    'Cause-Light': require('./assets/fonts/Cause-Light.ttf'),
    'Cause-SemiBold': require('./assets/fonts/Cause-SemiBold.ttf'),
    'LemiXiaoNaiPaoTi': require('./assets/fonts/LeMiNaiPao.ttf'),
  });

  // 全局设置中文默认字体
  useEffect(() => {
    if (Platform.OS !== 'web') {
      Text.defaultProps = Text.defaultProps || {};
      Text.defaultProps.style = { fontFamily: 'LemiXiaoNaiPaoTi' };
    }
  }, [fontsLoaded]);

  useEffect(() => {
    initDatabase();
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <RadialGradientBackground>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.statusbarBg} />
        <NavigationContainer navigationInChildEnabled>
          <TabNavigator />
        </NavigationContainer>
      </RadialGradientBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
