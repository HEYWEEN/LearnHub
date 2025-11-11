import axios from './axios'

export const login = (email, password) =>
  axios.post('/auth/login', { email, password })
