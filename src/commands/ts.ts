import type { Arguments, Argv } from "yargs";
import { tsHandler } from "../handlers/tsHandler";
import { DEFAULT_OPTIONS } from "../lib/constants";
import { tsconfigExists } from "../lib/validator";

export const command: string[] = ["*", "ts"];
export const desc = "Suppress TS errors in TypeScript files";

export const builder = (yargs: Argv<DefaultOptions>): Argv<DefaultOptions> =>
  yargs
    .options(DEFAULT_OPTIONS)
    .positional("targetFilePaths", {
      array: true,
      type: "string",
      demandOption: true,
      description:
        "Path to the target ts files, which can be set with the glob pattern. eg: 'src/**/*.ts'",
    } as const)
    .check(tsconfigExists);

export const handler = (argv: Arguments<DefaultOptions>): void => {
  const { targetFilePaths, commentType, tsconfigPath, errorCode } = argv;

  const insertedCommentCount = tsHandler({
    targetFilePaths,
    tsconfigPath,
    commentType,
    errorCode,
  });

  console.log("\nCompleted 🎉");
  console.log(`suppress errors: ${insertedCommentCount}`);
};
