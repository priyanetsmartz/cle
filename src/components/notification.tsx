import notification from './feedback/notification';

const createNotification = (type, message, description, style = "") => {
  notification[type]({
    message,
    description,
    style: {
      zIndex: 99999
    }
  });
};
export default createNotification;
