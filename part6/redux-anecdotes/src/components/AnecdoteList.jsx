import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === '') return anecdotes

    return anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })

  const vote = (id) => {
    dispatch(addVote(id))
    const anecdote = anecdotes.find((anecdote) => anecdote.id === id)
    dispatch(setNotification(`You voted for "${anecdote.content}"!`, 5))
  }

  return (
    <>
      {[...anecdotes]
        .sort((a, b) => {
          return b.votes - a.votes
        })
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </>
  )
}

export default AnecdoteList
