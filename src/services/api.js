const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://jsonplaceholder.typicode.com";

/**
 * Helper request HTTP standar dengan error handling & JSON formatting
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
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
        `HTTP ${res.status}: ${res.statusText} (${errorBody.slice(0, 100)})`
      );
    }
    return await res.json();
  } catch (error) {
    console.error(`[API Error] ${options.method || "GET"} ${url}:`, error);
    throw error;
  }
}

// ========================================================
// USER SERVICE
// ========================================================
export const userService = {
  getAll: async () => {
    const data = await request("/users");
    return data.map((user) => ({
      id: user.id,
      nama: user.name,
      username: user.username,
      password: "",
      role_id: 1,
    }));
  },
  create: async (payload) => {
    return await request("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update: async (id, payload) => {
    return await request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  delete: async (id) => {
    return await request(`/users/${id}`, {
      method: "DELETE",
    });
  },
};

// ========================================================
// ROLE SERVICE
// ========================================================
export const roleService = {
  getAll: async () => {
    const data = await request("/users");
    return data.map((user) => ({
      id: user.id,
      name: user.name,
    }));
  },
  create: async (payload) => {
    return await request("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update: async (id, payload) => {
    return await request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  delete: async (id) => {
    return await request(`/users/${id}`, {
      method: "DELETE",
    });
  },
};

// ========================================================
// KECAMATAN SERVICE
// ========================================================
export const kecamatanService = {
  getAll: async () => {
    const data = await request("/users");
    return data.map((user) => ({
      id: user.id,
      nama: user.name,
    }));
  },
  create: async (payload) => {
    return await request("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update: async (id, payload) => {
    return await request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  delete: async (id) => {
    return await request(`/users/${id}`, {
      method: "DELETE",
    });
  },
};

// ========================================================
// LAHAN SERVICE
// ========================================================
export const lahanService = {
  getAll: async () => {
    const data = await request("/users");
    return data.map((user) => ({
      id: user.id,
      nama: user.name,
      latitude: (-8.15 - user.id * 0.01).toFixed(6),
      longitude: (113.65 + user.id * 0.01).toFixed(6),
      pengguna: user.username,
      alamat: `${user.address?.street || ""}, ${user.address?.city || ""}`,
    }));
  },
  create: async (payload) => {
    return await request("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update: async (id, payload) => {
    return await request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  delete: async (id) => {
    return await request(`/users/${id}`, {
      method: "DELETE",
    });
  },
};

// ========================================================
// RIWAYAT PENILAIAN SERVICE
// ========================================================
export const riwayatService = {
  getAll: async () => {
    const data = await request("/posts");
    return data.slice(0, 10).map((item, index) => ({
      id: item.id,
      lahan: `Lahan ${item.title.split(" ").slice(0, 2).join(" ")}`,
      tanggal: `0${Math.max(1, 10 - index)}-09-2026`,
      skor_kelayakan: (0.6 + index * 0.03).toFixed(2),
      probabilitas: 60 + index * 3,
    }));
  },
  create: async (payload) => {
    return await request("/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  delete: async (id) => {
    return await request(`/posts/${id}`, {
      method: "DELETE",
    });
  },
};

// ========================================================
// INDIKATOR SERVICE (Mock Data siap backend)
// ========================================================
const INITIAL_INDIKATOR = [
  { id: 1, nama: "pH Tanah" },
  { id: 2, nama: "Ketinggian Tempat" },
  { id: 3, nama: "Ketersediaan Air" },
  { id: 4, nama: "Curah Hujan" },
  { id: 5, nama: "Isolasi Jarak" },
];

export const indikatorService = {
  getAll: async () => {
    return Promise.resolve([...INITIAL_INDIKATOR]);
  },
  create: async (payload) => {
    return Promise.resolve({ id: Date.now(), ...payload });
  },
  update: async (id, payload) => {
    return Promise.resolve({ id, ...payload });
  },
  delete: async (id) => {
    return Promise.resolve({ success: true, id });
  },
};

// ========================================================
// ATURAN SERVICE (Mock Data siap backend)
// ========================================================
const INITIAL_ATURAN = [
  { no: 1, indikator: "pH Tanah", kategori: "Ideal", deskripsi: "Tingkat keasaman pH tanah antara 6.0 - 7.0", cf: 1 },
  { no: 2, indikator: "pH Tanah", kategori: "Asam", deskripsi: "Tingkat keasaman pH tanah kurang dari 6", cf: 0.6 },
  { no: 3, indikator: "pH Tanah", kategori: "Basa", deskripsi: "Tingkat keasaman pH tanah lebih dari 7.0", cf: 0.2 },
  { no: 4, indikator: "Ketinggian Tempat", kategori: "Rendah", deskripsi: "Lahan berada di dataran rendah (<800 mdpl)", cf: 1 },
  { no: 5, indikator: "Ketinggian Tempat", kategori: "Sedang", deskripsi: "Lahan berada di ketinggian sedang (800 - 1200 mdpl)", cf: 0.6 },
  { no: 6, indikator: "Ketinggian Tempat", kategori: "Tinggi", deskripsi: "Lahan berada di dataran tinggi (1200 - 1800 mdpl)", cf: 0.2 },
  { no: 7, indikator: "Ketersediaan Air", kategori: "Berlimpah", deskripsi: "Irigasi teknis, air selalu tersedia sepanjang tahun", cf: 1 },
  { no: 8, indikator: "Ketersediaan Air", kategori: "Cukup", deskripsi: "Sumber air stabil, tetapi tidak selalu tersedia", cf: 0.6 },
  { no: 9, indikator: "Ketersediaan Air", kategori: "Terbatas", deskripsi: "Kadang-kadang mengalami kekeringan", cf: 0.2 },
  { no: 10, indikator: "Curah Hujan", kategori: "Sedang", deskripsi: "Curah hujan antara 1000 - 1500 mm/tahun", cf: 1 },
  { no: 11, indikator: "Curah Hujan", kategori: "Rendah", deskripsi: "Curah hujan kurang dari 1000 mm/tahun", cf: 0.6 },
  { no: 12, indikator: "Curah Hujan", kategori: "Tinggi", deskripsi: "Curah hujan antara 1500 - 2000 mm/tahun", cf: 0.2 },
  { no: 13, indikator: "Isolasi Jarak", kategori: "Jauh", deskripsi: "Jarak antar lahan jauh > 400 meter", cf: 1 },
  { no: 14, indikator: "Isolasi Jarak", kategori: "Aman", deskripsi: "Jarak antar lahan cukup jauh 250 - 400 meter", cf: 0.6 },
  { no: 15, indikator: "Isolasi Jarak", kategori: "Terlalu Dekat", deskripsi: "Jarak antar lahan sangat dekat < 250 meter", cf: 0.2 },
];

export const aturanService = {
  getAll: async () => {
    return Promise.resolve([...INITIAL_ATURAN]);
  },
  create: async (payload) => {
    return Promise.resolve({ no: Date.now(), ...payload });
  },
  update: async (no, payload) => {
    return Promise.resolve({ no, ...payload });
  },
  delete: async (no) => {
    return Promise.resolve({ success: true, no });
  },
};

const apiServices = {
  userService,
  roleService,
  kecamatanService,
  lahanService,
  riwayatService,
  indikatorService,
  aturanService,
};

export default apiServices;
