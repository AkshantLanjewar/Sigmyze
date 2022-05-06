import { createStore, combineReducers } from 'redux'
import userReducer     from './reducers/userReducer'
import lunarReducer    from './reducers/lunarReducer'

function configureStore(state) {
    let reduers = combineReducers({ user: userReducer, lunar: lunarReducer })
    return createStore(reduers)
}

export default configureStore