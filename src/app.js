const express = require('express');
const os = require('os');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Xin chào từ đám mây!',
    host: os.hostname(),
    platform: `${os.type()} ${os.release()}`,
    cpus: os.cpus().length,
    memoryGB: Number((os.totalmem() / 1024 ** 3).toFixed(1)),
    uptimeSec: Math.round(os.uptime()),
    time: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime_seconds: Math.round(process.uptime()) });
});

app.get('/hello', (req, res) => {
  res.json({
    message: 'Hello Cloud từ TDMU Notes API',
    hostname: os.hostname(),
    time: new Date().toISOString()
  });
});

const notesRouter = require('./routes/notes');
app.use('/notes', notesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const clientError = ['ValidationError', 'CastError'].includes(err.name)
    || err.code === 'LIMIT_FILE_SIZE';
  res.status(clientError ? 400 : 500).json({ error: err.message });
});

module.exports = app;
