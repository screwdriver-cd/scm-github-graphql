# scm-github-graphql
[![Version][npm-image]][npm-url] ![Downloads][downloads-image] [![Build Status][status-image]][status-url] [![Open Issues][issues-image]][issues-url] ![License][license-image]

## Usage

```bash
npm install screwdriver-scm-github-graphql
```

### Initialization

The class interacts with (GitHub GraphQL API)[https://docs.github.com/en/enterprise-cloud@latest/graphql/overview/about-the-graphql-api]
The following configuration is needed

| Parameter        | Type  |  Default | Description |
| :-------------   | :---- | :-------------| :-------------|
| config        | Object | | Configuration Object |
| config.graphQlUrl | String | https://api.github.com/graphql | Github GraphQL API Endpoint |
```js
const scm = new GithubScmGraphQL({
    graphQlUrl: 'https://api.github.com/graphql'
});
```

### Methods

#### getEnterpriseUserAccount
Required parameters:

| Parameter        | Type  |  Description |
| :-------------   | :---- | :-------------|
| schema     | Object | The schema object |
| schema.slug     | String | The github enterprise slug |
| schema.login      | String | The github user's login name |
| schema.token | String | The github token to interact with the graphql api |

#### Expected Outcome

Gets the enterprise user account based on schema https://docs.github.com/en/enterprise-cloud@latest/graphql/reference/objects#enterpriseuseraccount

#### listEnterpriseMembers
Required parameters:

| Parameter        | Type  |  Description |
| :-------------   | :---- | :-------------|
| schema     | Object | The schema object |
| schema.slug     | String | The github enterprise slug |
| schema.token | String | The github token to interact with the graphql api |

#### Expected Outcome

This method retrieves a list of enterprise members based on schema https://docs.github.com/en/enterprise-cloud@latest/graphql/reference/unions#enterprisemember.

##### getUser
Required parameters:

| Parameter        | Type  |  Description |
| :-------------   | :---- | :-------------|
| schema     | Object | The schema object |
| schema.login     | String | The github user's login name |
| schema.token | String | The github token to interact with the graphql api |

##### Expected Outcome
Returns the github user based on schema https://docs.github.com/en/enterprise-cloud@latest/graphql/reference/objects#user

## Testing

```bash
npm test
```

## License

Code licensed under the BSD 3-Clause license. See LICENSE file for terms.

[npm-image]: https://img.shields.io/npm/v/screwdriver-scm-github-graphql.svg
[npm-url]: https://npmjs.org/package/screwdriver-scm-github-graphql
[downloads-image]: https://img.shields.io/npm/dt/screwdriver-scm-github-graphql.svg
[license-image]: https://img.shields.io/npm/l/screwdriver-scm-github-graphql.svg
[issues-image]: https://img.shields.io/github/issues/screwdriver-cd/screwdriver.svg
[issues-url]: https://github.com/screwdriver-cd/screwdriver/issues
[status-image]: https://cd.screwdriver.cd/pipelines/13562/badge
[status-url]: https://cd.screwdriver.cd/pipelines/13562
