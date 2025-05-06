import { instance } from './api'

class CommentService {
  async addComment(data) {
    return await instance
      .post('/comments', data, {
        headers: { 'Content-Type': 'mulipart/form-data' },
      })
      .then((res) => res)
      .catch((err) => err)
  }

  async updateComment(id, data) {
    return await instance
      .post(`/comments/${id}`, data, {
        headers: { 'Content-Type': 'mulipart/form-data' },
      })
      .then((res) => res)
      .catch((err) => err.response)
  }

  async deleteComment(id) {
    return await instance
      .delete(`/comments/${id}`)
      .then((res) => res)
      .catch((err) => err.response)
  }

  async deleteCommentFile(id) {
    return await instance
      .delete(`/comments/file/${id}`)
      .then((res) => res)
      .catch((err) => err.response)
  }
}

export const commentService = new CommentService()
