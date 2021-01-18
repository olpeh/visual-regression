import { RegressionTestOptions, run } from './../src/index';

//    What this configuration means is:
//
//    0px       480px       768px       1024px      >9000px
//    \__________/\__________/\__________/\____________...
//       "tiny"      "small"    "medium"      "large"
//       <-480       481-768    769-1024       1025->

// minimun height will be ignored if fullPage is set to true (default)
const minHeight = 800;
const viewportConfigs = [
  {
    width: 380,
    height: minHeight,
  },
  {
    width: 480,
    height: minHeight,
  },
  {
    width: 481,
    height: minHeight,
  },
  {
    width: 768,
    height: minHeight,
  },
  {
    width: 769,
    height: minHeight,
  },
  {
    width: 1024,
    height: minHeight,
  },
  {
    width: 1025,
    height: minHeight,
  },
  {
    width: 1280,
    height: minHeight,
  },
  {
    width: 1600,
    height: minHeight,
  },
  {
    width: 1920,
    height: minHeight,
  },
];

describe('example.com looks ok', () => {
  const options: RegressionTestOptions = {
    // Let's use a page that is not very likely to change visually over time
    baseUrl: 'http://example.com',
    testPaths: ['/'],
    viewportConfigs,
    launchOptions: { headless: true },
    navigationOptions: { waitUntil: 'networkidle2' },
    screenshotOptions: { fullPage: true },
  };

  run(options);
});
