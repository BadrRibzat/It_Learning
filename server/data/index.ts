// server/data/index.ts
import { bashStack } from './stacks/bash';
import { dockerStack } from './stacks/docker';
import { gitStack } from './stacks/git';
import { cloudStack } from './stacks/cloud';
import { kubenetesStack } from './stacks/kubenetes';
import { linuxStack } from './stacks/linux';
import { mongodbStack } from './stacks/mongodb';
import { npmStack } from './stacks/npm';
import { postgresqlStack } from './stacks/postgresql';
import { pythonStack } from './stacks/python';
import { redisStack } from './stacks/redis';

export const allStacks = [
    bashStack, dockerStack, gitStack,
    cloudStack, kubernetesStack, linuxStack,
    mongodbStack, npmStack, postgesqlStack,
    pythonStack, redisStack
];
