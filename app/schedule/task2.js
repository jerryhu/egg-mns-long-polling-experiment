'use strict';

module.exports = {
  schedule: {
    type: 'mns',
  },
  async task(ctx, message) {
    console.log(`task2: ${message}`);

    const condition = true;
    while (condition) {
      try {
        // 获取消息
        const resp = await ctx.app.alicloudMns.receiveMessage('test-sms-queue', 5);
        const data = Buffer.from(resp.body.MessageBody, 'base64').toString('utf8');
        console.log(`task2: data: ${data}`);

        // TODO: 发送短信

        // 删除消息
        await ctx.app.alicloudMns.deleteMessage('test-sms-queue', resp.body.ReceiptHandle);
      } catch (err) {
        if (err.name === 'MNSMessageNotExistError') {
          console.log(`task2: 没有消息: ${new Date()}`);
          continue;
        }

        console.error(`task2: 获取消息出错 ${err.stack}`);
        break;
      }
    }

  },
}
;
