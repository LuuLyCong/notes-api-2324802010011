const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('./app');

test('GET / trả JSON có host, cpus, memoryGB', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const body = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/`, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
  server.close();
  assert.ok(body.host);
  assert.ok(body.cpus > 0);
  assert.ok(body.memoryGB > 0);
});
