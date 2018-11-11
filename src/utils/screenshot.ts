import { createReadStream, createWriteStream } from 'fs';
import { expect } from 'chai';
import { PNG } from 'pngjs';
import * as pixelmatch from 'pixelmatch';

export const takeScreenshot = async (
  page,
  screenshotDirPath: string,
  folderName: string,
  filePrefix: string
) => {
  await page.screenshot({
    path: `${screenshotDirPath}/${folderName}/${filePrefix}.png`
  });
};

export const compareScreenshots = (
  screenshotDirPath: string,
  folderName: string,
  filePrefix: string,
  goldenDir: string
) =>
  new Promise((resolve, reject) => {
    const img1 = createReadStream(
      `${screenshotDirPath}/${folderName}/${filePrefix}.png`
    )
      .pipe(new PNG())
      .on('parsed', doneReading);
    const img2 = createReadStream(
      `${goldenDir}/${folderName}/${filePrefix}.png`
    )
      .pipe(new PNG())
      .on('parsed', doneReading);

    let filesRead = 0;

    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) {
        return;
      }

      // The files should be the same size.
      expect(img1.width, 'image widths are the same').equal(img2.width);
      expect(img1.height, 'image heights are the same').equal(img2.height);

      // Do the visual diff.
      const diff = new PNG({
        width: img1.width,
        height: img2.height
      });
      const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        img1.width,
        img1.height,
        {
          threshold: 0.5
        }
      );

      // Save the visual diff file if changed more than the limit
      const pixelLimit = 50000;
      if (numDiffPixels >= pixelLimit) {
        diff
          .pack()
          .pipe(
            createWriteStream(
              `${screenshotDirPath}/${folderName}/${filePrefix}.diff.png`
            )
          );
      }

      // The files should look about the same
      // Threshold and pixel amount are just random numbers right now
      expect(numDiffPixels, 'number of different pixels').lessThan(pixelLimit);
      resolve();
    }
  });
