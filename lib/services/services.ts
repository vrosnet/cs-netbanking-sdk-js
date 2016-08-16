/// <reference path="../../node_modules/cs-core-sdk/dist/cs-core-sdk.node.d.ts" />
import CSCoreSDK = require('cs-core-sdk');
import {ServiceList, Service, ServiceParameters} from '../accounts/services'; 

export class ServicesResource extends CSCoreSDK.Resource
implements CSCoreSDK.PaginatedListEnabled<Service> {

    constructor(basePath: string, client: CSCoreSDK.WebApiClient) {    
        super(basePath, client);
        
        // insert 'cz' resource into the resource's path because the api requires it in some resources
        this._path = this.getPath().replace('/my', '/cz/my');
    }

    list = (params?: ServiceParameters): Promise<ServiceList> => {
        return CSCoreSDK.ResourceUtils.CallPaginatedListWithSuffix(this, null, 'services', params, response => {
            CSCoreSDK.EntityUtils.addDatesToItems(['dateFrom', 'dateTo'], response);

            return response;
        });
    }
}