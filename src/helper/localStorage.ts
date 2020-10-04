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

export function deleteStorageItem(key: string) {
    try {
        localStorage.removeItem(key)
        return true
    } catch (error) {
        
    }
    return false
}
