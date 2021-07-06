import {
    LOGIN, AUTHED, LOGOUT, AUTH_FAIL, GOTDATA, NODATA, VIEW, NEWAVA, ENABLE_PAGE, DISABLE_PAGE,
    GOTEVENTS, NOEVENTS, CREATEPOST, CANCELPOST, POSTLASTSTEP, POSTFINISH, POSTFAIL, UPDATEEVENTS,
    USERINFO, SEARCH, GOTSMS, SENDSMS, VIEWCOMS, POSTINFO
} from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Platform} from "react-native";

let nCpreventeR = {
    loginR: 0,
    authedR: 0,
    logoutR: 0,
    setFiltersR: 0,
    getCoefR: 0,
    getPageR2: 0,
    getRowsR: 0,
    getFltrsR: 0,
    getPageR: 0
};

export function setMainView(v){
    return {
        type: VIEW,
        view: v
    };
}

export function checkLogin() {
    return async function(dispatch) {
        const email = await getData('email');
        const token = await getData('token');
        let info = await getData('info');
        if (info) {
            info = JSON.parse(info);
        }
        if (email && token) {
            dispatch({type: AUTHED, email: email, token: token, expires_in: -1, info: info});
        } else {
            dispatch({type: LOGOUT});
        }
    }
}

export function showComments(item){
    return {
        type: VIEWCOMS,
        item: item,
        view: true
    }
}

export function showSharing(item) {
    return {
        type: "VIEWSHARING",
        item: item,
        view: true
    }
}

export function hideSharing() {
    return {
        type: "VIEWSHARING",
        item: null,
        view: false
    }
}

export function hideComments(){
    return {
        type: VIEWCOMS,
        item: null,
        view: false
    }
}

export function unlikeComment(e,t,pid,ci) {
    return async function(dispatch) {
        const q = {
            act: "unlikeComment",
            email: e,
            token: t,
            pid: pid,
            ci: ci
        };
        try {
            let response = await fetch('https://taketeam.net/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(q)
            });
            let msg = await response.json();
            if (msg.status === "OK") {
            } else {
            }
        } catch (e) {
            console.log("Got e:");
            console.log(e);
            //dispatch({type: NODATA});
        }

        // $.ajax({
        //     method: "POST",
        //     url: "https://taketeam.net/",
        //     data: JSON.stringify(q),
        //     contentType: "application/json; charset=utf-8",
        // }).done(function (msg) {
        //     if (msg.status === "OK") {
        //     } else {
        //     }
        // }).fail(function (jqXHR, textStatus) {
        //     console.log(textStatus, jqXHR);
        //
        // });
    }
}

export function likeComment(e,t,pid,ci) {
    return async function(dispatch) {
        const q = {
            act: "likeComment",
            email: e,
            token: t,
            pid: pid,
            ci: ci
        };
        try {
            let response = await fetch('https://taketeam.net/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(q)
            });
            let msg = await response.json();
            if (msg.status === "OK") {
            } else {
            }
        } catch (e) {
            console.log("Got e:");
            console.log(e);
            //dispatch({type: NODATA});
        }

        // $.ajax({
        //     method: "POST",
        //     url: "https://taketeam.net/",
        //     data: JSON.stringify(q),
        //     contentType: "application/json; charset=utf-8",
        // }).done(function (msg) {
        //     if (msg.status === "OK") {
        //     } else {
        //     }
        // }).fail(function (jqXHR, textStatus) {
        //     console.log(textStatus, jqXHR);
        //
        // });
    }
}

export function refreshMyInfo(e,t,i){
    return async function(dispatch) {
        const q = {
            act: "refreshMyInfo",
            email: e,
            token: t
        };
        try {
            let response = await fetch('https://taketeam.net/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(q)
            });
            let msg = await response.json();
            if (msg.status === "OK") {
                if (JSON.stringify(msg.info) !== JSON.stringify(i)) {
                    saveET(msg.info.email, msg.info.token, JSON.stringify(msg.info));
                    dispatch({type: LOGIN, email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
                }
            } else {
                saveET('','','');
                dispatch({type: AUTH_FAIL});
            }
        } catch (e) {
            console.log("Got e:");
            console.log(e);
            //dispatch({type: NODATA});
        }

        // $.ajax({
        //     method: "POST",
        //     url: "https://taketeam.net/",
        //     data: JSON.stringify(q),
        //     contentType: "application/json; charset=utf-8",
        // }).done(function (msg) {
        //     if (msg.status === "OK") {
        //         if (JSON.stringify(msg.info) !== JSON.stringify(i)) {
        //             saveET(msg.info.email, msg.info.token, JSON.stringify(msg.info));
        //             dispatch({type: LOGIN, email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
        //         }
        //     } else {
        //         saveET('','','');
        //         dispatch({type: AUTH_FAIL});
        //     }
        // }).fail(function (jqXHR, textStatus) {
        //     console.log(textStatus, jqXHR);
        //
        // });
    }
}

export function approveSub(e,t,s) {
    return async function(dispatch) {
        if (!nCpreventeR.loginR) {
            nCpreventeR.loginR = 1;
            const q = {
                act: "approveSub",
                email: e,
                token: t,
                sub: s
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                } else {
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                //dispatch({type: NODATA});
            }
            //
            nCpreventeR.loginR = 0;
        }
    }
}

export function getMyReqs(e,t){
    return async function(dispatch) {
        if (!nCpreventeR.loginR) {
            nCpreventeR.loginR = 1;
            dispatch(disablePage());
            const q = {
                act: "getMyRegs",
                email: e,
                token: t
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: "GOTSUBREQS", reqs: msg.info});
                } else {

                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
            }
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: "GOTSUBREQS", reqs: msg.info});
            //     } else {
            //
            //     }
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //
            //     nCpreventeR.getPageR = 0;
            //     dispatch(enablePage());
            // });
            dispatch(enablePage());
            nCpreventeR.loginR = 0;
        }
    }
}

