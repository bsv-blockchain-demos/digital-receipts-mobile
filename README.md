# 📱 Digital Receipts Mobile App

**Reduce paper waste with blockchain-powered digital receipts**

A React Native mobile application that enables users to scan QR codes containing BSV blockchain-backed digital receipts, helping reduce environmental impact by eliminating paper receipts.

## 🌱 Environmental Impact

This app addresses the growing environmental concern of paper receipt waste:
- **7 billion trees** are cut down annually for paper receipts
- **250 million gallons** of oil are used in receipt production
- **10 billion gallons** of water are consumed in the process
- Most receipts contain **BPA chemicals** and cannot be recycled

By digitizing receipts on the BSV blockchain, we create a sustainable, permanent, and easily accessible solution.

## ✨ Features

- **🔍 QR Code Scanning**: Instantly scan QR codes to capture digital receipts
- **⛓️ BSV Blockchain Integration**: Receipts are stored securely on the BSV blockchain
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **💾 Local Storage**: Receipts are cached locally for offline access
- **🔒 Secure**: Cryptographic verification ensures receipt authenticity
- **🌐 Decentralized**: No central server dependency for receipt storage
- **♻️ Eco-Friendly**: Eliminates paper waste and reduces environmental footprint

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Blockchain**: BSV (Bitcoin Satoshi Vision)
- **Navigation**: Expo Router with file-based routing
- **Camera**: Expo Camera & Barcode Scanner
- **Storage**: AsyncStorage for local data persistence
- **Styling**: React Native StyleSheet with custom themes

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd receipts-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web
   - Scan QR code with Expo Go app on your device

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

## 📱 How It Works

1. **Scan QR Code**: Use the in-app camera to scan a QR code containing receipt data
2. **Blockchain Verification**: The app verifies the receipt data against the BSV blockchain
3. **Local Storage**: Verified receipts are stored locally for quick access
4. **View & Manage**: Browse your digital receipts in an organized interface

## 🏗️ Project Structure

```
receipts-mobile/
├── app/                    # Main application screens (file-based routing)
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── index.tsx      # Home/Receipts screen
│   │   └── explore.tsx    # Explore/Scanner screen
│   └── _layout.tsx        # Root layout component
├── components/            # Reusable UI components
│   ├── modals/           # Modal components
│   └── ui/               # UI utility components
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
│   ├── decryption.ts     # Cryptographic utilities
│   └── keyConversion.ts  # Key format conversion
├── styles/               # Style definitions
└── constants/            # App constants and configuration
```

## 🔧 Key Dependencies

- **@bsv/sdk**: BSV blockchain integration
- **expo-barcode-scanner**: QR code scanning functionality
- **expo-camera**: Camera access for scanning
- **@react-native-async-storage/async-storage**: Local data persistence
- **expo-router**: File-based navigation system

## 🌐 BSV Blockchain Integration

This app leverages the BSV blockchain for:
- **Immutable Storage**: Receipts are permanently stored on-chain
- **Verification**: Cryptographic proof of receipt authenticity
- **Decentralization**: No reliance on centralized databases
- **Scalability**: BSV's high throughput supports millions of transactions
- **Cost-Effective**: Low transaction fees make micro-transactions viable

## 🧪 Development

### File-Based Routing

This project uses Expo Router's file-based routing system. Routes are automatically generated based on the file structure in the `app/` directory.

**Join us in creating a more sustainable future, one digital receipt at a time! 🌍**
