import { EnvironmentDefinition, Logger, runSimpleTests, SimpleTest, TestResult } from '@proximal/packages/base';

// Use this to execute commands (will be tracked automatically)
import { execute } from '@proximal/packages/base';

class Environment implements EnvironmentDefinition {

  async listProblems(): Promise<{ id: string; prompt: string; default?: boolean }[]> {
    const problems: { id: string; prompt: string; default?: boolean }[] = [
      {
        id: 'hello-world',
        prompt: 'Create a function that returns "Hello, World!"',
        default: true,
      },
      {
        id: 'fibonacci',
        prompt: 'Implement the Fibonacci sequence up to n terms',
      },
      {
        id: 'palindrome-check',
        prompt: 'Write a function to check if a string is a palindrome',
      },
    ];

    return problems;
  }

  async setupProblem(problemId: string): Promise<void> {
    // Setup logic specific to each problem
    switch (problemId) {
      case 'hello-world':
        // Create starter file or initialize environment
        await execute('echo "// TODO: Implement hello-world" > solution.ts');
        break;
      case 'fibonacci':
        // Setup for fibonacci problem
        await execute('echo "// TODO: Implement fibonacci" > solution.ts');
        break;
      case 'palindrome-check':
        // Setup for palindrome problem
        await execute('echo "// TODO: Implement palindrome checker" > solution.ts');
        break;
    }
  }

  async runTests(problemId: string, logger: Logger): Promise<TestResult[]> {
    // Define tests based on the problem
    let tests: SimpleTest[] = [];

    switch (problemId) {
      case 'hello-world':
        tests = [
          {
            id: 'hello-world-test-1',
            name: 'Returns correct greeting',
            description: 'Check if the function returns "Hello, World!"',
            run: async (logger: Logger) => {
              const result = await execute('node -e "const fn = require(\'./solution\').default; console.log(fn())"');
              if (!result.success) {
                return { success: false, error: result.error?.message };
              }
              return { success: result.output.includes('Hello, World!') };
            },
          },
        ];
        break;

      case 'fibonacci':
        tests = [
          {
            id: 'fibonacci-test-1',
            name: 'Returns correct sequence for n=5',
            description: 'Check if the function returns the correct sequence for n=5',
            run: async (logger: Logger) => {
              const result = await execute('node -e "const fn = require(\'./solution\').default; console.log(fn(5))"');
              if (!result.success) {
                return { success: false, error: result.error?.message };
              }
              return { success: result.output.includes('1,1,2,3,5') };
            },
          },
          {
            id: 'fibonacci-test-2',
            name: 'Returns correct sequence for n=10',
            description: 'Check if the function returns the correct sequence for n=10',
            run: async (logger: Logger) => {
              const result = await execute('node -e "const fn = require(\'./solution\').default; console.log(fn(10))"');
              if (!result.success) {
                return { success: false, error: result.error?.message };
              }
              return { success: result.output.split(',').length >= 10 };
            },
          },
        ];
        break;

      case 'palindrome-check':
        tests = [
          {
            id: 'palindrome-check-test-1',
            name: 'Detects palindrome "racecar"',
            description: 'Check if the function detects "racecar" as a palindrome',
            run: async (logger: Logger) => {
              const result = await execute('node -e "const fn = require(\'./solution\').default; console.log(fn(\'racecar\'))"');
              if (!result.success) {
                return { success: false, error: result.error?.message };
              }
              return { success: result.output.includes('true') };
            },
          },
          {
            id: 'palindrome-check-test-2',
            name: 'Rejects non-palindrome "hello"',
            description: 'Check if the function rejects "hello" as a palindrome',
            run: async (logger: Logger) => {
              const result = await execute('node -e "const fn = require(\'./solution\').default; console.log(fn(\'hello\'))"');
              if (!result.success) {
                return { success: false, error: result.error?.message };
              }
              return { success: result.output.includes('false') };
            },
          },
        ];
        break;
    }

    return runSimpleTests(tests, logger);
  }
}

export default new Environment();
