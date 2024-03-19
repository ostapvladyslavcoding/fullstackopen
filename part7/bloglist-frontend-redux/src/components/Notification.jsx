import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      {notification && (
        <Alert
          severity={notification.type}
          style={style}
        >
          {notification.message}
        </Alert>
      )}
    </div>
  )
}

export default Notification
