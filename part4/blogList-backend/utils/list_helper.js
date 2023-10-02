const dummy = () => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((sum, cur) => sum + cur.likes, 0)

module.exports = {
  dummy,
  totalLikes,
}
