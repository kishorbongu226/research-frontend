import {createStore} from 'redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist' ;
import storage from 'redux-persist/lib/storage';
import Reducer from './Reducer';

//const store = createStore(Reducer);
const persistConfig = {
    key : "root",
    storage: storage
}

// const rootReducer  = combineReducers({
//     common : Reducer,
// })
const persistedReducer = persistReducer(persistConfig,Reducer)
const store = configureStore({
    reducer: persistedReducer,
});
export default store;

export const persistor = persistStore(store);


// function configureStore(state = { rotating: true }) {
//     return createStore(Reducer,state);
//   }
  
//   export default configureStore;