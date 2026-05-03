const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '_diag.out');
fs.writeFileSync(out, 'start\n');
const log = (...a) => fs.appendFileSync(out, a.map(String).join(' ') + '\n');

try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
  log('node:', process.version);
  log('mongo uri set:', !!process.env.MONGO_URI);
  log('jwt set:', !!process.env.JWT_SECRET);
  const mongoose = require('mongoose');
  mongoose
    .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
      log('CONNECTED');
      return mongoose.disconnect();
    })
    .then(() => {
      log('disconnected');
      process.exit(0);
    })
    .catch((err) => {
      log('CONNECT ERROR:', err.name, '|', err.message);
      if (err.reason) log('reason:', JSON.stringify(err.reason).slice(0, 400));
      process.exit(1);
    });
  setTimeout(() => {
    log('hard timeout 15s');
    process.exit(2);
  }, 15000).unref();
} catch (e) {
  log('THROW:', e.message);
  process.exit(3);
}
