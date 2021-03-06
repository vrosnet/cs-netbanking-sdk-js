import * as CSCoreSDK from 'cs-core-sdk';
import { Amount, AccountNumber, Signable, NetbankingParameters } from '../common';
import { CardDeliveryResource } from './delivery';
import { CardTransactionsResource } from './transactions';
import { CardActionsResource } from './actions';
import { CardLimitsResource } from './limits';
import { CardSecure3DResource } from './secure3D';
import { CardTransferResource } from './transfer';
import { CardAccountsResource } from './statements';

/**
 * Represents list of payment cards (either debet or credit) for current user. Every card was issued for current user or belongs to one of his accounts.
 * @class CardsResource
 * @extends {CSCoreSDK.Resource}
 * @implements {CSCoreSDK.PaginatedListEnabled<Card>}
 * @implements {CSCoreSDK.HasInstanceResource<CardResource>}
 */
export class CardsResource extends CSCoreSDK.Resource
  implements CSCoreSDK.PaginatedListEnabled<Card>, CSCoreSDK.HasInstanceResource<CardResource> {

  /**
   * List all cards 
   * @param {Promise<CardList>=} params
   * @returns {Promise<CardList>}
   */
  list = (params?: NetbankingParameters): Promise<CardList> => {

    // transform "sort" and "order" parameters to comma separated list from array
    CSCoreSDK.EntityUtils.transformArrayParamsToString(params, ['sort', 'order']);

    return CSCoreSDK.ResourceUtils.CallPaginatedListWithSuffix(this, null, 'cards', params, response => {

      response.items.forEach(item => {

        // add convenient methods to items in the list
        resourcifyListing(<Card>item, this.withId((<Card>item).id), true);

        // transform ISO dates to native Date objects
        transformResponse(item);
      });

      return response;
    });
  }

  /**
   * Get a resource for card with a given id 
   * @param {string} id
   * @returns {CardResource}
   */
  withId = (id: string): CardResource => {
    return new CardResource(id, this.getPath(), this.getClient());
  }
}

/**
 * @class CardResource
 * @extends {CSCoreSDK.InstanceResource}
 * @implements {CSCoreSDK.GetEnabled<Card>}
 * @implements {CSCoreSDK.UpdateEnabled<ChangeCardSettingsRequest, ChangeCardSettingsResponse>}
 */
export class CardResource extends CSCoreSDK.InstanceResource
  implements CSCoreSDK.GetEnabled<Card>, CSCoreSDK.UpdateEnabled<ChangeCardSettingsRequest, ChangeCardSettingsResponse> {

  /**
   * Get detail of the card
   * @returns {Promise<Card>}
   */
  get = (): Promise<Card> => {
    return CSCoreSDK.ResourceUtils.CallGet(this, null).then(card => {

      // add convenient methods to items in the list
      resourcifyListing(<Card>card, this, false);

      // transform ISO dates to native Date objects
      transformResponse(card);

      return card;
    });
  }

  /**
   * Update card's alias
   * @param {ChangeCardSettingsRequest} payload
   * @returns {Promise<ChangeCardSettingsResponse>}
   */
  update = (payload: ChangeCardSettingsRequest): Promise<ChangeCardSettingsResponse> => {
    return CSCoreSDK.ResourceUtils.CallUpdate(this, payload).then(card => {

      // add convenient methods to items in the list
      resourcifyListing(<Card>card, this, false);

      // transform ISO dates to native Date objects
      transformResponse(card);

      return card;
    })
  }

  /**
   * Get current delivery settings
   * @returns {CardDeliveryResource}
   */
  get delivery(): CardDeliveryResource {
    return new CardDeliveryResource(this.getPath() + '/delivery', this._client);
  }

  /**
   * Allows to add or change a client's personal note and mark/star the card transaction as favorite/important for one specific transaction
   * @returns {CardTransactionsResource}
   */
  get transactions(): CardTransactionsResource {
    return new CardTransactionsResource(this.getPath() + '/transactions', this._client);
  }

  /**
   * Issue various actions on a single card. Currently supported actions are: 
   * reissue pin, lock card, unlock card, activate card, set automatic card replacement on, set automatic card replacement off, replacement card request
   * @returns {CardActionsResource}
   */
  get actions(): CardActionsResource {
    return new CardActionsResource(this.getPath() + '/states', this._client);
  }

  /**
   * Get information about different limits
   * @returns {CardLimitsResource}
   */
  get limits(): CardLimitsResource {
    return new CardLimitsResource(this.getPath() + '/card-limits', this._client);
  }

  /**
   * Get the 3D secure online shopping status
   * @returns {CardSecure3DResource}
   */
  get secure3d(): CardSecure3DResource {
    return new CardSecure3DResource(this.getPath() + '/secure-online-shopping', this._client);
  }

  /**
   * Resource for paying up credit card debt
   * @returns {CardTransferResource}
   */
  get transfer(): CardTransferResource {
    return new CardTransferResource(this.getPath() + '/transfer', this._client);
  }

  /**
   * Account resource for listing statements
   * @returns {CardAccountsResource}
   */
  get accounts(): CardAccountsResource {
    return new CardAccountsResource(this.getPath() + '/mainaccount', this._client);
  }
}

function resourcifyListing(itemListing: Card, itemResource: CardResource, isFromList: boolean) {
  if (isFromList) {
    itemListing.get = itemResource.get;
  }
  itemListing.update = itemResource.update;
  itemListing.delivery = itemResource.delivery;
  itemListing.transactions = itemResource.transactions;
  itemListing.actions = itemResource.actions;
  itemListing.limits = itemResource.limits;
  itemListing.secure3d = itemResource.secure3d;
  itemListing.transfer = itemResource.transfer;
  itemListing.accounts = itemResource.accounts;
}

