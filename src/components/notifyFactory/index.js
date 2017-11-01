import notification from '@gag/notification-web';
const openNotificationWithIcon = function (type, title, content) {
  return function () {
    notification[type]({
      message: title,
      description: content,
      duration: 5,
    });
  };
};

export default openNotificationWithIcon;
