import { createStore } from 'redux'
import userReducer     from './reducers/userReducer'

const defaultState = {
    userModal: false
}

function configureStore(state = defaultState) {
    return createStore(userReducer, state)
}

export default configureStore