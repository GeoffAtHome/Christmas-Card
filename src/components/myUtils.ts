// Define an async function to read the file
export async function readFile(filename: string) {
  // Create a blob from the string and the text/plain MIME type
  const blob = new Blob([], { type: 'text/plain' });

  // Create a File object from the blob, the file name and the type
  const file = new File([blob], filename, { type: 'text/plain' });

  // Create a promise that resolves with the file contents
  const promise = new Promise<string>((resolve, reject) => {
    // Create a FileReader object
    const reader = new FileReader();

    // Add a load event listener
    reader.addEventListener('load', () => {
      // Get the file contents
      const text = reader.result as string;

      // Resolve the promise with the text
      resolve(text);
    });

    // Add an error event listener
    reader.addEventListener('error', () => {
      // Reject the promise with the error
      reject(reader.error);
    });

    // Read the file as text
    reader.readAsText(file);
  });

  // Await for the promise to resolve
  const text = await promise;

  // Return the text
  return text;
}
