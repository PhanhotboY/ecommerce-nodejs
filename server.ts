import { app } from './src/app';

app.listen(process.env.DEV_APP_PORT, () => {
  console.log(
    process.env.NODE_ENV,
    'hello world from port',
    process.env.DEV_APP_PORT
  );
});

app.on('SIGINT', () => {
  console.log('I interrupted');
});