export function unSub(email, token, unsub) {
    return async function(dispatch) {
        if (!nCpreventeR.getPageR) {
            nCpreventeR.getPageR = 1;
            const q = {
                act: "unSub",
                email: email,
                token: token,
                unsub: unsub
            }
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                await response.json();
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                //dispatch({type: NODATA});
            }
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //
            //     } else {
            //
            //     }
            //     nCpreventeR.getPageR = 0;
            // }).fail(function (jqXHR, textStatus) {
            //
            //
            // });
            nCpreventeR.getPageR = 0;
        }
    }
}

export function addComment(email,token, postid, txt) {
    return async function (dispatch) {
        if (!nCpreventeR.getPageR) {
            nCpreventeR.getPageR = 1;
            const q = {
                act: "addComment",
                email: email,
                token: token,
                postid: postid,
                txt: txt
            }
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: "UPDATECOMMENT", info: msg.info});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                //dispatch({type: NODATA});
            }
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: "UPDATECOMMENT", info: msg.info});
            //     } else {
            //
            //     }
            //     nCpreventeR.getPageR = 0;
            // }).fail(function (jqXHR, textStatus) {
            //
            //
            // });
            nCpreventeR.getPageR = 0;
        }
    }
}

export function getNewEvents() {
    return async function (dispatch) {
        if (!nCpreventeR.getPageR) {
            nCpreventeR.getPageR = 1;
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify({act: "refreshEvents"})
                });
                let msg = await response.json();
                if (msg.status !== "OK") {
                    dispatch({type: NODATA});
                } else {
                    dispatch({type: GOTDATA, payload: msg.info, status: 1});
                    dispatch({type: "REFRESHEVENTS"});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                //dispatch({type: NODATA});
            }
            /*
            $.ajax({
                method: "POST",
                url: "https://taketeam.net/",
                data: JSON.stringify({act: "refreshEvents"}),
                contentType: "application/json; charset=utf-8",
            }).done(function (msg) {
                if (msg.status !== "OK") {
                    dispatch({type: NODATA});
                } else {
                    dispatch({type: GOTDATA, payload: msg.info, status: 1});
                    dispatch({type: "REFRESHEVENTS"});
                }
                nCpreventeR.getPageR = 0;
            }).fail(function (jqXHR, textStatus) {
                dispatch({type: NODATA});
                nCpreventeR.getPageR = 0;
            });

             */
            nCpreventeR.getPageR = 0;
        }
    }
}

export function subFor(email, token, to) {
    return async function (dispatch) {
        if (!nCpreventeR.getPageR) {
            nCpreventeR.getPageR = 1;
            const q = {
                act: "subFor",
                email: email,
                token: token,
                to: to
            }
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                //dispatch({type: NODATA});
            }
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //
            //     } else {
            //
            //     }
            //     nCpreventeR.getPageR = 0;
            // }).fail(function (jqXHR, textStatus) {
            //
            //     nCpreventeR.getPageR = 0;
            // });
            nCpreventeR.getPageR = 0;
        }
    }
}

export function getMyEvents(email, token) {
    return async function (dispatch) {
        if (!nCpreventeR.getPageR2) {
            nCpreventeR.getPageR2 = 1;
            dispatch(disablePage())
            const q = {
                act: "getmainevents",
                email: email,
                token: token
            }
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: GOTDATA, payload: msg.info, status: Math.random()});
                    dispatch({type: "REFRESHEVENTS"});
                } else {
                    dispatch({type: NODATA});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
            }
            dispatch(enablePage());
            nCpreventeR.getPageR2 = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: GOTDATA, payload: msg.info, status: Math.random()});
            //         dispatch({type: "REFRESHEVENTS"});
            //     } else {
            //         dispatch({type: NODATA});
            //     }
            //     nCpreventeR.getPageR2 = 0;
            //     dispatch(enablePage())
            // }).fail(function (jqXHR, textStatus) {
            //     dispatch({type: NODATA});
            //     nCpreventeR.getPageR2 = 0;
            //     dispatch(enablePage())
            // });
        }
    }
}

export async function saveET(e,t,i) {
    await storeData('email', e);
    await storeData('token', t);
    await storeData('info', i);
}

export function login(login, pass) {
    return async function(dispatch) {
        if (!nCpreventeR.loginR) {
            nCpreventeR.loginR = 1;
            dispatch(disablePage());
            const q = {
                act: "login",
                email: login,
                password: pass,
                remember: 1
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    saveET(msg.info.email, msg.info.token, JSON.stringify(msg.info));
                    dispatch({type: LOGIN, email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
                } else {
                    dispatch({type: AUTH_FAIL});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
            }
            nCpreventeR.loginR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         saveET(msg.info.email, msg.info.token, JSON.stringify(msg.info));
            //         dispatch({type: LOGIN, email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
            //     } else {
            //         dispatch({type: AUTH_FAIL});
            //     }
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: AUTH_FAIL});
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export async function logout(){
    return function (dispatch) {
        saveET('', '', '');
        dispatch({
            type: LOGOUT
        });
    }
}

export function getUzerInfo(email, u) {
    return async function(dispatch) {
        if (!nCpreventeR.getPageR) {
            nCpreventeR.getPageR = 1;
            dispatch(disablePage());
            const q = {
                act: "getProfileInfo",
                email: email,
                u: u
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: USERINFO, info: msg.info, status: Math.random()});
                } else {
                    dispatch({type: USERINFO, info: {}, status: -1});

                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: USERINFO, info: {}, status: -1});
            }
            nCpreventeR.getPageR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: USERINFO, info: msg.info, status: Math.random()});
            //     } else {
            //         dispatch({type: USERINFO, info: {}, status: -1});
            //
            //     }
            //     nCpreventeR.getPageR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: USERINFO, info: {}, status: -1});
            //     nCpreventeR.getPageR = 0;
            //     dispatch(enablePage());
            // });

        }
    }
}

