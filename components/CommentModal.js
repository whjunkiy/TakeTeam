import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {List, ListItem, Text, Container, Input} from 'native-base';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl, Modal, TextInput
} from 'react-native';
import store from '../redux/store';
const { width, height } = Dimensions.get('screen');
import krst from '../assets/x.png';
import ava from '../assets/defava.png';
import gh from '../assets/gh.png';
import ph from '../assets/ph.png';
import {Image} from "react-native";
import {addComment, hideComments, likeComment, unlikeComment} from "../redux/actions";
import upa from "../assets/upa.png";
import {Platform} from "react-native-web";

export default function CommentModal({navigate}) {
    let nCstate = store.getState();
    let maxWidth = width;
    let hz = 50;
    if (width > 900) {
        maxWidth = 900;
        hz = 250;
    }
    const commentHeight = height-200;

    let smsref = null;
    let inpContRef = useRef();
    const [modalVisible, setmodalVisible] = useState(false);
    const [rnd, setRnd] = useState(0);
    const [modalDisplay, setmodalDisplay] = useState('none');
    const [likes, setLikes] = useState({});
    const [coms, setComs] = useState([]);
    const [commentTxt, setcommentTxt] = useState('');
    const [ecid, setecid] = useState(null);
    const [logined, setLoaded] = useState(nCstate.login.status);
    let mounted = useRef(0);
    let viewref = useRef();

    const addCom = () => {
        const state = store.getState();
        if (state.login.status > 0) {
            if (mounted.current) {
                store.dispatch(addComment(state.login.email, state.login.token, ecid, commentTxt));
                let comas = coms;
                const ct = parseInt(Date.now() / 1000);
                comas.push({ct: ct, uzr: state.login.info, txt: commentTxt});
                setcommentTxt('');
                setComs(comas);
                let lks = {};
                for (let i in comas) {
                    lks[i] = 0
                    if (comas[i].hasOwnProperty('likes')) {
                        lks[i] = comas[i].likes.length;
                    }
                }
                setLikes(lks);
                setTimeout(()=>{
                    viewref.current.scrollTo({ x: 0, y: 1000000, animated: true })
                }, 200);
            }
        }
    }

    const like = (i, liked) => {
        const state = store.getState();
        if (state.login.status > 0) {
            let lks = likes;
            let cc = coms;
            if (!liked) {
                store.dispatch(likeComment(state.login.email, state.login.token, ecid, i));
                lks[i] = lks[i] + 1;
                if (!cc[i].hasOwnProperty('likes')) cc[i].likes = [];
                cc[i].likes.push(state.login.email);
            } else {
                store.dispatch(unlikeComment(state.login.email, state.login.token, ecid, i));
                lks[i] = lks[i] - 1;
                let nc = [];
                for (let j in cc[i].likes) {
                    if (cc[i].likes[j] !== state.login.email) {
                        nc.push(nc[i].likes[j]);
                    }
                }
                cc[i].likes = nc;
            }
            setLikes(lks);
            setComs(cc);
            setRnd(Math.random());
        } else {
            navigate('authing', {title: "Авторизация"});
        }
    }

    const hideComs = () => {
        if (mounted.current) {
            store.dispatch(hideComments());
        }
    }

    useEffect(()=> {
        mounted.current = 1;
        store.subscribe(() => {
            if (mounted.current) {
                const state = store.getState();
                if (state.coms.view !== modalVisible) {
                    if (state.coms.view) {
                        let coms = [];
                        if (!state.coms.item) return;

                        if (state.coms.item.hasOwnProperty('comments')) {
                            coms = state.coms.item.comments;
                        }
                        let lks = {};
                        for (let i in coms) {
                            lks[i] = 0
                            if (coms[i].hasOwnProperty('likes')) {
                                lks[i] = coms[i].likes.length;
                            }
                        }
                        setLikes(lks);
                        setComs(coms);
                        setecid(state.coms.item['_id']);
                        setmodalDisplay('flex');
                        setmodalVisible(true);
                        setTimeout(()=>{
                            viewref.current.scrollTo({ x: 0, y: 1000000, animated: true })
                        }, 300);
                    } else {
                        setmodalDisplay('none');
                        setmodalVisible(false);
                    }
                }
            }
        });
        return function cleanup() {
            mounted.current = 0;
            store.subscribe(()=>{});
        };
    });

    let lft = (Math.ceil(maxWidth/3)) - 15;
    let coef = width / 900;
    let ML = -14, MaTop = 100, krstS = 34, aaa = 50, FS = 24, avaS = 75, fs2 = 28, fs3 = 16;
    let widthL = 36, heightL = 33, fs4 = 26;
    let minComH = commentHeight - hz;
    let uw = 82, uh = 81;
    if (maxWidth < 900) {
        lft = lft - 25;
        ML = -1;
        fs4 = 16;
        fs2 = Math.ceil(fs2 * coef);
        krstS = Math.ceil(krstS * width / 900);
        MaTop = 50;
        aaa = Math.ceil(aaa * coef);
        FS = Math.ceil(FS * coef);
        avaS = Math.ceil(avaS * coef);
        fs3 = 15;
        widthL = Math.ceil(widthL * coef);
        heightL = Math.ceil(heightL * coef);
        uw = Math.ceil(uw * coef);
        uh = Math.ceil(uh * coef);
    }

    /*if (minComH < 500) {
        minComH = 500;
    }*/
    let minus = -300;
    if (Platform.OS === 'ios') minus = -150;
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
                style={{borderWidth: 0, marginLeft: ML, maxWidth: maxWidth, justifyContent: 'center', minHeight: commentHeight, marginTop: MaTop}}
            >
                <SafeAreaView style={{display: 'none', width: 0, height: 0}}><Text style={{fontSize: 0}}>{rnd}</Text></SafeAreaView>
                <SafeAreaView ref={inpContRef} style={{flex: 1, display: 'flex', flexDirection: "row", flexWrap: 'nowrap',
                    height: '100%', borderWidth: 0, width: maxWidth, minHeight: commentHeight, justifyContent: 'center', alignContent: 'flex-start', alignItems: 'flex-start'}}>
                    <SafeAreaView style={[styles.modalView, {width: maxWidth - 10, minHeight: commentHeight}]}>
                        <SafeAreaView style={{flex: 1, display: 'flex',
                            flexWrap: 'nowrap',height: krstS+2, maxHeight: krstS+2, minHeight: krstS+2, justifyContent: 'center',
                            flexDirection: 'row', alignContent: 'flex-start', alignItems: 'flex-start', marginTop: 1
                        }}>
                            <Text style={{fontSize: FS, color: '#8c8c8c', textTransform: 'uppercase', fontWeight: 'bold', fontFamily: 'ProximaNova'}}>комментариев: {coms.length} </Text>
                            <TouchableOpacity onPress={()=>{
                                hideComs();
                            }} style={{position: 'relative', left: lft, top: 0, width: krstS, height: krstS}}>
                                <Image source={krst} style={{width: krstS, height: krstS}}/>
                            </TouchableOpacity>
                        </SafeAreaView>
                        <SafeAreaView style={{height: minComH-60, marginTop: 15}} >
                        <ScrollView ref={viewref}>
                            <SafeAreaView style={{
                                flexDirection: 'column',
                                alignContent: 'flex-start',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                paddingLeft: 10,
                                width: '100%',
                                height: minComH
                            }}>
                                {coms.map((c,i)=>{
                                    let avka = ava;
                                    if (c.uzr.hasOwnProperty('ava')) {
                                        avka = {uri: 'https://taketeam.net/avas/' + c.uzr.ava};
                                    }
                                    let mt = 0;
                                    if (i) mt = 10;
                                    let heart = gh;
                                    let liked = 0;
                                    if (c.hasOwnProperty('likes')) {
                                        if (c.likes.indexOf(nCstate.login.email) !== -1) {
                                            heart = ph;
                                            liked = 1;
                                        }
                                    }

                                    return (
                                        <SafeAreaView key={i} style={{flexDirection: 'row', justifyContent: 'flex-start', width: '100%', marginTop: mt, alignItems: 'center', alignContent: 'center'}}>
                                            <Image source={avka} style={{width: avaS, height: avaS, resizeMode: 'cover', borderRadius: Math.ceil(avaS / 2)}} />
                                            <SafeAreaView style={{marginLeft: 10, alignItems: 'center', alignContent: 'center'}}>
                                                <Text style={{fontWeight: 'bold', fontSize: fs2, fontFamily: 'ProximaNova'}}>{c.uzr.nick}</Text>
                                                <Text style={{fontFamily: 'Tahoma', fontSize: fs3}}>{c.txt}</Text>
                                            </SafeAreaView>
                                            <TouchableOpacity onPress={()=>{like(i, liked)}}
                                                              style={{position: 'absolute', right: 30, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                                                    <Image source={heart} style={{width: widthL, height: heightL, resizeMode: 'cover'}} />
                                                    <Text style={{fontFamily: 'ProximaNova', fontSize: fs3}}>{likes[i]}</Text>
                                            </TouchableOpacity>
                                        </SafeAreaView>
                                    )
                                })}
                            </SafeAreaView>
                        </ScrollView>
                        </SafeAreaView>
                        <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'row', height: uh+10,
                            alignItems: 'center', alignContent: 'center', marginBottom: 10, marginTop: 10, maxHeight: uh+10,
                            justifyContent: 'flex-start'}}>
                            <TextInput
                                multiline={false}
                                numberOfLines={2}
                                ref={ref=>{smsref = ref}}
                                placeholder="Добавить комментарий"
                                placeholderTextColor="#cecece"
                                placeholderFontFamily="Tahoma"
                                onPressIn={()=>{
                                    //console.log("onPressIn KB");
                                }}
                                onBlur={()=>{
                                    //console.log("BLUR KB");
                                    inpContRef.current.setNativeProps({marginTop: 15});
                                }}
                                onFocus={()=>{
                                    //console.log("onFocus KB");
                                    //console.log(inpContRef);
                                    inpContRef.current.setNativeProps({marginTop: minus});
                                }}
                                onEndEditing={()=>{
                                    //console.log("onEndEditing KB");
                                    inpContRef.current.setNativeProps({marginTop: 15});
                                }}
                                onPressOut={()=>{
                                    //console.log("onPressOut KB");
                                }}
                                onSubmitEditing={() => {
                                    addCom()
                                }}
                                style={{borderWidth: 1, borderStyle: 'solid', borderColor: '#939393', padding: 5,
                                    width: '80%', height: uh, borderRadius:10, fontFamily: 'Tahoma',
                                    marginLeft: 20, color: '#939393', fontSize: fs4, backgroundColor: '#f9f9f9'}}
                                onChangeText={(commentTxt) => {
                                    setcommentTxt(commentTxt);
                                }}
                                value={commentTxt}/>
                            <TouchableOpacity onPress={() => addCom() } style={{marginLeft: 10}}>
                                <Image source={upa} style={{width: uw, height: uh}}/>
                            </TouchableOpacity>
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