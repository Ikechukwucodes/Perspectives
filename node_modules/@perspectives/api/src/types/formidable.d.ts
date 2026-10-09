declare module "formidable" {
  const formidable: (options?: Record<string, unknown>) => {
    parse(
      request: unknown,
      callback: (error: Error | null, fields: unknown, files: unknown) => void,
    ): void;
  };
  export default formidable;
}
