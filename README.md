# Example how to use TypeORM with TypeScript

1. clone repository
2. install yarn v1, https://classic.yarnpkg.com/lang/en/
3. run `yarn install`
4. edit `ormconfig.json` and change your database configuration (e.g. username/password/database, you can also change a database type, but don't forget to install specific database drivers)
5. run `yarn dev`
6. enjoy!

## mirations

ref: https://typeorm.io/#/migrations

_typeorm migration:create and typeorm migration:generate will create .ts files. The migration:run and migration:revert commands only work on .js files._

### using ts-node (auto-generate or create+fill)

1. `yarn typeorm migration:generate -n PostRefactoring`
   - or `yarn typeorm migration:create` + fill the generated .ts byself
2. `yarn typeorm migration:run`

### using tsc to create empty migration files, fill by self and run migration

1. Create empty migrations, `yarn migration_create -n PostRefactoring` then fill the generated .ts byself`

2. `yarn build`

3. `yarn deploy_typeorm migration:run`

## Issues

### Difficult to only use tsc to auto-generate migrations, need ts-node since the generated files are ts files

### TypeORM 0.2.24 (latest) is not compatible with tslib 2.0.0

tslib 1.11.2/1.13.0 works

ref: https://github.com/typeorm/typeorm/issues/6054

### ~tsc and ts-node mix issue~ Solved by using 2 settings

- `yarn start` only works for `"entities": ["src/entity/*.js"]`
- `"entities": ["src/entity/*.{js,ts}"]` is needed for ts-node usage.

ref:

1. https://github.com/typeorm/typeorm/issues/1327
2. https://github.com/typeorm/typeorm/issues/2882
3. https://github.com/nestjs/nest/issues/4283
4. https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
5. https://stackoverflow.com/questions/59727358/typeorm-dont-use-ormconfig-json-file

no.4 gives a hint to solve ts-node and tsc conflict issue, try to prepare 2 settings, ref: https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md
