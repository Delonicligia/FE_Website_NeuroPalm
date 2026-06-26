import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../shared/components/Sidebar';
import { hargaService, type HargaResponse } from '../../services/hargaService';
import { BASE_URL } from '../../utils/constant';

export default function Dashboard() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState<HargaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const data = await hargaService.getAll();
      setPrices(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      setError('Gagal memuat data harga pasar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data harga ini?')) return;
    try {
      await hargaService.delete(id);
      setPrices(prices.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete price:', err);
      alert('Gagal menghapus data harga.');
    }
  };

  // Calculations
  const averagePrice = prices.length
    ? Math.round(
        prices.reduce((sum, item) => sum + parseFloat(item.harga_perkg || '0'), 0) /
          prices.length
      )
    : 0;

  // Helper to parse keterangan (format: "Wilayah | Grade" or "Wilayah - Grade" or just string)
  const parseKeterangan = (ket: string) => {
    if (!ket) return { wilayah: 'Sijunjung', grade: 'Grade A', info: '', imagePath: '' };
    
    const imgMatch = ket.match(/\[IMG:(.*?)\]/);
    let cleanKet = ket;
    let imagePath = '';
    if (imgMatch) {
      imagePath = imgMatch[1];
      cleanKet = ket.replace(/\[IMG:.*?\]/, '').trim();
    }

    // Support multiple separators
    const separators = [' - ', ' | ', '-'];
    for (const sep of separators) {
      if (cleanKet.includes(sep)) {
        const parts = cleanKet.split(sep);
        return {
          wilayah: parts[0]?.trim() || 'Sijunjung',
          grade: parts[1]?.trim() || 'Grade A',
          info: parts.slice(2).join(sep)?.trim() || '',
          imagePath,
        };
      }
    }
    return { wilayah: cleanKet, grade: 'Umum', info: '', imagePath };
  };

  const formatRupiah = (num: number | string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(num));
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex font-sans">
      <Sidebar activePage="dashboard" />
      
      <div className="flex-1 flex flex-col justify-start items-start overflow-x-hidden">
        {/* Top Navbar */}
        <div className="self-stretch px-8 py-5 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex justify-start items-center gap-3">
            <div className="w-2.5 h-6 bg-emerald-800 rounded-full" />
            <div className="text-black text-xl font-bold font-['Inter'] leading-7">NeuroPalm Admin Portal</div>
          </div>
          <div className="flex justify-start items-center gap-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sistem Aktif</span>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <div className="w-full max-w-6xl mx-auto p-6 md:p-8 flex flex-col justify-start items-start gap-8">
          
          {/* Header Section */}
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-emerald-800 text-xs font-bold font-['Inter'] uppercase leading-4 tracking-wider">
                UPDATE HARIAN
              </div>
              <h1 className="text-black text-3xl md:text-4xl font-extrabold font-['Inter'] tracking-tight">
                Manajemen Harga
              </h1>
              <p className="text-neutral-500 text-sm md:text-base max-w-xl">
                Pantau dan kelola pembaruan harga Tandan Buah Segar (TBS) secara real-time untuk wilayah Sijunjung dan sekitarnya.
              </p>
            </div>
            
            <button
              onClick={() => navigate('/harga')}
              className="px-6 py-3.5 bg-gradient-to-b from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tambah Harga</span>
            </button>
          </div>

          {/* Cards Metrics Summary */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1 */}
            <div className="p-6 bg-white border border-emerald-100 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">RATA-RATA HARGA</span>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 font-bold">Rp</div>
              </div>
              <div>
                <span className="text-slate-900 text-3xl font-black font-['Inter'] leading-9">
                  {formatRupiah(averagePrice)}
                </span>
                <span className="text-neutral-500 text-sm font-normal ml-1">/kg</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-6 bg-white border border-emerald-100 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">TOTAL ENTRI</span>
                <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="text-slate-900 text-3xl font-black font-['Inter'] leading-9">
                  {prices.length} Lokasi
                </span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-6 bg-white border border-emerald-100 rounded-2xl flex flex-col gap-4 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider">STATUS PASAR</span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-600 rounded-full" />
                <span className="text-emerald-900 text-lg font-bold font-['Inter']">Stabil &amp; Aktif</span>
              </div>
            </div>
          </div>

          {/* List and Table section */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-black text-xl font-bold font-['Inter']">
                <span className='text-black'>Daftar Harga Wilayah Sijunjung</span>
              </h2>
              <button 
                onClick={fetchPrices} 
                className="p-2 bg-emerald-50 text-emerald-800 rounded-lg text-sm font-semibold hover:bg-emerald-100 flex items-center gap-2 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                </svg>
                <span>Muat Ulang</span>
              </button>
            </div>

            {/* Loading / Error States */}
            {loading && (
              <div className="w-full p-12 bg-white rounded-2xl flex justify-center items-center shadow-sm border border-slate-100">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                  <span className="text-neutral-500 text-sm font-medium">Sedang mengambil data harga...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="w-full p-8 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-center shadow-sm">
                <p className="font-semibold mb-2">{error}</p>
                <button onClick={fetchPrices} className="px-4 py-2 bg-rose-800 text-white rounded-xl text-xs font-bold hover:bg-rose-900 transition">
                  Coba Lagi
                </button>
              </div>
            )}

            {!loading && !error && prices.length === 0 && (
              <div className="w-full p-12 bg-white rounded-2xl text-center shadow-sm border border-slate-100 flex flex-col justify-center items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex justify-center items-center">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-slate-800 font-bold text-lg mb-1">Belum Ada Data Harga</h3>
                  <p className="text-neutral-500 text-sm max-w-sm">Masukkan informasi harga TBS perdana wilayah Anda dengan tombol Tambah Harga.</p>
                </div>
              </div>
            )}

            {/* Price Cards List */}
            {!loading && !error && prices.length > 0 && (
              <div className="w-full flex flex-col gap-4">
                {prices.map((price) => {
                  const details = parseKeterangan(price.keterangan);
                  const dateCreated = new Date(price.created_at || Date.now()).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const dateUpdated = new Date(price.updated_at || Date.now()).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={price.id}
                      className="w-full p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition duration-200"
                    >
                      {/* Image representation / Visual Sample Placeholder */}
                      <div className="flex items-center gap-5 w-full md:w-auto">
                        <div className="w-24 h-20 bg-emerald-50 rounded-xl overflow-hidden shrink-0 flex justify-center items-center border border-emerald-100">
                          {details.imagePath ? (
                            <img
                              src={
                                details.imagePath.startsWith('http')
                                  ? details.imagePath
                                  : `${BASE_URL || 'http://127.0.0.1:8000'}/${details.imagePath}`
                              }
                              alt="Sampel Sawit"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <svg className="w-8 h-8 text-emerald-800 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wider">
                              {details.wilayah}
                            </span>
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded uppercase tracking-wider">
                              {details.grade}
                            </span>
                            <span className="text-neutral-400 text-xs flex flex-wrap gap-x-2">
                              <span>Dibuat: {dateCreated} WIB</span>
                              <span>•</span>
                              <span>Diperbarui: {dateUpdated} WIB</span>
                            </span>
                          </div>
                          <h3 className="text-slate-900 text-lg font-bold leading-7 truncate">
                            {details.wilayah} - {details.grade}
                          </h3>
                          <p className="text-neutral-500 text-xs md:text-sm truncate mt-1">
                            {details.info || 'Entri informasi harga kelapa sawit TBS wilayah Sijunjung.'}
                          </p>
                        </div>
                      </div>

                      {/* Pricing Info & Actions */}
                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <div className="text-left md:text-right">
                          <span className="block text-neutral-400 text-[10px] font-bold uppercase tracking-wider">HARGA TBS</span>
                          <span className="text-emerald-900 text-2xl font-black font-['Inter']">
                            {formatRupiah(price.harga_perkg)}
                            <span className="text-neutral-500 text-xs font-normal ml-0.5">/kg</span>
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/harga?id=${price.id}`)}
                            title="Edit harga"
                            className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl transition cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(price.id)}
                            title="Hapus harga"
                            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl transition cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}