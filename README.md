# visual-regression

Test websites for visual regressions on different viewport sizes using Puppeteer.

Inspired by [this blog post](https://meowni.ca/posts/2017-puppeteer-tests/) by [Monica Dinculescu](https://github.com/notwaldorf).

This tool may be useful to be run right before and right after a deployment that is not supposed to change anything visually (refactoring etc.).

## Usage

- Install it: `npm i visual-regression` or `yarn add visual-regression`

After that, you can import it and test for visual regression.

The contents of your test file `test/example.test.js` could look something like this:

```javascript
const visualRegression = require('visual-regression');

const viewportConfigs = [
  {
    width: 480,
    height: 800
  },
  {
    width: 800,
    height: 600
  },
  {
    width: 1024,
    height: 1024
  }
];

describe('olpe.fi looks ok', () => {
  const options = {
      baseUrl: 'https://olpe.fi?you=can&have=queryParams&here',
      testPaths: ['/', '/contact/'],
      viewportConfigs,
      baseScreenshotDirPath: 'visual-regression-screenshots',
      goldenScreenshotDirName: 'golden',
      testScreenshotDirName: 'test',
      // These are optional and default values, here for demonstrational purposes
      compareHeight: true,
      threshold: 0.5,
      pixelLimit: 50000
    },
    // Optional, Puppeteer specific options
    launchOptions = { headless: false },
    navigationOptions = { waitUntil: 'networkidle2' },
    screenshotOptions = { fullPage: true };

  visualRegression.testVisualRegressions(
    options,
    launchOptions,
    navigationOptions,
    screenshotOptions
  );
});
```

And you would run it with a test runner (here we use mocca):

```javascript
 "test": "mocha test/ --timeout 35000",
```

You probably want to add the screenshot folder to your `.gitignore`.

## How it works

- visual-regression uses puppeteer for opening a page and capturing a screenshot of the contents
- On the first time it records the "golden" screenshots
- During the next runs, it compares the screenshots with the "golden" screenshots and fails if there is too much difference
- Diff pngs are generated for failed test cases and saved in the same folders

## Sample output

![Sample output](visual-regression.gif 'Sample output after running')

## Development

Install dependencies: `yarn`

Run tests: `npm test`

## Publishing a new version:

//TODO: Automate this process

- Make the changes and test them
- Bump the version in `package.json`
- Run the build: `npm run build`
- Publish: `npm publish`
