declare module 'clipboard-copy' {
    function clipboardCopy(text: string): Promise<void>;
    export = clipboardCopy;
  }
  