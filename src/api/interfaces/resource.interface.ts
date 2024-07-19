import { HydratedDocument, Model } from 'mongoose';

export interface IRawResource {
  src_name: string;
  src_slug: string;
  src_description: string;
}

export interface IResource extends HydratedDocument<IRawResource> {}

export interface IResourceAttrs {
  name: IRawResource['src_name'];
  slug: IRawResource['src_slug'];
  description: IRawResource['src_description'];
}

export interface IResourceModel extends Model<IResource> {
  build(attrs: IResourceAttrs): Promise<IResource>;
}
