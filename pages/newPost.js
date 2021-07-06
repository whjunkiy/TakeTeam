import React from "react";
import store from '../redux/store';
import {getCreatedEvents} from "../redux/actions";
import {View} from "react-native";

export default class newPost extends React.Component {
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
        return (
            <View></View>
        )
    }
}