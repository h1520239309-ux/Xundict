/**
 * 数据库封装
 * 两张表：历史记录 + 生词本
 * 自动适配：原生环境用 SQLite，Web 环境用 localStorage
 */

import { Platform } from 'react-native';

let db = null;
let isWeb = Platform.OS === 'web';

// ========== Web 端 localStorage 实现 ==========
const webStorage = {
  getHistory: () => {
    try {
      const data = localStorage.getItem('xun_history');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveHistory: (list) => {
    localStorage.setItem('xun_history', JSON.stringify(list.slice(0, 20)));
  },
  getFavorites: () => {
    try {
      const data = localStorage.getItem('xun_favorites');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveFavorites: (list) => {
    localStorage.setItem('xun_favorites', JSON.stringify(list));
  }
};

// ========== 初始化 ==========
export const initDatabase = async () => {
  if (isWeb) {
    console.log('✅ Web 环境：使用 localStorage');
    return;
  }

  try {
    const SQLite = await import('expo-sqlite');
    db = SQLite.openDatabaseSync('xun_dict.db');

    // 历史记录表
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL UNIQUE,
        search_time INTEGER NOT NULL
      );
    `);

    // 生词本表
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL UNIQUE,
        add_time INTEGER NOT NULL
      );
    `);

    console.log('✅ 数据库初始化成功 (SQLite)');
  } catch (error) {
    console.log('❌ 数据库初始化失败:', error);
    isWeb = true; // 降级到 Web 模式
  }
};

// ========== 历史记录相关 ==========

export const addHistory = async (word) => {
  if (isWeb) {
    const list = webStorage.getHistory().filter(w => w !== word);
    list.unshift(word);
    webStorage.saveHistory(list);
    return;
  }

  try {
    const now = Date.now();
    await db.runAsync(
      'INSERT OR REPLACE INTO history (word, search_time) VALUES (?, ?)',
      [word, now]
    );
  } catch (error) {
    console.log('添加历史记录失败:', error);
  }
};

export const getHistory = async () => {
  if (isWeb) {
    return webStorage.getHistory();
  }

  try {
    const result = await db.getAllAsync(
      'SELECT word FROM history ORDER BY search_time DESC LIMIT 20'
    );
    return result.map(item => item.word);
  } catch (error) {
    console.log('获取历史记录失败:', error);
    return [];
  }
};

export const clearHistory = async () => {
  if (isWeb) {
    webStorage.saveHistory([]);
    return;
  }

  try {
    await db.runAsync('DELETE FROM history');
  } catch (error) {
    console.log('清空历史记录失败:', error);
  }
};

// ========== 生词本相关 ==========

export const addFavorite = async (word) => {
  if (isWeb) {
    const list = webStorage.getFavorites();
    if (!list.includes(word)) {
      list.unshift(word);
      webStorage.saveFavorites(list);
    }
    return true;
  }

  try {
    const now = Date.now();
    await db.runAsync(
      'INSERT OR IGNORE INTO favorites (word, add_time) VALUES (?, ?)',
      [word, now]
    );
    return true;
  } catch (error) {
    console.log('添加生词失败:', error);
    return false;
  }
};

export const removeFavorite = async (word) => {
  if (isWeb) {
    const list = webStorage.getFavorites().filter(w => w !== word);
    webStorage.saveFavorites(list);
    return true;
  }

  try {
    await db.runAsync('DELETE FROM favorites WHERE word = ?', [word]);
    return true;
  } catch (error) {
    console.log('移除生词失败:', error);
    return false;
  }
};

export const isFavorite = async (word) => {
  if (isWeb) {
    return webStorage.getFavorites().includes(word);
  }

  try {
    const result = await db.getFirstAsync(
      'SELECT 1 FROM favorites WHERE word = ?',
      [word]
    );
    return !!result;
  } catch (error) {
    console.log('检查收藏状态失败:', error);
    return false;
  }
};

export const getFavorites = async () => {
  if (isWeb) {
    return webStorage.getFavorites();
  }

  try {
    const result = await db.getAllAsync(
      'SELECT word FROM favorites ORDER BY add_time DESC'
    );
    return result.map(item => item.word);
  } catch (error) {
    console.log('获取生词本失败:', error);
    return [];
  }
};

export default { isWeb };
