import axios from 'axios'

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : 'https://arcade-manager-server-c205931feabf.herokuapp.com',
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
