import Cookies from "js-cookie"

export function userReducer(state=Cookies.set('user') ? JSON.parse(Cookies.get("user")) : null, action){
    switch (action.type) {
        case "LOGIN": return action.payload

        default: return state
    }
}