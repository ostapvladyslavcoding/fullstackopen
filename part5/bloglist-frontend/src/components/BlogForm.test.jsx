import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls handler and receives right details when new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const blogTitle = screen.getByPlaceholderText('enter title here')
  const blogAuthor = screen.getByPlaceholderText('enter author here')
  const blogUrl = screen.getByPlaceholderText('enter url here')
  const createButton = screen.getByText('create')

  await user.type(blogTitle, 'test title')
  await user.type(blogAuthor, 'test author')
  await user.type(blogUrl, 'test url')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('test url')
})
