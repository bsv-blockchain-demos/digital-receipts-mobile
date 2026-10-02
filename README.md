# Digital Receipts Mobile

An Expo and React Native companion to [Digital Receipts POS](https://github.com/bsv-blockchain-demos/digital-receipts-pos). It scans receipt QR codes, retrieves transaction data from a BSV overlay, attempts local decryption and stores receipts on the device for later viewing.

**Current limitation:** the receipt parser does not match the companion POS transaction format. The app can save QR metadata while retrieval or decryption fails. Resolve the parsing issues below before relying on a complete receipt demonstration.

## Receipt flow

1. The POS app creates an encrypted receipt transaction and displays a QR code containing `txid`, `timestamp` and `symkeyString`.
2. The mobile app reads that JSON through `expo-camera`.
3. It queries the `ls_anytx` service at `https://overlay-us-1.bsvb.tech` and parses the returned BEEF transaction.
4. It attempts to extract and decrypt the receipt using the symmetric key in the QR code.
5. It saves the QR fields, scan time and any decrypted receipt in AsyncStorage. The receipts screen supports viewing, store filtering, deletion and retrying failed retrievals.

The QR code contains the decryption key. Anyone with a copy of that code can attempt to read the corresponding receipt. Saved keys and decrypted receipt data use ordinary AsyncStorage, and the current code logs decryption material and receipt content. Use non-sensitive sample receipts.

## Run locally

Use Node.js 22 and npm. The project currently targets Expo SDK 53, React Native 0.79 and React 19. A device or development client must support that SDK version; compatibility with an arbitrary current Expo Go installation is not guaranteed.

```sh
git clone https://github.com/bsv-blockchain-demos/digital-receipts-mobile.git
cd digital-receipts-mobile
npm ci
npm start
```

Follow the Expo terminal instructions to open a compatible device or simulator. Camera scanning needs camera permission and suitable camera hardware. Native iOS development needs macOS and Xcode; Android development needs the Android SDK and a device or emulator.

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server. |
| `npm run android` | Generate/build the native Android project and run it locally. |
| `npm run ios` | Generate/build the native iOS project and run it locally. |
| `npm run web` | Start the web development target. |
| `npx expo export --platform web` | Export the static web target to `dist/`. |
| `npx tsc --noEmit` | Check TypeScript. |
| `npm run lint` | Run Expo's ESLint command. |

No application environment variables or connected BSV wallet are required by the mobile reader. Transaction retrieval requires internet access and the configured overlay. Previously decrypted receipts can be viewed from local storage; a saved entry with no decrypted data still needs successful retrieval.

## Current integration gaps

- The scanner and retry code read `chunk.data` from the `OP_RETURN` opcode. In the POS format, the encrypted payload is held in a separate data-push chunk after that opcode.
- [utils/decryption.ts](utils/decryption.ts) also removes three bytes from the supplied ciphertext before decrypting, although the POS encryptor does not add that prefix to the ciphertext.
- On failure, the scanner still saves the QR fields with `fullReceiptData: null`. A saved entry therefore does not establish successful decryption or receipt authenticity.
- The reader does not independently verify a merchant identity or receipt signature. The overlay is an external retrieval dependency.
- The paper and carbon figures displayed in the interface are fixed demo values. This repository provides no methodology supporting environmental savings claims.

A web export or type-check cannot validate camera access, native behaviour or interoperability with a live POS receipt.

## Native distribution

[eas.json](eas.json) defines development, preview and production build profiles. `npm run build:ios` and `npm run build:android` invoke `eas`, which is not included in the package dependencies. They require an available EAS CLI, Expo account access and platform credentials.

[app.json](app.json) includes the existing Expo owner, project ID and native application identifiers. Review those settings before building a separate distribution. The `reset-project` script refers to a missing `scripts/reset-project.js` and is currently unusable.

## Code map

- [app/(tabs)/index.tsx](app/%28tabs%29/index.tsx): scanner, QR parsing and initial receipt storage.
- [app/(tabs)/explore.tsx](app/%28tabs%29/explore.tsx): saved receipts, filtering and detail views.
- [hooks/getTransactionByID.ts](hooks/getTransactionByID.ts): overlay endpoint and transaction retrieval.
- [hooks/saveReceiptRetry.ts](hooks/saveReceiptRetry.ts): retry handling.
- [utils/decryption.ts](utils/decryption.ts): receipt decryption.

## Licence

**Open BSV Licence v6.** See [LICENSE.txt](LICENSE.txt) for the full terms. The licence applies to this project's original code and documentation and restricts use to the BSV blockchain defined in the licence. Third-party code, assets and referenced standards retain their respective terms.
