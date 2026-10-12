// =============================================
// Smart Expense Analyzer — app.js
// =============================================
// Cara kerja aplikasi ini (ringkasan):
// 1. Data disimpan di localStorage browser sebagai JSON.
// 2. Saat halaman dibuka, data dibaca dari localStorage.
// 3. Setiap kali data berubah (tambah/hapus), semua tampilan diperbarui.
// =============================================


// ─────────────────────────────────────────────
// BAGIAN 1: DATA AWAL (SAMPLE TRANSACTIONS)
// Data ini hanya dimuat sekali saat pertama
// kali aplikasi dibuka (localStorage masih kosong).
// ─────────────────────────────────────────────

const SAMPLE_EXPENSES = [
  { id: 1, name: "Makan siang kantin",     category: "Makanan",      amount: 15000,  date: "2025-06-01" },
  { id: 2, name: "Ojek online ke kampus",  category: "Transportasi", amount: 12000,  date: "2025-06-01" },
  { id: 3, name: "Fotokopi modul kuliah",  category: "Pendidikan",   amount: 8000,   date: "2025-06-02" },
  { id: 4, name: "Nonton film di bioskop", category: "Hiburan",      amount: 50000,  date: "2025-06-02" },
  { id: 5, name: "Sarapan bubur ayam",     category: "Makanan",      amount: 10000,  date: "2025-06-03" },
  { id: 6, name: "Beli vitamin C",         category: "Kesehatan",    amount: 25000,  date: "2025-06-03" },
  { id: 7, name: "Makan malam warteg",     category: "Makanan",      amount: 13000,  date: "2025-06-04" },
  { id: 8, name: "Beli pulsa internet",    category: "Lainnya",      amount: 30000,  date: "2025-06-04" },
  { id: 9, name: "Kopi & snack perpustakaan", category: "Makanan",   amount: 18000,  date: "2025-06-05" },
  { id: 10, name: "Bus TransJakarta",      category: "Transportasi", amount: 3500,   date: "2025-06-05" },
];

// Kunci yang digunakan untuk menyimpan data di localStorage
const STORAGE_KEY = "smartExpenses";

// Warna untuk setiap kategori pada grafik donat
const CATEGORY_COLORS = {
  Makanan:      "#f59e0b",
  Transportasi: "#3b82f6",
  Pendidikan:   "#10b981",
  Hiburan:      "#8b5cf6",
  Kesehatan:    "#ef4444",
  Lainnya:      "#94a3b8",
};


// ─────────────────────────────────────────────
// BAGIAN 2: LOCALSTORAGE — SIMPAN & BACA DATA
// ─────────────────────────────────────────────

/**
 * Membaca array pengeluaran dari localStorage.
 * Jika belum ada data, kembalikan SAMPLE_EXPENSES sebagai data awal.
 */
function loadExpenses() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    // Pertama kali buka: gunakan data contoh & simpan
    saveExpenses(SAMPLE_EXPENSES);
    return SAMPLE_EXPENSES;
  }
  // JSON.parse mengubah teks JSON kembali menjadi array objek
  return JSON.parse(raw);
}

/**
 * Menyimpan array pengeluaran ke localStorage.
 * JSON.stringify mengubah array menjadi teks agar bisa disimpan.
 */
function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}


// ─────────────────────────────────────────────
// BAGIAN 3: FORMAT MATA UANG (RUPIAH)
// ─────────────────────────────────────────────

/**
 * Mengubah angka menjadi format Rupiah Indonesia.
 * Contoh: 15000 → "Rp 15.000"
 */
function formatRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}


// ─────────────────────────────────────────────
// BAGIAN 4: RENDER KARTU RINGKASAN
// Memperbarui 4 angka di bagian atas dashboard.
// ─────────────────────────────────────────────

