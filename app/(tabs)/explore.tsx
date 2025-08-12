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
}

export default function ReceiptsScreen() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    <View style={styles.receiptCard}>
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
    </View>
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <BlurView intensity={80} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Receipts</Text>
          <View style={styles.headerActions}>
            <Text style={styles.receiptCount}>{receipts.length} receipts</Text>
            {receipts.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearAllReceipts}
              >
                <Ionicons name="trash" size={16} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurView>

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
    padding: 8,
  },
  listContainer: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
  receiptDate: {
    color: '#94a3b8', // slate-400
    fontSize: 12,
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
});
