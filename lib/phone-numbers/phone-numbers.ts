/// <reference path="../../node_modules/cs-core-sdk/dist/cs-core-sdk.node.d.ts" />/// <reference path="../../node_modules/cs-core-sdk/dist/cs-core-sdk.node.d.ts" />
import CSCoreSDK = require('cs-core-sdk');
import {NetbankingEmptyResponse} from '../common';

export class PhoneNumbersResource extends CSCoreSDK.Resource
implements CSCoreSDK.ListEnabled<PhoneNumber>, CSCoreSDK.CreateEnabled<PhoneNumberRequest, PhoneNumber>, CSCoreSDK.HasInstanceResource<PhoneNumberResource> {

    constructor(basePath: string, client: CSCoreSDK.WebApiClient) {    
        super(basePath, client);
        
        // insert 'cz' resource into the resource's path because the api requires it in some resources
        this._path = this.getPath().replace('/my', '/cz/my');
    }

    /**
     * Returns list of phone numbers
     */
    list = (): Promise<PhoneNumberList> => {
        return CSCoreSDK.ResourceUtils.CallListWithSuffix(this, null, 'phoneNumbers').then(response => {

            response.items.forEach(x => {
                resourcifyPhoneNumbers(<PhoneNumber>x, this.withId((<PhoneNumber>x).id));
            });

            return response;
        });
    }

    /**
     * Creates new phone number
     */
    create = (payload: PhoneNumberRequest): Promise<PhoneNumber> => {
        return CSCoreSDK.ResourceUtils.CallCreate(this, payload).then(response => {
            resourcifyPhoneNumbers(<PhoneNumber>response, this.withId((<PhoneNumber>response).id));

            return response;
        });
    }

    /**
     * Get single phone number with a given id
     */
    withId = (id: string): PhoneNumberResource => {
        return new PhoneNumberResource(id, this.getPath(), this.getClient());
    }
}

export class PhoneNumberResource extends CSCoreSDK.InstanceResource
implements CSCoreSDK.UpdateEnabled<PhoneNumberRequest, PhoneNumber>, CSCoreSDK.DeleteEnabled<any> {

    /**
     * Updates phone number
     */
    update = (payload: PhoneNumberRequest): Promise<PhoneNumber> => {
        (<any>payload).id = this._id;
        return CSCoreSDK.ResourceUtils.CallUpdate(this, payload).then(response => {

            resourcifyPhoneNumbers(<PhoneNumber>response, this);

            return response;
        });
    }

    /**
     * Deletes phone number
     */
    delete = (): Promise<NetbankingEmptyResponse> => {
        return CSCoreSDK.ResourceUtils.CallDelete(this, null);
    }
}

export interface PhoneNumberList extends CSCoreSDK.ListResponse<PhoneNumber> {}

export interface PhoneNumber extends PhoneNumberRequest {

    /**
     * Phone book entry identifier.
     */
    id: string;

    /**
     * Convenience method for updating Phone number
     */
    update: (payload: PhoneNumberRequest) => Promise<PhoneNumber>;

    /**
     * Convenience method for deleting Phone number
     */
    delete: () => Promise<NetbankingEmptyResponse>;
}

export interface PhoneNumberRequest {

    /**
     * Alias name of phone number entered by user for his better orientation in phone book.
     */
    alias?: string;

    /**
     * Phone number which will be saved in phone book. The value in the phone number field must be a 9-digit number that cannot have a leading zero.
     */
    phoneNumber: string;

    /**
     * Array of optional Flag values.
     */
    flags?: [string];
}

function resourcifyPhoneNumbers(phoneNumber: PhoneNumber, phoneNumberReference: PhoneNumberResource) {
    phoneNumber.update = phoneNumberReference.update;
    phoneNumber.delete = phoneNumberReference.delete;
}