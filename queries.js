'use strict';

module.exports.GetEnterpriseUserAccount = `
    query GetEnterpriseUserAccount($login: String!) {
        user(login: $login) {
            name
            id
            login
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
        }
    }
`;

// needs `admin:enterprise` scope for EAU fragment
module.exports.ListEnterpriseMembers = `
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

module.exports.GetUser = `
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
