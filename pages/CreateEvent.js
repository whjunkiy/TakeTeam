import React from "react";
import store from '../redux/store';
import {cancelPost, createPost, newPostLastStep, newPostFinish} from "../redux/actions";
import {View, Button, Dimensions, StyleSheet, Image, ScrollView, TextInput, 
    ActivityIndicator, SafeAreaView} from "react-native";
import {Container, Form, Input, Item} from 'native-base';
import Bottom from "../components/Bottom";
import * as ImagePicker from "expo-image-picker";
const { width, height } = Dimensions.get('screen');
import preview from '../assets/preview.png';
import {Text, TouchableOpacity, Alert, Modal, Platform} from "react-native";
import {TouchableHighlight} from "react-native-gesture-handler";
import l_arrow from "../assets/l_arrow.png";
import r_arrow from "../assets/r_arrow.png";
import krest from '../assets/x.png';
import aa from '../assets/aa.png';
import aaa from '../assets/aaa.png';
import cirl from '../assets/cirl.png';
import zamok from '../assets/zamok.png';
import dd from '../assets/dd.png';
import share1 from '../assets/share1.png';
import share2 from '../assets/share2.png';
import share3 from '../assets/share3.png';
import share4 from '../assets/share4.png';
import lolgo from '../assets/lolgo.png';
import share11 from '../assets/share11.png';
import share21 from '../assets/share21.png';
import share31 from '../assets/share31.png';
import share41 from '../assets/share41.png';
import * as Permissions from 'expo-permissions';
import shagy from '../assets/shag.png';
import Slider from '@react-native-community/slider';
import MyColrPicker from "../components/MyColrPicker";
import Draggable from 'react-native-draggable';
import StatusBarBG from "../components/StatusBarBG";
import Constants from 'expo-constants';

