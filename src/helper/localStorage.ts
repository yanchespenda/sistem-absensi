export function getStorageItem(key: string) {
    const get = localStorage.getItem(key)

    return get
}

export function setStorageItem(key: string, value: string) {
    try {
        localStorage.setItem(key, value)
        return true
    } catch (error) {
        
    }
    return false
}
