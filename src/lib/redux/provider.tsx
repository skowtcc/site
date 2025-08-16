'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
// import { AuthProvider } from '../../components/auth/auth-context'

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}

export default ReduxProvider
