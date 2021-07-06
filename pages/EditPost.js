import React from "react";
import {Dimensions, Platform} from "react-native";
import store from "../redux/store";
import {cancelPost, createPost, newPostLastStep, EditPostFinish, getPostInfo, getCreatedEvents} from "../redux/actions";
import {View, Button, StyleSheet, Image, ScrollView, TextInput,
    ActivityIndicator, SafeAreaView} from "react-native";
import {Container, Form, Input, Item} from 'native-base';
import Bottom from "../components/Bottom";
import * as ImagePicker from "expo-image-picker";
const { width, height } = Dimensions.get('screen');
import preview from '../assets/preview.png';
import {Text, TouchableOpacity, Alert, Modal} from "react-native";
import l_arrow from "../assets/l_arrow.png";
import r_arrow from "../assets/r_arrow.png";
import krest from '../assets/x.png';
import aa from '../assets/aa.png';
import aaa from '../assets/aaa.png';
import cirl from '../assets/cirl.png';
import dd from '../assets/dd.png';
import share1 from '../assets/share1.png';
import share2 from '../assets/share2.png';
import share3 from '../assets/share3.png';
import share4 from '../assets/share4.png';
import Slider from '@react-native-community/slider';
import Draggable from "react-native-draggable";
import share11 from '../assets/share11.png';
import share21 from '../assets/share21.png';
import share31 from '../assets/share31.png';
import share41 from '../assets/share41.png';
import shagy from "../assets/shag.png";
import MyColrPicker from "../components/MyColrPicker";
import * as Permissions from 'expo-permissions';
import StatusBarBG from "../components/StatusBarBG";

