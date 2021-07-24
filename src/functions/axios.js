import axios from 'axios'
let dev = false;
const instance = axios.create({
    baseURL: dev ? 'http://localhost:8000/api/' : 'https://murmuring-lowlands-37818.herokuapp.com/api/',
})

const requestInterceptor = config => {
    const token = localStorage.getItem('token')
    config.headers['Content-Type'] = `application/json`
    config.headers['X-Requested-With'] = `XMLHttpRequest`
    if(token) config.headers['Authorization'] = `Bearer ${token}`
    return config
}

instance.interceptors.request.use(requestInterceptor)
export default instance