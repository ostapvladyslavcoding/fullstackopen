const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test Name',
        username: 'test',
        password: 'test',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test', 'test')
      await expect(page.getByText('Test Name logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'test', 'wrong')
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Test Name logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'test')
    })
    test('a new blog can be created', async ({ page }) => {
      createBlog(page, 'newTitle', 'newAuthor', 'newURL')
      await expect(page.getByText('newTitle newAuthor')).toBeVisible()
    })

    describe('and a blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'firstTitle', 'firstAuthor', 'firstURL')
        await createBlog(page, 'secondTitle', 'secondAuthor', 'secondURL')
        await createBlog(page, 'thirdTitle', 'thirdAuthor', 'thirdURL')
      })

      test('a blog can be edited', async ({ page }) => {
        await page
          .locator('div')
          .filter({
            hasText: /^secondTitle secondAuthorViewHidesecondURLlikes: 0 like$/,
          })
          .getByRole('button')
          .click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 1 like')).toBeVisible()
      })

      test('creator of the blog can delete it', async ({ page }) => {
        await page.getByText('thirdTitle thirdAuthor').waitFor()
        await page.goto('/')
        await page.getByText('thirdTitle thirdAuthor').waitFor()

        const divToDelete = await page.getByText(
          'firstTitle firstAuthorViewHidefirstURLlikes: 0 like'
        )
        divToDelete.getByRole('button').click()

        page.on('dialog', (dialog) => dialog.accept())
        await page.getByRole('button', { name: 'delete' }).click()

        await expect(divToDelete).not.toBeVisible()
      })

      test('only creator of a blog can see blog delete button', async ({
        page,
        request,
      }) => {
        await request.post('/api/users', {
          data: {
            name: 'Another User',
            username: 'anotheruser',
            password: 'test',
          },
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'anotheruser', 'test')

        const div = await page.locator('div').filter({
          hasText: /^secondTitle secondAuthorViewHidesecondURLlikes: 0 like$/,
        })
        await div.getByRole('button').click()
        await expect(
          div.getByRole('button', { name: 'delete' })
        ).not.toBeVisible()
      })

      describe('when several blogs have likes already set', () => {
        beforeEach(async ({ page, request }) => {
          const token = await page.evaluate(() => {
            const loggedUserJSON = window.localStorage.getItem(
              'loggedBloglistappUser'
            )
            if (loggedUserJSON) {
              return JSON.parse(loggedUserJSON).token
            }
          })
          await request.post('/api/blogs', {
            data: {
              title: 'HIGHEST_BLOG',
              author: 'HIGHEST_AUTHOR',
              url: 'HIGHEST_URL',
              likes: 4,
            },
            headers: {
              authorization: `Bearer ${token}`,
            },
          })

          await request.post('/api/blogs', {
            data: {
              title: 'NEXT_BLOG',
              author: 'NEXT_AUTHOR',
              url: 'NEXT_URL',
              likes: 4,
            },
            headers: {
              authorization: `Bearer ${token}`,
            },
          })
        })

        test('blogs are sorted by number of likes', async ({ page }) => {
          await page.goto('/')
          await expect(
            page
              .getByTestId('parent')
              .getByTitle('blog')
              .first()
              .getByText('HIGHEST_BLOG HIGHEST_AUTHOR')
          ).toBeVisible()

          await expect(
            page
              .getByTestId('parent')
              .getByTitle('blog')
              .nth(1)
              .getByText('NEXT_BLOG NEXT_AUTHOR')
          ).toBeVisible()

          await page
            .getByTestId('parent')
            .locator('div')
            .filter({ hasText: 'NEXT_BLOG' })
            .getByRole('button')
            .click()

          await page.getByRole('button', { name: 'like' }).click()

          await expect(
            page
              .getByTestId('parent')
              .getByTitle('blog')
              .first()
              .getByText('NEXT_BLOG NEXT_AUTHOR')
          ).toBeVisible()
        })
      })
    })
  })
})
