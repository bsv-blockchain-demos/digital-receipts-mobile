import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { modalStyles } from '../../styles/modalStyles';

interface ExploreModalsProps {
  // Retry Success Modal
  showRetrySuccessModal: boolean;
  onCloseRetrySuccessModal: () => void;
  
  // Retry Error Modal
  showRetryErrorModal: boolean;
  retryErrorMessage: string;
  onCloseRetryErrorModal: () => void;
  onTryRetryAgain: () => void;
}

export const ExploreModals: React.FC<ExploreModalsProps> = ({
  showRetrySuccessModal,
  onCloseRetrySuccessModal,
  showRetryErrorModal,
  retryErrorMessage,
  onCloseRetryErrorModal,
  onTryRetryAgain,
}) => {
  
  // Retry Success Modal
  const RetrySuccessModal = () => {
    if (!showRetrySuccessModal) return null;

    return (
      <View style={modalStyles.modalBackdrop}>
        <View style={modalStyles.confirmationModal}>
          <View style={modalStyles.receiptPaper}>
            <View style={modalStyles.errorContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              <Text style={[modalStyles.errorTitle, { color: '#10b981' }]}>Retry Successful!</Text>
              <Text style={modalStyles.errorText}>
                The receipt data has been successfully retrieved and updated from the blockchain.
              </Text>
              
              <View style={modalStyles.deleteModalButtons}>
                <TouchableOpacity 
                  style={[modalStyles.deleteConfirmButton, { backgroundColor: '#10b981', width: '100%' }]}
                  onPress={onCloseRetrySuccessModal}
                >
                  <Text style={modalStyles.deleteConfirmButtonText}>Great!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Retry Error Modal
  const RetryErrorModal = () => {
    if (!showRetryErrorModal) return null;

    return (
      <View style={modalStyles.modalBackdrop}>
        <View style={modalStyles.confirmationModal}>
          <View style={modalStyles.receiptPaper}>
            <View style={modalStyles.errorContainer}>
              <Ionicons name="close-circle" size={48} color="#ef4444" />
              <Text style={modalStyles.errorTitle}>Retry Failed</Text>
              <Text style={modalStyles.errorText}>
                {retryErrorMessage || 'Unable to retrieve receipt data from the blockchain. Please check your connection and try again.'}
              </Text>
              
              <View style={modalStyles.deleteModalButtons}>
                <TouchableOpacity 
                  style={modalStyles.cancelButton}
                  onPress={onCloseRetryErrorModal}
                >
                  <Text style={modalStyles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={modalStyles.deleteConfirmButton}
                  onPress={onTryRetryAgain}
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
      <RetrySuccessModal />
      <RetryErrorModal />
    </>
  );
};
