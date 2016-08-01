/// <reference path="../../../node_modules/cs-core-sdk/dist/cs-core-sdk.node.d.ts" />
import CSCoreSDK = require('cs-core-sdk');

export class InsurancesContractBeneficiariesResource extends CSCoreSDK.Resource
implements CSCoreSDK.ListEnabled<InsuranceBeneficiary>, CSCoreSDK.UpdateEnabled<UpdateInsuranceBeneficiariesRequest, InsuranceBeneficiaryList> {

    list = (): Promise<InsuranceBeneficiaryList> => {
        return CSCoreSDK.ResourceUtils.CallListWithSuffix(this, null, 'beneficiers', null).then(response => {
            CSCoreSDK.EntityUtils.addDatesToItems(['birthdate'], response);

            return response;
        });
    }

    update = (payload: UpdateInsuranceBeneficiariesRequest): Promise<InsuranceBeneficiaryList> => {
        return CSCoreSDK.ResourceUtils.CallUpdate(this, payload).then(response => {
            CSCoreSDK.EntityUtils.addDatesToItems(['birthdate'], response, 'beneficiaries');

            return response;
        });
    }
}



export interface InsuranceBeneficiaryList extends CSCoreSDK.PaginatedListResponse<InsuranceBeneficiary> {}

export interface InsuranceBeneficiary {

    /**
     * Type of beneficiary
     */
    type: string;

    /**
     * Name of the beneficiary.
     */
    name?: string;

    /**
     * Birthdate of the beneficiary.
     */
    birthdate?: Date;

    /**
     * Percentage of the insurance contract determined to beneficiary or distributed by law. Value in percentage, e.g. 63 will be displayed as 63 %.
     */
    percentage?: number;

    /**
     * Attribute returns unstructured information about distribution among beneficiaries in a single string in 2 cases: 1) Distribution have never been changed (after modifying the distribution - information will be returned ina structured form); 2) BE did not cut up unstructured format.
     */
    unstructuredInfo?: string;

    /**
     * List of flags.
     */
    flags?: [string];
}

export interface UpdateInsuranceBeneficiariesRequest {

    beneficiaries: [InsuranceBeneficiary]; 
}