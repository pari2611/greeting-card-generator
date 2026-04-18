"""
Professional API Backend for Greeting Card Generator
Deploy on Railway, Render, or any Node.js hosting
Uses Express.js + Sharp for professional image processing
"""

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP allowed.'));
    }
  }
});

// Routes

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Greeting Card Generator API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Process image and add watermark
 * POST /api/process-image
 */
app.post('/api/process-image', upload.single('image'), async (req, res) => {
  try {
    // Validate inputs
    const { message = 'Welcome', fontSize = 48 } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No image provided',
        code: 'NO_IMAGE'
      });
    }

    if (typeof message !== 'string' || message.length === 0 || message.length > 100) {
      return res.status(400).json({ 
        error: 'Message must be between 1 and 100 characters',
        code: 'INVALID_MESSAGE'
      });
    }

    const size = parseInt(fontSize);
    if (isNaN(size) || size < 20 || size > 96) {
      return res.status(400).json({ 
        error: 'Font size must be between 20 and 96',
        code: 'INVALID_FONT_SIZE'
      });
    }

    // Process image with Sharp (professional image library)
    const processedImageBuffer = await processImageWithWatermark(
      req.file.buffer,
      message,
      size
    );

    // Generate unique filename
    const filename = `greeting-card-${uuidv4()}.png`;

    // Return as base64 data URL
    const base64Image = processedImageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return res.json({
      success: true,
      imageUrl: dataUrl,
      filename: filename,
      message: message,
      fontSize: size,
      timestamp: new Date().toISOString(),
      processingTime: `${Date.now() - req.startTime}ms`
    });

  } catch (error) {
    console.error('Processing error:', error);
    
    if (error.message.includes('Invalid input')) {
      return res.status(400).json({ 
        error: error.message,
        code: 'INVALID_INPUT'
      });
    }

    return res.status(500).json({ 
      error: 'Failed to process image',
      code: 'PROCESSING_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Batch process multiple images (optional advanced feature)
 */
app.post('/api/batch-process', upload.array('images', 5), async (req, res) => {
  try {
    const { message = 'Welcome', fontSize = 48 } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const results = await Promise.all(
      req.files.map(async (file) => {
        try {
          const processedBuffer = await processImageWithWatermark(
            file.buffer,
            message,
            parseInt(fontSize)
          );
          const base64 = processedBuffer.toString('base64');
          return {
            success: true,
            filename: file.originalname,
            imageUrl: `data:image/png;base64,${base64}`
          };
        } catch (error) {
          return {
            success: false,
            filename: file.originalname,
            error: error.message
          };
        }
      })
    );

    return res.json({
      success: true,
      processedCount: results.filter(r => r.success).length,
      totalCount: results.length,
      results: results
    });

  } catch (error) {
    return res.status(500).json({ error: 'Batch processing failed' });
  }
});

/**
 * Process image with watermark using Sharp
 */
async function processImageWithWatermark(imageBuffer, message, fontSize) {
  // Validate buffer
  if (!Buffer.isBuffer(imageBuffer)) {
    throw new Error('Invalid image buffer');
  }

  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not read image dimensions');
    }

    // Calculate scaling
    const maxWidth = 1920;
    const scale = maxWidth / metadata.width;
    
    // Prepare SVG watermark text
    const svgText = createWatermarkSvg(message, fontSize, metadata.width, metadata.height);

    // Process image: resize, add watermark, optimize
    const processedBuffer = await sharp(imageBuffer)
      .resize({
        width: Math.min(metadata.width, maxWidth),
        height: Math.floor(metadata.height * Math.min(1, scale)),
        fit: 'inside',
        withoutEnlargement: true
      })
      .composite([
        {
          input: Buffer.from(svgText),
          gravity: 'south' // Position at bottom
        }
      ])
      .png({ quality: 90, progressive: true })
      .toBuffer();

    return processedBuffer;

  } catch (error) {
    console.error('Watermark processing error:', error);
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

/**
 * Create SVG watermark with text
 */
function createWatermarkSvg(text, fontSize, imageWidth, imageHeight) {
  const padding = 30;
  const barHeight = fontSize + 30;
  
  // Estimate text width (rough calculation)
  const textWidth = text.length * (fontSize * 0.6);
  const startX = Math.max(padding, (imageWidth - textWidth) / 2);

  const svg = `
    <svg width="${imageWidth}" height="${barHeight}" xmlns="http://www.w3.org/2000/svg">
      <!-- Semi-transparent background bar -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0.6" />
        </linearGradient>
      </defs>
      
      <rect width="${imageWidth}" height="${barHeight}" fill="url(#bgGradient)" />
      
      <!-- Text with outline effect -->
      <text 
        x="${imageWidth / 2}" 
        y="${fontSize + 5}"
        font-family="Arial, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
        paint-order="stroke"
        stroke="black"
        stroke-width="${Math.max(1, fontSize * 0.08)}"
        stroke-linejoin="round"
      >
        ${escapeXml(text)}
      </text>
    </svg>
  `;

  return svg;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 10MB',
        code: 'FILE_TOO_LARGE'
      });
    }
    return res.status(400).json({ 
      error: err.message,
      code: 'UPLOAD_ERROR'
    });
  }

  res.status(500).json({ 
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    availableEndpoints: [
      'GET /health',
      'POST /api/process-image',
      'POST /api/batch-process'
    ]
  });
});

// Request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Start server
app.listen(PORT, () => {
  console.log(`
    ✨ Greeting Card Generator API
    Server running on port ${PORT}
    Environment: ${process.env.NODE_ENV || 'development'}
    
    Endpoints:
    - GET  /health
    - POST /api/process-image
    - POST /api/batch-process
  `);
});

module.exports = app;
