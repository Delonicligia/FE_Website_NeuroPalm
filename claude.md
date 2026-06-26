# Dokumentasi API Routing NeuroPalm

Dokumentasi ini berisi daftar lengkap endpoint API yang tersedia di backend beserta detail komponen request payload (headers, body, form-data, params) dan response structure untuk mempermudah implementasi pada frontend React Vite.

> [!NOTE]
> * **Base URL**: `http://<backend-host>:<port>` (misal: `http://localhost:8000`)
> * **Header Otorisasi**: Untuk endpoint yang membutuhkan otorisasi, sertakan header:
>   `Authorization: Bearer <access_token>`

---

## 1. Modul Users (`/api/users`)

### Register User
* **Method**: `POST`
* **Endpoint**: `/api/users/register`
* **Autentikasi**: Tidak ada (Public)
* **Request Body** (JSON - `UserCreate`):
  | Nama Field | Tipe Data | Keterangan |
  | :--- | :--- | :--- |
  | `username` | `string` | Wajib, maks 50 karakter |
  | `email` | `string` (Email format) | Wajib |
  | `password` | `string` | Wajib, min 6 karakter |
  | `role` | `string` (`"petani"` atau `"admin"`) | Opsional (default: `"petani"`) |

* **Response Body** (`UserResponse`):
  ```json
  {
    "id": 1,
    "username": "budi_petani",
    "email": "budi@example.com",
    "role": "petani",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:43:17"
  }
  ```

---

### Login User
* **Method**: `POST`
* **Endpoint**: `/api/users/login`
* **Autentikasi**: Tidak ada (Public)
* **Request Body** (JSON - `UserLogin`):
  | Nama Field | Tipe Data | Keterangan |
  | :--- | :--- | :--- |
  | `email` | `string` (Email format) | Wajib |
  | `password` | `string` | Wajib, min 6 karakter |

* **Response Body** (`Token`):
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```

---

### Dapatkan Data Semua User
* **Method**: `GET`
* **Endpoint**: `/api/users/`
* **Autentikasi**: Tidak ada / Sesuai middleware backend (Public)
* **Response Body** (`List[UserResponse]`):
  ```json
  [
    {
      "id": 1,
      "username": "budi_petani",
      "email": "budi@example.com",
      "role": "petani",
      "created_at": "2026-06-17T10:43:17",
      "updated_at": "2026-06-17T10:43:17"
    }
  ]
  ```

---

### Informasi User yang Sedang Login
* **Method**: `GET`
* **Endpoint**: `/api/users/me`
* **Autentikasi**: Ya (Bearer Token)
* **Response Body** (`UserResponse`):
  ```json
  {
    "id": 1,
    "username": "budi_petani",
    "email": "budi@example.com",
    "role": "petani",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:43:17"
  }
  ```

---

### Update User Profile
* **Method**: `PUT`
* **Endpoint**: `/api/users/me`
* **Autentikasi**: Ya (Bearer Token)
* **Request Body** (JSON - `UserUpdate`):
  | Nama Field | Tipe Data | Keterangan |
  | :--- | :--- | :--- |
  | `username` | `string` | Opsional, maks 50 karakter |
  | `email` | `string` (Email format) | Opsional |
  | `password` | `string` | Opsional, min 6 karakter |
  | `role` | `string` (`"petani"` atau `"admin"`) | Opsional (Hanya diproses jika pengguna yang login adalah `admin`) |

* **Response Body** (`UserResponse`):
  ```json
  {
    "id": 1,
    "username": "budi_petani_baru",
    "email": "budi_baru@example.com",
    "role": "petani",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:43:30"
  }
  ```

---

### Ganti Role User
* **Method**: `PUT`
* **Endpoint**: `/api/users/{user_id}/role`
* **Autentikasi**: Ya (Bearer Token - **Hanya Admin**)
* **Path Parameter**:
  * `user_id`: ID pengguna target (integer)
* **Query Parameter**:
  * `role`: `"petani"` atau `"admin"`
* **Response Body** (`UserResponse`):
  ```json
  {
    "id": 2,
    "username": "petani_sejuta",
    "email": "sejuta@example.com",
    "role": "admin",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:45:00"
  }
  ```

---

### Hapus Akun User (Mandiri)
* **Method**: `DELETE`
* **Endpoint**: `/api/users/me`
* **Autentikasi**: Ya (Bearer Token)
* **Response Body**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

---
---

## 2. Modul Sawit (`/api/sawit`)

### Tambah Data Sawit (Dengan Gambar)
* **Method**: `POST`
* **Endpoint**: `/api/sawit/`
* **Autentikasi**: Ya (Bearer Token)
* **Request Content-Type**: `multipart/form-data`
* **Request Body (Form-Data)**:
  | Key | Tipe Data | Keterangan |
  | :--- | :--- | :--- |
  | `file` | `File` (Binary) | File gambar sawit yang diupload |
  | `tingkat_kematangan` | `string` | Wajib |
  | `warna_dominan` | `string` | Wajib |
  | `persentase` | `string` | Wajib |

* **Response Body** (`SawitResponse`):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "tingkat_kematangan": "Matang",
    "warna_dominan": "Oranye Kemerahan",
    "persentase": "85%",
    "gambar_sawit": "uploads/sawit/nama_file.jpg",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:43:17"
  }
  ```

