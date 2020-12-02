import { TempDir } from './utils';
import { createContext, executeCodegen, parseArgv } from '../src';

const mockConfig = (str: string, file = './config.yml') => {
  temp.createFile(file, str);
  temp.createFile('./gil-test.graphql', 'type Query @nonExisting {}');
};
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
      config:
        federation: true
      schema:
        - "./gil-test.graphql"
      extensions:
        codegen:
          generates:
            ./types.generated.ts:
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
    `,
      '.graphqlrc'
    );
    const args2 = createArgv('--config .graphqlrc');
    const parsedeArgs = parseArgv(args2);
    const context2 = await createContext(parsedeArgs);
    const config2 = context2.getConfig();
    const result = await executeCodegen(context2);
    // expect(config).toEqual(config2);
    // expect(config2.schema[0]).toEqual('./gil-test.graphql');
  });
});
