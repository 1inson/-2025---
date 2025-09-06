 import axios from 'axios'

const request = axios.create({
  baseURL: '/api'
})


export function createPost(data) {
  return request.post('/student/post', data)
}

export function getAllPosts() {
  return request.get('/student/post')
}

export function deletePost(params) {
  return request.delete('/student/post', { params: params })
}

export function reportPost(data) {
  return request.post('/student/report-post', data)
}

export function updatePost(data) {
  return request.put('/student/post', data)
}

export function getLikes(params) {
  return request.get('/student/likes', { params: params });
}

export function getReportList(params) {
  return request.get('/student/report-post', { params: params });
}

export function likePost(data) {
  return request.post('/student/likes', data);
}