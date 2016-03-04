/// <reference path="../../node_modules/cs-core-sdk/dist/cs-core-sdk.node.d.ts" />
import CSCoreSDK = require('cs-core-sdk');
import {Amount} from '../common';

export interface RepaymentList extends CSCoreSDK.PaginatedListResponse<Repayment> {}

export interface Repayment {
    repaymentDate: Date,
    amount: Amount,
    paidAmount?: Amount   
}