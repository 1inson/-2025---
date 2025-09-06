 import axios from 'axios'

const request = axios.create({
      baseURL: '/api'
    }) 

export function login(data) {
      return request.post('/user/login', data)
    }

export function register(data) { 
  return request.post('/user/register', data)
}

