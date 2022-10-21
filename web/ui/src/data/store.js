import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage                          from 'redux-persist/lib/storage'

import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'

import userReducer     from './reducers/userReducer'
import lunarReducer    from './reducers/lunarReducer'
import projectReducer  from './reducers/projectReducer'
import driveReducer    from './reducers/driveReducer'

const persistConfig = {
    key: 'persistRoot',
    storage: storage,
    stateReconciler: autoMergeLevel1
}

function configureStore(state) {
    let reduers = combineReducers({ 
        user: userReducer, 
        lunar: lunarReducer, 
        project: projectReducer, 
        drive: driveReducer 
    }) 

    let persisted_reducer = persistReducer(persistConfig, reduers) 

    let store     = createStore(persisted_reducer)
    let persistor = persistStore(store)
    return [store, persistor]
}

export default configureStore