import mammoth from "mammoth";
import { FileToTextConverter } from "./file-converter";

export class DocsxToTextConverter implements FileToTextConverter {
  async convert(buffer: Buffer): Promise<string> {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  }
}
