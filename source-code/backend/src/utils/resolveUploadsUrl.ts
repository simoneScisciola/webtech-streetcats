import { Request } from "express"; // Express framework (https://expressjs.com/)

/**
 * Builds the public URL for an uploaded file.
 */
export function resolveSightingPhotoUrl(req: Request, filename: string): string {
  return `${req.protocol}://${req.get('host')}/uploads/sightings/${filename}`;
}
