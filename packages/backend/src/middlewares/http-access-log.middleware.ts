import { Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

export class HttpAccessLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HttpAccessLogMiddleware.name);

  private readonly ignorePatterns = [
    /^\/static.*$/,
    /(\/favicon)(.*)/g,
    /^\/_next.*$/,
    /^\/fonts.*$/,
    /^\/apple-touch-icon.*$/,
    /^\/android-chrome-192x192.png/,
    /^\/manifest.json/,
    /^\/health-check\/ping$/,
  ];

  private readonly ignorePattern = new RegExp(
    this._combineRegexPatterns(this.ignorePatterns),
  );

  use(req: Request, res: Response, next: NextFunction): void {
    // Skip logging for paths that match the ignore patterns.
    if (this.ignorePattern.test(req.path)) {
      return next();
    }
    const start = Date.now();

    // The endpoint name to logging because our current log parsing pipeline in the datadog cannot
    // parse the endpoint name from the request path.
    // This can be removed once the log parsing pipeline is updated.
    const endpointName = `endpoint:${this._parseEndpointNameFromPath(req.path)}`;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const durationMs = `duration:${duration}ms`;
      const status = `status:${res.statusCode}`;

      // Log basic information about the request.
      this.logger.log(
        `${req.method} ${req.url} ${status}, ${durationMs}, ${endpointName}`,
      );
    });

    // Continue to the next middleware.
    next();
  }

  private _combineRegexPatterns(patterns: RegExp[]): string {
    const combinedPattern = patterns.map((pattern) => pattern.source).join('|');
    return `(${combinedPattern})`;
  }

  private _parseEndpointNameFromPath(path: string): string {
    // e.g. 66d36b1a7c0466d417b797ad
    const mongodbIdRegex = /[0-9a-f]{24}/g;

    return (
      path
        // Remove mongodb id
        .replace(mongodbIdRegex, '*')
    );
  }
}
