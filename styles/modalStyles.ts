import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
  // Modal Backdrop and Container
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  receiptModal: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800/95 (more opaque for modal)
    borderRadius: 16,
    margin: 20,
    maxHeight: '90%',
    maxWidth: 400,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  confirmationModal: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800/95 (more opaque for modal)
    borderRadius: 16,
    margin: 20,
    maxHeight: '40%',
    maxWidth: 400,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },

  // Receipt Paper Styling
  receiptPaper: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900/90 (more opaque for content)
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '100%',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.3)', // slate-700/30
  },

  // Receipt Header
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    paddingBottom: 16,
  },
  receiptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  receiptTimestamp: {
    fontSize: 14,
    color: '#cbd5e1', // slate-300 (matching receipt cards)
  },

  // Line Items
  lineItemsHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    marginBottom: 8,
  },
  lineHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1', // slate-300 (matching receipt cards)
  },
  receiptItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)', // slate-700/30
  },
  itemName: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    color: '#cbd5e1', // slate-300 (matching receipt cards)
  },
  itemVat: {
    fontSize: 14,
    color: '#cbd5e1', // slate-300 (matching receipt cards)
  },
  itemTotal: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },

  // Totals Section
  receiptTotals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginTop: 16,
  },
  totalsTitle: {
    fontSize: 14,
    color: '#cbd5e1', // slate-300 (matching receipt cards)
  },
  totalsValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  finalTotal: {
    fontSize: 16,
    color: '#10b981', // green-500
    fontWeight: 'bold',
  },

  // Store Information
  storeInfo: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    alignItems: 'center',
  },
  storeText: {
    fontSize: 12,
    color: '#cbd5e1', // slate-300 (matching receipt cards)
    textAlign: 'center',
    marginBottom: 2,
  },
  receiptIdText: {
    fontSize: 12,
    color: '#cbd5e1', // slate-300 (matching receipt cards)
    textAlign: 'center',
    marginTop: 8,
  },

  // Environmental Section
  environmentalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)', // green-500/20
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)', // green-500/30
  },
  environmentalMessage: {
    fontSize: 12,
    color: '#10b981', // green-500
    textAlign: 'center',
    flex: 1,
  },
  environmentalSubtext: {
    fontSize: 12,
    color: '#10b981', // green-500
    textAlign: 'center',
    marginBottom: 16,
  },

  // QR Code Section
  qrSection: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  qrText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  qrSubtext: {
    fontSize: 12,
    color: '#cbd5e1', // slate-300 (matching receipt cards)
    marginTop: 2,
  },

  // Footer
  receiptFooter: {
    fontSize: 10,
    color: '#64748b', // slate-500
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },

  // Error States
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
  errorContainer: {
    alignItems: 'center',
    padding: 20,
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
    marginBottom: 24,
  },

  // Delete Modal Buttons
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.7)', // slate-700/70
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: '#ef4444', // red-500
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteConfirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Disabled Button States
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTextDisabled: {
    opacity: 0.7,
  },

  // Store Selection Modal
  storeSelectionModal: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800/95
    borderRadius: 16,
    margin: 20,
    maxHeight: '70%',
    maxWidth: 400,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  storeSelectionHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeSelectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  storeList: {
    maxHeight: 300,
    padding: 20,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  storeItemSelected: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: 'rgba(168, 85, 247, 0.4)',
  },
  storeItemText: {
    flex: 1,
    fontSize: 14,
    color: 'white',
    marginLeft: 12,
  },
  storeItemTextSelected: {
    color: '#a855f7',
    fontWeight: '500',
  },
  emptyStoresText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#10b981', // green-500
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
