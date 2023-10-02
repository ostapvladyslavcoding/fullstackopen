const { groupBy } = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, cur) => sum + cur.likes, 0)

const favoriteBlog = (blogs) =>
  blogs.reduce((fav, cur) => (fav.likes > cur.likes ? fav : cur), blogs[0])

const mostBlogs = (blogs) => {
  const blogsByAuthor = Object.entries(groupBy(blogs, (blog) => blog.author))

  const numBlogs = blogsByAuthor.reduce((result, [author, blogs]) => {
    return result.concat({
      author,
      blogs: blogs.length,
    })
  }, [])

  return numBlogs.sort((a, b) => b.blogs - a.blogs)[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
