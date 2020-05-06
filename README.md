# Visual Regression

[![Sponsored](https://img.shields.io/badge/chilicorn-sponsored-brightgreen.svg?logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAMAAADjyg5GAAABqlBMVEUAAAAzmTM3pEn%2FSTGhVSY4ZD43STdOXk5lSGAyhz41iz8xkz2HUCWFFhTFFRUzZDvbIB00Zzoyfj9zlHY0ZzmMfY0ydT0zjj92l3qjeR3dNSkoZp4ykEAzjT8ylUBlgj0yiT0ymECkwKjWqAyjuqcghpUykD%2BUQCKoQyAHb%2BgylkAyl0EynkEzmkA0mUA3mj86oUg7oUo8n0k%2FS%2Bw%2Fo0xBnE5BpU9Br0ZKo1ZLmFZOjEhesGljuzllqW50tH14aS14qm17mX9%2Bx4GAgUCEx02JySqOvpSXvI%2BYvp2orqmpzeGrQh%2Bsr6yssa2ttK6v0bKxMBy01bm4zLu5yry7yb29x77BzMPCxsLEzMXFxsXGx8fI3PLJ08vKysrKy8rL2s3MzczOH8LR0dHW19bX19fZ2dna2trc3Nzd3d3d3t3f39%2FgtZTg4ODi4uLj4%2BPlGxLl5eXm5ubnRzPn5%2Bfo6Ojp6enqfmzq6urr6%2Bvt7e3t7u3uDwvugwbu7u7v6Obv8fDz8%2FP09PT2igP29vb4%2BPj6y376%2Bu%2F7%2Bfv9%2Ff39%2Fv3%2BkAH%2FAwf%2FtwD%2F9wCyh1KfAAAAKXRSTlMABQ4VGykqLjVCTVNgdXuHj5Kaq62vt77ExNPX2%2Bju8vX6%2Bvr7%2FP7%2B%2FiiUMfUAAADTSURBVAjXBcFRTsIwHAfgX%2FtvOyjdYDUsRkFjTIwkPvjiOTyX9%2FAIJt7BF570BopEdHOOstHS%2BX0s439RGwnfuB5gSFOZAgDqjQOBivtGkCc7j%2B2e8XNzefWSu%2BsZUD1QfoTq0y6mZsUSvIkRoGYnHu6Yc63pDCjiSNE2kYLdCUAWVmK4zsxzO%2BQQFxNs5b479NHXopkbWX9U3PAwWAVSY%2FpZf1udQ7rfUpQ1CzurDPpwo16Ff2cMWjuFHX9qCV0Y0Ok4Jvh63IABUNnktl%2B6sgP%2BARIxSrT%2FMhLlAAAAAElFTkSuQmCC)](http://spiceprogram.org/oss-sponsorship)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/olpeh/visual-regression/pulls)
[![license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/olpeh/visual-regression/blob/master/LICENSE)

Test websites for visual regressions on different viewport sizes using Puppeteer.

Inspired by [this blog post](https://meowni.ca/posts/2017-puppeteer-tests/) by [Monica Dinculescu](https://github.com/notwaldorf).

This tool may be useful to be run right before and right after a deployment that is not supposed to change anything visually (refactoring etc.).

## Usage

- Install it: `npm i -D visual-regression` or `yarn add -D visual-regression`

After that, you can import it and test for visual regression.

The contents of your test file `test/example.test.js` could look something like this:

```javascript
const visualRegression = require('visual-regression');

const viewportConfigs = [
  {
    width: 480,
    height: 800,
  },
  {
    width: 800,
    height: 600,
  },
  {
    width: 1024,
    height: 1024,
  },
];

describe('olavihaapala.fi looks ok', () => {
  const options = {
    baseUrl: 'https://olavihaapala.fi?you=can&have=queryParams&here',
    testPaths: [
      '/',
      '/projects/',
      '/contact/',
      '/2018/11/11/visual-regression.html',
    ],
    viewportConfigs,
    launchOptions: { headless: true },
    navigationOptions: { waitUntil: 'networkidle2' },
    screenshotOptions: { fullPage: true };
  };

  visualRegression.testVisualRegressions(options);
});
```

And you would run it with jest:

```javascript
 "test": "jest",
```

## How it works

- visual-regression uses puppeteer for opening a page and capturing a screenshot of the contents
- It uses [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot) for checking that the screenshots match the previous snapshots

## Sample output

![Sample output](screenshot.png 'Sample output after running')

## Development

Install dependencies: `yarn`

Run tests: `npm test`

## Publishing a new version:

//TODO: Automate this process

- Make the changes and test them
- Bump the version in `package.json`
- Run the build: `npm run build`
- Publish: `npm publish`

## Supporters

This project is sponsored by [Futurice's](https://futurice.com/) [Open Source Sponsorship program](http://spiceprogram.org/oss-sponsorship)

[![Supported by the Spice Program](https://github.com/futurice/spiceprogram/raw/gh-pages/assets/img/logo/chilicorn_with_text-180.png)](https://spiceprogram.org)
