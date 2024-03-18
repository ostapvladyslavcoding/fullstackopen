import { useNotificationValue } from '../NotificationContext'

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
