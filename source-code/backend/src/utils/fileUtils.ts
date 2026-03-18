import fsp from "node:fs/promises"; // Node utility to manage file system, only Promise-based
import path from "node:path"; // Node utility to manage paths cross-platform

/**
 * Deletes a uploaded file from disk given its relative URL (e.g. "/uploads/sightings/foo.jpg").
 * Silently ignores ENOENT (file already gone) and re-throws any other error.
 * @param relativeUrl Relative URL stored in the DB (e.g. "/uploads/sightings/foo.jpg")
 */
export async function deleteUploadedFile(relativeUrl: string): Promise<void> {

    // Absolute path to the uploads directory
    const uploadsDir = path.resolve(process.cwd(), "uploads");

    // Resolve the full path and normalise it
    const filepath = path.resolve(process.cwd(), relativeUrl);

    // Guard: Reject anything that escapes the uploads directory
    if (!filepath.startsWith(uploadsDir + path.sep)) {
        throw new Error(`Path traversal detected: "${relativeUrl}" resolves outside uploads directory.`);
    }

    try {
        await fsp.unlink(filepath);
    } catch (err: any) {
        if (err.code !== "ENOENT") {
            throw err;
        }
    }
}