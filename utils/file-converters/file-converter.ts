export interface FileToTextConverter {
  convert(buffer: Buffer): Promise<string>;
}
