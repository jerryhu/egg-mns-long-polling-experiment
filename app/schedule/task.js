'use strict';

const Subscription = require('egg').Subscription;
let _retryCount = 0;
const MAX_RETRY_COUNT = 100;
const RETRY_INTERVAL = 5; // 5 秒

class SMSTask extends Subscription {
  static get schedule() {
    return {
      type: 'mns',
    };
  }

  async subscribe() {
    this.logger.info('短信执行任务开始');

    const queueName = 'test-sms-queue';

    await this.runTaskInLoop(queueName);
  }

  // 执行任务
  async runTask(queueName) {
    // 获取消息
    const resp = await this.ctx.service.mns.batchReceiveMessage(queueName, 10, 25);
    // 遍历消息列表
    for (const i in resp.body) {
      const message = resp.body[i];
      try {
        // 处理消息
        await this.handleMessage(message);
      } catch (err) {
        this.logger.error('处理消息出错', err);
      }
      // 删除消息
      await this.ctx.service.mns.deleteMessage(queueName, message.ReceiptHandle);
    }
  }

  /**
   * 循环执行任务
   * @param {string} queueName 队列
   */
  async runTaskInLoop(queueName) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        // 执行任务
        await this.runTask(queueName);

        // 重置重试次数为0
        _retryCount = 0;
      } catch (err) {
        if (err.name === 'MNSMessageNotExistError') {
          // 没有消息，继续轮询
          // ctx.logger.info(`没有消息: ${new Date()}`);
        } else {
          // 最大重试次数
          if (_retryCount >= MAX_RETRY_COUNT) {
            // 出错，终止任务，退出循环执行
            this.logger.error(`获取消息出错, 达到最大允许重试次数 ${MAX_RETRY_COUNT}, 任务终止`, err);

            break;
          } else {
            // 出错，重试任务
            this.logger.warn(`获取消息出错, 重试第${_retryCount + 1}次`, err);

            // 增加重试次数
            _retryCount++;

            // 等待x秒
            await new Promise(done => setTimeout(done, RETRY_INTERVAL * 1000));
          }
        }
      }
    }
  }

  /**
   * 处理消息
   * @param  {Object} message MNS消息对象
   */
  async handleMessage(message) {
    const data = Buffer.from(message.MessageBody, 'base64').toString('utf8');
    const dataObj = JSON.parse(data);

    console.log(dataObj);

    // TODO 发送短信验证码
    // await sendSMS(dataObj.mobile, dataObj.code);
  }
}

module.exports = SMSTask;
