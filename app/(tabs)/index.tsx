import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, AppState } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getTransactionByID } from '../../hooks/getTransactionByID';
import { SymmetricKey } from '@bsv/sdk';
import { scannerStyles as styles } from '../../styles/scannerStyles';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [receiptsCount, setReceiptsCount] = useState(0);
  const [cameraKey, setCameraKey] = useState(0); // Force camera remount
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    getCameraPermissions();
    loadReceiptsCount();

    // Handle app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Handle screen focus to reset camera state
  useFocusEffect(
    React.useCallback(() => {
      // Reset camera when screen comes into focus
      resetCameraState();
      return () => {
        // Cleanup when screen loses focus
        setScanning(false);
      };
    }, [])
  );

  const handleAppStateChange = (nextAppState: any) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App has come to the foreground - reset camera
      resetCameraState();
    }
    appState.current = nextAppState;
  };

  const resetCameraState = () => {
    setScanned(false);
    setScanning(true);
    setCameraKey(prev => prev + 1); // Force camera remount
  };

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const loadReceiptsCount = async () => {
    try {
      const receipts = await AsyncStorage.getItem('scannedReceipts');
      if (receipts) {
        const parsedReceipts = JSON.parse(receipts);
        setReceiptsCount(parsedReceipts.length);
      }
    } catch (error) {
      console.error('Error loading receipts count:', error);
    }
  };

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;

    setScanned(true);
    setScanning(false);

    try {
      // Parse the QR code data (expecting JSON with txid, symkeyString, timestamp)
      const receiptData = JSON.parse(data);

      if (receiptData.txid && receiptData.symkeyString && receiptData.timestamp) {
        // Save the receipt data
        await saveReceipt(receiptData);

        Alert.alert(
          '🎉 Receipt Scanned!',
          `Successfully saved digital receipt\n\nTransaction ID: ${receiptData.txid.substring(0, 8)}...\nTimestamp: ${new Date(receiptData.timestamp).toLocaleDateString()}`,
          [
            {
              text: 'Scan Another',
              onPress: () => {
                setScanned(false);
                setScanning(true);
              }
            },
            {
              text: 'View Receipts',
              onPress: () => {
                // Navigate to receipts tab (will be implemented)
                console.log('Navigate to receipts');
              }
            }
          ]
        );
      } else {
        Alert.alert(
          '❌ Invalid QR Code',
          'This QR code does not contain valid receipt data.',
          [{ text: 'Try Again', onPress: () => { setScanned(false); setScanning(true); } }]
        );
      }
    } catch (error) {
      Alert.alert(
        '❌ Invalid QR Code',
        'Unable to read QR code data. Please ensure this is a valid receipt QR code.',
        [{ text: 'Try Again', onPress: () => { setScanned(false); setScanning(true); } }]
      );
    }
  };

  const saveReceipt = async (receiptData: any) => {
    try {
      const existingReceipts = await AsyncStorage.getItem('scannedReceipts');
      const receipts = existingReceipts ? JSON.parse(existingReceipts) : [];

      // Get full tx from Overlay to get the actual receipt data back
      const fullTx = await getTransactionByID(receiptData.txid);
      console.log(fullTx);
      const output = fullTx?.outputs[0];
      let encryptedReceiptData: number[] = [];

      if (output && 'lockingScript' in output) {
        const lockingScript = output.lockingScript;
        // @ts-expect-error chunks exists at runtime
        encryptedReceiptData = lockingScript?.chunks[1]?.data as number[];
      }

      const key = new SymmetricKey(hexToBytes(receiptData.symkeyString));
      const decryptedReceiptData = decryptJSON(encryptedReceiptData, key);

      // Add timestamp for when it was scanned and include decrypted data
      const newReceipt = {
        ...receiptData,
        scannedAt: new Date().toISOString(),
        id: Date.now().toString(), // Simple ID generation
        fullReceiptData: decryptedReceiptData // Store the decrypted receipt data
      };

      receipts.push(newReceipt);
      await AsyncStorage.setItem('scannedReceipts', JSON.stringify(receipts));
      setReceiptsCount(receipts.length);
    } catch (error) {
      console.error('Error saving receipt:', error);
      // If decryption fails, still save the basic receipt data
      const existingReceipts = await AsyncStorage.getItem('scannedReceipts');
      const receipts = existingReceipts ? JSON.parse(existingReceipts) : [];

      const newReceipt = {
        ...receiptData,
        scannedAt: new Date().toISOString(),
        id: Date.now().toString(),
        fullReceiptData: null // Mark as failed to decrypt
      };

      receipts.push(newReceipt);
      await AsyncStorage.setItem('scannedReceipts', JSON.stringify(receipts));
      setReceiptsCount(receipts.length);
    }
  };

  // Helper function to convert hex string to byte array
  function hexToBytes(hex: string): number[] {
    const bytes = []
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16))
    }
    return bytes
  }

  function decryptJSON(encryptedData: number[], key: SymmetricKey) {
    const jsonString = key.decrypt(encryptedData, 'utf8') as string;
    return JSON.parse(jsonString);
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={getCameraPermissions}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="qr-code" size={24} color="#a855f7" />
            </View>
            <View>
              <Text style={styles.headerTitle}>QR Scanner</Text>
              <Text style={styles.headerSubtitle}>{receiptsCount} saved receipts</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Scanner Card */}
        <View style={styles.scannerCardContainer}>
          <BlurView intensity={20} style={styles.scannerCard}>
            {/* Camera View */}
            <View style={styles.cameraContainer}>
              {scanning && hasPermission && (
                <CameraView
                  key={cameraKey}
                  style={styles.camera}
                  facing="back"
                  onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                  }}
                />
              )}
              
              {/* Camera inactive state */}
              {(!scanning || !hasPermission) && (
                <View style={styles.cameraInactive}>
                  <Ionicons name="camera-outline" size={48} color="#64748b" />
                  <Text style={styles.cameraInactiveText}>
                    {!hasPermission ? 'Camera permission required' : 'Camera inactive'}
                  </Text>
                </View>
              )}
              
              {/* Scanning Overlay */}
              <View style={styles.overlay}>
                <View style={styles.scanArea}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>
            </View>
          </BlurView>

          {/* Instruction Text */}
          <Text style={styles.instructionText}>
            {scanning ? 'Point camera at receipt QR code' : 'Processing...'}
          </Text>
        </View>
      </View>

      {/* Bottom Action Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, (!scanning && !scanned) && styles.actionButtonDisabled]}
          onPress={() => {
            if (!scanning || scanned) {
              resetCameraState();
            }
          }}
          disabled={false}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={scanning ? ['#10b981', '#059669'] : ['#6b7280', '#4b5563']}
            style={styles.actionButtonGradient}
          >
            <View style={styles.actionButtonIcon}>
              <Ionicons name="qr-code" size={20} color="white" />
            </View>
            <Text style={styles.actionButtonText}>
              {scanning && !scanned ? 'Scanning...' : 'Start Scanning'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}


