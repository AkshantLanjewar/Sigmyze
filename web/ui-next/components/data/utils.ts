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

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : 'https://sigmyze.com'

export { 
    GET,
    server,
    GenerateOptions,
    GET_Cacheless
}