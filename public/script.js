const form = document.getElementById('form-kas');
const inputId = document.getElementById('transaksi-id');
const inputNama = document.getElementById('nama');
const inputJenis = document.getElementById('jenis');
const inputNominal = document.getElementById('nominal');
const inputStatus = document.getElementById('status');
const inputTanggal = document.getElementById('tanggal');
const btnSubmit = document.getElementById('btn-submit');
const btnBatal = document.getElementById('btn-batal');
const tabelKas = document.getElementById('tabel-kas');

const elTotalPemasukan = document.getElementById('total-pemasukan');
const elTotalPengeluaran = document.getElementById('total-pengeluaran');
const elSisaSaldo = document.getElementById('sisa-saldo');

// Set default tanggal hari ini
inputTanggal.value = new Date().toISOString().split('T')[0];

async function muatData() {
    const res = await fetch('/api/kas');
    const data = await res.json();

    tabelKas.innerHTML = '';
    let totalMasuk = 0;
    let totalKeluar = 0;

    data.forEach(item => {
        if (item.jenis === 'Pemasukan') {
            totalMasuk += item.nominal;
        } else {
            totalKeluar += item.nominal;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.tanggal}</td>
            <td>${item.nama}</td>
            <td class="${item.jenis === 'Pemasukan' ? 'text-pemasukan' : 'text-pengeluaran'}">${item.jenis}</td>
            <td>Rp ${item.nominal.toLocaleString('id-ID')}</td>
            <td><span class="badge ${item.status === 'Lunas' || item.status === 'Selesai' ? 'lunas' : 'pending'}">${item.status}</span></td>
            <td>
                <button class="btn-edit" onclick="persiapanEdit(${item.id}, '${item.nama}', '${item.jenis}', ${item.nominal}, '${item.status}', '${item.tanggal}')">Edit</button>
                <button class="btn-hapus" onclick="hapusData(${item.id})">Hapus</button>
            </td>
        `;
        tabelKas.appendChild(tr);
    });

    // Update Statistik Kartu
    elTotalPemasukan.textContent = `Rp ${totalMasuk.toLocaleString('id-ID')}`;
    elTotalPengeluaran.textContent = `Rp ${totalKeluar.toLocaleString('id-ID')}`;
    elSisaSaldo.textContent = `Rp ${(totalMasuk - totalKeluar).toLocaleString('id-ID')}`;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        nama: inputNama.value,
        jenis: inputJenis.value,
        nominal: inputNominal.value,
        status: inputStatus.value,
        tanggal: inputTanggal.value
    };

    const id = inputId.value;

    if (id) {
        await fetch(`/api/kas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else {
        await fetch('/api/kas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    resetForm();
    muatData();
});

async function hapusData(id) {
    if (confirm('Yakin ingin menghapus catatan transaksi ini?')) {
        await fetch(`/api/kas/${id}`, { method: 'DELETE' });
        muatData();
    }
}

function persiapanEdit(id, nama, jenis, nominal, status, tanggal) {
    inputId.value = id;
    inputNama.value = nama;
    inputJenis.value = jenis;
    inputNominal.value = nominal;
    inputStatus.value = status;
    inputTanggal.value = tanggal;
    btnSubmit.textContent = 'Perbarui Transaksi';
    btnBatal.style.display = 'inline-block';
}

function resetForm() {
    form.reset();
    inputId.value = '';
    inputTanggal.value = new Date().toISOString().split('T')[0];
    btnSubmit.textContent = 'Simpan Transaksi';
    btnBatal.style.display = 'none';
}

btnBatal.addEventListener('click', resetForm);

muatData();