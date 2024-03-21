'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const rewireMock = require('rewiremock/node');
const queries = require('../queries');

sinon.assert.expose(assert, {
    prefix: ''
});

describe('GithubGraphQL', () => {
    let githubGql;
    let GithubScmGraphQL;
    // let sdGqlMock;

    const mockUser = {
        type: 'User',
        id: 'U_abcdef',
        name: 'Cyborg',
        login: 'cyborg'
    };

    const mockUser1 = {
        type: 'EnterpriseUserAccount',
        id: 'EUA_abcdef',
        name: 'AI Humanoid',
        login: 'ai_humanoid'
    };
    const mockUser2 = {
        type: 'EnterpriseUserAccount',
        id: 'EAU_abcd1234',
        name: 'Human Being',
        login: 'human_being'
    };

    const config = {
        githubGraphQLUrl: 'https://api.github.com/graphql'
    };
    const token = 'ghp_abcdef';

    before(() => {
        // eslint-disable-next-line global-require
        GithubScmGraphQL = require('../index');

        class SDGraphQLClient {
            constructor(cfg) {
                this.config = cfg;
            }
        }

        GithubScmGraphQL = rewireMock.proxy('../index', {
            '../sd-graphql': SDGraphQLClient
        });

        githubGql = new GithubScmGraphQL(config);
        githubGql.sdGql.query = sinon.stub();
        githubGql.sdGql.mutate = sinon.stub();
    });

    it('should get enterprise user account', async () => {
        const slug = 'slug';
        const username = 'ai_humanoid';
        const data = {
            enterprise: {
                members: {
                    totalCount: 1,
                    nodes: [mockUser1]
                }
            }
        };

        githubGql.sdGql.query.resolves({ data });

        const result = await githubGql.getEnterpriseUserAccount({
            slug,
            username,
            token
        });

        assert.deepEqual(result, data.enterprise.members.nodes[0]);
        assert.calledWith(githubGql.sdGql.query, {
            query: queries.GetEnterpriseUserAccount,
            variables: { slug, query: username },
            token
        });
    });

    it('should return null if no enterprise user account', async () => {
        const slug = 'slug';
        const username = 'ai_humanoid';
        const data = {
            enterprise: {
                members: {
                    totalCount: 0
                }
            }
        };

        githubGql.sdGql.query.resolves({ data });

        const result = await githubGql.getEnterpriseUserAccount({
            slug,
            username,
            token
        });

        assert.equal(result, null);
        assert.calledWith(githubGql.sdGql.query, {
            query: queries.GetEnterpriseUserAccount,
            variables: { slug, query: username },
            token
        });
    });

    it('should list enterprise members', async () => {
        const slug = 'slug';

        const data = {
            enterprise: {
                members: {
                    totalCount: 2,
                    nodes: [mockUser1, mockUser2],
                    pageInfo: {
                        hasNextPage: false
                    }
                }
            }
        };

        githubGql.sdGql.query.resolves({ data });

        const result = await githubGql.listEnterpriseMembers({
            slug,
            token
        });

        assert.deepEqual(result, [mockUser1, mockUser2]);
        assert.calledWith(githubGql.sdGql.query, {
            query: queries.ListEnterpriseMembers,
            variables: { slug, cursor: null },
            token
        });
    });

    it('should list enterprise members with pagination', async () => {
        const slug = 'slug';
        const data1 = {
            enterprise: {
                members: {
                    totalCount: 2,
                    nodes: [mockUser1],
                    pageInfo: {
                        hasNextPage: true,
                        endCursor: 'cursor1'
                    }
                }
            }
        };

        const data2 = {
            enterprise: {
                members: {
                    totalCount: 2,
                    nodes: [mockUser2],
                    pageInfo: {
                        hasNextPage: false
                    }
                }
            }
        };

        githubGql.sdGql.query = sinon.stub().resolves();

        githubGql.sdGql.query
            .onFirstCall()
            .resolves({ data: data1 })
            .onSecondCall()
            .resolves({ data: data2 });

        const result = await githubGql.listEnterpriseMembers({
            slug,
            token
        });

        assert.deepEqual(result, [mockUser1, mockUser2]);
        assert.calledWith(githubGql.sdGql.query.firstCall, {
            query: queries.ListEnterpriseMembers,
            variables: { slug, cursor: null },
            token
        });
        assert.calledWith(githubGql.sdGql.query.secondCall, {
            query: queries.ListEnterpriseMembers,
            variables: { slug, cursor: 'cursor1' },
            token
        });
    });

    it('should get the github user', async () => {
        const login = 'ai_humanoid';
        const data = {
            user: mockUser
        };

        githubGql.sdGql.query.resolves({ data });

        const result = await githubGql.getUser({
            login,
            token
        });

        assert.deepEqual(result, mockUser);
        assert.calledWith(githubGql.sdGql.query, {
            query: queries.GetUser,
            variables: { login },
            token
        });
    });
});