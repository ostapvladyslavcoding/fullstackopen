const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((sum, cur) => sum + cur.likes, 0)

const favoriteBlog = (blogs) =>
  blogs.reduce((fav, cur) => (fav.likes > cur.likes ? fav : cur), blogs[0])

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
