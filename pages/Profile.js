import React, { Component } from 'react';
import {Container, Header, Content, Form, Item, Input, Button, Text, Title, Toast, Icon} from 'native-base';
import {
    ActivityIndicator,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    SafeAreaView,
    Modal, TextInput, Platform
} from 'react-native';
import store from '../redux/store';
import Bottom from "../components/Bottom";
import {Image} from "react-native";
import l_arrow from "../assets/l_arrow.png";
import r_arrow from "../assets/r_arrow.png";
import bigava from "../assets/defava.png";
import koleso from "../assets/koleso.png";
import ppl from "../assets/ppl.png";
import karandaw from "../assets/karandaw.png";
import treyg2 from "../assets/gtr.png";
const { width, height } = Dimensions.get('screen');
import ta1 from "../assets/ta1.png";
import ta2 from "../assets/ta2.png";
import ta3 from "../assets/ta3.png";
import ta4 from "../assets/ta4.png";
import ta5 from "../assets/pa5.png";
import ta6 from "../assets/ta6.png";
import sub from "../assets/sub.png";
import lologo from '../assets/lologo.png';
import sms from "../assets/sendsms.png";
import krst from '../assets/x.png';
import zamokM from '../assets/zamokM.png';
import zamokB from '../assets/zamokB.png';
import preview from '../assets/preview.png';
import {saveProfile, saveAvatar, getCreatedEvents, getUzerInfo, sendSMS, subFor, unSub} from "../redux/actions";
//import DocumentPicker from 'react-native-document-picker';
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import {USERINFO} from "../redux/types";
import * as Permissions from 'expo-permissions';
import StatusBarBG from "../components/StatusBarBG";
import Constants from "expo-constants";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.nCstate = store.getState();
        this.pm = this.nCstate.profile.mail;
        this.maxWidth = width;
        if (width > 900) {
            this.maxWidth = 900;
        }
        this.maxHeight = height - 400;
        if (width < 900) {
            this.maxHeight = height;
        }
        this.navi = this.props.navigation;
        this._isMounted = false;
        this.inpref = null;
        this.whom = this.navi.getParam('whom');
        this.makeShit1();
        let v = 'calendar';
        if (!this.whom) v = 'myevents';
        this.state={
            avarnd: this.nCstate.ava.rnd,
            nick: this.nick,
            status: 0,
            city: this.city,
            osebe: this.osebe,
            avatarka: this.avatarka,
            view: v,
            pics: this.pics,
            editing: 0,
            pm: this.pm,
            file: null,
            isLoading: true,
            modalVisible: false,
            smsText: '',
            searchPpl: false,
            pplsearchinp: '',
            foundppl: [],
            subed: [],
            iamsubed: this.iamsubed,
            uirnd: this.nCstate.uzerInfo.status,
            savas: [],
            private: false,
            viewSettings: false,
            pmail: '',
            psubs: [],
            sr: []
        };
        this.setViewEvents = this.setViewEvents.bind(this);
        this.editMe = this.editMe.bind(this);
        this.subs = this.subs.bind(this);
        this.ppl = this.ppl.bind(this);
        this.sendsms = this.sendsms.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.changeAva = this.changeAva.bind(this);
        this.searchPpl = this.searchPpl.bind(this);
        this.getAva = this.getAva.bind(this);
        this.wws = this.wws.bind(this);
        this.unsub = this.unsub.bind(this);
        this.goTo = this.goTo.bind(this);
        this.showSettings = this.showSettings.bind(this);
        this.getOsebe = this.getOsebe.bind(this);
        this.getEven = this.getEven.bind(this);
        this.getFlag = this.getFlag.bind(this);
        this.checkWTF = this.checkWTF.bind(this);
        this.makeShit1 = this.makeShit1.bind(this);
        this.checkMultiPermissions = this.checkMultiPermissions.bind(this);
    }
    makeShit1(){
        this.nCstate = store.getState();
        if (this.nCstate.login.status < 1) {
            this.whom = 0;
        } else if (this.nCstate.login.status > 0 && this.navi.getParam('email') !== this.nCstate.login.email) {
            this.whom = 0;
        }
        this.nick = '';
        this.refas = {};
        this.imgRef = null;
        this.refas['nick'] = React.createRef();
        this.refas['city'] = React.createRef();
        this.refas['osebe'] = React.createRef();
        this.osebe = '';
        this.city = '';
        this.avatarka = bigava;
        this.coef = width / 900;
        this.sdvig = {
            calendar: {
                top: 15,
                left: -300
            },
            myevents: {
                top: 15,
                left: -82
            }
        };
        let asd = Math.ceil(this.maxWidth / 3) * -1;
        if (asd > -200) asd = -200;
        if (width < 900) {
            this.sdvig = {
                calendar: {
                    top: 10,
                    left: asd
                },
                myevents: {
                    top: 10,
                    left: -52
                }
            };
        }
        this.tc = {
            calendar: {
                f: {color: '#000'},
                s: {color: '#868686'}
            },
            myevents: {
                f: {color: '#868686'},
                s: {color: '#000'}
            }
        }
        this.ph = height - 360;
        this.email = this.nCstate.login.email;
        if (this.whom) {
            this.nick = 'Имя не установлено';
            this.osebe = 'О себе';
            this.city = 'Город';
            if (this.nCstate.login.hasOwnProperty('info')) {
                if (this.nCstate.login.info.hasOwnProperty('nick')) {
                    this.nick = this.nCstate.login.info.nick;
                }
                if (this.nCstate.login.info.hasOwnProperty('osebe')) {
                    this.osebe = this.nCstate.login.info.osebe;
                }
                if (this.nCstate.login.info.hasOwnProperty('ava')) {
                    this.avatarka = {uri: 'https://taketeam.net/avas/' + this.nCstate.login.info.ava};
                }
                if (this.nCstate.login.info.hasOwnProperty('city')) {
                    this.city = this.nCstate.login.info.city;
                }
            }
        } else {
            this.email = this.navi.getParam('email');
            this.nick = '...';
            this.osebe = '...';
            this.city = '...';
            this.avatarka = bigava;
            this.sdvig.calendar.left = -180;
        }
        this.iamsubed = 0;
        this.subed= [];
        if (this.nCstate.login.hasOwnProperty('info')) {
            if (this.nCstate.login.info.hasOwnProperty('subed')) {
                this.subed = this.nCstate.login.info.subed;
            }
        }
        for (let i in this.subed) {
            if (this.subed[i] === this.email) {
                this.iamsubed = 1;
            }
        }
        this.pics = {
            calendar: [
                {href: '', src: ta1},
                {href: '', src: ta2},
                {href: '', src: ta3},
                {href: '', src: ta4},
                {href: '', src: ta5},
                {href: '', src: ta6},
            ],
            myevents: [
                {href: '', src: ta6},
                {href: '', src: ta5},
                {href: '', src: ta4},
                {href: '', src: ta3},
                {href: '', src: ta2},
                {href: '', src: ta1},
            ],
        }
    }
    getFlag() {
        let flag = 1;
        const state = store.getState();
        if (this.whom === 0 && state.login.status < 1 && this.state.private) {
            flag = 0;
        } else if (this.whom === 0 && state.login.status > 0 && this.state.private) {
            let subed = [];
            if (state.login.info.hasOwnProperty('subed')) {
                subed = state.login.info.subed;
            }
            let flag2 = 0;
            for (let i in subed) {
                if (subed[i] === state.profile.mail) {
                    flag2 = 1;
                }
            }
            if (!flag2) {flag = 0;}
        }
        //return 0;
        return flag;
    }
    checkWTF() {
        const state = store.getState();
        if (state.uzerInfo.status === -1) {
            //this.navi.navigate('MainList', {title: 'Главная'});
            //store.dispatch({type:"SETPROFILE", mail: state.login.email, whom: 1});
            //store.dispatch({type: USERINFO, info: {}, status: 0});
            this.navi.navigate('MainList', {title: 'Главная'});
            //this.setState({isLoading: false})
            return;
        }
        if (this.whom) {
            if (state.myevents.status) {
                this.setState({
                    pics: {
                        calendar: state.myevents.events.igo,
                        myevents: state.myevents.events.imade
                    }
                })
            }
            if (state.login.info.hasOwnProperty('ava')) {
                if (state.login.info.ava) {
                    let au = 'https://taketeam.net/avas/' + state.login.info.ava;
                    if (this.state.avatarka.uri !== au || this.avarnd !== state.ava.rnd) {
                        this.setState({avarnd: state.ava.rnd, avatarka: {uri: au}});
                        //this.navi.navigate('profile', { title: 'Профиль', email: state.login.email, whom: 1 });
                    }
                }
            }
            let nick = '...';
            let ava = bigava;
            let city = '...';
            let osebe = '...';
            let priva = false;
            let sr = [];
            if (state.login.info.hasOwnProperty('nick')) {
                nick = state.login.info.nick;
            }
            if (state.login.info.hasOwnProperty('sr')) {
                sr = state.login.info.sr;
            }
            if (state.login.info.hasOwnProperty('city')) {
                city = state.login.info.city;
            }
            if (state.login.info.hasOwnProperty('osebe')) {
                osebe = state.login.info.osebe;
            }
            if (state.login.info.hasOwnProperty('ava')) {
                ava = {uri: 'https://taketeam.net/avas/' + state.login.info.ava};
            }
            if (state.login.info.hasOwnProperty('private')) {
                priva = state.login.info.private;
            }
            this.setState({
                avatarka: ava,
                nick: nick,
                osebe: osebe,
                city: city,
                private: priva,
                pmail: state.login.info.email,
                sr: sr
            });
        } else {
            if (state.uzerInfo.status !== this.state.status && state.uzerInfo.status > 0) {
                let nick = '...';
                let ava = bigava;
                let city = '...';
                let osebe = '...';
                let priva = false;
                let sr = [];
                let pics = {
                    calendar: state.uzerInfo.info.togo,
                    myevents: state.uzerInfo.info.org
                };
                if (state.uzerInfo.info.uzr.hasOwnProperty('nick')) {
                    nick = state.uzerInfo.info.uzr.nick;
                }
                if (state.uzerInfo.info.uzr.hasOwnProperty('subreqs')) {
                    sr = state.uzerInfo.info.uzr.subreqs;
                }
                if (state.uzerInfo.info.uzr.hasOwnProperty('city')) {
                    city = state.uzerInfo.info.uzr.city;
                }
                if (state.uzerInfo.info.uzr.hasOwnProperty('osebe')) {
                    osebe = state.uzerInfo.info.uzr.osebe;
                }
                if (state.uzerInfo.info.uzr.hasOwnProperty('ava')) {
                    ava = {uri: 'https://taketeam.net/avas/' + state.uzerInfo.info.uzr.ava};
                }
                if (state.uzerInfo.info.uzr.hasOwnProperty('private')) {
                    priva = state.uzerInfo.info.uzr.private;
                }
                this.setState({
                    avatarka: ava,
                    nick: nick,
                    osebe: osebe,
                    city: city,
                    pics: pics,
                    private: priva,
                    pmail: state.uzerInfo.info.email,
                    sr: sr
                });
            }
        }
    }
    getEven(){
        let MT = 20, h = 50, fs = 20, ML = 0;
        if (width < 900) {
            MT = Math.ceil(MT * this.coef);
            h = 40;
            fs = Math.ceil(fs * this.coef);
            ML = 30;
        }
        if (fs < 12) fs = 12;
        if (this.getFlag()) {
            return (
                <SafeAreaView style={{width: '100%'}}>
                    <SafeAreaView style={{
                        width: '100%',
                        height: h,
                        backgroundColor: '#ededed',
                        flexDirection: "row",
                        marginTop: MT,
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: 'nowrap'
                    }}>
                        <TouchableOpacity onPress={() => {
                            this.setViewEvents('calendar')
                        }}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: fs,
                                marginLeft: ML,
                                textTransform: 'uppercase',
                                fontFamily: 'ProximaNova',
                                color: this.tc[this.state.view]['f']['color']
                            }}>{this.whom ? 'календарь' : 'участник'}</Text>
                        </TouchableOpacity>
                        <SafeAreaView style={{
                            width: 2,
                            height: 30,
                            backgroundColor: '#ff0068',
                            marginLeft: 30
                        }}></SafeAreaView>
                        <TouchableOpacity onPress={() => {
                            this.setViewEvents('myevents')
                        }}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: fs,
                                textTransform: 'uppercase',
                                color: this.tc[this.state.view]['s']['color'],
                                marginLeft: 30,
                                fontFamily: 'ProximaNova'
                            }}>{this.whom ? 'мои события' : 'организатор'}</Text>
                        </TouchableOpacity>
                        <Image source={treyg2} style={[styles.treyg, this.sdvig[this.state.view]]}/>
                    </SafeAreaView>
                    <SafeAreaView style={{width: '100%', height: '100%'}}>
                        <SafeAreaView style={{
                            display: 'flex',
                            height: '100%',
                            width: '100%',
                            alignContent: "flex-start",
                            flex: 1,
                            flexWrap: 'wrap',
                            justifyContent: "center",
                            alignItems: "flex-start",
                            flexDirection: "row"
                        }}>
                            {
                                this.state.pics[this.state.view].map((item, indx) => {
                                    if (item.hasOwnProperty('cansee')) {
                                        if (!this.whom && item.cansee !== 1) {
                                            let subed = [];
                                            if (this.nCstate.login.info.hasOwnProperty('subed')) subed = this.nCstate.login.info.subed;
                                            if (subed.indexOf(item.uzr) === -1) {
                                                return null;
                                            }
                                        }
                                    }
                                    let src = preview;
                                    let np = '';
                                    let clr = 'black';
                                    let bgclr = 'transparent';
                                    if (item.hasOwnProperty('pics')) {
                                        if (item['pics'][0] !== 'preview') {
                                            src = {uri: 'https://taketeam.net/posters/' + item['pics'][0]['uri']}
                                        }
                                    }
                                    if (item.hasOwnProperty('nadpisi')) {
                                        if (item['nadpisi']) {
                                            if (item['nadpisi'][0]) {
                                                np = item['nadpisi'][0];
                                            }
                                        }
                                    }
                                    let nadpFS = 22;
                                    if (item.hasOwnProperty('nadpFS')){
                                        nadpFS = item.nadpFS[0];
                                    }
                                    if (nadpFS > 30) nadpFS = 30;
                                    let hrf = '';
                                    let hrinfo = {};
                                    if (this.state.view === 'calendar' || !this.whom) {
                                        hrf = 'singlePost';
                                        hrinfo = {title: 'Событие', pid: item['_id']};
                                    } else {
                                        hrf = 'editPost';
                                        hrinfo = {title: 'Событие', pid: item['_id']};
                                    }
                                    if (np) {
                                        if (item.hasOwnProperty('ndpClr')) {
                                            if (item.ndpClr[0]) clr = item.ndpClr[0];
                                        }
                                        if (item.hasOwnProperty('ndpBClr')) {
                                            if (item.ndpBClr[0]) bgclr = item.ndpBClr[0];
                                        }
                                    }
                                    let chrds = {};
                                    if (item.hasOwnProperty('chrds')) {
                                        if (item.chrds[0]) {
                                            if (item.chrds[0].x !== -1) {
                                                chrds['left'] = item.chrds[0].x * 100;
                                                if (chrds['left'] > (100 * 0.95)) {
                                                    chrds['left'] = 100 * 0.95;
                                                }
                                                if (chrds['left'] < (100 * 0.1)) {
                                                    chrds['left'] = 100 * 0.1;
                                                }
                                            }
                                            if (item.chrds[0].y !== -1) {
                                                chrds['top'] = item.chrds[0].y * 100;
                                                if (chrds['top'] > (100 * 0.85)) {
                                                    chrds['top'] = 100 * 0.85;
                                                }
                                                if (chrds['top'] < (100 * 0.1)) {
                                                    chrds['top'] = 100 * 0.1;
                                                }
                                            }
                                            if (item.chrds[0].x !== -1 && item.chrds[0].y !== -1) {
                                                chrds['position'] = 'absolute';
                                                chrds['top'] = chrds['top'] + '%';
                                                chrds['left'] = chrds['left'] + '%';
                                            }
                                        }
                                    }
                                    let rotas = 0;
                                    if (item.hasOwnProperty('rotas')) {
                                        rotas = item.rotas[0];

                                    }

                                    let pwidth = 272;
                                    let pheight = 365;
                                    if (width < 900) {
                                        pwidth = Math.ceil(pwidth * this.coef);
                                        pheight = Math.ceil(pheight * this.coef);
                                        nadpFS = Math.ceil(nadpFS * this.coef);
                                    }
                                    //np = false;
                                    return (
                                        <TouchableOpacity key={indx} style={{margin: 5, width: pwidth-5, height: pheight-7}} onPress={() => {
                                            this.goTo(hrf, hrinfo)
                                        }}>
                                            <Image source={src} style={[styles.afisha, {width: pwidth-5, height: pheight-7}]}/>
                                            {np ?
                                                <SafeAreaView style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    zIndex: 99999,
                                                    alignContent: "center",
                                                    flex: 1,
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    flexWrap: 'nowrap',
                                                    flexDirection: "row"
                                                }}>
                                                    <Text style={[{
                                                        fontWeight: 'bold',
                                                        fontSize: nadpFS,
                                                        color: clr,
                                                        backgroundColor: bgclr,
                                                        fontFamily: 'Tahoma',
                                                        transform: [{"rotate": rotas+'deg'}],
                                                    }, chrds]}>{np}</Text>
                                                </SafeAreaView>
                                                : null}
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </SafeAreaView>
                    </SafeAreaView>
                </SafeAreaView>
            )
        } else return (
            <SafeAreaView style={{marginTop: 10, width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                <SafeAreaView style={{width: '100%', justifyContent: 'center', alignItems: 'center', alignContent: 'center', flexDirection: 'row', backgroundColor: '#cbcbcb'}}>
                    <SafeAreaView style={{maxWidth: this.maxWidth, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                        <Image source={zamokM} style={{width: 61, height: 78, resizeMode: 'cover'}}/>
                        <Text style={{marginLeft: 5, color: 'white', fontFamily:'Tahoma', fontSize: 20}}>Это закрытый аккаунт!<br />Подпишитесь, чтобы видеть обновления)</Text>
                    </SafeAreaView>
                </SafeAreaView>
                <SafeAreaView>
                    <Image source={zamokB} style={{marginTop: 10, width: this.maxWidth, height: this.maxWidth * 1.24, resizeMode: 'stretch'}}/>
                </SafeAreaView>
            </SafeAreaView>
        )
    }
    getOsebe() {
        let MT = 20, fs = 24, ih = 50;
        if (width < 900) {
            MT = Math.ceil(MT * this.coef);
            fs = Math.ceil(fs * this.coef);
            ih = Math.ceil(ih * this.coef);
        }
        if (fs < 15) fs = 15;
        if (MT < 15) MT = 15;
        if (this.getFlag()) {
            return (
                <SafeAreaView style={{marginTop: MT, marginBottom: MT}}>
                    {this.state.editing ?
                        <Input
                            placeholder="О себе"
                            ref={this.refas['osebe']}
                            value={this.state.osebe}
                            style={{
                                minWidth: this.maxWidth - 10,
                                minHeight: 30,
                                maxHeight: 30,
                                borderWidth: 1,
                                borderColor: '#bbbbbb',
                                borderStyle: 'solid',
                                borderRadius: 4,
                                backgroundColor: '#fafafa'
                            }}
                            onChange={e => this.setState({osebe: e.nativeEvent.text})}/>
                        :
                        <Text style={{fontSize: fs, fontFamily: 'Tahoma'}}>{this.state.osebe}</Text>
                    }
                </SafeAreaView>
            )
        } else return (
            <SafeAreaView style={{marginTop: MT, marginBottom: MT}}>
                {this.state.editing ?
                    <Input
                        placeholder="О себе"
                        ref={this.refas['osebe']}
                        value={this.state.osebe}
                        style={{
                            minWidth: this.maxWidth - 10,
                            minHeight: 30,
                            maxHeight: 30,
                            borderWidth: 1,
                            borderColor: '#bbbbbb',
                            borderStyle: 'solid',
                            borderRadius: 4,
                            backgroundColor: '#fafafa'
                        }}
                        onChange={e => this.setState({osebe: e.nativeEvent.text})}/>
                    :
                    <Text style={{fontSize: fs, fontFamily: 'Tahoma'}}>{this.state.osebe}</Text>
                }
            </SafeAreaView>
        )
    }
    showSettings(){
        this.navi.navigate('settings', {title: 'Настройки'});
    }
    goTo(hrf, hrinfo) {
        this.navi.navigate(hrf, hrinfo);
    }
    unsub() {
        store.dispatch(unSub(this.nCstate.login.email, this.nCstate.login.token, this.email));
        let sr = [];
        for (let i in this.state.sr) {
            if (this.state.sr[i] !== this.nCstate.login.email) {
                sr.push(this.state.sr[i]);
            }
        }
        this.setState({iamsubed: 0, sr: sr});
    }

    wws(){
        const state = store.getState();
        let w = 187, w2 = 187;
        let h = 64;
        if (width < 900) {
            w = 114;
            w2 = 120;
            h = 35;
        }
        if (state.login.status < 1) {
            return (
                <TouchableOpacity onPress={()=>{this.navi.navigate('authing', {title: 'Авторизация'})}}>
                    <Image source={sub} style={{width: w2, height: h-1, resizeMode: 'stretch', borderRadius: 5, marginLeft: -6}}/>
                </TouchableOpacity>
            )
        }
        let insr = false;
        for (let i in this.state.sr) {
            if (this.state.sr[i] === state.login.email) {
                insr = true;
            }
        }
        if (!this.state.iamsubed && !insr) {
            return (
                <TouchableOpacity onPress={() => {
                    this.subs()
                }}>
                    <Image source={sub} style={{width: w2, height: h-1, resizeMode: 'stretch', borderRadius: 5, marginLeft: -6}}/>
                </TouchableOpacity>
            )
        } else {
            let fs = 29, pt = 15, mt = 4;
            if (width < 900) {
                fs = 13;
                pt = 8;
                mt = 2;
            }
            return (
                <TouchableOpacity onPress={() => {
                    this.unsub()
                }}>
                    <SafeAreaView style={{width: w, backgroundColor: '#868686', height: h-4, maxHeight: h-4, borderRadius: 5,
                        marginTop: mt, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                        <Text style={{ color: 'white',
                             textTransform: 'uppercase', fontWeight: 'bold', fontSize: fs,
                            fontFamily: 'ProximaNova'
                        }}>Отписка</Text>
                    </SafeAreaView>
                </TouchableOpacity>
            )
        }
    }
    async searchPpl() {
        //this.setState({isLoading: true});
        const s = this.state.pplsearchinp;
        if (!s.trim()) return null;
        let q = {
            s: s,
            act: 'findPpl'
        };
        let response = await fetch('https://taketeam.net', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(q)
        });
        let result = await response.json();
        this.setState({foundppl: result});
    }
    sendMessage() {
        store.dispatch(sendSMS(this.nCstate.login.email, this.nCstate.login.token, this.email, this.state.smsText));
        this.setState({modalVisible: false, smsText: ''});
    }
    ppl() {
        //this.navi.navigate('profile2', {whom: 0, email: 'wh.junkiy@gmail.com'});
        const state = store.getState();
        let iam = '';
        if (state.login.hasOwnProperty('email')) iam = state.login.email;
        store.dispatch(getUzerInfo(state.login.email, iam));
        let subed = [];
        if (state.login.info.hasOwnProperty('subed')) {
            subed = state.login.info.subed;
        }
        /*for (let i in subed) {
            this.getAva(subed[i]);
        }*/
        if (subed.length) this.getAva(subed);
        this.setState({searchPpl: true, subed: subed});
    }

    async getAva(subed) {
        let q = {
            emails: subed,
            act: 'getAva'
        };
        let response = await fetch('https://taketeam.net/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(q)
        });
        let r = await response.json();
        //let result = await response.json();
        let savas = this.state.savas;
        for (let i in r.info){
            savas[ r.info[i]['uzr'] ] = {};
            if (r.info[i]['ava'] === 'bigava') {
                savas[ r.info[i]['uzr'] ]['ava'] = bigava;
            } else {
                savas[ r.info[i]['uzr'] ]['ava'] = r.info[i]['ava'];
            }
            savas[ r.info[i]['uzr'] ]['nick'] = r.info[i]['nick'];
        }
        /*if (result === 'bigava') {
            savas[email] = bigava;
        } else {
            savas[email] = result;
        }*/
        this.setState({savas: savas});
    }
    subs() {
        const state = store.getState();
        if (state.login.status < 1) {
            this.navi.navigate('authing', { title: 'Авторизация' });
        } else {
            store.dispatch(subFor(state.login.email, state.login.token, this.email));
            this.setState({iamsubed: 1});
        }
    }
    sendsms() {
        const state = store.getState();
        if (state.login.status < 1) {
            this.navi.navigate('authing', { title: 'Авторизация' });
        } else {
            this.setState({modalVisible: true});
        }
    }
    setViewEvents(v) {
        this.setState({view: v});
    }
    editMe() {
        if (this._isMounted) {
            if (this.state.editing) {
                store.dispatch(saveProfile(this.nCstate.login.email, this.nCstate.login.token, this.state.city, this.state.osebe, this.state.nick));
            }
            this.setState({editing: !this.state.editing});
        }
    }

    async checkMultiPermissions() {
        const { status, expires, permissions } = await Permissions.getAsync(
            Permissions.MEDIA_LIBRARY
        );
        if (status !== 'granted') {
            const { status3, permissions3 } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
            if (status3 !== 'granted') {
                return 0;
            }
        }
        return 1;
    }

    async changeAva() {
        if (this._isMounted) {
            if (this.state.editing) {
                let perms = await this.checkMultiPermissions();
                if (!perms) {
                    return;
                }
                try {
                    let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1],
                        quality: 1,
                        base64: true
                    });
                    if (!result.cancelled) {
                        let localUri = result.uri;
                        if (Platform.OS !== 'web') {
                            localUri = 'data:image/jpeg;base64,'+ result['base64'];
                        }
                        let match = localUri.match(/data:image\/(\w+)/i);
                        store.dispatch(saveAvatar(this.nCstate.login.email, this.nCstate.login.token, {uri: result.uri, type: match[1]}));
                    }
                } catch (err) {
                    let obj = await ImagePicker.getPendingResultAsync();
                    if (obj.length) {
                        if (obj[0].hasOwnProperty('cancelled') && !obj[0]['cancelled']) {
                            let localUri = 'data:image/jpeg;base64,'+ obj[0]['base64'];
                            let match = localUri.match(/data:image\/(\w+)/i);
                            store.dispatch(saveAvatar(this.nCstate.login.email, this.nCstate.login.token, {
                                uri: obj[0].uri,
                                type: match[1]
                            }));
                        }
                    } else {
                        console.log("err:");
                        console.log(err);
                        alert('Unknown Error: ' + JSON.stringify(err));
                        throw err;
                    }
                }
            }
        }
    }
    async componentDidMount() {
        this._isMounted = true;
        if (this.whom) {
            store.dispatch(getCreatedEvents(this.nCstate.login.email, this.nCstate.login.token));
        } else {
            let iam = '';
            if (this.nCstate.login.hasOwnProperty('email')) iam = this.nCstate.login.email;
            store.dispatch(getUzerInfo(this.email, iam));
        }
        store.subscribe(() => {
            if (this._isMounted) {
                const state = store.getState();
                if (state.uzerInfo.status === -1) {
                    //this.navi.navigate('MainList', {title: 'Главная'});
                    //store.dispatch({type:"SETPROFILE", mail: state.login.email, whom: 1});
                    //store.dispatch({type: USERINFO, info: {}, status: 0});
                    this.navi.navigate('MainList', {title: 'Главная'});
                    //this.setState({isLoading: state.page.disabled})
                    return;
                }
                if (state.profile.mail !== this.state.pm) {
                    this.email = state.profile.mail;
                    this.whom = state.profile.whom;
                    let imsbd = 0;
                    if (state.login.hasOwnProperty('info')) {
                        if (state.login.info.hasOwnProperty('subed')) {
                            for (let i in state.login.info.subed) {
                                if (state.login.info.subed[i] === state.profile.mail) {
                                    imsbd = 1;
                                }
                            }
                        }
                    }
                    this.setState({pm: state.profile.mail, iamsubed: imsbd, searchPpl: false});
                    if (this.whom) {
                        store.dispatch(getCreatedEvents(this.nCstate.login.email, this.nCstate.login.token));
                    } else {
                        let iam = '';
                        if (this.nCstate.login.hasOwnProperty('email')) iam = this.nCstate.login.email;
                        store.dispatch(getUzerInfo(this.email, iam));
                    }
                }
                if (state.uzerInfo.status !== this.state.uirnd){
                    let sbd = [];
                    if (state.uzerInfo.info.uzr.hasOwnProperty('subed')) {
                        sbd = state.uzerInfo.info.uzr.subed;
                    }
                    this.setState({uirnd: state.uzerInfo.status, subed: sbd});
                }
                this.checkWTF();
                if (state.page.disabled !== this.state.isLoading) {
                    this.setState({isLoading: state.page.disabled})
                }
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // const state = store.getState();
    }

    async componentWillUnmount() {
        this._isMounted = false;
        store.subscribe(() => {});
        return function cleanup() {
            this._isMounted = false;
            store.subscribe(()=>{});
        };
    }

    render(){
        if (this.state.isLoading) {
            return (
                <Container style={{width: '100%', height: '100%'}}>
                    <SafeAreaView style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#ff0054" style={styles.loader}/>
                    </SafeAreaView>
                </Container>
            )
        } else if (this.state.searchPpl) {
            let mw = this.maxWidth - 120;
            let mw2 = this.maxWidth - 100;
            let mh = Math.ceil(this.maxHeight/2.5);
            let mh2 =  this.maxHeight-100;
            let l = '65%', kl = '1%';
            let avaS = 100, avaFS = 22, avaH = 130, FS = 28;
            if (width < 900) {
                mw = this.maxWidth-30;
                mw2 = this.maxWidth-10;
                mh = Math.ceil(this.maxHeight/2)-20;
                mh2 = this.maxHeight - 150;
                l = '80%';
                kl = '5%'
                avaS = Math.ceil(avaS * this.coef);
                avaH = Math.ceil(avaH * this.coef);
                avaFS = Math.ceil(avaFS * this.coef);
                FS = Math.ceil(FS * this.coef);
            }
            let globalTop = 0;
            if (Platform.OS === 'ios') {
                mh2 = this.maxHeight - 100;
                mh += 25;
                globalTop = 15;
            }
            if (avaFS < 12) avaFS = 12;
            if (avaS < 50) avaS = 50;
            if (FS < 12) FS = 12;
            if (mh < 65) mh = 65;
            this.inpref = React.createRef();
            //console.log("this.state.modalVisible = " + this.state.modalVisible);
            return (
                <Container style={{fontFamily: 'Tahoma'}}>
                    <View>
                        <StatusBarBG style={{backgroundColor: "transparent"}} />
                    </View>
                    <SafeAreaView style={{minHeight: 5}}></SafeAreaView>
                    <SafeAreaView style={[styles.centeredView, {width: '100%', marginTop: globalTop}]} >
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={true}
                            style={{borderWidth: 0}}
                        >
                            <SafeAreaView style={[styles.centeredView, {width: width, height: mh2, maxHeight: mh2, borderColor: 'blue', borderWidth: 0, marginTop: globalTop}]}>
                                <SafeAreaView ref={this.inpref} style={[styles.modalView,
                                    {borderColor: 'green', borderWidth: 0, padding: 0, margin: 1, width: width-12, height: mh2, maxHeight: mh2, position: 'absolute', top: -5}]}>
                                    <Header noShadow searchBar rounded style={{backgroundColor: 'none', width: width-12, position: 'relative',
                                        top: 2, left: -1, borderColor: 'red', borderWidth:0}}>
                                    <Item style={{
                                        maxWidth: '100%',
                                        borderStyle: 'solid',
                                        borderColor: '#bbbbbb',
                                        backgroundColor: '#fafafa',
                                        borderRadius: 10,
                                        borderTopWidth: 1,
                                        borderLeftWidth: 1,
                                        borderRightWidth: 1,
                                        borderBottomWidth: 1,
                                        marginTop: 0,
                                        marginLeft: 0,
                                        width: '95%'
                                    }}>
                                        <TouchableOpacity onPress={()=>{this.searchPpl()}}>
                                            <Icon name="ios-search"/>
                                        </TouchableOpacity>
                                        <Input
                                            placeholder="Искать"
                                            onSubmitEditing={() => {
                                                this.searchPpl()
                                            }}
                                            style={{maxHeight: 50, height: 50, fontFamily: 'Tahoma'}}
                                            ref={input => {
                                                this.searchInput = input
                                            }}
                                            onChange={e => this.setState({pplsearchinp: e.nativeEvent.text})}
                                        />
                                    </Item>
                                        <TouchableOpacity
                                            style={{position: 'relative', left: 6, top: 18}}
                                            onPress={()=>{
                                                this.setState({searchPpl: false})
                                            }}>
                                            <Image source={krst} style={{width: 20, height: 20}} />
                                        </TouchableOpacity>
                                    </Header>
                                    <SafeAreaView style={{
                                        height: mh,
                                        maxHeight: mh,
                                        minHeight: mh,
                                        width: '100%',
                                        alignContent: "flex-start",
                                        flex: 1, flexWrap: 'wrap',
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start",
                                        flexDirection: "column"
                                    }}>
                                        <ScrollView style={{width: '100%'}}>
                                            {this.state.foundppl.map((p,i)=> {
                                                let ava = bigava;
                                                let nick = '...';
                                                if (p.hasOwnProperty('ava')) {
                                                    ava = {uri: 'https://taketeam.net/avas/' + p.ava};
                                                }
                                                if (p.hasOwnProperty('nick')) {
                                                    nick = p.nick;
                                                }
                                                let whom = 0;
                                                if (p.email === this.nCstate.login.email) whom = 1;
                                                return (
                                                    <SafeAreaView key={i} style={{width: '100%', marginLeft: 10, marginTop: 10}}>
                                                        <TouchableOpacity style={{flexDirection: "row", alignContent:"center", alignItems: 'center'}} onPress={()=>{
                                                            this.setState({searchPpl: false});
                                                            store.dispatch({type:"SETPROFILE", mail: p.email, whom: whom});
                                                            this.navi.navigate('profile2', {whom: whom, email: p.email});
                                                        }}>
                                                            <Image source={ava} style={{resizeMode: 'cover', width: avaS, height: avaS, borderRadius: Math.ceil(avaS / 2)}}/>
                                                            <Text style={{fontSize: FS, fontWeight: 'bold', marginLeft: 10, fontFamily: 'ProximaNova'}}>{nick}</Text>
                                                        </TouchableOpacity>
                                                    </SafeAreaView>
                                                )
                                            })}
                                        </ScrollView>
                                    </SafeAreaView>
                                    <SafeAreaView style={{
                                        alignContent: "center",
                                        flex: 1, flexWrap: 'wrap',
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        maxHeight: Math.ceil(mh)
                                    }}>
                                        <Text style={{fontSize: FS, fontWeight: 'bold', fontFamily: 'ProximaNova'}}>Подписки:</Text>
                                        <SafeAreaView style={{height: 5, minHeight: 5, width: 1}}></SafeAreaView>
                                        <ScrollView>
                                            <SafeAreaView style={{
                                                alignContent: "center",
                                                flex: 1, flexWrap: 'wrap',
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexDirection: "row"
                                            }}>
                                                {this.state.subed.map((s,i)=>{
                                                    let ava = bigava;
                                                    let nick = '...';
                                                    if (this.state.savas.hasOwnProperty(s)) {
                                                        if (this.state.savas[s]['ava'] !== 'bigava') ava = this.state.savas[s]['ava'];
                                                    }
                                                    if (this.state.savas.hasOwnProperty(s)) {
                                                        nick = this.state.savas[s]['nick'];
                                                    }
                                                    return(
                                                        <SafeAreaView key={i} style={{marginLeft: 10, width: avaS, height: avaH+20}}>
                                                            <TouchableOpacity
                                                                style={{alignContent: 'center', width: avaS, alignItems:'center', height: avaH+10, flexDirection: 'column', flex:1, display: 'flex', justifyContent: 'center'}}
                                                                onPress={()=>{
                                                                this.setState({searchPpl: false});
                                                                store.dispatch({type:"SETPROFILE", mail: s, whom: 0});
                                                                this.navi.navigate('profile2', {whom: 0, email: s});
                                                            }}>
                                                                <Image source={ava}
                                                                    style={{width: avaS, height: avaS, borderRadius: Math.ceil(avaS / 2), resizeMode: 'cover'}}/>
                                                                <Text style={{fontFamily: 'ProximaNova', fontSize: avaFS, fontWeight: 'bold'}}>{nick}</Text>
                                                            </TouchableOpacity>
                                                        </SafeAreaView>
                                                    )
                                                })}
                                            </SafeAreaView>
                                        </ScrollView>
                                    </SafeAreaView>
                                </SafeAreaView>
                            </SafeAreaView>
                        </Modal>
                    </SafeAreaView>
                </Container>
            )
        } else if (this.state.modalVisible) {
            let fs = 26, picw = 277, coef = width / 900;
            if (coef < 0.5) coef = 0.5;
            if (width < 900) {
                fs = 16;
                picw = Math.ceil(picw * coef)
            }
            this.imgRef = React.createRef();
            let mk = 0;
            if (Platform.OS === 'ios') {
                mk = 10;
            }
            return (
                <Container style={{fontFamily: 'Tahoma'}}>
                    <SafeAreaView style={[styles.centeredView]} >

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={true}
                            style={{borderWidth: 0}}
                        >
                            <SafeAreaView style={[styles.centeredView, {width: width, borderWidth: 0, borderColor: 'blue', borderStyle: 'solid'}]} ref={this.imgRef}>
                                <SafeAreaView style={[styles.modalView2, {width: this.maxWidth - 10, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}]}>
                                    <Image  source={lologo} style={{width: picw, height: picw}}/>
                                    <Text style={[styles.modalText, {fontFamily: 'ProximaNova', marginTop: 10}]}>Сообщение для {this.state.nick}</Text>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        onFocus={()=>{
                                            this.imgRef.current.setNativeProps({marginTop: -250});
                                        }}
                                        onEndEditing={()=>{
                                            this.imgRef.current.setNativeProps({marginTop: 0});
                                        }}
                                        onBlur={()=>{
                                            this.imgRef.current.setNativeProps({marginTop: 0});
                                        }}
                                        ref={ref=>{this.smsref = ref}}
                                        placeholder="Написать сообщение"
                                        placeholderTextColor="#cecece"
                                        style={{borderWidth: 1, borderStyle: 'solid', borderColor: 'grey',
                                            width: '80%', height: 150, borderRadius: 5, padding: 10,
                                            marginLeft: 0, marginTop: 10, color: 'grey', fontSize: fs}}
                                        onChangeText={(smsText) => this.setState({smsText})}
                                        value={this.state.smsText}/>
                                    <SafeAreaView style={{flexDirection: 'row', marginTop: mk, padding: 20, justifyContent: 'space-between'}}>
                                        <TouchableOpacity onPress={() => this.setState({modalVisible: false}) }>
                                            <SafeAreaView style={{borderRadius: 15, backgroundColor: "#b0b0b0", justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: 40, height: 40}}>
                                                <Text style={{color: 'white', fontFamily: 'ProximaNova', fontSize: 34, fontWeight: 'bold', transform: [{"rotate": '45deg'}]}}>+</Text>
                                            </SafeAreaView>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.sendMessage() } style={{marginLeft: 20}}>
                                            <SafeAreaView style={{borderRadius: 15, backgroundColor: "#fe0074", justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: 130, height: 40}}>
                                                <Text style={{color: 'white', fontFamily: 'ProximaNova', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase'}}>Отправить</Text>
                                            </SafeAreaView>
                                        </TouchableOpacity>
                                    </SafeAreaView>
                                </SafeAreaView>
                            </SafeAreaView>
                        </Modal>

                    </SafeAreaView>
                </Container>
            )
        } else {
            let w = 240;
            let h = 68;
            let avaW = 350;
            let avaH = 350;
            let fs = 26, headerH = 70, headerPT = 20, asz = 24, ih = 50, MT = 20;
            let kw = 60, kh = 55, pplW = 80;
            if (width < 900) {
                w = 120;
                h = 34;
                MT = Math.ceil(MT * this.coef);
                avaW = Math.ceil(avaW * this.coef);
                avaH = Math.ceil(avaH * this.coef);
                fs = Math.ceil(fs * this.coef);
                headerH = Math.ceil(headerH * this.coef);
                //headerPT = Math.ceil(headerPT * this.coef);
                headerPT = 10;
                asz = Math.ceil(asz * this.coef);
                ih = Math.ceil(ih * this.coef);
                kw = Math.ceil(kw * this.coef);
                kh = Math.ceil(kh * this.coef);
                pplW = Math.ceil(pplW * this.coef);
            }
            if (avaW < 230) avaW = 230;
            if (avaH < 230) avaH = 230;
            if (headerH < 40) headerH = 40;
            if (fs < 16) fs = 16;
            if (kw < 36) kw = 36;
            if (kh < 34) kh = 34;
            if (pplW < 49) pplW = 49;
            return (
                <Container style={{fontFamily: 'Tahoma', paddingTop: 0}}>
                    <View>
                        <StatusBarBG style={{backgroundColor: "transparent"}} />
                    </View>
                    <ScrollView>
                        <SafeAreaView style={[styles.header, {height: headerH, maxHeight: headerH, minHeight: headerH, paddingTop: headerPT}]}>
                            <Image source={l_arrow} style={{width: asz, height: asz}}/>
                            {this.state.editing ?
                                <Input
                                    placeholder="Nickname"
                                    value={this.state.nick}
                                    style={{
                                        maxWidth: 250,
                                        borderWidth: 1,
                                        height: ih,
                                        borderColor: '#bbbbbb',
                                        borderStyle: 'solid',
                                        borderRadius: 4,
                                        backgroundColor: '#fafafa'
                                    }}
                                    ref={this.refas['nick']}
                                    onChange={e => this.setState({nick: e.nativeEvent.text})}/>
                                :
                                <Text style={{fontWeight: 'bold', fontSize: fs, fontFamily: 'ProximaNova'}}>{this.state.nick}</Text>
                            }
                            <Image source={r_arrow} style={{width: asz, height: asz}}/>
                        </SafeAreaView>
                        <SafeAreaView style={[styles.main, { marginTop: 20}]}>
                            <SafeAreaView style={styles.item1}>
                                <TouchableOpacity onPress={() => {
                                    this.changeAva();
                                }}>
                                    <Image style={[styles.avka, {width: avaW, height: avaH}]} source={this.state.avatarka}/>
                                </TouchableOpacity>
                                {this.getOsebe()}
                                {this.whom ?
                                    <SafeAreaView style={{flexDirection: "row", marginTop: MT}}>
                                        <TouchableOpacity onPress={()=>{this.showSettings()}}>
                                            <Image source={koleso}
                                                   style={{width: kw, height: kh, resizeMode: 'cover'}}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{this.ppl()}}>
                                            <Image source={ppl}
                                                   style={{
                                                       width: pplW,
                                                       height: kh,
                                                       resizeMode: 'cover',
                                                       marginLeft: 60
                                                   }}/>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            this.editMe()
                                        }}>
                                            <Image source={karandaw}
                                                   style={{
                                                       width: kw,
                                                       height: kh,
                                                       resizeMode: 'cover',
                                                       marginLeft: 60
                                                   }}/>
                                        </TouchableOpacity>
                                    </SafeAreaView>
                                    :
                                    <SafeAreaView style={{flexDirection: "row", marginTop: MT}}>
                                        {this.wws()}
                                        <TouchableOpacity onPress={()=>{this.sendsms()}}>
                                            <Image source={sms} style={{width: w, height: h, resizeMode: 'cover', marginLeft: 10}} />
                                        </TouchableOpacity>
                                    </SafeAreaView>
                                }
                                {this.getEven()}
                            </SafeAreaView>
                            <SafeAreaView>
                            </SafeAreaView>
                        </SafeAreaView>
                    </ScrollView>
                    <Bottom navigate={this.navi.navigate}/>
                </Container>
            )
        }
    }
}

const styles = StyleSheet.create({
    header: {
        maxHeight: 70,
        minHeight: 70,
        height: 70,
        paddingTop: 20,
        width: '100%',
        alignContent: "center",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: 'nowrap',
        flexDirection: "row",
        fontSize: 24
        /*textTransform: 'uppercase'*/
    },
    centeredView: {
        flex: 1,
        display: 'flex',
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: 'nowrap',
        width: '100%',
        height: '100%',
        marginTop: 22
    },
    main: {
        width: '100%',
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: 'column'
    },
    item1: {
        /*flex: 1,*/
        /*justifyContent: "center",*/
        alignItems: "center",
        width: '100%'
        /*flexDirection: 'column',*/
        /*alignContent: "center"*/
    },
    afisha: {
        resizeMode: 'cover',
        width: 270,
        height: 365
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
    },
    avka: {
        width: 350,
        height: 350,
        resizeMode: 'cover',
        borderRadius: 175
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999
    },
    loaderContainer: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalView2: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});