# swagger-jsdoc-sync-webpack-plugin

Webpack plugin updating the swagger specification based on imported files.

## Installing / Getting started

1. Install `swagger-jsdoc-sync-webpack-plugin`.

```shell
yarn add --dev swagger-jsdoc-sync-webpack-plugin
```

2. Add the plugin in webpack configuration.

```js
const SwaggerJsdocSyncWebpackPlugin = require('swagger-jsdoc-sync-webpack-plugin');
// webpack.config.js
module.exports = {
  plugins: [
    new SwaggerJsdocSyncWebpackPlugin({
      // Swagger specification metadata.
      swagger: {
        openapi: '3.0',
        info: {
          title: 'My API',
          version: require('./package.json').version,
          description: 'What my API does.',
        },
      },

      // Print the swagger.json readably.
      prettyJson: true,
    }),
  ],
};
```

3. Use JSDoc to define your swagger definion in your code using @swagger tag.
   Do not forget to import every file that has swagger definitions.

```js
/**
@swagger
 *
 * components:
 *   schemas:
 *     MyEntity:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Technical unique id.
 *         name:
 *           type: string
 *           description: Entity name.
 *         description:
 *           type: string
 *           description: Entity description.
 */
```

The created file will be `swagger.json` inside the output folder.

## Options

- **[swagger]** *(Object)* - Swagger definition (equivalent to `swagger-jsdoc`'s `swaggerDefinition`
  option
  see [their documentation](https://www.npmjs.com/package/swagger-jsdoc#fundamental-concepts)).
- **[prettyJson]** *(boolean)* - If `true`, will prettry print the `swagger.json` file.

## Tests

```shell
yarn test
```
