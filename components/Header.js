import React from 'react';
import {Text, Container} from 'native-base';
import {Platform, StyleSheet} from 'react-native';
import {  Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');
import treyg from '../assets/treyg.png';
import {Image} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler';
import store from "../redux/store";
import {useState, useEffect, useRef} from 'react';
import {setMainView} from '../redux/actions';

export default function Header() {
    let nCstate = store.getState();
    const [view, setView] = useState(nCstate.view.view);
    let sdvig = {podpis: {left: -192, top: 12}, rekom: {left: -82, top: 12}};
    if (width < 900) {
        sdvig = {podpis: {left: -127, top: 12}, rekom: {left: -58, top: 12}};
    }
    const [logined, setLoaded] = useState(nCstate.login.status);
    let mounted = useRef(0);


    useEffect(()=> {
        mounted.current = 1;
        store.subscribe(() => {
            if (mounted.current) {
                nCstate = store.getState();
                if (nCstate.login.status !== logined) {
                    setLoaded(nCstate.login.status);
                }
                if (view !== nCstate.view.view) {
                    setView(nCstate.view.view);
                }
            }
        });
        return function cleanup() {
            mounted.current = 0;
            store.subscribe(()=>{});
        };
    });

    const tShow = (v) => {
        if (mounted.current) {
            store.dispatch(setMainView(v));
            store.dispatch({type: "REFRESHEVENTS"});
            //this.navi.navigate('MainList', {title: 'Главная'});
        }
    }

    let fs = 16, HH = 50;
    if (width < 900) {
        fs = 12;
        HH = Math.ceil(HH * width / 900);
    }
    if (HH < 30) HH = 30;
    let c1 = '#cacaca', c2 = '#cacaca';
    if (view === 'rekom') {
        c2 = '#000';
        c1 = '#cacaca';
    } else {
        c2 = '#cacaca';
        c1 = '#000';
    }
    if (Platform.OS === 'ios') {
        fs += 2;
    }

    if (logined < 1 ) {
        return (
            <Container style={[styles.header, {height: HH, maxHeight: HH, minHeight: HH, flexDirection: "row"}]}>
                <Text style={[styles.baseText, {fontSize: fs, fontFamily: 'ProximaNova'}]}>всякие события</Text>
            </Container>
        )
    } else {
        return (
            <Container style={[styles.header, {height: HH, maxHeight: HH, minHeight: HH, flexDirection: "row"}]}>
                <TouchableOpacity onPress={()=>{tShow('podpis')}}>
                    <Text style={[styles.baseText, {fontSize: fs, fontFamily: 'ProximaNova', color: c1}]}>подписки</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{tShow('rekom')}}>
                    <Text style={[styles.innerText, {fontSize: fs, fontFamily: 'ProximaNova', color: c2}]}>  рекомендации</Text>
                </TouchableOpacity>
                <Image source={treyg} style={[styles.treyg, sdvig[view]]}/>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        maxHeight: 40,
        minHeight: 40,
        height: 40,
        paddingTop: 0,
        width: '100%',
        alignContent: "center",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: 'nowrap',
        textTransform: 'uppercase'
    },
    baseText: {
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Tahoma'
    },
    innerText: {
        fontWeight: 'bold',
        color: '#cacaca',
        fontFamily: 'Tahoma'
    },
    treyg: {
        width: 10,
        height: 10,
        position: 'relative'
    }
});