function transformResponse(item) {
  CSCoreSDK.EntityUtils.addDatesFromISO(['expiryDate', 'validFromDate'], item);
}

/**
 * @interface CardList
 * @extends {CSCoreSDK.PaginatedListResponse<Card>}
 */
export interface CardList extends CSCoreSDK.PaginatedListResponse<Card> { }

/**
 * @interface Card
 */
export interface Card {

  /**
  * unique product id
  */
  id: string;

  /**
  * Users product name. Max. 50 characters.
  */
  alias?: string;

  /**
  * product owner
  */
  owner: string;

  /**
  * card number
  */
  number: string;

  /**
  * Card sequence number. The number distinguishing between separate cards (different plastic cards) with the same Primary Account Number (PAN)
  */
  sequenceNumber: string;

  /**
  * Localized product name.
  */
  productI18N: string;

  /**
  * Internal product code.
  */
  productCode?: string;

  /**
  * Expiration date of particular plastic card
  */
  expiryDate?: Date;

  /**
  * Date from which this particular plastic card is valid
  */
  validFromDate?: Date;

  /**
  * Current state of card. Possible values: ACTIVE, INACTIVE (issued card not activated yet), TEMPORARY_BLOCKED.
  */
  state: string;

  /**
  * Type of card: credit, debit/bankcard. Possible Values: BANK_CARD (used for debit card too), CREDIT
  */
  type: string;

  /**
  * Credit card provider/issuer: Erste Bank or external bank. Possible Values: ERSTE_BANK, EXTERNAL
  */
  provider: string;

  /**
  * Indicates reason for locking the card. Possible Values: THEFT, LOSS, FRAUD, OTHER
  */
  lockReason?: string;

  /**
  * Card characteristics. Possible values: MAIN, AUTHORIZED
  */
  characteristics?: string;

  /**
  * For credit card: Loan limit for card (shadow) account.
  */
  limit?: Amount;

  /**
  * Disposable balance of current account linked to debit/bank card or Available balance of credit card (disposable balance of shadow account). Not available for all cards or states (locked, closed, unknown).
  */
  balance?: Amount;

  /**
  * Total outstanding/owed amount for credit card (the last known value).
  */
  outstandingAmount?: Amount;

  /**
  * Minimal installment repayment amount for credit card (at previous cycle end date).
  */
  minimalMonthlyAmount?: Amount;

  /**
  * Installment repayment due date.
  */
  installmentDueDate?: Date;

  /**
  * Information about the main account.
  */
  mainAccount?: CardMainAccount;

  /**
  * Information about the main account's limits.
  */
  "cz-overallCardAccountLimits"?: CardAccountLimits;

  /**
  * Indicates how a client receives their card and pin. Possible values: BRANCH, HOME, OTHER_BRANCH, ADDRESS_ABROAD.
  */
  cardDeliveryMode?: string;

  /**
  * Array of optional features valid for given card.
  */
  features?: [string];

  /**
  * Array of optional Flag values depends on Card type.
  */
  flags?: [string];

  /**
   * Convenience method for getting detail of the card right from the list 
   * @returns {Promise<Card>}
   */
  get: () => Promise<Card>;

  /**
   * Convenience method for updating card's settings
   * @param {ChangeCardSettingsRequest} payload
   * @returns {Promise<ChangeCardSettingsResponse>}
   */
  update: (payload: ChangeCardSettingsRequest) => Promise<ChangeCardSettingsResponse>;

  /**
  * Convenience getter for getting card's delivery resource
  */
  delivery: CardDeliveryResource;

  /**
  * Convenience getter for getting card's transactions resource
  */
  transactions: CardTransactionsResource;

  /**
  * Convenience getter for getting card's actions resource
  */
  actions: CardActionsResource;

  /**
  * Convenience getter for getting card's limits resource
  */
  limits: CardLimitsResource;

  /**
  * Convenience getter for getting card's 3D Secure resource
  */
  secure3d: CardSecure3DResource;

  /**
  * Convenience getter for getting card's transfer resource
  */
  transfer: CardTransferResource;

  /**
  * Convenience getter for getting card's accounts resource
  */
  accounts: CardAccountsResource;
}

/**
 * @interface CardAccountLimits
 */
export interface CardAccountLimits {

  /**
  * Daily ATM limit on credit line. Daily ATM limit for all credit cards issued to mainAccount.
  */
  limitATM?: Amount;

  /**
  * Daily POS limit on credit line. Daily POS limit for all credit cards issued to mainAccount.
  */
  limitPOS?: Amount;
}

/**
 * @interface CardMainAccount
 */
export interface CardMainAccount {

  /**
  * Internal ID as reference for account provided by BE
  */
  id?: string;

  /**
  * Full name of the main account's holder.
  */
  holderName: string;

  /**
  * Main account is credit card shadow account for credit card or linked main current account for bank/debit card.
  */
  accountno: AccountNumber;
}

/**
 * @interface ChangeCardSettingsResponse
 * @extends {Card}
 * @extends {Signable}
 */
export interface ChangeCardSettingsResponse extends Card, Signable {

  /**
  * ID of the branch
  */
  branchId?: string;
}

/**
 * @interface ChangeCardSettingsRequest
 */
export interface ChangeCardSettingsRequest {

  /**
  * Alias of the card
  */
  alias?: string;
}