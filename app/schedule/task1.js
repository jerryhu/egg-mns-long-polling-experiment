'use strict';

const Subscription = require('egg').Subscription;

class Task1 extends Subscription {
  static get schedule() {
    return {
      type: 'mns',
    };
  }

  async subscribe() {
    this.logger.info('task1任务开始');

    await this.processMessage();
  }

  // 消息处理
  async processMessage() {
    const queueName = 'test-post-reminder-queue';

    try {
      // 获取消息
      const resp = await this.app.alicloudMns.receiveMessage(queueName, 25);
      const data = Buffer.from(resp.body.MessageBody, 'base64').toString('utf8');
      console.log(`data: ${data}`);

      // TODO: 新评论提醒

      // 删除消息
      await this.app.alicloudMns.deleteMessage(queueName, resp.body.ReceiptHandle);
    } catch (err) {
      if (err.name === 'MNSMessageNotExistError') {
        console.log(`没有消息: ${new Date()}`);
      } else {
        console.error(`获取消息出错 ${err.stack}`);
        return;
      }
    }

    // 递归调用: 消息处理
    await this.processMessage();
  }

}

module.exports = Task1;
