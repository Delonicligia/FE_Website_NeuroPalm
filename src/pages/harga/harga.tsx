import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../shared/components/Sidebar';
import { hargaService } from '../../services/hargaService';
import { sawitService } from '../../services/sawitService';
import { BASE_URL } from '../../utils/constant';

export default function Harga() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  // Form States
  const [wilayah, setWilayah] = useState('Sijunjung');
  const [grade, setGrade] = useState('Grade A (Premium)');
  const [harga, setHarga] = useState('');
  const [info, setInfo] = useState('');
  
  // Image States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null);

  // Status States
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editId) {
      const loadPriceDetail = async () => {
        try {
          setFetchLoading(true);
          const data = await hargaService.getById(Number(editId));
          setHarga(data.harga_perkg);
          
          // Parse keterangan
          const ket = data.keterangan || '';
          const imgMatch = ket.match(/\[IMG:(.*?)\]/);
          let cleanKet = ket;
          if (imgMatch) {
            const imagePath = imgMatch[1];
            setExistingImagePath(imagePath);
            cleanKet = ket.replace(/\[IMG:.*?\]/, '').trim();
          }

          const separators = [' - ', ' | ', '-'];
          let parsedWilayah = 'Sijunjung';
          let parsedGrade = 'Grade A (Premium)';
          let parsedInfo = '';
          
          let parsed = false;
          for (const sep of separators) {
            if (cleanKet.includes(sep)) {
              const parts = cleanKet.split(sep);
              parsedWilayah = parts[0]?.trim() || '';
              parsedGrade = parts[1]?.trim() || '';
              parsedInfo = parts.slice(2).join(sep)?.trim() || '';
              parsed = true;
              break;
            }
          }
          if (!parsed) {
            parsedWilayah = cleanKet;
          }
          
          setWilayah(parsedWilayah);
          setGrade(parsedGrade);
          setInfo(parsedInfo);
        } catch (err) {
          console.error('Failed to load price details:', err);
          setError('Gagal memuat detail data harga.');
        } finally {
          setFetchLoading(false);
        }
      };
      loadPriceDetail();
    }
  }, [editId]);

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!harga) {
      setError('Harga per kg wajib diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imagePath = existingImagePath || '';

      // 1. If there's a new image file, upload it to /api/sawit/ first
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('tingkat_kematangan', grade.includes('Premium') ? 'Matang' : 'Setengah Matang');
        formData.append('warna_dominan', 'Oranye Kemerahan');
        formData.append('persentase', '90%');
        
        const uploadRes = await sawitService.create(formData);
        imagePath = uploadRes.gambar_sawit;
      }

      // 2. Build keterangan string with image path if uploaded
      const formattedKeterangan = imagePath 
        ? `${wilayah} - ${grade} - ${info} [IMG:${imagePath}]`
        : `${wilayah} - ${grade} - ${info}`;

      // 3. Create or Update Harga
      if (editId) {
        await hargaService.update(Number(editId), {
          harga_perkg: harga,
          keterangan: formattedKeterangan,
        });
      } else {
        await hargaService.create({
          harga_perkg: harga,
          keterangan: formattedKeterangan,
        });
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to save price data:', err);
      setError(
        err.response?.data?.detail || 
        'Gagal menyimpan data harga. Pastikan input valid dan Anda memiliki otorisasi Admin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex font-sans">
      <Sidebar activePage="harga" />

      <div className="flex-1 flex flex-col justify-start items-start overflow-x-hidden">
        {/* Top Navbar */}
        <div className="self-stretch pl-16 pr-8 py-5 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm md:px-8">
          <div className="flex justify-start items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <svg className="w-5 h-5 text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-emerald-900 text-sm font-semibold uppercase tracking-wider">Kembali ke Daftar</span>
          </div>
        </div>

        {/* Form Content Container */}
        {fetchLoading ? (
          <div className="w-full max-w-4xl mx-auto p-12 text-center flex justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              <span className="text-neutral-500 text-sm font-medium">Sedang memuat data...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-6 sm:gap-8">
            {/* Left side: Main Form Inputs */}
            <div className="flex-1 flex flex-col gap-6 w-full">
              <div className="flex flex-col gap-2">
                <h1 className="text-black text-2xl sm:text-3xl font-extrabold font-['Inter'] tracking-tight">
                  {editId ? 'Edit Informasi Harga' : 'Tambah Informasi Harga'}
                </h1>
                <p className="text-neutral-500 text-xs sm:text-sm">
                  Perbarui rincian harga pasar TBS berdasarkan wilayah dan kualitas grade sawit untuk memastikan akurasi data.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div className="p-4 sm:p-6 md:p-8 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col gap-4 sm:gap-6">
                <h2 className="text-black text-base sm:text-lg font-bold flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-800 rounded-full" />
                  <span className='text-black'>Detail Wilayah &amp; Kualitas</span>
                </h2>

                {/* Wilayah Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-neutral-700 text-xs font-bold uppercase tracking-wider">Nama Wilayah</label>
                  <select
                    value={wilayah}
                    onChange={(e) => setWilayah(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition"
                  >
                    <option value="Sijunjung">Sijunjung</option>
                    <option value="Kamang Baru">Kamang Baru</option>
                    <option value="Tanjung Gadang">Tanjung Gadang</option>
                    <option value="Sijunjung Tengah">Sijunjung Tengah</option>
                  </select>
                </div>

                {/* Grade Sawit */}
                <div className="flex flex-col gap-2">
                  <label className="text-neutral-700 text-xs font-bold uppercase tracking-wider">Grade Sawit</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition"
                  >
                    <option value="Grade A (Premium)">Grade A (Premium)</option>
                    <option value="Grade B (Medium)">Grade B (Medium)</option>
                    <option value="Grade C (Lokal)">Grade C (Lokal)</option>
                  </select>
                </div>

                {/* Harga per KG */}
                <div className="flex flex-col gap-2">
                  <label className="text-neutral-700 text-xs font-bold uppercase tracking-wider">Harga (RP/KG)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-neutral-500 font-bold">Rp</span>
                    <input
                      type="number"
                      required
                      placeholder="2850"
                      value={harga}
                      onChange={(e) => setHarga(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Keterangan / Info Tambahan */}
                <div className="flex flex-col gap-2">
                  <label className="text-neutral-700 text-xs font-bold uppercase tracking-wider">Informasi Tambahan / Deskripsi</label>
                  <textarea
                    rows={3}
                    placeholder="Kapasitas harian, antrean bongkar muat, grade premium dll."
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition resize-none text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-b from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer disabled:opacity-50 text-center flex justify-center items-center"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-neutral-700 font-bold rounded-2xl transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>

            {/* Right side: Visual Sawit upload preview */}
            <div className="w-full md:w-80 shrink-0">
              <div className="p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col gap-4 sm:gap-6">
                <h3 className="text-slate-900 font-bold text-base sm:text-lg flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                  <span>Sampel Visual Sawit</span>
                </h3>

                {/* Image upload block */}
                <div className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-center items-center relative group">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : existingImagePath ? (
                    <img src={`${BASE_URL}/${existingImagePath}`} alt="Existing" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-neutral-400 text-xs">Belum ada foto sampel sawit</span>
                    </div>
                  )}

                  {/* Overlay upload control */}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-2 transition duration-200 cursor-pointer text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider">Pilih File Baru</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-xl">
                  <p className="text-emerald-950 text-xs leading-5">
                    <strong>Penting:</strong> Lampirkan foto sampel dengan pencahayaan yang cukup agar mempermudah tim auditor memverifikasi grade sawit secara visual.
                  </p>
                </div>

                <label className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-sm font-bold transition duration-200 cursor-pointer text-center block">
                  <span>Pilih Foto</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}