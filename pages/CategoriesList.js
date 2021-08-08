import React from 'react';
import {List, ListItem, Text, Container, Input} from 'native-base';
import {
    Dimensions,
    StyleSheet,
    View, SafeAreaView,
    ActivityIndicator,
    RefreshControl, Modal, TextInput, Platform
} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import store from '../redux/store';
import Header from '../components/Header';
import Bottom from "../components/Bottom";
import CommentModal from "../components/CommentModal";
const { width, height } = Dimensions.get('screen');
import cancel from '../assets/cancel.png';
import prewa from '../assets/preview.png';
import chyvak from '../assets/chyvak.png';
import comix from '../assets/comix.png';
import samik from '../assets/samolet.png';
import ava from '../assets/defava.png';
import lolgo from '../assets/lolgo.png';
import {Image} from "react-native";
import {getCreatedEvents, getMyEvents, getNewEvents, goEvent, setMainView, addComment, showComments, showSharing} from "../redux/actions";
import ShareModal from "../components/ShareModal";
import StatusBarBG from '../components/StatusBarBG';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from "expo-constants";

class CategoriesList extends React.Component {
    constructor(props) {
        super(props);
        this.nCstate = store.getState();
        this._isMounted = false;
        this.navi = this.props.navigation;
        let pp = {};
        this.refas = {};
        this.picsetted = 1;
        this.plaharefs = {};
        this.posts = [];
        this.curSlide={};
        if (this.nCstate.login.status > 0) {
            this.posts = this.nCstate.data.posts['podpis'];
            store.dispatch(getCreatedEvents(this.nCstate.login.email, this.nCstate.login.token));
        } else {
            this.posts = this.nCstate.data.posts;
        }
        for (let i in this.posts) {
            pp[this.posts[i]['_id']] = {};
            if (this.posts.hasOwnProperty('pics')) {
                if (this.posts.pics[0] === 'preview') {
                    pp[this.posts[i]['_id']]['pics']=[prewa];
                } else {
                    pp[this.posts[i]['_id']]['pics'] = this.posts.pics;
                }
            } else {
                pp[this.posts[i]['_id']]['pics']=[prewa];
            }
            //pp[this.posts[i]['_id']]['pics']=[test1pic,test2pic,test3pic];
            pp[this.posts[i]['_id']]['curpic'] = 0;
            //this.refas[this.posts[i]['_id']] = React.createRef();
            this.plaharefs[this.posts[i]['_id']] = [];
            // for (let j in pp[this.posts[i]['_id']]['pics']) {
            //     this.plaharefs[this.posts[i]['_id']][j] = React.createRef();
            // }
        }
        let evts = [];
        if (this.posts) {
            evts = this.posts;
        }

        this.state = {
            pics:[],
            events: evts,
            pp: pp, refas3: {},
            opa: 1, refas2: {},
            jnrs: {},
            view: this.nCstate.view.view,
            rnd: Math.random(),
            igo: [], ernd: 0,
            isLoading: true,
            refreshing: false,
            modalVisible: false,
            modalDisplay: 'none',
            commentTxt: '',
            ecid: null,
            eflags: {}, datestatus: 0,
            coms: [],
            mystasus:[],
            fst: this.nCstate.myevents.status
        };
        this.i = 0;
        this.ph = height - 380;
        this.pw = '100%';
        this.ps = prewa;
        this.ct = 0;
        this.ct2 = [];
        this.showingpic = {};
        this.commentHeight = height-450;
        this.maxWidth = width;
        this.maxHeight = height;
        if (width > 900) {
            this.maxWidth = 900;
            this.maxHeight = 1600;
        } else {
            this.maxHeight = width * 1.78;
        }
        store.dispatch({type: 'USERINFO', info: {}, status: 0});
        this.viewPic = this.viewPic.bind(this);
        this.getImg = this.getImg.bind(this);
        this.changeImg = this.changeImg.bind(this);
        this.changeImg1 = this.changeImg1.bind(this);
        this.changeImg2 = this.changeImg2.bind(this);
        this.getPicW = this.getPicW.bind(this);
        this.toShow = this.toShow.bind(this);
        this.goButton = this.goButton.bind(this);
        this.joinEvent = this.joinEvent.bind(this);
        this.canEvent = this.canEvent.bind(this);
        this.regEvent = this.regEvent.bind(this);
        this.goProfile = this.goProfile.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.comment = this.comment.bind(this);
        this.addComment = this.addComment.bind(this);
        this.imageSwipeRight = this.imageSwipeRight.bind(this);
        this.getSizes = this.getSizes.bind(this);
        this.scrollim = this.scrollim.bind(this);
        this.sharing = this.sharing.bind(this);
        this.switchPica = this.switchPica.bind(this);
    }

    switchPica(iid) {
        let cnt = 0;
        for (let i in this.refas[iid]) {
            cnt ++;
        }
        if (cnt < 2) return;
        let curpic = this.showingpic[iid];
        let setpic = curpic + 1;
        if (setpic >= cnt) setpic = 0;
        for (let i in this.refas[iid]) {
            let j = (i+1) * this.maxWidth;
            this.refas[iid][i].current.setNativeProps({left: j});
        }
        this.refas[iid][setpic].current.setNativeProps({left: -1*(setpic)*this.maxWidth});
        this.showingpic[iid] = setpic;
        for (let i in this.plaharefs[iid]) {
            if (this.plaharefs[iid][i].current) {
                this.plaharefs[iid][i].current.setNativeProps({opacity: 0.5});
            }
        }
        if (this.plaharefs[iid][setpic].current) {
            this.plaharefs[iid][setpic].current.setNativeProps({opacity: 1});
        }
    }

