/// <reference path="../node_modules/cs-core-sdk/dist/cs-core-sdk.node.d.ts" />
import CSCoreSDK = require('cs-core-sdk');

export interface Signed {
    /**
    * 
    */
    signInfo?: SignInfo
}

export interface SignInfo {
    
    /**
    * State of signing process.
    */
    state: string,
    
    /**
    * Hash value.
    */
    signId?: number
}

export interface AccountNumber {
    
    /**
    * Account number with possible prefix. Format is "XXXXXX-NNNNNNNNNN" if prefix is not null or "000000". If prefix is not provided then format is "NNNNNNNNNN" without leading zeros.
    */
    number: string,
    
    /**
    * Bank Code
    */
    bankCode: string,
    
    /**
    * Code of the Country - 2 characters; mandatoryfor international orders.
    */
    countryCode?: string,
    
    /**
    * IBAN
    */
    // cz-iban: string,
    
    /**
    * BIC
    */
    // cz-bic: string,
}

export interface Amount {
    
    /**
    * Value of an amount. Number without decimal part.
    */
    value: number,
    
    /**
    * Precision of the amount. How many digits from value fields should be considered to be decimal.
    */
    precision: number,
    
    /**
    * Currency of the amount.
    */
    currency: string
}

export interface StatementList extends CSCoreSDK.PaginatedListResponse<Statement> {}

export interface Statement {
    
    /**
    * Identifier of statement in BE system.
    */
    id: string,
    
    /**
    * Statement sequence number.
    */
    number: number,
    
    /**
    * Timestamp of statement creation.
    */
    statementDate: Date,
    
    /**
    * Periodicity of account statement creation. Possible values are: DAILY, WEEKLY, BI_WEEKLY, MONTHLY, QUARTERLY, HALFYEARLY, YEARLY, 10_YAERLY, OTHER
    */
    periodicity: string,
    
    /**
    * Statement format. Possible value is PDF_A4
    */
    format?: string,
    
    /**
    * Language version of created statement. ISO 639-1 ENUM values: en, de, cs, sk, hr, sr, ro, hu, fr (fr is local specific)
    */
    language: string,
    
    /**
    * Number of files for of the whole statement.
    */
    //cz-fileTotalNumber: string,
    
    /**
    * File number - to recognize order of the file if the statement is separated into several files.
    */
    //cz-fileOrderNumber: string
}

export interface AddNoteAndMarkTransactionsRequest {
    
    /**
    * Personal, user specific note for transaction. Max. 4 000 characters.
    */
    note?: string,
    
    /**
    * List of flags.
    */
    flags?: [string]
}

export interface TransactionList extends CSCoreSDK.PaginatedListResponse<Transaction>, Signed {}

export interface Transaction {
    
    /**
    * Transaction identifier.
    */
    id: string,
    
    /**
    * Personal, user specific note for transaction. Max. 4 000 characters.
    */
    note?: string,
    
    /**
    * List of flags.
    */
    flags?: [string]
}