import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigator from './navigation';
import Preview from './components/Preview';
import store from './redux/store';
import {checkLogin, getNewEvents, getMyEvents, saveET, logout, refreshMyInfo} from './redux/actions';
import $ from "jquery";
import {useFonts} from "expo-font";
import Constants from "expo-constants";
import * as Linking from 'expo-linking';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [loaded, setLoaded] = useState(0);
  let fnts = {
    'ProximaNova': require('./assets/ProximaNova.otf')
  };
  
    fnts['Tahoma'] = require('./assets/tahoma.ttf');
    fnts['TahomaBold'] = require('./assets/tahomabd.ttf');
  const getUrl = async () => {
    let info = await Linking.getInitialURL()
    let regexp = /post=(.+)/i;
    let gg = info.match(regexp);
    if (gg) {
      let pid = gg[1];
      store.dispatch({type: 'PAGE', page: 'singlePost', pid: pid});
    }
  }
  getUrl();
  let [fontsLoaded] = useFonts(fnts);
  let mounted = useRef(0);
  let loginFlag = 0;
  let pageFlag = 0;
  let ALloaded = 0;
  //store.dispatch(logout());

  let myIntId = setInterval(()=>{
    let state = store.getState();
    if (state.login.status > 0) {
      store.dispatch(refreshMyInfo(state.login.email, state.login.token, state.login.info));
    }
  }, 5000);

  useEffect(()=> {
    mounted.current = 1;
    //saveET('','','');
    //store.dispatch(logout());

    store.dispatch(checkLogin());

    setTimeout(()=>{
      if (!loaded) {
        let state = store.getState();
        if (state.login.status < 1) {
          if (!pageFlag) {
            store.dispatch(getNewEvents());
          }
        } else {
          if (!pageFlag) {
            store.dispatch(getMyEvents(state.login.email, state.login.token));
          }
        }
      }
    }, 100);

    return function cleanup() {
      mounted.current = 0;
      clearTimeout(myIntId);
      store.subscribe(()=>{});
    };
  });

  store.subscribe(() => {
    if (mounted.current && !loaded) {
      const state = store.getState();
      if (state.login.status > -2 && !loginFlag) {
        loginFlag = 1;
      }
      if (state.data.status > 0) {
        pageFlag = 1;
      }
      if (loginFlag && pageFlag && fontsLoaded && mounted.current && !loaded && !ALloaded) {
        if (!loaded) {
          console.log("All loaded");
          ALloaded = 1;
          setLoaded(1);
          console.log("setLoaded = 1");
        }
      }
    }
  });

  if (loaded) {
    return (
      <SafeAreaProvider>
          <Navigator/>
      </SafeAreaProvider>
    );
  } else {
    return (
       <Preview/>
    );
  }

}