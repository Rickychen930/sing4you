import type { Request } from 'express';

/**
 * Safely extracts a string parameter from request params
 * @param req - Express request object
 * @param paramName - Name of the parameter to extract
 * @returns The parameter value as string, or undefined if not found
 */
export function getStringParam(req: Request, paramName: string): string | undefined {
  const value = req.params[paramName];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * Safely extracts a required string parameter from request params
 * Throws error if parameter is missing
 * @param req - Express request object
 * @param paramName - Name of the parameter to extract
 * @returns The parameter value as string
 * @throws Error if parameter is missing
 */
export function getRequiredStringParam(req: Request, paramName: string): string {
  const value = getStringParam(req, paramName);
  if (!value) {
    throw new Error(`${paramName} is required`);
  }
  return value;
}
