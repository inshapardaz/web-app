import { notification } from 'antd';

const openNotificationWithIcon = (type, title, message) => {
  notification[type]({
    message: title,
    description: message,
  });
};


export function success(title, message){
  openNotificationWithIcon('success', title, message)
}

export function error(title, message){
  openNotificationWithIcon('error', title, message)
}

export function warning(title, message){
  openNotificationWithIcon('warning', title, message)
}

export function info(title, message){
  openNotificationWithIcon('info', title, message)
}
