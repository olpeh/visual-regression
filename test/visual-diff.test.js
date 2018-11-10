require('dotenv').config();
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const screenshot = require('../screenshot.js');
const fs = require('fs');

const protocol = process.env.PROTOCOL || 'https://';
const baseUrl = process.env.BASE_URL || 'olpe.fi';
const testPaths = process.env.TEST_PATHS.split(',') || ['/'];
const basicAuth = process.env.BASIC_AUTH || null;
const goldenDir = 'screenshots-golden';
let testDir = 'test-dir';

const argv = process.argv.slice(2);
if (argv.indexOf('--firstrun') !== -1) {
  console.log('First run, going to save the golden screenshots');
  testDir = goldenDir;
}

const fullBaseUrl = basicAuth
  ? `${protocol}${basicAuth}@${baseUrl}`
  : `${protocol}${baseUrl}`;
console.log(`Going to run tests for ${baseUrl}`);
console.log({
  testPaths,
  fullBaseUrl,
  testDir,
  goldenDir
});

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

describe('👀 screenshots are correct', () => {
  let browser, page;
  let toBeTested = testPaths.map((path) => {
    const folderName =
      path === '/'
        ? 'frontpage'
        : path.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return {
      path,
      folderName
    };
  });

  // This is ran when the suite starts up.
  before(async function() {
    // Create the test directory if needed. This and the goldenDir
    // variables are global somewhere.
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }

    console.log({ toBeTested });

    toBeTested.forEach((t) => {
      if (!fs.existsSync(`${testDir}/${t.folderName}`)) {
        fs.mkdirSync(`${testDir}/${t.folderName}`);
      }
    });
  });

  // This is ran before every test. It's where you start a clean browser.
  beforeEach(async function() {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  // This is ran after every test; clean up after your browser.
  afterEach(() => browser.close());

  describe('Screenshots are visually similar on all breakpoints including edge cases', () => {
    toBeTested.forEach((t) => {
      viewportConfigs.forEach((viewportConfig) => {
        const filePrefix = `${viewportConfig.width}x${viewportConfig.height}`;
        it(`looks correct with screen size: ${filePrefix}`, () => {
          page.setViewport({
            width: viewportConfig.width,
            height: viewportConfig.height
          });

          // Named function parameters in JS - YAY!
          return screenshot.takeAndCompareScreenshot({
            page,
            baseUrl: fullBaseUrl,
            route: t.path,
            folderName: t.folderName,
            filePrefix,
            testDir,
            goldenDir
          });
        });
      });
    });
  });
});
