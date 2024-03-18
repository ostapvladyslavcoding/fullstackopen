import { useNotificationValue } from '../NotificationContext'

export const setNotification = (
  dispatch,
  message,
  type = 'info',
  timer = 5
) => {
  dispatch({
    type: 'SET_NOTIFICATION',
    payload: {
      message,
      type,
    },
  })
  setTimeout(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' })
  }, timer * 1000)
}

const Notification = () => {
  const notification = useNotificationValue()
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    notification && (
      <div
        className={notification.type}
        style={style}
      >
        {notification.message}
      </div>
    )
  )
}
export default Notification
