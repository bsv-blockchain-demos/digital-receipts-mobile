import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(168, 85, 247, 0.2)', // purple-500/20
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8', // slate-400
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  receiptCount: {
    color: '#a855f7', // purple-500
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  clearButtonContent: {
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)', // red-500/10
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)', // red-500/20
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  listContainer: {
    padding: 20,
  },
  receiptCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  receiptCardBlur: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // slate-800/50
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    padding: 16,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.2)', // purple-500/20
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  deleteButton: {
    padding: 8,
  },
  receiptDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#cbd5e1', // slate-300
    fontSize: 14,
  },
  detailValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  blockchainBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)', // purple-500/20
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  blockchainText: {
    color: '#a855f7', // purple-500
    fontSize: 12,
    fontWeight: '600',
  },
  environmentalMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // green-500/10
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  environmentalText: {
    color: '#10b981', // green-500
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    color: '#94a3b8', // slate-400
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  emptyHint: {
    color: '#a855f7', // purple-500
    fontSize: 14,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800/95
    borderRadius: 16,
    margin: 20,
    maxHeight: '90%',
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  receiptContent: {
    padding: 20,
    maxHeight: '80%',
  },
  storeSection: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    marginBottom: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
    marginBottom: 2,
  },
  storePhone: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
    marginBottom: 8,
  },
  receiptId: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
    marginBottom: 2,
  },
  receiptDate: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
  },
  cashierSection: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    marginBottom: 16,
  },
  cashierText: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
  },
  itemsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)', // slate-700/30
  },
  itemDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 10,
    color: '#94a3b8', // slate-400
  },
  tableText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'right',
  },
  totalsSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: 'white',
  },
  totalValue: {
    fontSize: 14,
    color: 'white',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    paddingTop: 8,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  environmentalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // green-500/10
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  environmentalSubtext: {
    fontSize: 12,
    color: '#10b981', // green-500
    textAlign: 'center',
    marginBottom: 16,
  },
  footerMessage: {
    fontSize: 12,
    color: '#94a3b8', // slate-400
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444', // red-500
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#94a3b8', // slate-400
    textAlign: 'center',
    lineHeight: 20,
  },
});
