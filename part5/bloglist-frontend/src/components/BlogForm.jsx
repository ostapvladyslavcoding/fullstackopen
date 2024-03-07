const BlogForm = ({
  handleSubmit,
  title,
  handleTitleChange,
  author,
  handleAuthorChange,
  url,
  handleUrlChange,
}) => {
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            value={title}
            onChange={handleTitleChange}
            name='Title'
          />
        </div>
        <div>
          author:
          <input
            value={author}
            onChange={handleAuthorChange}
            name='Author'
          />
        </div>
        <div>
          url:
          <input
            value={url}
            onChange={handleUrlChange}
            name='Url'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default BlogForm
