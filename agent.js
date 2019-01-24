'use strict';

module.exports = agent => {
  // agent.messenger.on('egg-ready', () => {
  //   agent.alicloudMns.subscribe('task');
  // });

  class MNSStrategy extends agent.ScheduleStrategy {
    start() {
      this.sendOne('start');
    }
  }
  agent.schedule.use('mns', MNSStrategy);
};
