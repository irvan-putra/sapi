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
