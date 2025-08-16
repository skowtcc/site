import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { storage } from './storage'
import assetSlice from './slices/asset-slice'
// import authSlice from './slices/auth-slice'

export const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['assets'],
}

// Nested persist config for assets slice to exclude mode
const assetsPersistConfig = {
    key: 'assets',
    storage: storage,
    blacklist: ['mode'], // Don't persist mode - always start in view mode
}

// Nested persist config for auth slice to exclude loading and error states
const authPersistConfig = {
    key: 'auth',
    storage: storage,
    blacklist: ['isLoading', 'error'], // Don't persist loading/error states
}

const rootReducer = combineReducers({
    assets: persistReducer(assetsPersistConfig, assetSlice.reducer),
    // auth: persistReducer(authPersistConfig, authSlice.reducer),
})

export const persistedReducer = persistReducer(persistConfig, rootReducer)
