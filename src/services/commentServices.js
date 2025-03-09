import { instance } from './api'

class CommentService {
  async addComment(data) {
    return await instance
      .post('/comments', data)
      .then((res) => res)
      .catch((err) => err)
  }
}

export const commentService = new CommentService()
