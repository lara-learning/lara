# Lara Backend

The Backend part of the Lara Application.

## Get started

To start the backend just use the commands described in the root directory.

```bash
yarn compile:watch & yarn start
```

## Architecture

The entry point of the Backend lambda is located in src/handler.ts. The serverless framework executes the server function located in this file on every request.

The 'src/aws' folder contains all AWS related logic such as SES and DynamoDB. For interactions with AWS Services we use the AWS SDK.

The 'src/i18n' folders contains the translations for the backend. This is needed for the email notifications and the translated error messages.

The GraphQL resolvers are located in the 'src/resolvers' folder. The resolvers are the main part of the backend and contain all the GraphQL logic which is needed. The resolvers are reexported by the 'src/resolvers/index.ts' file and imported by the Apollo Server in our server handler.

To keep the GraphQL resolvers slim, reusable funcationallity is located inside the 'src/services' folders.

The 'src/templates' folder contains the react templates for the email notifications.

The permissions are managed by GraphQL shield inside the 'src/permissions.ts' file. All Guards and the connection with the schema is handled in there.

## Mocks

Local mocks can be accessed under the '/backend/mocks' path. New mocks can be added in the 'mocks.service.ts'.

The Email Templates are located here:

1. [Trainer Template](http://localhost:3000/dev/backend/mocks/mails/trainer)
2. [Trainee Template](http://localhost:3000/dev/backend/mocks/mails/trainee)
