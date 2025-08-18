import { StyleSheet } from 'react-native';

export const receiptsStyles = StyleSheet.create({
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
    borderTopColor: 'rgba(51, 65, 85, 0.5)', // slash-700/50
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

  // Filter Tags
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterScrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  filterTag: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)', // purple-500/20
    borderColor: 'rgba(168, 85, 247, 0.4)', // purple-500/40
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTagText: {
    color: '#a855f7', // purple-500
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  addFilterTag: {
    backgroundColor: 'rgba(51, 65, 85, 0.3)', // slate-700/30
    borderColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addFilterText: {
    color: '#94a3b8', // slate-400
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});
