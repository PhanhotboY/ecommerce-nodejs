import { Router } from 'express';
import { MailController } from '../../controllers/email.controller';
import { emailVerificationTemplate } from '@utils/email.template';
import { replaceTemplatePlaceholders } from '@utils/index';
const emailRouter = Router();

emailRouter.post('templates', MailController.createTemplate);

emailRouter.get('/templates/verify', (req, res) => {
  res.send(
    replaceTemplatePlaceholders(emailVerificationTemplate(), {
      verifyUrl: 'http://localhost:8080/api/v1/email/verify?token=123456',
    })
  );
});

emailRouter.post('/templates', MailController.createTemplate);

emailRouter.get('/verify', MailController.verifyEmail);

module.exports = emailRouter;
