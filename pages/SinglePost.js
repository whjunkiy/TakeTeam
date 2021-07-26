import React from "react";
import store from '../redux/store';
import {Container, Input, Text} from "native-base";
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    SafeAreaView,
    StyleSheet,
    TouchableHighlight
} from "react-native";
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Image} from "react-native";
import l_arrow from "../assets/l_arrow.png";
import bigava from '../assets/defava.png';
import preview from "../assets/preview.png";
import Bottom from "../components/Bottom";
import {getPostInfo, showComments, addComment, goEvent, getJoiners, approve4event, showSharing} from '../redux/actions';
import prewa from "../assets/preview.jpeg";
import chyvak from "../assets/chyvak.png";
import comix from "../assets/comix.png";
import samik from "../assets/samolet.png";
import cancel from "../assets/cancel.png";
import regi from "../assets/rega.png";
import CommentModal from "../components/CommentModal";
import krst from "../assets/x.png";
import larr from "../assets/l_arrow.png";
import approved from "../assets/approved.png";
import ShareModal from "../components/ShareModal";
const { width, height } = Dimensions.get('screen');

export default class SinglePost extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.nCstate = store.getState();
        this.plaharefs = [];
        this.maxWidth = width;
        this.navi = this.props.navigation;
        this.maxHeight = height;
        this.jr = React.createRef();
        //this.textInput = null;
        if (width > 900) {
            this.maxWidth = 900;
            this.maxHeight = 1600;
        } else {
            this.maxHeight = width * 1.78;
        }
        this.curSlide = 0;
        this.pw = '100%';
        this.picsetted = 1;
        this.refas = {};
        this.ct2 = [];
        this.pid = this.navi.getParam('pid');
        this.state={
            isLoading: true,
            singlePostStatus: this.nCstate.singlePost.status,
            event: {},
            title: 'Заголовок',
            post: {},
            uzr: {},
            pica: preview,
            ava: bigava,
            nick: '...',
            opis: '',
            tags: [],
            opa: 1,
            curpic: 0,
            igo: this.nCstate.myevents.events.igo,
            ecid: null, flag: -1,
            commentTxt: '',
            coms: [], showReqs: false,
            joinersStatus: 0, joiners: [],
            requests: [], ap: [], jnrs: 0
        };
        this.showingpic = 0;
        this.getImg = this.getImg.bind(this);
        this.goProfile = this.goProfile.bind(this);
        this.changeImg = this.changeImg.bind(this);
        this.changeImg1 = this.changeImg1.bind(this);
        this.changeImg2 = this.changeImg2.bind(this);
        this.goButton = this.goButton.bind(this);
        this.comment = this.comment.bind(this);
        this.viewPic = this.viewPic.bind(this);
        this.getSizes = this.getSizes.bind(this);
        this.joinEvent = this.joinEvent.bind(this);
        this.canEvent = this.canEvent.bind(this);
        this.regEvent = this.regEvent.bind(this);
        this.addComment = this.addComment.bind(this);
        this.scrollim = this.scrollim.bind(this);
        this.viewJoiners = this.viewJoiners.bind(this);
        this.approv = this.approv.bind(this);
        this.sharing = this.sharing.bind(this);
        this.switchPica = this.switchPica.bind(this);
    }

    switchPica() {
        let cnt = 0;
        for (let i in this.refas) {
            cnt ++;
        }
        if (cnt < 2) return;
        let curpic = this.showingpic;
        let setpic = curpic + 1;
        if (setpic >= cnt) setpic = 0;
        for (let i in this.refas) {
            this.refas[i].current.setNativeProps({left: (i+1) * this.maxWidth});
        }
        this.refas[setpic].current.setNativeProps({left: -1*(setpic)*this.maxWidth});
        this.showingpic = setpic;
        for (let i in this.plaharefs) {
            if (this.plaharefs[i].current) {
                this.plaharefs[i].current.setNativeProps({opacity: 0.5});
            }
        }
        if (this.plaharefs[setpic].current) {
            this.plaharefs[setpic].current.setNativeProps({opacity: 1});
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
    approv(r,i) {
        store.dispatch(approve4event(this.nCstate.login.email, this.nCstate.login.token, r.email, this.pid));
        let ap = this.state.ap;
        ap[i] = 1;
        this.setState({ap: ap});
    }
    joinEvent() {
        store.dispatch(goEvent(this.nCstate.login.email, this.nCstate.login.token, this.pid, 'go'));
        let joiners = this.state.jnrs + 1;
        this.setState({flag: 0, jnrs: joiners});
    }
    canEvent(){
        let flag = 1;
        if (this.state.post.hasOwnProperty('rega')) {
            if (this.state.post.rega) {
                flag = 2;
            }
        }
        if (this.nCstate.login.email === this.state.post.uzr) {
            flag = 3;
            if (this.state.post.hasOwnProperty('rega')) {
                if (this.state.post.rega) {
                    flag = 4;
                }
            }
        }
        store.dispatch(goEvent(this.nCstate.login.email, this.nCstate.login.token, this.pid, 'cancel'));
        let joiners = this.state.jnrs - 1;
        this.setState({flag: flag, jnrs: joiners});
    }
    regEvent(){
        store.dispatch(goEvent(this.nCstate.login.email, this.nCstate.login.token, this.pid, 'reg'));
        this.setState({flag: 0});
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
    scrollim(to){
        if (!this.refas.current) {
            console.log("NO REF!!!");
            return;
        }
        this.refas.current.scrollTo({y: 0, x: to, animated: true});
        /*this.ct2 = [];
        setTimeout(()=>{
            this.picsetted = 1;
        }, 800);

         */
    }

    viewPic(picn) {
        if (this._isMounted) {
            /*this.picsetted = 0;
            const pw = width * picn;
            if (!this.refas) {
                console.log("NO refas");
                return;
            }
            if (!this.refas.current) {
                console.log("NO refas curr");
                return;
            }
            this.refas.current.scrollTo({x: pw, y: 0, animated: true});
            for (let i in this.plaharefs) {
                if (this.plaharefs[i].current) {
                    this.plaharefs[i].current.setNativeProps({opacity: 0.5});
                }
            }
            if (this.plaharefs[picn].current) {
                this.plaharefs[picn].current.setNativeProps({opacity: 1});
            }*/

            for (let i in this.refas) {
                this.refas[i].current.setNativeProps({left: this.maxWidth * (i+1)});
            }
            this.refas[picn].current.setNativeProps({left: -1*picn*this.maxWidth});
            this.showingpic = picn;
            for (let i in this.plaharefs) {
                if (this.plaharefs[i].current) {
                    this.plaharefs[i].current.setNativeProps({opacity: 0.5});
                }
            }
            if (this.plaharefs[picn].current) {
                this.plaharefs[picn].current.setNativeProps({opacity: 1});
            }

        }
    }

    changeImg1 = (nativeEvent) => {
        //console.log("started at = " + nativeEvent.contentOffset.x);
        this.ct2[0] = nativeEvent.contentOffset.x;

    }
    changeImg2 = (nativeEvent) => {
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

        let slidesCount = this.state.post['pics'].length-1;
        if (slide > slidesCount && to > 0) return;
        this.scrollim(slide*this.maxWidth);
        this.ct2 = [];
    }

    changeImg = (nativeEvent) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        for (let i in this.plaharefs) {
            if (this.plaharefs[i].current) {
                this.plaharefs[i].current.setNativeProps({opacity: 0.5});
            }
        }
        if (this.plaharefs[slide].current) {
            this.plaharefs[slide].current.setNativeProps({opacity: 1});
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
    viewJoiners(t) {
        store.dispatch(getJoiners(this.state.post['_id']));
        this.setState({showReqs: true});
    }
    goButton() {
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
            let flag = 1;
            if (this.state.flag !== -1) {
                flag = this.state.flag;
            } else {
                const igo = this.state.igo;
                for (let i in igo) {
                    if (igo[i]['_id'] === this.pid) {
                        flag = 0;
                    }
                }
                if (this.state.post.hasOwnProperty('requests')) {
                    for (let i in this.state.post.requests) {
                        if (this.state.post.requests[i] === this.nCstate.login.email) {
                            flag = 0;
                        }
                    }
                }
                if (flag) {
                    if (this.state.post.hasOwnProperty('rega')) {
                        if (this.state.post.rega) {
                            flag = 2;
                        }
                    }
                }
                if (this.nCstate.login.email === this.state.post.uzr) {
                    flag = 3;
                    if (this.state.post.hasOwnProperty('rega')) {
                        if (this.state.post.rega) {
                            flag = 4;
                        }
                    }
                }
            }
            let fs = 28, pl=35, pt=8, pl2 = 65;
            if (width < 900) {
                fs = 19;
                pl=15;
                pt=4;
                pl2 = 25;
            }

            if (flag === 1) {
                return (
                    <TouchableOpacity style={{
                        backgroundColor: '#ff0054',
                        width: pw, height: ph, marginLeft: ml, minHeight: ph,
                        borderRadius: 5, flex:1, display: 'flex', maxHeight: ph,
                        justifyContent:'center', alignItems: 'center', alignContent: 'center'}} onPress={()=>{this.joinEvent()}}>
                            <Text style={{textTransform: 'uppercase', color: 'white', fontFamily: 'ProximaNova', fontSize: fs, fontWeight: 'bold'}}>Погнали!</Text>
                    </TouchableOpacity>
                )
            } else if (flag === 0) {
                return (
                    <TouchableOpacity style={{
                        backgroundColor: '#5d001f',
                        width: pw, height: ph, marginLeft: ml, minHeight: ph,
                        borderRadius: 5, flex:1, display: 'flex', maxHeight: ph,
                        justifyContent:'center', alignItems: 'center', alignContent: 'center'}} onPress={()=>{this.canEvent()}}>
                            <Text style={{textTransform: 'uppercase', color: 'white', fontFamily: 'ProximaNova', fontSize: fs, fontWeight: 'bold'}}>Отмена</Text>
                    </TouchableOpacity>
                )
            } else if (flag === 2) {
                return (
                    <TouchableOpacity style={{
                        backgroundColor: '#ff0054',
                        width: pw, height: ph, marginLeft: ml, minHeight: ph,
                        borderRadius: 5, flex:1, display: 'flex', maxHeight: ph,
                        justifyContent:'center', alignItems: 'center', alignContent: 'center'}} onPress={()=>{this.regEvent()}}>
                            <Text style={{textTransform: 'uppercase', color: 'white', fontFamily: 'ProximaNova', fontSize: fs, fontWeight: 'bold'}}>Регистрация</Text>
                    </TouchableOpacity>
                )
            } else if (flag === 3) {
                return (
                    <TouchableOpacity onPress={()=>{this.viewJoiners(2)}} style={{
                        backgroundColor: '#2f0019',
                        width: pw, height: ph, marginLeft: ml, minHeight: ph,
                        borderRadius: 5, flex:1, display: 'flex', maxHeight: ph,
                        justifyContent:'center', alignItems: 'center', alignContent: 'center'}}>
                        <Text style={{textTransform: 'uppercase', color: 'white', fontFamily: 'ProximaNova', fontSize: fs, fontWeight: 'bold'}} onPress={()=>{this.viewJoiners(0)}}>
                        Организатор</Text>
                    </TouchableOpacity>
                )
            } else if (flag === 4) {
                return (
                    <TouchableOpacity style={{
                        backgroundColor: '#2f0019',
                        width: pw, height: ph, marginLeft: ml, minHeight: ph,
                        borderRadius: 5, flex:1, display: 'flex', maxHeight: ph,
                        justifyContent:'center', alignItems: 'center', alignContent: 'center'}} onPress={()=>{this.viewJoiners(1)}}>
                            <Text style={{textTransform: 'uppercase', color: 'white', fontFamily: 'ProximaNova', fontSize: fs, fontWeight: 'bold'}}>Запросы</Text>
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
                        height: ph, maxHeight: ph,
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
                    if (state.login.info.hasOwnProperty('subed')) subed = state.login.info.subed;
                    if (subed.indexOf(item.uzr) === -1) {
                        flag = 0;
                    }
                }
            }
            if (this._isMounted && flag) store.dispatch(showComments(this.pid));
            //this.setState({modalDisplay: 'flex', modalVisible: true, ecid: item['_id'], coms: coms});
        } else {
            this.navi.navigate('authing', {title: 'Авторизация'});
        }
    }
    addComment(){
        const state = store.getState();
        if (state.login.status > 0 && this._isMounted) {
            store.dispatch(addComment(state.login.email, state.login.token, this.state.ecid, this.state.commentTxt));
            let coms = this.state.coms;
            const ct = parseInt(Date.now()/1000);
            coms.push({ct: ct, uzr: state.login.info, txt: this.state.commentTxt});
            this.setState({coms: coms, commentTxt: ''});
        }
    }
    getImg(pica, item, myRef) {
        if (this._isMounted) {
            if (!item.hasOwnProperty('pics')) {
                item['pics'] = [preview];
            } else if (item['pics'][0] === 'preview') {
                item['pics'] = [preview];
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
            let iid = item['_id'];
            const imgC = item.pics.length;
            const plw = Math.ceil(width / imgC) - 5;
            let joiners = 0;
            if (item.hasOwnProperty('joiners')) {
                joiners = item.joiners.length;
            }
            let pw = 50, ph = 50, fs = 35, ml = 25;
            if (width < 900) {
                let dl = 1.7
                pw = Math.ceil(pw/dl);
                ph = Math.ceil(ph/dl);
                fs = 28;
                ml = 13;
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
            return (
                <SafeAreaView style={{width: this.maxWidth, height: this.maxHeight}}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.switchPica();
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
                            this.jr = React.createRef();
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
                            this.refas[index] = React.createRef();
                            let dispa = index * this.maxWidth;
                            return (
                                <SafeAreaView key={index} ref={this.refas[index]}
                                              style={{width: this.maxWidth, height: this.maxHeight,
                                    backgroundColor: 'black', display: "flex", position: "relative", left: dispa,
                                    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center',
                                    alignItems: 'center'}}>
                                    {item.nadpisi[index] ?
                                        <Text style={[{
                                            position: 'absolute',
                                            top: '48%',
                                            fontFamily: 'Tahoma',
                                            zIndex: 9999,
                                            fontWeight: 'bold',
                                            fontSize: nadpFS[index],
                                            color: txtclr,
                                            transform: [{"rotate": rotas[index]+'deg'}],
                                            backgroundColor: bckclr
                                        }, chrds[index]]}>{item.nadpisi[index]}</Text>
                                        : <Text></Text>
                                    }
                                    <Image
                                        source={p}
                                        style={{
                                            width: picw,
                                            height: pich
                                        }}
                                    />
                                </SafeAreaView>
                            )
                        })
                        }
                    </TouchableOpacity>
                    {item.pics.length > 1 ?
                        <SafeAreaView style={[styles.plaha, {width: width - 5}]}>
                            {
                                item.pics.map((pika, ppi) => {
                                    let opa = 0.5;
                                    if (this._isMounted) {
                                        if (item.pics.indexOf(pika) === this.state.curpic) {
                                            opa = 1
                                        }
                                    }
                                    this.plaharefs[ppi] = React.createRef();
                                    return (
                                        <TouchableOpacity
                                            key={ppi}
                                            onPress={
                                                () => {
                                                    this.viewPic(ppi, this.refas)
                                                }
                                            }
                                            style={{
                                                width: plw-2,
                                                height: 5,
                                                borderRadius: 5,
                                                marginLeft: 2
                                            }}
                                        >
                                            <SafeAreaView ref={this.plaharefs[ppi]} style={{opacity: opa,
                                                width: plw-2,
                                                height: 5,
                                                borderRadius: 5,
                                                backgroundColor: '#FFF',}}></SafeAreaView>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </SafeAreaView>
                        :
                        <SafeAreaView></SafeAreaView>
                    }
                    <SafeAreaView style={{
                        width: this.pw,
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: 'absolute',
                        bottom: 70,
                        height: 100
                    }}>
                        <Text style={{color: '#ffc03a', fontWeight: 'bold', fontSize: fs, fontFamily: 'ProximaNova'}} ref={this.jr}>+{this.state.jnrs}</Text>
                        <Image source={chyvak} style={{resizeMode: 'stretch', width: pw, height: ph, marginLeft: ml}}/>
                        {this.goButton()}
                        <TouchableOpacity onPress={()=>{this.comment(item)}}>
                            <Image source={comix} style={{resizeMode: 'stretch', width: pw, height: ph, marginLeft: ml}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{this.sharing(item)}}
                        >
                            <Image source={samik} style={{resizeMode: 'stretch', width: pw, height: ph, marginLeft: ml}}/>
                        </TouchableOpacity>
                    </SafeAreaView>
                    <SafeAreaView style={{minHeight: 10}}></SafeAreaView>
                </SafeAreaView>
            )
            //this.setState({rnd: Math.random()});
        } else {
            return (
                <Text>Loading...</Text>
            )
        }
    }
    goProfile() {
        let whom = 0;
        let state = store.getState();
        if (state.login.status > 0) {
            if (this.state.uzr.hasOwnProperty('email')) {
                if (state.login.email === this.state.uzr.email) {
                    whom = 1;
                }
            }
        }
        store.dispatch({type:"SETPROFILE", mail: this.state.uzr.email, whom: whom});
        this.navi.navigate('profile', {email: this.state.uzr.email, whom: whom, title: 'Профиль'});
    }
    async componentDidMount() {
        this._isMounted = true;
        store.dispatch(getPostInfo(this.pid));
        store.subscribe(() => {
            if (this._isMounted) {
                const state = store.getState();
                if (state.coms.view) {
                    this.setState({opa: 0.5});
                } else {
                    this.setState({opa: 1});
                }
                if (state.page.disabled !== this.state.isLoading) {
                    this.setState({isLoading: state.page.disabled})
                }
                if (state.joiners.status !== this.state.joinersStatus) {
                    let ap = [];
                    for (let i in state.joiners.requests) ap.push(0);
                    this.setState({ap: ap, joiners: state.joiners.joiners, requests: state.joiners.requests, joinersStatus: state.joiners.status})
                }
                if (state.singlePost.status !== this.state.singlePostStatus) {
                    let title = 'Заголовок', pica = preview;
                    let post = {}, uzr = {}, ava = bigava, nick = '...', opis = '', tags = [], joiners = 0;
                    if (state.singlePost.event.hasOwnProperty('post')) {
                        post = state.singlePost.event.post;
                        uzr = state.singlePost.event.uzr;
                        if (uzr.hasOwnProperty('private') && uzr.email !== state.login.email) {
                            if (uzr.private) {
                                let subed = [];
                                if (state.login.status > 0) {
                                    if (state.login.info.hasOwnProperty('subed')) {
                                        subed = state.login.info.subed;
                                        if (subed.indexOf(uzr.email) === -1) {
                                            this.navi.goBack();
                                            return null;
                                        }
                                    } else {
                                        this.navi.goBack();
                                        return null;
                                    }
                                } else {
                                    this.navi.goBack();
                                    return null;
                                }
                            }
                        }
                        if (post.hasOwnProperty('cansee')) {
                            if (post.cansee !== 1) {
                                let subed = [];
                                if (state.login.status > 0) {
                                    if (state.login.info.hasOwnProperty('subed')) {
                                        subed = state.login.info.subed;
                                        if (subed.indexOf(uzr.email) === -1) {
                                            this.navi.goBack();
                                            return null;
                                        }
                                    } else {
                                        this.navi.goBack();
                                        return null;
                                    }
                                } else {
                                    this.navi.goBack();
                                    return null;
                                }

                            }
                        }
                        if (uzr.hasOwnProperty('ava')) {
                            ava = {uri: 'https://taketeam.net/avas/' + uzr.ava};
                        }
                        if (uzr.hasOwnProperty('nick')) {
                            nick = uzr.nick;
                        }
                        if (state.singlePost.event.post.hasOwnProperty('title')) {
                            if (state.singlePost.event.post.title) {
                                title = state.singlePost.event.post.title;
                            }
                        }
                        if (state.singlePost.event.post.hasOwnProperty('opis')) {
                            opis = state.singlePost.event.post.opis;
                        }
                        if (state.singlePost.event.post.hasOwnProperty('joiners')) {
                            joiners = state.singlePost.event.post.joiners.length;
                        }
                        if (state.singlePost.event.post.hasOwnProperty('pics')) {
                            if (state.singlePost.event.post.pics[0] !== 'preview') {
                                pica = {uri: 'https://taketeam.net/posters/' + state.singlePost.event.post.pics[0]['uri']}
                            }
                        }
                        if (state.singlePost.event.post.hasOwnProperty('tags')) {
                            tags = state.singlePost.event.post.tags;
                        }
                    }
                    this.setState({
                        singlePostStatus: state.singlePost.status,
                        event: state.singlePost.event,
                        title: title,
                        post: post,
                        uzr: uzr,
                        ava: ava,
                        nick: nick,
                        opis: opis,
                        tags: tags,
                        pica: pica,
                        jnrs: joiners
                    });
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
        if (this.state.isLoading) {
            return (
                <Container style={{width: '100%', height: '100%'}}>
                    <SafeAreaView style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#ff0054" style={styles.loader}/>
                    </SafeAreaView>
                </Container>
            )
        } else if (this.state.showReqs) {
            let mw = this.maxWidth - 120;
            let mw2 = this.maxWidth - 100;
            let mh = Math.ceil(this.maxHeight/2.5);
            let mh2 =  this.maxHeight-250;
            let l = '315%';
            let avw = 100;
            let avh = 100;
            let aw = 288;
            let ah = 70, fss = 28;
            let pt = 16, pl = 91;
            if (width < 900) {
                mw = this.maxWidth-20;
                mw2 = this.maxWidth-10;
                mh = this.maxHeight-150;
                mh2 = this.maxHeight - 100;
                l = '190%';
                avw = 50;
                avh = 50;
                aw = 144;
                ah = 35;
                pt = 7;
                pl = 36;
                fss = 18;
            }
            return (
                <Container style={{fontFamily: 'Tahoma'}}>
                    <SafeAreaView style={{minHeight: 20}}>
                    </SafeAreaView>
                    <SafeAreaView style={[styles.centeredView]}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={true}
                            style={{borderWidth: 0}}
                        >
                            <SafeAreaView style={[styles.centeredView, {width: width, height: mh2+50, maxHeight: mh2+50}]}>
                                <SafeAreaView style={[styles.modalView, {width: mw2, height: mh2+50, maxHeight: mh2+50,
                                    margin: 5, padding: 5}]}>
                                    <SafeAreaView style={{
                                        width: mw2-10,
                                        minWidth: mw2-10,
                                        marginTop: 10,
                                        paddingLeft: 10,
                                        height: mh2 ,
                                        maxHeight: mh2 ,
                                        minHeight: mh2,
                                        alignContent: "flex-start",
                                        flex: 1, flexWrap: 'nowrap',
                                        justifyContent: "flex-start",
                                        alignItems: "flex-start",
                                        flexDirection: "column"
                                    }}>

                                        <SafeAreaView style={{flexDirection: 'row'}}>
                                            <Image source={larr} style={{width: 24, height: 24, resizeMode: 'cover', marginTop: -3}}/>
                                            <Text style={{textTransform: 'uppercase', fontWeight: 'bold', fontSize: 15, fontFamily: 'ProximaNova'}}>Запросы</Text>
                                            <TouchableHighlight style={{zIndex: 9999, position: 'relative', top: 0, left: width - 170, width: 20, height: 20}}
                                                onPress={()=>{
                                                    this.setState({showReqs: false})
                                                }}>
                                                <Image source={krst} style={{width: 20, height: 20}} />
                                            </TouchableHighlight>
                                        </SafeAreaView>
                                        <SafeAreaView style={{width: '100%', minHeight: 1, backgroundColor: 'grey', marginTop: 2}}></SafeAreaView>
                                        <SafeAreaView style={{maxHeight: mh2 -70, minHeight: mh2 -70, height: mh2 -70, width: mw2-30}}>
                                        <ScrollView>
                                            {this.state.requests.map((r,i)=>{
                                                let ava = bigava;
                                                let nick = '...';
                                                if (r.hasOwnProperty('ava')) {
                                                    ava = {uri: 'https://taketeam.net/avas/' + r.ava}
                                                }
                                                if (r.hasOwnProperty('nick')) {
                                                    nick = r.nick;
                                                }
                                                return (
                                                    <SafeAreaView key={i} style={{marginTop: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignContent: 'center',
                                                        alignItems:'center'}}>
                                                        <TouchableHighlight onPress={()=>{
                                                            store.dispatch({type:"SETPROFILE", mail: r.email, whom: 0});
                                                            this.navi.navigate('profile', {title: 'Профиль', email: r.email, whom: 0})
                                                        }} >
                                                            <SafeAreaView style={{flexDirection: 'row', alignContent: 'center',
                                                                alignItems:'center', justifyContent: 'center'}}>
                                                            <Image source={ava} style={{width: avw, height: avh, borderRadius: Math.ceil(avw / 2), resizeMode: 'cover'}} />
                                                            <Text style={{fontFamily: 'Tahoma', fontWeight: 'bold', fontSize: 16, marginLeft: 10}}>{nick}</Text>
                                                            </SafeAreaView>
                                                        </TouchableHighlight>
                                                        {this.state.ap[i] ?
                                                            <Image source={approved} style={{width: aw, height: ah, resizeMode: 'cover'}} />
                                                            :
                                                            <TouchableHighlight onPress={()=>{this.approv(r,i)}}>
                                                                <Text style={{backgroundColor: '#ff0073',
                                                                    color: 'white',
                                                                    fontFamily: 'ProximaNova',
                                                                    fontSize: fss,
                                                                    fontWeight: 'bold',
                                                                    textTransform: 'uppercase',
                                                                    width: aw,
                                                                    height: ah,
                                                                    paddingTop: pt,
                                                                    paddingLeft: pl,
                                                                    borderRadius: 10
                                                                }}>Запрос</Text>
                                                            </TouchableHighlight>
                                                        }
                                                    </SafeAreaView>
                                                )
                                            })}
                                            {this.state.joiners.map((r,i)=>{
                                                let ava = bigava;
                                                let nick = '...';
                                                if (r.hasOwnProperty('ava')) {
                                                    ava = {uri: 'https://taketeam.net/avas/' + r.ava}
                                                }
                                                if (r.hasOwnProperty('nick')) {
                                                    nick = r.nick;
                                                }
                                                return (
                                                    <SafeAreaView key={i} style={{marginTop: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignContent: 'center',
                                                        alignItems:'center'}}>
                                                        <TouchableOpacity onPress={()=>{
                                                            store.dispatch({type:"SETPROFILE", mail: r.email, whom: 0});
                                                            this.navi.navigate('profile', {title: 'Профиль', email: r.email, whom: 0})
                                                        }} style={{flexDirection: 'row', alignContent: 'center',
                                                            alignItems:'center', justifyContent: 'center'}}>
                                                            <Image source={ava} style={{width: avw, height: avh, borderRadius: Math.ceil(avw / 2), resizeMode: 'cover'}} />
                                                            <Text style={{fontFamily: 'Tahoma', fontWeight: 'bold', fontSize: 16, marginLeft: 10}}>{nick}</Text>
                                                        </TouchableOpacity>
                                                        <Image source={approved} style={{width: aw, height: ah, resizeMode: 'cover'}} />
                                                    </SafeAreaView>
                                                )
                                            })}
                                        </ScrollView>
                                        </SafeAreaView>
                                    </SafeAreaView>
                                </SafeAreaView>
                            </SafeAreaView>
                        </Modal>
                    </SafeAreaView>
                </Container>
            )
        } else {
            let pw = 70, ph = 70, fs = 20, ml = 50, fs2 = 18, ml2 = 25, mt = -20, ll = 30;
            let omamartop = 5;
            let maxwT = 750;
            if (width < 900) {
                let dl = 1;
                pw = Math.ceil(pw/dl);
                ph = Math.ceil(ph/dl);
                ml = 10;
                fs = 14;
                fs2 = 15;
                ml2 = 30;
                mt = -23;
                ll = 10;
                maxwT =  width / 900 * 700;
            }
            return (
                <Container style={{fontFamily: 'Tahoma'}}>

                    <CommentModal navigate={this.navi.navigate}/>
                    <ShareModal navigate={this.navi.navigate}/>
                    <ScrollView style={{opacity: this.state.opa, flexDirection: 'column'}}>
                        <SafeAreaView style={[styles.header, {padding: 0, margin: 0, height: 40, maxHeight: 40, minHeight: 40}]}>
                            <SafeAreaView style={{position: 'relative', top: 0, justifyContent: 'center', padding: 0, margin: 0,
                                flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', alignContent: 'center', height: 40, maxHeight: 40, minHeight: 40}}>
                                <Image source={l_arrow} style={{width: 24, height: 24}}/>
                                <Text style={{fontWeight: 'bold', fontSize: 26, fontFamily: 'ProximaNova'}}>{this.state.title}</Text>
                            </SafeAreaView>
                        </SafeAreaView>
                        <SafeAreaView style={{
                            width: '100%',
                            alignContent: "center",
                            flex: 1,
                            marginTop: 40,
                            justifyContent: "center",
                            alignItems: "center",
                            maxHeight: this.maxHeight,
                            height: this.maxHeight - 15
                        }}>
                            <SafeAreaView style={[styles.postView, {height: this.maxHeight - 15, maxHeight: this.maxHeight, marginTop: 10}]}>
                                {this.getImg(this.state.pica, this.state.post, this.refas)}
                            </SafeAreaView>
                            <SafeAreaView style={{
                                marginTop: mt,
                                backgroundColor: 'white',
                                width: this.maxWidth,
                                maxWidth: this.maxWidth,
                                minHeight: 100,
                                display: "flex",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignContent: "flex-start",
                                alignItems: "flex-start",
                                justifyContent: "flex-start"
                            }}>
                                <TouchableOpacity onPress={() => {
                                    this.goProfile()
                                }}>
                                    <SafeAreaView style={{maxWidth: pw+14,
                                        marginLeft: 5,
                                        position: 'relative',
                                        left: 5, overflow: 'hidden',
                                        marginTop: 5,
                                        width: pw+12,
                                        display: "flex",
                                        flexDirection: "column",
                                        flexWrap: "nowrap",
                                        alignContent: "center",
                                        alignItems: "center",
                                        justifyContent: "center"}}>
                                        <Image
                                            source={this.state.ava}
                                            style={{
                                                resizeMode: 'cover',
                                                width: pw,
                                                height: ph,
                                                borderRadius: Math.ceil(pw / 2)
                                            }}/>
                                        <Text style={{
                                            fontWeight: 'bold',
                                            fontSize: fs,
                                            alignItems: 'center',
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                            fontFamily: 'ProximaNova'
                                        }}>{this.state.nick}</Text>
                                    </SafeAreaView>
                                </TouchableOpacity>
                                <SafeAreaView style={{marginLeft: ml,
                                    marginTop: omamartop,
                                    justifyContent: 'flex-start',
                                    alignContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column'}}>
                                    <Text style={{justifyContent: 'flex-start',
                                        alignContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        alignSelf: 'flex-start',
                                        fontSize: fs2, fontFamily: 'Tahoma',
                                        maxWidth: maxwT, overflow: 'hidden'}}>
                                        {this.state.opis}
                                    </Text>
                                    <SafeAreaView style={[styles.tagsC, {maxWidth: maxwT, alignContent: 'space-around'}]}>
                                        {this.state.tags.map((t, ii) => {
                                            return (
                                                <TouchableOpacity style={[styles.tagT, {marginTop: 2, marginBottom: 2}]} key={ii} onPress={()=>{
                                                    this.navi.navigate('search', {title: 'Поиск', tag: t});
                                                }}>
                                                    <Text style={[styles.tag, {fontSize: fs2, fontFamily: 'ProximaNova'}]}>{t}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </SafeAreaView>
                                </SafeAreaView>
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
    header: {
        width: '100%',
        alignContent: "center",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexWrap: 'nowrap',
        flexDirection: "row"
    },
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
    inp: {
        width: '30%',
        minHeight: 40,
        backgroundColor: '#ececec',
        borderColor: '#909090',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        color: '#909090'
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
        alignItems: "center",
        width: '100%'
    },
    afisha: {
        resizeMode: 'cover',
        width: 272,
        height: 365,
        margin: 5
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