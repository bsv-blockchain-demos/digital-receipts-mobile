import { SymmetricKey } from '@bsv/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decryptJSON } from '../utils/decryption';
import { hexToBytes } from '../utils/keyConversion';
import { saveStoreName } from '../utils/saveStoreName';
import { getTransactionByID } from './getTransactionByID';

const saveReceiptRetry = async (receiptData: any) => {
    try {
        const existingReceipts = await AsyncStorage.getItem('scannedReceipts');
        const receipts = existingReceipts ? JSON.parse(existingReceipts) : [];

        // Get full tx from Overlay to get the actual receipt data back
        const fullTx = await getTransactionByID(receiptData.txid);
        console.log(JSON.stringify(fullTx));
        let encryptedReceiptData: number[] = [];

        if (fullTx && 'outputs' in fullTx) {
            for (const output of fullTx.outputs) {
                if (output.satoshis !== undefined && output.satoshis <= 2) {
                    const lockingScript = output.lockingScript;
                    for (const chunk of lockingScript.chunks) {
                        if (chunk.op === 106) {
                            encryptedReceiptData = chunk.data as number[];
                            break;
                        }
                    }
                }
            }
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