---

### Dapatkan Daftar Data Sawit
* **Method**: `GET`
* **Endpoint**: `/api/sawit/`
* **Autentikasi**: Ya (Bearer Token)
* **Keterangan**:
  * **Admin**: Mendapatkan seluruh data sawit di database.
  * **Petani**: Hanya mendapatkan data sawit miliknya sendiri.
* **Response Body** (`List[SawitResponse]`):
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "tingkat_kematangan": "Matang",
      "warna_dominan": "Oranye Kemerahan",
      "persentase": "85%",
      "gambar_sawit": "uploads/sawit/nama_file.jpg",
      "created_at": "2026-06-17T10:43:17",
      "updated_at": "2026-06-17T10:43:17"
    }
  ]
  ```

---

### Dapatkan Detail Data Sawit
* **Method**: `GET`
* **Endpoint**: `/api/sawit/{sawit_id}`
* **Autentikasi**: Ya (Bearer Token)
* **Path Parameter**:
  * `sawit_id`: ID sawit (integer)
* **Response Body** (`SawitResponse`):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "tingkat_kematangan": "Matang",
    "warna_dominan": "Oranye Kemerahan",
    "persentase": "85%",
    "gambar_sawit": "uploads/sawit/nama_file.jpg",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:43:17"
  }
  ```

---

### Update Data Sawit
* **Method**: `PUT`
* **Endpoint**: `/api/sawit/{sawit_id}`
* **Autentikasi**: Ya (Bearer Token)
* **Path Parameter**:
  * `sawit_id`: ID sawit (integer)
* **Request Content-Type**: `multipart/form-data`
* **Request Body (Form-Data)**:
  | Key | Tipe Data | Keterangan |
  | :--- | :--- | :--- |
  | `file` | `File` (Binary) | Opsional, file gambar baru |
  | `tingkat_kematangan` | `string` | Opsional |
  | `warna_dominan` | `string` | Opsional |
  | `persentase` | `string` | Opsional |

* **Response Body** (`SawitResponse`):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "tingkat_kematangan": "Matang Sekali",
    "warna_dominan": "Merah Tua",
    "persentase": "95%",
    "gambar_sawit": "uploads/sawit/file_baru.jpg",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:46:00"
  }
  ```

---

### Hapus Data Sawit
* **Method**: `DELETE`
* **Endpoint**: `/api/sawit/{sawit_id}`
* **Autentikasi**: Ya (Bearer Token)
* **Path Parameter**:
  * `sawit_id`: ID sawit (integer)
* **Response Body**:
  ```json
  {
    "message": "Sawit record deleted successfully"
  }
  ```

---
---

## 3. Modul Harga Sawit (`/api/harga`)

### Tambah Data Harga Sawit
* **Method**: `POST`
* **Endpoint**: `/api/harga/`
* **Autentikasi**: Ya (Bearer Token - **Hanya Admin**)
* **Request Body** (JSON - `HargaCreate`):
  | Nama Field | Tipe Data | Keterangan |
  | :--- | :--- | :--- |
  | `harga_perkg` | `string` | Wajib, maks 255 karakter |
  | `keterangan` | `string` | Wajib, maks 255 karakter |

* **Response Body** (`HargaResponse`):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "harga_perkg": "2500",
    "keterangan": "Harga harian Wilayah Riau",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:43:17"
  }
  ```

---

### Dapatkan Daftar Harga Sawit
* **Method**: `GET`
* **Endpoint**: `/api/harga/`
* **Autentikasi**: Ya (Bearer Token)
* **Keterangan**: Semua role dapat melihat seluruh data daftar harga sawit.
* **Response Body** (`List[HargaResponse]`):
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "harga_perkg": "2500",
      "keterangan": "Harga harian Wilayah Riau",
      "created_at": "2026-06-17T10:43:17",
      "updated_at": "2026-06-17T10:43:17"
    }
  ]
  ```

---

### Dapatkan Detail Data Harga
* **Method**: `GET`
* **Endpoint**: `/api/harga/{harga_id}`
* **Autentikasi**: Ya (Bearer Token)
* **Path Parameter**:
  * `harga_id`: ID harga (integer)
* **Keterangan**: Semua role dapat melihat detail data harga sawit.
* **Response Body** (`HargaResponse`):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "harga_perkg": "2500",
    "keterangan": "Harga harian Wilayah Riau",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:43:17"
  }
  ```

---

### Update Data Harga
* **Method**: `PUT`
* **Endpoint**: `/api/harga/{harga_id}`
* **Autentikasi**: Ya (Bearer Token)
* **Path Parameter**:
  * `harga_id`: ID harga (integer)
* **Request Body** (JSON - `HargaUpdate`):
  | Nama Field | Tipe Data | Keterangan |
  | :--- | :--- | :--- |
  | `harga_perkg` | `string` | Opsional, maks 255 karakter |
  | `keterangan` | `string` | Opsional, maks 255 karakter |

