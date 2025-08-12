import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [receiptsCount, setReceiptsCount] = useState(0);

  useEffect(() => {
    getCameraPermissions();
    loadReceiptsCount();
  }, []);

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
      
      // Add timestamp for when it was scanned
      const newReceipt = {
        ...receiptData,
        scannedAt: new Date().toISOString(),
        id: Date.now().toString() // Simple ID generation
      };
      
      receipts.push(newReceipt);
      await AsyncStorage.setItem('scannedReceipts', JSON.stringify(receipts));
      setReceiptsCount(receipts.length);
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

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
      <BlurView intensity={80} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Digital Receipts</Text>
          <View style={styles.headerStats}>
            <Ionicons name="receipt" size={16} color="#a855f7" />
            <Text style={styles.headerStatsText}>{receiptsCount} saved</Text>
          </View>
        </View>
      </BlurView>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {scanning && (
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
        )}
        
        {/* Scanning Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={styles.instructionText}>
            {scanning ? 'Point camera at receipt QR code' : 'Processing...'}
          </Text>
        </View>
      </View>

      {/* Bottom Actions */}
      <BlurView intensity={80} style={styles.bottomActions}>
        <TouchableOpacity 
          style={[styles.actionButton, !scanning && styles.actionButtonDisabled]}
          onPress={() => {
            setScanned(false);
            setScanning(true);
          }}
          disabled={!scanning && !scanned}
        >
          <LinearGradient
            colors={scanning ? ['#10b981', '#059669'] : ['#6b7280', '#4b5563']}
            style={styles.actionButtonGradient}
          >
            <Ionicons name="scan" size={24} color="white" />
            <Text style={styles.actionButtonText}>
              {scanning ? 'Scanning...' : 'Scan Again'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800/80
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerStatsText: {
    color: '#a855f7', // purple-500
    fontSize: 14,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#a855f7', // purple-500
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    borderRadius: 12,
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'rgba(30, 41, 59, 0.8)', // slate-800/80
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
