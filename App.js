/**
 * 寻 - 极简查词 App
 * 主入口文件 (SDK 56 + React Navigation v7)
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import { initDatabase } from './database/db';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 搜索页 + 详情页的 Stack 导航
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#334155',
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        headerBackTitle: '返回',
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
          backgroundColor: '#fff',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#334155',
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        headerBackTitle: '返回',
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

// 底部 Tab 导航 - 使用 SafeArea 自动避开系统导航栏
const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f0f4f8',
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -2,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: '搜索',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="FavoriteTab"
        component={FavoriteStack}
        options={{
          title: '生词本',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>📚</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  // 初始化数据库
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer navigationInChildEnabled>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
