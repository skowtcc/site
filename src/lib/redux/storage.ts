import createWebStorage from 'redux-persist/es/storage/createWebStorage'

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null)
        },
        setItem(_key: string, value: number) {
            return Promise.resolve(value)
        },
        removeItem() {
            return Promise.resolve()
        },
    }
}

export const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()
