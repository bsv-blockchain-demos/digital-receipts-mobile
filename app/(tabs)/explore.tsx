import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { receiptsStyles as styles } from '../../styles/receiptsStyles';

interface Receipt {
  id: string;
  txid: string;
  symkeyString: string;
  timestamp: string;
  scannedAt: string;
  fullReceiptData?: any; // The decrypted receipt data from blockchain
}

export default function ReceiptsScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadReceipts();
    }, [])
  );

  const loadReceipts = async () => {
    try {
      const storedReceipts = await AsyncStorage.getItem('scannedReceipts');
      if (storedReceipts) {
        const parsedReceipts = JSON.parse(storedReceipts);
        // Sort by scanned date (newest first)
        const sortedReceipts = parsedReceipts.sort((a: Receipt, b: Receipt) =>
          new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
        );
        setReceipts(sortedReceipts);
      }
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReceipts();
  };

  const deleteReceipt = (id: string) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedReceipts = receipts.filter(receipt => receipt.id !== id);
              await AsyncStorage.setItem('scannedReceipts', JSON.stringify(updatedReceipts));
              setReceipts(updatedReceipts);
            } catch (error) {
              console.error('Error deleting receipt:', error);
            }
          }
        }
      ]
    );
  };

  const clearAllReceipts = () => {
    Alert.alert(
      'Clear All Receipts',
      'Are you sure you want to delete all receipts? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('scannedReceipts');
              setReceipts([]);
            } catch (error) {
              console.error('Error clearing receipts:', error);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderReceiptItem = ({ item }: { item: Receipt }) => (
    <TouchableOpacity
      style={styles.receiptCard}
      onPress={() => {
        setSelectedReceipt(item);
        setShowReceiptModal(true);
      }}
      activeOpacity={0.8}
    >
      <BlurView intensity={20} style={styles.receiptCardBlur}>
        <View style={styles.receiptHeader}>
          <View style={styles.receiptIcon}>
            <Ionicons name="receipt" size={20} color="#a855f7" />
          </View>
          <View style={styles.receiptInfo}>
            <Text style={styles.receiptTitle}>Digital Receipt</Text>
            <Text style={styles.receiptDate}>Scanned: {formatDate(item.scannedAt)}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteReceipt(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.receiptDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID:</Text>
            <Text style={styles.detailValue}>{item.txid.substring(0, 12)}...</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Original Date:</Text>
            <Text style={styles.detailValue}>{formatDate(item.timestamp)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Blockchain:</Text>
            <View style={styles.blockchainBadge}>
              <Text style={styles.blockchainText}>BSV</Text>
            </View>
          </View>
        </View>

        <View style={styles.environmentalMessage}>
          <Ionicons name="leaf" size={14} color="#10b981" />
          <Text style={styles.environmentalText}>🌱 Saved 0.5g paper & 0.5g CO₂</Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={80} color="#64748b" />
      <Text style={styles.emptyTitle}>No Receipts Yet</Text>
      <Text style={styles.emptyDescription}>
        Scan QR codes from digital receipts to save them here.
      </Text>
      <Text style={styles.emptyHint}>
        Switch to the Scanner tab to get started!
      </Text>
    </View>
  );

  // Receipt Detail Modal Component
  const ReceiptDetailModal = () => {
    if (!showReceiptModal || !selectedReceipt) return null;

    const receiptData = selectedReceipt.fullReceiptData;

    if (!receiptData) {
      return (
        <View style={styles.modalOverlay}>
          <BlurView intensity={80} style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Receipt Details</Text>
              <TouchableOpacity onPress={() => setShowReceiptModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={48} color="#ef4444" />
              <Text style={styles.errorTitle}>Receipt Data Unavailable</Text>
              <Text style={styles.errorText}>
                The full receipt data could not be decrypted or retrieved from the blockchain.
              </Text>
            </View>
          </BlurView>
        </View>
      );
    }

    return (
      <View style={styles.modalOverlay}>
        <BlurView intensity={80} style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Receipt Details</Text>
            <TouchableOpacity onPress={() => setShowReceiptModal(false)}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Receipt Content */}
          <View style={styles.receiptContent}>
            {/* Store Info */}
            <View style={styles.storeSection}>
              <Text style={styles.storeName}>{receiptData.store?.name}</Text>
              <Text style={styles.storeAddress}>{receiptData.store?.address}</Text>
              <Text style={styles.storePhone}>{receiptData.store?.phone}</Text>
              <Text style={styles.receiptId}>Receipt ID: {receiptData.receiptId}</Text>
              <Text style={styles.receiptDate}>
                {receiptData.transaction?.date} {receiptData.transaction?.time}
              </Text>
            </View>

            {/* Cashier Info */}
            <View style={styles.cashierSection}>
              <Text style={styles.cashierText}>
                Cashier: {receiptData.cashier?.name} ({receiptData.cashier?.id})
              </Text>
            </View>

            {/* Items Table */}
            <View style={styles.itemsSection}>
              <Text style={styles.sectionTitle}>Items</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>Price</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>VAT</Text>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>Total</Text>
              </View>
              {receiptData.transaction?.items?.map((item: any, index: number) => (
                <View key={index} style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={[styles.tableText, { flex: 1 }]}>${item.unitPrice?.toFixed(2)}</Text>
                  <Text style={[styles.tableText, { flex: 1 }]}>{(item.taxRate * 100)?.toFixed(0)}%</Text>
                  <Text style={[styles.tableText, { flex: 1 }]}>${item.lineTotal?.toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Totals */}
            <View style={styles.totalsSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Sum total exc VAT</Text>
                <Text style={styles.totalValue}>${receiptData.transaction?.totals?.subTotal?.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Payment method</Text>
                <Text style={styles.totalValue}>{receiptData.transaction?.payment?.method}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>VAT 7%</Text>
                <Text style={styles.totalValue}>${receiptData.transaction?.totals?.taxTotal?.toFixed(2)}</Text>
              </View>
              <View style={[styles.totalRow, styles.grandTotalRow]}>
                <Text style={styles.grandTotalLabel}>CASH</Text>
                <Text style={styles.grandTotalValue}>${receiptData.transaction?.totals?.grandTotal?.toFixed(2)}</Text>
              </View>
            </View>

            {/* Environmental Message */}
            <View style={styles.environmentalSection}>
              <Ionicons name="leaf" size={16} color="#10b981" />
              <Text style={styles.environmentalText}>
                🌱 With this receipt you save 0.5 g of paper and 0.5 g of CO₂
              </Text>
            </View>
            <Text style={styles.environmentalSubtext}>
              Let's keep our planet green - Thank you!
            </Text>

            {/* Footer Message */}
            <Text style={styles.footerMessage}>{receiptData.footer?.message}</Text>
          </View>
        </BlurView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="receipt" size={24} color="#a855f7" />
            </View>
            <View>
              <Text style={styles.headerTitle}>My Receipts</Text>
              <Text style={styles.headerSubtitle}>{receipts.length} saved receipts</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Receipts List */}
      <FlatList
        data={receipts}
        renderItem={renderReceiptItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, receipts.length === 0 && styles.emptyContainer]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#a855f7"
            colors={['#a855f7']}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      <ReceiptDetailModal />
    </View>
  );
}


