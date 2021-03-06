import * as CSCoreSDK from 'cs-core-sdk';
import { Amount, Signable, AccountNumber, NetbankingParameters, NetbankingEmptyResponse } from '../common';
import { PaymentBookingDateResource } from './bookingDate';
import { PaymentsDomesticResource } from './domestic';
import { PaymentLimitsResource } from './limits';
import { PaymentMobileResource } from './mobile';
import { Symbols } from '../common';

/**
 * Get information about payments orders
 * @class OrdersResource
 * @extends {CSCoreSDK.Resource}
 */
export class OrdersResource extends CSCoreSDK.Resource {

  /**
   * Returns PaymentsResource for listing, deleting and accessing other information about payments
   * @returns {PaymentsResource}
   */
  get payments(): PaymentsResource {
    return new PaymentsResource(this.getPath() + '/payments', this._client);
  }
}

/**
 * List payments, get individual payment and other resources
 * @class PaymentsResource
 * @extends {CSCoreSDK.Resource}
 * @implements {CSCoreSDK.HasInstanceResource<PaymentResource>}
 * @implements {CSCoreSDK.PaginatedListEnabled<Payment>}
 */
export class PaymentsResource extends CSCoreSDK.Resource
  implements CSCoreSDK.HasInstanceResource<PaymentResource>, CSCoreSDK.PaginatedListEnabled<Payment> {

  /**
   * List all payments
   * @param {NetbankingParameters=} params
   * @returns {Promise<PaymentList>}
   */
  list = (params?: NetbankingParameters): Promise<PaymentList> => {

    // transform "sort" and "order" parameters to comma separated list from array
    CSCoreSDK.EntityUtils.transformArrayParamsToString(params, ['sort', 'order']);

    return CSCoreSDK.ResourceUtils.CallPaginatedListWithSuffix(this, null, 'order', params, response => {

      response.items.forEach(item => {

        // transform ISO dates to native Date objects
        CSCoreSDK.EntityUtils.addDatesFromISO(['cz-orderingDate', 'executionDate', 'modificationDate', 'transferDate'], item);

        // Remove signInfo from response and add SigningObject with key signing
        CSCoreSDK.SigningUtils.createSigningObject(item, this.getClient(), `${this.getClient().getPath()}/orders/payments/${(<Payment>item).id}`);

        // add convenient get and delete methods for fetching order's detail and removing order
        resourcifyListing(<Payment>item, this.withId((<Payment>item).id));
      });
      return response;
    })
  }

  /**
   * Get individual payment with a given id
   * @param {string|number} id
   * @returns {PaymentResource}
   */
  withId = (id: string | number): PaymentResource => {
    return new PaymentResource(id, this.getPath(), this._client);
  }

  /**
   * Get currently available booking date
   * @returns {PaymentBookingDateResource}
   */
  get bookingDate(): PaymentBookingDateResource {
    return new PaymentBookingDateResource(this.getPath() + '/bookingdate', this._client);
  }

  /**
   * Create domestic payment order
   * @returns {PaymentsDomesticResource}
   */
  get domestic(): PaymentsDomesticResource {
    return new PaymentsDomesticResource(this.getPath() + '/domestic', this._client);
  }

  /**
   * Get remaining amounts for payment orders
   * @returns {PaymentLimitsResource}
   */
  get limits(): PaymentLimitsResource {
    return new PaymentLimitsResource(this.getPath() + '/limits', this._client);
  }

  /**
   * Recharging the credit available on prepaid cards provided by Vodafone, T-Mobile or O2.
   * @returns {PaymentMobileResource}
   */
  get mobile(): PaymentMobileResource {
    return new PaymentMobileResource(this.getPath() + '/mobile', this._client);
  }
}

/**
 * Individual Payment order resource
 * @class PaymentResource
 * @extends {CSCoreSDK.InstanceResource}
 * @implements {CSCoreSDK.GetEnabled<Payment>}
 * @implements {CSCoreSDK.DeleteEnabled<NetbankingEmptyResponse>}
 */
export class PaymentResource extends CSCoreSDK.InstanceResource
  implements CSCoreSDK.GetEnabled<Payment>, CSCoreSDK.DeleteEnabled<NetbankingEmptyResponse> {

  /**
   * Get detail of the payment
   * @returns {Promise<Payment>}
   */
  get = (): Promise<Payment> => {
    return CSCoreSDK.ResourceUtils.CallGet(this, null).then(payment => {

      // transform ISO dates to native Date objects
      CSCoreSDK.EntityUtils.addDatesFromISO(['cz-orderingDate', 'executionDate', 'modificationDate', 'transferDate'], payment);

      // Remove signInfo from response and add SigningObject with key signing
      CSCoreSDK.SigningUtils.createSigningObject(payment, this.getClient(), `${this.getClient().getPath()}/orders/payments/${(<Payment>payment).id}`);

      return payment;
    });
  }

  /**
   * Delete payment
   * @returns {Promise<NetbankingEmptyResponse>}
   */
  delete = (): Promise<NetbankingEmptyResponse> => {
    return CSCoreSDK.ResourceUtils.CallDelete(this, null);
  }

}

