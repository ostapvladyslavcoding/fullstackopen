import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { clearDetails } from '../reducers/userDetailsReducer.js'
import { initializeUsers } from '../reducers/usersReducer.js'

const UserList = () => {
  const users = useSelector((state) => state.users)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(clearDetails())
  }, [dispatch])

  return (
    <>
      <h2>Users</h2>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 250 }}>
          <TableHead sx={{ backgroundColor: 'lightgray' }}>
            <TableRow>
              <TableCell>Names</TableCell>
              <TableCell align='right'>Number of Blogs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...users].map((user) => (
              <TableRow
                key={user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell align='right'>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default UserList
