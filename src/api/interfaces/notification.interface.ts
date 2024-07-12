import { Document, HydratedDocument, Model, ObjectId } from 'mongoose';
import { NOTIFICATION } from '../constants/notification.constant';

export interface IRawNotification {
  noti_title: string;
  noti_message: string;
  noti_type: Values<{
    [K in keyof (typeof NOTIFICATION)['TYPE']]: Values<
      (typeof NOTIFICATION)['TYPE'][K]
    >;
  }>;
  noti_senderId: ObjectId;
  noti_receiverId: number;
  noti_options: Object;
}

export interface INotification extends HydratedDocument<IRawNotification> {}

export interface INotificationAttrs {
  title?: IRawNotification['noti_title'];
  message?: IRawNotification['noti_message'];
  type: IRawNotification['noti_type'];
  senderId: string | ObjectId;
  receiverId: number;
  options: IRawNotification['noti_options'];
}

export interface INotificationModel extends Model<INotification> {
  build(attrs: INotificationAttrs): Promise<INotification>;
}
