# BCA API production map

Source: output from Rapi (biks.ai), forwarded by the repo owner on 23 November 2026. Rapi's own subscription upsell at the end of its message is omitted; it is not part of the map. Rapi cites BCA Developer API product information, FAQ, user guide, and SNAP migration guide.

Each step is checked against BCA's public pages and the national SNAP standard in [BCA-PRODUCTION-MAP-CHECKS.md](BCA-PRODUCTION-MAP-CHECKS.md).

## The map

1. **Apply:** submit an API BCA cooperation request at https://webform.bca.co.id/api/registrasi-api

2. **Legal:** register as an Individual Business or Business Entity/Organization; prepare your business identity, sign BCA's Cooperation Form and API Terms, then supply the supporting documents BCA requests after review.

3. **Security:** prepare the production key pair, send BCA the public key through its designated channel, secure the private key, and provide static outbound IP addresses for whitelisting. Production SNAP connections must use TLS 1.3.

4. **Testing:** build against BCA's technical documents, complete mandatory Customer Testing and joint UAT using BCA's scenarios and credentials, pass verification, then proceed to activation.

5. **If SAPI serves customers:** prepare the applicable Bank Indonesia SNAP verification before production access.
