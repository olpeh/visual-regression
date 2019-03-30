import { format, UrlObject, parse } from 'url';
const puppeteer = require('puppeteer');
import { existsSync } from 'fs';

import { takeScreenshot, compareScreenshots } from './utils/screenshot';

import { generateTestPathsWithFolderNames, createFolders } from './utils/paths';
import {
  Viewport,
  ScreenshotOptions,
  NavigationOptions,
  LaunchOptions
} from 'puppeteer';

export interface TestPath {
  path: string;
  folderName: string;
}

export interface RegressionTestOptions {
  baseUrl: string;
  testPaths: string[];
  viewportConfigs: Viewport[];
  baseScreenshotDirPath: string;
  goldenScreenshotDirName: string;
  testScreenshotDirName: string;
  compareHeight?: boolean;
  threshold?: number;
  pixelLimit?: number;
}

export const testVisualRegressions = (
  options: RegressionTestOptions,
  launchOptions?: LaunchOptions,
  navigationOptions?: NavigationOptions,
  screenshotOptions?: ScreenshotOptions
) => {
  const goldenScreenshotDirPath = `${options.baseScreenshotDirPath}/${
    options.goldenScreenshotDirName
  }`;
  let screenshotDirPath = `${options.baseScreenshotDirPath}/${
    options.testScreenshotDirName
  }`;
  let firstRun = false;
  console.log(`Going to run tests with the following options`, { ...options });

  // Make sure the base dir for screenshots exists
  if (!existsSync(goldenScreenshotDirPath)) {
    console.log(
      `Golden screenshot folder ${goldenScreenshotDirPath}
       was not found, so assuming first run. Let's create some golden screenshots`
    );
    // Use the golden screenshot folder during the first run
    screenshotDirPath = goldenScreenshotDirPath;
    firstRun = true;
  }

  const description = firstRun
    ? 'Generating screenshots'
    : 'Screenshots are correct';
  describe(description, () => {
    let browser, page;
    const testPaths: TestPath[] = generateTestPathsWithFolderNames(
      options.testPaths
    );

    // This is ran when the suite starts up.
    before(async () => createFolders(options, screenshotDirPath, testPaths));

    // This is ran before every test. It's where you start a clean browser.
    beforeEach(async () => {
      browser = await puppeteer.launch(launchOptions);
      page = await browser.newPage();
    });

    // This is ran after every test; clean up after your browser.
    afterEach(() => browser.close());

    const description2 = firstRun
      ? 'for all given screen viewport sizes'
      : 'on all given screen viewport sizes';
    describe(description2, () => {
      testPaths.forEach((path: TestPath) => {
        options.viewportConfigs.forEach((viewportConfig: Viewport) => {
          const filePrefix = `${viewportConfig.width}x${viewportConfig.height}`,
            baseUrlObject: UrlObject = parse(options.baseUrl),
            formattedUrl = format({
              ...baseUrlObject,
              pathname: path.path
            });

          const description3 = firstRun
            ? `Generating screenshot for ${formattedUrl} with screen size: ${filePrefix}`
            : `${formattedUrl} looks correct with screen size: ${filePrefix}`;
          it(description3, async () => {
            page.setViewport(viewportConfig);

            await page.goto(formattedUrl, navigationOptions);
            await takeScreenshot(
              page,
              screenshotDirPath,
              path.folderName,
              filePrefix,
              screenshotOptions
            );

            if (!firstRun) {
              await compareScreenshots(
                screenshotDirPath,
                path.folderName,
                filePrefix,
                goldenScreenshotDirPath,
                options.compareHeight,
                options.threshold,
                options.pixelLimit
              );
            }
          });
        });
      });
    });
  });
};
