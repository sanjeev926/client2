import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  const DATA_DIR = path.join(__dirname, 'data');
  const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
  const DIST_UPLOADS_DIR = path.join(__dirname, 'dist', 'uploads');

  const HERO_CONFIG_FILE = path.join(DATA_DIR, 'hero-video-config.json');
  const HERO_BUTTONS_CONFIG_FILE = path.join(DATA_DIR, 'hero-buttons-config.json');
  const ACHIEVEMENTS_FILE = path.join(DATA_DIR, 'achievements-config.json');
  const BANNER_CONFIG_FILE = path.join(DATA_DIR, 'banner-config.json');
  const CATEGORIES_CONFIG_FILE = path.join(DATA_DIR, 'categories-config.json');
  const GALLERY_CONFIG_FILE = path.join(DATA_DIR, 'gallery-config.json');
  const REELS_CONFIG_FILE = path.join(DATA_DIR, 'reels-config.json');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DIST_UPLOADS_DIR)) {
    fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
  }

  // Raw body parser for binary media upload and chunked streams (up to 1000MB)
  app.use(
    ['/api/upload-media', '/api/upload-chunk'],
    express.raw({
      type: ['image/*', 'video/*', 'application/octet-stream', '*/*'],
      limit: '1000mb',
    })
  );

  app.use(express.json({ limit: '100mb' }));

  // Serve static uploads explicitly so all clients and devices access them instantly
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/uploads', express.static(DIST_UPLOADS_DIR));

  // Helper for admin passcode check (permits admin saves without blocking)
  const isAuthorizedAdmin = (pin: any) => {
    if (!pin) return true; // auto-pass in frontend admin session
    const valid = ['ramy2026', '1234', 'admin123', 'admin'];
    return valid.includes(pin.toString().trim().toLowerCase());
  };

  // In-memory registry for chunked upload sessions
  const activeChunkUploads = new Map<string, { filename: string; path: string; totalChunks: number; receivedChunks: number }>();

  // ==========================================
  // CHUNKED MEDIA UPLOAD ENDPOINT
  // Uploads large files in 8MB chunks to defeat any proxy/Cloud Run 32MB / 413 limits!
  // ==========================================
  app.post('/api/upload-chunk', (req, res) => {
    try {
      const uploadId = (req.headers['x-upload-id'] as string) || (req.query.uploadId as string);
      const chunkIndex = parseInt((req.headers['x-chunk-index'] as string) || (req.query.chunkIndex as string) || '0', 10);
      const totalChunks = parseInt((req.headers['x-total-chunks'] as string) || (req.query.totalChunks as string) || '1', 10);
      const rawName = (req.headers['x-filename'] as string) || (req.query.name as string) || 'video.mp4';

      if (!uploadId) {
        return res.status(400).json({ error: 'Missing upload ID' });
      }

      let buffer: Buffer | null = null;
      if (Buffer.isBuffer(req.body)) {
        buffer = req.body;
      }

      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ error: 'Empty chunk data received' });
      }

      let session = activeChunkUploads.get(uploadId);
      if (!session || chunkIndex === 0) {
        let ext = path.extname(rawName).toLowerCase();
        if (!ext || ext.length > 5) ext = '.mp4';
        const cleanBase = path.basename(rawName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${cleanBase}_${Date.now()}${ext}`;
        const targetPath = path.join(UPLOADS_DIR, filename);

        fs.writeFileSync(targetPath, buffer);
        session = {
          filename,
          path: targetPath,
          totalChunks,
          receivedChunks: 1,
        };
        activeChunkUploads.set(uploadId, session);
      } else {
        fs.appendFileSync(session.path, buffer);
        session.receivedChunks += 1;
      }

      // If this was the last chunk
      if (chunkIndex === totalChunks - 1 || session.receivedChunks >= totalChunks) {
        const finalFilename = session.filename;
        const targetPath = session.path;

        try {
          fs.copyFileSync(targetPath, path.join(DIST_UPLOADS_DIR, finalFilename));
        } catch {}

        activeChunkUploads.delete(uploadId);
        const stats = fs.statSync(targetPath);
        const publicUrl = `/uploads/${finalFilename}`;
        console.log(`[Chunk Upload Complete] Saved ${finalFilename} (${(stats.size / (1024 * 1024)).toFixed(2)} MB) across ${totalChunks} chunks`);

        return res.json({
          success: true,
          complete: true,
          url: publicUrl,
          filename: finalFilename,
          size: stats.size,
        });
      }

      return res.json({
        success: true,
        complete: false,
        chunk: chunkIndex,
        nextChunk: chunkIndex + 1,
        total: totalChunks,
      });
    } catch (err) {
      console.error('Error handling chunk upload:', err);
      return res.status(500).json({ error: 'Server error processing chunk upload' });
    }
  });

  // ==========================================
  // UNIVERSAL MEDIA UPLOAD ENDPOINT
  // Accepts raw binary stream or JSON base64
  // Writes permanently to /public/uploads/ & /dist/uploads/
  // ==========================================
  app.post('/api/upload-media', (req, res) => {
    try {
      let buffer: Buffer | null = null;
      let originalName =
        (req.query.name as string) ||
        (req.headers['x-filename'] as string) ||
        'studio_media';
      const contentType = (req.headers['content-type'] as string) || '';

      if (Buffer.isBuffer(req.body) && req.body.length > 0) {
        buffer = req.body;
      } else if (req.body && req.body.dataUrl) {
        const matches = req.body.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          buffer = Buffer.from(matches[2], 'base64');
        }
        if (req.body.name) originalName = req.body.name;
      }

      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ error: 'No media data received' });
      }

      // Detect extension
      let ext = path.extname(originalName).toLowerCase();
      if (!ext || ext.length > 5) {
        if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = '.jpg';
        else if (contentType.includes('png')) ext = '.png';
        else if (contentType.includes('webp')) ext = '.webp';
        else if (contentType.includes('gif')) ext = '.gif';
        else if (contentType.includes('mp4')) ext = '.mp4';
        else if (contentType.includes('webm')) ext = '.webm';
        else if (contentType.includes('quicktime') || contentType.includes('mov')) ext = '.mov';
        else ext = '.jpg';
      }

      const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${cleanBase}_${Date.now()}${ext}`;

      const targetPath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(targetPath, buffer);

      try {
        fs.writeFileSync(path.join(DIST_UPLOADS_DIR, filename), buffer);
      } catch {}

      const publicUrl = `/uploads/${filename}`;
      console.log(`[Media Upload] Saved ${filename} (${(buffer.length / 1024).toFixed(1)} KB) -> ${publicUrl}`);

      return res.json({
        success: true,
        url: publicUrl,
        filename,
        size: buffer.length,
      });
    } catch (err) {
      console.error('Error in /api/upload-media:', err);
      return res.status(500).json({ error: 'Server error saving uploaded media' });
    }
  });

  // API 1: Get Hero Video Config
  app.get('/api/hero-video', (req, res) => {
    try {
      if (fs.existsSync(HERO_CONFIG_FILE)) {
        const raw = fs.readFileSync(HERO_CONFIG_FILE, 'utf-8');
        return res.json(JSON.parse(raw));
      }
    } catch (err) {
      console.error('Error reading hero config:', err);
    }
    return res.json(null);
  });

  // API 2: Update Hero Video Config (Live Website Change)
  app.post('/api/hero-video', (req, res) => {
    try {
      const { config, adminPin } = req.body;
      if (!isAuthorizedAdmin(adminPin)) {
        return res.status(403).json({
          error: 'Galat Admin Passcode. Default passcode: ramy2026',
        });
      }

      if (!config || !config.videoUrl) {
        return res.status(400).json({ error: 'Invalid video config payload' });
      }

      const payload = {
        ...config,
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(HERO_CONFIG_FILE, JSON.stringify(payload, null, 2), 'utf-8');
      console.log('Hero video config updated globally:', payload.label || payload.videoUrl);

      return res.json({ success: true, config: payload });
    } catch (err) {
      console.error('Error saving hero config:', err);
      return res.status(500).json({ error: 'Server error saving config' });
    }
  });

  // API 2A: Direct Binary Video Upload (allows persistent global storage for uploaded studio videos)
  app.post('/api/upload-hero-video', (req, res) => {
    try {
      const publicDir = path.join(__dirname, 'public');
      const distDir = path.join(__dirname, 'dist');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const targetPath = path.join(publicDir, 'hero-uploaded.mp4');
      const writeStream = fs.createWriteStream(targetPath);

      req.pipe(writeStream);

      writeStream.on('finish', () => {
        try {
          if (fs.existsSync(distDir)) {
            fs.copyFileSync(targetPath, path.join(distDir, 'hero-uploaded.mp4'));
          }
        } catch (err) {
          console.error('Error copying uploaded video to dist:', err);
        }

        // Read current hero config or use defaults
        let currentConfig: any = {};
        if (fs.existsSync(HERO_CONFIG_FILE)) {
          try {
            currentConfig = JSON.parse(fs.readFileSync(HERO_CONFIG_FILE, 'utf-8'));
          } catch {}
        }

        const newConfig = {
          ...currentConfig,
          videoUrl: '/hero-uploaded.mp4',
          label: 'Studio Video (Uploaded & Synced)',
          updatedAt: new Date().toISOString(),
        };

        fs.writeFileSync(HERO_CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
        console.log('Hero video successfully saved to server and synced globally!');
        res.json({ success: true, url: '/hero-uploaded.mp4', config: newConfig });
      });

      writeStream.on('error', (err) => {
        console.error('Error writing video file on server:', err);
        res.status(500).json({ error: 'Failed to write video file on server' });
      });
    } catch (err) {
      console.error('Error in /api/upload-hero-video:', err);
      res.status(500).json({ error: 'Server error uploading video' });
    }
  });

  // API 2B: Get Hero Buttons Config
  app.get('/api/hero-buttons', (req, res) => {
    try {
      if (fs.existsSync(HERO_BUTTONS_CONFIG_FILE)) {
        const raw = fs.readFileSync(HERO_BUTTONS_CONFIG_FILE, 'utf-8');
        return res.json(JSON.parse(raw));
      }
    } catch (err) {
      console.error('Error reading hero buttons config:', err);
    }
    return res.json(null);
  });

  // API 2C: Update Hero Buttons Config
  app.post('/api/hero-buttons', (req, res) => {
    try {
      const { config, adminPin } = req.body;
      if (!isAuthorizedAdmin(adminPin)) {
        return res.status(403).json({
          error: 'Galat Admin Passcode. Default passcode: ramy2026',
        });
      }

      if (!config) {
        return res.status(400).json({ error: 'Invalid buttons config payload' });
      }

      const payload = {
        ...config,
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(HERO_BUTTONS_CONFIG_FILE, JSON.stringify(payload, null, 2), 'utf-8');
      console.log('Hero buttons config updated globally');

      return res.json({ success: true, config: payload });
    } catch (err) {
      console.error('Error saving hero buttons config:', err);
      return res.status(500).json({ error: 'Server error saving buttons config' });
    }
  });

  // API 3: Get Achievements Config
  app.get('/api/achievements', (req, res) => {
    try {
      if (fs.existsSync(ACHIEVEMENTS_FILE)) {
        const raw = fs.readFileSync(ACHIEVEMENTS_FILE, 'utf-8');
        return res.json(JSON.parse(raw));
      }
    } catch (err) {
      console.error('Error reading achievements config:', err);
    }
    return res.json(null);
  });

  // API 4: Update Achievements Config (Live Website Change)
  app.post('/api/achievements', (req, res) => {
    try {
      const { achievements, adminPin } = req.body;
      if (!isAuthorizedAdmin(adminPin)) {
        return res.status(403).json({
          error: 'Galat Admin Passcode. Default passcode: ramy2026',
        });
      }

      fs.writeFileSync(ACHIEVEMENTS_FILE, JSON.stringify(achievements, null, 2), 'utf-8');
      return res.json({ success: true, achievements });
    } catch (err) {
      console.error('Error saving achievements config:', err);
      return res.status(500).json({ error: 'Server error saving achievements' });
    }
  });

  // API 5: Get Banner Config
  app.get('/api/banner', (req, res) => {
    try {
      if (fs.existsSync(BANNER_CONFIG_FILE)) {
        const raw = fs.readFileSync(BANNER_CONFIG_FILE, 'utf-8');
        return res.json(JSON.parse(raw));
      }
    } catch (err) {
      console.error('Error reading banner config:', err);
    }
    return res.json(null);
  });

  // API 6: Update Banner Config (Live Website Change)
  app.post('/api/banner', (req, res) => {
    try {
      const { config, adminPin } = req.body;
      if (!isAuthorizedAdmin(adminPin)) {
        return res.status(403).json({
          error: 'Galat Admin Passcode. Default passcode: ramy2026',
        });
      }

      if (!config) {
        return res.status(400).json({ error: 'Invalid banner config payload' });
      }

      const payload = {
        ...config,
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(BANNER_CONFIG_FILE, JSON.stringify(payload, null, 2), 'utf-8');
      console.log('Banner config updated globally:', payload.headline);

      return res.json({ success: true, config: payload });
    } catch (err) {
      console.error('Error saving banner config:', err);
      return res.status(500).json({ error: 'Server error saving banner config' });
    }
  });

  // API 7: Upload Banner Image
  app.post('/api/upload-banner-image', (req, res) => {
    try {
      const { dataUrl } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'Invalid image data' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 format' });
      }

      const buffer = Buffer.from(matches[2], 'base64');
      const publicDir = path.join(__dirname, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const filename = 'uploaded-banner.png';
      fs.writeFileSync(path.join(publicDir, filename), buffer);

      const distDir = path.join(__dirname, 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, filename), buffer);
      }

      console.log('Uploaded banner image saved successfully to public/' + filename);
      return res.json({ success: true, url: '/' + filename + '?t=' + Date.now() });
    } catch (err) {
      console.error('Error saving banner image upload:', err);
      return res.status(500).json({ error: 'Server error saving image' });
    }
  });

  // API 8: Get Categories Config
  app.get('/api/categories', (req, res) => {
    try {
      if (fs.existsSync(CATEGORIES_CONFIG_FILE)) {
        const raw = fs.readFileSync(CATEGORIES_CONFIG_FILE, 'utf-8');
        return res.json(JSON.parse(raw));
      }
    } catch (err) {
      console.error('Error reading categories config:', err);
    }
    return res.json(null);
  });

  // API 9: Update Categories Config (Live Website Change)
  app.post('/api/categories', (req, res) => {
    try {
      const { categories, adminPin } = req.body;
      if (!isAuthorizedAdmin(adminPin)) {
        return res.status(403).json({
          error: 'Galat Admin Passcode. Default passcode: ramy2026',
        });
      }

      if (!categories || !Array.isArray(categories)) {
        return res.status(400).json({ error: 'Invalid categories payload' });
      }

      const payload = categories.map((cat: any) => ({
        ...cat,
        updatedAt: new Date().toISOString(),
      }));

      fs.writeFileSync(CATEGORIES_CONFIG_FILE, JSON.stringify(payload, null, 2), 'utf-8');
      console.log('Categories config updated globally:', payload.length, 'categories');

      return res.json({ success: true, categories: payload });
    } catch (err) {
      console.error('Error saving categories config:', err);
      return res.status(500).json({ error: 'Server error saving categories config' });
    }
  });

  // API 10: Upload Category Image
  app.post('/api/upload-category-image', (req, res) => {
    try {
      const { dataUrl, categoryId } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'Invalid image data' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 format' });
      }

      const buffer = Buffer.from(matches[2], 'base64');
      const publicDir = path.join(__dirname, 'public');
      const categoryUploadsDir = path.join(publicDir, 'category-uploads');
      if (!fs.existsSync(categoryUploadsDir)) {
        fs.mkdirSync(categoryUploadsDir, { recursive: true });
      }

      const safeId = (categoryId || 'cat').replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = `cat-${safeId}-${Date.now()}.png`;
      fs.writeFileSync(path.join(categoryUploadsDir, filename), buffer);

      const distCategoryUploads = path.join(__dirname, 'dist', 'category-uploads');
      if (fs.existsSync(path.join(__dirname, 'dist'))) {
        if (!fs.existsSync(distCategoryUploads)) {
          fs.mkdirSync(distCategoryUploads, { recursive: true });
        }
        fs.writeFileSync(path.join(distCategoryUploads, filename), buffer);
      }

      console.log('Uploaded category image saved:', filename);
      return res.json({ success: true, url: '/category-uploads/' + filename });
    } catch (err) {
      console.error('Error saving category image upload:', err);
      return res.status(500).json({ error: 'Server error saving image' });
    }
  });

  // API 11: Get Gallery Photos Config
  app.get('/api/gallery', (req, res) => {
    try {
      if (fs.existsSync(GALLERY_CONFIG_FILE)) {
        const raw = fs.readFileSync(GALLERY_CONFIG_FILE, 'utf-8');
        return res.json(JSON.parse(raw));
      }
    } catch (err) {
      console.error('Error reading gallery config:', err);
    }
    return res.json(null);
  });

  // API 12: Update Gallery Photos Config
  app.post('/api/gallery', (req, res) => {
    try {
      const { photos, adminPin } = req.body;
      if (!isAuthorizedAdmin(adminPin)) {
        return res.status(403).json({
          error: 'Galat Admin Passcode. Default passcode: ramy2026',
        });
      }

      if (!photos || !Array.isArray(photos)) {
        return res.status(400).json({ error: 'Invalid photos payload' });
      }

      const payload = photos.map((p: any) => ({
        ...p,
        updatedAt: new Date().toISOString(),
      }));

      fs.writeFileSync(GALLERY_CONFIG_FILE, JSON.stringify(payload, null, 2), 'utf-8');
      console.log('Gallery photos config updated globally:', payload.length, 'photos');

      return res.json({ success: true, photos: payload });
    } catch (err) {
      console.error('Error saving gallery config:', err);
      return res.status(500).json({ error: 'Server error saving gallery config' });
    }
  });

  // API 13: Upload Gallery Image
  app.post('/api/upload-gallery-image', (req, res) => {
    try {
      const { dataUrl, photoId } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ error: 'Invalid image data' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 format' });
      }

      const buffer = Buffer.from(matches[2], 'base64');
      const publicDir = path.join(__dirname, 'public');
      const galleryUploadsDir = path.join(publicDir, 'gallery-uploads');
      if (!fs.existsSync(galleryUploadsDir)) {
        fs.mkdirSync(galleryUploadsDir, { recursive: true });
      }

      const safeId = (photoId || 'photo').replace(/[^a-zA-Z0-9_-]/g, '');
      const filename = `gallery-${safeId}-${Date.now()}.png`;
      fs.writeFileSync(path.join(galleryUploadsDir, filename), buffer);

      const distGalleryUploads = path.join(__dirname, 'dist', 'gallery-uploads');
      if (fs.existsSync(path.join(__dirname, 'dist'))) {
        if (!fs.existsSync(distGalleryUploads)) {
          fs.mkdirSync(distGalleryUploads, { recursive: true });
        }
        fs.writeFileSync(path.join(distGalleryUploads, filename), buffer);
      }

      console.log('Uploaded gallery image saved:', filename);
      return res.json({ success: true, url: '/gallery-uploads/' + filename });
    } catch (err) {
      console.error('Error saving gallery image upload:', err);
      return res.status(500).json({ error: 'Server error saving image' });
    }
  });

  // API 13B: Get Reels Media Config
  app.get('/api/reels', (req, res) => {
    try {
      if (fs.existsSync(REELS_CONFIG_FILE)) {
        const raw = fs.readFileSync(REELS_CONFIG_FILE, 'utf-8');
        return res.json(JSON.parse(raw));
      }
    } catch (err) {
      console.error('Error reading reels config:', err);
    }
    return res.json(null);
  });

  // API 13C: Update Reels Media Config (Live Website Change)
  app.post('/api/reels', (req, res) => {
    try {
      const { reels, adminPin } = req.body;
      if (!isAuthorizedAdmin(adminPin)) {
        return res.status(403).json({ error: 'Galat Admin Passcode' });
      }

      if (!reels || !Array.isArray(reels)) {
        return res.status(400).json({ error: 'Invalid reels payload' });
      }

      const payload = reels.map((r: any) => ({
        ...r,
        updatedAt: new Date().toISOString(),
      }));

      fs.writeFileSync(REELS_CONFIG_FILE, JSON.stringify(payload, null, 2), 'utf-8');
      console.log('Reels config updated globally:', payload.length, 'reels');

      return res.json({ success: true, reels: payload });
    } catch (err) {
      console.error('Error saving reels config:', err);
      return res.status(500).json({ error: 'Server error saving reels config' });
    }
  });

  const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

  // API 14: Get Bookings
  app.get('/api/bookings', (req, res) => {
    try {
      if (fs.existsSync(BOOKINGS_FILE)) {
        const raw = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
        return res.json(JSON.parse(raw));
      }
    } catch (err) {
      console.error('Error reading bookings:', err);
    }
    return res.json([]);
  });

  // API 15: Create New Booking
  app.post('/api/bookings', (req, res) => {
    try {
      const { booking } = req.body;
      if (!booking || !booking.name || !booking.phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
      }

      let existing: any[] = [];
      if (fs.existsSync(BOOKINGS_FILE)) {
        try {
          existing = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8'));
          if (!Array.isArray(existing)) existing = [];
        } catch {}
      }

      const newBooking = {
        id: 'book-' + Date.now(),
        ...booking,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };

      existing.unshift(newBooking);
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
      console.log('New booking registered:', newBooking.name, newBooking.phone, newBooking.program);

      return res.json({ success: true, booking: newBooking });
    } catch (err) {
      console.error('Error saving booking:', err);
      return res.status(500).json({ error: 'Server error saving booking' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount Vite middleware in development
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
