import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTransactionByID } from './getTransactionByID';
import { decryptJSON } from '../utils/decryption';
import { SymmetricKey } from '@bsv/sdk';
import { hexToBytes } from '../utils/keyConversion';
import { saveStoreName } from '../utils/saveStoreName';

const saveReceiptRetry = async (receiptData: any) => {
    try {
        const existingReceipts = await AsyncStorage.getItem('scannedReceipts');
        const receipts = existingReceipts ? JSON.parse(existingReceipts) : [];

        // Get full tx from Overlay to get the actual receipt data back
        const fullTx = await getTransactionByID(receiptData.txid);
        console.log(fullTx);
        const output = fullTx?.outputs[0];
        let encryptedReceiptData: number[] = [];

        if (output && 'lockingScript' in output) {
            const lockingScript = output.lockingScript;
            encryptedReceiptData = lockingScript?.chunks[1]?.data as number[];
        }

        if (!encryptedReceiptData) {
            console.error("No encrypted receipt data found");
            return false;
        }

        console.log("Encrypted receipt data: ", encryptedReceiptData);

        const key = new SymmetricKey(hexToBytes(receiptData.symkeyString));
        const decryptedReceiptData = decryptJSON(encryptedReceiptData, key);

        console.log("Decrypted receipt data: ", decryptedReceiptData);
        console.log("Key: ", key);

        // Save store name to localStorage if decryption was successful and store name exists
        if (decryptedReceiptData?.store?.name) {
            console.log("Attempting to save store name: " + decryptedReceiptData.store.name);
            await saveStoreName(decryptedReceiptData.store.name);
        } else {
            console.error("No store name found in decrypted receipt data");
            return false;
        }

        // Add timestamp for when it was scanned and include decrypted data
        const newReceipt = {
            ...receiptData,
            scannedAt: new Date().toISOString(),
            id: Date.now().toString(), // Simple ID generation
            fullReceiptData: decryptedReceiptData // Store the decrypted receipt data
        };

        receipts.push(newReceipt);
        await AsyncStorage.setItem('scannedReceipts', JSON.stringify(receipts));
        return true;
    } catch (error) {
        console.error('Error saving receipt:', error);
        return false;
    }
};

export default saveReceiptRetry;
