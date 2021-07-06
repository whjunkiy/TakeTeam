import React from 'react';
import previewImg from '../assets/prere.png';
import {StyleSheet, Text, View, Image, ImageBackground, Dimensions} from 'react-native';
import store from "../redux/store";
const { width, height } = Dimensions.get('screen');

export default class Preview extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }
    async componentDidMount() {
        this._isMounted = true;
        store.subscribe(() => {

        });
    }

    async componentWillUnmount() {
        this._isMounted = false;
        store.subscribe(() => {});
        return function cleanup() {
            this._isMounted = false;
            store.subscribe(()=>{});
        };
    }

    render() {
        let pw = width;
        let ph = height;
        if (pw > 900) pw = 900;
        if (this._isMounted) {
            return (
                <View style={styles.container}>
                    <Image source={previewImg} style={[styles.image, {width: pw, height: ph}]} />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <Image source={previewImg} style={[styles.image, {width: pw, height: ph}]} />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff0054',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    text: {
        color: "white",
        fontSize: 90,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#000000a0",
        width: '100%',
        fontFamily: 'ProximaNova'
    }
});