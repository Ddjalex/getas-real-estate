import { Readable } from 'stream';
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from '@workspace/api-zod';
import { Router, type IRouter, type Request, type Response } from 'express';
import { requireAdmin } from '../middleware/requireAdmin';

import { ObjectPermission } from '../lib/objectAcl';
import {
  ObjectNotFoundError,
  ObjectStorageService,
} from '../lib/objectStorage';

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

/**
 * POST /storage/uploads/request-url
 *
 * Request a presigned URL for file upload.
 * Requires admin session — only staff can upload assets.
 */
router.post(
  '/storage/uploads/request-url',
  requireAdmin,
  async (req: Request, res: Response) => {
    const parsed = RequestUploadUrlBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Missing or invalid required fields' });
      return;
    }

    try {
      const { name, size, contentType } = parsed.data;
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

      res.json(
        RequestUploadUrlResponse.parse({
          uploadURL,
          objectPath,
          metadata: { name, size, contentType },
        }),
      );
    } catch (error) {
      req.log.error({ err: error }, 'Error generating upload URL');
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  },
);

/**
 * GET /storage/public-objects/*
 * Unconditionally public — no auth checks.
 */
router.get(
  '/storage/public-objects/{*filePath}',
  async (req: Request, res: Response) => {
    const filePath = (req.params as Record<string, string>).filePath ?? '';
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }
      const response = await objectStorageService.downloadObject(file);
      const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      const cacheControl = response.headers.get('cache-control');
      if (cacheControl) res.setHeader('Cache-Control', cacheControl);
      if (response.body) {
        Readable.fromWeb(response.body as import('stream/web').ReadableStream).pipe(res);
      } else {
        res.status(500).json({ error: 'Empty response body' });
      }
    } catch (error) {
      req.log.error({ err: error }, 'Error serving public object');
      res.status(500).json({ error: 'Failed to serve public object' });
    }
  },
);

/**
 * GET /storage/objects/*
 * Serves uploaded objects — public for images stored in listings/blog.
 */
router.get(
  '/storage/objects/{*objectKey}',
  async (req: Request, res: Response) => {
    const objectPath = '/objects/' + ((req.params as Record<string, string>).objectKey ?? '');
    try {
      const file = await objectStorageService.getObjectEntityFile(objectPath);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile: file,
        requestedPermission: ObjectPermission.Read,
      });
      if (!canAccess) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
      const response = await objectStorageService.downloadObject(file);
      const contentType = response.headers.get('content-type') ?? 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      const cacheControl = response.headers.get('cache-control');
      if (cacheControl) res.setHeader('Cache-Control', cacheControl);
      if (response.body) {
        Readable.fromWeb(response.body as import('stream/web').ReadableStream).pipe(res);
      } else {
        res.status(500).json({ error: 'Empty response body' });
      }
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        res.status(404).json({ error: 'Object not found' });
        return;
      }
      req.log.error({ err: error }, 'Error serving object');
      res.status(500).json({ error: 'Failed to serve object' });
    }
  },
);

/**
 * POST /admin/uploads/image
 *
 * Accepts a base64 data URL image from the admin panel and returns it back
 * after validation. The data URL is stored directly in the database (images text[]).
 * Requires admin session.
 */
router.post(
  '/storage/admin/uploads/image',
  requireAdmin,
  async (req: Request, res: Response) => {
    const { dataUrl, size } = req.body as { dataUrl?: unknown; size?: unknown };

    if (!dataUrl || typeof dataUrl !== 'string') {
      res.status(400).json({ error: 'Missing dataUrl' });
      return;
    }
    if (!dataUrl.startsWith('data:image/')) {
      res.status(400).json({ error: 'Only image files are allowed (JPEG, PNG, WebP, GIF)' });
      return;
    }

    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    const sizeNum = typeof size === 'number' ? size : Number(size);
    if (!isNaN(sizeNum) && sizeNum > MAX_BYTES) {
      res.status(400).json({ error: 'Image must be under 10 MB' });
      return;
    }

    // Rough base64 size check (each base64 char ≈ 0.75 bytes)
    const base64Part = dataUrl.split(',')[1] ?? '';
    if (base64Part.length * 0.75 > MAX_BYTES) {
      res.status(400).json({ error: 'Image must be under 10 MB' });
      return;
    }

    res.json({ url: dataUrl });
  },
);

export default router;
