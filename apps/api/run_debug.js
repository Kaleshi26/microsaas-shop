process.on('exit', (code) => console.log('process.exit event, code=', code));
process.on('beforeExit', (code) => console.log('process.beforeExit', code));
process.on('uncaughtException', (err) => console.error('uncaughtException', err && err.stack ? err.stack : err));
process.on('unhandledRejection', (reason) => console.error('unhandledRejection', reason));

try {
  require('./dist/src/main.js');
  console.log('module required; runtime should run');
} catch (e) {
  console.error('require error', e && e.stack ? e.stack : e);
  process.exit(1);
}