function resourcifyListing(paymentListing: Payment, paymentResource: PaymentResource) {
  paymentListing.get = paymentResource.get;
  paymentListing.delete = paymentResource.delete;
}

/**
 * @interface PaymentList
 * @extends {CSCoreSDK.PaginatedListResponse<Payment>}
 */
export interface PaymentList extends CSCoreSDK.PaginatedListResponse<Payment> { }

/**
 * @interface Payment
 * @extends {CSCoreSDK.Signable}
 */
export interface Payment extends CSCoreSDK.Signable {

  /**
  * Internal identifier of payment order. Note that after signing of the order the id could change.
  */
  id: string;

  /**
  * Transaction reference ID provided by BE when payment order was executed.
  */
  referenceId?: string;

  /**
  * Payment order category determines whether payment is domestic, SEPA, international or inside the bank (domestic, but could be different processing) or between accounts of the same user (domestic, but with better fee policy). Possible values: DOMESTIC, OWN_TRANSFER, SEPA, INTERNATIONAL.
  */
  orderCategory: string;

  /**
  * Payment order type (outgoing payment, outgoing direct debit, incoming direct debit) determines further transaction processing in BE. Values: PAYMENT_OUT, DIRECT_DEBIT_IN
  */
  orderType: string;

  /**
  * sender name
  */
  senderName?: string;

  /**
  * sender account number
  */
  sender: AccountNumber;

  /**
  * receiver name
  */
  receiverName?: string;

  /**
  * Receiver IBAN in case of international payments.
  */
  receiver: AccountNumber;

  /**
  * payment amount
  */
  amount: Amount;

  /**
  * Information about the symbols
  */
  symbols?: Symbols;

  /**
  * Message for payee set during payment order creation. It is used to identify transaction on receiver side. Array of texts 4x35.
  */
  additionalInfo?: Info;

  /**
  * Message for me set during payment order creation.
  */
  senderReference?: string;

  /**
  * Datetime when payment order was created/updated (the last time) by user (read-only field is automatically setup/changed by BE system based on POST/PUT request).
  */
  executionDate?: Date;

  /**
  * Modification date indicates the last update of payment order done by user or BE system (read-only field provided by BE).
  */
  modificationDate?: Date;

  /**
  * payment transfer date
  */
  transferDate?: Date;

  /**
  * Datetime till when payment order will be repeated on BE in the case of insufficient funds on account.
  */
  expirationDate?: Date;

  /**
  * Date and time which should be used for default ordering of the payment orders for display.
  */
  "cz-orderingDate": Date;

  /**
  * Status of the payment order (details above), State of payment order presented to user on FE). Possible values: OPEN, SPOOLED, CANCELLED, CLOSED and DELETED
  */
  state: string;

  /**
  * State detail of payment order provided based on BE technical states.
  */
  stateDetail: string;

  /**
  * Indicator whether state (stateDetail value) of payment order is OK from user point of view. For mapping between stateDetail and stateOk indicator values see table below.
  */
  stateOk: boolean;

  /**
  * description of payment order, transaction type
  */
  "cz-description"?: string;

  /**
  * ID of the application via which this payment order was entered/modified the last time. Possible values: GEORGE, ATM_PAYMENT, ATM_OTHER, GSM, BRANCH_FE, POST_OFFICE, INTERNET_BANKING, TELEPHONE_BANKER, COLLECTION_BOX, VIDEO_BANKER and UNKNOWN.
  */
  applicationId?: string;

  /**
  * ID of the channel via which this payment order was entered/modified the last time. Possible values: NET_BANKING, ATM, MOBILE_BANKING, ATM, BRANCH, POST_OFFICE, CALL_CENTRE, VIDEO_BANKING and UNKNOWN
  */
  channelId?: string;

  /**
  * Receiver's address
  */
  receiverAddress?: string;

  /**
  * Array of optional Flag values depends on Payment order category, type.
  */
  flags?: [string];

  /**
   * Convenience method for retrieving payment's detail
   * @returns {Promise<Payment>}
   */
  get: () => Promise<Payment>;

  /**
   * Convenience method for removing payment
   * @returns {Promise<NetbankingEmptyResponse>}
   */
  delete: () => Promise<NetbankingEmptyResponse>;
}

/**
 * @interface Info
 */
export interface Info {

  /**
  * Message for payee set during payment order creation. It is used to identify transaction on receiver side. Array of texts 4x35.
  */
  text4x35?: [string];
}

/**
 * @interface RemovePaymentOrderResponse
 * @extends {Signable}
 */
export interface RemovePaymentOrderResponse extends Signable { }