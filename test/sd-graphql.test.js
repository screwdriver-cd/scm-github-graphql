'use strict';

const sinon = require('sinon');
const assert = require('assert');
const rewireMock = require('rewiremock/node');

sinon.assert.expose(assert, {
    prefix: ''
});

describe('SDGraphQLClient', () => {
    let client;
    let SDGraphQLClient;
    let requestMock;

    beforeEach(() => {
        requestMock = sinon.stub();
        SDGraphQLClient = rewireMock.proxy('../sd-graphql', {
            'screwdriver-request': requestMock
        });

        client = new SDGraphQLClient({
            graphqlUrl: 'https://api.ai.com/graphql',
            token: 'ghp_abcdef'
        });
    });

    it('should initialize SDGraphQLClient', () => {
        // Test the initialization of SDGraphQLClient
        assert.ok(client instanceof SDGraphQLClient);
    });

    it('should make a GraphQL query', async () => {
        // Test making a GraphQL query using SDGraphQLClient
        const query = `
            query GetUser($login: String!) {
                user(login: $login) {
                    name
                    email
                    login
                }
            }
        `;

        const variables = {
            login: 'ai_humanoid'
        };

        const expectedResponse = {
            body: {
                data: {
                    user: {
                        name: 'AI Humanoid',
                        email: 'ai.humanoid@agi.com',
                        login: 'ai_humanoid'
                    }
                }
            }
        };

        requestMock.resolves(expectedResponse);

        const response = await client.query(query, variables);

        assert.ok(response);
        assert.ok(response.data);
        assert.ok(response.data.user);
        assert.strictEqual(response.data.user.name, 'AI Humanoid');
        assert.strictEqual(response.data.user.email, 'ai.humanoid@agi.com');
        assert.calledOnce(requestMock);
    });

    it('should make a GraphQL mutation', async () => {
        const mutation = `
            mutation {
                addWebhook(input: {
                    url: "https://example.com/webhook",
                    secret: "mysecret"
                }) {
                    id
                    url
                    secret
                }
            }
        `;

        const expectedResponse = {
            body: {
                data: {
                    addWebhook: {
                        id: 3,
                        url: 'https://example.com/webhook',
                        secret: 'mysecret'
                    }
                }
            }
        };

        requestMock.resolves(expectedResponse);

        const response = await client.mutate(mutation);

        assert.ok(response);
        assert.ok(response.data);
        assert.ok(response.data.addWebhook);
        assert.strictEqual(response.data.addWebhook.id, 3);
        assert.strictEqual(response.data.addWebhook.url, 'https://example.com/webhook');
        assert.strictEqual(response.data.addWebhook.secret, 'mysecret');
        assert.calledOnce(requestMock);
    });
});