export default class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.ph = height - 720;
        this.pw = width;
        this.maxWidth = width;
        this.maxHeight = height;
        this.coef = 1.78;
        this.ekr = height / width;
        this.se = true;
        this.inpContRef = null;
        /*if (this.ekr > 1.77) {
            this.se = false;
        }*/
        this.msRef = React.createRef();
        if (width >= 900) {
            this.pw = 900;
            this.maxWidth = 900;
            this.maxHeight = 1600;
        } else {
            this.pw = width;
            this.maxWidth = width;
            this.maxHeight = width * 1.78;
        }
        this.NR = [];
        let city = '';
        this.nCstate = store.getState();
        if (this.nCstate.login.info.hasOwnProperty('city')) {
            if (this.nCstate.login.info.city !== '...') {
                city = this.nCstate.login.info.city;
            }
        }
        this.main = 430;
        this.picw = null;
        this.pich = null;
        this.navi = this.props.navigation;
        this.nadp = [];
        this.gref = [];
        this.textInput = null;
        this.setTextInputRef = element => {
            this.textInput = element;
        };
        this.opisref = 2;
        this.state = {
            step: 0,
            needfoto: null,
            pics: [],
            cancom: 1,
            cansee: 1,
            setted: null,
            ppi: 0, se: this.se,
            pich: null,
            picw: null,
            stepStatus: 0,
            inputW: ['100%'],
            inputD: ['none'],
            nadpisi: [],
            chrds: [],
            text: '',
            nadpFS:[],
            wcs: 'all',
            wcc: 'all',
            isLoading: false,
            modalVisible: false,
            modalText: '',
            rega: 0,
            title: '',
            data: '',
            time: '',
            city: city,
            cd: 'none',
            c4: null,
            ndpClr:[],
            ndpBClr:[],
            DY: [],
            rotas: [],
            shar1: 1,
            shar2: 1,
            shar3: 1,
            shar4: 1,
        }
        this.timer = null;
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
        //this.setState({pics: picas});
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
        let dgr = this.state.rotas[i];
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
        store.subscribe(() => {
            if (this._isMounted) {
                const state = store.getState();
                if (state.page.disabled !== this.state.isLoading) {
                    this.setState({isLoading: state.page.disabled})
                }
                if (this.state.step !== state.newpost.step || this.stepStatus !== state.newpost.stepStatus) {
                    if (state.newpost.step === 1 ) {
                        let pich = null;
                        let picw = null;
                        let inputW = ['100%'];
                        let inputD = ['none'];
                        let pics = [];
                        let setted = state.newpost.pics[0];
                        pics = state.newpost.pics;
                        if (state.newpost.needfoto) {
                            /*
                            if (pics[0]['height'] > (height - this.main) || pics[0]['width'] > width) {
                                if (pics[0]['height'] > pics[0]['width']) {
                                    let ratio = (height - this.main) / pics[0]['height'];
                                    pich = height - this.main;
                                    picw = pics[0]['width'] * ratio;
                                } else {
                                    let ratio = this.pw / pics[0]['width'];
                                    picw = this.pw;
                                    pich = pics[0]['height'] * ratio;
                                }
                            } else {
                                pich = pics[0]['height'];
                                picw = pics[0]['width'];
                            }
                            */
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
                        }
                        let ndpClr = [];
                        let ndpBClr = [];
                        let nadpFS = [];
                        let chrds = [];
                        let DY = [];
                        let rotas = [];
                        for (let i in pics) {
                            ndpClr.push('#000');
                            ndpBClr.push('transparent');
                            nadpFS.push(20);
                            DY.push(200);
                            chrds.push({x:-1,y:-1});
                            rotas.push(0);
                        }
                        this.setState({
                            needfoto: state.newpost.needfoto,
                            step: state.newpost.step,
                            pics: state.newpost.pics,
                            setted: setted,
                            ppi: 0,
                            stepStatus: state.newpost.stepStatus,
                            nadpFS: nadpFS,
                            chrds: chrds,
                            DY: DY,
                            pich: pich,
                            picw: picw,
                            inputW: inputW,
                            inputD: inputD,
                            ndpClr: ndpClr,
                            ndpBClr: ndpBClr,
                            rotas: rotas
                        });
                    } else if (state.newpost.step === 2) {
                        this.setState({step: 2});
                        setTimeout(()=>{
                            if (this.opisref.current) this.opisref.current.focus();
                        },200);
                    } else if (state.newpost.step === 3) {
                        store.dispatch(cancelPost());
                        setTimeout(()=>{
                            if (this._isMounted) {
                                this.setState({modalText: 'Пост успешно создан!', modalVisible: true});
                            }
                        }, 500);
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
                            ndpClr: [],
                            DY: [],
                            ndpBClr: [],
                            text: '',
                            wcc: 'all',
                            rotas: []
                        });
                    } else if (state.newpost.step === -1) {
                        store.dispatch(cancelPost());
                        setTimeout(()=>{
                            if (this._isMounted) {
                                this.setState({modalText: 'Не вышло :(', modalVisible: true});
                            }
                        }, 500);

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
            this.setState({inputD: 'none', nadpisi: [], ndpClr:[], nadpFS: [], ndpBClr:[], DY: [], chrds: [], rotas: []});
            store.dispatch(cancelPost());
        }
    }

    lastStep() {
        if (this._isMounted) {
            store.dispatch(newPostLastStep(this.state.nadpisi, this.state.ndpClr, this.state.ndpBClr, this.state.nadpFS, this.state.chrds,this.state.rotas));
        }
    }

    async checkMultiPermissions() {
        if (Platform.OS === 'web') {
            return 1;
        }
        /*const { status0 } = await ImagePicker.getMediaLibraryPermissionsAsync();
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
            //const { status2, permissions2 } = await Permissions.askAsync(Permissions.CAMERA);
            const { status3, permissions3 } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
            if (status3 !== 'granted') {
                return 0;
            }
        }
        return 1;
    }

    async firstStep(load) {
        if (this._isMounted) {
            let needfoto = null;
            let pics = [];
            if (load) {
                let perms = await this.checkMultiPermissions();
                if (!perms) {
                    needfoto = 0;
                    pics = [preview];
                    this.pich = this.maxWidth * 1.78;
                    this.picw = this.maxWidth;
                    store.dispatch(createPost(needfoto, pics));
                    return;
                }
                try {
                    let result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: false,
                        quality: 1,
                        allowsMultipleSelection: true,
                        base64: true
                    });
                    if (!result.cancelled) {
                        needfoto = 1;
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
                            needfoto = 1;
                        } else {
                            this.cancel();
                        }
                    } else {
                        alert('Unknown Error: ' + JSON.stringify(err));
                        this.cancel();
                    }
                }
            } else {
                needfoto = 0;
                pics = [preview];
                this.pich = this.maxWidth * 1.78;
                this.picw = this.maxWidth;

            }
            store.dispatch(createPost(needfoto, pics));
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
        this.setState({
            setted: this.state.pics[ppi],
            ppi: ppi,
            picw: picw,
            pich: pich,
            inputW: inputW,
            inputD: inputD});
    }

    plaha() {
        if (this.state.pics.length > 1) {
            const plw = Math.ceil(width / this.state.pics.length) - 5;
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
                                        width: plw,
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
                store.dispatch(newPostFinish(this.nCstate.login.email, this.nCstate.login.token, this.state));
            }
            else {
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
            let created = 0;
            if (this.state.modalText === "Пост успешно создан!"){
                created = 1;
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
                            <SafeAreaView style={[styles.centeredView, {borderWidth: 0, paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10}]}>
                                {created ?
                                    <SafeAreaView style={[styles.modalView2, {alignItems: 'center', alignContent: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10}]}>
                                        <Image source={shagy} style={{width: imgS, height: imgS, resizeMode: 'stretch'}}/>
                                        <Text style={[styles.modalText, {fontFamily: 'Tahoma', color: "#747474", fontSize: fs3, maxWidth: imgS + 20}]}>Ваше событие успешно создано!</Text>
                                        <TouchableOpacity
                                            style={[styles.button, styles.buttonClose, {width: 150, backgroundColor:'#ff0073'}]}
                                            onPress={() => {
                                                this.setState({modalVisible: false});
                                                store.dispatch({type: "REFRESHEVENTS"});
                                                this.navi.navigate('MainList', {title: 'Главная'})
                                            }
                                            }
                                        >
                                            <Text style={[styles.textStyle, {fontFamily: 'ProximaNova', color: 'white', textTransform: 'uppercase'}]}>Отлично!</Text>
                                        </TouchableOpacity>
                                    </SafeAreaView>
                                :
                                    <SafeAreaView style={[styles.modalView2, {padding: 20}]}>
                                        <Text style={[styles.modalText, {fontFamily: 'Tahoma'}]}>{this.state.modalText}</Text>
                                        <TouchableOpacity
                                            style={[styles.button, styles.buttonClose, {backgroundColor:'#ff0073'}]}
                                            onPress={() => this.setState({modalVisible: false}) }
                                        >
                                            <Text style={[styles.textStyle, {fontFamily: 'ProximaNova', color: 'white', textTransform: 'uppercase'}]}>Хорошо</Text>
                                        </TouchableOpacity>
                                    </SafeAreaView>
                                }
                            </SafeAreaView>
                        </Modal>
                    </SafeAreaView>
                </Container>
            )
        }
        if (this.state.step === 0) {
            let bw = 300, bh = 50, fs = 20, picW = 206, picH = 270, mt1 = 20, mt2 = 50;
            let coef = width / 900;
            if (coef < 0.5) coef = 0.5;
            if (width < 900) {
                bw = Math.ceil(bw * coef);
                bh = Math.ceil(bh * coef);
                picW = Math.ceil(picW * coef);
                picH = Math.ceil(picH * coef);
                fs = Math.ceil(fs * coef);
                mt1 = 10;
                mt2 = 30;
            }
            if (fs < 12) fs = 12;
            if (bh < 30) bh = 30;
            if (bw < 160) bw = 160;
            bw = bw * 1.3;
            bh = bh * 1.3;
            fs = Math.ceil(fs*1.5);
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
                            <Text style={{textTransform: 'uppercase', fontWeight: 'bold', fontFamily: 'ProximaNova'}}>новый пост</Text>
                            <Image source={r_arrow} style={{width: 24, height: 24}}/>
                        </SafeAreaView>
                        <SafeAreaView style={{maxWidth: 900, width: '100%', minHeight: this.ph+180, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            <TouchableHighlight onPress={()=>{this.firstStep(1)}}
                                              style={{borderRadius: 5, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: bw, minHeight: bh, maxHeight: bh, backgroundColor: '#fe0074'}}>
                                    <Text style={{color: 'white', fontFamily: 'ProximaNova', textTransform: 'uppercase', fontWeight: 'bold', fontSize: fs}}>Загрузить постеры</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={{marginTop: mt1, borderRadius: 5, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: bw, minHeight: bh, maxHeight: bh, backgroundColor: '#dad6d5'}} onPress={()=>{this.firstStep(0)}}>
                                <Text style={{color: 'white', fontFamily: 'ProximaNova', textTransform: 'uppercase', fontWeight: 'bold', fontSize: fs}}>Пропустить</Text>
                            </TouchableHighlight>
                            <Image source={lolgo} style={{width: picW, height: picH, marginTop: mt2}}/>
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
            let MH = this.maxHeight;
            let FS1 = 24, kw = 34, kh = 35, MTT = 40, h1 = 30, MT2 = 5, PT = 0;
            if (Platform.OS === 'ios') PT = Constants.statusBarHeight;
            let aaw= 59, aah = 42, cw=49, ch = 49, aaaw= 72, aaah = 49, ddw = 47;
            if (coef < 0.5) coef = 0.5;
            if (width < 900) {
                mt = 0;
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
                bh = 50;
                MTT = 5;
                pstn = 'absolute';
                se = false;
                h1 = 30;
                MT2 = 5;
                //MH = MH;
            }
            this.msRef = React.createRef();
            if (kw < 22) kw = 22;
            if (kh < 22) kh = 22;
            if (h1 < 30) h1 = 30;
            if (FS1 < 15) FS1 = 15;
            let pptt = 2;
            bh = 40;
            let totalHeight = height - (h1+bh+70);
            if (Platform.OS === 'ios') {
                pptt = 12;
                h1 = 30;
                mt = 5;
                bh = 40;
                totalHeight = height - (h1 + bh + 70 + Constants.statusBarHeight);
            }

            return (
                <Container style={{fontFamily: 'Tahoma', flex: 1, display: 'flex', justifyContent: 'center', backgroundColor: 'black', paddingTop:0}}>
                    <View>
                        <StatusBarBG style={{backgroundColor: "transparent"}} />
                    </View>
                    <SafeAreaView style={{display: 'flex', flex: 1, alignItems: 'center',
                        alignContent: 'center', justifyContent: 'center', width: '100%', height: h1,
                        minHeight: h1,
                        maxHeight: h1, backgroundColor: 'white'}}>
                        <SafeAreaView style={{display: 'flex',
                            flexDirection: 'row', flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            alignContent: 'center',
                            paddingTop: pptt,
                            marginTop: MTT,
                            fontSize: 28,
                            height: h1,
                            minHeight: h1,
                            maxHeight: h1,
                            maxWidth: 900,
                            width: '100%',
                            flex: 1, backgroundColor: 'white'}}>
                            <TouchableOpacity onPress={()=>{this.cancel();}}>
                                <Image source={krest} style={{resizeMode: 'cover', width: kw, height: kh, marginTop: mt, marginLeft: 10}}/>
                            </TouchableOpacity>
                            <Text style={{textTransform: 'uppercase', fontWeight: 'bold', fontSize: FS1, marginTop: mt, fontFamily: 'ProximaNova'}}>новый пост</Text>
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
                    {this.state.pics.length > 1 ?
                        <SafeAreaView style={{
                            display: 'flex',
                            flexDirection: 'row', flexWrap: 'wrap',
                            justifyContent: 'center',
                            flex: 1,
                            width: '100%',
                            position: 'absolute',
                            top: 55,
                            minHeight: 5,
                            zIndex: 999, backgroundColor: 'black'
                        }}>
                            {this.plaha()}
                        </SafeAreaView>
                        :
                        null
                    }
                    <SafeAreaView style={{maxHeight: totalHeight}}>
                        <ScrollView style={{marginTop: MT2}} ref={this.msRef} scrollEnabled={this.state.se}>
                            <SafeAreaView style={{width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                                justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
                                <SafeAreaView style={{height: MH, width: this.maxWidth, backgroundColor: 'black', display: 'flex',
                                    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                                {this.state.pics.length ?
                                    <Image source={this.state.setted} style={{height: this.state.pich, width: this.state.picw, resizeMode: 'contain'}}/>
                                    :
                                    null
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
                                        flexDirection: "row",
                                        alignContent: "center",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexWrap: 'nowrap',
                                        flex: 1,
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
                                                       onSubmitEditing={()=>{this.nadpis()}}
                                                       onChange={e => this.setnadpis(e.nativeEvent.text)}/>
                                                )

                                            })
                                        }
                                        {this.state.pics.map((el,i) => {
                                            let dsp = 'none';
                                            let lft2 = -9.5;
                                            let mll = 0;
                                            if (Platform.OS === 'ios') { lft2 = 0; mll = 10;}
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
                                                        <SafeAreaView style={{width: 5, height: 212.5, backgroundColor: 'white', marginLeft: mll}}>
                                                        </SafeAreaView>
                                                        <SafeAreaView style={{
                                                            position: 'relative', left: lft2, top: -213,
                                                            maxHeight: 216, height: 216, width: 25, overflow: 'hidden'}}>
                                                        <Draggable
                                                            x={0}
                                                            y={200}
                                                            minX={0}
                                                            maxX={0}
                                                            minY={0}
                                                            maxY={213}
                                                            onPressIn={()=>{this.setState({se: false});}}
                                                            onDrag={(e,g)=>{this.setFS(e,g,i);}}
                                                            onRelease={(e,w)=>{ this.MakeFS(e,w,i); this.setState({se: true}); }}
                                                        >
                                                            <SafeAreaView style={{width: 25, height: 15, backgroundColor: 'white', borderRadius: 5}}>
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
                                                display: display,
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
                                                    display: display,
                                                };
                                            }
                                            return (
                                                <SafeAreaView key={i} style={styl}>
                                                    {toS ?
                                                        <SafeAreaView style={{position: 'absolute', top: tp + 350, left: lft, flexDirection: 'row'}}>
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
                                                        onRelease={(e,w)=>{ this.MakeChoords(e,w,i); this.setState({se: true});}}
                                                    >
                                                        <Text
                                                            ref={this.NR[i]}
                                                            style={{
                                                            fontSize: this.state.nadpFS[i],
                                                            fontFamily: 'Tahoma', position: 'relative',
                                                            fontWeight: 'bold', zIndex: 999,
                                                            transform: [{"rotate": this.state.rotas[i]+"deg"}],
                                                            color: this.state.ndpClr[i],
                                                            backgroundColor: this.state.ndpBClr[i]
                                                        }}>{this.state.nadpisi[i]}</Text>
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
                            <Image source={aa} style={{width: aaw, height: aah, resizeMode: 'cover', marginTop: 5}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.showCircle()}}>
                            <Image source={cirl} style={{width: cw, height: ch, resizeMode: 'cover', marginLeft: 30, marginTop: 5}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.showBackCircle()}}>
                            <Image source={aaa} style={{width: aaaw, height: aaah, resizeMode: 'cover', marginLeft: 30, marginTop: 5}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.addPic()}}>
                            <Image source={dd} style={{width: ddw, height: ddw, resizeMode: 'cover', marginLeft: 30, marginTop: 5}}/>
                        </TouchableOpacity>
                    </SafeAreaView>
                </Container>
            )
        } else if (this.state.step === 2) {
            this.opisref = React.createRef();
            let mt = 0, ml = 20, fs = 26, pl = 45, ttp=-21, pl2 = 134, mtt = 5, pl3 = 34, pl3n = 47;
            let FS1 = 24, kw = 34, kh = 35, MTT = 40, h1 = 30, MT2 = 40, FSFS = 26;
            let coef = width / 900; let icoS = 70;
            if (coef < 0.5) coef = 0.5;
            if (width < 900) {
                mt = -5;
                ml = 5;
                FSFS = Math.ceil(FS1 * coef);
                fs = 18;
                pl = 25;
                ttp = -26;
                pl2 = 75; icoS = 60;
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
                <Container style={{fontFamily: 'Tahoma', flex: 1, display: 'flex', justifyContent: 'center', paddingTop: 10}}>
                    <View>
                        <StatusBarBG style={{backgroundColor: "transparent"}} />
                    </View>
                    <SafeAreaView style={{display: 'flex', flex: 1, alignItems: 'center', marginTop: 10,
                        alignContent: 'center', justifyContent: 'center', width: '100%', height: h1,
                        minHeight: h1,
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
                            <Text style={{textTransform: 'uppercase', fontWeight: 'bold', fontSize: FS1, marginTop: mt, fontFamily: 'ProximaNova'}}>новый пост</Text>
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
                    <SafeAreaView style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: MT2,
                        justifyContent: 'center', flex: 1, maxHeight: 160, minHeight: 160, height: 160}}>
                            <SafeAreaView style={{maxWidth: this.maxWidth - 20, width: this.maxWidth - 20, minHeight: 160, backgroundColor: '#f9f9f9'}}>
                                <SafeAreaView style={{maxWidth: this.maxWidth - 20, width: this.maxWidth - 20, backgroundColor: '#f9f9f9', maxHeight: 160, display: 'flex',
                                    flexDirection: 'row', flexWrap: 'nowrap', height: 160, justifyContent: 'flex-start', minHeight: 160, flex: 1}}>
                                    <Image source={this.state.pics[0]}
                                           style={{resizeMode: 'contain', width: 84, height: 150, borderRadius: 5, marginLeft: 0, marginTop: 5}}/>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        ref={this.opisref}
                                        placeholder="Добавьте подпись..."
                                        placeholderTextColor="#cecece"
                                        style={{paddingTop: 5, paddingLeft: 5, width: '75%', height: 150, marginLeft: ml, marginTop: 5, color: 'grey', fontSize: FSFS}}
                                        onChangeText={(text) => {
                                            if (text.length <= 150) this.setState({text})}
                                        }
                                        value={this.state.text}
                                        onFocus={()=>{
                                            this.inpContRef.current.setNativeProps({marginTop: 300});
                                        }}
                                        onEndEditing={()=>{
                                            this.inpContRef.current.setNativeProps({marginTop: -20});
                                        }}
                                        onBlur={()=>{
                                            this.inpContRef.current.setNativeProps({marginTop: -20});
                                        }}/>
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
                            placeholder="ЗАГОЛОВОК"
                            placeholderTextColor="#cecece"
                            style={{width: '90%', maxHeight: 30, marginLeft: 10, marginTop: 1, color: 'grey', fontSize: FSFS}}
                            onChangeText={(title) => this.setState({title})}
                            value={this.state.title}
                            onFocus={()=>{
                                this.inpContRef.current.setNativeProps({marginTop: 300});
                            }}
                            onEndEditing={()=>{
                                this.inpContRef.current.setNativeProps({marginTop: -20});
                            }}
                            onBlur={()=>{
                                this.inpContRef.current.setNativeProps({marginTop: -20});
                            }}
                        />
                        <Input
                            placeholder="ГОРОД"
                            placeholderTextColor="#cecece"
                            style={{width: '90%', maxHeight: 30, marginLeft: 10, marginTop: 1, color: 'grey', fontSize: FSFS}}
                            onChangeText={(city) => this.setState({city})}
                            value={this.state.city}
                            onFocus={()=>{
                                this.inpContRef.current.setNativeProps({marginTop: 300});
                            }}
                            onEndEditing={()=>{
                                this.inpContRef.current.setNativeProps({marginTop: -20});
                            }}
                            onBlur={()=>{
                                this.inpContRef.current.setNativeProps({marginTop: -20});
                            }}
                        />
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
                            value={this.state.data}/>
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
                            value={this.state.time}/>
                    </SafeAreaView>
                    </SafeAreaView>
                    <SafeAreaView ref={this.inpContRef} style={{display: 'flex',
                        flexDirection: 'row', flexWrap: 'wrap',
                        justifyContent: 'center',
                        flex: 1, marginTop: -20}}>
                        <SafeAreaView style={{maxWidth: this.maxWidth - 10, height: 400, display: 'flex',
                            flexDirection: 'column', flexWrap: 'wrap',
                            justifyContent: 'flex-start', flex: 1}}>
                            <SafeAreaView style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', maxWidth: this.maxWidth-20,
                                justifyContent: 'space-between', flex: 1, marginLeft: ml, maxHeight: 40, marginRight: 0}}>
                                <Text style={{color: '#cecece', fontSize: fs, fontFamily: 'Tahoma'}}>Кто может видеть событие?</Text>
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
