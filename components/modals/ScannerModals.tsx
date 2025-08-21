import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { modalStyles } from '../../styles/modalStyles';

interface ScannerModalsProps {
  // Duplicate Receipt Modal
  showDuplicateModal: boolean;
  pendingReceiptData: any;
  saving: boolean;
  onConfirmSaveDuplicate: () => void;
  onCancelSaveDuplicate: () => void;
  
  // Success Modal
  showSuccessModal: boolean;
  successMessage: string;
  onCloseSuccessModal: () => void;
  onScanAnother: () => void;
  
  // Error Modal
  showErrorModal: boolean;
  errorTitle: string;
  errorMessage: string;
  onCloseErrorModal: () => void;
  onTryAgain: () => void;
}

export const ScannerModals = ({
  showDuplicateModal,
  pendingReceiptData,
  saving,
  onConfirmSaveDuplicate,
  onCancelSaveDuplicate,
  showSuccessModal,
  successMessage,
  onCloseSuccessModal,
  onScanAnother,
  showErrorModal,
  errorTitle,
  errorMessage,
  onCloseErrorModal,
  onTryAgain,
}: ScannerModalsProps) => {
  
  // Duplicate Receipt Confirmation Modal
  const DuplicateReceiptModal = () => {
    if (!showDuplicateModal || !pendingReceiptData) return null;

    return (
      <View style={modalStyles.modalBackdrop}>
        <View style={modalStyles.confirmationModal}>
          <View style={modalStyles.receiptPaper}>
            <View style={modalStyles.errorContainer}>
              <Ionicons name="warning" size={48} color="#f59e0b" />
              <Text style={modalStyles.errorTitle}>Receipt Already Exists</Text>
              <Text style={modalStyles.errorText}>
                This receipt has already been saved to your collection. Do you want to save it again?
              </Text>
              
              <View style={modalStyles.deleteModalButtons}>
                <TouchableOpacity 
                  style={[modalStyles.cancelButton, saving && modalStyles.buttonDisabled]}
                  onPress={onCancelSaveDuplicate}
                  disabled={saving}
                >
                  <Text style={[modalStyles.cancelButtonText, saving && modalStyles.buttonTextDisabled]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    modalStyles.deleteConfirmButton, 
                    { backgroundColor: saving ? '#9ca3af' : '#f59e0b' }
                  ]}
                  onPress={onConfirmSaveDuplicate}
                  disabled={saving}
                >
                  <Text style={modalStyles.deleteConfirmButtonText}>
                    {saving ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Success Modal
  const SuccessModal = () => {
    if (!showSuccessModal) return null;

    return (
      <View style={modalStyles.modalBackdrop}>
        <View style={modalStyles.confirmationModal}>
          <View style={modalStyles.receiptPaper}>
            <View style={modalStyles.errorContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              <Text style={[modalStyles.errorTitle, { color: '#10b981' }]}>Success!</Text>
              <Text style={modalStyles.errorText}>
                {successMessage}
              </Text>
              
              <View style={modalStyles.deleteModalButtons}>
                <TouchableOpacity 
                  style={modalStyles.cancelButton}
                  onPress={onScanAnother}
                >
                  <Text style={modalStyles.cancelButtonText}>Scan Another</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[modalStyles.deleteConfirmButton, { backgroundColor: '#10b981' }]}
                  onPress={() => {
                    onCloseSuccessModal();
                    router.push('/explore');
                  }}
                >
                  <Text style={modalStyles.deleteConfirmButtonText}>View Receipts</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Error Modal
  const ErrorModal = () => {
    if (!showErrorModal) return null;

    return (
      <View style={modalStyles.modalBackdrop}>
        <View style={modalStyles.confirmationModal}>
          <View style={modalStyles.receiptPaper}>
            <View style={modalStyles.errorContainer}>
              <Ionicons name="close-circle" size={48} color="#ef4444" />
              <Text style={modalStyles.errorTitle}>{errorTitle}</Text>
              <Text style={modalStyles.errorText}>
                {errorMessage}
              </Text>
              
              <View style={modalStyles.deleteModalButtons}>
                <TouchableOpacity 
                  style={modalStyles.cancelButton}
                  onPress={onCloseErrorModal}
                >
                  <Text style={modalStyles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={modalStyles.deleteConfirmButton}
                  onPress={onTryAgain}
                >
                  <Text style={modalStyles.deleteConfirmButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <DuplicateReceiptModal />
      <SuccessModal />
      <ErrorModal />
    </>
  );
};
