const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get the single Friday Info record
exports.getFridayInfo = async (req, res) => {
  try {
    let info = await prisma.fridayInfo.findFirst();
    if (!info) {
      // Create a default one if it doesn't exist
      info = await prisma.fridayInfo.create({
        data: {
          khatib: 'Nama Khatib',
          imam: 'Nama Imam',
          muadzin: 'Nama Muadzin',
          theme: 'Tema Khutbah',
          saldoAwal: 0,
          pemasukan: 0,
          pengeluaran: 0,
          saldoAkhir: 0,
          runningText: JSON.stringify(['Mohon nonaktifkan HP Anda', 'Rapatkan dan luruskan shaf'])
        }
      });
    }
    res.json(info);
  } catch (error) {
    console.error('Error fetching friday info:', error);
    res.status(500).json({ message: 'Gagal mengambil data Jumat' });
  }
};

// Update or Upsert the Friday Info record
exports.updateFridayInfo = async (req, res) => {
  try {
    const {
      khatib, imam, muadzin, theme,
      saldoAwal, pemasukan, pengeluaran, saldoAkhir,
      runningText
    } = req.body;

    let info = await prisma.fridayInfo.findFirst();
    
    if (info) {
      info = await prisma.fridayInfo.update({
        where: { id: info.id },
        data: {
          khatib, imam, muadzin, theme,
          saldoAwal: parseFloat(saldoAwal || 0),
          pemasukan: parseFloat(pemasukan || 0),
          pengeluaran: parseFloat(pengeluaran || 0),
          saldoAkhir: parseFloat(saldoAkhir || 0),
          runningText: typeof runningText === 'string' ? runningText : JSON.stringify(runningText)
        }
      });
    } else {
      info = await prisma.fridayInfo.create({
        data: {
          khatib, imam, muadzin, theme,
          saldoAwal: parseFloat(saldoAwal || 0),
          pemasukan: parseFloat(pemasukan || 0),
          pengeluaran: parseFloat(pengeluaran || 0),
          saldoAkhir: parseFloat(saldoAkhir || 0),
          runningText: typeof runningText === 'string' ? runningText : JSON.stringify(runningText)
        }
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.to('devices').emit('content:updated', { type: 'FRIDAY_INFO' });
    }

    res.json(info);
  } catch (error) {
    console.error('Error updating friday info:', error);
    res.status(500).json({ message: 'Gagal menyimpan data Jumat' });
  }
};

exports.previewFriday = async (req, res) => {
  try {
    const io = req.app.get('io');
    if (io) {
      io.to('devices').emit('preview:friday');
    }
    res.json({ message: 'Preview terkirim' });
  } catch (error) {
    console.error('Error sending preview:', error);
    res.status(500).json({ message: 'Gagal mengirim preview' });
  }
};
