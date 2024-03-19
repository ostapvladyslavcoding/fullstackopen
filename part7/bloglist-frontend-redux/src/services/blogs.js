import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const getBlog = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`)
  return res.data
}

const addComment = async (id, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.post(`${baseUrl}/${id}/comments`, { comment }, config)
  return res.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.post(baseUrl, newObject, config)
  return res.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const res = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return res.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}

export default { getAll, getBlog, addComment, create, update, remove, setToken }
