
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist' ;
import storage from 'redux-persist/lib/storage';
import Reducer from './Reducer';


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

//   }
  
//   export default configureStore;