export function getCreatedEvents(email, token) {
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            dispatch(disablePage());
            const q = {
                act: "getProfileEvents",
                email: email,
                token: token
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: GOTEVENTS, payload: msg.info});
                } else {
                    dispatch({type: NOEVENTS});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: NOEVENTS});
            }
            nCpreventeR.setFiltersR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: GOTEVENTS, payload: msg.info});
            //     } else {
            //         dispatch({type: NOEVENTS});
            //     }
            //     nCpreventeR.setFiltersR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: NOEVENTS});
            //     nCpreventeR.setFiltersR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function saveAvatar(email,token,file) {
    return async function(dispatch) {
        if (!nCpreventeR.loginR) {
            dispatch(disablePage());
            nCpreventeR.loginR = 1;
            const q = {
                act: "saveNewAva",
                email: email,
                token: token,
                ava: file.uri,
                type: file.type
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    saveET(email, token, JSON.stringify(msg.info));
                    dispatch({type: AUTHED, email: email, token: token, expires_in: Math.random(), info: msg.info});
                    dispatch({type: NEWAVA});
                } else {
                    dispatch({type: AUTH_FAIL});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                saveET('', '', '');
                dispatch({type: AUTH_FAIL});
            }
            nCpreventeR.loginR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         saveET(email, token, JSON.stringify(msg.info));
            //         dispatch({type: AUTHED, email: email, token: token, expires_in: Math.random(), info: msg.info});
            //         dispatch({type: NEWAVA});
            //     } else {
            //         dispatch({type: AUTH_FAIL});
            //     }
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     saveET('', '', '');
            //     dispatch({type: AUTH_FAIL});
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function approve4event(e,t,w,p) {
    return async function(dispatch) {
        if (!nCpreventeR.getPageR) {
            //dispatch(disablePage());
            nCpreventeR.getPageR = 1;
            let q = {
                act: "approveJoiner",
                email: e,
                token: t,
                whom: w,
                pid: p
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: "GOTJOINERS", info: msg.info});
                } else {

                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                saveET('', '', '');
                dispatch({type: AUTH_FAIL});
            }
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: "GOTJOINERS", info: msg.info});
            //     } else {
            //
            //     }
            //     nCpreventeR.getPageR = 0;
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     nCpreventeR.getPageR = 0;
            // });
            nCpreventeR.getPageR = 0;
        }
    }
}

export function getJoiners(pid) {
    return async function(dispatch) {
        if (!nCpreventeR.getPageR) {
            dispatch(disablePage());
            nCpreventeR.getPageR = 1;
            let q = {
                act: "getJoiners",
                pid: pid
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: "GOTJOINERS", info: msg.info});
                } else {

                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: POSTFAIL, rsn: 'connection'});
            }
            nCpreventeR.getPageR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: "GOTJOINERS", info: msg.info});
            //     } else {
            //
            //     }
            //     nCpreventeR.getPageR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: POSTFAIL, rsn: 'connection'});
            //     nCpreventeR.getPageR = 0;
            //     dispatch(enablePage());
            // });

        }
    }
}

export function newPostFinish(email, token, st) {
    return async function(dispatch) {
        if (!nCpreventeR.loginR) {
            dispatch(disablePage());
            nCpreventeR.loginR = 1;
            let q = {
                act: "saveNewEvent",
                email: email,
                token: token
            };
            q['pics'] = [];
            if (st.needfoto) {
                for (let i in st.pics) {
                    let localUri = st.pics[i].uri;
                    let match = localUri.match(/data:image\/(\w+)/i);
                    q['pics'][i] = {
                        uri: localUri,
                        type: match[1],
                        width: st.pics[i].width,
                        height: st.pics[i].height,
                    };
                }
            } else {
                q['pics'][0] = 'preview';
            }
            q['nadpisi'] = st.nadpisi;
            q['text'] = st.text;
            q['wcs'] = st.wcs;
            q['wcc'] = st.wcc;
            q['rega'] = st.rega;
            q['title'] = st.title;
            q['data'] = st.data;
            q['time'] = st.time;
            q['city'] = st.city;
            q['ndpClr'] = st.ndpClr;
            q['ndpBClr'] = st.ndpBClr;
            q['nadpFS'] = st.nadpFS;
            q['chrds'] = st.chrds;
            q['rotas'] = st.rotas;
            q['cansee'] = st.cansee;
            q['cancom'] = st.cancom;
            q['shar1'] = st.shar1;
            q['shar2'] = st.shar2;
            q['shar3'] = st.shar3;
            q['shar4'] = st.shar4;
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: POSTFINISH, text: q.text, wcs: q.wcs, wcc: q.wcc});
                } else {
                    console.log("msg.rsn:");
                    console.log(msg.rsn);
                    dispatch({type: POSTFAIL, rsn: msg.rsn});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: POSTFAIL, rsn: 'connection'});
            }
            nCpreventeR.loginR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: POSTFINISH, text: q.text, wcs: q.wcs, wcc: q.wcc});
            //     } else {
            //         dispatch({type: POSTFAIL, rsn: msg.rsn});
            //     }
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: POSTFAIL, rsn: 'connection'});
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function updateSMSred(email, token, frm){
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            const q = {
                act: "updateSMSred",
                email: email,
                token: token,
                frm: frm
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                await response.json();
            } catch (e) {
                console.log("Got e:");
                console.log(e);
            }
            nCpreventeR.setFiltersR = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status !== "OK") {
            //
            //     }
            //     nCpreventeR.setFiltersR = 0;
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     nCpreventeR.setFiltersR = 0;
            // });
        }
    }
}

