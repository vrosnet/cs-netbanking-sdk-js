/// <reference path="../../node_modules/cs-core-sdk/dist/cs-core-sdk.node.d.ts" />
import CSCoreSDK = require('cs-core-sdk');
import {Amount} from '../common';

export class GoalsResource extends CSCoreSDK.Resource
implements CSCoreSDK.ListEnabled<Goal>, CSCoreSDK.UpdateEnabled<UpdateGoal, UpdateGoal> {

    constructor(basePath: string, client: CSCoreSDK.WebApiClient) {    
        super(basePath, client);
        
        // insert 'cz' resource into the resource's path because the api requires it in some resources
        this._path = this.getPath().replace('/my', '/cz/my');
    }

    /**
     * Returns list of user's saving goals except of completed ones. In price, only CZK currency is supported. If user has never set any goal, the response is empty.
     */
    list = (): Promise<GoalList> => {
        return CSCoreSDK.ResourceUtils.CallListWithSuffix(this, null, 'goals');
    }

    /**
     * Set new value of goals. In price, only CZK currency is supported. If completed flag is not present, false value is supposed. All goals of given client are replaced - old ones (except of completed) are deleted and these new specified are inserted.
     */
    update = (payload: UpdateGoal): Promise<UpdateGoal> => {
        return CSCoreSDK.ResourceUtils.CallUpdate(this, payload);
    }
}

export interface GoalList extends CSCoreSDK.ListResponse<Goal> {}

export interface Goal {

    /**
     * Saving goal name. Must be non-empty and unique among goals of one client.
     */
    name: string;

    /**
     * Price of the saving goal.
     */
    price: Amount;

    /**
     * Maximal date (deadline) of the saving goal completion.
     */
    deadline: Date;

    /**
     * Flag of the completed goal.
     */
    completed: boolean;
}

export interface UpdateGoal {
    goals: [Goal]
}