export interface IEncoder {
  encoder(value: string): string;
  compare(value: string, encodedValue: string): Promise<boolean>;
}
