const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDevices() {
  const devices = await prisma.device.findMany();
  console.log("DEVICES:", devices);
  
  const token = "admin_token"; // check if user has admin
}

checkDevices().finally(() => prisma.$disconnect());
