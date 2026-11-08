const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data Mockup awal untuk Kas Kelas 03TPLP003 / Himpunan
let dataKas = [
    { id: 1, nama: "Arjuna Rauf", jenis: "Pemasukan", nominal: 50000, status: "Lunas", tanggal: "2026-11-01" },
    { id: 2, nama: "Budi Santoso", jenis: "Pemasukan", nominal: 50000, status: "Lunas", tanggal: "2026-11-02" },
    { id: 3, nama: "Beli Spidol & Penghapus", jenis: "Pengeluaran", nominal: 25000, status: "Selesai", tanggal: "2026-11-03" }
];

// READ: Mengambil seluruh data transaksi
app.get('/api/kas', (req, res) => {
    res.json(dataKas);
});

// CREATE: Menambah transaksi baru (Pemasukan / Pengeluaran)
app.post('/api/kas', (req, res) => {
    const transaksiBaru = {
        id: Date.now(),
        nama: req.body.nama,
        jenis: req.body.jenis,
        nominal: Number(req.body.nominal),
        status: req.body.status,
        tanggal: req.body.tanggal || new Date().toISOString().split('T')[0]
    };
    dataKas.push(transaksiBaru);
    res.status(201).json({ pesan: "Transaksi berhasil ditambahkan", data: transaksiBaru });
});

// UPDATE: Mengubah data transaksi
app.put('/api/kas/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = dataKas.findIndex(item => item.id === id);

    if (index !== -1) {
        dataKas[index] = {
            id,
            nama: req.body.nama,
            jenis: req.body.jenis,
            nominal: Number(req.body.nominal),
            status: req.body.status,
            tanggal: req.body.tanggal
        };
        res.json({ pesan: "Transaksi berhasil diperbarui", data: dataKas[index] });
    } else {
        res.status(404).json({ pesan: "Data tidak ditemukan" });
    }
});

// DELETE: Menghapus transaksi
app.delete('/api/kas/:id', (req, res) => {
    const id = Number(req.params.id);
    dataKas = dataKas.filter(item => item.id !== id);
    res.json({ pesan: "Transaksi berhasil dihapus" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Kas Pro berjalan di http://localhost:${PORT}`);
});