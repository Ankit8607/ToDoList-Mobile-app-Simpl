/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

AppRegistry.registerComponent(appName, () => App);
