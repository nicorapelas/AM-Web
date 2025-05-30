import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  // baseURL: 'https://arcade-manager-server-c205931feabf.herokuapp.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

export default instance
