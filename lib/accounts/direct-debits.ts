/// <reference path="../../node_modules/cs-core-sdk/dist/cs-core-sdk.node.d.ts" />
import CSCoreSDK = require('cs-core-sdk');
import {AccountNumber, Amount, NetbankingParameters, Signable, Symbols} from '../common';

export class AccountDirectDebitsResource extends CSCoreSDK.Resource
implements CSCoreSDK.PaginatedListEnabled<DirectDebit>, CSCoreSDK.HasInstanceResource<AccountDirectDebitResource>, CSCoreSDK.CreateEnabled<DirectDebit, SignableDirectDebit> {

    constructor(basePath: string, client: CSCoreSDK.WebApiClient) {    
        super(basePath, client);
        
        // insert 'cz' resource into the resource's path because the api requires it in some resources
        this._path = this.getPath().replace('/my', '/cz/my');
    }

    list = (params: NetbankingParameters): Promise<DirectDebitList> => {
        return CSCoreSDK.ResourceUtils.CallPaginatedListWithSuffix(this, null, 'directDebits', params, response => {

            CSCoreSDK.EntityUtils.addDatesToItems(['startDate', 'endDate', 'versionValidityDate'], response);

            return response;
        });
    }

    withId = (id: string): AccountDirectDebitResource => {
        return new AccountDirectDebitResource(id, this.getPath(), this.getClient());
    }

    create = (payload: DirectDebit): Promise<SignableDirectDebit> => {

        return CSCoreSDK.ResourceUtils.CallCreate(this, payload).then(response => {

            CSCoreSDK.EntityUtils.addDatesFromISO(['startDate', 'endDate', 'versionValidityDate'], response);
            
            CSCoreSDK.SigningUtils.createSigningObject(response, this.getClient(), this.getPath());

            return response;
        });
    }
}

export class AccountDirectDebitResource extends CSCoreSDK.InstanceResource
implements CSCoreSDK.GetEnabled<DirectDebit>, CSCoreSDK.DeleteEnabled<SignableDirectDebit> {

    get = (): Promise<DirectDebit> => {
        return CSCoreSDK.ResourceUtils.CallGet(this, null).then(response => {

            CSCoreSDK.EntityUtils.addDatesFromISO(['startDate', 'endDate', 'versionValidityDate'], response);

            return response;
        });
    }

    delete = (): Promise<SignableDirectDebit> => {
        return CSCoreSDK.ResourceUtils.CallDelete(this, null).then(response => {

            CSCoreSDK.EntityUtils.addDatesFromISO(['startDate', 'endDate', 'versionValidityDate'], response);

            CSCoreSDK.SigningUtils.createSigningObject(response, this.getClient(), this.getPath());

            return response;
        });
    }
}

export interface DirectDebitList extends CSCoreSDK.PaginatedListResponse<DirectDebit> {}

export interface DirectDebit {

    /**
     * Order number of the direct debit approval. It is unique per approval. Several versions of an approval have the same order number.
     */
    number: string;

    /**
     * Type of the approval. Possible values are DIRECT_DEBIT or SIPO.
     */
    type: string;

    /**
     * Name of the direct debit receiver.
     */
    receiverName?: string; 

    /**
     * Account number of the receiver.
     */
    receiver: AccountNumber;

    /**
     * Approval name chosen by the user.
     */
    alias?: string;

    /**
     * Limit for the single direct debit.
     */
    limit?: Amount;

    /**
     * Limit for the whole period.
     */
    limitSum?: Amount;

    /**
     * Limit for the number of direct debits for the period.
     */
    limitNumber?: number;

    /**
     * Beginning date for the approval.
     */
    startDate: Date;

    /**
     * End date for the approval.
     */
    endDate?: Date;

    /**
     * Symbols structure for Variable symbol, Specific symbol, Constant symbol.
     */
    symbols?: Symbols;

    /**
     * The order of the month in the period when direct debits are acceptable. This must he null for period at least one month.
     */
    dueMonth?: number;

    /**
     * The number of the day in month. From this day direct debits are acceptable. This can be not null only for period longer then one month.
     */
    dayFrom?: number;

    /**
     * The number of the day in month. To this day direct debits are acceptable.
     */
    dayTo?: number;

    /**
     * Unique identifier for version of the direct debit approval.
     */
    versionId: number;

    /**
     * Date when the version comes into use.
     */
    versionValidityDate: Date;

    /**
     * Number of period cycles in one period.
     */
    periodicity: number;

    /**
     * Unit of the period cycle. Possible values are HALFYEARLY, MONTHLY, QUARTERLY, YEARLY, DAILY, WEEKLY, OTHER.
     */
    periodCycle: string;
}

export interface SignableDirectDebit extends DirectDebit,  Signable {}