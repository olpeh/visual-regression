require('dotenv').config();
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
const screenshot = require('../screenshot.js');
const fs = require('fs');

const env = process.env.SNDP_ENV;
const product = process.env.PRODUCT ? process.env.PRODUCT : 'product';
const goldenDir = env && product ? `screenshots-golden-${env}-${product}` : 'screenshots-golden';
let testDir = env && product ? `results-${env}-${product}` : 'test-dir';

const argv = process.argv.slice(2);
if (argv.indexOf('--firstrun') !== -1) {
    console.log('First run, going to save the golden screenshots');
    testDir = goldenDir;
}

const basicAuth = product ? `${product}:${
    product === 'is' ? process.env.BASIC_AUTH_IS : process.env.BASIC_AUTH_HS
  }` : null;

const baseUrl = basicAuth ? `https://${basicAuth}@${env}.${product}.fi` : `https://${env}.${product}.fi`;
console.log(`Going to run tests for ${env} ${product}`);

//    What this configuration means is:
//
//    0px       480px       768px       1024px      >9000px
//    \__________/\__________/\__________/\____________...
//       "tiny"      "small"    "medium"      "large"
//       <-480       481-768    769-1024       1025->

// Probably stupid to use a "big enough height" here...
const height = 15000;
const viewportConfigs = [{
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

    // This is ran when the suite starts up.
    before(async function () {
        // Create the test directory if needed. This and the goldenDir
        // variables are global somewhere.
        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

        if (!fs.existsSync(`${testDir}/staticcontent`)) {
            fs.mkdirSync(`${testDir}/staticcontent`);
        }
    });

    // This is ran before every test. It's where you start a clean browser.
    beforeEach(async function () {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    // This is ran after every test; clean up after your browser.
    afterEach(() => browser.close());


    describe('/staticcontent on all breakpoints including edge cases', () => {
        viewportConfigs.forEach(viewportConfig => {
            const filePrefix = `${viewportConfig.width}x${viewportConfig.height}`;
            it(`looks correct with screen size: ${filePrefix}`, () => {
                page.setViewport({
                    width: viewportConfig.width,
                    height: viewportConfig.height
                });

                // Named function parameters in JS - YAY!
                return screenshot.takeAndCompareScreenshot({
                    page,
                    baseUrl,
                    route: 'staticcontent',
                    filePrefix,
                    testDir,
                    goldenDir
                })
            });

        })

    });
});
