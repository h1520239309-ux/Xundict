// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 支持直接 import JSON 文件
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'json'
);
config.resolver.sourceExts.push('json');

module.exports = config;
