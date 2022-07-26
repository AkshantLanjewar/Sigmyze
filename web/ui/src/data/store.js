import { createStore, combineReducers } from 'redux'
import userReducer     from './reducers/userReducer'
import lunarReducer    from './reducers/lunarReducer'
import projectReducer  from './reducers/projectReducer'

function configureStore(state) {
    let reduers = combineReducers({ user: userReducer, lunar: lunarReducer, project: projectReducer })

    const persistedState = localStorage.getItem('redux-state')
        ? JSON.parse(atob(localStorage.getItem('redux-state')))
        : {}

    let store   = createStore(reduers, persistedState)

    store.subscribe(() => {
        localStorage.setItem('redux-state', btoa(JSON.stringify(store.getState())))
    })

    return store
}

export default configureStore