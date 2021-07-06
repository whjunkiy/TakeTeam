import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {List, ListItem, Text, Container, Input} from 'native-base';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl, Modal, TextInput
} from 'react-native';
import store from '../redux/store';
import Header from '../components/Header';
import Bottom from "../components/Bottom";
const { width, height } = Dimensions.get('screen');

export default function MyColrPicker({setClr}) {
    let nCstate = store.getState();
    let maxWidth = width;
    if (width > 900) {
        maxWidth = 900;
    }
    let mounted = useRef(0);
    let colors = ['white', 'black', 'red', 'green', '#00008b', 'yellow', 'orange', 'blue', 'pink', 'purple', '#1c95d6', 'grey'];

    useEffect(()=> {
        mounted.current = 1;
        store.subscribe(() => {
            if (mounted.current) {
                const state = store.getState();
            }
        });
        return function cleanup() {
            mounted.current = 0;
            store.subscribe(()=>{});
        };
    });
    return (
        <SafeAreaView style={{
            display: 'flex',
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 99999,
            opacity: 1,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
        }}>
            {colors.map((c,i) => {
                return (
                    <TouchableOpacity key={i} style={{margin: 20}} onPress={()=>{setClr(c)}}>
                        <SafeAreaView style={{width: 50, height: 50, backgroundColor: c, borderWidth: 1, borderStyle: 'solid', borderColor: 'white'}}>
                        </SafeAreaView>
                    </TouchableOpacity>
                )
            })}
        </SafeAreaView>
    )
}