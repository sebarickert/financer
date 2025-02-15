import { Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

export class HttpAccessLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HttpAccessLogMiddleware.name);

  private readonly ignorePatterns = [
    /^\/static.*$/u,
    /(?:\/favicon)(?:.*)/u,
    /^\/_next.*$/u,
    /^\/fonts.*$/u,
    /^\/apple-touch-icon.*$/u,
    /^\/android-chrome-192x192.png/u,
    /^\/manifest.json/u,
    /^\/health-check\/ping$/u,
  ];

  private readonly ignorePattern = new RegExp(
    this.combineRegexPatterns(this.ignorePatterns),
    'u',
  );

  use(req: Request, res: Response, next: NextFunction): void {
    // Skip logging for paths that match the ignore patterns.
    if (this.ignorePattern.test(req.originalUrl)) {
      next();
      return;
    }
    const start = Date.now();

    // The endpoint name to logging because our current log parsing pipeline in the datadog cannot
    // Parse the endpoint name from the request path.
    // This can be removed once the log parsing pipeline is updated.
    const endpointName = `endpoint:${this.parseEndpointNameFromPath(req.originalUrl)}`;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const durationMs = `duration:${duration}ms`;
      const status = `status:${res.statusCode}`;

      // Log basic information about the request.
      this.logger.log(
        `${req.method} ${req.originalUrl} ${status}, ${durationMs}, ${endpointName}`,
      );
    });

    // Continue to the next middleware.
    next();
  }

  // eslint-disable-next-line class-methods-use-this
  private combineRegexPatterns(patterns: RegExp[]): string {
    const combinedPattern = patterns.map((pattern) => pattern.source).join('|');
    return `(${combinedPattern})`;
  }

  // eslint-disable-next-line class-methods-use-this
  private parseEndpointNameFromPath(path: string): string {
    // E.g. 66d36b1a7c0466d417b797ad
    const mongodbIdRegex = /[0-9a-f]{24}/gu;

    return (
      path
        // Remove mongodb id
        .replace(mongodbIdRegex, '*')
    );
  }
}
