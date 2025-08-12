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
import { ScannerModals } from '../../components/ScannerModals';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [saving, setSaving] = useState(false);
  const [receiptsCount, setReceiptsCount] = useState(0);
  const [cameraKey, setCameraKey] = useState(0); // Force camera remount
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [pendingReceiptData, setPendingReceiptData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
        // Save the receipt data (handles duplicates and success feedback)
        await saveReceipt(receiptData);
      } else {
        setErrorTitle('Invalid QR Code');
        setErrorMessage('This QR code does not contain valid receipt data.');
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorTitle('Invalid QR Code');
      setErrorMessage('Unable to read QR code data. Please ensure this is a valid receipt QR code.');
      setShowErrorModal(true);
    }
  };

  const saveReceipt = async (receiptData: any) => {
    try {
      const existingReceipts = await AsyncStorage.getItem('scannedReceipts');
      const receipts = existingReceipts ? JSON.parse(existingReceipts) : [];

      // Check if txid already exists in localStorage
      if (receipts.some((receipt: any) => receipt.txid === receiptData.txid)) {
        setPendingReceiptData(receiptData);
        setShowDuplicateModal(true);
        return;
      }

      // If no duplicate, save directly
      await actuallySaveReceipt(receiptData);
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  const actuallySaveReceipt = async (receiptData: any) => {
    setSaving(true);
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

      // Save store name to localStorage if decryption was successful and store name exists
      if (decryptedReceiptData?.store?.name) {
        console.log("Attempting to save store name: " + decryptedReceiptData.store.name);
        await saveStoreName(decryptedReceiptData.store.name);
      } else {
        console.log("No store name found in decrypted receipt data");
      }

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
      
      // Show success modal
      setSuccessMessage('Receipt has been saved successfully!');
      setShowSuccessModal(true);
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
      
      setSuccessMessage('Receipt saved but decryption failed.');
      setShowSuccessModal(true);
    }
    setSaving(false);
  };

  const confirmSaveDuplicate = async () => {
    if (pendingReceiptData) {
      await actuallySaveReceipt(pendingReceiptData);
      setShowDuplicateModal(false);
      setPendingReceiptData(null);
    }
  };

  const cancelSaveDuplicate = () => {
    setShowDuplicateModal(false);
    setPendingReceiptData(null);
    // Resume scanning
    setScanned(false);
    setScanning(true);
  };

  // Modal handler functions
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
  };

  const handleScanAnother = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
    setScanned(false);
    setScanning(true);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorTitle('');
    setErrorMessage('');
  };

  const handleTryAgain = () => {
    setShowErrorModal(false);
    setErrorTitle('');
    setErrorMessage('');
    setScanned(false);
    setScanning(true);
  };

  // Store Names Management
  const saveStoreName = async (storeName: string) => {
    try {
      const existingStores = await AsyncStorage.getItem('storeNames');
      const stores = existingStores ? JSON.parse(existingStores) : [];
      
      // Only add if store name doesn't already exist (case-insensitive)
      const storeExists = stores.some((store: string) => 
        store.toLowerCase() === storeName.toLowerCase()
      );
      
      if (!storeExists) {
        stores.push(storeName);
        // Sort alphabetically for better organization
        stores.sort((a: string, b: string) => a.localeCompare(b));
        await AsyncStorage.setItem('storeNames', JSON.stringify(stores));
        console.log('Store name saved:', storeName);
      } else {
        console.log('Store name already exists:', storeName);
      }
    } catch (error) {
      console.error('Error saving store name:', error);
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

      {/* All Scanner Modals */}
      <ScannerModals
        showDuplicateModal={showDuplicateModal}
        pendingReceiptData={pendingReceiptData}
        saving={saving}
        onConfirmSaveDuplicate={confirmSaveDuplicate}
        onCancelSaveDuplicate={cancelSaveDuplicate}
        showSuccessModal={showSuccessModal}
        successMessage={successMessage}
        onCloseSuccessModal={handleCloseSuccessModal}
        onScanAnother={handleScanAnother}
        showErrorModal={showErrorModal}
        errorTitle={errorTitle}
        errorMessage={errorMessage}
        onCloseErrorModal={handleCloseErrorModal}
        onTryAgain={handleTryAgain}
      />
    </View>
  );
}


