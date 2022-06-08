import { createStore, combineReducers } from 'redux'
import userReducer     from './reducers/userReducer'
import lunarReducer    from './reducers/lunarReducer'

function configureStore(state) {
    let reduers = combineReducers({ user: userReducer, lunar: lunarReducer })

    const persistedState = localStorage.getItem('redux-state')
        ? JSON.parse(localStorage.getItem('redux-state'))
        : {}

    let store   = createStore(reduers, persistedState)

    store.subscribe(() => {
        localStorage.setItem('redux-state', JSON.stringify(store.getState()))
    })

    return store
}

export default configureStore