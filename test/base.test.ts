import { RegressionTestOptions, testVisualRegressions } from './../src/index';

//    What this configuration means is:
//
//    0px       480px       768px       1024px      >9000px
//    \__________/\__________/\__________/\____________...
//       "tiny"      "small"    "medium"      "large"
//       <-480       481-768    769-1024       1025->

// Probably stupid to use a "big enough height" here...
const height = 2500;
const viewportConfigs = [
  {
    width: 380,
    height
  },
  {
    width: 480,
    height
  },
  {
    width: 481,
    height
  },
  {
    width: 768,
    height
  },
  {
    width: 769,
    height
  },
  {
    width: 1024,
    height
  },
  {
    width: 1025,
    height
  },
  {
    width: 1280,
    height
  },
  {
    width: 1600,
    height
  },
  {
    width: 1920,
    height
  }
];

describe('olpe.fi looks ok', () => {
  const options: RegressionTestOptions = {
    baseUrl: 'https://olpe.fi',
    testPaths: [
      '/',
      '/projects/',
      '/contact/',
      '/2018/04/03/i-learned-frp-by-learning-cyclejs.html'
    ],
    viewportConfigs,
    baseScreenshotDirPath: '/tmp/visual-regression',
    goldenScreenshotDirName: 'golden',
    testScreenshotDirName: 'test'
  };
  testVisualRegressions(options);
});
