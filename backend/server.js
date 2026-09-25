const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
process.env.TZ = 'Asia/Jakarta';
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { Server } = require('socket.io');
const prisma = require('./src/config/db');

const app = express();
const server = http.createServer(app);

// Use basic middleware
app.use(helmet());
app.use(cors());
app.use(compression()); // Gzip compress all responses for faster load times
app.use(express.json({ limit: '10mb' }));

// Keamanan Tambahan (Security Hardening)
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

// Mencegah serangan XSS dengan membersihkan data masuk
app.use(xss());

// Mencegah HTTP Parameter Pollution
app.use(hpp());

// Global Rate Limiter: Maksimal 1000 request per 15 menit per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit',
  standardHeaders: true, 
  legacyHeaders: false,
});
app.use(globalLimiter);

// Socket.IO configuration
const io = new Server(server, {
  path: process.env.SOCKET_PATH || '/masjid/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

io.on('connection', async (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);
  
  if (socket.handshake.query.deviceId) {
    socket.join(socket.handshake.query.deviceId);
  }

  if (socket.handshake.query.token) {
    try {
      const device = await prisma.device.findUnique({
        where: { token: socket.handshake.query.token }
      });
      if (device) {
        socket.join(device.id);
        socket.join('devices');
        
        // Update device status to online
        await prisma.device.update({
          where: { id: device.id },
          data: { 
            lastSeen: new Date(),
            lastConnectionStatus: true,
            ip: socket.handshake.headers['x-forwarded-for'] || socket.handshake.address || ''
          }
        });

        // Handle ping to keep device online
        socket.on('device:ping', async () => {
          try {
            await prisma.device.update({
              where: { id: device.id },
              data: { lastSeen: new Date() }
            });
          } catch (e) {
            // Ignore error
          }
        });

        socket.on('disconnect', async () => {
          try {
            await prisma.device.update({
              where: { id: device.id },
              data: { lastConnectionStatus: false }
            });
          } catch (e) {
            // Ignore error, device might have been deleted
          }
        });
      } else {
        // Token exists but device not found (was deleted)
        socket.emit('device:unpaired');
        socket.disconnect();
      }
    } catch (e) {
      console.error('Socket token error:', e);
    }
  }

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

// Base API route
const apiBasePath = (process.env.APP_BASE_PATH || '/masjid') + '/api';

// Routes
const authRoutes = require('./src/routes/auth.routes');
const prayerRoutes = require('./src/routes/prayer.routes');
const deviceRoutes = require('./src/routes/device.routes');
const runningTextRoutes = require('./src/routes/running-text.routes');
const mosqueRoutes = require('./src/routes/mosque.routes');
const userRoutes = require('./src/routes/user.routes');
const prayerConfigRoutes = require('./src/routes/prayerConfig.routes');
const displaySettingRoutes = require('./src/routes/displaySetting.routes');
const fridayRoutes = require('./src/routes/friday.routes');
const auditRoutes = require('./src/routes/audit.routes');

app.use(`${apiBasePath}/auth`, authRoutes);
app.use(`${apiBasePath}/prayer`, prayerRoutes);
app.use(`${apiBasePath}/devices`, deviceRoutes);
app.use(`${apiBasePath}/running-text`, runningTextRoutes);
app.use(`${apiBasePath}/mosque`, mosqueRoutes);
app.use(`${apiBasePath}/users`, userRoutes);
app.use(`${apiBasePath}/prayer-config`, prayerConfigRoutes);
app.use(`${apiBasePath}/display-setting`, displaySettingRoutes);
app.use(`${apiBasePath}/friday`, fridayRoutes);
app.use(`${apiBasePath}/audit-logs`, auditRoutes);

app.get(`${apiBasePath}/test-socket/:deviceId`, (req, res) => {
  const io = req.app.get('io');
  if (io) {
    io.to(req.params.deviceId).emit('device:paired', { token: 'test-token', mosqueId: 'test' });
    res.json({ success: true, message: `Emitted to ${req.params.deviceId}` });
  } else {
    res.json({ success: false, message: 'IO not found' });
  }
});

app.get(`${apiBasePath}/health`, (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Serve frontend static files in production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use('/masjid', express.static(frontendDistPath));

app.get('/masjid/*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base Path: ${apiBasePath}`);
  console.log(`Socket Path: ${process.env.SOCKET_PATH || '/masjid/socket.io'}`);
});
