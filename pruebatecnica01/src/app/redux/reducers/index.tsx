import { configurtionReducer } from "./configurationReducer";
import { combineReducers } from 'redux';
import { utilsReducer } from "./utilsReducer";

const rootReducers = combineReducers({
  configuration:configurtionReducer,
  utils:utilsReducer
});

export default rootReducers;
