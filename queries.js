'use strict';

const gql = require('graphql-tag');

module.exports.GetEnterpriseUserAccount = gql`
    query GetEnterpriseUserAccount($slug: String!, $query: String!) {
        enterprise(slug: $slug) {
            name
            id
            members(query: $query, first: 1) {
                totalCount
                nodes {
                    type: __typename
                    ... on EnterpriseUserAccount {
                        id
                        name
                        login
                    }
                    ... on User {
                        id
                        name
                        login
                    }
                }
            }
        }
    }
`;

module.exports.ListEnterpriseMembers = gql`
    query ListEnterpriseMembers($slug: String!, $cursor: String) {
        enterprise(slug: $slug) {
            name
            id
            members(first: 100, role: MEMBER, after: $cursor) {
                totalCount
                pageInfo {
                    endCursor
                    hasNextPage
                }
                nodes {
                    type: __typename
                    ... on EnterpriseUserAccount {
                        id
                        name
                        login
                    }
                    ... on User {
                        id
                        name
                        login
                    }
                }
            }
            organizations(first: 100) {
                totalCount
                pageInfo {
                    endCursor
                    hasNextPage
                }
                nodes {
                    ... on Organization {
                        name
                        id
                        login
                    }
                }
            }
        }
    }
`;

module.exports.GetUser = gql`
    query GetUser($login: String!) {
        user(login: $login) {
            name
            id
            enterprises(first: 100) {
                totalCount
                pageInfo {
                    endCursor
                    hasNextPage
                }
                nodes {
                    id
                    name
                    slug
                }
            }
            organizations(first: 100) {
                totalCount
                pageInfo {
                    endCursor
                    hasNextPage
                }
                nodes {
                    id
                    name
                    login
                }
            }
        }
    }
`;
