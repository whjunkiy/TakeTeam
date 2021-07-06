import React from "react";
import store from '../redux/store';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import {searchEvents} from "../redux/actions";
import {
    View,
    ScrollView,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
const { width, height } = Dimensions.get('screen');
import Bottom from "../components/Bottom";
import preview from '../assets/preview.png';
import {Image} from "react-native";
import larrwo from '../assets/l_arrow.png';

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.nCstate = store.getState();
        this.maxWidth = width;
        this.navi = this.props.navigation;
        this.pl = 35;
        //this.textInput = null;
        if (width > 900) {
            this.maxWidth = 900;
        }
        if (width < 600) {
            this.pl = 10
        }
        let tags = [];
        this.tag = this.navi.getParam('tag');
        if (this.tag) {
            tags.push(this.tag);
        }
        this.monthNames = [ "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" ];
        this.state={inp: '', tags: tags, posts: [], isLoading: false, searchStatus: this.nCstate.searchEvents.status};
        this.search = this.search.bind(this);
        this.find = this.find.bind(this);
        this.removeTag = this.removeTag.bind(this);
        if (tags.length) {
            setTimeout(()=>{this.find()}, 500);
        }
    }

    find() {
        const state = store.getState();
        if (this._isMounted) {
            if (this.state.tags.length) {
                let email = '';
                if (state.login.hasOwnProperty('email')) email = state.login.email;
                store.dispatch(searchEvents(this.state.tags, email));
            } else {
                this.setState({posts: []});
            }
        }
    }

    removeTag(tag){
        if (this._isMounted) {
            let tags = this.state.tags;
            let nt = [];
            for (let i in tags) {
                if (tags[i] !== tag) {
                    nt.push(tags[i]);
                }
            }
            if (nt.length) {
                this.setState({tags: nt});
                setTimeout(()=>{this.find();}, 100);
            } else {
                this.setState({tags: nt, posts: []});
            }
        }
    }

    search() {
        if (this._isMounted) {
            if (!this.state.inp) {
                return null;
            }
            let tags = this.state.tags;

            let newtags = this.state.inp.split(" ");
            for (let i in newtags) {
                if (tags.indexOf(newtags[i]) === -1) {
                    tags.push(newtags[i]);
                }
            }
            //tags.push(this.state.inp);
            this.textInput['_root'].value = '';
            this.setState({tags: tags, inp: ''});
            this.find();
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const state = store.getState();
        if (state.onstart.status === 1) {
            store.dispatch({type: "NOTDOIT"});
            setTimeout(()=>{
                this.navi.navigate('MainList', { title: 'События' });
            }, 100);
        }
        store.subscribe(() => {
            const state = store.getState();
            if (this._isMounted) {
                if (state.page.disabled !== this.state.isLoading) {
                    this.setState({isLoading: state.page.disabled})
                }
                if (state.searchEvents.status !== this.state.searchStatus) {
                    this.setState({searchStatus: state.searchEvents.status, posts: state.searchEvents.events})
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
        } else {
            let fss2 = 20, pl = 18;
            if (width < 900) {
                fss2 = 14;
                pl = 2;
            }
            return (
                <Container style={{fontFamily: 'Tahoma'}}>
                    <Header searchBar noShadow rounded style={{backgroundColor: 'none'}}>
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
                                onSubmitEditing={() => {
                                    this.search()
                                }}
                                style={{fontFamily: 'Tahoma'}}
                                ref={input => {
                                    this.textInput = input
                                }}
                                onChange={e => this.setState({inp: e.nativeEvent.text})}
                            />
                        </Item>
                    </Header>
                    <SafeAreaView style={{flex: 1, display: 'flex', alignItems: 'flex-start', alignContent: 'flex-start', justifyContent: 'flex-start', flexDirection: 'column', flexWrap: 'nowrap'}}>
                        <SafeAreaView style={[styles.tags, {alignSelf: 'flex-start', maxHeight: 30}]}>
                            <SafeAreaView style={{width: this.maxWidth, paddingLeft: pl}}>
                                <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: "row"}}>
                                    {this.state.tags.map((t, i) => {
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => {
                                                    this.removeTag(t)
                                                }}
                                                style={{
                                                    marginLeft: 10,
                                                    borderWidth: 1,
                                                    borderStyle: 'solid',
                                                    borderColor: '#bbbbbb',
                                                    backgroundColor: '#f1f1f1',
                                                    borderRadius: 5,
                                                    padding: 2,
                                                    marginTop: 2,
                                                    marginBottom: 2
                                                }}>
                                                <Text style={{
                                                    textTransform: 'lowercase',
                                                    fontSize: fss2,
                                                    fontFamily: 'ProximaNova',
                                                    backgroundColor: '#f1f1f1',
                                                    fontWeight: 'bold',
                                                    color: '#949292'
                                                }}>{t}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </SafeAreaView>
                            </SafeAreaView>
                        </SafeAreaView>
                        <SafeAreaView style={{maxHeight: '80%', alignSelf: 'flex-start'}}>
                            <ScrollView>
                                <SafeAreaView style={styles.tags}>
                                    <SafeAreaView style={{width: this.maxWidth, paddingLeft: this.pl}}>
                                        <SafeAreaView style={{width: this.maxWidth, flex: 1, display: 'flex', flexDirection: "column", alignContent: "flex-start", alignItems: "flex-start"}}>
                                        {this.state.posts.map((p, i) => {
                                            let pica = preview;
                                            if (p.hasOwnProperty('pics')) {
                                                if (p.pics[0] !== 'preview') {
                                                    pica = {uri: 'https://taketeam.net/posters/' + p.pics[0].uri}
                                                }
                                            }
                                            let date_d = '00';
                                            let date_m = 'месяца';
                                            let time = '25:61';
                                            let title = 'Заголовок';
                                            let rega = 'не требуется';
                                            if (p.hasOwnProperty('time')) {
                                                if (p.time) {
                                                    time = p.time;
                                                }
                                            }
                                            if (p.hasOwnProperty('title')) {
                                                if (p.title) {
                                                    title = p.title;
                                                }
                                            }
                                            if (p.hasOwnProperty('rega')) {
                                                if (p.rega) {
                                                    rega = 'требуется';
                                                }
                                            }
                                            if (p.hasOwnProperty('date')) {
                                                if (p.date) {
                                                    let ttt = p.date.split(" ");
                                                    if (ttt.length > 1) {
                                                        for (let j in ttt) {
                                                            if (ttt[j].length === 2) {
                                                                date_d = ttt[j];
                                                            }
                                                            if (!ttt[j].match(/\d/i)) {
                                                                date_m = ttt[j];
                                                            }
                                                        }
                                                    } else {
                                                        let ttt2 = p.date.split(".");
                                                        if (ttt2.length > 1) {
                                                            date_d = ttt2[0];
                                                            date_m = ttt2[1];
                                                            if (date_m === "01") date_m = this.monthNames[0];
                                                            if (date_m === "02") date_m = this.monthNames[1];
                                                            if (date_m === "03") date_m = this.monthNames[2];
                                                            if (date_m === "04") date_m = this.monthNames[3];
                                                            if (date_m === "05") date_m = this.monthNames[4];
                                                            if (date_m === "06") date_m = this.monthNames[5];
                                                            if (date_m === "07") date_m = this.monthNames[6];
                                                            if (date_m === "08") date_m = this.monthNames[7];
                                                            if (date_m === "09") date_m = this.monthNames[8];
                                                            if (date_m === "10") date_m = this.monthNames[9];
                                                            if (date_m === "11") date_m = this.monthNames[10];
                                                            if (date_m === "12") date_m = this.monthNames[11];
                                                        }
                                                    }
                                                }
                                            }
                                            let pw = 140, lw = 24, lh=24;
                                            let ph = 175, mw = '14%';
                                            let dl = 1.7;
                                            let mt = 20, mt2 = 16, mt3= 5;
                                            let fs = 78;
                                            let fs2 = 22, fs3 = 34, fs4 = fs2, t = -15;
                                            let ml5 = 0, l = 150;
                                            if (width < 900) {
                                                pw = Math.ceil(pw / dl);
                                                ph = Math.ceil(ph / dl);
                                                mt = 8;
                                                fs = 36;
                                                fs2 = 12;
                                                fs3 = 16;
                                                fs4 = 8;
                                                t = -1;
                                                mw = '17%'
                                                mt2 = 10; mt3 = 0; ml5 = 20;
                                                lw = 14; lh = 14; l = 90;
                                            }
                                            let TW = 1000;
                                            if (width < 900) {
                                                TW = 200;
                                            }
                                            return (
                                                <TouchableOpacity key={i}
                                                                  style={{marginTop: mt, width: this.maxWidth}}
                                                                  onPress={()=>{this.navi.navigate('singlePost', {title: title, pid: p['_id']})
                                                                  }}>
                                                    <SafeAreaView style={{width: '100%', flex: 1, display: 'flex', flexDirection: "row", justifyContent: 'flex-start', alignContent: "flex-start", alignItems: "flex-start"}}>
                                                        <Image source={pica} style={{width: pw, height: ph, resizeMode: 'cover', borderRadius: 20}} />
                                                        <SafeAreaView style={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            flexDirection: "column",
                                                            marginLeft: 10,
                                                            justifyContent: 'center',
                                                            alignContent: "center",
                                                            alignItems: "flex-start",
                                                            maxWidth: mw,
                                                            minWidth: mw
                                                        }}>
                                                            <Text style={{marginLeft: 0, color: '#737373', fontWeight: 'bold', fontSize: fs, fontFamily: 'Tahoma'}}>{date_d}</Text>
                                                            <Text style={{color: '#737373', fontWeight: 'bold', fontSize: fs2, fontFamily: 'Tahoma'}}>{date_m}</Text>
                                                            <Text style={{fontFamily: 'Tahoma', flexWrap: 'nowrap', color: '#ff0073', fontWeight: 'bold', fontSize: fs4+2, position: 'relative', top: t}}>_ _ _ _ _ _</Text>
                                                            <Text style={{fontFamily: 'Tahoma', color: '#737373', fontWeight: 'bold', fontSize: fs3, position: 'relative', top: t}}>{time}</Text>
                                                        </SafeAreaView>
                                                        <SafeAreaView style={{flexDirection: "column", marginLeft: mt3, marginTop: 8, justifyContent: 'center'}}>
                                                            <SafeAreaView style={{flexDirection: 'row', position: 'relative', left: -lw}}>
                                                                <Image source={larrwo} style={{width: lw, height: lh, marginTop: 2, marginLeft: 2, resizeMode: 'cover'}}/>
                                                                <Text style={{fontFamily: 'ProximaNova', color: 'black', fontSize: fs3, fontWeight: 'bold'}}>{title}</Text>
                                                            </SafeAreaView>
                                                            <Text style={{fontFamily: 'ProximaNova', color: '#cfcbcb', textTransform: 'uppercase',
                                                                fontWeight: 'bold', fontSize: fs2-2}}>Регистрация: <Text style={{fontFamily: 'ProximaNova',
                                                                color: 'white', backgroundColor: '#ff0073', fontWeight: 'bold', fontSize: fs2-1}}>{rega}</Text></Text>
                                                            <SafeAreaView style={{maxWidth: TW, width: TW, minWidth: TW}}>
                                                            <Text style={{color: 'black', fontSize: fs2, fontFamily: 'Tahoma', }}>{p.opis}</Text>
                                                            </SafeAreaView>
                                                        </SafeAreaView>
                                                    </SafeAreaView>
                                                    <SafeAreaView style={{width: '80%', backgroundColor: '#e5fffa', height: 2, position: 'relative', top: -2, left: l}}>
                                                    </SafeAreaView>
                                                </TouchableOpacity>
                                            )
                                        })}
                                        </SafeAreaView>
                                    </SafeAreaView>
                                </SafeAreaView>
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
    tags: {
        alignContent: "flex-start",
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: 'nowrap',
        flexDirection: "row"
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
    }
});