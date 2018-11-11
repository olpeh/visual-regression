import { TestPath, RegressionTestOptions } from './../index';
import { mkdirSync, existsSync } from 'fs';

export const generateTestPathsWithFolderNames = (paths: string[]): TestPath[] =>
  paths.map((path) => {
    const folderName =
      path === '/'
        ? 'frontpage'
        : path.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return {
      path,
      folderName
    };
  });

export const createFolders = (
  options: RegressionTestOptions,
  screenshotDirPath: string,
  testPaths: TestPath[]
) => {
  const { baseScreenshotDirPath } = options;

  // Make sure the base dir for screenshots exists
  if (!existsSync(baseScreenshotDirPath)) {
    mkdirSync(baseScreenshotDirPath);
  }

  if (!existsSync(screenshotDirPath)) {
    mkdirSync(screenshotDirPath);
  }

  testPaths.forEach((path: TestPath) => {
    if (!existsSync(`${screenshotDirPath}/${path.folderName}`)) {
      mkdirSync(`${screenshotDirPath}/${path.folderName}`);
    }
  });
};
