'use strict'
import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import Constants from 'expo-constants';

class StatusBarBG extends Component{
    render(){
        return(
            <View style={[styles.statusBarBackground, this.props.style || {}]}>
            </View>
        );
    }
}

let height = 0;
if (Platform.OS === 'ios') height = Constants.statusBarHeight;

const styles = StyleSheet.create({
    statusBarBackground: {
        height: height,
        backgroundColor: "transparent",
    }

})

module.exports= StatusBarBG