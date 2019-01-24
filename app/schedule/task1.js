'use strict';

module.exports = {
  schedule: {
    type: 'mns',
  },
  async task(ctx, message) {
    console.log(`task1: ${message}`);

    const condition = true;
    while (condition) {
      try {
        // 获取消息
        const resp = await ctx.app.alicloudMns.receiveMessage('test-post-reminder-queue', 25);
        const data = Buffer.from(resp.body.MessageBody, 'base64').toString('utf8');
        console.log(`data: ${data}`);

        // TODO: 新评论提醒

        // 删除消息
        await ctx.app.alicloudMns.deleteMessage('test-post-reminder-queue', resp.body.ReceiptHandle);
      } catch (err) {
        if (err.name === 'MNSMessageNotExistError') {
          console.log(`没有消息: ${new Date()}`);
          continue;
        }

        console.error(`获取消息出错 ${err.stack}`);
        break;
      }
    }

  },
}
;
