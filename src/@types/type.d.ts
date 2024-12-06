type CommentType = 1 | 2;

type DefaultOptions = {
  targetFilePaths: string[];
  tsconfigPath: string;
  commentType: CommentType;
  errorCode: boolean;
};
