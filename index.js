'use strict';

const SDGraphQLClient = require('./sd-graphql');
const queries = require('./queries');

class GithubScmGraphQL {
    /**
     * constructor
     * @param {Object} config            The config object
     * @param {String} config.graphQlUrl The graphql url
     */
    constructor(config) {
        this.sdGql = new SDGraphQLClient({
            graphqlUrl: config.graphQlUrl || 'https://api.github.com/graphql'
        });
    }

    /**
     * Gets the enterprise user account schema
     * @param {String} config              The config object
     * @param {String} config.slug         The github enterprise slug
     * @param {String} config.login        The github user login
     * @param {String} config.token        The access token
     * @returns Object https://docs.github.com/en/enterprise-cloud@latest/graphql/reference/objects#enterpriseuseraccount
     */
    async getEnterpriseUserAccount(config) {
        const { slug, login, token } = config;

        const { data } = await this.sdGql.query({
            query: queries.GetEnterpriseUserAccount,
            variables: { slug, query: login },
            token
        });

        if (data && data.enterprise) {
            const { members } = data.enterprise;

            if (members && members.totalCount === 1) {
                return members.nodes[0];
            }
        }

        return null;
    }

    /**
     * Helper method to paginate the enterprise members recursively
     * @param {*} config   The config object
     * @param {*} cursor   The current page
     * @param {*} members  The list of members
     * @returns Array https://docs.github.com/en/enterprise-cloud@latest/graphql/reference/unions#enterprisemember
     */
    async _listEnterpriseMembersHelper(config, cursor, allMembers = []) {
        const { slug, token } = config;

        const { data } = await this.sdGql.query({
            query: queries.ListEnterpriseMembers,
            variables: { slug, cursor },
            token
        });

        if (data && data.enterprise && data.enterprise.members) {
            const { nodes, pageInfo } = data.enterprise.members;

            if (nodes) {
                allMembers.push(...nodes);
            }
            if (pageInfo && pageInfo.hasNextPage) {
                return this._listEnterpriseMembersHelper(config, pageInfo.endCursor, allMembers);
            }
        }

        return allMembers;
    }

    /**
     * List of enterprise members schema
     * @param {String} config       The config object
     * @param {String} config.slug  The github enterprise slug
     * @param {String} config.token The access token
     * @returns Array https://docs.github.com/en/enterprise-cloud@latest/graphql/reference/unions#enterprisemember
     */
    async listEnterpriseMembers(config) {
        return this._listEnterpriseMembersHelper(config, null, []);
    }

    /**
     * Gets the the github user schema
     * @param {Object} config             The config object
     * @param {String} config.login       The github user login
     * @param {String} config.toke        The access token
     * @returns Object https://docs.github.com/en/enterprise-cloud@latest/graphql/reference/objects#user
     * or https://docs.github.com/en/enterprise-cloud@latest/graphql/reference/objects#enterpriseuseraccount
     */
    async getUser(config) {
        const { login, token } = config;
        const { data } = await this.sdGql.query({
            query: queries.GetUser,
            variables: { login },
            token
        });

        return data.user;
    }
}

module.exports = GithubScmGraphQL;
