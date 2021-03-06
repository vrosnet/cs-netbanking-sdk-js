import * as CSCoreSDK from 'cs-core-sdk';

/**
 * Get information about the account's services
 * @class AccountServicesResource
 * @extends {CSCoreSDK.Resource}
 * @implements {CSCoreSDK.PaginatedListEnabled<Service>}
 */
export class AccountServicesResource extends CSCoreSDK.Resource
  implements CSCoreSDK.PaginatedListEnabled<Service> {

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
   * Fetches the services and returns them in a promise
   * @param {ServiceParameters=} params
   */
  list = (params?: ServiceParameters): Promise<ServiceList> => {

    return CSCoreSDK.ResourceUtils.CallPaginatedListWithSuffix(this, null, 'services', params, response => {

      // transform ISO dates to native Date objects
      CSCoreSDK.EntityUtils.addDatesToItems(['dateFrom', 'dateTo'], response);

      return response;
    });
  }
}

/**
 * @interface ServiceList
 * @extends {CSCoreSDK.PaginatedListResponse<Service>}
 */
export interface ServiceList extends CSCoreSDK.PaginatedListResponse<Service> { }

/**
 * @interface Service
 */
export interface Service {

  /**
  * Service identifier.
  */
  id: string;

  /**
  * Localized name of the service.
  */
  nameI18N: string;

  /**
  * Information about service group. There is an icon defined for every group.
  */
  iconGroup: string;

  /**
  * Service is active from date.
  */
  dateFrom?: Date;

  /**
  * Service will be active till date.
  */
  dateTo?: Date;
}

/**
 * @interface ServiceParameters
 * @extends {CSCoreSDK.Paginated}
 */
export interface ServiceParameters extends CSCoreSDK.Paginated { }