    sharing(item) {
        const state = store.getState();
        if (state.login.status > 0) {
            store.dispatch(showSharing(item));
        } else {
            this.navi.navigate('authing', {title: 'Авторизация'});
        }
    }

    comment(item) {
        const state = store.getState();
        if (state.login.status > 0) {
            /*let coms = [];
            if (item.hasOwnProperty('comments')) {
                coms = item.comments;
            }*/
            let flag = 1;
            if (item.hasOwnProperty('cancom')) {
                if (item.cancom === -1) {
                    flag = 0;
                } else if (item.cancom === 0) {
                    let subed = [];
                    if (this.nCstate.login.info.hasOwnProperty('subed')) subed = this.nCstate.login.info.subed;
                    if (subed.indexOf(item.uzr) === -1) {
                        flag = 0;
                    }
                }
            }
            if (flag) store.dispatch(showComments(item));
            //this.setState({modalDisplay: 'flex', modalVisible: true, ecid: item['_id'], coms: coms});
        } else {
            this.navi.navigate('authing', {title: 'Авторизация'});
        }
    }
    addComment(){
        const state = store.getState();
        if (state.login.status > 0) {
            store.dispatch(addComment(state.login.email, state.login.token, this.state.ecid, this.state.commentTxt));
            let coms = this.state.coms;
            const ct = parseInt(Date.now()/1000);
            coms.push({ct: ct, uzr: state.login.info, txt: this.state.commentTxt});
            if (this._isMounted) this.setState({coms: coms, commentTxt: ''});
        }
    }
    onRefresh() {
        if (this._isMounted) this.setState({refreshing: true});
        const state = store.getState();
        if (state.login.status < 1) {
            store.dispatch(getNewEvents());
        } else {
            store.dispatch(getMyEvents(state.login.email, state.login.token));
        }
        setTimeout(()=>{
            if (this._isMounted) this.setState({refreshing: false});
        }, 3000);
    }
    goProfile(item) {
        if (this._isMounted) { this.setState({isLoading: true}); setTimeout(()=>{ if (this._isMounted) this.setState({isLoading: false})}, 1000)}
        //this._isMounted = false;
        let title = 'Профиль - чей-то';
        if (item.hasOwnProperty('uinfo')) {
            if (item.uinfo.hasOwnProperty('nick')) {
                title = 'Профиль - ' + item.uinfo.nick;
            }
        }
        store.dispatch({type:"SETPROFILE", mail: item.uzr, whom: 0});
        this.navi.navigate('profile', {title: title, email: item.uzr, whom: 0})
    }
    joinEvent(item) {
        let iid = item['_id'];
        let flags = this.state.eflags;
        flags[iid] = 0;

        //this.setState({isLoading: true});
        let joiners = this.state.jnrs;
        joiners[iid] = joiners[iid] + 1;
        store.dispatch(goEvent(this.nCstate.login.email, this.nCstate.login.token, iid, 'go'));
        if (this._isMounted) this.setState({eflags: flags, jnrs: joiners});
        //store.dispatch({type: "REFRESHEVENTS"});
        //setTimeout(()=>{ if (this._isMounted) this.setState({isLoading: false});}, 3000);
    }
    canEvent(item){
        let iid = item['_id'];
        let flags = this.state.eflags;
        flags[iid] = 1;
        if (item.hasOwnProperty('rega')) {
            if (item.rega) {
                flags[iid] = 2;
            }
        }
        //this.setState({isLoading: true});
        let joiners = this.state.jnrs;
        joiners[iid] = joiners[iid] - 1;
        store.dispatch(goEvent(this.nCstate.login.email, this.nCstate.login.token, iid, 'cancel'));
        //store.dispatch({type: "REFRESHEVENTS"});
        //setTimeout(()=>{ if (this._isMounted) this.setState({isLoading: false});}, 3000);
        if (this._isMounted) this.setState({eflags: flags, jnrs: joiners});
    }
    regEvent(item){
        let iid = item['_id'];
        let flags = this.state.eflags;
        flags[iid] = 0;
        //this.setState({isLoading: true});
        store.dispatch(goEvent(this.nCstate.login.email, this.nCstate.login.token, iid, 'reg'));
        if (this._isMounted) this.setState({eflags: flags});
        //store.dispatch({type: "REFRESHEVENTS"});
        //setTimeout(()=>{ this.setState({isLoading: false});}, 3000);
    }
    goButton(item) {
        let pw = 280;
        let ph = 50;
        let ml = 25;
        let fs = 30;
        if (this.maxWidth < 900) {
            let dl = 1.7
            pw = Math.ceil(pw/dl);
            ph = Math.ceil(ph/dl);
            ml = 13;
        }
        if (width < 900) {
            fs = 20;
            ph = 35;
            ml = 10;
        }

        if (this.nCstate.login.status > 0) {
            let flag;
            if (!this.state.eflags.hasOwnProperty(item['_id'])) {
                flag = 1;
                const igo = this.state.igo;
                for (let i in igo) {
                    if (igo[i]['_id'] === item['_id']) {
                        flag = 0;
                    }
                }
                if (item.hasOwnProperty('requests')) {
                    for (let i in item.requests) {
                        if (item.requests[i] === this.nCstate.login.email) {
                            flag = 0;
                        }
                    }
                }
                if (flag) {
                    if (item.hasOwnProperty('rega')) {
                        if (item.rega) {
                            flag = 2;
                        }
                    }
                }
            } else {
                flag = this.state.eflags[item['_id']];
            }

            if (flag === 1) {
                return (
                    <TouchableOpacity onPress={()=>{this.joinEvent(item)}}
                                      style={{backgroundColor: '#ff0054', position: 'relative', zIndex: 99,
                        width: pw, height: ph, marginLeft: ml, minHeight: ph, maxHeight: ph,
                        borderRadius: 5, flex:1, display: 'flex',
                        justifyContent:'center', alignItems: 'center', alignContent: 'center'}}>
                        <Text style={{textTransform: 'uppercase', color: 'white', fontFamily: 'ProximaNova', fontSize: fs, fontWeight: 'bold'}}>Погнали!</Text>
                    </TouchableOpacity>
                )
            } else if (flag === 0) {
                return (
                    <TouchableOpacity onPress={()=>{this.canEvent(item)}} style={{
                            backgroundColor: '#5d001f',
                            width: pw, height: ph, marginLeft: ml, minHeight: ph,
                            borderRadius: 5, flex:1, display: 'flex', maxHeight: ph,
                            justifyContent:'center', alignItems: 'center', alignContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', color: 'white', fontFamily: 'ProximaNova', fontSize: fs, fontWeight: 'bold'}}>Отмена</Text>
                    </TouchableOpacity>
                )
            } else if (flag === 2) {
                return (
                    <TouchableOpacity onPress={()=>{this.regEvent(item)}} style={{
                            backgroundColor: '#ff0054',
                            width: pw, height: ph, marginLeft: ml, minHeight: ph,
                            borderRadius: 5, flex:1, display: 'flex', maxHeight: ph,
                            justifyContent:'center', alignItems: 'center', alignContent: 'center'}}>
                            <Text style={{textTransform: 'uppercase', color: 'white', fontFamily: 'ProximaNova', fontSize: fs, fontWeight: 'bold'}}>Регистрация</Text>
                    </TouchableOpacity>
                )
            }
        } else {
            let fs = 26;
            let pT = 12;
            let pL = 38;
            if ( width < 900) {
                fs = 18;
                pT = 4;
                pL = 12;
            }
            return (
                <TouchableOpacity onPress={()=>{this.navi.navigate('authing')}}>
                    <Text style={{
                        width: pw,
                        height: ph,
                        maxHeight: ph,
                        marginLeft: ml,
                        borderRadius: 5,
                        backgroundColor: '#ff0068',
                        paddingTop: pT,
                        paddingLeft: pL,
                        color: '#fff',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: fs,
                        fontFamily: 'ProximaNova'
                    }}>Авторизация</Text>
                </TouchableOpacity>
            )
        }
    }
    async componentDidMount() {
        this._isMounted = true;
        const state = store.getState();
        if (state.login.status < 1) {
            store.dispatch(getNewEvents());
        } else {
            store.dispatch(getMyEvents(state.login.email, state.login.token));
        }
        store.dispatch({type: 'USERINFO', info: {}, status: 0});
        this.setState({rnd: Math.random()});
        if (state.onstart.status === 1) {
            setTimeout(()=>{
                this.navi.navigate('search', {title: 'Поиск'})
            }, 1000);
        }
        store.subscribe(() => {
            if (this._isMounted) {
                const state = store.getState();
                //store.dispatch({type: 'USERINFO', info: {}, status: 0});
                if (state.url.status) {
                    let pid = 0;
                    if (state.url.pid) pid = state.url.pid;
                    if (pid) {
                        store.dispatch({type: 'UNPAGE'});
                        this.navi.navigate('singlePost', {title: 'Событие', pid: pid});
                    }
                    return;
                }
                if (state.coms.view) {
                    this.setState({opa: 0.5});
                } else {
                    this.setState({opa: 1});
                }
                if (state.login.status !== this.nCstate.login.status) {
                    this.nCstate = state;
                    if (state.login.status > 0) {
                        /*
                        setTimeout(()=>{
                            store.dispatch(setMainView('rekom'));
                        }, 4000);
                        setTimeout(()=>{
                            store.dispatch(setMainView('podpis'));
                        }, 5000);
                         */
                    }
                }
                if (state.bla.rnd !== this.state.ernd) {
                    if (state.login.status < 1) {
                        store.dispatch(getNewEvents());
                    } else {
                        store.dispatch(getMyEvents(state.login.email, state.login.token));
                    }
                    //setTimeout(()=>{this.setState({ernd: state.bla.rnd})}, 1000);
                }
                if (state.page.disabled !== this.state.isLoading) {
                    if (this._isMounted) {
                        this.setState({isLoading: state.page.disabled});
                    }
                }
                if (state.myevents.status !== this.state.fst || state.myevents.status === 2) {
                    if (this._isMounted) this.setState({igo: state.myevents.events.igo, fst: state.myevents.status});
                }
                if (state.data.status !== this.state.datestatus) {
                    let posts = [];
                    if (state.login.status > 0) {
                        posts = this.nCstate.data.posts['podpis'];
                    } else {
                        posts = this.nCstate.data.posts;
                        this.setState({events: posts});
                    }
                    let joiners = {};
                    let flag = 1;
                    for (let i in posts) {
                        joiners[posts[i]['_id']] = 0;
                        if (posts[i].hasOwnProperty('joiners')) {
                            joiners[posts[i]['_id']] = posts[i]['joiners'].length;
                        }
                    }
                    if (this._isMounted) this.setState({datestatus: state.data.status, posts: posts, jnrs: joiners});
                }
                if (state.view.view !== this.state.view || state.bla.rnd !== this.state.ernd) {
                    this.posts = state.data.posts[state.view.view];
                    let pp = {};
                    //this.refas = {};
                    this.plaharefs = {};
                    if (state.login.status < 1) {
                        this.posts = state.data.posts;
                    }
                    for (let i in this.posts) {
                        pp[this.posts[i]['_id']] = {};
                        if (this.posts.hasOwnProperty('pics')) {
                            if (this.posts.pics[0] === 'preview') {
                                pp[this.posts[i]['_id']]['pics']=[prewa];
                            } else {
                                pp[this.posts[i]['_id']]['pics'] = this.posts.pics;
                            }
                        } else {
                            pp[this.posts[i]['_id']]['pics']=[prewa];
                        }
                        pp[this.posts[i]['_id']]['curpic'] = 0;
                        //this.refas[this.posts[i]['_id']] = React.createRef();
                        this.plaharefs[this.posts[i]['_id']] = [];
                        // for (let j in pp[this.posts[i]['_id']]['pics']) {
                        //     this.plaharefs[this.posts[i]['_id']][j] = React.createRef();
                        // }
                    }
                    if (this._isMounted) {
                        let posts = [];
                        if (this.posts) posts = this.posts;
                        let joiners = {};
                        for (let i in posts) {
                            joiners[posts[i]['_id']] = 0;
                            if (posts[i].hasOwnProperty('joiners')) {
                                joiners[posts[i]['_id']] = posts[i]['joiners'].length;
                            }
                        }
                        this.setState({refas2: {}, events: posts, pp: pp, view: state.view.view, ernd: state.bla.rnd, jnrs: joiners});
                    }
                }
            }
        })
    }
    async componentWillUnmount() {
        this._isMounted = false;
        store.subscribe(() => {});
        return function cleanup() {
            this._isMounted = false;
            store.subscribe(()=>{});
            this.ps = prewa;
        };
    }
    toShow(a){

    }

    scrollim(iid, to){
        if (!this.refas[iid].current) {
            console.log("NO REF!!!");
            return;
        }
        this.refas[iid].current.scrollTo({y: 0, x: to, animated: true});
        /*this.ct2 = [];
        setTimeout(()=>{
            this.picsetted = 1;
        }, 800);

         */
    }

    viewPic(iid, picn) {
        if (this._isMounted) {
            /*
            this.picsetted = 0;
            const pw = this.getPicW(post) * picn;
            if (!this.refas[post]) {
                console.log("NO refas");
                return;
            }
            if (!this.refas[post].current) {
                console.log("NO refas curr");
                return;
            }
            this.refas[post].current.scrollTo({x: pw, y: 0, animated: true});
            this.curSlide[post] = picn;
            for (let i in this.plaharefs[post]) {
                if (this.plaharefs[post][i].current) {
                    this.plaharefs[post][i].current.setNativeProps({opacity: 0.5});
                }
            }
            if (this.plaharefs[post][picn].current) {
                this.plaharefs[post][picn].current.setNativeProps({opacity: 1});
            }
            */
            for (let i in this.refas[iid]) {
                this.refas[iid][i].current.setNativeProps({left: this.maxWidth * (i+1)});
            }
            this.refas[iid][picn].current.setNativeProps({left: -1*picn*this.maxWidth});
            this.showingpic[iid] = picn;
            for (let i in this.plaharefs[iid]) {
                if (this.plaharefs[iid][i].current) {
                    this.plaharefs[iid][i].current.setNativeProps({opacity: 0.5});
                }
            }
            if (this.plaharefs[iid][picn].current) {
                this.plaharefs[iid][picn].current.setNativeProps({opacity: 1});
            }
        }
    }

    changeImg1 = (nativeEvent, iid) => {
        //console.log("started at = " + nativeEvent.contentOffset.x);
        this.ct2[0] = nativeEvent.contentOffset.x;

    }
    changeImg2 = (nativeEvent, iid) => {
        //console.log("ended at = " + nativeEvent.contentOffset.x);
        this.ct2[1] = nativeEvent.contentOffset.x;
        //let sli = this.curSlide[iid];
        let to = 0;
        if (this.ct2[1] > this.ct2[0]) {
            to++;
        }
        if (this.ct2[1] < this.ct2[0]) {
            to--;
        }
        let slide = nativeEvent.contentOffset.x / width;

        if (to > 0) {
            slide = Math.ceil(slide);
        } else if (to < 0)  {
            slide = Math.floor(slide);
        } else return;

        let slidesCount = 0;
        for (let i in this.state.events) {
            if (String(this.state.events[i]['_id']) === iid) {
                slidesCount = this.state.events[i]['pics'].length-1;
            }
        }
        if (slide > slidesCount && to > 0) return;
        if (slide > slidesCount) return;
        this.curSlide[iid] = slide;
        this.scrollim(iid, slide*this.maxWidth);
        this.ct2 = [];
    }

    changeImg = (nativeEvent, iid) => {
        let slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        let slidesCount = 1;
        for (let i in this.state.events) {
            if (String(this.state.events[i]['_id']) === iid) {
                slidesCount = this.state.events[i]['pics'].length-1;
            }
        }
        if (slide > slidesCount) {
            slide = slidesCount;
        }
        if (slide < 0) slide = 0;
        for (let i in this.plaharefs[iid]) {
            if (this.plaharefs[iid][i].current) {
                this.plaharefs[iid][i].current.setNativeProps({opacity: 0.5});
            }
        }
        if (this.plaharefs[iid][slide].current) {
            this.plaharefs[iid][slide].current.setNativeProps({opacity: 1});
        }
        /*return;
        if (!this.picsetted) return;
        this.ct2.push(nativeEvent.contentOffset.x);
        let slidesCount = 0;
        if (this.ct2.length > 2) {
            for (let i in this.state.events) {
                if (String(this.state.events[i]['_id']) === iid) {
                    slidesCount = this.state.events[i]['pics'].length-1;
                }
            }
            let cc = this.ct2.length - 1;
            if (!this.curSlide.hasOwnProperty(iid)) this.curSlide[iid] = 0;
            let sli = this.curSlide[iid];

            if (this.ct2[cc] > this.ct2[0]) {
                sli++;
            } else if (this.ct2[0] > this.ct2[cc]) {
                sli--;
            }

            if (sli < 0) sli = 0;
            if (sli > slidesCount) sli = slidesCount;
            this.ct2 = [];
            this.curSlide[iid] = sli;
            this.picsetted = 0;
            this.scrollim(iid, sli*this.maxWidth);
        }*/
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

    getImg(pica, item){
        if (this._isMounted) {
            if (!item.hasOwnProperty('pics')) {
                item['pics'] = [prewa];
            } else if (item['pics'][0] === 'preview') {
                item['pics'] = [prewa];
            }
            let nadpFS = [];
            if (item.hasOwnProperty('nadpFS')){
                nadpFS = item.nadpFS;
            } else {
              for (let i in item['pics']) {
                  nadpFS[i] = 20;
              }
            }

            if (!item.hasOwnProperty('nadpisi')) {
                item['nadpisi'] = [];
                for (let i in item.pics) {
                    item['nadpisi'][i] = '';
                }
            } else {
                if (!item['nadpisi']) {
                    item['nadpisi'] = [];
                    for (let i in item.pics) {
                        item['nadpisi'][i] = '';
                    }
                }
            }

            /*let pw = '100%';
            let ph = '100%';
            let iid = item['_id'];
            let postpics = this.state.pp[iid]['pics'];
            pica = this.state.pp[iid]['pics'][this.state.pp[iid]['curpic']];
            for (let i in this.state.pics) {
                if (pica === this.state.pics[i]['src']) {
                    pw = this.state.pics[i].pw;
                    ph = this.state.pics[i].ph;
                    break;
                }
            }*/
            let iid = String(item['_id']);
            const imgC = item.pics.length;
            let plw = Math.ceil(100 / imgC) - 2;
            // let joiners = 0;
            // if (item.hasOwnProperty('joiners')) {
            //     joiners = item.joiners.length;
            // }
            let pw = 50, ph = 50, fs = 35, ml = 25, btm = 70;
            if (width < 900) {
                let dl = 1.7
                pw = Math.ceil(pw/dl);
                ph = Math.ceil(ph/dl);
                fs = 28;
                ml = 10;
                btm = 0;
                plw = Math.ceil(width / imgC)-5;
            }
            let chrds = [];
            if (item.hasOwnProperty('chrds')) {
                for (let i in item.chrds) {
                    chrds[i] = {};
                    if (item.chrds[i].x !== -1 && item.chrds[i].y !== -1) {
                        chrds[i] = {position: 'absolute'}
                    }
                    if (item.chrds[i].x !== -1) {
                        chrds[i]['left'] = item.chrds[i].x * this.maxWidth;
                        if (chrds[i]['left'] > (this.maxWidth*0.95)) {
                            chrds[i]['left'] = this.maxWidth*0.95;
                        }
                        if (chrds[i]['left'] < (this.maxWidth*0.1)) {
                            chrds[i]['left'] = this.maxWidth*0.1;
                        }
                    }
                    if (item.chrds[i].y !== -1) {
                        chrds[i]['top'] = item.chrds[i].y * this.maxHeight;
                        if (chrds[i]['top'] > (this.maxHeight*0.85)) {
                            chrds[i]['top'] = this.maxHeight*0.85;
                        }
                        if (chrds[i]['top'] < (this.maxHeight*0.1)) {
                            chrds[i]['top'] = this.maxHeight*0.1;
                        }
                    }
                }
            }
            let rotas = [];
            if (item.hasOwnProperty('rotas')) {
                for (let i in item.rotas) {
                    rotas.push(item.rotas[i]);
                }
            } else {
                for (let i in item.pics) {
                    rotas.push(0);
                }
            }
            /*if (!this.refas3) {this.refas3 = {}}
            if (!this.refas) {this.refas = []; this.i = 0;}*/

            if (!this.refas) {this.refas = {};}
            if (!this.refas.hasOwnProperty(iid)) this.refas[iid] = {};
            //if (!this.refas[iid].current) this.refas[iid] = React.createRef();
            this.showingpic[iid] = 0;
            /*console.log("this.i = " + this.i);
            this.i++;
            let reffs = this.state.refas3;
            if (!reffs.hasOwnProperty(iid)) {
                reffs[iid] = this.i;
                //this.setState({refas3: reffs});
            }*/
            //joiners = '+' + joiners;
            //const images = this.state.pp[iid]['pics'];
            /*
            * ref => {
                            this.refas[item['_id']] = ref;
                            let rfs = this.state.refas2;
                            rfs[item['_id']] = ref;
                            this.setState({refas2: rfs}) ;
                        }
            * */

            return (
                <SafeAreaView style={{width: this.maxWidth, height: this.maxHeight}}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.switchPica(iid);
                        }}
                        style={{width: this.maxWidth, maxWidth: this.maxWidth, height: this.maxHeight, maxHeight: this.maxHeight, flexDirection: "row"}}>
                        {item.pics.map((p, index) => {
                            let picw = this.maxWidth;
                            let pich = this.maxHeight;
                            if (p.hasOwnProperty('uri')) {
                                let sizes = this.getSizes(p['width'], p['height']);
                                picw = sizes.w;
                                pich = sizes.h;
                                p = {uri: 'https://taketeam.net/posters/' + p.uri};
                            }
                            let txtclr = '#000';
                            let bckclr = 'transparent';
                            if (item.hasOwnProperty('ndpBClr')) {
                                if (item.ndpBClr[index]) {
                                    bckclr = item.ndpBClr[index];
                                }
                            }
                            if (item.hasOwnProperty('ndpClr')) {
                                if (item.ndpClr[index]) {
                                    txtclr = item.ndpClr[index];
                                }
                            }
                            this.refas[iid][index] = React.createRef();
                            let dispa = index * this.maxWidth;
                            //if (index) dispa = index * this.maxWidth;

                            return (
                                <SafeAreaView key={index} ref={this.refas[iid][index]}
                                              style={{width: this.maxWidth, height: this.maxHeight,
                                    backgroundColor: 'black', display: "flex", position: "relative", left: dispa,
                                    flexFlow: 'row wrap', justifyContent: 'center', alignContent: 'center',
                                    alignItems: 'center'}}>
                                    {item.nadpisi[index] ?
                                        <Text style={[{position: 'absolute', top: '48%', zIndex: 9999,
                                            fontWeight: 'bold', fontSize: nadpFS[index],
                                            color: txtclr, fontFamily: 'Tahoma', transform: [{"rotate": rotas[index]+'deg'}],
                                            backgroundColor: bckclr}, chrds[index]]}>{item.nadpisi[index]}</Text>
                                        : null
                                    }
                                    <Image
                                        source={p}
                                        style={{
                                            width: picw,
                                            height: pich,
                                            resizeMode: 'cover'
                                        }}
                                    />
                                </SafeAreaView>
                            )
                            })
                        }
                    </TouchableOpacity>
                    {item.pics.length > 1 ?
                        <SafeAreaView style={[styles.plaha, {width: width - 10, flexWrap: 'nowrap', left: 4}]}>
                            {
                                item.pics.map((pika, ppi) => {
                                    let opa = 0.5;
                                    if (this._isMounted) {
                                        if (item.pics.indexOf(pika) === this.state.pp[item['_id']]['curpic']) {
                                            opa = 1
                                        }
                                    }
                                    this.plaharefs[iid][ppi] = React.createRef();
                                    return (
                                        <TouchableOpacity
                                            key={ppi}
                                            onPress={() => {
                                                this.viewPic(iid, ppi);
                                            }}
                                            style={{
                                                width: plw,
                                                height: 5,
                                                borderRadius: 5,
                                                marginLeft: 2
                                            }}
                                        >
                                            <SafeAreaView ref={this.plaharefs[iid][ppi]} style={{
                                                opacity: opa,
                                                width: plw,
                                                height: 5,
                                                borderRadius: 5,
                                                backgroundColor: '#FFF'
                                            }}></SafeAreaView>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </SafeAreaView>
                        :
                        null
                    }
                    <SafeAreaView style={{
                        width: this.maxWidth,
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "center",
                        alignItems: "center",
                        flexWrap: 'nowrap',
                        justifyContent: "center",
                        position: 'absolute',
                        bottom: btm,
                        height: 100
                    }}>
                        <Text style={{color: '#ffc03a', fontWeight: 'bold', fontSize: fs, fontFamily: 'ProximaNova'}}>+{this.state.jnrs[iid]}</Text>
                        <Image source={chyvak} style={{resizeMode: 'stretch', width: pw, height: ph, marginLeft: 12}}/>
                        {this.goButton(item)}
                        <TouchableOpacity onPress={()=>{this.comment(item)}}>
                            <Image source={comix} style={{resizeMode: 'stretch', width: pw, height: ph, marginLeft: ml+2}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.sharing(item)}}>
                            <Image source={samik} style={{resizeMode: 'stretch', width: pw, height: ph, marginLeft: ml+2}}/>
                        </TouchableOpacity>
                    </SafeAreaView>
                    <SafeAreaView style={{minHeight: 10}}></SafeAreaView>
                </SafeAreaView>
            )
        } else {
            return (
                <Text>Loading...</Text>
            )
        }
    }

    getPicW(post) {
        if (width > 900) return 900;
        else return width;
        for (let i in this.state.pics) {
            if (this.state.pics[i]['src'] === this.state.pp[post]['pics'][0]) {
                return this.state.pics[i]['pw']
            }
        }
    }

    imageSwipeRight(progress, dragX, iid) {
        return (
            <Text>{iid}</Text>
        );
    }

    render() {
        const state = store.getState();
        if (this.state.isLoading || state.onstart.status) {
            return (
                <Container style={{width: '100%', height: '100%'}}>
                    <SafeAreaView style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#ff0054" style={styles.loader}/>
                    </SafeAreaView>
                </Container>
            )
        } else {
            const {navigation: {navigate}} = this.props;
            if (this._isMounted) {
                let mHm = this.ph-200;
                if (width < 900) {
                    let dl = 1;
                    mHm = this.ph + 150;
                }
                let HH = 50;
                let mh = 120;
                let coef = width / 900;
                if (width < 900) {
                    HH = Math.ceil(HH * width / 900);
                    mh = 70;
                }
                if (HH < 30) HH = 30;
                let mainHeight = height - (HH + mh + 75);
                let mainScreenStyles = {
                    width: '100%',
                    marginTop: 0,
                    alignContent: "flex-start",
                    flex: 1, flexWrap: 'wrap',
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    flexDirection: "column"};
                if (Platform.OS === 'ios') {
                    mainScreenStyles['minHeight'] = height - (100 + Constants.statusBarHeight + 10);
                }
                return (
                    <Container>
                        <View>
                            <StatusBarBG style={{backgroundColor: "transparent"}} />
                        </View>
                        <SafeAreaView style={{width: '100%', height: '100%', flex: 1, display: 'flex', alignContent: "flex-start",
                            flexWrap: 'wrap',
                            justifyContent: "center",
                            alignItems: "flex-start", padding: 0, margin: 0, paddingTop: 2,
                            flexDirection: "column"}}>
                            <Header/>
                            <CommentModal navigate={this.navi.navigate}/>
                            <ShareModal navigate={this.navi.navigate}/>
                            <SafeAreaView style={mainScreenStyles}>
                                <ScrollView style={{width: '100%'}}>
                                <List style={{opacity: this.state.opa}}>
                                    {this.state.events.length ?
                                        this.state.events.map((item, iii) => {

                                            let pica = prewa;
                                            if (this._isMounted) {
                                                pica = this.state.pp[item['_id']]['pics'][this.state.pp[item['_id']]['curpic']];
                                            }
                                            let avka = ava;
                                            if (item.uinfo.hasOwnProperty('ava')) {
                                                avka = {uri: 'https://taketeam.net/avas/' + item.uinfo.ava}
                                            }
                                            let pw = 70, ph = 70, fs = 20, ml = 50, fs2 = 18, ml2 = 25, mt = -5, ll = 30, myMT = 5;
                                            let omamartop = 5, fss2 = 20;
                                            let maxwT = 750, mHm = this.ph;
                                            if (width < 900) {
                                                let dl = 1;
                                                pw = Math.ceil(pw/dl);
                                                ph = Math.ceil(ph/dl);
                                                ml = 10;
                                                fs = 14;
                                                fs2 = 16;
                                                fss2 = 14;
                                                myMT = 2;
                                                ml2 = 30;
                                                mHm = this.ph + 150;
                                                mt = -5;
                                                ll = 10;
                                                maxwT =  width / 900 * 700;
                                            }
                                            let fpt;
                                            if (iii === 0) fpt = 2;
                                            else fpt = 15;
                                            //this.refas[item['_id']] = React.createRef();
                                            return (
                                                <ListItem
                                                    key={iii}
                                                    style={{
                                                        borderWidth: 0,
                                                        paddingTop: fpt,
                                                        minHeight: this.maxHeight + 80
                                                    }}>
                                                    <SafeAreaView style={{
                                                        width: '100%',
                                                        alignContent: "center",
                                                        flex: 1,
                                                        marginTop: 0,
                                                        justifyContent: "center",
                                                        alignItems: "center"

                                                    }}>
                                                        <SafeAreaView style={[styles.postView, {height: this.maxHeight}]}>
                                                            {this.getImg(pica, item)}
                                                        </SafeAreaView>
                                                        <SafeAreaView style={{
                                                            marginTop: mt+10,
                                                            backgroundColor: 'white',
                                                            width: this.maxWidth,
                                                            maxWidth: this.maxWidth,
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            flexWrap: "wrap",
                                                            alignContent: "flex-start",
                                                            alignItems: "flex-start",
                                                            justifyContent: "flex-start"
                                                        }}>
                                                            <TouchableOpacity onPress={() => {
                                                                this.goProfile(item)
                                                            }}>
                                                                <SafeAreaView style={{maxWidth: pw+14,
                                                                    marginLeft: 5,
                                                                    position: 'relative',
                                                                    left: 5, overflow: 'hidden',
                                                                    marginTop: myMT,
                                                                    width: pw+12,
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    flexWrap: "nowrap",
                                                                    alignContent: "center",
                                                                    alignItems: "center",
                                                                    justifyContent: "center"}}>
                                                                    <Image
                                                                        source={avka}
                                                                        style={{
                                                                            resizeMode: 'cover',
                                                                            width: pw,
                                                                            height: ph,
                                                                            borderRadius: Math.ceil(pw /2)
                                                                        }}/>
                                                                    <Text style={{
                                                                        fontWeight: 'bold',
                                                                        fontSize: fs,
                                                                        flexWrap: 'nowrap',
                                                                        alignItems: 'center',
                                                                        alignContent: 'center',
                                                                        justifyContent: 'center',
                                                                        fontFamily: 'ProximaNova'
                                                                    }}>{item.uinfo.nick}</Text>
                                                                </SafeAreaView>
                                                            </TouchableOpacity>
                                                            <SafeAreaView style={{
                                                                marginLeft: ml,
                                                                marginTop: omamartop,
                                                                justifyContent: 'flex-start',
                                                                alignContent: 'flex-start',
                                                                alignItems: 'flex-start',
                                                                flex: 1,
                                                                display: 'flex',
                                                                flexDirection: 'column'
                                                            }}>
                                                                <Text style={{justifyContent: 'flex-start',
                                                                    alignContent: 'flex-start',
                                                                    alignItems: 'flex-start',
                                                                    alignSelf: 'flex-start',
                                                                    fontSize: fs2, fontFamily: 'Tahoma',
                                                                    maxWidth: maxwT, overflow: 'hidden'}}>
                                                                    {item.opis}
                                                                </Text>
                                                                <SafeAreaView style={[styles.tagsC, {maxWidth: maxwT, alignContent: 'space-around'}]}>
                                                                    {item.tags.map((t, ii) => {
                                                                        return (
                                                                            <TouchableOpacity style={[styles.tagT, {marginTop: 2, marginBottom: 2}]} key={ii} onPress={()=>{
                                                                                this.navi.navigate('search', {title: 'Поиск', tag: t});
                                                                            }}>
                                                                                <Text style={[styles.tag, {fontSize: fss2, fontFamily: 'ProximaNova'}]}>{t}</Text>
                                                                            </TouchableOpacity>
                                                                        )
                                                                    })}
                                                                </SafeAreaView>
                                                            </SafeAreaView>
                                                        </SafeAreaView>
                                                    </SafeAreaView>
                                                </ListItem>
                                            )
                                        })
                                        :
                                            <SafeAreaView style={{
                                                width: '100%', height: '100%', display: "flex", flex:1, minHeight: mHm,
                                                flexDirection: "column",
                                                alignContent: "center",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                <SafeAreaView style={{maxHeight: '50%', flexDirection: "column",
                                                    alignContent: "center",
                                                    alignItems: "center",  display: "flex", flex:1,
                                                    justifyContent: "center"}}>
                                                    <Text style={{fontWeight: 'bold', flex:1, display: 'flex', alignItems: 'center', alignContent: 'center', textAlign: 'center', justifyContent: 'center', fontFamily: 'Tahoma', textTransform: 'uppercase', color: '#afafaf', fontSize: 14, width: this.maxWidth-60}}>
                                                        Подпишитесь на интресные аккаунты, чтобы не пропустить их афиши
                                                    </Text>
                                                    <Image source={lolgo} style={{width: 206, height: 270, marginTop: 30}}/>
                                                </SafeAreaView>
                                            </SafeAreaView>
                                    }
                                </List>
                            </ScrollView>
                            </SafeAreaView>

                            <Bottom navigate={navigate}/>

                        </SafeAreaView>
                    </Container>

                );
            } else {
                const {navigation: {navigate}} = this.props;
                return (
                    <Container style={{fontFamily: 'Tahoma'}}>
                        <Header/>
                        <Text>Not Mounted(</Text>
                        <Bottom navigate={navigate}/>
                    </Container>
                )
            }
        }
    }
}
/*
const getImageSize = new Promise(
    (resolve, reject) => {
        Image.getSize(test1pic, (width, height) => {
            resolve({ width, height });
        });
    },
    (error) => reject(error)
);
*/

const styles = StyleSheet.create({
    postView: {
        width: '100%',
        alignContent: "center",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: '100%'
    },
    plaha: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: 5,
        position: 'absolute',
        top: 15
    },
    tagT: {
        backgroundColor: '#f1f1f1',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#949292',
        borderRadius: 5,
        padding: 2,
        marginRight: 5
    },
    tag: {
        backgroundColor: '#f1f1f1',
        fontWeight: 'bold',
        color: '#949292'
    },
    tagsC: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignContent: "flex-start",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: 8
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
    }
});

export default CategoriesList;