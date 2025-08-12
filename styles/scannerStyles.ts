import { StyleSheet } from 'react-native';

export const scannerStyles = StyleSheet.create({
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
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  scannerCardContainer: {
    alignItems: 'center',
  },
  scannerCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)', // slate-800/50
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
    overflow: 'hidden',
    width: '100%',
    maxWidth: 350,
  },
  cameraContainer: {
    height: 350,
    position: 'relative',
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1e293b', // slate-800
  },
  camera: {
    flex: 1,
  },
  cameraInactive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
  cameraInactiveText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
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
    width: 200,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#a855f7', // purple-500
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  instructionText: {
    color: '#94a3b8', // slate-400
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    lineHeight: 22,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    width: '100%',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  actionButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
