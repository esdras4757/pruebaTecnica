import { configurationState, configurationActionTypes} from "../types";

const initialState:configurationState ={
    theme:'dark',
    language:'es'
}

export function configurtionReducer(state=initialState,action:configurationActionTypes){
    switch(action.type){
        case "changeTheme":
            return {...state,theme:action.payload}
            default:
                return state;
    }
}