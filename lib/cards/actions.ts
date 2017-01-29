
import * as CSCoreSDK from 'cs-core-sdk';
import {Signable} from '../common';
import {Confirmation} from './delivery';

/**
 * Issue various actions on a single card. 
 */
export class CardActionsResource extends CSCoreSDK.Resource
implements CSCoreSDK.UpdateEnabled<CardActionRequest, CardActionResponse> {
    
    /**
     * Issues various actions on a single card  
     */ 
    update = (payload: CardActionRequest): Promise<CardActionResponse> => {
        return CSCoreSDK.ResourceUtils.CallUpdate(this, payload).then(response => {
            
            // Remove signInfo from response and add SigningObject with key signing
            CSCoreSDK.SigningUtils.createSigningObject(response, this.getClient(), this.getPath());
            
            return response;
        })
    } 
}

export interface CardActionResponse extends CSCoreSDK.Signable {}

export interface CardActionRequest {
    
   /**
    * Action which should be issued. Possible values are "REISSUE_PIN", "LOCK_CARD", "UNLOCK_CARD", "REPLACE_CARD", "ACTIVATE_CARD", "SET_AUTOMATIC_REPLACEMENT_ON", "SET_AUTOMATIC_REPLACEMENT_OFF".
    */
    action: string;
    
    /**
    * Reason why card should be locked. Possible values are "THEFT" and "LOSS". Relevant only for action "LOCK_CARD".
    */
    lockReason?: string;
    
    /**
    * Information about the confirmation
    */
    confirmations?: [Confirmation];
}