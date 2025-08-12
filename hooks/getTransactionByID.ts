import { LookupResolver } from '@bsv/sdk';

const overlay = new LookupResolver({
    slapTrackers: ['https://overlay-us-1.bsvb.tech'],
    additionalHosts: {
        'ls_anytx': ['https://overlay-us-1.bsvb.tech']
    }
});

export const getTransactionByID = async (txid: string) => {
    // get transaction from overlay
    const response = await overlay.query({
        service: 'ls_anytx', query: {
            txid: txid
        }
    }, 10000);

    return response;
};