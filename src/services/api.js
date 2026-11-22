/**
 * API Service Layer — MaizeFit
 *
 * Semua service saat ini menggunakan mock data in-memory.
 * Saat integrasi backend, cukup ganti implementasi tiap method
 * dengan pemanggilan `request()` ke endpoint yang sesuai,
 * tanpa perlu mengubah halaman-halaman yang mengonsumsi service ini.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

/**
 * HTTP request helper — siap dipakai saat backend sudah ada.
 * Otomatis menyertakan Authorization header jika token tersedia di localStorage.
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = localStorage.getItem("maizefit_token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(
        `HTTP ${res.status}: ${res.statusText} (${errorBody.slice(0, 100)})`,
      );
    }
    return await res.json();
  } catch (error) {
    console.error(`[API Error] ${options.method || "GET"} ${url}:`, error);
    throw error;
  }
}

// ============================================================
// Mock ID generator — pengganti auto-increment dari DB
// ============================================================
function nextId(list) {
  if (list.length === 0) return 1;
  return Math.max(...list.map((item) => item.id ?? item.no ?? 0)) + 1;
}

// ============================================================
// USER SERVICE
// ============================================================
let MOCK_USERS = [
  { id: 1, nama: "Admin MaizeFit", username: "admin", role_id: 1 },
  { id: 2, nama: "Budi Santoso", username: "budi", role_id: 3 },
  { id: 3, nama: "Siti Rahayu", username: "siti", role_id: 4 },
];

export const userService = {
  getAll: async () => Promise.resolve([...MOCK_USERS]),

  create: async (payload) => {
    const newUser = { id: nextId(MOCK_USERS), ...payload };
    MOCK_USERS = [...MOCK_USERS, newUser];
    return Promise.resolve(newUser);
  },

  update: async (id, payload) => {
    MOCK_USERS = MOCK_USERS.map((u) =>
      u.id === id ? { ...u, ...payload } : u,
    );
    return Promise.resolve({ id, ...payload });
  },

  delete: async (id) => {
    MOCK_USERS = MOCK_USERS.filter((u) => u.id !== id);
    return Promise.resolve({ success: true });
  },
};

// ============================================================
// ROLE SERVICE
// ============================================================
let MOCK_ROLES = [
  { id: 1, name: "Administrator" },
  { id: 2, name: "Pakar Pertanian" },
  { id: 3, name: "Petugas Lapangan" },
  { id: 4, name: "Petani" },
];

export const roleService = {
  getAll: async () => Promise.resolve([...MOCK_ROLES]),

  create: async (payload) => {
    const newRole = { id: nextId(MOCK_ROLES), ...payload };
    MOCK_ROLES = [...MOCK_ROLES, newRole];
    return Promise.resolve(newRole);
  },

  update: async (id, payload) => {
    MOCK_ROLES = MOCK_ROLES.map((r) =>
      r.id === id ? { ...r, ...payload } : r,
    );
    return Promise.resolve({ id, ...payload });
  },

  delete: async (id) => {
    MOCK_ROLES = MOCK_ROLES.filter((r) => r.id !== id);
    return Promise.resolve({ success: true });
  },
};

// ============================================================
// KECAMATAN SERVICE
// ============================================================
let MOCK_KECAMATAN = [
  { id: 1, nama: "Ajung" },
  { id: 2, nama: "Ambulu" },
  { id: 3, nama: "Arjasa" },
  { id: 4, nama: "Balung" },
  { id: 5, nama: "Bangsalsari" },
  { id: 6, nama: "Gumukmas" },
  { id: 7, nama: "Jelbuk" },
  { id: 8, nama: "Jenggawah" },
  { id: 9, nama: "Jombang" },
  { id: 10, nama: "Kalisat" },
  { id: 11, nama: "Kaliwates" },
  { id: 12, nama: "Kencong" },
  { id: 13, nama: "Ledokombo" },
  { id: 14, nama: "Mayang" },
  { id: 15, nama: "Mumbulsari" },
  { id: 16, nama: "Pakusari" },
  { id: 17, nama: "Panti" },
  { id: 18, nama: "Patrang" },
  { id: 19, nama: "Puger" },
  { id: 20, nama: "Rambipuji" },
  { id: 21, nama: "Semboro" },
  { id: 22, nama: "Silo" },
  { id: 23, nama: "Sukorambi" },
  { id: 24, nama: "Sukowono" },
  { id: 25, nama: "Sumberbaru" },
  { id: 26, nama: "Sumberjambe" },
  { id: 27, nama: "Sumbersari" },
  { id: 28, nama: "Tanggul" },
  { id: 29, nama: "Tempurejo" },
  { id: 30, nama: "Umbulsari" },
  { id: 31, nama: "Wuluhan" },
];

export const kecamatanService = {
  getAll: async () => Promise.resolve([...MOCK_KECAMATAN]),

  create: async (payload) => {
    const newKecamatan = { id: nextId(MOCK_KECAMATAN), ...payload };
    MOCK_KECAMATAN = [...MOCK_KECAMATAN, newKecamatan];
    return Promise.resolve(newKecamatan);
  },

  update: async (id, payload) => {
    MOCK_KECAMATAN = MOCK_KECAMATAN.map((k) =>
      k.id === id ? { ...k, ...payload } : k,
    );
    return Promise.resolve({ id, ...payload });
  },

  delete: async (id) => {
    MOCK_KECAMATAN = MOCK_KECAMATAN.filter((k) => k.id !== id);
    return Promise.resolve({ success: true });
  },
};

// ============================================================
// LAHAN SERVICE
// ============================================================
let MOCK_LAHAN = [
  {
    id: 1,
    nama: "Lahan Jagung Sumbersari A",
    latitude: "-8.160100",
    longitude: "113.660000",
    pengguna: "budi",
    alamat: "Jl. Mawar No. 1, Sumbersari",
  },
  {
    id: 2,
    nama: "Lahan Jagung Kaliwates B",
    latitude: "-8.171200",
    longitude: "113.671000",
    pengguna: "siti",
    alamat: "Jl. Kenanga No. 5, Kaliwates",
  },
  {
    id: 3,
    nama: "Lahan Jagung Patrang C",
    latitude: "-8.153400",
    longitude: "113.683000",
    pengguna: "budi",
    alamat: "Jl. Raya Patrang, Patrang",
  },
  {
    id: 4,
    nama: "Lahan Jagung Rambipuji D",
    latitude: "-8.209000",
    longitude: "113.624000",
    pengguna: "siti",
    alamat: "Jl. Rambipuji No. 12, Rambipuji",
  },
  {
    id: 5,
    nama: "Lahan Jagung Ambulu E",
    latitude: "-8.343000",
    longitude: "113.603000",
    pengguna: "budi",
    alamat: "Jl. Ambulu Raya, Ambulu",
  },
  {
    id: 6,
    nama: "Lahan Jagung Balung F",
    latitude: "-8.356000",
    longitude: "113.531000",
    pengguna: "siti",
    alamat: "Jl. Balung Tengah, Balung",
  },
  {
    id: 7,
    nama: "Lahan Jagung Tanggul G",
    latitude: "-8.198000",
    longitude: "113.464000",
    pengguna: "budi",
    alamat: "Jl. Tanggul Kulon, Tanggul",
  },
  {
    id: 8,
    nama: "Lahan Jagung Kencong H",
    latitude: "-8.464000",
    longitude: "113.482000",
    pengguna: "siti",
    alamat: "Jl. Kencong Raya, Kencong",
  },
  {
    id: 9,
    nama: "Lahan Jagung Semboro I",
    latitude: "-8.333000",
    longitude: "113.410000",
    pengguna: "budi",
    alamat: "Jl. Semboro Utara, Semboro",
  },
  {
    id: 10,
    nama: "Lahan Jagung Silo J",
    latitude: "-8.113000",
    longitude: "113.834000",
    pengguna: "siti",
    alamat: "Jl. Silo Timur, Silo",
  },
];

export const lahanService = {
  getAll: async () => Promise.resolve([...MOCK_LAHAN]),

  create: async (payload) => {
    const newLahan = { id: nextId(MOCK_LAHAN), ...payload };
    MOCK_LAHAN = [...MOCK_LAHAN, newLahan];
    return Promise.resolve(newLahan);
  },

  update: async (id, payload) => {
    MOCK_LAHAN = MOCK_LAHAN.map((l) =>
      l.id === id ? { ...l, ...payload } : l,
    );
    return Promise.resolve({ id, ...payload });
  },

  delete: async (id) => {
    MOCK_LAHAN = MOCK_LAHAN.filter((l) => l.id !== id);
    return Promise.resolve({ success: true });
  },
};

// ============================================================
// INDIKATOR SERVICE
// ============================================================
let MOCK_INDIKATOR = [
  { id: 1, nama: "pH Tanah" },
  { id: 2, nama: "Ketinggian Tempat" },
  { id: 3, nama: "Ketersediaan Air" },
  { id: 4, nama: "Curah Hujan" },
  { id: 5, nama: "Isolasi Jarak" },
];

export const indikatorService = {
  getAll: async () => Promise.resolve([...MOCK_INDIKATOR]),

  create: async (payload) => {
    const newIndikator = { id: nextId(MOCK_INDIKATOR), ...payload };
    MOCK_INDIKATOR = [...MOCK_INDIKATOR, newIndikator];
    return Promise.resolve(newIndikator);
  },

  update: async (id, payload) => {
    MOCK_INDIKATOR = MOCK_INDIKATOR.map((i) =>
      i.id === id ? { ...i, ...payload } : i,
    );
    return Promise.resolve({ id, ...payload });
  },

  delete: async (id) => {
    MOCK_INDIKATOR = MOCK_INDIKATOR.filter((i) => i.id !== id);
    return Promise.resolve({ success: true });
  },
};

// ============================================================
// ATURAN SERVICE
// ============================================================
let MOCK_ATURAN = [
  {
    no: 1,
    indikator: "pH Tanah",
    kategori: "Ideal",
    deskripsi: "Tingkat keasaman pH tanah antara 6.0 - 7.0",
    cf: 1,
  },
  {
    no: 2,
    indikator: "pH Tanah",
    kategori: "Asam",
    deskripsi: "Tingkat keasaman pH tanah kurang dari 6",
    cf: 0.6,
  },
  {
    no: 3,
    indikator: "pH Tanah",
    kategori: "Basa",
    deskripsi: "Tingkat keasaman pH tanah lebih dari 7.0",
    cf: 0.2,
  },
  {
    no: 4,
    indikator: "Ketinggian Tempat",
    kategori: "Rendah",
    deskripsi: "Lahan berada di dataran rendah (<800 mdpl)",
    cf: 1,
  },
  {
    no: 5,
    indikator: "Ketinggian Tempat",
    kategori: "Sedang",
    deskripsi: "Lahan berada di ketinggian sedang (800 - 1200 mdpl)",
    cf: 0.6,
  },
  {
    no: 6,
    indikator: "Ketinggian Tempat",
    kategori: "Tinggi",
    deskripsi: "Lahan berada di dataran tinggi (1200 - 1800 mdpl)",
    cf: 0.2,
  },
  {
    no: 7,
    indikator: "Ketersediaan Air",
    kategori: "Berlimpah",
    deskripsi: "Irigasi teknis, air selalu tersedia sepanjang tahun",
    cf: 1,
  },
  {
    no: 8,
    indikator: "Ketersediaan Air",
    kategori: "Cukup",
    deskripsi: "Sumber air stabil, tetapi tidak selalu tersedia",
    cf: 0.6,
  },
  {
    no: 9,
    indikator: "Ketersediaan Air",
    kategori: "Terbatas",
    deskripsi: "Kadang-kadang mengalami kekeringan",
    cf: 0.2,
  },
  {
    no: 10,
    indikator: "Curah Hujan",
    kategori: "Sedang",
    deskripsi: "Curah hujan antara 1000 - 1500 mm/tahun",
    cf: 1,
  },
  {
    no: 11,
    indikator: "Curah Hujan",
    kategori: "Rendah",
    deskripsi: "Curah hujan kurang dari 1000 mm/tahun",
    cf: 0.6,
  },
  {
    no: 12,
    indikator: "Curah Hujan",
    kategori: "Tinggi",
    deskripsi: "Curah hujan antara 1500 - 2000 mm/tahun",
    cf: 0.2,
  },
  {
    no: 13,
    indikator: "Isolasi Jarak",
    kategori: "Jauh",
    deskripsi: "Jarak antar lahan jauh > 400 meter",
    cf: 1,
  },
  {
    no: 14,
    indikator: "Isolasi Jarak",
    kategori: "Aman",
    deskripsi: "Jarak antar lahan cukup jauh 250 - 400 meter",
    cf: 0.6,
  },
  {
    no: 15,
    indikator: "Isolasi Jarak",
    kategori: "Terlalu Dekat",
    deskripsi: "Jarak antar lahan sangat dekat < 250 meter",
    cf: 0.2,
  },
];

export const aturanService = {
  getAll: async () => Promise.resolve([...MOCK_ATURAN]),

  create: async (payload) => {
    const newAturan = { no: nextId(MOCK_ATURAN), ...payload };
    MOCK_ATURAN = [...MOCK_ATURAN, newAturan];
    return Promise.resolve(newAturan);
  },

  update: async (no, payload) => {
    MOCK_ATURAN = MOCK_ATURAN.map((a) =>
      a.no === no ? { ...a, ...payload } : a,
    );
    return Promise.resolve({ no, ...payload });
  },

  delete: async (no) => {
    MOCK_ATURAN = MOCK_ATURAN.filter((a) => a.no !== no);
    return Promise.resolve({ success: true });
  },
};

// ============================================================
// RIWAYAT PENILAIAN SERVICE
// ============================================================
let MOCK_RIWAYAT = [
  {
    id: 1,
    lahan: "Lahan Jagung Sumbersari A",
    tanggal: "10-09-2026",
    skor_kelayakan: "0.87",
    probabilitas: 87,
  },
  {
    id: 2,
    lahan: "Lahan Jagung Kaliwates B",
    tanggal: "09-09-2026",
    skor_kelayakan: "0.78",
    probabilitas: 78,
  },
  {
    id: 3,
    lahan: "Lahan Jagung Patrang C",
    tanggal: "08-09-2026",
    skor_kelayakan: "0.92",
    probabilitas: 92,
  },
  {
    id: 4,
    lahan: "Lahan Jagung Rambipuji D",
    tanggal: "07-09-2026",
    skor_kelayakan: "0.65",
    probabilitas: 65,
  },
  {
    id: 5,
    lahan: "Lahan Jagung Ambulu E",
    tanggal: "06-09-2026",
    skor_kelayakan: "0.74",
    probabilitas: 74,
  },
  {
    id: 6,
    lahan: "Lahan Jagung Balung F",
    tanggal: "05-09-2026",
    skor_kelayakan: "0.55",
    probabilitas: 55,
  },
  {
    id: 7,
    lahan: "Lahan Jagung Tanggul G",
    tanggal: "04-09-2026",
    skor_kelayakan: "0.81",
    probabilitas: 81,
  },
  {
    id: 8,
    lahan: "Lahan Jagung Kencong H",
    tanggal: "03-09-2026",
    skor_kelayakan: "0.69",
    probabilitas: 69,
  },
  {
    id: 9,
    lahan: "Lahan Jagung Semboro I",
    tanggal: "02-09-2026",
    skor_kelayakan: "0.44",
    probabilitas: 44,
  },
  {
    id: 10,
    lahan: "Lahan Jagung Silo J",
    tanggal: "01-09-2026",
    skor_kelayakan: "0.95",
    probabilitas: 95,
  },
];

export const riwayatService = {
  getAll: async () => Promise.resolve([...MOCK_RIWAYAT]),

  create: async (payload) => {
    const newRiwayat = { id: nextId(MOCK_RIWAYAT), ...payload };
    MOCK_RIWAYAT = [...MOCK_RIWAYAT, newRiwayat];
    return Promise.resolve(newRiwayat);
  },

  delete: async (id) => {
    MOCK_RIWAYAT = MOCK_RIWAYAT.filter((r) => r.id !== id);
    return Promise.resolve({ success: true });
  },
};

// ============================================================
// Default export (opsional, untuk kemudahan import sekaligus)
// ============================================================
const apiServices = {
  userService,
  roleService,
  kecamatanService,
  lahanService,
  indikatorService,
  aturanService,
  riwayatService,
};

export default apiServices;
