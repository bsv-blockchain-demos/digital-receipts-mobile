import { SymmetricKey } from "@bsv/sdk";

export function decryptJSON(encryptedData: number[], key: SymmetricKey) {
    // Remove the first 3 items from the array
    encryptedData = encryptedData.slice(3);
    console.log("Key: ", key);
    console.log("Encrypted data: ", encryptedData);
    const jsonString = key.decrypt(encryptedData, 'utf8') as string;
    console.log("Decrypted JSON string: ", jsonString);
    return JSON.parse(jsonString);
}