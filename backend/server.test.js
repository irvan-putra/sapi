import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { client, time, externalId } from './server.js';

// Synthetic values only. No real credentials and no network calls.
const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
const cfg = { base: 'https://sandbox.bca.co.id', id: 'test-client', secret: 'test-secret', key: privateKey, partner: '12345', channel: '95051', account: '0123456789' };

test('X-TIMESTAMP is ISO 8601 with a numeric offset, 25 characters', () => {
  for (const d of [new Date(), new Date('2026-01-01T00:00:00Z'), new Date('2026-07-01T12:34:56Z')]) {
    const t = time(d);
    assert.match(t, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    assert.equal(t.length, 25);
    assert.equal(new Date(t).getTime(), Math.floor(d.getTime() / 1000) * 1000);
  }
});

test('X-EXTERNAL-ID is numeric, at most 36 characters, and differs per call', () => {
  const a = externalId(), b = externalId();
  assert.match(a, /^\d+$/);
  assert.ok(a.length <= 36);
  assert.notEqual(a, b);
});

test('balance request sends the required headers and token request stays unchanged', async () => {
  const calls = [];
  const fetcher = async (url, opt) => {
    calls.push({ url, opt });
    const body = url.endsWith('/access-token/b2b') ? { responseCode: '2007300', accessToken: 'fake', expiresIn: '900' } : { responseCode: '2001100' };
    return { ok: true, status: 200, text: async () => JSON.stringify(body) };
  };
  const r = await client(cfg, fetcher).balance();
  assert.equal(r.payload.responseCode, '2001100');
  assert.equal(calls.length, 2);
  const [tok, bal] = calls;
  assert.equal(tok.url, 'https://sandbox.bca.co.id/openapi/v1.0/access-token/b2b');
  assert.match(tok.opt.headers['X-TIMESTAMP'], /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
  assert.equal(bal.url, 'https://sandbox.bca.co.id/openapi/v1.0/balance-inquiry');
  const h = bal.opt.headers;
  assert.match(h['X-EXTERNAL-ID'], /^\d{1,36}$/);
  assert.equal(h['CHANNEL-ID'], '95051');
  assert.equal(h['X-PARTNER-ID'], '12345');
  assert.equal(h.Authorization, 'Bearer fake');
  assert.equal(h['X-TIMESTAMP'].length, 25);
  assert.ok(h['X-SIGNATURE']);
});
