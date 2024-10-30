import { getJestProjects } from '@nx/jest';

const esModules = [
  '@alauda-fe/common',
  '@alauda',
  'd3',
  'internmap',
  'delaunator',
  'robust-predicates',
  'lodash-es',
  'zz-chart',
].join('|');

export const transformIgnorePatterns = [
  `node_modules/(?!(${esModules}|.*\\.mjs$))`,
];

export default {
  projects: getJestProjects(),
};
