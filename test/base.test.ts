import { RegressionTestOptions, testVisualRegressions } from './../src/index';
import { NavigationOptions, ScreenshotOptions, LaunchOptions } from 'puppeteer';

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

describe('olavihaapala.fi looks ok', () => {
  const options: RegressionTestOptions = {
      baseUrl: 'https://olavihaapala.fi?you=can&have=queryParams&here',
      testPaths: [
        '/',
        '/projects/',
        '/contact/',
        '/2018/11/11/visual-regression.html',
      ],
      viewportConfigs,
    },
    launchOptions: LaunchOptions = { headless: true },
    navigationOptions: NavigationOptions = { waitUntil: 'networkidle2' },
    screenshotOptions: ScreenshotOptions = { fullPage: true };

  testVisualRegressions(
    options,
    launchOptions,
    navigationOptions,
    screenshotOptions
  );
});
