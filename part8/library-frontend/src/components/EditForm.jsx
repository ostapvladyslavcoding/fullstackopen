import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const EditForm = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({ variables: { name, setBornTo: Number(born) } })

    setName('')
    setBorn('')
  }

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.error('person not found')
    }
  }, [result.data])

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>

        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>

        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default EditForm
