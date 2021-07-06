import {
    LOGIN, LOGOUT, AUTH_FAIL, AUTHED, GOTDATA, NODATA, VIEW, NEWAVA,
    DISABLE_PAGE, ENABLE_PAGE, GOTEVENTS, NOEVENTS, CREATEPOST, CANCELPOST,
    POSTLASTSTEP, POSTFINISH, POSTFAIL, UPDATEEVENTS, USERINFO, SEARCH, GOTSMS,
    SENDSMS, VIEWCOMS, POSTINFO
} from "./types"
import {combineReducers} from 'redux'

function viewReducer(state={view: 'rekom'}, action) {
    if (action.type === VIEW) {
        return {...state, view: action.view}
    }
    return state;
}

function loginReducer(state = {status: -2, email: '', token: '', expires_in: 0, info: {}}, action) {
    if (action.type === LOGIN) {
        return {...state, status: 1, email: action.email, token: action.token,  expires_in: action.expires_in, info: action.info}
    } else if (action.type === LOGOUT) {
        return {...state, status: -1, email: '', token: '', expires_in: 0, info: {}}
    } else if (action.type === AUTH_FAIL) {
        return {...state, status: 0, email: action.email, token: '', expires_in: 0, info: {}}
    } else if (action.type === AUTHED) {
        return {...state, status: 2, email: action.email, token: action.token,  expires_in: action.expires_in, info: action.info}
    } else if (action.type === 'UPDATE_INFO') {
        return {...state, info: action.uzr}
    } else if (action.type === "LOGINUPDATE") {
        return {...state, info: action.info}
    }
    return state
}

function profileReducer(state = {mail: '', whom: -1, status: 0}, action){
    if (action.type === "SETPROFILE") {
        return {...state, mail: action.mail, whom: action.whom}
    }
    return state;
}

function urlReducer(state = {status: 0, page: '', pid: ''}, action){
    if (action.type === 'PAGE') {
        return {...state, status: 1, page: action.page, pid: action.pid}
    } else if (action.type === 'UNPAGE') {
        return {...state, status: 0, page: '', pid: ''}
    }
    return state;
}

function avaReducer(state = {rnd: 0}, action) {
    if (action.type === NEWAVA) {
        return {...state, rnd: Math.random()}
    }
    return state
}

function searchEventsReducer(state={status: 0, events:[]}, action) {
    if (action.type === SEARCH) {
        let payload = action.events;
        return {...state, status: action.status, events: payload}
    }
    return state
}

function smsReducer(state={sms: [], status: 0}, action) {
    if (action.type === GOTSMS) {
        let payload = action.sms;
        return {...state, status: action.status, sms: payload}
    } else if (action.type === SENDSMS) {
        let payload = action.sms;
        return {...state, status: action.status, sms: payload}
    }
    return state
}

function citiesReducer(state= {cities: [], status: 0}, action){
    if (action.type === 'GOTCITIES') {
        return {...state, cities: action.cities, status: 1}
    }
    return state
}

function dataReducer(state= {posts:[], status: 0, rnd: 0}, action) {
    if (action.type === GOTDATA) {
        let payload = action.payload;
        let status = 1;
        if (action.hasOwnProperty('status')) {
            status = action.status;
        } else {
            status = Math.random();
        }
        return {...state, status: status, rnd: status, posts: payload}
    } else if (action.type === NODATA) {
        return {...state, status: -1, posts: []}
    }
    return state
}

function pageReducer(state = {disabled: false}, action) {
    if (action.type === ENABLE_PAGE) {
        return {...state, disabled: false}
    } else if (action.type === DISABLE_PAGE) {
        return {...state, disabled: true}
    }
    return state
}

function uzerInfoReducer(state={status: 0, info:{}}, action){
    if (action.type === USERINFO) {
        return {...state, status: action.status, info: action.info}
    }
    return state
}

