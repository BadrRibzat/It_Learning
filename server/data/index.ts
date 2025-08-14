// server/data/index.ts
import { bashStack } from './stacks/bash';
import { dockerStack } from './stacks/docker';
import { gitStack } from './stacks/git';

export const allStacks = [bashStack, dockerStack, gitStack];