function renderSummary(expenses) {
  // Hitung total semua pengeluaran
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Hitung jumlah pengeluaran per kategori
  const byCategory = groupByCategory(expenses);

  // Cari kategori dengan total tertinggi
  let topCat = "—";
  if (expenses.length > 0) {
    topCat = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])[0][0]; // ambil kategori dengan nilai terbesar
  }

  // Hitung jumlah hari unik yang ada dalam data
  const uniqueDays = new Set(expenses.map(e => e.date)).size;
  const dailyAvg = uniqueDays > 0 ? Math.round(total / uniqueDays) : 0;

  // Masukkan nilai ke elemen HTML
  document.getElementById("totalExpense").textContent      = formatRupiah(total);
  document.getElementById("topCategory").textContent       = topCat;
  document.getElementById("dailyAverage").textContent      = formatRupiah(dailyAvg);
  document.getElementById("totalTransactions").textContent = expenses.length;
}


// ─────────────────────────────────────────────
// BAGIAN 5: GRAFIK DONAT (Chart.js)
// ─────────────────────────────────────────────

// Variabel untuk menyimpan instance grafik agar bisa diperbarui
let chartInstance = null;

function renderChart(expenses) {
  const byCategory = groupByCategory(expenses);
  const labels     = Object.keys(byCategory);
  const values     = Object.values(byCategory);
  const colors     = labels.map(l => CATEGORY_COLORS[l] || "#cbd5e1");

  const canvas    = document.getElementById("expenseChart");
  const emptyNote = document.getElementById("chartEmpty");

  // Jika tidak ada data, tampilkan pesan kosong, sembunyikan canvas
  if (labels.length === 0) {
    canvas.style.display    = "none";
    emptyNote.style.display = "block";
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    return;
  }

  canvas.style.display    = "block";
  emptyNote.style.display = "none";

  // Jika grafik sudah ada sebelumnya, hapus dulu agar bisa dibuat ulang
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Buat grafik donat baru menggunakan Chart.js
  chartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data:            values,
        backgroundColor: colors,
        borderWidth:     2,
        borderColor:     "#ffffff",
        hoverOffset:     6,
      }],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: true,
      cutout:              "62%",   // ukuran lubang di tengah donat
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font:      { size: 12 },
            padding:   12,
            boxWidth:  14,
            boxHeight: 14,
          },
        },
        tooltip: {
          callbacks: {
            // Format angka di tooltip menjadi Rupiah
            label: function(context) {
              return " " + formatRupiah(context.parsed);
            }
          }
        }
      }
    },
  });
}


// ─────────────────────────────────────────────
// BAGIAN 6: RENDER TABEL TRANSAKSI
// Menampilkan semua pengeluaran dalam bentuk tabel.
// ─────────────────────────────────────────────

