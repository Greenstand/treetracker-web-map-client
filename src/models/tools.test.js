import log from 'loglevel';
import * as tools from './tools';

describe('Tools', () => {
  it('scale(...)', () => {
    log.warn(tools.scale('3'));
    log.warn(tools.scale('30'));
    log.warn(tools.scale('300'));
    log.warn(tools.scale('3000'));
    log.warn(tools.scale('30000'));
    log.warn(tools.scale('300000'));
  });

  it('scaleFontSize(...)', () => {
    log.warn(tools.scaleFontSize('3'));
    log.warn(tools.scaleFontSize('30'));
    log.warn(tools.scaleFontSize('300'));
    log.warn(tools.scaleFontSize('3000'));
    log.warn(tools.scaleFontSize('30000'));
    log.warn(tools.scaleFontSize('300000'));
  });
});
