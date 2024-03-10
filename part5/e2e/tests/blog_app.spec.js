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

    describe('and a blog exists', () => {
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
    })
  })
})
