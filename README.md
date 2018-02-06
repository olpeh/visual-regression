# puppeteer-visual-diff

Test website for visual diff on different viewport sizes using Puppeteer

Inspired by [this blog post](https://meowni.ca/posts/2017-puppeteer-tests/) by Monica Dinculescu.

## Usage

- Install dependencies: `yarn`
- Add a `.env` file with the necessary env variables if needed
- Run for the first time (records the "golden" screenshots): `npm run firstrun`
- Run next time in order to check the diff and fail if changed too much: `npm start`

![Sample output](screenshot.png "Sample output after running")