* **Response Body** (`HargaResponse`):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "harga_perkg": "2600",
    "keterangan": "Harga disesuaikan",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:47:00"
  }
  ```

---

### Hapus Data Harga
* **Method**: `DELETE`
* **Endpoint**: `/api/harga/{harga_id}`
* **Autentikasi**: Ya (Bearer Token)
* **Path Parameter**:
  * `harga_id`: ID harga (integer)
* **Response Body**:
  ```json
  {
    "message": "Harga record deleted successfully"
  }
  ```

---
---

## 4. Modul Riwayat Klasifikasi (`/api/riwayat`)

### Tambah Data Riwayat Klasifikasi
* **Method**: `POST`
* **Endpoint**: `/api/riwayat/`
* **Autentikasi**: Ya (Bearer Token)
* **Request Body** (JSON - `RiwayatCreate`):
  | Nama Field | Tipe Data | Keterangan |
  | :--- | :--- | :--- |
  | `gambar_sawit` | `string` | Wajib, path atau link gambar sawit |
  | `tingkat_kematangan` | `string` | Wajib |
  | `warna_dominan` | `string` | Wajib |
  | `persentase` | `string` | Wajib |
  | `username` | `string` | Wajib |
  | `sawit_id` | `integer` | Wajib, ID dari data sawit terkait |

* **Response Body** (`RiwayatResponse`):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "sawit_id": 12,
    "gambar_sawit": "uploads/sawit/nama_file.jpg",
    "tingkat_kematangan": "Matang",
    "warna_dominan": "Oranye Kemerahan",
    "persentase": "85%",
    "username": "budi_petani",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:43:17"
  }
  ```

---

### Dapatkan Daftar Riwayat Klasifikasi
* **Method**: `GET`
* **Endpoint**: `/api/riwayat/`
* **Autentikasi**: Ya (Bearer Token)
* **Keterangan**:
  * **Admin**: Mendapatkan semua data riwayat klasifikasi.
  * **Petani**: Hanya mendapatkan riwayat miliknya sendiri.
* **Response Body** (`List[RiwayatResponse]`):
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "sawit_id": 12,
      "gambar_sawit": "uploads/sawit/nama_file.jpg",
      "tingkat_kematangan": "Matang",
      "warna_dominan": "Oranye Kemerahan",
      "persentase": "85%",
      "username": "budi_petani",
      "created_at": "2026-06-17T10:43:17",
      "updated_at": "2026-06-17T10:43:17"
    }
  ]
  ```

---

### Dapatkan Detail Data Riwayat
* **Method**: `GET`
* **Endpoint**: `/api/riwayat/{riwayat_id}`
* **Autentikasi**: Ya (Bearer Token)
* **Path Parameter**:
  * `riwayat_id`: ID riwayat (integer)
* **Response Body** (`RiwayatResponse`):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "sawit_id": 12,
    "gambar_sawit": "uploads/sawit/nama_file.jpg",
    "tingkat_kematangan": "Matang",
    "warna_dominan": "Oranye Kemerahan",
    "persentase": "85%",
    "username": "budi_petani",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:43:17"
  }
  ```

---

### Update Data Riwayat
* **Method**: `PUT`
* **Endpoint**: `/api/riwayat/{riwayat_id}`
* **Autentikasi**: Ya (Bearer Token)
* **Path Parameter**:
  * `riwayat_id`: ID riwayat (integer)
* **Request Body** (JSON - `RiwayatUpdate`):
  | Nama Field | Tipe Data | Keterangan |
  | :--- | :--- | :--- |
  | `gambar_sawit` | `string` | Opsional |
  | `tingkat_kematangan` | `string` | Opsional |
  | `warna_dominan` | `string` | Opsional |
  | `persentase` | `string` | Opsional |
  | `username` | `string` | Opsional |
  | `sawit_id` | `integer` | Opsional |

* **Response Body** (`RiwayatResponse`):
  ```json
  {
    "id": 1,
    "user_id": 1,
    "sawit_id": 12,
    "gambar_sawit": "uploads/sawit/nama_file_baru.jpg",
    "tingkat_kematangan": "Sangat Matang",
    "warna_dominan": "Oranye Kemerahan",
    "persentase": "90%",
    "username": "budi_petani",
    "created_at": "2026-06-17T10:43:17",
    "updated_at": "2026-06-17T10:48:00"
  }
  ```

---

### Hapus Data Riwayat
* **Method**: `DELETE`
* **Endpoint**: `/api/riwayat/{riwayat_id}`
* **Autentikasi**: Ya (Bearer Token)
* **Path Parameter**:
  * `riwayat_id`: ID riwayat (integer)
* **Response Body**:
  ```json
  {
    "message": "Riwayat record deleted successfully"
  }
  ```

---
---

## 5. Akses File Statis / Gambar (`/uploads`)
Untuk menampilkan gambar sawit di frontend React, gabungkan Base URL backend dengan path `gambar_sawit` yang didapatkan dari response API:
* **Format URL**: `http://<backend-host>:<port>/<gambar_sawit>`
* **Contoh**: `http://localhost:8000/uploads/sawit/nama_file.jpg`
