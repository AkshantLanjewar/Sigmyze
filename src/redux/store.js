import projectReducer from "./projectSlice";
import stateReducer from './stateSlice'

import { combineReducers, createStore } from "redux";

const rootReducer = combineReducers({
    projectReducer,
    stateReducer
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store