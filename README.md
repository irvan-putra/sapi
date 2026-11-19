# sapi

Android app plus a local backend for testing the BCA sandbox balance inquiry. It started as a minimal Hello World app (see git history).

## BCA sandbox test

Uses BCA SNAP OAuth B2B and Banking Balance Inquiry from the BCA Developer API documentation updated 17 March 2025 and Sandbox Guide v1.1, April 2025: https://developer.bca.co.id/en/Dokumentasi

```bash
cd backend
cp env-template.txt .env
openssl rand -hex 32   # save only in TESTER_TOKEN
# Fill BCA sandbox values locally. Never commit or share credentials/private keys.
npm run check
npm start
adb reverse tcp:8787 tcp:8787
```

Build the Android APK as below. Paste only TESTER_TOKEN into the app. BCA success requires responseCode 2001100. The backend is sandbox-only, loopback-only, redacts identity fields, and exposes no transfer endpoint.

For a walkthrough of what the code does and what is untested, see [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md).

## Getting BCA sandbox credentials, step by step

Sandbox only. Do not use real banking credentials, and never commit or share secrets. Steps marked (unverified) are things I could not confirm from BCA's public pages, so check them on the portal.

Source pages: [How to Use](https://developer.bca.co.id/en/Cara-Penggunaan), [Sandbox](https://developer.bca.co.id/en/Sandbox), [API documentation](https://developer.bca.co.id/en/Dokumentasi) (BCA, read 19 Nov 2026).

1. Register or log in on the BCA Developer API website (https://developer.bca.co.id). BCA emails you a registration link; check spam.
2. Create an application under "My Application" and select the API service you want to try (here: Account Information, Balance Inquiry). BCA's page says an application is confirmed after you answer questions about your product, and you then get a Client ID. How long that takes, and whether a personal account is accepted: (unverified).
3. Copy the security key (Client ID and Client Secret) from "My Application" into `BCA_CLIENT_ID` and `BCA_CLIENT_SECRET`. BCA says to keep the secret private and to reset it if exposed.
4. Make an RSA key pair on your computer. The backend signs the token request with the private key, and BCA's docs say the partner sends its public key in X.509 PEM format ("BEGIN PUBLIC KEY"):
   ```bash
   cd backend
   openssl genrsa -out bca-sandbox-private.pem 2048
   openssl rsa -in bca-sandbox-private.pem -pubout -out bca-sandbox-public.pem
   ```
   Keep the private key on your computer. `*.pem` is in `.gitignore`. Key size BCA requires and where to upload the public key in the portal: (unverified).
5. Fill `backend/.env` from `env-template.txt`:
   - `BCA_CLIENT_ID`, `BCA_CLIENT_SECRET`: step 3.
   - `BCA_PRIVATE_KEY_PATH=./bca-sandbox-private.pem`: step 4.
   - `BCA_PARTNER_ID`: BCA's docs call this X-PARTNER-ID, the Corporate ID (max 32 characters). Use the sandbox value shown in BCA's documentation: (unverified which value).
   - `BCA_CHANNEL_ID=95051`: the SNAP Balance Inquiry section lists 95051 (KlikBCA Bisnis). Other sections of the same page list 95411, so confirm for your application.
   - `BCA_SANDBOX_ACCOUNT`: a 10-digit sandbox account number. BCA says sandbox uses dummy static data and the usable values are in the blue boxes of its documentation. Take it from there.
   - `TESTER_TOKEN`: `openssl rand -hex 32`. Paste the same value into the app.
6. Run the backend and the app as described in "BCA sandbox test" above.

### Known mismatches with BCA's current documentation

Found by comparing `backend/server.js` with BCA's SNAP documentation. Not yet fixed or tested, so a balance call may fail until they are:

- `X-EXTERNAL-ID` is listed as a required header (numeric string, max 36 characters, unique within a day). The backend does not send it.
- `X-TIMESTAMP` is documented as ISO 8601 with a timezone offset, 25 characters (for example `2022-04-21T17:34:52+07:00`). The backend sends UTC with `Z`.
- The docs also contain a different, older sandbox flow with other headers. This project follows the SNAP flow only.

## Requirements

- JDK 17
- Android SDK 35
- Gradle 8.9

## Build

```bash
gradle :app:assembleDebug
```

APK output:

```text
app/build/outputs/apk/debug/app-debug.apk
```

Pushing to GitHub also runs the included GitHub Actions workflow and publishes `sapi-debug-apk` as a workflow artifact.

## Credits

Developed with help from Rapi (biks.ai).
