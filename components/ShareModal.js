import React from 'react';
import {useState, useEffect, useRef} from 'react';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Constants from 'expo-constants';
import {List, ListItem, Text, Container, Input} from 'native-base';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    View, Linking,
    TouchableOpacity,
    SafeAreaView, Share,
    ActivityIndicator,
    RefreshControl, Modal, TextInput
} from 'react-native';
import store from '../redux/store';
const { width, height } = Dimensions.get('screen');
import ava from '../assets/defava.png';
import {Image} from "react-native";
import {Button} from "react-native";
import {sendEvent, hideSharing, getChatAvas, report, block} from "../redux/actions";
import bigava from "../assets/defava.png";
import whatsup from '../assets/whatus.png';
import sadface from '../assets/sadface.png';
import ig from '../assets/ig.png';
import vk from '../assets/vk.png';
import linka from '../assets/sharr.png';

export default function ShareModal({navigate}) {
    let nCstate = store.getState();
    let maxWidth = width;
    let hz = 50;
    let commentHeight = height-200;
    if (width < 500) {
        commentHeight += 20;
    }
    if (width > 900) {
        maxWidth = 900;
        hz = 250;
    }

    let smsref = null;
    const [modalVisible, setmodalVisible] = useState(false);
    const [rnd, setRnd] = useState(0);
    const [modalDisplay, setmodalDisplay] = useState('none');
    const [isLoading, setLoading] = useState(0);
    const [avas, setAvas] = useState([]);
    const [chatState, setChatState] = useState(0);
    const [showAlert, setShowAlert] = useState(0);
    const [modalText, setModalText] = useState('');
    const [logined, setLoaded] = useState(nCstate.login.status);
    const [Mrnd, setMrnd] = useState(0);
    let mounted = useRef(0);

    let lft = (Math.ceil(maxWidth/3));
    let ML = -16;
    let MT31 = 60;
    if (maxWidth < 900) {
        lft = lft - 50;
        ML = -1;
        MT31 = 50;
    }

    let w = 100;
    if (width < 900) {
        w = 100 * (width  / 900) + 10;
    }

    const reportIT = () => {
        if (showAlert) return null;
        const state = store.getState();
        let eid = state.share.item['_id'];
        store.dispatch(report(state.login.email, state.login.token, eid));
        setModalText('Жалоба отправлена куда следует!');
        setShowAlert(1);
    }

    const getAvas = async () => {
        if (!mounted.current) return null;
        //setLoading(1);
        let items = [];
        const state = store.getState();
        let q = {
            email: state.login.email,
            token: state.login.token,
            act: 'getChat'
        };
        let response = await fetch('https://taketeam.net/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(q)
        });
        let r = await response.json();
        for (let i in r.info){
            let ava = bigava;
            if (r.info[i]['ava'] !== 'bigava') ava = r.info[i]['ava'];
            items.push({
                mail: r.info[i]['uzr'],
                nick: r.info[i]['nick'],
                ava: ava
            });
        }
        setAvas(items);
        //setLoading(0);
    }

    let fs = 18, hh = 150, pw = 176, ph = 105, fss = 24;
    if (width < 900) {
        fs = 14;
        hh = 150 * (width / 900) + 20;
        pw = 176 * (width / 900);
        ph = 105 * (width / 900);
        fss = 14;
    }

    const sendTo = (uzr) => {
        const state = store.getState();
        store.dispatch(sendEvent(state.login.email, state.login.token, uzr, state.share.item['_id']));
        setModalText('Отправлено!');
        setShowAlert(1);
        //hideShare();
    }

    const blockIT = () =>{
        if (showAlert) return null;
        const state = store.getState();
        let eid = state.share.item['_id'];
        store.dispatch(block(state.login.email, state.login.token, eid));
        setModalText('Пользователь заблокирован!');
        setShowAlert(1);
    }

    const getSubed = () => {
        if (!mounted.current) return null;
        //getAvas();
        return (
            <SafeAreaView style={{height: hh, width: maxWidth-10, maxWidth: maxWidth}}>
                <ScrollView horizontal>
                    {isLoading ?
                        <SafeAreaView style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#ff0054" style={styles.loader}/>
                        </SafeAreaView>
                    :
                        <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            {avas.map((s,i)=>{
                                let ava = bigava;
                                if (s.ava !== 'bigava') {
                                    ava = s.ava;
                                }
                                return (
                                    <TouchableOpacity onPress={()=>{sendTo(s.uzr)}}
                                        style={{marginLeft: 10,
                                            maxWidth: w + 20,
                                            overflow: 'hidden',
                                            maxHeight: hh,
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignContent: 'center',
                                            alignItems: 'center'}} key={i}>
                                        <Image source={ava} style={{borderRadius: Math.ceil(w/2), width: w, height: w, resizeMode: 'cover'}}/>
                                        <Text style={{fontFamily: 'Tahoma', fontSize: fs, flexWrap: 'nowrap', maxWidth: w + 20, overflow: 'hidden'}}>{s.nick}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </SafeAreaView>
                    }
                </ScrollView>
            </SafeAreaView>
        )
    }

    const hideShare = () => {
        if (mounted.current) {
            store.dispatch(hideSharing());
        }
    }
    const onShare = async () => {
        try {
            const state = store.getState();
            state.share.item
            const result = await Share.share({
                message: 'TakeTeam событие!',
                url: 'https://taketeam.net/?post=' + state.share.item['_id'],
                title: 'TakeTeam'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const Shareee = async (to) => {
        const state = store.getState();
        let imageName;
        let pth = 'https://taketeam.net/posters/';
        if (state.share.item.pics[0] !== 'preview') {
            imageName = +state.share.item.pics[0]['uri'];
        } else {
            imageName = 'preview.png';
        }

        if (to === 'ig') {
            if (!Constants.platform.hasOwnProperty('web')) {
                //let { origURL } = image;
                //let encodedURL = encodeURIComponent(origURL);
                //let instagramURL = `instagram://library?AssetPath=${encodedURL}`;
                //Linking.openURL(instagramURL);

                const downloadPath = FileSystem.cacheDirectory + imageName;
                // 1 - download the file to a local cache directory
                //await FileSystem.getInfoAsync(fileUri);
                const {uri: localUrl} = await FileSystem.downloadAsync(pth + imageName, downloadPath);

                let encodedURL = encodeURIComponent(localUrl);
                let instagramURL = `instagram://library?AssetPath=${encodedURL}`;
                Linking.openURL(instagramURL);

                // 2 - share it from your local storage :)
                /*
                let fileInfo = await FileSystem.getInfoAsync(downloadPath);
                Sharing.shareAsync(localUrl, {
                    mimeType: 'image/jpeg',            // Android
                    dialogTitle: 'share-dialog title', // Android and Web
                    UTI: 'image/jpeg'                  // iOS
                });*/
            } else {
                //Linking.openURL('https://vk.com/share.php?url=http://taketeam.net');
            }
        } else if (to === 'lnk') {
            await onShare();
        } else {
            if (!Constants.platform.hasOwnProperty('web')) {

                //let { origURL } = image;
                //let encodedURL = encodeURIComponent(origURL);
                //let instagramURL = `instagram://library?AssetPath=${encodedURL}`;
                //Linking.openURL(instagramURL);

                const downloadPath = FileSystem.cacheDirectory + imageName;
                // 1 - download the file to a local cache directory
                //await FileSystem.getInfoAsync(fileUri);
                const {uri: localUrl} = await FileSystem.downloadAsync(pth + imageName, downloadPath);

                /*let encodedURL = encodeURIComponent(localUrl);
                let instagramURL = `instagram://library?AssetPath=${encodedURL}`;
                Linking.openURL(instagramURL);*/

                // 2 - share it from your local storage :)
                let typ = imageName.substring(imageName.length - 3);
                if (typ === 'png') {
                    typ = 'image/png';
                } else {
                    typ = 'image/jpeg';
                }
                Sharing.shareAsync(localUrl, {
                    mimeType: typ,            // Android
                    dialogTitle: 'share-dialog title', // Android and Web
                    UTI: typ                  // iOS
                });
            } else {
                if (to === 'vk') Linking.openURL('https://vk.com/share.php?url=https://taketeam.net');
            }
        }
    }

    const getLinks = () => {
        if (!mounted.current) return null;
        const state = store.getState();
        let wh = 1, vky = 1, igy = 1, lnk = 0;
        if (state.share.item) {
            if (state.share.item.hasOwnProperty('shar1')) {
                wh = state.share.item.shar1;
            }
            if (state.share.item.hasOwnProperty('shar2')) {
                igy = state.share.item.shar1;
            }
            if (state.share.item.hasOwnProperty('shar3')) {
                lnk = state.share.item.shar1;
            }
            if (state.share.item.hasOwnProperty('shar4')) {
                vky = state.share.item.shar1;
            }
        }
        return (
            <SafeAreaView style={{height: hh, width: maxWidth}}>
                <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                    {wh ?
                        <TouchableOpacity onPress={()=>{Shareee('wa')}} style={{display: 'none', marginLeft: 10, maxWidth: 120, overflow: 'hidden', maxHeight: hh, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            <Image source={whatsup} style={{borderRadius: Math.ceil(w/2), width: w, height: w, resizeMode: 'cover'}}/>
                            <Text style={{fontFamily: 'Tahoma', fontSize: fs}}>What'app</Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                    {vky ?
                        <TouchableOpacity onPress={()=>{Shareee('vk')}} style={{display: 'none', marginLeft: 10, maxWidth: 120, overflow: 'hidden', maxHeight: hh, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            <Image source={vk} style={{borderRadius: Math.ceil(w/2), width: w, height: w, resizeMode: 'cover'}}/>
                            <Text style={{fontFamily: 'Tahoma', fontSize: fs}}>Вконтакте</Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                    {igy ?
                        <TouchableOpacity onPress={()=>{Shareee('ig')}}
                                          style={{display: 'none', marginLeft: 10, maxWidth: 120, overflow: 'hidden', maxHeight: hh,
                                              flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            <Image source={ig} style={{borderRadius: Math.ceil(w/2), width: w, height: w, resizeMode: 'cover'}}/>
                            <Text style={{fontFamily: 'Tahoma', fontSize: fs}}>Instagramm</Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                    {lnk ?
                        <TouchableOpacity onPress={()=>{Shareee('lnk')}} style={{marginLeft: 10, maxWidth: 120, overflow: 'hidden', maxHeight: hh, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            <Image source={linka} style={{borderRadius: Math.ceil(w/2), width: w, height: w, resizeMode: 'cover'}}/>
                            <Text style={{fontFamily: 'Tahoma', fontSize: fs}}>Ссылка</Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                </SafeAreaView>
            </SafeAreaView>
        )
    }

    useEffect(()=> {
        mounted.current = 1;
        const state = store.getState();
        if (!state.chat.status) {
            store.dispatch(getChatAvas(state.login.email, state.login.token));
        }
        store.subscribe(() => {
            if (mounted.current) {
                const state = store.getState();
                if (state.share.view !== modalVisible) {
                    if (state.share.view) {
                        setmodalDisplay('flex');
                        setmodalVisible(true);
                    } else {
                        setmodalDisplay('none');
                        setmodalVisible(false);
                    }
                }
                if (chatState !== state.chat.status) {
                    setChatState(state.chat.status);
                    setAvas(state.chat.chaters);
                    setMrnd(Math.random());
                }
            }
        });
        return function cleanup() {
            mounted.current = 0;
            store.subscribe(()=>{});
        }
    });

    let mt33 = '5%', ml33 = '25.6%';
    let difW = 0;
    if (width <= 900) {
        mt33 = '20%';
        ml33 = 0;
    } else {
        ml33 = (width - 934) / 2;
        if (ml33 < 0) ml33 = 0;
    }

    return (
        <SafeAreaView style={[styles.centeredView, {
            display: modalDisplay,
            position: 'absolute',
            zIndex: 99999,
            width: '100%',
            opacity: 1,
            justifyContent: 'center'
        }]}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                style={{
                    borderWidth: 0,
                    marginLeft: ML,
                    maxWidth: maxWidth,
                    justifyContent: 'center',
                    minHeight: commentHeight,
                    marginTop: 100
                }}
            >
                <SafeAreaView style={{display: 'none'}}><Text style={{width: 0, height: 0, fontSize: 0}}>{rnd}</Text></SafeAreaView>
                {showAlert ?
                    <SafeAreaView style={{width: width, height: height, position: 'absolute', left: 0, top: 0, zIndex: 100}}>
                        <SafeAreaView style={{backgroundColor: 'white', minWidth: width, minHeight: height, position: 'absolute', left: 0, top: 0, zIndex: 101, opacity: 0.6}}>
                        </SafeAreaView>
                        <SafeAreaView style={[styles.modalView, {justifyContent:'center', alignItems: 'center',
                            alignContent:'center', zIndex: 101, opacity: 1, marginTop: mt33, marginLeft: ml33, padding: 20, width: maxWidth}]}>
                            <Text style={[styles.modalText, {fontFamily: 'Tahoma'}]}>{modalText}</Text>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose, {backgroundColor:'#ff0073', width: 100}]}
                                onPress={() => {setShowAlert(0)}}
                            >
                                <Text style={[styles.textStyle, {fontFamily: 'ProximaNova', color: 'white'}]}>Хорошо</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </SafeAreaView>
                :
                    null
                }
                <SafeAreaView style={[styles.centeredView, {

                    width: maxWidth,
                    minHeight: commentHeight,
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                    alignItems: 'flex-start',
                    borderStyle: 'solid', borderWidth: 0, borderColor: 'red'
                }]}>
                    <SafeAreaView style={[styles.modalView, {backgroundColor: '#f7f7f7', width: maxWidth, minHeight: commentHeight, borderStyle: 'solid', borderWidth: 0, borderColor: 'blue', padding: 5, margin: 5}]}>
                        <SafeAreaView style={{
                            backgroundColor: '#f7f7f7',
                            width: '100%',
                            height: '100%',
                            flexDirection: 'column',
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignContent: 'center',
                            alignItems: 'center',
                            borderStyle: 'solid', borderWidth: 0, borderColor: 'green'
                        }}>
                            <Text style={{
                                marginTop: 10,
                                marginBottom: 10,
                                height: 20,
                                textTransform: 'uppercase',
                                fontFamily: 'ProximaNova',
                                fontSize: 18
                            }}>Отправить</Text>
                            {getSubed()}
                            <Text style={{display: 'none', fontSize: 0, width: 0, height: 0}}>{Mrnd}</Text>
                            <Text style={{
                                marginTop: 10,
                                marginBottom: 10,
                                height: 20,
                                textTransform: 'uppercase',
                                fontFamily: 'ProximaNova',
                                fontSize: 18
                            }}>Поделиться</Text>
                            {getLinks()}
                            <SafeAreaView style={{
                                marginTop: 10,
                                height: 2,
                                backgroundColor: '#ff0073',
                                width: '100%'
                            }}></SafeAreaView>
                            <SafeAreaView style={{
                                marginTop: 20,
                                marginBottom: 10,
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                alignContent: 'center'
                            }}>
                                <TouchableOpacity onPress={()=>{reportIT()}}>
                                    <Text style={{
                                        padding: 10,
                                        backgroundColor: '#e7e7e7',
                                        borderRadius: 10,
                                        textTransform: 'uppercase',
                                        fontFamily: 'ProximaNova',
                                        fontSize: fss,
                                        color: 'black'
                                    }}>Пожаловаться</Text>
                                </TouchableOpacity>
                                <Image source={sadface} style={{width: pw, height: ph, resizeMode: 'stretch'}}/>
                                <TouchableOpacity onPress={()=>{blockIT()}}>
                                    <Text style={{
                                        padding: 10,
                                        backgroundColor: '#e7e7e7',
                                        borderRadius: 10,
                                        textTransform: 'uppercase',
                                        fontFamily: 'ProximaNova',
                                        fontSize: fss,
                                        color: 'black'
                                    }}>Заблокировать</Text>
                                </TouchableOpacity>
                            </SafeAreaView>
                            <SafeAreaView style={{
                                marginTop: 10,
                                height: 2,
                                backgroundColor: '#ff0073',
                                width: '100%'
                            }}></SafeAreaView>
                            <SafeAreaView style={{marginTop: MT31}}>
                                <TouchableOpacity onPress={() => {
                                    hideShare();
                                }}>
                                    <Text style={{
                                        padding: 10,
                                        backgroundColor: '#ff0073',
                                        borderRadius: 10,
                                        textTransform: 'uppercase',
                                        fontFamily: 'ProximaNova',
                                        fontSize: 24,
                                        color: 'white'
                                    }}>Отмена</Text>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </SafeAreaView>
                    </SafeAreaView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}


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
        padding: 3,
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
        marginTop: 10
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