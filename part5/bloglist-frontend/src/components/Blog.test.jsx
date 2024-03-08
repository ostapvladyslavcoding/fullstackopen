import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('<Blog /> displays blog title and author but not its URL or likes', () => {
  const blog = {
    title: 'blogTitle',
    author: 'blogAuthor',
    url: 'blogUrl',
    likes: 12,
    user: {
      _id: '0000',
      username: 'olad',
      name: 'Olad Oladikovich',
    },
  }
  const updateLikes = vi.fn()
  const deleteBlog = vi.fn()
  const currentUser = '0000'

  const { container } = render(
    <Blog
      blog={blog}
      updateLikes={updateLikes}
      deleteBlog={deleteBlog}
      currentUser={currentUser}
    />
  )

  const blogTitle = screen.getByText('blogTitle', { exact: false })
  screen.debug(blogTitle)
  expect(blogTitle).toBeDefined()
  const blogAuthor = screen.getByText('blogAuthor', { exact: false })
  expect(blogAuthor).toBeDefined()

  const blogUrl = container.querySelector('.togglableContent')
  expect(blogUrl).toHaveStyle('display: none')
  const blogLikes = container.querySelector('.togglableContent')
  expect(blogLikes).toHaveStyle('display: none')
})
