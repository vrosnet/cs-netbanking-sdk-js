import * as CSCoreSDK from 'cs-core-sdk';
import { Amount, Signable } from '../../common';

/**
 * @class InsurancesContractServicesResource
 * @extends {CSCoreSDK.Resource}
 * @implements {CSCoreSDK.ListEnabled<InsuranceService>}
 */
export class InsurancesContractServicesResource extends CSCoreSDK.Resource
  implements CSCoreSDK.ListEnabled<InsuranceService> {

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
   * Returns list of services for the life insurance
   * @returns {Promise<InsuranceServiceList>}
   */
  list = (): Promise<InsuranceServiceList> => {
    return CSCoreSDK.ResourceUtils.CallListWithSuffix(this, null, 'services').then(response => {

      response.items.forEach(x => {
        transformDates(x);
      });

      return response;
    });
  }

  /**
   * Allows activation of risk sports insurance.
   * @param {RiskSportsUpdateRequest} payload
   * @returns {Promise<ActivateRiskSportsResponse>}
   */
  activateRiskSports = (payload: RiskSportsUpdateRequest): Promise<ActivateRiskSportsResponse> => {

    CSCoreSDK.EntityUtils.transformDatesToSimpleISO(['dateFrom', 'dateTo'], payload);

    return CSCoreSDK.ResourceUtils.CallUpdateWithSuffix(this, 'riskSportsActivation', payload).then(response => {

      transformDates(response);
      CSCoreSDK.SigningUtils.createSigningObject(response, this.getClient(), this.getPath());

      return response;
    });
  }

  /**
   * Allows deactivation of risk sports insurance.
   * @param {RiskSportsUpdateRequest} payload
   * @returns {Promise<DeactivateRiskSportsResponse>}
   */
  deactivateRiskSports = (payload: RiskSportsUpdateRequest): Promise<DeactivateRiskSportsResponse> => {

    CSCoreSDK.EntityUtils.transformDatesToSimpleISO(['dateFrom', 'dateTo'], payload);

    return CSCoreSDK.ResourceUtils.CallUpdateWithSuffix(this, 'riskSportsDeactivation', payload).then(response => {

      CSCoreSDK.SigningUtils.createSigningObject(response, this.getClient(), this.getPath());

      return response;
    });
  }
}

function transformDates(response) {
  CSCoreSDK.EntityUtils.addDatesFromISO(['dateFrom', 'dateTo'], response);
}

/**
 * @interface InsuranceServiceList
 * @extends {CSCoreSDK.ListResponse<InsuranceService>}
 */
export interface InsuranceServiceList extends CSCoreSDK.ListResponse<InsuranceService> { }

/**
 * @interface InsuranceService
 */
export interface InsuranceService {

  /**
   * indicator for FE for grouping services to boxes. Possible values: RISK_SPORTS, SERVICE
   */
  group: string;

  /**
   * service id
   */
  id: string;

  /**
   * service icon group
   */
  iconGroup: string;

  /**
   * service name
   */
  nameI18N: string;

  /**
   * Description of the service.
   */
  descriptionI18N: string;

  /**
   * relevant only for RISK_SPORTS group. For those number of days this service can be activated this year at all.
   */
  availableDays: string;

  /**
   * Starting date of active service. Relevant for RISK_SPORTS.
   */
  activeFrom: Date;

  /**
   * Ending date of active service. Relevant for RISK_SPORTS.
   */
  activeTo: Date;

  /**
   * Amount of bonus. Relevant for NO_CLAIM_BONUS, LOYALTY_BONUS.
   */
  bonusAmount: Amount;

  /**
   * Indicates service state. Three possible values: ACTIVATED - insurance was already activated but will be active in the future. ACTIVE - insurance is active right now. INACTIVE - insurance is neither activated nor active.
   */
  state: string;
}

/**
 * @interface RiskSportsUpdateRequest
 */
export interface RiskSportsUpdateRequest {

  dateFrom: Date;

  dateTo: Date;

  phoneNumber: string;
}

/**
 * @interface ActivateRiskSportsResponse
 * @extends {RiskSportsUpdateRequest}
 * @extends {CSCoreSDK.Signable}
 */
export interface ActivateRiskSportsResponse extends RiskSportsUpdateRequest, CSCoreSDK.Signable {

  policyNumber: string;
}

/**
 * @interface DeactivateRiskSportsResponse
 * @extends {CSCoreSDK.Signable}
 */
export interface DeactivateRiskSportsResponse extends CSCoreSDK.Signable { }