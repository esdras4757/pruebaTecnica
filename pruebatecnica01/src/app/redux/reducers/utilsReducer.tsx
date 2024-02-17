 // reducers/utilsReducer.js
import { changeIsLoading } from "../actions/appActions";
import { utilsState } from "../types";

const initialState: utilsState = {
  isLoading: false,
};

interface Action{
type:string
payload:boolean
}

export function utilsReducer(state = initialState, action:Action) {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
}
