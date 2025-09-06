import axios from 'axios'

const request = axios.create({
  baseURL: '/api'
})

export function getUnapprovedReports(params) {
  return request.get('/admin/report', { params: params })
}

export function approveReport(data) {
  return request.post('/admin/report', data)
}