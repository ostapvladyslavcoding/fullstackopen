const Notification = ({ info }) => {
  if (!info.message) {
    return
  }

  return <div className={info.type}>{info.message}</div>
}

export default Notification
