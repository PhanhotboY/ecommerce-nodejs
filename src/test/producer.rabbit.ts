import amqp from 'amqplib';

const sendNotification = async () => {
  try {
    const connection = await amqp.connect('amqp://admin:hi@localhost:5672');
    const channel = await connection.createChannel();

    const msg = process.argv.slice(2).join(' ') || 'Hello World!';
    const notiQueue = 'notification';
    const notiExchangeDLX = 'notification-exchange-dlx';
    const notiRoutingKeyDLX = 'notification-routing-key-dlx';

    const result = await channel.assertQueue(notiQueue, {
      deadLetterExchange: notiExchangeDLX,
      deadLetterRoutingKey: notiRoutingKeyDLX,
      exclusive: false,
    });

    // await channel.sendToQueue(result.queue, Buffer.from(msg), {
    //   persistent: true,
    //   expiration: '5000',
    // });

    for (let i = 0; i < 10; i++) {
      console.log('[x] Sending message ', i);
      await channel.sendToQueue(result.queue, Buffer.from(`message ${i}`), {
        persistent: true,
      });
    }

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

sendNotification();
