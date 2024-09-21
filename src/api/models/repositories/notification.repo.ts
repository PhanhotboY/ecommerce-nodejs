import NotificationModel from '../notification.model';
import { Types } from 'mongoose';

import { INotificationAttrs } from '../../interfaces/notification.interface';

const createNotification = async (notification: INotificationAttrs) => {
  return NotificationModel.build(notification);
};

const getNotifications = async (userId: string, type?: string) => {
  const filter = { noti_receiverId: 0, noti_type: type };
  if (!type || type === 'ALL') {
    delete filter['noti_type'];
  }
  return NotificationModel.find(filter, {
    createdAt: 0,
    updatedAt: 0,
    __v: 0,
  });
};

export { createNotification, getNotifications };
