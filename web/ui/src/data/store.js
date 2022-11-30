import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage                          from 'redux-persist/lib/storage'

import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'

import userReducer         from './reducers/userReducer'
import lunarReducer        from './reducers/lunarReducer'
import projectReducer      from './reducers/projectReducer'
import driveReducer        from './reducers/driveReducer'
import organizationReducer from "./reducers/organizationReducer";

const persistConfig = {
    key: 'persistRoot',
    storage: storage,
    stateReconciler: autoMergeLevel1
}

function configureStore(state) {
    let reducers = combineReducers({
        user: userReducer,
        lunar: lunarReducer,
        project: projectReducer,
        drive: driveReducer,
        organization: organizationReducer
    })

    let persisted_reducer = persistReducer(persistConfig, reducers)

    let store   = createStore(persisted_reducer)
    let persist = persistStore(store)
    return [store, persist]
}

export default configureStore