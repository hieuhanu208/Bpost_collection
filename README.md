## Carrier Integration Template

The Carrier Integration Template aims to provide developers a solid base for 
new carrier integrations.

### Getting Started

##### Prerequisites

You'll need a few things installed on your machine before
setting up a new carrier integration:

- [Node@6.10.2][node]
- [AWS CLI and Credentials][aws-configuration]
- [Yarn][yarn]
- [Postman][postman]

##### Project Setup

Before you can run any code you need to install your Node 
dependancies:

```sh
> yarn --ignore-engines
```

##### CI/CD Variables

The following variables need to be set inside your Gitlab project:

| Variable              | Description       | Example               |
| --------------------- | ----------------- | --------------------- |
| `AWS_CREDENTIALS`     | AWS Credentials   | _see below_           |
| `DEPLOYMENT_REGION`   | AWS Region        | `eu-west-1`           |
| `ENV`                 | Stack Name        | `dev`                 |
| `NPM_INSTALL_TOKEN`   | NPM Install Token | `abc-123`             |

AWS Credentials:

```
[dev]
aws_access_key_id = abc123
aws_secret_access_key = abc123
```

### Developing And Testing

##### Making Test Calls

The easiest way to test while developing is making test calls to 
the API. You need to start up a test server first:

```sh
> yarn start
```

Then using Postman you can make test calls. To get started  you 
can import the integration tests into Postman. From the Import 
menu choose 'Import Folder' and 'Choose' `tests/integarions` 
from this repository.

##### Running Unit Tests

```sh
> yarn test
```

##### Linting Your Code

```sh
> yarn run lint
```

[node]: https://nodejs.org/download/release/v6.10.2/ "Node 6.10.2"
[aws-configuration]: http://docs.temando.io/temando-field-manual-tome/configure-aws "Configure your AWS Account"
[yarn]: https://yarnpkg.com/en/docs/install "Yarn Installation"
[postman]: https://www.getpostman.com/  "Postman"