import { configureStore } from '@reduxjs/toolkit'
import { persistedReducer } from './reducer'
// @ts-ignore sdf
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync'
import { useDispatch, TypedUseSelectorHook, useSelector, useStore } from 'react-redux'
import { persistStore } from 'redux-persist'

const blacklist = ['persist/PERSIST', 'persist/REHYDRATE']

// Check if we're running in the browser
const isClient = typeof window !== 'undefined'

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
        const middleware = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        })

        // Only add state sync middleware on the client side
        if (isClient) {
            return middleware.prepend(
                createStateSyncMiddleware({
                    predicate: (action: any) => {
                        if (typeof action !== 'function') {
                            if (Array.isArray(blacklist)) {
                                return blacklist.indexOf(action.type) < 0
                            }
                        }
                        return false
                    },
                }),
            )
        }

        return middleware
    },
})

export const persistor = persistStore(store)

// Only initialize message listener on the client side
if (isClient) {
    initMessageListener(store)
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore = () => useStore<RootState>()
