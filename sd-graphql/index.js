'use strict';

const request = require('screwdriver-request');

/**
 * Wrapper around screwdriver-request lib to make graphql requests
 * @class
 * @param {Object} config The config object
 * @param {String} config.graphqlUrl The graphql url
 * @param {String} config.token The token to use for authentication
 * @example
 * const client = new SDGraphQLClient({
 *    graphqlUrl: 'https://api.github.com/graphql',
 *    token: 'ghp_abcd12345'
 * });
 */
class SDGraphQLClient {
    /**
     * @param {Object} config The config object
     * @param {String} config.graphqlUrl The graphql url
     */
    constructor(config) {
        this._config = config;
    }

    /**
     * Run a graphql query and return the result
     * @param {String} schema              The schema object
     * @param {String} schema.query        The graphql query
     * @param {Object} schema.variables    The variables to use in the query
     * @param {String} schema.token        The token to use for authentication
     * @param {Object} schema.options      The options to pass to the request
     * @returns Promise
     */
    async query(schema) {
        const { query, variables, token, options } = schema;
        const res = await request({
            method: 'POST',
            url: this._config.graphqlUrl,
            context: {
                token
            },
            json: { query, variables },
            ...options
        });

        if (res.body.errors) {
            return null;
        }

        return res.body;
    }

    /**
     * Run a graphql mutation and return the result
     * @param {String} schema             The schema object
     * @param {String} schema.mutation    The graphql mutation
     * @param {Object} schema.variables   The variables to use in the mutation
     * @param {String} schema.token       The token to use for authentication
     * @param {Object} schema.options     The options to pass to the request
     * @returns Promise
     */
    async mutate(schema) {
        const { mutation, variables, token, options } = schema;
        const res = await request({
            method: 'POST',
            url: this._config.graphqlUrl,
            context: {
                token
            },
            json: { mutation, variables },
            ...options
        });

        if (res.body.errors) {
            return null;
        }

        return res.body;
    }
}

module.exports = SDGraphQLClient;
