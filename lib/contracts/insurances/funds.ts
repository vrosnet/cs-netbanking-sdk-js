import * as CSCoreSDK from 'cs-core-sdk';
import { Amount } from '../../common';

/**
 * @class InsurancesContractFundsResource
 * @extends {CSCoreSDK.Resource}
 * @implements {CSCoreSDK.ListEnabled<Fund>}
 * @implements {CSCoreSDK.UpdateEnabled<UpdateFundRequest, UpdateFundResponse>}
 */
export class InsurancesContractFundsResource extends CSCoreSDK.Resource
  implements CSCoreSDK.ListEnabled<Fund>, CSCoreSDK.UpdateEnabled<UpdateFundRequest, UpdateFundResponse> {

  /**
   * @param {string} basePath
   * @param {CSCoreSDK.WebApiClient} client 
   */
  constructor(basePath: string, client: CSCoreSDK.WebApiClient) {
    super(basePath, client);

    // insert 'cz' resource into the resource's path because the api requires it in some resources
    this._path = this.getPath().replace('/my', '/cz/my');
  }

  /**
   * Returns detail of distribution of capital value into funds.
   * @returns {Promise<FundList>}
   */
  list = (): Promise<FundList> => {
    return CSCoreSDK.ResourceUtils.CallListWithSuffix(this, null, 'funds', null);
  }

  /**
   * Change the distribution of capital value into funds.
   * @param {UpdateFundRequest} payload
   * @returns {Promise<UpdateFundResponse>}
   */
  update = (payload: UpdateFundRequest): Promise<UpdateFundResponse> => {
    return CSCoreSDK.ResourceUtils.CallUpdate(this, payload).then(response => {

      CSCoreSDK.SigningUtils.createSigningObject(response, this.getClient(), this.getPath());

      return response;
    });
  }
}

/**
 * @interface FundList
 * @extends {CSCoreSDK.ListResponse<Fund>}
 */
export interface FundList extends CSCoreSDK.ListResponse<Fund> {

  /**
   * Total invested amount into all funds in CZK.
   */
  totalInvestedAmount: Amount;

  /**
   * Shows, whether a investment program is active for life insurance product. The field can be either blank or filled with 2 values - INVESTMENT_MANAGEMENT or CONSEQ
   */
  investmentProgram?: string;

  /**
   * Array of flags for funds.
   */
  flags?: [string];
}

/**
 * @interface Fund
 */
export interface Fund {

  /**
   * Unique code of fund.
   */
  code: string;

  /**
   * Name of fund.
   */
  name: string;

  /**
   * Current value invested into fund in CZK
   */
  investedAmount: Amount;

  /**
   * Current value invested into fund in %.
   */
  investedShare: number;

  /**
   * The rate at which the savings component of the premium will be invested in selected funds.Value in percentage, e.g. 63 will be displayed as 63 %.
   */
  allocation: number;
}

/**
 * @interface UpdateFundRequest
 */
export interface UpdateFundRequest {

  funds: [{

    /**
     * Unique code of fund.
     */
    code: string;

    allocation: number;
  }];

  /**
   * Shows, whether an investment program is active for life insurance product. The field can be either blank or filled with 2 values - INVESTMENT_MANAGEMENT or CONSEQ
   */
  investmentProgram?: string;
}

/**
 * @interface UpdateFundResponse
 * @extends {UpdateFundRequest}
 * @extends {CSCoreSDK.Signable}
 */
export interface UpdateFundResponse extends UpdateFundRequest, CSCoreSDK.Signable { }