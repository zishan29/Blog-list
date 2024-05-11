const Notification = ({ type, message }) => {
  if (message === null || type === null) {
    return null;
  }

  return <div className={type}>{message}</div>;
};

export default Notification;
