import { saveDeviceMediaFile } from './mediaStorage';

/**
 * Upload large files in chunks (6MB each) to completely prevent HTTP 413 Payload Too Large
 * and overcome Cloud Run / reverse-proxy request limits.
 */
async function uploadFileInChunks(
  file: File,
  cleanName: string,
  onProgress?: (percent: number, loaded: number, total: number) => void
): Promise<string> {
  const CHUNK_SIZE = 6 * 1024 * 1024; // 6MB chunk size
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const uploadId = `upl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  let finalUrl = '';

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunkBlob = file.slice(start, end);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/api/upload-chunk?uploadId=${encodeURIComponent(uploadId)}&chunkIndex=${chunkIndex}&totalChunks=${totalChunks}&name=${encodeURIComponent(cleanName)}`);
      xhr.setRequestHeader('Content-Type', 'application/octet-stream');
      xhr.setRequestHeader('X-Upload-ID', uploadId);
      xhr.setRequestHeader('X-Chunk-Index', chunkIndex.toString());
      xhr.setRequestHeader('X-Total-Chunks', totalChunks.toString());
      xhr.setRequestHeader('X-Filename', cleanName);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const overallLoaded = start + e.loaded;
            const percent = Math.min(99, Math.round((overallLoaded / file.size) * 100));
            onProgress(percent, overallLoaded, file.size);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data && data.url) {
              finalUrl = data.url;
            }
            resolve();
            return;
          } catch {
            resolve();
            return;
          }
        }
        reject(new Error(`Chunk ${chunkIndex + 1}/${totalChunks} upload failed with status ${xhr.status}`));
      };

      xhr.onerror = () => {
        reject(new Error(`Network error on chunk ${chunkIndex + 1}/${totalChunks}`));
      };

      xhr.send(chunkBlob);
    });

    if (onProgress) {
      const chunkLoaded = Math.min(file.size, (chunkIndex + 1) * CHUNK_SIZE);
      const percent = Math.min(99, Math.round((chunkLoaded / file.size) * 100));
      onProgress(percent, chunkLoaded, file.size);
    }
  }

  if (onProgress) {
    onProgress(100, file.size, file.size);
  }

  if (!finalUrl) {
    throw new Error('Chunked upload completed but no file URL was returned by server');
  }

  console.log(`[Chunk Upload Success] Synced to server: ${finalUrl}`);
  return finalUrl;
}

/**
 * Universal Device-to-Server Media Uploader with Real-Time Progress
 * Automatically chooses between direct upload or chunked upload based on file size,
 * ensuring no 413 (Payload Too Large) errors occur on any device or network!
 */
export async function uploadMediaWithProgress(
  file: File,
  prefix: string = 'media',
  onProgress?: (percent: number, loaded: number, total: number) => void
): Promise<string> {
  const cleanName = `${prefix}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  // If file is > 8MB, use chunked upload to prevent HTTP 413 Payload Too Large
  if (file.size > 8 * 1024 * 1024) {
    return uploadFileInChunks(file, cleanName, onProgress);
  }

  // Small files (<= 8MB): single upload with automatic fallback to chunked upload
  try {
    return await new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/api/upload-media?name=${encodeURIComponent(cleanName)}`);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.setRequestHeader('X-Filename', cleanName);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && e.total > 0) {
            const percent = Math.min(100, Math.round((e.loaded / e.total) * 100));
            onProgress(percent, e.loaded, e.total);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data && data.url) {
              console.log(`[Upload Success] File synced to server: ${data.url}`);
              resolve(data.url);
              return;
            }
          } catch {
            // ignore
          }
        }
        reject(new Error(`Upload failed with server status ${xhr.status}`));
      };

      xhr.onerror = () => {
        reject(new Error('Network connection error during upload'));
      };

      xhr.send(file);
    });
  } catch (err: any) {
    if (err.message && err.message.includes('413')) {
      console.warn('Single upload hit 413, falling back to chunked upload...');
      return uploadFileInChunks(file, cleanName, onProgress);
    }
    throw err;
  }
}

/**
 * Universal Device-to-Server Media Uploader
 */
export async function uploadMediaToServer(
  file: File,
  prefix: string = 'media'
): Promise<string> {
  try {
    return await uploadMediaWithProgress(file, prefix);
  } catch (err) {
    console.warn('[Upload Warning] Server upload failed, attempting fallback:', err);
  }

  // Graceful fallback to browser local IndexedDB if server is temporarily unreachable
  try {
    const key = `${prefix}_${Date.now()}`;
    const local = await saveDeviceMediaFile(key, file, file.name);
    return local.url;
  } catch (localErr) {
    console.error('All upload and local saving strategies failed:', localErr);
    return URL.createObjectURL(file);
  }
}

/**
 * Upload Base64 Image string to Server
 */
export async function uploadBase64ToServer(
  dataUrl: string,
  prefix: string = 'image',
  ext: string = '.png'
): Promise<string> {
  const filename = `${prefix}_${Date.now()}${ext}`;

  try {
    const res = await fetch('/api/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, name: filename }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('Base64 server upload failed:', err);
  }

  return dataUrl;
}
