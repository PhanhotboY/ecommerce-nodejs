import { HydratedDocument, Model } from 'mongoose';
import { TEMPLATE } from '../constants';

export interface IRawTemplate {
  tem_name: string;
  tem_status: Values<typeof TEMPLATE.STATUS>;
  tem_html: string;
}

export type ITemplate = HydratedDocument<IRawTemplate>;

export interface ITemplateAttrs {
  name: string;
  status?: IRawTemplate['tem_status'];
  html: string;
}

export interface ITemplateModel extends Model<ITemplate> {
  build(attrs: ITemplateAttrs): Promise<ITemplate>;
}
