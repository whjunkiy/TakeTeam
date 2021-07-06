import React, {useEffect, useRef, useState} from 'react';
import {Text, Container} from 'native-base';
import {StyleSheet, SafeAreaView} from 'react-native';
import {Image} from "react-native";
import {View} from "react-native";
import homa from '../assets/home.png';
import lupa from '../assets/lupa.png';
import sms from '../assets/sms.png';
import profile from '../assets/profile.png';
import plus from '../assets/plus.png';
import {  Dimensions, TouchableHighlight } from 'react-native';
import store from "../redux/store";
import {TouchableOpacity} from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('screen');

export default function Bottom({navigate}) {
    let nCstate = store.getState();
    const [logined, setLoaded] = useState(nCstate.login.status);
    const [rnd, setRnd] = useState(0);
    let mounted = useRef(0);

    if (mounted.current) {
        store.subscribe(() => {
            if (mounted.current) {
                nCstate = store.getState();
                if (nCstate.login.status !== logined) {
                    setLoaded(nCstate.login.status);
                }
            }
        });
    }

    useEffect(()=> {
        mounted.current = 1;
        if (!rnd) {setRnd(Math.random());}
        return () => {
            mounted.current = 0;
            store.subscribe(()=>{});
        };
    });

    let dm = 50;
    let mb = 20;
    let pw1 = 50;
    let ph1 = 50;
    let pw2 = 95;
    let ph2 = 95;
    let mh = 120;
    let coef = width / 900;
    if (width < 900) {
        mb = 5;
        pw1 = pw1 * coef;
        ph1 = ph1 * coef;
        pw2 = pw2 * coef+3;
        ph2 = ph2 * coef+3;
        dm = 15;
        mh = 70;
    }
    if (mounted.current) {
        return (
            <SafeAreaView style={[styles.bottom, {height: mh, maxHeight: mh}]}>
                <SafeAreaView style={[styles.bottom, {height: mh, maxHeight: mh, maxWidth: 900}]}>
                    <TouchableOpacity onPress={() => {
                        store.dispatch({type: "REFRESHEVENTS"});
                        navigate('MainList', {title: 'Главная'})
                    }}>
                        {mounted.current ? <Image source={homa} style={{width: pw1, height: ph1, marginBottom: mb}}/> : ''}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigate('search', {title: 'Поиск'})
                    }}>
                        <Image source={lupa}
                               style={{width: pw1, height: ph1, marginLeft: dm, marginBottom: mb}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (logined > 0) {
                            navigate('createEvent', {title: 'Создание события'})
                        } else {
                            navigate('authing', {title: 'Авторизация'})
                        }
                    }}>
                        <Image source={plus}
                               style={{width: pw2, height: ph2, marginLeft: dm, resizeMode: 'stretch', marginBottom: mb}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (logined > 0) {
                            navigate('messages', {title: 'Сообщения'})
                        } else {
                            navigate('authing', {title: 'Авторизация'})
                        }
                    }}>
                        <Image source={sms}
                               style={{width: pw1, height: ph1, marginLeft: dm + 5, marginBottom: mb}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{position: 'relative', zIndex: 9999}} onPress={() => {
                        if (logined > 0) {
                            store.dispatch({type:"SETPROFILE", mail: nCstate.login.email, whom: 1});
                            navigate('profile', {title: 'Профиль', email: nCstate.login.email, whom: 1});
                        } else {
                            navigate('authing', {title: 'Авторизация'})
                        }
                    }}>
                        <Image source={profile}
                               style={{width: pw1, height: ph1, marginLeft: dm, marginBottom: mb}}/>
                    </TouchableOpacity>
                </SafeAreaView>
            </SafeAreaView>
        )
    } else {
        return (
            <SafeAreaView>
                <Text>
                Loading...
                </Text>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        maxHeight: 120,
        height: 120,
        backgroundColor: '#ededed',
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-around"
    }
});