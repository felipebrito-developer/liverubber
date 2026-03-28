/**
 * Web entry point for LiveRubber — React Native Web
 * Webpack resolves this as the main entry instead of index.js
 */

// Global environment shims for web stabilization
if (typeof __DEV__ === 'undefined') {
  // @ts-ignore
  globalThis.__DEV__ = process.env.NODE_ENV !== 'production';
}

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import App from './src/App';

AppRegistry.registerComponent('LiveRubber', () => App);

const rootElement = document.getElementById('root');
if (rootElement) {
  AppRegistry.runApplication('LiveRubber', {
    rootTag: rootElement,
    initialProps: {},
  });
}
