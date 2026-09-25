const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const io = require('socket.io-client');
const prisma = new PrismaClient();

async function main() {
  console.log("Looking for WAITING devices...");
  const devices = await prisma.device.findMany({
    where: { pairingCode: { not: null } },
    orderBy: { createdAt: 'desc' },
    take: 1
  });

  if (devices.length === 0) {
    console.log("No waiting devices found.");
    return;
  }

  const device = devices[0];
  console.log("Found device:", device.id, "with code:", device.pairingCode);

  const token = crypto.randomBytes(32).toString('hex');
  
  await prisma.device.update({
    where: { id: device.id },
    data: {
      token,
      pairingCode: null,
      lastConnectionStatus: true,
      name: 'TV Masjid (Auto Recovered)'
    }
  });

  console.log("Updated device with new token in DB.");

  // Now we need to emit device:paired to the TV's socket.
  // We can connect to our local websocket server and broadcast it?
  // Wait, socket.io-client can only connect as a client. It cannot emit messages TO another client directly unless there's a relay logic.
  // Does the backend have a REST API endpoint to force pair?
  // No. But wait! I can just use axios to hit `POST /devices/pair`!
  // BUT I need an admin token to hit it!

}

main().catch(console.error).finally(() => prisma.$disconnect());
