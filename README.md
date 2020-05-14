# Example how to use TypeORM with TypeScript

1. clone repository
2. run `yarn install`
3. edit `ormconfig.json` and change your database configuration (you can also change a database type, but don't forget to install specific database drivers)
4. run `yarn dev`
5. enjoy!

### Issues

- `yarn start` only works for `"entities": ["src/entity/*.js"]`
- `"entities": ["src/entity/*.{js,ts}"]` is needed for ts-node usage.

ref:

1. https://github.com/typeorm/typeorm/issues/1327
2. https://github.com/typeorm/typeorm/issues/2882
3. https://github.com/nestjs/nest/issues/4283
4. https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
5. https://stackoverflow.com/questions/59727358/typeorm-dont-use-ormconfig-json-file

no.4 gives a hint to solve ts-node and tsc conflict issue, try to prepare 2 settings, ref: https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md

## How to use CLI?

1. install `typeorm` globally: `yarn global add typeorm`
2. run `typeorm -h` to show list of available commands
