import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';
import { ExploreModals } from '../../components/modals/ExploreModals';
import InlineSpinner from '../../components/ui/InlineSpinner';
import saveReceiptRetry from '../../hooks/saveReceiptRetry';
import { modalStyles } from '../../styles/modalStyles';
import { receiptsStyles } from '../../styles/receiptsStyles';

const styles = receiptsStyles;

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [availableStores, setAvailableStores] = useState<string[]>([]);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [showRetrySuccessModal, setShowRetrySuccessModal] = useState(false);
  const [showRetryErrorModal, setShowRetryErrorModal] = useState(false);
  const [retryErrorMessage, setRetryErrorMessage] = useState('');
  const [currentRetryReceipt, setCurrentRetryReceipt] = useState<Receipt | null>(null);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [showRetryLoadingSpinner, setShowRetryLoadingSpinner] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadReceipts();
      loadAvailableStores();
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
        filterReceipts(sortedReceipts, selectedStores);
      }
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableStores = async () => {
    try {
      const storedStores = await AsyncStorage.getItem('storeNames');
      if (storedStores) {
        const parsedStores = JSON.parse(storedStores);
        setAvailableStores(parsedStores);
      }
    } catch (error) {
      console.error('Error loading store names:', error);
    }
  };

  const filterReceipts = (receiptsToFilter: Receipt[], storeFilters: string[]) => {
    if (storeFilters.length === 0) {
      setFilteredReceipts(receiptsToFilter);
      return;
    }

    const filtered = receiptsToFilter.filter(receipt => {
      const storeName = receipt.fullReceiptData?.store?.name;
      return storeName && storeFilters.includes(storeName);
    });

    setFilteredReceipts(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReceipts();
    await loadAvailableStores();
    setRefreshing(false);
  };

  // Store filtering functions
  const toggleStoreSelection = (storeName: string) => {
    const newSelection = selectedStores.includes(storeName)
      ? selectedStores.filter(store => store !== storeName)
      : [...selectedStores, storeName];
    
    setSelectedStores(newSelection);
    filterReceipts(receipts, newSelection);
  };

  const removeStoreFilter = (storeName: string) => {
    const newSelection = selectedStores.filter(store => store !== storeName);
    setSelectedStores(newSelection);
    filterReceipts(receipts, newSelection);
  };

  const clearAllFilters = () => {
    setSelectedStores([]);
    filterReceipts(receipts, []);
  };

  const showDeleteConfirmation = (receipt: Receipt) => {
    setReceiptToDelete(receipt);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!receiptToDelete) return;
    
    try {
      const updatedReceipts = receipts.filter(receipt => receipt.id !== receiptToDelete.id);
      setReceipts(updatedReceipts);
      filterReceipts(updatedReceipts, selectedStores);
      await AsyncStorage.setItem('scannedReceipts', JSON.stringify(updatedReceipts));
    } catch (error) {
      console.error('Error deleting receipt:', error);
    } finally {
      setShowDeleteModal(false);
      setReceiptToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReceiptToDelete(null);
  };

  const saveRetry = async (receiptData: Receipt) => {
    try {
      setCurrentRetryReceipt(receiptData);
      const retryResult = await saveReceiptRetry(receiptData);
      if (!retryResult) {
        setRetryErrorMessage('Failed to retry fetching receipt data');
        setShowRetryErrorModal(true);
        setShowLoadingSpinner(false);
        setShowReceiptModal(false);
        return;
      }
      // Reload receipts to get updated data
      await loadReceipts();
      setShowRetrySuccessModal(true);
      setShowLoadingSpinner(false);
      setShowReceiptModal(false);
    } catch (error) {
      console.error('Error saving receipt:', error);
      setRetryErrorMessage(error instanceof Error ? error.message : 'Failed to retry fetching receipt data');
      setShowRetryErrorModal(true);
      setShowLoadingSpinner(false);
      setShowReceiptModal(false);
    }
  };

  // Filter Tags Component
  const FilterTags = () => {
    return (
      <View style={styles.filterContainer}>
        <View style={styles.filterScrollView}>
          {/* Add Filter Button */}
          <TouchableOpacity 
            style={styles.addFilterTag}
            onPress={() => setShowStoreModal(true)}
          >
            <Ionicons name="add" size={16} color="#94a3b8" />
            <Text style={styles.addFilterText}>Filter by store</Text>
          </TouchableOpacity>
          
          {/* Selected Store Tags */}
          {selectedStores.map((storeName) => (
            <TouchableOpacity 
              key={storeName}
              style={styles.filterTag}
              onPress={() => removeStoreFilter(storeName)}
            >
              <Text style={styles.filterTagText}>{storeName}</Text>
              <Ionicons name="close" size={14} color="#a855f7" />
            </TouchableOpacity>
          ))}
          
          {/* Clear All Button */}
          {selectedStores.length > 0 && (
            <TouchableOpacity 
              style={styles.addFilterTag}
              onPress={clearAllFilters}
            >
              <Ionicons name="refresh" size={16} color="#94a3b8" />
              <Text style={styles.addFilterText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Store Selection Modal Component
  const StoreSelectionModal = () => {
    if (!showStoreModal) return null;

    return (
      <View style={modalStyles.modalBackdrop}>
        <View style={modalStyles.storeSelectionModal}>
          {/* Header */}
          <View style={modalStyles.storeSelectionHeader}>
            <Text style={modalStyles.storeSelectionTitle}>Filter by Store</Text>
            <TouchableOpacity onPress={() => setShowStoreModal(false)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          {/* Store List */}
          <ScrollView style={modalStyles.storeList}>
            {availableStores.length === 0 ? (
              <Text style={modalStyles.emptyStoresText}>
                No stores available. Scan some receipts first!
              </Text>
            ) : (
              availableStores.map((storeName) => {
                const isSelected = selectedStores.includes(storeName);
                return (
                  <TouchableOpacity
                    key={storeName}
                    style={[
                      modalStyles.storeItem,
                      isSelected && modalStyles.storeItemSelected
                    ]}
                    onPress={() => toggleStoreSelection(storeName)}
                  >
                    <Ionicons 
                      name={isSelected ? "checkbox" : "square-outline"} 
                      size={20} 
                      color={isSelected ? "#a855f7" : "#64748b"} 
                    />
                    <Text style={[
                      modalStyles.storeItemText,
                      isSelected && modalStyles.storeItemTextSelected
                    ]}>
                      {storeName}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
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
            onPress={() => showDeleteConfirmation(item)}
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

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal || !receiptToDelete) return null;

    return (
      <View style={modalStyles.modalBackdrop}>
        <View style={modalStyles.confirmationModal}>
          {/* Delete Confirmation Content */}
          <View style={modalStyles.receiptPaper}>
            <View style={modalStyles.errorContainer}>
              <Ionicons name="warning" size={48} color="#ef4444" />
              <Text style={modalStyles.errorTitle}>Delete Receipt?</Text>
              <Text style={modalStyles.errorText}>
                Are you sure you want to delete this receipt? This action cannot be undone.
              </Text>
              
              {/* Action Buttons */}
              <View style={modalStyles.deleteModalButtons}>
                <TouchableOpacity 
                  style={modalStyles.cancelButton}
                  onPress={cancelDelete}
                >
                  <Text style={modalStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={modalStyles.deleteConfirmButton}
                  onPress={confirmDelete}
                >
                  <Text style={modalStyles.deleteConfirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Receipt Detail Modal Component
  const ReceiptDetailModal = () => {
    if (!showReceiptModal || !selectedReceipt) return null;

    const receiptData = selectedReceipt.fullReceiptData;
    console.log("Selected receipt data: ", selectedReceipt)

    if (!receiptData) {
      return (
        <View style={modalStyles.modalBackdrop}>
          <View style={modalStyles.receiptModal}>
            {/* Close Button */}
            <TouchableOpacity 
              style={modalStyles.closeButton} 
              onPress={() => setShowReceiptModal(false)}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>

            {/* Error Content */}
            <View style={modalStyles.receiptPaper}>
              <View style={modalStyles.errorContainer}>
                <Ionicons name="warning" size={48} color="#ef4444" />
                <Text style={modalStyles.errorTitle}>Receipt Data Unavailable</Text>
                <Text style={modalStyles.errorText}>
                  The full receipt data could not be decrypted or retrieved from the blockchain.
                </Text>
                {showLoadingSpinner ? <InlineSpinner size={20}/> : (
                <TouchableOpacity 
                  style={modalStyles.retryButton} 
                  onPress={() => {
                    setShowLoadingSpinner(true);
                    saveRetry(selectedReceipt);
                  }}
                >
                  <Text style={modalStyles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={modalStyles.modalBackdrop}>
        <View style={modalStyles.receiptModal}>
            {/* Close Button */}
            <TouchableOpacity 
              style={modalStyles.closeButton} 
              onPress={() => setShowReceiptModal(false)}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>

            {/* Receipt Paper */}
            <View style={modalStyles.receiptPaper}>
              {/* Store Header */}
              <View style={modalStyles.receiptHeader}>
                <Text style={modalStyles.receiptTitle}>Receipt</Text>
                <Text style={modalStyles.receiptTimestamp}>
                  {receiptData.transaction?.date} {receiptData.transaction?.time}
                </Text>
              </View>

              {/* Line Items Header */}
              <View style={modalStyles.lineItemsHeader}>
                <Text style={[modalStyles.lineHeaderText, { flex: 3 }]}>Line Items</Text>
                <Text style={[modalStyles.lineHeaderText, { flex: 1, textAlign: 'right' }]}>Price</Text>
                <Text style={[modalStyles.lineHeaderText, { flex: 1, textAlign: 'right' }]}>VAT</Text>
                <Text style={[modalStyles.lineHeaderText, { flex: 1, textAlign: 'right' }]}>Total</Text>
              </View>

              {/* Items */}
              {receiptData.transaction?.items?.map((item: any, index: number) => (
                <View key={index} style={modalStyles.receiptItem}>
                  <View style={{ flex: 3 }}>
                    <Text style={modalStyles.itemName}>{item.description}</Text>
                  </View>
                  <Text style={[modalStyles.itemPrice, { flex: 1, textAlign: 'right' }]}>
                    {item.unitPrice?.toFixed(2)}
                  </Text>
                  <Text style={[modalStyles.itemVat, { flex: 1, textAlign: 'right' }]}>
                    {(item.taxRate * 100)?.toFixed(0)}%
                  </Text>
                  <Text style={[modalStyles.itemTotal, { flex: 1, textAlign: 'right' }]}>
                    {item.lineTotal?.toFixed(2)}
                  </Text>
                </View>
              ))}

              {/* Totals Section */}
              <View style={modalStyles.receiptTotals}>
                <Text style={modalStyles.totalsTitle}>Sum total exc VAT</Text>
                <Text style={modalStyles.totalsValue}>€{receiptData.transaction?.totals?.subTotal?.toFixed(2)}</Text>
              </View>

              <View style={modalStyles.receiptTotals}>
                <Text style={modalStyles.totalsTitle}>Payment method</Text>
                <Text style={modalStyles.totalsValue}>{receiptData.transaction?.payment?.method || 'Cash'}</Text>
              </View>

              <View style={modalStyles.receiptTotals}>
                <Text style={modalStyles.totalsTitle}>VAT 7%</Text>
                <Text style={modalStyles.totalsValue}>€{receiptData.transaction?.totals?.taxTotal?.toFixed(2)}</Text>
              </View>

              <View style={modalStyles.receiptTotals}>
                <Text style={modalStyles.totalsTitle}>CASH</Text>
                <Text style={modalStyles.finalTotal}>{receiptData.transaction?.totals?.grandTotal?.toFixed(2)}</Text>
              </View>

              {/* Store Info */}
              <View style={modalStyles.storeInfo}>
                <Text style={modalStyles.storeText}>{receiptData.store?.name}</Text>
                <Text style={modalStyles.storeText}>{receiptData.store?.address}</Text>
                <Text style={modalStyles.storeText}>{receiptData.store?.phone}</Text>
                <Text style={modalStyles.receiptIdText}>Receipt ID: {receiptData.receiptId}</Text>
              </View>

              {/* Environmental Message */}
              <View style={modalStyles.environmentalBanner}>
                <Ionicons name="heart" size={16} color="#10b981" />
                <Text style={modalStyles.environmentalMessage}>
                  With this receipt you save 0.5 g of paper and 0.5 g of CO₂
                </Text>
              </View>
              
              <Text style={modalStyles.environmentalSubtext}>
                Let's keep our planet green - Thank you!
              </Text>
            </View>
          </View>
        </View>
    );
  };

  if (loading) {
    return <LoadingScreen message="Loading receipts..." size={50} showMessage={true} />;
  }

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

      {/* Filter Tags */}
      <FilterTags />

      {/* Receipts List */}
      <FlatList
        data={filteredReceipts}
        renderItem={renderReceiptItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, filteredReceipts.length === 0 && styles.emptyContainer]}
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

      {/* Store Selection Modal */}
      <StoreSelectionModal />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />
      
      {/* Receipt Detail Modal */}
      <ReceiptDetailModal />
      
      {/* Retry Modals */}
      <ExploreModals
        showRetrySuccessModal={showRetrySuccessModal}
        onCloseRetrySuccessModal={() => {
          setShowRetrySuccessModal(false);
          setCurrentRetryReceipt(null);
        }}
        showRetryErrorModal={showRetryErrorModal}
        retryErrorMessage={retryErrorMessage}
        onCloseRetryErrorModal={() => {
          setShowRetryErrorModal(false);
          setRetryErrorMessage('');
          setCurrentRetryReceipt(null);
        }}
        onTryRetryAgain={async () => {
          if (currentRetryReceipt) {
            setShowRetryLoadingSpinner(true);
            await saveRetry(currentRetryReceipt);
            setShowRetryLoadingSpinner(false);
          }
        }}
        showRetryLoadingSpinner={showRetryLoadingSpinner}
      />
    </View>
  );
}