export function sendSMS(email, token, to, txt) {
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            const q = {
                act: "sendSMS",
                email: email,
                token: token,
                to: to,
                txt: txt
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status !== "OK") {
                    dispatch({type: SENDSMS, status: -1, sms: []});
                } else {
                    dispatch({type: SENDSMS, status: Math.random(), sms: msg.info});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: SENDSMS, status: -1, sms: []});
            }
            nCpreventeR.setFiltersR = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status !== "OK") {
            //         dispatch({type: SENDSMS, status: -1, sms: []});
            //     } else {
            //         dispatch({type: SENDSMS, status: Math.random(), sms: msg.info});
            //     }
            //     nCpreventeR.setFiltersR = 0;
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: SENDSMS, status: -1, sms: []});
            //     nCpreventeR.setFiltersR = 0;
            // });
        }
    }
}

export function EditPostFinish(email, token, st) {
    return async function(dispatch) {
        if (!nCpreventeR.loginR) {
            dispatch(disablePage());
            nCpreventeR.loginR = 1;
            let q = {
                act: "saveOldEvent",
                email: email,
                token: token,
                pid: st.pid
            };
            q['pics'] = st.pics;
            q['nadpisi'] = st.nadpisi;
            q['text'] = st.text;
            q['city'] = st.city;
            q['wcs'] = st.wcs;
            q['wcc'] = st.wcc;
            q['rega'] = st.rega;
            q['title'] = st.title;
            q['data'] = st.data;
            q['time'] = st.time;
            q['newfoto'] = st.newfoto;
            q['ndpBClr'] = st.ndpBClr;
            q['ndpClr'] = st.ndpClr;
            q['nadpFS'] = st.nadpFS;
            q['chrds'] = st.chrds;
            q['rotas'] = st.rotas;
            q['shar1'] = st.shar1;
            q['shar2'] = st.shar2;
            q['shar3'] = st.shar3;
            q['shar4'] = st.shar4;
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: POSTFINISH, text: q.text, wcs: q.wcs, wcc: q.wcc});
                } else {
                    dispatch({type: POSTFAIL, rsn: msg.rsn});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: POSTFAIL, rsn: 'connection'});
            }
            nCpreventeR.loginR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: POSTFINISH, text: q.text, wcs: q.wcs, wcc: q.wcc});
            //     } else {
            //         dispatch({type: POSTFAIL, rsn: msg.rsn});
            //     }
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: POSTFAIL, rsn: 'connection'});
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function block(mail,token,eid) {
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            // dispatch(disablePage());
            const q = {
                email: mail,
                token: token,
                eid: eid,
                act: 'block'
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch(getMyEvents(mail, token));
                    dispatch(hideSharing());
                } else {

                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: POSTFAIL, rsn: 'connection'});
            }
            nCpreventeR.setFiltersR = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch(getMyEvents(mail, token));
            //         dispatch(hideSharing());
            //     } else {
            //
            //     }
            //     nCpreventeR.setFiltersR = 0;
            //     // dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     nCpreventeR.setFiltersR = 0;
            //     //dispatch(enablePage());
            // });
        }
    }
}

export function report(mail,token,eid) {
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            // dispatch(disablePage());
            const q = {
                email: mail,
                token: token,
                eid: eid,
                act: 'report'
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
            } catch (e) {
                console.log("Got e:");
                console.log(e);
            }
            nCpreventeR.setFiltersR = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //
            //     } else {
            //
            //     }
            //     nCpreventeR.setFiltersR = 0;
            //     // dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     nCpreventeR.setFiltersR = 0;
            //     //dispatch(enablePage());
            // });
        }
    }
}

export function sendEvent(email,token,to,evt) {
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            // dispatch(disablePage());
            const q = {
                act: "sendEvent",
                email: email,
                token: token,
                to: to,
                evt: evt
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
            } catch (e) {
                console.log("Got e:");
                console.log(e);
            }
            nCpreventeR.setFiltersR = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //
            //     } else {
            //
            //     }
            //     nCpreventeR.setFiltersR = 0;
            //     // dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     nCpreventeR.setFiltersR = 0;
            //     //dispatch(enablePage());
            // });
        }
    }
}

export function getChatAvas(email,token) {
    return async function(dispatch) {
        if (!nCpreventeR.getPageR2) {
            nCpreventeR.getPageR2 = 1;
           // dispatch(disablePage());
            const q = {
                act: "getChat",
                email: email,
                token: token
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: "GOTCHATERS", info: msg.info, status: Math.random()});
                } else {
                    dispatch({type: "GOTCHATERS", status: -1, info: []});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: "GOTCHATERS", status: -1, info: []});
            }
            nCpreventeR.getPageR2 = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: "GOTCHATERS", info: msg.info, status: Math.random()});
            //     } else {
            //         dispatch({type: "GOTCHATERS", status: -1, info: []});
            //     }
            //     nCpreventeR.getPageR2 = 0;
            //    // dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: "GOTCHATERS", status: -1, info: []});
            //     nCpreventeR.getPageR2 = 0;
            //     //dispatch(enablePage());
            // });
        }
    }
}

