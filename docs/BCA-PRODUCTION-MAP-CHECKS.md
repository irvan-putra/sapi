# Checking Rapi's BCA production map against official sources

Each step of [BCA-PRODUCTION-MAP.md](BCA-PRODUCTION-MAP.md) checked against BCA's official pages and the national SNAP standard, all read 23 November 2026. Items marked (unverified) could not be confirmed from public pages and should be confirmed with BCA (api_support@bca.co.id or the PIC after applying).

Sources used:

- BCA product information: https://developer.bca.co.id/id/Informasi-Produk-API
- BCA FAQ: https://developer.bca.co.id/id/FAQ
- BCA SNAP page: https://developer.bca.co.id/id/Pages/HomePage/SNAP-API
- BCA API registration webform (live): https://webform.bca.co.id/api/registrasi-api
- SNAP Technical and Security Standard v1.0.2 (ASPI, the standard BCA's FAQ points to): https://apidevportal.aspi-indonesia.or.id/docs/standar-teknis-keamanan

## Step 1: Apply at the webform — verified

BCA's product information page lists exactly three submission channels: online via https://webform.bca.co.id/api/registrasi-api, through a head-office business PIC, or through a branch. The webform URL is live and titled "REGISTRASI API BCA".

## Step 2: Legal — verified, one detail unverified

- Applicant categories "Individu Bisnis" (Individual Business) or "Badan Usaha/Organisasi" (Business Entity/Organization): verified, stated word for word on the product information page.
- Signing the Cooperation Form and API Terms ("Formulir Kerjasama API BCA" and "Ketentuan Fasilitas API BCA"): verified, same page. The API Terms document is public at bca.co.id.
- Supplying further supporting documents per BCA's requirements: verified, same page.
- The exact document list BCA asks for after review: (unverified), not published.

Note: there is no purely personal (non-business) category. An individual applicant applies as "Individu Bisnis".

## Step 3: Security — verified at the SNAP-standard level

- RSA key pair replaces API key/secret for SNAP APIs; the private key signs requests on the client side and BCA verifies with the public key: verified (BCA FAQ, SNAP section). BCA asks for the public key as an X.509 certificate in .pub form and shows the openssl extraction command.
- Sending BCA the public key through a designated channel: verified in substance. The SNAP standard (section 1.7) says keys are delivered via email or an application the provider supplies. BCA's specific production submission channel: (unverified) from public pages.
- Static outbound IPs for whitelisting: verified. The SNAP standard lists "Informasi whitelist IP" among the technical data required when applying for cooperation (section 1.5), and requires whitelisted IPs on the devices used for SNAP Open API.
- TLS 1.3 for production: verified. The SNAP security standard requires TLS 1.3; the TLS 1.2 fallback it allowed expired 30 June 2026, so TLS 1.3 is now the only option.

## Step 4: Testing — verified

- Building against BCA's technical documents: verified. BCA publishes API documentation at https://developer.bca.co.id/id/Dokumentasi and its FAQ says development follows the technical documents.
- Mandatory Customer Testing with BCA's scenarios and data: verified. BCA's FAQ describes Customer Testing as a self-service functionality test that is a mandatory stage before the API service is implemented, using the data and scenarios in the Customer Testing feature.
- Joint testing with BCA before implementation: verified in substance. The product information page lists "uji coba bersama dengan BCA" (joint testing with BCA) as part of the process. The public pages do not use the word "UAT"; (unverified) as a formal stage name.
- Pass verification, then activation: verified. BCA's FAQ sequence is development, testing, then activation and implementation.

## Step 5: If serving customers, Bank Indonesia SNAP verification — partially verified

- SNAP is Bank Indonesia's national standard (SK Gubernur 23/10/KEP.GBI/2021), and BCA's SNAP APIs follow it: verified (BCA SNAP page).
- Serving consumers triggers a regulatory layer: verified in substance. BCA's SNAP page says SNAP API users are customers holding a PJP (payment service provider) license, or non-PJP using the API for their consumers' interests; the product information page says the API facility can be used for the recipient's own interests and/or consumer interests.
- A specific "Bank Indonesia SNAP verification" step before production access: (unverified) as phrased. BCA's public pages do not name such a step; what applies depends on whether SAPI acts as a PJP or non-PJP, which is a question for BCA during the cooperation process.

## What this means for SAPI

Blocked on the BCA cooperation application (the owner's registration):

- Production credentials (Client ID, Client Secret, partner ID) and registering the production public key with BCA.
- IP whitelisting of SAPI's outbound addresses.
- The Customer Testing feature and joint testing with BCA, which are for approved API customers ("nasabah API BCA").
- Activation and any production use.

Not blocked, can proceed now:

- Sandbox development, which is where SAPI already works: the developer-portal Registered Account is self-serve and free.
- Writing the production-ready code against the public SNAP technical and security standard (TLS 1.3, RSA signatures, headers). The backend's current sandbox flow is already SNAP-based, so the production path is mostly configuration.
- Generating the production RSA key pair locally (same openssl commands as the sandbox pair; production keys just must never be committed).
- The owner's own tasks: preparing the business identity documents and submitting the webform. Submitting the form is a short manual step only the owner can do, and it starts BCA's review.

One more fact worth knowing: BCA charges for production API use per transaction (hit) with a monthly minimum fee. Its worked example uses Rp300 per hit and a Rp500,000 monthly minimum; actual pricing comes from api_support@bca.co.id or Halo BCA Bisnis 1500998.
