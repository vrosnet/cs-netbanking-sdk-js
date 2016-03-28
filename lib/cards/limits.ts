/// <reference path="../../node_modules/cs-core-sdk/dist/cs-core-sdk.node.d.ts" />
import CSCoreSDK = require('cs-core-sdk');
import {Amount, Signable} from '../common';
import {Confirmation} from './delivery';

/**
* Get information about different limits
*/
export class CardLimitsResource extends CSCoreSDK.Resource
implements CSCoreSDK.ListEnabled<CardsLimit>, CSCoreSDK.UpdateEnabled<ChangeCardLimitsRequest, ChangeCardLimitsResponse> {
    
    /**
     * List all limits  
     */ 
    list = () : Promise<CardsLimitList> => {
        return CSCoreSDK.ResourceUtils.CallListWithSuffix(this, null, 'limits');
    }
    
    /**
     * Update individual limits  
     */ 
    update = (payload: ChangeCardLimitsRequest): Promise<ChangeCardLimitsResponse> => {
        return CSCoreSDK.ResourceUtils.CallUpdate(this, payload);
    }
}

export interface CardsLimitList {
    limits?: [CardsLimit]
}

export interface CardsLimit {
    
    /**
    * Limit type defines ATM, POS, internet/eCommerce, total limits. Possible Values: ATM, POS, INTERNET
    */
    limitType: string;
    
    /**
    * Bank limit's period in days defined for limit type (default daily - 1D). Possible Values: 1D, 2D, 3D, 5D, 7D, 10D, 15D, 30D
    */
    limitPeriod: string;
    
    /**
    * Current limit amount valid for limit's type and period
    */
    limit?: Amount;
    
    /**
    * Temporary limit amount valid for limit's type and period
    */
    temporaryLimit?: Amount;
    
    /**
    * Temporary limit expiration date for limit's type and period. Field is mandatory if temporatyLimits are changed by PUT call. It is possible to set temporaryLimitExpiration up to 120 hours to the future.
    */
    temporaryLimitExpiration?: Date;
    
    /**
    * Maximum limit amount for card defined by bank valid for limit's type and period.
    */
    bankLimit?: Amount;
}

export interface ChangeCardLimitsResponse extends Signable {
    
    limits?: [CardsLimit];
    /**
    * Information about the confirmation
    */
    confirmations?: [Confirmation];
}

export interface ChangeCardLimitsRequest {
    
    limits?: [CardsLimit]
    /**
    * Information about the confirmation
    */
    confirmations?: [Confirmation];
}