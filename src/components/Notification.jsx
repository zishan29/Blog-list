import PropTypes from "prop-types";

const Notification = ({ type, message }) => {
  if (message === null || type === null) {
    return null;
  }

  return <div className={type}>{message}</div>;
};

Notification.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Notification;
