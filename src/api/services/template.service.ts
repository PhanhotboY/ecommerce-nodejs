import { emailVerificationTemplate } from '@utils/email.template';
import { TemplateModel } from '../models/template.model';
import { TEMPLATE } from '../constants';

const createTemplate = async ({ name, html }: { name: string; html: string }) => {
  return await TemplateModel.build({ name: TEMPLATE.NAME.VERIFY_EMAIL, html: emailVerificationTemplate() });
};

const getTemplate = async (name: string) => {
  return await TemplateModel.findOne({ tem_name: name });
};

export { createTemplate, getTemplate };
