import path from "node:path";
import { Project } from "ts-morph";
import { generateProgressBar } from "../lib/progressbar";
import { suppressTsErrors } from "../lib/suppressTsErrors";

export const tsHandler = ({
  targetFilePaths,
  tsconfigPath,
  commentType,
  errorCode,
}: DefaultOptions): number => {
  // Get all project files
  const project = new Project({ tsConfigFilePath: tsconfigPath });
  const sourceFiles = project.getSourceFiles();
  const absoulteTargetFilePaths = targetFilePaths.map((targetFilePath) => {
    return path.resolve(targetFilePath);
  });

  // Initialize progress bar
  const progressBar = generateProgressBar();
  progressBar.start(sourceFiles.length, 0);

  // Rewrite source in ts/tsx file with source with comment
  let insertedCommentCount = 0;
  for (const sourceFile of sourceFiles) {
    if (!absoulteTargetFilePaths.includes(sourceFile.getFilePath())) {
      progressBar.increment();
      continue;
    }

    const { text: textWithComment, count: insertedCommentCountPerFile } =
      suppressTsErrors({
        sourceFile,
        commentType,
        withErrorCode: errorCode,
      });

    if (insertedCommentCountPerFile > 0) {
      sourceFile.replaceWithText(textWithComment);
      sourceFile.saveSync();
      insertedCommentCount += insertedCommentCountPerFile;
    }
    progressBar.increment();
  }

  progressBar.stop();
  return insertedCommentCount;
};
