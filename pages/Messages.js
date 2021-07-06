import React from "react";
import store from '../redux/store';
import {getMySms, updateSMSred, sendSMS, enablePage} from "../redux/actions";
import {
    View,
    SafeAreaView,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput
} from "react-native";
import {Container, Header, Icon, Input, Item} from 'native-base';
import {ScrollView} from "react-native";
const { width, height } = Dimensions.get('screen');
import Bottom from "../components/Bottom";
import {Image, Text} from "react-native";
import larrow from '../assets/l_arrow.png';
import krest from "../assets/x.png";
import upa from '../assets/upa.png';
import preview from '../assets/preview.png';
import bigava from "../assets/defava.png";
import {GOTSMS} from "../redux/types";
import StatusBarBG from "../components/StatusBarBG";
import {Platform} from "react-native-web";

export default class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.nCstate = store.getState();
        this.maxWidth = width;
        this.inpContRef= null;
        if (width > 900) {
            this.maxWidth = 900;
        }
        this.coef = width / 900;
        this.maxHeight = height - 100;
        this.viewref = React.createRef();
        this.navi = this.props.navigation;
        this.nick = '...';
        if (this.nCstate.login.info.hasOwnProperty('nick')) {
            this.nick = this.nCstate.login.info.nick;
        }
        this.refas = [];
        this.state = {
            inp: '',
            isLoading: true,
            sms: [],
            smsStatus: 0,
            rnd: 0,
            nick: '...',
            mail: '',
            modalVisible: false,
            smsText: '',
            msgs: [],
            ava: null,
            msgEvents:[]
        }
        this._isMounted = false;
        this.sendMessage = this.sendMessage.bind(this);
        this.read = this.read.bind(this);
        this.ckecker = this.ckecker.bind(this);
        this.getEvt = this.getEvt.bind(this);
        this.inMSG = this.inMSG.bind(this);
        this.getEvtview = this.getEvtview.bind(this);
        this.getAAA = this.getAAA.bind(this);
        this.getSizes = this.getSizes.bind(this);
    }

    getSizes(w,h){
        let neww = w;
        let newh = h;
        let maxWidth = this.maxWidth - 120;

        if (w > h) {
            if (w > maxWidth) {
                neww = maxWidth;
                let coef = (maxWidth / w);
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
            if (w > maxWidth) {
                neww = maxWidth;
                let coef = (maxWidth / w);
                newh = h * coef;
            } else {
                /*neww = this.maxWidth;
                let coef = (this.maxWidth / w);
                newh = h * coef;*/
            }
        }
        if (neww > maxWidth) {
            neww = maxWidth;
            let coef = (maxWidth / w);
            newh = h * coef;
        }
        if (newh > this.maxHeight) {
            newh = this.maxHeight;
            let coef = (this.maxHeight / h);
            neww = w * coef;
        }
        return {w: neww, h: newh}
    }

    getAAA(mail, eid){
        return (
            <SafeAreaView style={{borderRadius: 10, backgroundColor: '#fafafa'}}>
                {this.inMSG(this.state.mail, eid) ?
                    <SafeAreaView>
                        {this.getEvtview(this.state.mail, eid)}
                    </SafeAreaView>
                    :
                    <Text>Loaind...</Text>
                }
            </SafeAreaView>
        )
    }

    getEvtview(m,e) {
        for (let i in this.state.msgEvents) {
            if (this.state.msgEvents[i]['mail'] === m && this.state.msgEvents[i]['evt'] === e) {
                if (this.state.msgEvents[i].info === "noinfo") {
                    let w = this.maxWidth - 220;
                    if (width < 900) {
                        w = this.maxWidth - 120;
                    }
                    let h = w;
                    return (
                        <SafeAreaView style={{width: w, height: h, justifyContent: 'center', alignItems: 'center', alignContent:'center', backgroundColor: 'grey'}}>
                            <Text style={{fontFamily: 'ProximaNova', fontSize: 28, color: 'white'}}>
                                Это закрытая вечеринка...
                            </Text>
                        </SafeAreaView>
                    )
                } else {
                    let ava = bigava, title = '', pica = preview, nick = this.state.msgEvents[i].nick;
                    let w = this.maxWidth - 220;
                    if (width < 900) {
                        w = this.maxWidth - 120;
                    }
                    let h = w;
                    let picw = w;
                    let pich = h;
                    if (this.state.msgEvents[i].ava !== "bigava") {
                        ava = this.state.msgEvents[i].ava;
                    }
                    if (this.state.msgEvents[i].info.hasOwnProperty('title')) {
                        title = this.state.msgEvents[i].info.title;
                    }
                    if (this.state.msgEvents[i].info.pics[0] !== 'preview') {
                        pica = {uri: 'https://taketeam.net/posters/' + this.state.msgEvents[i].info.pics[0]['uri']}
                        let sizes = this.getSizes(this.state.msgEvents[i].info.pics[0]['width'], this.state.msgEvents[i].info.pics[0]['height']);
                        picw = sizes.w;
                        pich = sizes.h;
                    }
                    let opis = this.state.msgEvents[i].info.opis;
                    let txtclr = '#000';
                    let bckclr = 'transparent';
                    let nadp = '';
                    let nadpFS = 20;
                    if (this.state.msgEvents[i].info.hasOwnProperty('ndpBClr')) {
                        if (this.state.msgEvents[i].info.ndpBClr[0]) {
                            bckclr = this.state.msgEvents[i].info.ndpBClr[0];
                        }
                    }
                    if (this.state.msgEvents[i].info.hasOwnProperty('ndpClr')) {
                        if (this.state.msgEvents[i].info.ndpClr[0]) {
                            txtclr = this.state.msgEvents[i].info.ndpClr[0];
                        }
                    }
                    if (this.state.msgEvents[i].info.hasOwnProperty('nadpisi')) {
                        nadp = this.state.msgEvents[i].info.nadpisi[0];
                    }
                    if (this.state.msgEvents[i].info.hasOwnProperty('nadpFS')){
                        nadpFS = this.state.msgEvents[i].info.nadpFS[0];
                    }
                    let chrds = [];
                    if (this.state.msgEvents[i].info.hasOwnProperty('chrds')) {
                            chrds = {};
                            if (this.state.msgEvents[i].info.chrds[i].x !== -1 && this.state.msgEvents[i].info.chrds[i].y !== -1) {
                                chrds = {position: 'absolute'}
                            }
                            if (this.state.msgEvents[i].info.chrds[i].x !== -1) {
                                chrds['left'] = this.state.msgEvents[i].info.chrds[0].x * w;
                                if (chrds['left'] > (w*0.95)) {
                                    chrds['left'] = w*0.95;
                                }
                                if (chrds['left'] < (w*0.1)) {
                                    chrds['left'] = w*0.1;
                                }
                            }
                            if (this.state.msgEvents[i].info.chrds[0].y !== -1) {
                                chrds['top'] = this.state.msgEvents[i].info.chrds[0].y * h;
                                if (chrds['top'] > (h*0.85)) {
                                    chrds['top'] = h*0.85;
                                }
                                if (chrds['top'] < (h*0.1)) {
                                    chrds['top'] = h*0.1;
                                }
                            }

                    }
                    let rotas = 0;
                    if (this.state.msgEvents[i].info.hasOwnProperty('rotas')) {
                        rotas = this.state.msgEvents[i].info.rotas[0];
                    }
                    return (
                        <TouchableOpacity onPress={()=>{
                            this.navi.navigate( 'singlePost', {title: 'Событие', pid: e});
                        }}>
                            <SafeAreaView style={{paddingLeft: 20, paddingTop: 10, paddingBottom: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center'}}>
                                <Image style={{width: 50, height: 50, borderRadius: 25}} source={ava} />
                                <Text style={{marginLeft: 10, fontSize: 20, fontFamily: 'Tahoma', fontWeight: 'bold'}}>{nick}</Text>
                            </SafeAreaView>
                            <SafeAreaView style={{backgroundColor: 'grey', width: w, height: h, justifyContent: 'center', alignItems: 'center', alignContent:'center'}}>
                                <Image source={pica} style={{width: picw, height: pich}}/>
                                <Text style={[{
                                    position: 'absolute',
                                    top: '48%',
                                    fontFamily: 'Tahoma',
                                    zIndex: 9999,
                                    fontWeight: 'bold',
                                    fontSize: nadpFS,
                                    color: txtclr,
                                    transform: [{"rotate": rotas+'deg'}],
                                    backgroundColor: bckclr
                                }, chrds]}>{nadp}</Text>
                            </SafeAreaView>
                            <Text style={{fontFamily: 'Tahoma', paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>{opis}</Text>
                        </TouchableOpacity>
                    )
                }
            }
        }
        return (
            <SafeAreaView style={{width: w, height: h, justifyContent: 'center', alignItems: 'center', alignContent:'center', backgroundColor: 'grey'}}>
                <Text style={{fontFamily: 'ProximaNova', fontSize: 28, color: 'white'}}>
                    Событие не найдено...
                </Text>
            </SafeAreaView>
        )
    }

    async getEvt(evt){
        const q = {
            act: "getEVT",
            eid: evt,
            fo: this.state.mail
        };
        let response = await fetch('https://taketeam.net', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(q)
        });
        let msg = await response.json();
        if (msg.status !== "OK") return false;
        if (!this.inMSG(this.state.mail, evt)) {
            let msgEvents = this.state.msgEvents;
            if (msg.info !== "noinfo") {
                msgEvents.push({mail: this.state.mail, evt: evt, info: msg.info, ava: msg.ava, nick: msg.nick});
            } else {
                msgEvents.push({mail: this.state.mail, evt: evt, info: msg.info});
            }
            this.setState({msgEvents: msgEvents});
        }
    }

    inMSG(mail, evt) {
        for (let i in this.state.msgEvents) {
            if (this.state.msgEvents[i]['mail'] === mail && this.state.msgEvents[i]['evt'] === evt) {
                return true;
            }
        }
        return false;
    }

    async ckecker(){
        let state = store.getState();
        if (this._isMounted && state.login.status > 0) {
            //store.dispatch(getMySms(this.nCstate.login.email, this.nCstate.login.token));
            const q = {
                act: "getMySms2",
                email: state.login.email,
                token: state.login.token
            };
            let response = await fetch('https://taketeam.net', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(q)
            });
            let msg = await response.json();
            if (this._isMounted){
                let s1 = JSON.stringify(msg.info);
                let s2 = JSON.stringify(this.state.sms);
                if (this._isMounted && s1 !== s2) {
                    store.dispatch({type: 'GOTSMS', status: state.sms.status, sms: msg.info});
                    this.setState({sms: msg.info});
                }
                setTimeout(()=>{this.ckecker()}, 1000);
            }
        }
    }

    sendMessage() {
        if (!this.state.smsText.trim().length) return;
        store.dispatch(sendSMS(this.nCstate.login.email, this.nCstate.login.token, this.state.mail, this.state.smsText));
        //this.setState({modalVisible: false});
        let msgs = this.state.msgs;
        let nm = {tm: Math.ceil(new Date()/1000), txt: this.state.smsText, frm: this.nCstate.login.email};
        msgs.push(nm);
        this.setState({msgs: msgs, smsText:''});
        setTimeout(()=> {
            //this.viewref.scrollToEnd();
            this.viewref.scrollTo({ x: 0, y: 1000000, animated: true })
            //this.viewref.scrollTop(50);
        }, 300);
    }

    read(sms, ava, i) {
        store.dispatch(updateSMSred(this.nCstate.login.email, this.nCstate.login.token, sms.email));
        let msgs = [];
        let cnt = sms.sms.length;
        for (let i = cnt; i--; i>=0) {
            msgs.push(sms.sms[i]);
        }
        this.refas[i].setNativeProps({style:{fontWeight: 'normal'}});
        setTimeout(()=> {
            this.viewref.scrollTo({ x: 0, y: 1000000, animated: true })
        }, 300);
        this.setState({modalVisible: true, msgs: msgs, nick: sms.nick, ava: ava, mail: sms.email});
    }

    search(val) {}

    async componentDidMount() {
        this._isMounted = true;
        this.setState({rnd: Math.random});
        setTimeout(()=>{this.ckecker()}, 1000);
        store.dispatch(getMySms(this.nCstate.login.email, this.nCstate.login.token));
        store.subscribe(() => {
            if (this._isMounted) {
                const state = store.getState();
                if (state.page.disabled !== this.state.isLoading) {
                    this.setState({isLoading: state.page.disabled})
                }
                if (state.sms.status !== this.state.smsStatus) {
                    let s1 = JSON.stringify(state.sms.sms);
                    let s2 = JSON.stringify(this.state.sms);
                    if (s1 !== s2) {
                        this.setState({smsStatus: state.sms.status, sms: state.sms.sms})
                    }
                }
            }
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
        if (this.state.isLoading || !this._isMounted) {
            return (
                <Container style={{width: '100%', height: '100%'}}>
                    <SafeAreaView style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#ff0054" style={styles.loader}/>
                    </SafeAreaView>
                </Container>
            )
        } else if (this.state.modalVisible) {
            let w1 = this.maxWidth - 100;
            let h1 = height - 410;
            let avaS = 75, lrS = 24, fs = 24, fs2 = 26;
            let uw = 82, uh = 81, MTMT = 0;
            if (width < 900) {
                w1 = this.maxWidth;
                h1 = height - 210;
                avaS = Math.ceil(avaS * this.coef);
                lrS = Math.ceil(lrS * this.coef);
                fs = Math.ceil(fs * this.coef);
                fs2 = Math.ceil(fs2 * this.coef);
                uw = Math.ceil(uw * this.coef);
                uh = Math.ceil(uh * this.coef);
                MTMT = 15;
            }
            if (height < 600) {
                //h1 = 250;
            }
            if (lrS < 20) lrS = 20;
            if (avaS < 50) avaS = 50;
            if (fs < 12) fs = 12;
            if (fs2 < 12) fs2 = 12;
            let tt = -20;
            let osh = h1-60;
            let inpw = '80%';
            let spsp = 35;
            if (Platform.OS === 'ios') {
                tt = 0;
                spsp = 5;
                osh = height - 350;
                w1 = width - 20;
                inpw = '70%';
            }
            this.inpContRef = React.createRef();
            return (
                <Container style={{fontFamily: 'Tahoma'}}>
                    <View>
                        <StatusBarBG style={{backgroundColor: "transparent"}} />
                    </View>
                    <View>
                        <StatusBarBG style={{backgroundColor: "transparent"}} />
                    </View>
                    <SafeAreaView style={[styles.centeredView]}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={true}
                            style={{borderWidth: 0}}
                        >
                            <SafeAreaView ref={this.inpContRef} style={[styles.centeredView, {borderWidth: 0, width: width, position: 'relative', top: tt}]}>
                                <SafeAreaView style={[styles.modalView, {width: w1, padding: spsp}]}>
                                    <SafeAreaView style={{
                                        width: w1,
                                        marginTop: tt+10,
                                        paddingLeft: 20,
                                        flexDirection: 'row',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        minHeight: avaS + 20,
                                        justifyContent: 'flex-start'}}>
                                        <TouchableOpacity onPress={()=>{
                                            this.setState({modalVisible: false})
                                            }}>
                                            <Image source={larrow} style={{width: lrS, height: lrS}} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{
                                            this.setState({modalVisible: false});
                                            store.dispatch({type:"SETPROFILE", mail: this.state.mail, whom: 0});
                                            this.navi.navigate('profile', {whom: 0, email: this.state.mail})
                                        }}>
                                            <Image source={this.state.ava} style={{marginLeft: 10, width: avaS, height: avaS, borderRadius: Math.ceil(avaS / 2)}} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=>{
                                            this.setState({modalVisible: false});
                                            store.dispatch({type:"SETPROFILE", mail: this.state.mail, whom: 0});
                                            this.navi.navigate('profile', {whom: 0, email: this.state.mail})
                                        }}>
                                            <Text style={{marginLeft: 10, fontFamily: 'ProximaNova', fontSize: fs}}>{this.state.nick}</Text>
                                        </TouchableOpacity>
                                    </SafeAreaView>

                                    <SafeAreaView style={{marginTop: 10, marginBottom: 5, width: '100%', height: 1, backgroundColor: '#b9b9b9'}}></SafeAreaView>

                                    <SafeAreaView  style={{maxHeight: osh, width: w1}}>
                                        <ScrollView ref={ref=>{this.viewref = ref}}>
                                        {this.state.msgs.map((t,i)=>{
                                            let date = new Date(t.tm*1000);
                                            let hours = date.getHours();
                                            if (hours < 10) hours = '0' + hours
                                            let minutes = date.getMinutes();
                                            if (minutes < 10) minutes = '0' + minutes
                                            let seconds = date.getSeconds();
                                            if (seconds < 10) seconds = '0' + seconds
                                            let year = date.getFullYear();
                                            let month = date.getMonth() + 1;
                                            if (month < 10) month = '0' + month
                                            let day = date.getDate();
                                            if (day < 10) day = '0' + day
                                            let datka = day + '.' + month + '.' + year + ' ' + hours + ':' + minutes + ':' + seconds;
                                            let ava = this.state.ava;
                                            let als = 'flex-end', bckclr = '#df4dd3', fc = '#FFF';
                                            if (t.frm === this.nCstate.login.email) {
                                                if (this.nCstate.login.info.hasOwnProperty('ava')) {
                                                    ava = {uri: 'https://taketeam.net/avas/' + this.nCstate.login.info.ava};
                                                } else ava = bigava;
                                            } else {
                                                als = 'flex-start';
                                                bckclr = '#fafafa';
                                                fc = '#000'
                                            }
                                            let textFlag = 1;
                                            let rega = /\|\*\]evt:(.+)/i;
                                            let res = t.txt.match(rega);
                                            let eid = 0;
                                            if (res) {
                                                textFlag = 0;
                                                eid = res[1].substr(0,res[1].length - 3);
                                                if (!this.inMSG(this.state.mail, eid)) {
                                                    this.getEvt(eid);
                                                } else {
                                                    //console.log("RENDER got");
                                                }
                                            }
                                            let mail = this.nCstate.login.email;
                                            let whwhw = 1;
                                            if (t.frm !== this.nCstate.login.email) {
                                                whwhw = 0;
                                                mail = t.frm;
                                            }
                                            return(
                                                <SafeAreaView key={i} style={{width: w1, flexDirection: 'row', marginLeft: 20, marginTop: 5, alignSelf: als, marginRight: 20}}>
                                                    <TouchableOpacity style={{minWidth: 50}} onPress={()=>{
                                                        store.dispatch({type:"SETPROFILE", mail: mail, whom: whwhw});
                                                        this.navi.navigate('profile', {whom: whwhw, email: mail})}
                                                    }>
                                                        <Image source={ava} style={{width: 50, height: 50, borderRadius: 25, resizeMode: 'cover'}}/>
                                                    </TouchableOpacity>
                                                    <SafeAreaView style={{
                                                        flexDirection: 'column',
                                                        marginLeft: 5,
                                                        backgroundColor: bckclr,
                                                        borderRadius: 10,
                                                        paddingLeft: 10,
                                                        paddingRight: 10,
                                                        paddingTop: 5,
                                                        paddingBottom: 5
                                                    }}>
                                                        <Text style={{fontFamily: 'Tahoma', fontSize: 16, color: fc}}>{datka}</Text>
                                                        {textFlag ?
                                                            <Text style={{fontFamily: 'Tahoma', fontSize: 16, color: fc}}>{t.txt}</Text>
                                                        :
                                                            this.getAAA(this.state.mail, eid)
                                                        }
                                                    </SafeAreaView>
                                                </SafeAreaView>
                                            )
                                        })}
                                        </ScrollView>
                                    </SafeAreaView>
                                    <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'row', backgroundColor: 'white', width: w1,
                                        alignItems: 'center', alignContent: 'center', marginBottom: 10, marginTop: 5, height: uh+20, minHeight: uh+20,
                                        justifyContent: 'flex-start', paddingTop: 5}}>
                                        <TextInput
                                            multiline={true}
                                            numberOfLines={2}
                                            ref={ref=>{this.smsref = ref}}
                                            placeholder="Сообщение..."
                                            placeholderTextColor="#cecece"
                                            onFocus={()=>{
                                                this.inpContRef.current.setNativeProps({marginTop: -300});
                                            }}
                                            onEndEditing={()=>{
                                                this.inpContRef.current.setNativeProps({marginTop: 0});
                                            }}
                                            onblur={()=>{
                                                this.inpContRef.current.setNativeProps({marginTop: 0});
                                            }}
                                            style={{borderWidth: 1, borderStyle: 'solid', borderColor: '#939393', padding: 5,
                                                width: inpw, height: uh, borderRadius:10, fontFamily: 'Tahoma',
                                                marginLeft: 20, color: '#939393', fontSize: fs2, backgroundColor: '#f9f9f9'}}
                                            onChangeText={(smsText) => this.setState({smsText})}
                                            onSubmitEditing={() => {
                                                this.sendMessage();
                                            }}
                                            value={this.state.smsText}/>
                                        <TouchableOpacity onPress={() => this.sendMessage() } style={{marginLeft: 10}}>
                                            <Image source={upa} style={{width: uw, height: uh}}/>
                                        </TouchableOpacity>
                                    </SafeAreaView>
                                </SafeAreaView>
                            </SafeAreaView>
                        </Modal>
                    </SafeAreaView>
                </Container>
            )
        } else {
            let mt = 5;
            let fs = 24;
            let SmaxHeight = 60, SmarginTop = 20, avaS = 100, fs2 = 21;
            if (width < 900) {
                mt = 3;
                fs = Math.ceil(this.coef * fs);
                SmaxHeight = Math.ceil(this.coef * SmaxHeight);
                SmarginTop = Math.ceil(this.coef * SmarginTop) + 10;
                avaS = Math.ceil(this.coef * avaS);
                fs2 = Math.ceil(this.coef * fs2);
            }
            if (fs < 17) fs = 17;
            if (fs2 < 12) fs2 = 12;
            return (
                <Container style={{fontFamily: 'Tahoma'}}>
                    <Header noShadow searchBar rounded style={{backgroundColor: 'none'}}>
                        <Item style={{
                            maxWidth: (this.maxWidth - 10),
                            borderStyle: 'solid',
                            borderColor: '#bbbbbb',
                            backgroundColor: '#fafafa',
                            borderRadius: 10,
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderBottomWidth: 1
                        }}>
                            <TouchableOpacity onPress={()=>{this.search()}}>
                                <Icon name="ios-search"/>
                            </TouchableOpacity>
                            <Input
                                placeholder="Искать"
                                placeholderFontFamily="Tahoma"
                                style={{fontFamily: 'Tahoma'}}
                                onSubmitEditing={() => {
                                    this.search(this.state.inp)
                                }}
                                ref={input => {
                                    this.textInput = input
                                }}
                                onChange={e => this.setState({inp: e.nativeEvent.text})}
                            />
                        </Item>
                    </Header>
                    <SafeAreaView style={[styles.start, {marginTop: SmarginTop, maxHeight: SmaxHeight}]}>
                        <SafeAreaView style={{flexDirection: "column", paddingLeft: 20, paddingRight: 20}}>
                            <SafeAreaView style={{
                                flexDirection: "row", flexWrap: 'nowrap', width: this.maxWidth, marginLeft: 20,
                                maxWidth: this.maxWidth, alignContent: 'flex-start', alignItems: 'flex-start'
                            }}>
                                <Image source={larrow} style={{width: fs, height: fs, marginTop: mt}}/>
                                <Text style={{
                                    /*textTransform: 'uppercase',*/
                                    fontWeight: 'bold',
                                    fontSize: fs,
                                    fontFamily: 'ProximaNova'
                                }}>{this.nick}</Text>
                            </SafeAreaView>
                            <SafeAreaView style={{
                                marginTop: 5,
                                marginLeft: 10,
                                flexDirection: "row",
                                flexWrap: 'nowrap',
                                display: 'none',
                                width: this.maxWidth - 26,
                                maxWidth: this.maxWidth - 26,
                                alignContent: 'flex-start',
                                alignItems: 'flex-start',
                                position: 'relative',
                                zIndex: 888
                            }}>
                                <Item style={[{width: this.maxWidth-26, marginTop: 10, maxWidth: (this.maxWidth - 26),
                                    borderStyle: 'solid',
                                    borderColor: '#bbbbbb',
                                    backgroundColor: '#fafafa',
                                    borderRadius: 10,
                                    borderTopWidth: 1,
                                    borderLeftWidth: 1,
                                    borderRightWidth: 1,
                                    borderBottomWidth: 1,
                                    position: 'relative',
                                    zIndex: 999
                                }]}>
                                    <TouchableOpacity onPress={()=>{this.search(this.state.inp)}}>
                                        <Icon name="ios-search"/>
                                    </TouchableOpacity>
                                    <Input
                                        style={{position: 'relative', zIndex: 9999}}
                                        placeholder="Искать"
                                        onSubmitEditing={() => {
                                            this.search(this.state.inp)
                                        }}
                                        ref={input => {
                                            this.textInput = input
                                        }}
                                        onChange={e => this.setState({inp: e.nativeEvent.text})}
                                    />
                                </Item>
                            </SafeAreaView>
                        </SafeAreaView>
                    </SafeAreaView>
                    <SafeAreaView style={{marginTop: 10, display: 'flex',
                        flexDirection: 'row', flexWrap: 'wrap',
                        justifyContent: 'center', flex: 1}}>
                        <SafeAreaView style={{marginTop: 10, flexDirection: "column", paddingLeft: 20, paddingRight: 20, maxHeight: (height - 240)}}>
                            <ScrollView>
                            {this.state.sms.map((sms,i)=>{
                                let flag = 1;
                                let nicka = '...';
                                if (this.state.inp) {
                                    let rega = new RegExp(this.state.inp, 'i');
                                    if (sms.hasOwnProperty('nick')) {
                                        nicka = sms.nick;
                                        if (!sms.nick.match(rega)) {
                                            flag = 0;
                                        }
                                    } else {
                                        if (this.state.inp !== '...') {
                                            flag = 0;
                                        }
                                    }
                                }
                                let ava = bigava;
                                if (sms.ava !== 'preview') {
                                    ava = {uri: 'https://taketeam.net/avas/' + sms.ava};
                                }
                                if (sms.nick) {
                                    nicka = sms.nick;
                                }
                                let count = 0;
                                let txt = '';
                                let fw = 'normal';
                                let f = 1;
                                for (let i in sms.sms) {
                                    if (f) {
                                        txt = sms.sms[i]['txt'];
                                        f = 0;
                                    }
                                    if (!sms.sms[i]['red']) {
                                        count++;
                                        fw = 'bold';
                                    }
                                }
                                if (count > 1) {
                                    fw = 'bold';
                                    //txt = count + ' непрочитанных сообщения';
                                }
                                let rega = /\|\*\]evt:(.+)/i;
                                if (txt.match(rega)) {
                                    txt = 'СОБЫТИЕ!'
                                }
                                if (flag) {
                                    return (
                                        <SafeAreaView key={i} style={{
                                            flexDirection: "row",
                                            flexWrap: 'nowrap',
                                            width: this.maxWidth,
                                            maxWidth: this.maxWidth,
                                            alignContent: 'flex-start',
                                            alignItems: 'flex-start',
                                            marginBottom: 10,
                                            marginLeft: 20
                                        }}>
                                            <TouchableOpacity onPress={()=>{this.navi.navigate('profile', {whom: 0, email: sms.email})}}>
                                            <Image source={ava} style={{width: avaS, height: avaS, resizeMode: 'cover', borderRadius: Math.ceil(avaS / 2)}}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>{this.read(sms, ava, i)}} >
                                            <SafeAreaView style={{flexDirection: 'column', marginLeft: 10, width: this.maxWidth - 160}}>
                                                <Text style={{flexWrap: 'nowrap', fontWeight: 'bold', fontSize: fs2, fontFamily: 'ProximaNova'}}>{nicka}</Text>
                                                <Text style={{fontWeight: fw, fontSize: fs2, fontFamily: 'Tahoma'}} ref={ref=>{this.refas[i] = ref}}>{txt}</Text>
                                            </SafeAreaView>
                                            </TouchableOpacity>
                                        </SafeAreaView>
                                    )
                                }
                            })}
                            </ScrollView>
                        </SafeAreaView>
                    </SafeAreaView>

                    <Bottom navigate={this.navi.navigate}/>
                </Container>
            )
        }
    }
}

const styles = StyleSheet.create({
    start: {
        display: 'flex',
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 0,
        maxHeight: 60,
        marginTop: 20,
        fontSize: 28,
        flex: 1
    },
    tags: {
        alignContent: "flex-start",
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: 'nowrap',
        flexDirection: "row",
        fontSize: 24
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
    centeredView: {
        flex: 1,
        display: 'flex',
        flexDirection: "row",
        alignContent: "flex-start",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: 'nowrap',
        width: '100%',
        marginTop: 12
    },
    itemStyle: {
        maxHeight: 50,
        height: 50,
        borderStyle: 'solid',
        borderColor: '#bbbbbb',
        backgroundColor: '#fafafa',
        borderRadius: 5,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1
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