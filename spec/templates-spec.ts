
/// <reference path="../build/cs-netbanking-sdk.sfx.d.ts"/>

import * as CSCoreSDK from 'cs-core-sdk';
var netbanking  = require('../build/cs-netbanking-sdk.node.js');
var judge : CSCoreSDK.Judge = null;
var judgeSession : CSCoreSDK.JudgeSession = null;
var client : CSNetbankingSDK.NetbankingClient = null;
var expectToBe = CSCoreSDK.TestUtils.expectToBe;
var expectDate = CSCoreSDK.TestUtils.expectDate;
var logJudgeError = CSCoreSDK.TestUtils.logJudgeError;

describe("Netbanking SDK",function(){
    var originalTimeoutInterval = null;
    
    beforeAll(function(){
        judge = new CSCoreSDK.Judge();
        //Because Judge starts slowly on the first request
        originalTimeoutInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });
    
    afterAll(function(){
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeoutInterval;
    });    
    
    beforeEach(function(){
        CSCoreSDK.useWebApiKey("TEST_API_KEY").useEnvironment(judge.testEnvironment)
        client =  netbanking.getClient();	
        client.sharedContext = null;
        judgeSession = judge.startNewSession();
    });
    
    function testTemplates(response) {
        expectToBe(response.pagination, {
            pageNumber: 0,
            pageCount: 2,
            pageSize: 1,
            nextPage: 1
        });

        expectToBe(response.items[0], {
            id: 'template_0-123-100',
            name: 'Jan Novák',
            orderCategory: 'DOMESTIC'
        });

        expect(response.items[0].get).toBeDefined();
    }

    describe('templates', () => {

        it('tests pagination', done => {
            judgeSession.setNextCase('templates.list.pagination').then(() => {
                return client.templates.list({
                    pageNumber: 0,
                    pageSize: 1
                });
            }).then(response => {
                testTemplates(response);

                return response.nextPage();
            }).then(response => {

                expectToBe(response.pagination, {
                    pageNumber: 1,
                    pageCount: 2,
                    pageSize: 1
                });

                expectToBe(response.items[0], {
                    id: 'template_0-124-100',
                    name: 'Marek Nový'
                });

                return response.prevPage();
            }).then(response => {
                testTemplates(response);

                done();
            }).catch(logJudgeError);
        });

        it('retrieves detail', done => {
            judgeSession.setNextCase('templates.withId.get').then(() => {
                return client.templates.withId('template_0-123-100').get();
            }).then(response => {
                expectToBe(response, {
                    id: 'template_0-123-100',
                    name: 'Jan Novák',
                    orderCategory: 'DOMESTIC',
                });

                done();
            }).catch(logJudgeError);
        });
    });
});

