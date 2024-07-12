import { NOTIFICATION } from '../constants/notification.constant';
import { INotificationAttrs } from '../interfaces/notification.interface';
import {
  createNotification,
  getNotifications,
} from '../models/repositories/notification.repo';

export class NotificationService {
  static async pushNotification(noti: INotificationAttrs) {
    let title = '',
      message = '';
    // Push notification to receiver
    if (noti.type === NOTIFICATION.TYPE.PRODUCT.NEW) {
      title = 'New product';
      message = '@@@ added a new product: ###';
    }
    if (noti.type === NOTIFICATION.TYPE.PRODUCT.DISCOUNT) {
      title = 'Product discount';
      message = '@@@ has a discount for product: ###';
    }
    console.log('create notification: ', { ...noti, title, message });

    const newNoti = await createNotification({
      ...noti,
      title,
      message,
    });

    return newNoti;
  }

  static async getNotifications(userId: string, type: string = 'ALL') {
    return getNotifications(userId, type === 'ALL' ? undefined : type);
  }
}
