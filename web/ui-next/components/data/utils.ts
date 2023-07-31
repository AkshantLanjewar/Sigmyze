import cacheData from 'memory-cache'

async function GET_Cache<Type>(url: string, init?: RequestInit): Promise<Type> {
    const value = cacheData.get(url)
    if(value)
        return value
    
    const hours = 72
    const data = await GET_Cacheless<Type>(url, init)
    cacheData.put(url, data, hours * 1000 * 60 * 60)
    return data
}

async function GET<Type>(url: string, init?: RequestInit): Promise<Type> {
    return await GET_Cache(url, init)
}

async function GET_Cacheless<Type>(url: string, init?: RequestInit): Promise<Type> {
    const res = await fetch(url, init)
    const data = await res.json()
    return data
}

function GenerateOptions(method: string, token: string | null, data?: any): RequestInit {
    let options = {} as RequestInit
    options.method = method
    options.headers = {}
    

    if(token !== undefined)
        options.headers['Authorization'] = `Bearer ${token}`
    if(data !== undefined) {
        options.body = JSON.stringify(data)
        options.headers['Content-Type'] = 'application/json'
    }

    return options
}

const removeEmpty = (obj: any) => {
    Object.keys(obj).forEach(key => 
        (obj[key] && typeof obj[key] === 'object') && removeEmpty(obj[key]) ||
        (!obj[key] && obj[key] !== undefined) && delete obj[key]
    )

    return obj
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : 'https://sigmyze.com'
const wsServer = dev ? "ws://127.0.0.1:5025" : 'ws://sigmyze.com/quanta-socket'

export { 
    GET,
    server,
    GenerateOptions,
    GET_Cacheless,
    removeEmpty,
    wsServer,
    capitalizeFirstLetter
}