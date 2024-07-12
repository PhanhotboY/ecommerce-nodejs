import fs from 'fs';

import { BadRequestError, InternalServerError } from '../core/errors';
import { cloudinary } from '../../configs/config.cloudinary';

type TMediaCategory = 'product' | 'avatar' | 'system';

export class UploadService {
  static async uploadImage(
    userId: string,
    file?: Express.Multer.File,
    category: TMediaCategory = 'product'
  ) {
    if (!file) {
      throw new BadRequestError('No file uploaded');
    }

    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `${category}/${userId}`,
        format: 'jpg',
        use_filename: true,
      });

      fs.unlinkSync(file.path);

      return {
        image_url: result.secure_url,
        shopId: 'userId',
      };
    } catch (error: any) {
      throw new InternalServerError('Failed to upload image: ' + error.message);
    }
  }

  static async uploadMultipleImages(
    userId: string,
    files?: Express.Multer.File[],
    category: TMediaCategory = 'product'
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestError('No file uploaded');
    }

    console.log(files);

    try {
      const promises = files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: `${category}/${userId}`,
          format: 'jpg',
          use_filename: true,
        })
      );

      const results = await Promise.all(promises);

      files.forEach((file) => fs.unlinkSync(file.path));

      return results.map((result) => ({
        image_url: result.secure_url,
        shopId: 'userId',
      }));
    } catch (error: any) {
      throw new InternalServerError(
        'Failed to upload images: ' + error.message
      );
    }
  }
}
