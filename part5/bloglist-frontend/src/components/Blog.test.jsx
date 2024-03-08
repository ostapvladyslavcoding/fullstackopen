import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
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

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
        currentUser={currentUser}
      />
    ).container
  })

  test('displays blog title and author but not its URL or likes', () => {
    const blogTitle = screen.getByText('blogTitle', { exact: false })
    expect(blogTitle).toBeDefined()
    const blogAuthor = screen.getByText('blogAuthor', { exact: false })
    expect(blogAuthor).toBeDefined()

    const blogUrl = container.querySelector('.togglableContent')
    expect(blogUrl).toHaveStyle('display: none')
    const blogLikes = container.querySelector('.togglableContent')
    expect(blogLikes).toHaveStyle('display: none')
  })

  test('displays blog URL and likes when button has been clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const blogUrl = container.querySelector('.togglableContent')
    expect(blogUrl).not.toHaveStyle('display: none')
    const blogLikes = container.querySelector('.togglableContent')
    expect(blogLikes).not.toHaveStyle('display: none')
  })

  test('if the like button is clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(updateLikes.mock.calls).toHaveLength(2)
  })
})
