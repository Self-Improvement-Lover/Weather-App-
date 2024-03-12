export class HTTPError extends Error {
  constructor(method: string, url: string, statusCode: number, body: string) {
    super(
      `${method} to ${url} received status ${statusCode} with body: ${body}`
    );
  }
}