function myEventsReducers(state={events:{igo: [], imade:[]}, status: 0}, action) {
    if (action.type === GOTEVENTS) {
        let payload = action.payload;
        return {...state, status: 1, events: payload}
    } else if (action.type === NOEVENTS) {
        return {...state, status: 0, events:{igo: [], imade:[]}}
    } else if (action.type === UPDATEEVENTS) {
        return {...state, status: 2, events: action.payload}
    }
    return state
}

function newPostReducer(state={needfoto: null, stepStatus: 0, step: 0, pics: [], nadpisi: [], text: '', rsn: '', txtclr: [], bckclr: [], nFS: [], chrds: [], rotas: []}, action) {
    if (action.type === CREATEPOST) {
        let stepStatus = 0;
        if (action.hasOwnProperty(stepStatus)) {
            stepStatus = action.stepStatus;
        }
        return {...state, needfoto: action.needfoto, step: 1, pics: action.pics, stepStatus: stepStatus}
    } else if (action.type === CANCELPOST) {
        return {...state, needfoto: null, step: 0, pics: []};
    } else if (action.type === POSTLASTSTEP) {
        return {...state, nadpisi: action.nadpisi, step: 2, txtclr: action.txtclr, bckclr: action.bckclr, nFS: action.nFs, chrds: action.chrds, rotas: []};
    } else if (action.type === POSTFINISH) {
        return {...state, text: action.text, wcs: action.wcs, wcc: action.wcc, step: 3};
    } else if (action.type === POSTFAIL) {
        return {...state, rsn: action.rsn, step: -1};
    }
    return state
}

function comsReducer(state={view: 0, item: null, info: null}, action) {
    if (action.type === VIEWCOMS) {
        return {...state, item: action.item, view: action.view}
    } else if (action.type === "UPDATECOMMENT") {
        return {...state, item: action.item}
    }
    return state;
}

function shareReducer(state={view: 0, item: null}, action) {
    if (action.type === "VIEWSHARING") {
        return {...state, item: action.item, view: action.view}
    }
    return state;
}

function singlePostReducer(state={status: 0, event:{}}, action){
    if (action.type === POSTINFO) {
        return {...state, event: action.event, status: action.status}
    }
    return state;
}

function subreqReducer(state={reqs: [], rnd: 0}, action){
    if (action.type === "GOTSUBREQS") {
        return {...state, reqs: action.reqs, rnd: Math.random()};
    }
    return state;
}

function chatReducer(state={status: 0, chaters: []}, action){
    if (action.type === 'GOTCHATERS') {
        return {...state, status: action.status, chaters: action.info}
    }
    return state;
}

function onStartReducer(state= {status: 1}, action) {
    if (action.type === "DOIT") {
        return {...state, status: 1}
    } else if (action.type === "NOTDOIT") {
        return {...state, status: 0}
    }
    return state;
}

function joinersReducer(state={status: 0, joiners: [], requests: []}, action) {
    if (action.type === "GOTJOINERS") {
        return {...state, status: Math.random(), joiners: action.info.joiners, requests: action.info.requests}
    }
    return state;
}

function blaReducer(state={rnd: 0}, action){
    if (action.type === "REFRESHEVENTS") {
        return {...state, rnd: Math.random()}
    }
    return state
}

export const rootReducer = combineReducers({
    login: loginReducer,
    data: dataReducer,
    view: viewReducer,
    ava: avaReducer,
    url: urlReducer,
    cities: citiesReducer,
    page: pageReducer,
    myevents: myEventsReducers,
    newpost: newPostReducer,
    uzerInfo: uzerInfoReducer,
    searchEvents: searchEventsReducer,
    sms: smsReducer,
    coms: comsReducer,
    share: shareReducer,
    singlePost: singlePostReducer,
    profile: profileReducer,
    subs: subreqReducer,
    joiners: joinersReducer,
    bla: blaReducer,
    chat: chatReducer,
    onstart: onStartReducer
})