export default class EditPost extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.nCstate = store.getState();
        let city = '';
        if (this.nCstate.login.info.hasOwnProperty('city')) {
            if (this.nCstate.login.info.city !== '...') {
                city = this.nCstate.login.info.city;
            }
        }
        this.NR = [];
        this.msRef = React.createRef();
        this.ph = height - 720;
        this.pw = width;
        this.inpContRef = null;
        this.maxWidth = width;
        this.maxHeight = height;
        this.coef = 1.78;
        if (width >= 900) {
            this.pw = 900;
            this.maxWidth = 900;
            this.maxHeight = 1600;
        }
        if (width < 900) {
            this.maxHeight = this.maxWidth * 1.78;
        }
        this.main = 430;
        this.picw = null;
        this.pich = null;
        this.navi = this.props.navigation;
        this.pid = this.navi.getParam('pid');
        this.nadp = [];
        this.textInput = null;
        this.setTextInputRef = element => {
            this.textInput = element;
        };
        this.opisref = 2;
        this.state = {
            step: 0,
            city: city,
            needfoto: null,
            pics: [],
            cansee: null,
            cancom: null,
            setted: null,
            ppi: 0,
            stepStatus: 0,
            nadpFS:[],
            chrds: [],
            pich: null,
            picw: null,
            inputW: ['100%'],
            inputD: ['none'],
            nadpisi: [],
            text: '',
            pid: this.pid,
            ee: {},
            wcs: 'all',
            wcc: 'all',
            isLoading: true,
            modalVisible: false,
            modalText: '',
            rega: 0,
            newfoto: 0,
            title: '',
            data: '',
            time: '',
            singlePostStatus: 0,
            deleted: 0,
            cd: 'none',
            c4: null,
            ndpClr:[],
            ndpBClr:[],
            updated: 0,
            rotas: [],
            shar1: 1,
            shar2: 1,
            shar3: 1,
            shar4: 1,
            se: true
        }
        this.firstStep = this.firstStep.bind(this);
        this.cancel = this.cancel.bind(this);
        this.lastStep = this.lastStep.bind(this);
        this.plaha = this.plaha.bind(this);
        this.viewPic = this.viewPic.bind(this);
        this.nadpis = this.nadpis.bind(this);
        this.setnadpis = this.setnadpis.bind(this);
        this.setRef = this.setRef.bind(this);
        this.finish = this.finish.bind(this);
        this.getSizes = this.getSizes.bind(this);
        this.setRega = this.setRega.bind(this);
        this.del = this.del.bind(this);
        this.showCircle = this.showCircle.bind(this);
        this.showBackCircle = this.showBackCircle.bind(this);
        this.setMyColor = this.setMyColor.bind(this);
        this.setFS = this.setFS.bind(this);
        this.MakeFS = this.MakeFS.bind(this);
        this.MakeChoords = this.MakeChoords.bind(this);
        this.rota = this.rota.bind(this);
        this.stopRota = this.stopRota.bind(this);
        this.setviewers = this.setviewers.bind(this);
        this.setcom = this.setcom.bind(this);
        this.comsetup = this.comsetup.bind(this);
        this.checkMultiPermissions = this.checkMultiPermissions.bind(this);
        this.doPicsShit = this.doPicsShit.bind(this);
        this.addPic = this.addPic.bind(this);
    }

    async addPic(){
        if (!this.state.needfoto) return;
        let perms = await this.checkMultiPermissions();
        if (!perms) return;
        let pics;
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
                allowsMultipleSelection: true,
                base64: true
            });
            if (!result.cancelled) {
                pics = this.doPicsShit(result);
            } else {
                this.cancel();
                return;
            }
        } catch (err) {
            let result = await ImagePicker.getPendingResultAsync();
            if (result.length) {
                result = result[0];
                if (result.hasOwnProperty('cancelled') && !result['cancelled']) {
                    pics = this.doPicsShit(result);
                } else {
                    this.cancel();
                    return;
                }
            } else {
                alert('Unknown Error: ' + JSON.stringify(err));
                this.cancel();
                return;
            }
        }

        if (Array.isArray(pics)) {
            pics = pics[0]
        }
        let picas = this.state.pics;
        picas.push(pics);
        store.dispatch(createPost(1, picas, Math.random()));
    }

    setcom(){
        let com;
        if (this.state.cancom === 1) {
            com = 0;
        } else if (this.state.cancom === 0) {
            com = -1;
        } else if (this.state.cancom === -1) {
            com = 1;
        }
        this.setState({cancom: com});
    }

    comsetup() {
        let mt = 0, ml = 20, fs = 26, pl = 45, ttp=-21, pl2 = 144, tp = -22, pl3=80, t2 = 0, fs2 = 26;
        if (width < 900) {
            mt = -5;
            ml = 10;
            t2 = 1;
            tp = -27;
            fs2 = 14;
            fs = 18;
            pl = 25;
            ttp = -24;
            pl2 = 57;
            pl3=50;
        }
        if (this.state.cancom === 1) {
            return (
                <SafeAreaView style={{flexWrap: 'nowrap', maxHeight: 40, flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: fs - 2,
                        textTransform: 'uppercase',
                        fontFamily: 'Tahoma'}}>Все </Text>
                    <Text style={{
                        color: '#f7006b',
                        fontSize: 56,
                        marginTop: -14
                    }}>&rsaquo;</Text>
                </SafeAreaView>

            )
        }
        if (this.state.cancom === 0) {
            return (
                <SafeAreaView style={{flexWrap: 'nowrap', maxHeight: 40, flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: fs2 - 5,
                        textTransform: 'uppercase',
                        fontFamily: 'Tahoma'
                    }}>Подписчики </Text>
                    <Text style={{
                        color: '#f7006b',
                        fontSize: 56,
                        marginTop: -14
                    }}>&rsaquo;</Text>
                </SafeAreaView>
            )
        }
        if (this.state.cancom === -1) {
            return (
                <SafeAreaView style={{flexWrap: 'nowrap', maxHeight: 40, flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: fs - 2, textTransform: 'uppercase', fontFamily: 'Tahoma'}}>Никто </Text>
                    <Text style={{
                        color: '#f7006b',
                        fontSize: 56,
                        marginTop: -14
                    }}>&rsaquo;</Text>
                </SafeAreaView>
            )
        }
    }

    setviewers(){
        let cans;
        if (this.state.cansee) cans = 0;
        else cans = 1;
        this.setState({cansee: cans});
    }

    rota(n,i){
        let dgr = 0;
        if (this.state.rotas[i]) dgr = this.state.rotas[i];
        if (n === "r") dgr += 1;
        else dgr -= 1;
        let rts = this.state.rotas;
        rts[i] = dgr;
        this.setState({rotas: rts});
        this.timer = setTimeout(()=>{this.rota(n,i)}, 10);
    }

    stopRota(){
        clearTimeout(this.timer);
    }

    MakeChoords(e,w,i){
        let x, y;
        if (width < 900) {
            y = e.nativeEvent.pageY / (this.maxHeight + 80);
            x = e.nativeEvent.pageX / this.maxWidth;
        } else {
            y = parseInt(this.msRef.current._scrollNodeRef.scrollTop) + e.nativeEvent.pageY - 55;
            x = e.nativeEvent.pageX - Math.ceil((width - 900)/2) ;
            y = y / this.maxHeight;
            x = x / this.maxWidth;
        }
        let chrds = this.state.chrds;
        chrds[i]={x:x,y:y};
        this.setState({chrds: chrds});
    }

    setFS(e,g,i){
        let fs = 20;
        if (width >= 900) {
            let hz = parseInt(this.msRef.current._scrollNodeRef.scrollTop) + parseInt(g.moveY);
            if (hz > 795 || hz < 595) return;
            let y = 800 - hz;
            fs = 20 + Math.ceil(y / 5);
        } else {
            let hz = 290 - parseInt(g.moveY);
            if (hz > 210 || hz < 0) return;
            fs = 20 + Math.ceil(hz / 5);
        }
        this.NR[i].current.viewConfig.validAttributes.style.fontSize = fs;
    }

    MakeFS(e,w,i) {
        let fs = this.NR[i].current.viewConfig.validAttributes.style.fontSize;
        fs = parseInt(fs);
        let nfs = this.state.nadpFS;
        nfs[i] = fs;
        this.setState({nadpFS: nfs});
    }

    setMyColor(clr){
        if (this.state.c4 === 'text') {
            let nc = this.state.ndpClr;
            nc[this.state.ppi] = clr;
            this.setState({ndpClr: nc});
        } else {
            let nc = this.state.ndpBClr;
            nc[this.state.ppi] = clr;
            this.setState({ndpBClr: nc});
        }
        this.setState({cd: 'none'});
    }

    showCircle() {
        let inputD = this.state.inputD;
        for (let i in this.state.inputD) {
            inputD[i] = 'none';
        }
        this.setState({inputD: inputD});
        let cd = 'none';
        if (this.state.cd === 'none') {
            cd = 'flex';
        }
        this.setState({cd: cd, c4: 'text'});
    }

    showBackCircle(){
        let inputD = this.state.inputD;
        for (let i in this.state.inputD) {
            inputD[i] = 'none';
        }
        this.setState({inputD: inputD});
        let cd = 'none';
        if (this.state.cd === 'none') {
            cd = 'flex';
        }
        this.setState({cd: cd, c4: 'bck'});
    }

    setRega(){
        if (this.state.rega) {
            this.setState({rega: 0});
        } else {
            this.setState({rega: 1});
        }
    }

    getSizes(w,h){
        let neww = w;
        let newh = h;
        if (w > h) {
            if (w > this.maxWidth) {
                neww = this.maxWidth;
                let coef = (this.maxWidth / w);
                newh = h * coef;
            } else {
                /*neww = this.maxWidth;
                let coef = (this.maxWidth / w);
                newh = h * coef;*/
            }
        } else if (w < h) {
            if (h > this.maxHeight) {
                newh = this.maxHeight;
                let coef = (this.maxHeight / h);
                neww = w * coef;
            } else {
                /*newh = this.maxHeight;
                let coef = (this.maxHeight / h);
                neww = w * coef;*/
            }
        } else {
            if (w > this.maxWidth) {
                neww = this.maxWidth;
                let coef = (this.maxWidth / w);
                newh = h * coef;
            } else {
                /*neww = this.maxWidth;
                let coef = (this.maxWidth / w);
                newh = h * coef;*/
            }
        }
        if (neww > this.maxWidth) {
            neww = this.maxWidth;
            let coef = (this.maxWidth / w);
            newh = h * coef;
        }
        if (newh > this.maxHeight) {
            newh = this.maxHeight;
            let coef = (this.maxHeight / h);
            neww = w * coef;
        }
        return {w: neww, h: newh}
    }

    async componentDidMount() {
        this._isMounted = true;
        store.dispatch(getPostInfo(this.pid));
        store.subscribe(() => {
            if (this._isMounted) {
                const state = store.getState();
                if (state.page.disabled !== this.state.isLoading) {
                    this.setState({isLoading: state.page.disabled})
                }
                if (state.singlePost.status !== this.state.singlePostStatus)  {
                    this.setState({ee: state.singlePost.event.post, singlePostStatus: state.singlePost.status});
                }
                if (this.state.step !== state.newpost.step || this.stepStatus !== state.newpost.stepStatus) {
                    if (state.newpost.step === 1) {
                        let pich = null;
                        let picw = null;
                        let inputW = ['100%'];
                        let inputD = ['none'];
                        let pics = state.newpost.pics;
                        let setted = state.newpost.pics[0];
                        if (!this.state.newfoto && setted.hasOwnProperty('uri')) {
                            setted = {uri: "https://taketeam.net/posters/" + setted.uri};
                        } else if (this.state.newfoto && setted.hasOwnProperty('uri')) {
                            setted = {uri: setted.uri};
                        } else if (setted === 'preview') {
                            setted = preview;
                        }
                        if (state.newpost.needfoto && 'preview' !== state.newpost.pics[0]) {
                            pich = pics[0]['height'];
                            picw = pics[0]['width'];
                            const sizes = this.getSizes(picw,pich);
                            picw = sizes['w'];
                            pich = sizes['h'];
                            inputW = [];
                            inputD = [];
                            for (let i in state.newpost.pics) {
                                let szs = this.getSizes(state.newpost.pics[i]['width'],state.newpost.pics[i]['height']);
                                inputW.push(szs['w']-20);
                                inputD.push('none');
                            }
                        } else {
                            pich = this.maxWidth * 1.78;
                            picw = this.maxWidth;
                            inputW[0] = picw - 20;
                            pics = [preview];
                        }
                        let nadpisi = [''];
                        let ndpClr = [];
                        let ndpBClr = [];
                        let nadpFS = [];
                        let chrds = [];
                        let rotas = [];
                        if (!this.state.newfoto && this.state.ee.hasOwnProperty('nadpisi')) nadpisi = this.state.ee.nadpisi;
                        if (!this.state.newfoto && this.state.ee.hasOwnProperty('nadpFS')) nadpFS = this.state.ee.nadpFS;
                        if (!this.state.newfoto && this.state.ee.hasOwnProperty('chrds')) chrds = this.state.ee.chrds;
                        if (!this.state.newfoto && this.state.ee.hasOwnProperty('rotas')) rotas = this.state.ee.rotas;
                        if (!this.state.newfoto && this.state.ee.hasOwnProperty('ndpClr')) {ndpClr = this.state.ee.ndpClr;}
                        else {
                            for (let i in pics) {
                                ndpClr.push('#000');
                                ndpBClr.push('transparent');
                                nadpFS.push(20);
                                chrds.push({x:-1,y:-1});
                                rotas.push(0);
                            }
                        }
                        if (!this.state.newfoto && this.state.ee.hasOwnProperty('ndpBClr')) ndpBClr = this.state.ee.ndpBClr;
                        this.setState({
                            needfoto: state.newpost.needfoto,
                            step: state.newpost.step,
                            pics: pics,
                            setted: setted,
                            ppi: 0,
                            stepStatus: state.newpost.stepStatus,
                            nadpisi: nadpisi,
                            pich: pich,
                            picw: picw,
                            nadpFS: nadpFS,
                            chrds: chrds,
                            inputW: inputW,
                            inputD: inputD,
                            ndpBClr: ndpBClr,
                            ndpClr: ndpClr,
                            rotas: rotas
                        });
                    } else if (state.newpost.step === 2) {
                        let setted = this.state.pics[0];
                        if (!this.state.newfoto && setted.hasOwnProperty('uri')) {
                            setted = {uri: 'https://taketeam.net/posters/' + this.state.pics[0]['uri']};
                        } else if (this.state.newfoto && setted.hasOwnProperty('uri')) {
                            setted = {uri: this.state.pics[0]['uri']};
                        }
                        let txt = this.state.ee.opis;
                        let wcs = 'all';
                        let wcc = 'all';
                        let rega = 0;
                        let title = '';
                        let data = '';
                        let time = '';
                        let cansee = 1;
                        let cancom = 1;
                        let shar1 = 1, shar2 = 1, shar3 = 1, shar4 = 1;
                        if (this.state.ee.hasOwnProperty('shar1')) {
                            shar1 = this.state.ee.shar1;
                            shar2 = this.state.ee.shar2;
                            shar3 = this.state.ee.shar3;
                            shar4 = this.state.ee.shar4;
                        }
                        if (this.state.ee.hasOwnProperty('cansee')) {
                            cansee = this.state.ee.cansee;
                        }
                        if (this.state.ee.hasOwnProperty('cancom')) {
                            cancom = this.state.ee.cancom;
                        }
                        if (this.state.ee.hasOwnProperty('wcs')) {
                            wcs = this.state.ee.wcs;
                        }
                        if (this.state.ee.hasOwnProperty('wcc')) {
                            wcc = this.state.ee.wcc;
                        }
                        if (this.state.ee.hasOwnProperty('rega')) {
                            rega = this.state.ee.rega;
                        }
                        if (this.state.ee.hasOwnProperty('title')) {
                            title = this.state.ee.title;
                        }
                        if (this.state.ee.hasOwnProperty('date')) {
                            data = this.state.ee.date;
                        }
                        if (this.state.ee.hasOwnProperty('time')) {
                            time = this.state.ee.time;
                        }
                        this.setState({step: 2, setted: setted,
                            text: txt,
                            wcs: wcs,
                            wcc: wcc,
                            rega: rega,
                            title: title,
                            data: data,
                            time: time,
                            cansee: cansee,
                            cancom: cancom,
                            shar1: shar1,
                            shar2: shar2,
                            shar3: shar3,
                            shar4: shar4,
                        });
                        setTimeout(()=>{
                            if (this.opisref.current) this.opisref.current.focus();
                        },200);
                    } else if (state.newpost.step === 3) {
                        store.dispatch(cancelPost());
                        setTimeout(()=>{
                            if (this._isMounted) {
                                this.setState({modalText: 'Ваше событие успешно отредактировано', modalVisible: true, updated: 1});
                            }
                        }, 100);
                    } else if (state.newpost.step === 0) {
                        this.setState({
                            needfoto: null,
                            step: 0,
                            pics: [],
                            setted: null,
                            ppi: 0,
                            pich: null,
                            picw: null,
                            inputW: ['100%'],
                            inputD: ['none'],
                            nadpisi: [],
                            nadpFS: [],
                            chrds: [],
                            text: '',
                            wcc: 'all',
                            cansee: 1,
                            cancom: 1,
                            shar1: 1,
                            shar2: 1,
                            shar3: 1,
                            shar4: 1,
                        });
                    } else if (state.newpost.step === -1) {
                        store.dispatch(cancelPost());
                        setTimeout(()=>{
                            if (this._isMounted) {
                                this.setState({modalText: 'Не вышло :(', modalVisible: true});
                            }
                        }, 100);

                    }
                }
            }
        });
    }

    setRef () {

    }

    async componentWillUnmount() {
        this._isMounted = false;
        store.subscribe(() => {});
        return function cleanup() {
            this._isMounted = false;
            store.subscribe(()=>{});
        };
    }

    cancel() {
        if (this._isMounted) {
            this.setState({inputD: 'none', nadpisi: [], nadpFS: [],
                chrds: [],ndpClr:[], ndpBClr:[], rotas: []});
            store.dispatch(cancelPost());
        }
    }

    async del(){
        if (this._isMounted) {
            this.setState({isLoading: true})
            const state = store.getState();
            const q = {
                act: "delEvent",
                email: state.login.email,
                token: state.login.token,
                pid: this.state.pid
            };
            let response = await fetch('https://taketeam.net', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(q)
            });
            let msg = await response.json();
            store.dispatch(cancelPost());
            store.dispatch(getCreatedEvents(this.nCstate.login.email, this.nCstate.login.token));
            setTimeout(() => {
                if (this._isMounted) {
                    this.setState({isLoading: false, modalText: 'Ваше событие успешно удалено', modalVisible: true, deleted: 1});
                }
            }, 100);
        }
    }

    lastStep() {
        if (this._isMounted) {
            store.dispatch(newPostLastStep(this.state.nadpisi, this.state.ndpClr, this.state.ndpBClr, this.state.nadpFS, this.state.chrds, this.state.rotas));
        }
    }

    async checkMultiPermissions() {
        if (Platform.OS === 'web') {
            return 1;
        }
        /* const { status0 } = await ImagePicker.getMediaLibraryPermissionsAsync();
         if (status0 !== 'granted') {
             const { status1 } = await ImagePicker.requestMediaLibraryPermissionsAsync();
             console.log("status1 = " + status1);
         }
         console.log("status0 = " + status0);
         return 0;*/
        //await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    async firstStep(load) {
        if (this._isMounted) {
            let pics = [];
            this.setState({newfoto: load});
            if (load) {
                let perms = await this.checkMultiPermissions();
                if (!perms) {
                    let pics = [preview];
                    store.dispatch(createPost(1, pics));
                }
                try {
                    let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [9, 16],
                        quality: 1,
                        allowsMultipleSelection: true,
                        base64: true
                    });
                    if (!result.cancelled) {
                        pics = this.doPicsShit(result);
                    } else {
                        this.cancel();
                    }
                } catch (err) {
                    let result = await ImagePicker.getPendingResultAsync();
                    if (result.length) {
                        result = result[0];
                        if (result.hasOwnProperty('cancelled') && !result['cancelled']) {
                            pics = this.doPicsShit(result);
                        } else {
                            this.cancel();
                        }
                    } else {
                        alert('Unknown Error: ' + JSON.stringify(err));
                        this.cancel();
                    }
                }
            } else {
                this.pich = height - this.main;
                this.picw = this.pw;
                if (this.state.ee.hasOwnProperty('pics')) {
                    pics = this.state.ee['pics'];
                    if (pics[0] !== 'preview') {
                        if (pics[0]['height'] >  (height - this.main) ||  pics[0]['width'] > width) {
                            if (pics[0]['height'] > pics[0]['width']) {
                                let ratio = (height - this.main) / pics[0]['height'];
                                this.pich = height - this.main;
                                this.picw = pics[0]['width'] * ratio;
                            } else {
                                let ratio = this.pw / pics[0]['width'];
                                this.picw = this.pw;
                                this.pich = pics[0]['height'] * ratio;
                            }
                        } else {
                            this.pich = pics[0]['height'];
                            this.picw = pics[0]['width'];
                        }
                    }
                } else {
                    pics = [preview];
                }
            }
            store.dispatch(createPost(1, pics));
        }
    }

    doPicsShit(result){
        let pics;
        if (result.hasOwnProperty('selected')) {
            pics = result.selected;
            if (pics[0]['height'] >  this.maxHeight ||  pics[0]['width'] > this.maxWidth) {
                if (pics[0]['height'] > pics[0]['width']) {
                    let ratio = this.maxHeight / pics[0]['height'];
                    this.pich = this.maxHeight;
                    this.picw = pics[0]['width'] * ratio;
                } else {
                    let ratio = this.pw / pics[0]['width'];
                    this.picw = this.pw;
                    this.pich = pics[0]['height'] * ratio;
                }
            } else {
                this.pich = pics[0]['height'];
                this.picw = pics[0]['width'];
            }
        } else {
            pics = [{}];
            pics[0]['height'] = result['height'];
            pics[0]['width'] = result['width'];
            pics[0]['uri'] = result['uri'];
            if (Platform.OS !== 'web') {
                pics[0]['uri'] = 'data:image/jpeg;base64,'+ result['base64'];
            }
            if (pics[0]['height'] >  this.maxHeight ||  pics[0]['width'] > this.maxWidth) {
                if (pics[0]['height'] > pics[0]['width']) {
                    let ratio = this.maxHeight / pics[0]['height'];
                    this.pich = this.maxHeight;
                    this.picw = pics[0]['width'] * ratio;
                } else {
                    let ratio = this.pw / pics[0]['width'];
                    this.picw = this.pw;
                    this.pich = pics[0]['height'] * ratio;
                }
            } else {
                this.pich = pics[0]['height'];
                this.picw = pics[0]['width'];
            }
        }
        return pics;
    }

    viewPic(ppi){
        const pics = this.state.pics;
        const sizes = this.getSizes(pics[ppi]['width'],pics[ppi]['height']);
        let picw = sizes['w'];
        let pich = sizes['h']
        let inputD = this.state.inputD;
        let inputW = this.state.inputW;
        inputW[ppi] = picw - 20;
        for (let i in this.state.inputD) {
            inputD[i] = 'none';
        }
        let s = '';
        if (this.state.newfoto) {
            s = {uri: this.state.pics[ppi]['uri']};
        } else {
            s = {uri: "https://taketeam.net/posters/" + this.state.pics[ppi]['uri']}
        }
        this.setState({
            setted: s,
            ppi: ppi,
            picw: picw,
            pich: pich,
            inputW: inputW,
            inputD: inputD});
    }

    plaha() {
        if (this.state.pics.length > 1) {
            const plw = Math.ceil(100 / this.state.pics.length) - 3;
            return (
                <SafeAreaView style={[styles.plaha, {width: this.picw}]}>
                    {
                        this.state.pics.map((pika, ppi) => {
                            let opa = 0.5;
                            if (this._isMounted) {
                                if (this.state.ppi === ppi) {
                                    opa = 1
                                }
                            }
                            return (
                                <TouchableOpacity
                                    key={ppi}
                                    onPress={
                                        () => {
                                            this.viewPic(ppi)
                                        }
                                    }
                                    style={{
                                        opacity: opa,
                                        width: plw + '%',
                                        height: 5,
                                        borderRadius: 5,
                                        backgroundColor: '#f861d7',
                                        marginLeft: 1
                                    }}
                                >
                                </TouchableOpacity>
                            )
                        })
                    }
                </SafeAreaView>
            )
        }
    }

    nadpis() {
        let id = this.state.inputD[this.state.ppi];
        let inputD = this.state.inputD;
        for (let i in this.state.inputD) {
            inputD[i] = 'none';
        }
        if (id === 'none') {
            id = 'flex';
        } else {
            id = 'none';
        }
        inputD[this.state.ppi] = id;
        this.setState({inputD: inputD});
        setTimeout(()=>{
            if (this.nadp[this.state.ppi].current['_root']) {
                this.nadp[this.state.ppi].current['_root'].focus();
            }
        }, 100);

    }

    setnadpis(val) {
        let nadpisi = this.state.nadpisi;
        nadpisi[this.state.ppi] = val;
        this.setState({nadpisi: nadpisi});
    }

    finish() {
        if (this._isMounted) {
            if (this.state.text.trim()) {
                store.dispatch(EditPostFinish(this.nCstate.login.email, this.nCstate.login.token, this.state));
            } else {
                this.setState({modalText: 'Надо обязательно ввести описание!', modalVisible: true});
            }
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Container>
                    <SafeAreaView style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#ff0054" style={styles.loader}/>
                    </SafeAreaView>
                </Container>
            )
        }
        if (this.state.modalVisible) {
            let edited = 0;
            if (this.state.modalText === 'Ваше событие успешно отредактировано') {
                edited = 1;
            }
            let imgS = 318;
            let fs3 = 24;
            let coef = width / 900;
            if (coef < 0.5) coef = 0.5;
            if (width < 900) {
                imgS = Math.ceil(imgS * coef);
                fs3 = 16;
            }
            return (
                <Container style={{fontFamily: 'Tahoma'}}>
                    <SafeAreaView style={[styles.centeredView]}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            style={{borderWidth: 0}}
                        >
                            <SafeAreaView style={[styles.centeredView, {borderWidth: 0, minWidth: this.maxWidth, minHeight: 200}]}>
                                <SafeAreaView style={[styles.modalView2, {minWidth: this.maxWidth, minHeight: 200}]}>
                                    {edited ?
                                        <SafeAreaView style={[styles.modalView2, {alignItems: 'center', alignContent: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10}]}>
                                            <Image source={shagy} style={{width: imgS, height: imgS, resizeMode: 'stretch'}}/>
                                            <Text style={[styles.modalText, {fontFamily: 'Tahoma', color: "#747474", fontSize: fs3, maxWidth: imgS + 20}]}>{this.state.modalText}</Text>
                                            <TouchableOpacity
                                                style={[styles.button, styles.buttonClose, {width: 150, backgroundColor:'#ff0073'}]}
                                                onPress={() => {
                                                    this.setState({modalVisible: false});
                                                    if (this.state.deleted || this.state.updated) {
                                                        setTimeout(()=>{
                                                            store.dispatch({type: "REFRESHEVENTS"});
                                                            this.navi.navigate('MainList', {title: 'Главная'})
                                                        },100);
                                                    }
                                                }}
                                            >
                                                <Text style={[styles.textStyle, {fontFamily: 'ProximaNova', color: 'white', textTransform: 'uppercase'}]}>Отлично!</Text>
                                            </TouchableOpacity>
                                        </SafeAreaView>
                                        :
                                        <SafeAreaView style={{paddingTop: 20, justifyContent: 'center', flex: 1, display: 'flex'}}>
                                            <Text style={[styles.modalText, {fontFamily: 'Tahoma'}]}>{this.state.modalText}</Text>
                                            <SafeAreaView style={{width: '100%', maxHeight: 60, justifyContent: 'center', flex: 1, display: 'flex', alignContent: 'center', alignItems: 'center'}}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({modalVisible: false});
                                                        if (this.state.deleted || this.state.updated) {
                                                            setTimeout(()=>{
                                                                this.navi.navigate('profile', {title: 'Профиль', email: this.nCstate.login.email, whom: 1});
                                                            },100);
                                                        }
                                                    }}
                                                >
                                                    <SafeAreaView style={{width: 150, backgroundColor: '#fe0074', height: 30, minHeight: 30, maxHeight: 30, borderRadius: 5, marginTop: 10, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                                                    <Text style={{ color: 'white',
                                                    textTransform: 'uppercase', fontWeight: 'bold', fontSize: 16,
                                                    fontFamily: 'ProximaNova'
                                                        }}>Хорошо</Text>
                                                    </SafeAreaView>
                                                </TouchableOpacity>
                                            </SafeAreaView>
                                        </SafeAreaView>
                                    }

                                </SafeAreaView>
                            </SafeAreaView>
                        </Modal>
                    </SafeAreaView>
                </Container>
            )
        }
        if (this.state.step === 0) {
            let bw = 300, bh = 50, fs = 20, mt1 = 20, mt2 = 50;
            let coef = width / 900;
            if (coef < 0.5) coef = 0.5;
            if (width < 900) {
                bw = Math.ceil(bw * coef);
                bh = Math.ceil(bh * coef);
                fs = Math.ceil(fs * coef);
                mt1 = 5;
            }
            if (fs < 12) fs = 12;
            if (bh < 30) bh = 30;
            if (bw < 160) bw = 160;
            return (
                <Container style={{fontFamily: 'Tahoma'}}>
                    <View>
                        <StatusBarBG style={{backgroundColor: "transparent"}} />
                    </View>
                    <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', width: '100%', height: '100%', justifyContent: 'center'}}>
                        <SafeAreaView style={{maxWidth: 900, maxHeight: 44, flexDirection: "row",
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: 'nowrap', flex: 1}}>
                            <Image source={l_arrow} style={{width: 24, height: 24}}/>
                            <Text style={{textTransform: 'uppercase', fontWeight: 'bold', fontFamily: 'ProximaNova'}}>редактирование</Text>
                            <Image source={r_arrow} style={{width: 24, height: 24}}/>
                        </SafeAreaView>
                        <SafeAreaView style={{maxWidth: 900, width: '100%', minHeight: this.ph+200, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity onPress={()=>{this.firstStep(1)}}>
                                <SafeAreaView style={{borderRadius: 5, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: bw, minHeight: bh, maxHeight: bh,backgroundColor: '#fe0074'}}>
                                    <Text style={{color: 'white', fontFamily: 'ProximaNova', textTransform: 'uppercase', fontWeight: 'bold', fontSize: fs}}>Загрузить постеры</Text>
                                </SafeAreaView>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop: mt1}} onPress={()=>{this.firstStep(0)}}>
                                <SafeAreaView style={{borderRadius: 5, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: bw, minHeight: bh, maxHeight: bh, backgroundColor: '#dad6d5'}}>
                                    <Text style={{color: 'white', fontFamily: 'ProximaNova', textTransform: 'uppercase', fontWeight: 'bold', fontSize: fs}}>Оставить постеры</Text>
                                </SafeAreaView>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop: mt1}} onPress={()=>{this.navi.navigate('singlePost', {title: 'Событие', pid: this.pid});}}>
                                <SafeAreaView style={{borderRadius: 5, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: bw, minHeight: bh, maxHeight: bh, backgroundColor: '#a10049'}}>
                                    <Text style={{color: 'white', fontFamily: 'ProximaNova', textTransform: 'uppercase', fontWeight: 'bold', fontSize: fs}}>Посмотреть</Text>
                                </SafeAreaView>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop: mt1}} onPress={()=>{this.del()}}>
                                <SafeAreaView style={{borderRadius: 5, flex: 1, borderWidth: 1, maxHeight: bh, borderColor: '#d2d2d2', borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: bw, minHeight: bh, backgroundColor: 'white'}}>
                                    <Text style={{fontFamily: 'ProximaNova', textTransform: 'uppercase', color: '#ff0073', fontWeight: 'bold', fontSize: fs}}>Удалить</Text>
                                </SafeAreaView>
                            </TouchableOpacity>
                        </SafeAreaView>
                        <Bottom navigate={this.navi.navigate}/>
                    </SafeAreaView>
                </Container>
            )
        } else if (this.state.step === 1) {
            let mt = -5;
            let bh = 120;
            let lft = '27%';
            let tp = 530;
            let coef = width / 900;
            let pstn = 'absolute';
            let se = true;
            let MH = this.maxHeight - 750;
            let FS1 = 24, kw = 34, kh = 35, MTT = 40, h1 = 30, MT2 = 40;
            let aaw= 59, aah = 42, cw=49, ch = 49, aaaw= 72, aaah = 49, ddw = 47;
            if (coef < 0.5) coef = 0.5;
            if (width < 900) {
                mt = -5;
                FS1 = Math.ceil(FS1 * coef);
                kw = Math.ceil(kw * coef);
                kh = Math.ceil(kh * coef);
                aaw = Math.ceil(aaw * coef);
                aah = Math.ceil(aah * coef);
                cw = Math.ceil(cw * coef);
                ch = Math.ceil(ch * coef);
                aaaw = Math.ceil(aaaw * coef);
                aaah = Math.ceil(aaah * coef);
                ddw = Math.ceil(ddw * coef);
                lft = '1%';
                tp = 20;
                bh = 60;
                MTT = 5;
                pstn = 'absolute';
                se = false;
                h1 = 30;
                MT2 = 0;
                MH = this.maxHeight;
            }
            if (kw < 22) kw = 22;
            if (kh < 22) kh = 22;
            if (FS1 < 15) FS1 = 15;
            if (h1 < 40) h1 = 40;
            this.msRef = React.createRef();
            let pptt = 5;
            if (Platform.OS === 'ios') {
                pptt = 15;
                mt = 5;
                h1 = 30;
            }
            return (
                <Container style={{fontFamily: 'Tahoma', flex: 1, display: 'flex', justifyContent: 'center', backgroundColor: 'white', paddingTop:2}}>
                    <View>
                        <StatusBarBG style={{backgroundColor: "transparent"}} />
                    </View>
                    <SafeAreaView style={{display: 'flex', flex: 1, alignItems: 'center',
                        alignContent: 'center', justifyContent: 'center', width: '100%', height: h1,
                        minHeight: h1, maxHeight: h1, backgroundColor: 'white', position: 'absolute', top: 0}}>
                        <SafeAreaView style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
                            alignItems: 'center', alignContent: 'center', paddingTop: pptt, marginTop: 20, fontSize: 28,
                            height: h1, minHeight: h1, maxHeight: h1, maxWidth: 900, width: '100%', flex: 1,
                            backgroundColor: 'white'}}>
                            <TouchableOpacity onPress={()=>{this.cancel();}}>
                                <Image source={krest} style={{resizeMode: 'cover', width: kw, height: kh, marginTop: mt, marginLeft: 10}}/>
                            </TouchableOpacity>
                            <Text style={{textTransform: 'uppercase', fontWeight: 'bold', fontSize: FS1, marginTop: mt, fontFamily: 'ProximaNova'}}>редактирование</Text>
                            <TouchableOpacity onPress={()=>{this.lastStep();}}>
                                <Text style={{fontFamily: 'ProximaNova',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    backgroundColor: '#ff0068',
                                    fontSize: FS1,
                                    marginTop: mt,
                                    marginRight: 10}}> далее </Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </SafeAreaView>
                    <SafeAreaView style={{display: 'flex',
                        flexDirection: 'row', flexWrap: 'wrap',
                        justifyContent: 'center',
                        flex: 1,
                        width: '100%',
                        position: 'absolute',
                        top: 60,
                        zIndex: 999
                    }}>
                        {this.plaha()}
                    </SafeAreaView>
                    <SafeAreaView style={{height: MH-70, marginTop: 20}}>
                    <ScrollView ref={this.msRef} scrollEnabled={this.state.se}>
                        <SafeAreaView style={{width: '100%', display: 'flex',
                            flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            <SafeAreaView style={{width: this.maxWidth, backgroundColor: 'black', display: 'flex',
                                flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                                {this.state.pics.length ?
                                    <Image source={this.state.setted} style={{height: this.state.pich, width: this.state.picw}}/>
                                    :
                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 30}}></Text>
                                }
                                {this.state.cd === 'flex' ?
                                    <SafeAreaView style={{
                                        display: 'flex',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        backgroundColor: '#000',
                                        zIndex: 9999,
                                        opacity: 1,
                                        width: this.maxWidth,
                                        minWidth: this.maxWidth,
                                        height: this.maxHeight - 100,
                                        maxHeight: this.maxHeight - 100}}>
                                        <MyColrPicker setClr={this.setMyColor}/>
                                    </SafeAreaView>
                                    :
                                    null
                                }
                                <SafeAreaView style={{
                                    position: 'absolute',
                                    height: this.maxHeight,
                                    width: this.maxWidth,
                                    zIndex: 1,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignContent: "center",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexWrap: 'nowrap',
                                    flex: 1
                                }}>
                                    {
                                        this.state.pics.map((el,i)=>{
                                            this.nadp[i] = React.createRef();
                                            if (this.state.inputD[i] === 'none') {
                                                return (
                                                    <Text key={i} ref={this.nadp[i]}></Text>
                                                )
                                            }
                                            return (
                                                <Input placeholder="" key={i} ref={this.nadp[i]}
                                                       style={[styles.inp, {
                                                           textAlign: 'center',
                                                           maxWidth: this.state.inputW[i],
                                                           display: this.state.inputD[i]
                                                       }]}
                                                       defaultValue={this.state.nadpisi[i]}
                                                       onChange={e => this.setnadpis(e.nativeEvent.text)}/>
                                            )

                                        })
                                    }
                                    {this.state.pics.map((el,i) => {
                                        let dsp = 'none';
                                        let y = 200;
                                        if (this.state.nadpFS[i]) {
                                            y = 200 - (this.state.nadpFS[i] - 20) * 5;
                                            if (y === 10) y = 0;
                                        }
                                        if (i === this.state.ppi && this.state.inputD[i] === "none" && this.state.nadpisi[i]) dsp = 'flex';
                                        if (dsp === 'none') {
                                            return null;
                                        } else return (
                                            <SafeAreaView key={i} style={{paddingLeft: 10,
                                                height: 213, borderRadius: 5,
                                                display: dsp,
                                                position: pstn,
                                                left: lft,
                                                top: tp,
                                                width: 25, zIndex: 999,
                                                backgroundColor: '#939393'}}>
                                                <SafeAreaView style={{width: 5, height: 212.5, backgroundColor: 'white'}}>
                                                </SafeAreaView>
                                                <SafeAreaView style={{
                                                    position: 'relative', left:0, top: -213,
                                                    maxHeight: 216, height: 216, width: 25, overflow: 'hidden'}}>
                                                    <Draggable
                                                        x={0}
                                                        y={200}
                                                        minX={0}
                                                        maxX={0}
                                                        minY={0}
                                                        maxY={213}
                                                        onPressIn={()=>{this.setState({se: false});}}
                                                        onDrag={(e,g)=>{this.setFS(e,g,i)}}
                                                        onRelease={(e,w)=>{this.MakeFS(e,w,i); this.setState({se: true});}}
                                                    >
                                                        <SafeAreaView style={{width: 25, height: 15, backgroundColor: 'white', borderRadius: 5, position: 'relative', left: -5}}>
                                                        </SafeAreaView>
                                                    </Draggable>
                                                </SafeAreaView>
                                            </SafeAreaView>
                                        )
                                    })}
                                    {this.state.pics.map((el,i)=> {
                                        let display = 'none';
                                        let toS = 0;
                                        if (this.state.inputD[i] === "none" && i === this.state.ppi) {
                                            display = 'flex';
                                            if (this.state.nadpisi) {
                                                if (this.state.nadpisi[i] && this.state.nadpisi[i].length) toS = 1;
                                            }
                                        }
                                        this.NR[i] = React.createRef();
                                        let x = Math.ceil(this.maxWidth/3);
                                        if (this.state.nadpisi[i]) {
                                            x = Math.ceil(this.maxWidth/2) - this.state.nadpisi[i].length * 5;
                                        }

                                        let y = Math.ceil(this.maxHeight/2.5);
                                        let styl = {
                                            position: 'absolute',
                                            left: '26.4%',
                                            top: 0,
                                            width: this.maxWidth,
                                            height: this.maxHeight,
                                            overflow: 'hidden',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignContent: 'center',
                                            display: display
                                        };
                                        if (width < 900) {
                                            styl = {
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                width: this.maxWidth,
                                                height: this.maxHeight,
                                                overflow: 'hidden',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                alignContent: 'center',
                                                display: display
                                            };
                                        }
                                        let clr = '#000';
                                        let bckclr = 'transparent';
                                        let fs = 20;
                                        if (this.state.nadpFS[i]) {
                                            fs = this.state.nadpFS[i];
                                        }
                                        if (this.state.ndpClr[i]) {
                                            clr = this.state.ndpClr[i];
                                        }
                                        if (this.state.ndpBClr[i]) {
                                            bckclr = this.state.ndpBClr[i];
                                        }
                                        let chrds = {position: 'absolute'};
                                        if (this.state.chrds[i]) {
                                            if (this.state.chrds[i].x !== -1) {
                                                chrds['left'] = this.state.chrds[i].x * this.maxWidth;
                                                if (chrds['left'] > (this.maxWidth*0.85)) {
                                                    chrds['left'] = this.maxWidth*0.85;
                                                }
                                                if (chrds['left'] < (this.maxWidth*0.1)) {
                                                    chrds['left'] = this.maxWidth*0.1;
                                                }
                                            }
                                            if (this.state.chrds[i].y !== -1) {
                                                chrds['top'] = this.state.chrds[i].y * this.maxHeight;
                                                if (chrds['top'] > (this.maxHeight*0.85)) {
                                                    chrds['top'] = this.maxHeight*0.85;
                                                }
                                                if (chrds['top'] < (this.maxHeight*0.1)) {
                                                    chrds['top'] = this.maxHeight*0.1;
                                                }
                                            }
                                        }
                                        return (
                                            <SafeAreaView key={i} style={styl}>
                                                {toS ?
                                                    <SafeAreaView style={{position: 'absolute', top: tp + 230, left: lft, flexDirection: 'row', zIndex: 9999}}>
                                                        <TouchableOpacity onPressOut={()=>{this.stopRota()}} onPressIn={()=>{this.rota('l', i)}}>
                                                            <Text style={styles.arws}>&#x021B6;</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{marginLeft: 5}} onPressOut={()=>{this.stopRota()}} onPressIn={()=>{this.rota('r', i)}}>
                                                            <Text style={styles.arws}>&#x021B7;</Text>
                                                        </TouchableOpacity>
                                                    </SafeAreaView>
                                                    : null
                                                }
                                                <Draggable
                                                    x={x}
                                                    y={y}
                                                    minY={0}
                                                    minX={0}
                                                    maxX={this.maxWidth}
                                                    maxY={this.maxHeight}
                                                    onPressIn={()=>{this.setState({se: false});}}
                                                    onRelease={(e,w)=>{this.MakeChoords(e,w,i); this.setState({se: true});}}
                                                >
                                                    <Text ref={this.NR[i]}
                                                          style={[{fontFamily: 'Tahoma', fontSize: fs,
                                                              fontWeight: 'bold', color: clr, transform: [{"rotate": this.state.rotas[i]+'deg'}],
                                                              backgroundColor: bckclr}]}>{this.state.nadpisi[i]}</Text>
                                                </Draggable>
                                            </SafeAreaView>
                                        )
                                    })}
                                </SafeAreaView>
                            </SafeAreaView>
                        </SafeAreaView>
                    </ScrollView>
                    </SafeAreaView>
                    <SafeAreaView style={[styles.bottom, {height: bh, maxHeight: bh, minHeight: bh}]}>
                        <TouchableOpacity onPress={()=>{this.nadpis()}}>
                            <Image source={aa} style={{width: aaw, height: aah, resizeMode: 'cover', marginTop: 10}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.showCircle()}}>
                            <Image source={cirl} style={{width: cw, height: ch, resizeMode: 'cover', marginLeft: 30, marginTop: 10}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.showBackCircle()}}>
                            <Image source={aaa} style={{width: aaaw, height: aaah, resizeMode: 'cover', marginLeft: 30, marginTop: 10}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.addPic()}}>
                            <Image source={dd} style={{width: ddw, height: ddw, resizeMode: 'cover', marginLeft: 30, marginTop: 10}}/>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Container>
            )
        } else if (this.state.step === 2) {
            this.opisref = React.createRef();
            let mt = 0, ml = 20, fs = 26, pl = 45, ttp=-21, pl2 = 134, mtt = 5, pl3 = 34, pl3n = 47;
            let FS1 = 24, kw = 34, kh = 35, MTT = 40, h1 = 30, MT2 = 40, FSFS = 26, icoS = 70;
            let coef = width / 900;
            if (coef < 0.5) coef = 0.5;
            if (width < 900) {
                mt = -5;
                ml = 5;
                fs = 18;
                pl = 25; icoS = 60;
                ttp = -26;
                FSFS = Math.ceil(FS1 * coef);
                pl2 = 75;
                mtt = 10;
                pl3 = 17;
                pl3n = 26;
                FS1 = Math.ceil(FS1 * coef);
                kw = Math.ceil(kw * coef);
                kh = Math.ceil(kh * coef);
                h1 = 30;
                MTT = 5;
                MT2 = 0;
            }
            if (FSFS < 18) FSFS = 18;
            if (kw < 22) kw = 22;
            if (kh < 22) kh = 22;
            if (FS1 < 15) FS1 = 15;
            this.inpContRef = React.createRef();
            return (
                <Container style={{fontFamily: 'Tahoma', paddingTop: 10}}>
                    <View>
                        <StatusBarBG style={{backgroundColor: "transparent"}} />
                    </View>
                    <SafeAreaView style={{display: 'flex', flex: 1, alignItems: 'center',
                        alignContent: 'center', justifyContent: 'center', width: '100%', height: h1,
                        minHeight: h1, marginTop: 10,
                        maxHeight: h1}}>
                        <SafeAreaView style={{display: 'flex',
                            flexDirection: 'row', flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            alignContent: 'center',
                            padding: 0,
                            marginTop: MTT,
                            fontSize: 28,
                            height: h1,
                            minHeight: h1,
                            maxHeight: h1,
                            maxWidth: 900,
                            width: '100%',
                            flex: 1}}>
                            <TouchableOpacity onPress={()=>{this.cancel();}}>
                                <Image source={krest} style={{resizeMode: 'cover', width: kw, height: kh, marginTop: mt, marginLeft: 10}}/>
                            </TouchableOpacity>
                            <Text style={{textTransform: 'uppercase', fontWeight: 'bold', fontSize: FS1, marginTop: mt, fontFamily: 'ProximaNova'}}>редактирование</Text>
                            <TouchableOpacity onPress={()=>{this.finish();}}>
                                <Text style={{fontFamily: 'ProximaNova',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    backgroundColor: '#ff0068',
                                    fontSize: FS1,
                                    marginTop: mt,
                                    marginRight: 10}}> готово </Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </SafeAreaView>
                    <SafeAreaView style={{display: 'flex',
                        flexDirection: 'row', flexWrap: 'wrap', marginTop: MT2,
                        justifyContent: 'center', flex: 1,  maxHeight: 160, minHeight: 160, height: 160}}>
                        <SafeAreaView style={{ maxHeight: 160, minHeight: 160, height: 160, maxWidth: this.maxWidth - 20, width: this.maxWidth - 20, backgroundColor: '#f9f9f9'}}>
                            <SafeAreaView style={{maxWidth: this.maxWidth - 20, width: this.maxWidth - 20, backgroundColor: '#f9f9f9',
                                maxHeight: 160, minHeight: 160, height: 160, display: 'flex',
                                flexDirection: 'row', flexWrap: 'nowrap',
                                justifyContent: 'flex-start', flex: 1}}>
                                <Image source={this.state.pics[0]}
                                       style={{resizeMode: 'cover', width: 84, height: 150, borderRadius: 0, marginLeft: 5, marginTop: 5}}/>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={4}
                                    ref={this.opisref}
                                    placeholder="Добавьте подпись..."
                                    placeholderTextColor="#cecece"
                                    style={{width: '70%', height: 150, marginLeft: ml, marginTop: 5, color: 'grey', fontSize: FSFS}}
                                    onChangeText={(text) => {
                                        if (text.length <= 150) this.setState({text})
                                    }}
                                    onFocus={()=>{
                                        this.inpContRef.current.setNativeProps({marginTop: 300});
                                    }}
                                    onEndEditing={()=>{
                                        this.inpContRef.current.setNativeProps({marginTop: -20});
                                    }}
                                    onBlur={()=>{
                                        this.inpContRef.current.setNativeProps({marginTop: -20});
                                    }}
                                    value={this.state.text}/>
                            </SafeAreaView>
                        </SafeAreaView>
                    </SafeAreaView>
                    <SafeAreaView style={{display: 'flex',
                        flexDirection: 'row', flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignContent: 'flex-start',
                        alignItems: 'flex-start', height: 170, maxHeight: 170,
                        flex: 1}}>
                        <SafeAreaView style={{flexDirection: 'column', marginTop: 10, maxWidth: 900, width: '100%', maxHeight: 170, height: 170, alignContent: 'flex-start',
                            alignItems: 'flex-start' , justifyContent: 'flex-start',}}>
                            <Input
                                onFocus={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: 300});
                                }}
                                onEndEditing={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: -20});
                                }}
                                onBlur={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: -20});
                                }}
                                placeholder="ЗАГОЛОВОК"
                                placeholderTextColor="#cecece"
                                style={{width: '90%', maxHeight: 30, marginLeft: 10, marginTop: 1, color: 'grey', fontSize: FSFS}}
                                onChangeText={(title) => this.setState({title})}
                                defaultValue={this.state.title}/>
                            <Input
                                onFocus={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: 300});
                                }}
                                onEndEditing={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: -20});
                                }}
                                onBlur={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: -20});
                                }}
                                placeholder="ГОРОД"
                                placeholderTextColor="#cecece"
                                style={{width: '90%', maxHeight: 30, marginLeft: 10, marginTop: 1, color: 'grey', fontSize: FSFS}}
                                onChangeText={(city) => this.setState({city})}
                                defaultValue={this.state.city}/>
                            <Input
                                onFocus={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: 300});
                                }}
                                onEndEditing={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: -20});
                                }}
                                onBlur={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: -20});
                                }}
                                placeholder="ДАТА"
                                placeholderTextColor="#cecece"
                                style={{width: '90%', maxHeight: 30, marginLeft: 10, marginTop: 1, color: 'grey', fontSize: FSFS}}
                                onChangeText={(data) => this.setState({data})}
                                defaultValue={this.state.data}/>
                            <Input
                                onFocus={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: 300});
                                }}
                                onEndEditing={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: -20});
                                }}
                                onBlur={()=>{
                                    this.inpContRef.current.setNativeProps({marginTop: -20});
                                }}
                                placeholder="ВРЕМЯ"
                                placeholderTextColor="#cecece"
                                style={{width: '90%', maxHeight: 30, marginLeft: 10, marginTop: 1, color: 'grey', fontSize: FSFS}}
                                onChangeText={(time) => this.setState({time})}
                                defaultValue={this.state.time}/>
                        </SafeAreaView>
                    </SafeAreaView>
                    <SafeAreaView ref={this.inpContRef} style={{display: 'flex',
                        flexDirection: 'row', flexWrap: 'wrap',
                        justifyContent: 'center',
                        flex: 1, marginTop: -20}}>
                        <SafeAreaView style={{maxWidth: this.maxWidth - 10, height: 400, display: 'flex',
                            flexDirection: 'column', flexWrap: 'wrap',
                            justifyContent: 'flex-start', flex: 1}}>
                            <SafeAreaView style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', maxWidth: this.maxWidth - 20,
                                justifyContent: 'space-between', flex: 1, marginLeft: ml, maxHeight: 40, marginRight: ml}}>
                                <Text style={{fontFamily: 'Tahoma', color: '#cecece', fontSize: fs}}>Кто может видеть событие?</Text>
                                <TouchableOpacity onPress={()=>{this.setviewers()}} style={{position: 'relative', top: -10, left: 0}}>
                                    {this.state.cansee ?
                                        <SafeAreaView style={{flexWrap: 'nowrap', maxHeight: 40, flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                                            <Text style={{
                                                fontSize: fs - 2,
                                                marginTop: 4,
                                                textTransform: 'uppercase',
                                                fontFamily: 'Tahoma'
                                            }}>Все </Text>
                                            <Text style={{
                                                color: '#f7006b',
                                                fontSize: 56,
                                                marginTop: -10
                                            }}>&rsaquo;</Text>
                                        </SafeAreaView>
                                        :
                                        <SafeAreaView style={{flexWrap: 'nowrap', maxHeight: 40, flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                                            <Text style={{
                                                fontSize: fs - 6,
                                                marginTop: 4,
                                                textTransform: 'uppercase',
                                                fontFamily: 'Tahoma'
                                            }}>Подписчики </Text>
                                            <Text style={{
                                                color: '#f7006b',
                                                fontSize: 56,
                                                marginTop: -10
                                            }}>&rsaquo;</Text>
                                        </SafeAreaView>
                                    }
                                </TouchableOpacity>
                            </SafeAreaView>
                            <SafeAreaView style={{width: '100%', height: 2, backgroundColor: '#eeeeee'}}></SafeAreaView>
                            <SafeAreaView style={{display: 'flex',
                                flexDirection: 'row', flexWrap: 'wrap', maxWidth: this.maxWidth-20,
                                justifyContent: 'space-between', flex: 1, marginLeft: ml, marginTop: mtt, maxHeight: 40, marginRight: 0}}>
                                <Text style={{marginTop: 4, color: '#cecece', fontSize: fs-2, fontFamily: 'Tahoma'}}>Кто может комментировать событие?</Text>
                                <TouchableOpacity onPress={()=>{this.setcom()}} style={{position: 'absolute', top: -5, right: 1}}>
                                    {this.comsetup()}
                                </TouchableOpacity>
                            </SafeAreaView>
                            <SafeAreaView style={{width: '100%', height: 2, backgroundColor: '#eeeeee'}}></SafeAreaView>
                            <SafeAreaView style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: this.maxWidth-20,
                                justifyContent: 'space-between', flex: 1, marginLeft: ml, marginTop: 5, maxHeight: 40, marginRight: 0}}>
                                <Text style={{color: '#cecece', fontSize: fs, fontFamily: 'Tahoma', marginTop: 4}}>Регистрация?</Text>
                                <TouchableOpacity onPress={()=>{this.setRega()}} style={{position: 'relative', top: -12, left: 0}}>
                                    {this.state.rega ?
                                        <SafeAreaView style={{flexWrap: 'nowrap', maxHeight: 40, flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: fs - 2, textTransform: 'uppercase', fontFamily: 'Tahoma', marginTop: 0}}>Да </Text>
                                            <Text style={{
                                                color: '#f7006b',
                                                fontSize: 56,
                                                marginTop: -12
                                            }}>&rsaquo;</Text>
                                        </SafeAreaView>
                                        :
                                        <SafeAreaView style={{flexWrap: 'nowrap', maxHeight: 40, flexDirection: 'row', alignContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: fs-2, textTransform: 'uppercase', fontFamily: 'Tahoma', marginTop: 0}}>Нет </Text>
                                            <Text style={{
                                                marginTop: -14,
                                                color: '#f7006b',
                                                fontSize: 56
                                            }}>&rsaquo;</Text>
                                        </SafeAreaView>
                                    }
                                </TouchableOpacity>
                            </SafeAreaView>
                            <SafeAreaView style={{width: '100%', height: 2, backgroundColor: '#eeeeee'}}></SafeAreaView>
                            <SafeAreaView style={{display: 'flex',
                                flexDirection: 'row', flexWrap: 'wrap',
                                justifyContent: 'space-between', flex: 1, marginLeft: 20, marginTop: 10, maxHeight: 40, marginRight: 20}}>
                                <Text style={{color: '#cecece', fontSize: fs, fontFamily: 'ProximaNova'}}>Поделиться</Text>

                            </SafeAreaView>

                            <SafeAreaView style={{display: 'flex',
                                flexDirection: 'row', flexWrap: 'wrap',
                                justifyContent: 'flex-start', flex: 1, marginLeft: 20, marginTop: 5}}>
                                <TouchableOpacity onPress={()=>{this.setState({shar1: !this.state.shar1})}}>
                                    {this.state.shar1 ?
                                        <Image source={share11} style={{resizeMode: 'cover', width: icoS, height: icoS}}/>
                                        :
                                        <Image source={share1} style={{resizeMode: 'cover', width: icoS, height: icoS}}/>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginLeft: 5}} onPress={()=>{this.setState({shar2: !this.state.shar2})}}>
                                    {this.state.shar2 ?
                                        <Image source={share21} style={{resizeMode: 'cover', width: icoS, height: icoS}}/>
                                        :
                                        <Image source={share2} style={{resizeMode: 'cover', width: icoS, height: icoS}}/>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginLeft: 5}} onPress={()=>{this.setState({shar3: !this.state.shar3})}}>
                                    {this.state.shar3 ?
                                        <Image source={share31} style={{resizeMode: 'cover', width: icoS, height: icoS}}/>
                                        :
                                        <Image source={share3} style={{resizeMode: 'cover', width: icoS, height: icoS}}/>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginLeft: 5}} onPress={()=>{this.setState({shar4: !this.state.shar4})}}>
                                    {this.state.shar4 ?
                                        <Image source={share41} style={{resizeMode: 'cover', width: icoS, height: icoS}}/>
                                        :
                                        <Image source={share4} style={{resizeMode: 'cover', width: icoS, height: icoS}}/>
                                    }
                                </TouchableOpacity>
                            </SafeAreaView>
                        </SafeAreaView>
                    </SafeAreaView>
                    <SafeAreaView></SafeAreaView>
                </Container>
            )
        }
    }
}

const styles = StyleSheet.create({
    fs: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        color: '#dbd6d6',
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: 'nowrap',
        flex: 1
    },
    bottom: {
        width: '100%',
        maxHeight: 120,
        height: 120,
        backgroundColor: '#fff',
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    plaha: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        width: width-50,
        height: 5,
    },
    arws: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white',
        backgroundColor: '#939393',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 7
    },
    inp: {
        borderWidth: 0,
        width: '100%',
        borderColor: '#bbbbbb',
        borderStyle: 'solid',
        borderRadius: 4,
        backgroundColor: '#fafafa',
        position: 'relative',
        zIndex: 999
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
        flex: 1
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
    modalView2: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        elevation: 5
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