function renderTable(expenses) {
  const tbody    = document.getElementById("expenseTableBody");
  const emptyMsg = document.getElementById("tableEmpty");
  const table    = document.getElementById("expenseTable");

  // Kosongkan isi tabel sebelum diisi ulang
  tbody.innerHTML = "";

  if (expenses.length === 0) {
    table.style.display    = "none";
    emptyMsg.style.display = "block";
    return;
  }

  table.style.display    = "table";
  emptyMsg.style.display = "none";

  // Tampilkan transaksi dari yang terbaru (dibalik urutannya)
  const sorted = [...expenses].reverse();

  sorted.forEach((expense, index) => {
    const tr = document.createElement("tr");

    // Format tanggal ke format Indonesia: "1 Jun 2025"
    const dateFormatted = new Date(expense.date + "T00:00:00")
      .toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHTML(expense.name)}</td>
      <td><span class="badge badge-${expense.category}">${expense.category}</span></td>
      <td class="amount-cell">${formatRupiah(expense.amount)}</td>
      <td>${dateFormatted}</td>
      <td>
        <button class="btn-delete" onclick="deleteExpense(${expense.id})">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


// ─────────────────────────────────────────────
// BAGIAN 7: SARAN PENGHEMATAN (BERBASIS ATURAN)
// Tidak pakai AI — murni logika perbandingan angka.
// ─────────────────────────────────────────────

function renderSuggestions(expenses) {
  const list = document.getElementById("suggestionsList");
  list.innerHTML = "";

  // Jika belum ada data, tampilkan saran default
  if (expenses.length === 0) {
    addSuggestion(list, "Mulai catat pengeluaranmu untuk mendapatkan saran penghematan personal.");
    return;
  }

  const total      = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = groupByCategory(expenses);
  const uniqueDays = new Set(expenses.map(e => e.date)).size;
  const dailyAvg   = uniqueDays > 0 ? Math.round(total / uniqueDays) : 0;

  // Aturan 1: Rata-rata harian tinggi (> Rp 80.000)
  if (dailyAvg > 80000) {
    addSuggestion(list,
      `Rata-rata pengeluaranmu Rp ${dailyAvg.toLocaleString("id-ID")}/hari. Coba tetapkan anggaran harian maksimal Rp 80.000.`
    );
  }

  // Aturan 2: Makanan > 50% total pengeluaran
  const foodTotal = byCategory["Makanan"] || 0;
  if (foodTotal / total > 0.5) {
    addSuggestion(list,
      `${Math.round(foodTotal / total * 100)}% pengeluaranmu untuk Makanan. Coba masak sendiri atau cari kantin yang lebih terjangkau.`
    );
  }

  // Aturan 3: Hiburan > 25% total pengeluaran
  const entTotal = byCategory["Hiburan"] || 0;
  if (entTotal / total > 0.25) {
    addSuggestion(list,
      `Pengeluaran Hiburan cukup tinggi (${Math.round(entTotal / total * 100)}%). Manfaatkan kegiatan kampus gratis sebagai alternatif.`
    );
  }

  // Aturan 4: Anggaran pendidikan sangat kecil (< 5%)
  const eduTotal = byCategory["Pendidikan"] || 0;
  if (expenses.length >= 5 && eduTotal / total < 0.05) {
    addSuggestion(list,
      "Investasi pada Pendidikan (buku, fotokopi, alat tulis) sangat minim. Pastikan kebutuhan belajarmu terpenuhi."
    );
  }

  // Aturan 5: Transportasi > 30% total pengeluaran
  const transTotal = byCategory["Transportasi"] || 0;
  if (transTotal / total > 0.3) {
    addSuggestion(list,
      `Biaya Transportasi (${Math.round(transTotal / total * 100)}%) cukup besar. Pertimbangkan naik kendaraan umum atau berbagi tumpangan.`
    );
  }

  // Aturan 6: Banyak transaksi (> 20) — apresiasi + saran
  if (expenses.length > 20) {
    addSuggestion(list,
      "Kamu rajin mencatat! Coba tinjau rekap bulanan dan tetapkan target pengeluaran maksimal per kategori."
    );
  }

  // Jika tidak ada saran yang terpicu, berikan pesan positif
  if (list.children.length === 0) {
    addSuggestion(list, "Pengeluaranmu terlihat seimbang. Terus pertahankan kebiasaan mencatat ini! 👍");
  }
}

/** Fungsi pembantu: tambahkan satu item ke daftar saran */
function addSuggestion(list, text) {
  const li = document.createElement("li");
  li.className   = "suggestion-item";
  li.textContent = text;
  list.appendChild(li);
}


// ─────────────────────────────────────────────
// BAGIAN 8: FUNGSI UTILITAS
// ─────────────────────────────────────────────

/**
 * Mengelompokkan pengeluaran berdasarkan kategori dan menjumlahkan total per kategori.
 * Contoh hasil: { Makanan: 56000, Transportasi: 15500, ... }
 */
function groupByCategory(expenses) {
  return expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
}

/**
 * Mencegah serangan XSS dengan mengubah karakter khusus HTML
 * menjadi entitas yang aman sebelum ditampilkan di innerHTML.
 */
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


// ─────────────────────────────────────────────
// BAGIAN 9: FUNGSI PUSAT — RENDER SEMUA TAMPILAN
// Dipanggil setiap kali data berubah agar semua
// bagian halaman selalu sinkron dengan data terbaru.
// ─────────────────────────────────────────────

function renderAll(expenses) {
  renderSummary(expenses);
  renderTable(expenses);
  renderChart(expenses);
  renderSuggestions(expenses);
}


// ─────────────────────────────────────────────
// BAGIAN 10: TAMBAH PENGELUARAN (VALIDASI FORM)
// ─────────────────────────────────────────────

/**
 * Menampilkan pesan error di bawah field form.
 * Mengembalikan true jika ada error, false jika bersih.
 */
function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (message) {
    field.classList.add("input-error");
    error.textContent = message;
    return true;
  } else {
    field.classList.remove("input-error");
    error.textContent = "";
    return false;
  }
}

// Tangkap event submit pada formulir
document.getElementById("expenseForm").addEventListener("submit", function(event) {
  // Cegah halaman reload saat form disubmit
  event.preventDefault();

  // Ambil nilai dari setiap field
  const name     = document.getElementById("expenseName").value.trim();
  const category = document.getElementById("expenseCategory").value;
  const amount   = parseFloat(document.getElementById("expenseAmount").value);
  const date     = document.getElementById("expenseDate").value;

  // ── Validasi setiap field ──
  let hasError = false;

  hasError = showError("expenseName", "nameError",
    !name ? "Nama pengeluaran tidak boleh kosong." : ""
  ) || hasError;

  hasError = showError("expenseCategory", "categoryError",
    !category ? "Pilih kategori pengeluaran." : ""
  ) || hasError;

  hasError = showError("expenseAmount", "amountError",
    isNaN(amount)  ? "Masukkan jumlah yang valid." :
    amount <= 0    ? "Jumlah harus lebih dari Rp 0." :
    amount > 1e10  ? "Jumlah terlalu besar." : ""
  ) || hasError;

  hasError = showError("expenseDate", "dateError",
    !date ? "Pilih tanggal pengeluaran." : ""
  ) || hasError;

  // Jika ada error, hentikan proses
  if (hasError) return;

  // ── Buat objek pengeluaran baru ──
  const newExpense = {
    id:       Date.now(), // gunakan timestamp sebagai ID unik
    name:     name,
    category: category,
    amount:   amount,
    date:     date,
  };

  // Baca data lama, tambahkan data baru, simpan kembali
  const expenses = loadExpenses();
  expenses.push(newExpense);
  saveExpenses(expenses);

  // Perbarui semua tampilan
  renderAll(expenses);

  // Reset form ke kondisi kosong
  event.target.reset();

  // Kembalikan tanggal ke hari ini setelah reset
  document.getElementById("expenseDate").value = getTodayDate();
});


// ─────────────────────────────────────────────
// BAGIAN 11: HAPUS PENGELUARAN
// Fungsi ini dipanggil oleh tombol "Hapus" di tabel.
// ─────────────────────────────────────────────

function deleteExpense(id) {
  // Minta konfirmasi sebelum menghapus
  if (!confirm("Hapus transaksi ini?")) return;

  // Saring (filter) semua pengeluaran kecuali yang id-nya cocok
  const expenses = loadExpenses().filter(e => e.id !== id);
  saveExpenses(expenses);
  renderAll(expenses);
}


// ─────────────────────────────────────────────
// BAGIAN 12: UTILITAS TANGGAL
// ─────────────────────────────────────────────

/** Mengembalikan tanggal hari ini dalam format "YYYY-MM-DD" */
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}


// ─────────────────────────────────────────────
// BAGIAN 13: INISIALISASI APLIKASI
// Kode ini dijalankan pertama kali saat halaman dibuka.
// ─────────────────────────────────────────────

(function init() {
  // Set tanggal default di form ke hari ini
  document.getElementById("expenseDate").value = getTodayDate();

  // Muat data dari localStorage dan tampilkan semua
  const expenses = loadExpenses();
  renderAll(expenses);
})();
