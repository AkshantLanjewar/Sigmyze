import projectReducer from "./projectSlice";

import { combineReducers, createStore } from "redux";

const rootReducer = combineReducers({
    projectReducer
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store