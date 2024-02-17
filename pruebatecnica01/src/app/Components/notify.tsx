import { Descriptions, notification } from 'antd';
import { ReactNode, useState } from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'open';

let isNotificationVisible = false;

const openNotification = <T extends ReactNode>(
  type: NotificationType,
  message: string,
  duration: number = 3,
  description?: T
): void => {
  if (isNotificationVisible) {
    return; // Evitar mostrar otra notificación si ya hay una visible
  }

  isNotificationVisible = true;

  notification[type]({
    message: (
      <div style={{ width: 'max-content' }} className={`fs-7 ${type == 'error' ? 'text-white' : 'text-black'}`}>
        {message}
      </div>
    ),
    description,
    duration,
    onClose: () => {
      isNotificationVisible = false;
    },
  });
};

export default openNotification;
