import { Schema, model } from 'mongoose';

import {
  INotification,
  INotificationModel,
  IRawNotification,
} from '../interfaces/notification.interface';
import { NOTIFICATION } from '../constants/notification.constant';
import { SHOP } from '../constants';
import { formatAttributeName } from '../utils';

const NotificationSchema = new Schema<INotification, INotificationModel>(
  {
    noti_title: {
      type: String,
      required: true,
    },
    noti_message: {
      type: String,
      required: true,
    },
    noti_type: {
      type: String,
      enum: Object.keys(NOTIFICATION.TYPE).reduce(
        (prev, key) => [
          ...prev,
          ...Object.values(
            NOTIFICATION.TYPE[key as keyof typeof NOTIFICATION.TYPE]
          ),
        ],
        [] as string[]
      ),
      required: true,
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      ref: SHOP.DOCUMENT_NAME,
      required: true,
    },
    noti_receiverId: {
      type: Number,
      required: true,
    },
    noti_options: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: NOTIFICATION.COLLECTION_NAME,
  }
);

NotificationSchema.statics.build = (
  attrs: IRawNotification
): Promise<INotification> => {
  return NotificationModel.create(
    formatAttributeName(attrs, NOTIFICATION.PREFIX)
  );
};

const NotificationModel = model<INotification, INotificationModel>(
  NOTIFICATION.DOCUMENT_NAME,
  NotificationSchema
);

export default NotificationModel;
