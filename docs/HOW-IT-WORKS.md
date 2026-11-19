# How sapi works

This describes what the code in this repository does, based on reading the source. The code has not been run against BCA, and this is not a security audit.

## Overview

sapi is a BCA sandbox balance-inquiry tester. It is not a banking app. An Android screen calls a small Node backend on your computer, and the backend calls BCA's sandbox API.

```text
Phone app  --GET http://127.0.0.1:8787 (USB, adb reverse)-->  Node backend on your computer
Node backend  --HTTPS-->  https://sandbox.bca.co.id
```

## Android app

Source: `app/src/main/java/com/irvanputra/sapi/MainActivity.java`

- One screen: a token field, a "Check backend" button and a "Test BCA balance" button.
- It sends `GET /health` or `GET /balance` to `http://127.0.0.1:8787` with `Authorization: Bearer <tester token>`. The token must be 64 hex characters.
- It shows the backend's JSON response as text. It stores nothing.
- Cleartext HTTP is allowed only for `127.0.0.1` (`app/src/main/res/xml/network_security_config.xml`). Backup is disabled in the manifest.
- Because `127.0.0.1` on the phone is the phone itself, it only reaches your computer through `adb reverse tcp:8787 tcp:8787` over USB.

## Backend

Source: `backend/server.js` (Node 22 or newer)

- Listens on `127.0.0.1` only. Every request needs the exact tester token (constant-time comparison).
- Allows only `GET /health` and `GET /balance`. There is no transfer or payment route.
- `/health` reports that the backend is reachable. It always says `bankTested: false`.
- `/balance` makes two calls to BCA:
  1. A SNAP OAuth B2B access token request, signed with RSA-SHA256 using your private key file.
  2. A Balance Inquiry request, signed with HMAC-SHA512, using the partner ID, channel ID and sandbox account number from `.env`.
- The response has `accountNo`, `name`, `referenceNo`, `partnerReferenceNo`, token and signature fields replaced with `[redacted]` before it is returned. The backend itself does not log them. Other fields in BCA's response are passed through.
- Limits: one balance call per 2 seconds, 10 second timeouts, responses over 64 KB are refused.
- The base URL is checked at startup: the backend refuses to start unless `BCA_ENV=sandbox` and `BCA_BASE_URL=https://sandbox.bca.co.id`, and the request URL is built from a fixed sandbox address.

## Where data goes

- BCA client ID and secret, the private key, partner ID and account number live in `backend/.env` and a `.pem` file on your computer. Both are in `.gitignore`. Never commit them.
- The only network destination the backend calls is `sandbox.bca.co.id`.
- The phone only ever sees the tester token and the redacted response.

## Limits of the sandbox check

The startup check ties the backend to the sandbox address. It does not stop you from typing real or production credentials into `.env`. Use only sandbox credentials and a sandbox account.

## What is real and what is a placeholder

- Real code: the app screen, the token check, the two BCA request flows and the redaction.
- Placeholders: every value in `backend/env-template.txt` (empty on purpose) and the sandbox account.
- Request headers: the balance call sends `X-EXTERNAL-ID`, and `X-TIMESTAMP` is local time with offset, as BCA's documentation describes. Fixed after reading the docs, tested with fake data only.
- Not verified: the signature format, headers and response codes against BCA's current specification, and any actual call to BCA. A successful result would need `responseCode` `2001100`.

## Test status

- The Android app compiles and the debug APK build passes in GitHub Actions.
- The backend has a syntax check (`npm run check`) and 3 tests (`npm test`) that use fake keys and a fake HTTP function. No BCA calls have been made.

## Setup

See the BCA sandbox test section of the [README](../README.md).
