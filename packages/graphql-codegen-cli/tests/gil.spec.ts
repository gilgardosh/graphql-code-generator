import { TempDir } from './utils';
import { createContext, parseArgv } from '../src/config';

const mockConfig = (str: string, file = './graphqlrc.yml') => temp.createFile(file, str);
const createArgv = (str = ''): string[] => {
  const result = ['node', 'fake.js'];
  const regexp = /([^\s'"]+(['"])([^\2]*?)\2)|[^\s'"]+|(['"])([^\4]*?)\4/gi;

  let match;
  do {
    match = regexp.exec(str);
    if (match !== null) {
      result.push(match[1] || match[5] || match[0]);
    }
  } while (match !== null);

  return result;
};

const temp = new TempDir();

describe('CLI Flags', () => {
  beforeEach(() => {
    temp.clean();
    jest.spyOn(process, 'cwd').mockImplementation(() => temp.dir);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    temp.deleteTempDir();
  });

  it('Gil test', async () => {
    // mockConfig(`
    // schema:
    //   - './packages/modules/**/schema/**/*.gql'
    // generates:
    //   ./packages/core/src/generated/global.gql.types.generated.ts:
    //     plugins:
    //       - typescript
    //       - typescript-operations
    //       - typescript-resolvers
    //       - add:
    //           placement: prepend
    //           content: "import { DeepPartial } from 'utility-types';"
    //     config:
    //       defaultMapper: DeepPartial<{T}>
    //       federation: true
    // watch: true
    // overwrite: true
    // `);
    // const args = createArgv();
    // const context = await createContext(parseArgv(args));
    // const config = JSON.stringify(context.getConfig());
    mockConfig(
      `
    projects:
      globalgql:
        config:
          federation: true
        schema:
          - "./packages/**/gil-test.graphql"
        extensions:
          codegen:
            generates:
              ./packages/core/src/generated/global.gql.types.generated.ts:
                plugins:
                  - typescript
                  - typescript-operations
                  - typescript-resolvers
                  - add:
                      placement: prepend
                      content: "import { DeepPartial } from 'utility-types';"
                config:
                  federation: true
                  defaultMapper: DeepPartial<{T}>
    `
    );
    const args2 = createArgv();
    const context2 = await createContext(parseArgv(args2));
    const config2 = context2.getConfig();
    // expect(config).toEqual(config2);
    expect(config2.schema).toEqual('gil-test.graphql');
  });

  // it('Should use different config file correctly with --config', async () => {
  //   mockConfig(
  //     `
  //       schema: schema.graphql
  //       generates:
  //           file.ts:
  //               - plugin
  //     `,
  //     'other.yml'
  //   );
  //   const args = createArgv('--config other.yml');
  //   const context = await createContext(parseArgv(args));
  //   const config = context.getConfig();
  //   expect(config.schema).toEqual('schema.graphql');
  //   expect(config.generates).toEqual({ 'file.ts': ['plugin'] });
  // });
});
