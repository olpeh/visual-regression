declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(): R;
    }
  }
}

const puppeteer = require('puppeteer');
import { format, UrlObject, parse } from 'url';
import {
  Viewport,
  NavigationOptions,
  ScreenshotOptions,
  LaunchOptions,
} from 'puppeteer';
const { toMatchImageSnapshot } = require('jest-image-snapshot');
expect.extend({ toMatchImageSnapshot });

export interface RegressionTestOptions {
  baseUrl: string;
  testPaths: string[];
  viewportConfigs: Viewport[];
}

export const testVisualRegressions = (
  options: RegressionTestOptions,
  launchOptions?: LaunchOptions,
  navigationOptions?: NavigationOptions,
  screenshotOptions?: ScreenshotOptions
) => {
  console.log(`Going to run tests with the following options`, { ...options });

  describe('Screenshots are correct', () => {
    let browser, page;

    // This is ran before every test. It's where you start a clean browser.
    beforeEach(async () => {
      browser = await puppeteer.launch(launchOptions);
      page = await browser.newPage();
    });

    // This is ran after every test; clean up after your browser.
    afterEach(() => browser.close());

    describe('on all given screen viewport sizes', () => {
      options.testPaths.forEach((path) => {
        options.viewportConfigs.forEach((viewportConfig: Viewport) => {
          const filePrefix = `${viewportConfig.width}x${viewportConfig.height}`,
            baseUrlObject: UrlObject = parse(options.baseUrl),
            formattedUrl = format({
              ...baseUrlObject,
              pathname: path,
            });

          it(`${formattedUrl} looks correct with screen size: ${filePrefix}`, async () => {
            page.setViewport(viewportConfig);

            await page.goto(formattedUrl, navigationOptions);
            const image = await page.screenshot(screenshotOptions);
            expect(image).toMatchImageSnapshot();
          });
        });
      });
    });
  });
};