export function getMySms(email,token) {
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            dispatch(disablePage());
            const q = {
                act: "getMySms2",
                email: email,
                token: token
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: GOTSMS, sms: msg.info, status: Math.random()});
                } else {
                    dispatch({type: GOTSMS, status: -1, sms: []});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: GOTSMS, status: -1, sms: []});
            }
            nCpreventeR.setFiltersR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: GOTSMS, sms: msg.info, status: Math.random()});
            //     } else {
            //         dispatch({type: GOTSMS, status: -1, sms: []});
            //     }
            //     nCpreventeR.setFiltersR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: GOTSMS, status: -1, sms: []});
            //     nCpreventeR.setFiltersR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function getPostInfo(pid) {
    return async function(dispatch) {
        if (!nCpreventeR.getPageR) {
            nCpreventeR.getPageR = 1;
            dispatch(disablePage());
            const q = {
                act: "getPostInfo",
                pid: pid
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: POSTINFO, event: msg.info, status: Math.random()});
                } else {
                    dispatch({type: POSTINFO, status: -1, event: {}});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: POSTINFO, status: -1, event: {}});
            }
            nCpreventeR.getPageR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: POSTINFO, event: msg.info, status: Math.random()});
            //     } else {
            //         dispatch({type: POSTINFO, status: -1, event: {}});
            //     }
            //     nCpreventeR.getPageR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: POSTINFO, status: -1, event: {}});
            //     nCpreventeR.getPageR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function SaveProfile3(email,token,nm,np){
    return async function(dispatch) {
        if (!nCpreventeR.loginR) {
            dispatch(disablePage())
            nCpreventeR.loginR = 1;
            const q = {
                act: "saveProfile3",
                email: email,
                token: token,
                nm: nm,
                np: np
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    saveET(msg.info.email, msg.info.token, JSON.stringify(msg.info));
                    dispatch({type: LOGIN, email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
                } else {
                    dispatch({type: AUTH_FAIL});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: AUTH_FAIL});
            }
            nCpreventeR.loginR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         saveET(msg.info.email, msg.info.token, JSON.stringify(msg.info));
            //         dispatch({type: LOGIN, email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
            //     } else {
            //         dispatch({type: AUTH_FAIL});
            //     }
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: AUTH_FAIL});
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function getCits(email, token) {
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            dispatch(disablePage());
            const q = {
                act: "getCities",
                email: email,
                token: token,
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: 'GOTCITIES', cities: msg.cities});
                } else {
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: AUTH_FAIL});
            }
            nCpreventeR.setFiltersR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: 'GOTCITIES', cities: msg.cities});
            //     } else {
            //     }
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function KMP(email, token){
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            dispatch(disablePage());
            const q = {
                act: "KMP",
                email: email,
                token: token,
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    saveET('', '', '');
                    dispatch({type: LOGOUT});
                } else {
                    dispatch({type: AUTH_FAIL});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: AUTH_FAIL});
            }
            nCpreventeR.loginR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         saveET('', '', '');
            //         dispatch({type: LOGOUT});
            //     } else {
            //         dispatch({type: AUTH_FAIL});
            //     }
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: AUTH_FAIL});
            //     nCpreventeR.loginR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function searchEvents(tags, email) {
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            dispatch(disablePage());
            const q = {
                act: "searchEvents2",
                tags: tags,
                email: email
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: SEARCH, events: msg.info, status: Math.random()});
                } else {
                    dispatch({type: SEARCH, status: -1, events: []});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: SEARCH, status: -1, events: []});
            }
            nCpreventeR.setFiltersR = 0;
            dispatch(enablePage());
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: SEARCH, events: msg.info, status: Math.random()});
            //     } else {
            //         dispatch({type: SEARCH, status: -1, events: []});
            //     }
            //     nCpreventeR.setFiltersR = 0;
            //     dispatch(enablePage());
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: SEARCH, status: -1, events: []});
            //     nCpreventeR.setFiltersR = 0;
            //     dispatch(enablePage());
            // });
        }
    }
}

export function goEvent(email, token, eid, type) {
    return async function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            const q = {
                act: "goEvent",
                email: email,
                token: token,
                eid: eid,
                type: type
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    dispatch({type: UPDATEEVENTS, payload: msg.info});
                } else {
                    dispatch({type: UPDATEEVENTS, status: -1});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: UPDATEEVENTS, status: -1});
            }
            nCpreventeR.setFiltersR = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         dispatch({type: UPDATEEVENTS, payload: msg.info});
            //     } else {
            //         dispatch({type: UPDATEEVENTS, status: -1});
            //     }
            //     nCpreventeR.setFiltersR = 0;
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: UPDATEEVENTS, status: -1});
            //     nCpreventeR.setFiltersR = 0;
            // });
        }
    }
}

export function saveProfile(email, token, city, osebe, nick) {
    return async function(dispatch) {
        if (!nCpreventeR.loginR) {
            nCpreventeR.loginR = 1;
            const q = {
                act: "saveProfile",
                email: email,
                token: token,
                city: city,
                osebe: osebe,
                nick: nick
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    saveET(email, token, JSON.stringify(msg.info));
                    dispatch({type: "LOGINUPDATE", email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
                } else {
                    dispatch({type: AUTH_FAIL});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: AUTH_FAIL});
            }
            nCpreventeR.loginR = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         saveET(email, token, JSON.stringify(msg.info));
            //         dispatch({type: "LOGINUPDATE", email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
            //     } else {
            //         dispatch({type: AUTH_FAIL});
            //     }
            //     nCpreventeR.loginR = 0;
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: AUTH_FAIL});
            //     nCpreventeR.loginR = 0;
            // });
        }
    }
}

export function saveProfile2(email, token, priv, popup) {
    return async function(dispatch) {
        if (!nCpreventeR.loginR) {
            dispatch(disablePage());
            nCpreventeR.loginR = 1;
            const q = {
                act: "saveProfile2",
                email: email,
                token: token,
                private: priv,
                popup: popup,
            };
            try {
                let response = await fetch('https://taketeam.net/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(q)
                });
                let msg = await response.json();
                if (msg.status === "OK") {
                    saveET(email, token, JSON.stringify(msg.info));
                    //dispatch({type: 'UPDATELOGIN', email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
                    dispatch({type: LOGIN, email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
                } else {
                    dispatch({type: AUTH_FAIL});
                }
            } catch (e) {
                console.log("Got e:");
                console.log(e);
                dispatch({type: AUTH_FAIL});
            }
            dispatch(enablePage());
            nCpreventeR.loginR = 0;
            // $.ajax({
            //     method: "POST",
            //     url: "https://taketeam.net/",
            //     data: JSON.stringify(q),
            //     contentType: "application/json; charset=utf-8",
            // }).done(function (msg) {
            //     if (msg.status === "OK") {
            //         saveET(email, token, JSON.stringify(msg.info));
            //         //dispatch({type: 'UPDATELOGIN', email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
            //         dispatch({type: LOGIN, email: msg.info.email, token: msg.info.token, expires_in: 666, info: msg.info});
            //     } else {
            //         dispatch({type: AUTH_FAIL});
            //     }
            //     dispatch(enablePage());
            //     nCpreventeR.loginR = 0;
            // }).fail(function (jqXHR, textStatus) {
            //     console.log(textStatus, jqXHR);
            //     dispatch({type: AUTH_FAIL});
            //     dispatch(enablePage());
            //     nCpreventeR.loginR = 0;
            // });
        }
    }
}

/*
export function authed(login, pass) {
    return function(dispatch) {
        if (!nCpreventeR.authedR) {
            nCpreventeR.authedR = 1;
            dispatch(disablePage());
            const request = $.ajax({
                url: "http://192.168.125.98:8081/api/auth/me",
                method: "POST",
                dataType: "json",
                headers: {'Authorization': 'Bearer ' + pass}
            });
            request.done(function (nOmsg) {
                const request2 = $.ajax({
                    url: "http://192.168.125.98:8081/api/auth/refresh",
                    method: "POST",
                    //data: {Authorization: pass},
                    dataType: "json",
                    headers: {'Authorization': 'Bearer ' + pass}
                });
                request2.done(function (msg) {
                    setCookie('token', msg.access_token, {'max-age': msg.expires_in});
                    dispatch(disableLoginCSS());
                    dispatch({type: AUTHED, email: login, token: msg.access_token, expires_in: msg.expires_in});
                    const usr = getCookie('user');
                    const fils = getCookie('files_' + usr.replace(/([@.]+)/ig, ''));
                    if (typeof fils !== 'undefined') {
                        store.dispatch(addData(JSON.parse(fils)));
                        store.dispatch(fileUploaded());
                    }
                    dispatch(enablePage());
                    nCpreventeR.authedR = 0;
                });
                request2.fail(function (jqXHR, textStatus) {
                    console.log(textStatus,jqXHR);
                    dispatch({type: AUTH_FAIL});
                    dispatch(enablePage());
                    nCpreventeR.authedR = 0;
                });
            });
            request.fail(function (jqXHR, textStatus) {
                console.log(textStatus,jqXHR);
                dispatch({type: AUTH_FAIL});
                dispatch(enablePage());
                nCpreventeR.authedR = 0;
            });
        }

    }
}
*/
export function createPost(needfoto, pics, stepStatus = 0) {
    return {
        type: CREATEPOST,
        needfoto: needfoto,
        pics: pics,
        stepStatus: stepStatus
    };
}

export function cancelPost(){
    return {
        type: CANCELPOST
    }
}

export function newPostLastStep(nadpisi, txtclr, bckclr, nFS, chrds, rotas){
    return {
        type: POSTLASTSTEP,
        nadpisi: nadpisi,
        txtclr: txtclr,
        bckclr: bckclr,
        nFS: nFS,
        chrds: chrds,
        rotas: rotas
    }
}

export function exportR(datka) {
    return {
        type: EXPORT_REPORT,
        link: datka
    };
}

/*
export function logout(token) {
    return function(dispatch) {
        if (!nCpreventeR.logoutR) {
            nCpreventeR.logoutR = 1;
            deleteCookie('token');
            deleteCookie('user');
            dispatch(disablePage());
            const request = $.ajax({
                url: "http://192.168.125.98:8081/api/auth/logout",
                method: "POST",
                dataType: "json",
                headers: {'Authorization': 'Bearer ' + token}
            });
            request.done(function (msg) {
                dispatch({type: LOGOUT});
                dispatch(enableLoginCSS());
                dispatch(enablePage());
                nCpreventeR.logoutR = 0;
            });
            request.fail(function (jqXHR, textStatus) {
                dispatch({type: LOGOUT});
                dispatch(enableLoginCSS());
                dispatch(enablePage());
                nCpreventeR.logoutR = 0;
            });
        }
    }
}

 */

export function enablePage() {
    return {
        type: ENABLE_PAGE
    }
}

export function disablePage() {
    return {
        type: DISABLE_PAGE
    }
}

export function enableLoginCSS() {
    return {
        type: ENABLE_LOGIN_CSS
    }
}

export function disableLoginCSS() {
    return {
        type: DISABLE_LOGIN_CSS
    }
}

export function addData(data) {
    //const usr = getCookie('user');
    //if (usr) setCookie('files_'+usr.replace(/([@.]+)/ig,''), JSON.stringify(data), {'max-age': 3600});
    return {
        type: ADD_DATA,
        payload: data
    }
}

export function fileUploaded() {
    return {
        type: FILE_UPLOADED
    }
}
/*
export function clearData(usr){
    deleteCookie('files_' + usr.replace(/([@.]+)/ig,''));
    deleteCookie('page');
    deleteCookie('filters');
    return {
        type: CLEAR_DATA,
    }
}
*/
export function unsetLink() {
    return {
        type: UNSET_LINK
    }
}

export function unloadFile() {
    return {
        type: FILE_UNLOAD
    }
}

export function unsetFilters() {
    return {
        type: UNSET_FILTERS
    }
}

export function setRaw(data) {
    let info = {};
    for (let i in data) {
        if (i !== 'data') {
            info[i] = data[i];
        }
    }
    return {
        type: SET_DATA,
        payload: data.data,
        info: info
    }
}

export function setFilter(data) {
    return {
        type: SET_FILTER,
        payload: data
    }
}
export function setShowBen(data) {
    return {
        type: SET_SHOW_BEN,
        payload: data
    }
}

export function unsetData() {
    return {
        type: UNSET_DATA
    }
}

/*
export function setFilters(data, token, paga) {
    return function(dispatch) {
        if (!nCpreventeR.setFiltersR) {
            nCpreventeR.setFiltersR = 1;
            dispatch(disablePage());
            if (!paga) {
                paga = 1;
            }
            let getObj = {page: paga};
            if (data.IDinpfltr !== '') {
                let tmp = data.IDinpfltr.split(' ');
                if (tmp.length < 2) {
                    getObj['timestamp_from'] = data.IDinpfltr + " 00:00:00";
                } else {
                    getObj['timestamp_from'] = data.IDinpfltr;
                }
            }
            if (data.IDinpfltr2 !== '') {
                let tmp = data.IDinpfltr2.split(' ');
                if (tmp.length < 2) {
                    getObj['timestamp_to'] = data.IDinpfltr2 + " 23:59:59";
                } else {
                    getObj['timestamp_to'] = data.IDinpfltr2;
                }
            }
            if (data.Dateinpfltr !== '') {
                let tmp = data.Dateinpfltr.split(' ');
                if (tmp.length < 2) {
                    getObj['datetime_from'] = data.Dateinpfltr + " 00:00:00";
                } else {
                    getObj['datetime_from'] = data.Dateinpfltr;
                }
            }
            if (data.Dateinpfltr2 !== '') {
                let tmp = data.Dateinpfltr2.split(' ');
                if (tmp.length < 2) {
                    getObj['datetime_to'] = data.Dateinpfltr2 + " 23:59:59";
                } else {
                    getObj['datetime_to'] = data.Dateinpfltr2;
                }
            }
            if (data.PosIDinpfltr !== '') {
                getObj['posid'] = data.PosIDinpfltr;
            }
            getObj['merchant[]'] = data.Merchselfltr;
            getObj['subject[]'] = data.Subjselfltr;
            getObj['product[]'] = data.Prodselfltr;
            const request = $.ajax({
                url: "http://192.168.125.98:8081/api/getInfo",
                data: getObj,
                method: "GET",
                dataType: "json",
                headers: {'Authorization': 'Bearer ' + token}
            });
            request.done(function (msg) {
                setCookie("page", paga, {'max-age': 36000});
                setCookie("filters", JSON.stringify(data), {'max-age': 36000});
                dispatch(exportR(''));
                dispatch({type: SET_FILTERS, payload: data});
                dispatch(setRaw(msg));
                setTimeout(() => {
                    dispatch(enablePage())
                }, 500);
                nCpreventeR.setFiltersR = 0;
            });
            request.fail(function (jqXHR, textStatus) {
                console.log("setFilters error:", jqXHR, textStatus);
                alert("Error...");
                dispatch(enablePage());
                nCpreventeR.setFiltersR = 0;
            });
        }
    }
}
*/
/*
export function setCoef(data, status) {
    return {
        type: SET_COEF,
        payload: data,
        stts: status
    }
}
*/
/*
export function getCoef(token) {
    return function(dispatch) {
        if (!nCpreventeR.getCoefR) {
            nCpreventeR.getCoefR = 1;
            dispatch(disablePage());
            const request = $.ajax({
                url: "http://192.168.125.98:8081/api/coefficient",
                method: "GET",
                dataType: "json",
                headers: {'Authorization': 'Bearer ' + token}
            });
            request.done(function (msg) {
                let tmp = [];
                let lid = 0;
                for (let i in msg) {
                    tmp[i] = msg[i];
                    if (typeof msg[i]['id'] === 'undefined') {
                        tmp[i]['id'] = lid;
                        lid++;
                    } else {
                        lid = parseInt(msg[i]['id']) + 1;
                    }
                    if (msg[i]['merchant'] == null) {
                        tmp[i]['merchant'] = '';
                    }
                    if (msg[i]['product'] == null) {
                        tmp[i]['product'] = '';
                    }
                }
                dispatch(setCoef(tmp, 2));
                dispatch(enablePage());
                nCpreventeR.getCoefR = 0;
            });
            request.fail(function (jqXHR, textStatus) {
                console.log(jqXHR, textStatus);
                dispatch(enablePage());
                nCpreventeR.getCoefR = 0;
            });
        }
    }
}

export function getRows(token) {
    return function(dispatch) {
        if (!nCpreventeR.getRowsR) {
            nCpreventeR.getRowsR = 1;
            dispatch(disablePage());
            const request = $.ajax({
                url: "http://192.168.125.98:8081/api/getInfo",
                data: {},
                method: "GET",
                dataType: "json",
                headers: {'Authorization': 'Bearer ' + token}
            });
            request.done(function (msg) {
                dispatch(setRaw(msg));
                dispatch(enablePage());
                nCpreventeR.getRowsR = 0;
            });
            request.fail(function (jqXHR, textStatus) {
                console.log("getRows error:", jqXHR, textStatus);
                dispatch(enablePage());
                nCpreventeR.getRowsR = 0;
            });
        }
    }
}

export function getFltrs(token){
    return function(dispatch) {
        if (!nCpreventeR.getFltrsR) {
            nCpreventeR.getFltrsR = 1;
            const request = $.ajax({
                url: "http://192.168.125.98:8081/api/filterList",
                method: "GET",
                dataType: "json",
                headers: {'Authorization': 'Bearer ' + token}
            });
            request.done(function (msg) {
                dispatch(setFD(msg));
                nCpreventeR.getFltrsR = 0;
            });
            request.fail(function (jqXHR, textStatus) {
                console.log("getFltrs error:", jqXHR, textStatus);
                nCpreventeR.getFltrsR = 0;
            });
        }
    }
}
*/
export function setFD(data) {
    return {
        type: SET_FD,
        payload: data
    }
}

export function unsetFD() {
    return {
        type: UNSET_FD
    }
}

/*
export function getPage(p, token, filters) {
    return function(dispatch) {
        if (!nCpreventeR.getPageR) {
            nCpreventeR.getPageR = 1;
            let getObj = {page: p};
            if (filters.IDinpfltr !== '') {
                let tmp = filters.IDinpfltr.split(' ');
                if (tmp.length < 2) {
                    getObj['timestamp_from'] = filters.IDinpfltr + " 00:00:00";
                } else {
                    getObj['timestamp_from'] = filters.IDinpfltr;
                }
            }
            if (filters.IDinpfltr2 !== '') {
                let tmp = filters.IDinpfltr2.split(' ');
                if (tmp.length < 2) {
                    getObj['timestamp_to'] = filters.IDinpfltr2 + " 23:59:59";
                } else {
                    getObj['timestamp_to'] = filters.IDinpfltr2;
                }
            }
            if (filters.Dateinpfltr !== '') {
                let tmp = filters.Dateinpfltr.split(' ');
                if (tmp.length < 2) {
                    getObj['datetime_from'] = filters.Dateinpfltr + " 00:00:00";
                } else {
                    getObj['datetime_from'] = filters.Dateinpfltr;
                }
            }
            if (filters.Dateinpfltr2 !== '') {
                let tmp = filters.Dateinpfltr2.split(' ');
                if (tmp.length < 2) {
                    getObj['datetime_to'] = filters.Dateinpfltr2 + " 23:59:59";
                } else {
                    getObj['datetime_to'] = filters.Dateinpfltr2;
                }
            }
            if (filters.PosIDinpfltr !== '') {
                getObj['posid'] = filters.PosIDinpfltr;
            }
            getObj['merchant[]'] = filters.Merchselfltr;
            getObj['subject[]'] = filters.Subjselfltr;
            getObj['product[]'] = filters.Prodselfltr;
            dispatch(disablePage());
            const request = $.ajax({
                url: "http://192.168.125.98:8081/api/getInfo",
                data: getObj,
                method: "GET",
                dataType: "json",
                headers: {'Authorization': 'Bearer ' + token}
            });
            request.done(function (msg) {
                setCookie("page", p, {'max-age': 36000});
                dispatch(setRaw(msg));
                setTimeout(() => {
                    dispatch(enablePage())
                }, 500);
                nCpreventeR.getPageR = 0;
            });
            request.fail(function (jqXHR, textStatus) {
                console.log("getPage error:", jqXHR, textStatus);
                alert("Error...");
                dispatch(enablePage());
                nCpreventeR.getPageR = 0;
            });
        }
    }
}
*/

/*
export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}

export function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}
*/

export async function getData (key) {
    try {
        return await AsyncStorage.getItem(key);
    } catch(e) {
        console.log('getData Error:');
        console.log(e);
    }
}

export async function storeData (key, value) {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log('storeData Error:');
        console.log(e);
    }
}
/*
export function sendClear(token) {
    const request = $.ajax({
        url: "http://192.168.125.98:8081/api/clearData",
        method: "DELETE",
        dataType: "json",
        headers: { 'Authorization': 'Bearer ' + token }
    });
    request.done(function (msg) {

    });
    request.fail(function (jqXHR, textStatus) {
        console.log(jqXHR, textStatus);
    });
}
 */