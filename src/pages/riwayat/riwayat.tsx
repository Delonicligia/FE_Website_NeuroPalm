import { useEffect, useState } from 'react';
import Sidebar from '../../shared/components/Sidebar';
import { riwayatService, type RiwayatResponse } from '../../services/riwayatService';
import { BASE_URL } from '../../utils/constant';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Riwayat() {
  const [logs, setLogs] = useState<RiwayatResponse[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<RiwayatResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedBlock, setSelectedBlock] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await riwayatService.getAll();
      setLogs(data);
      setFilteredLogs(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setError('Gagal memuat log riwayat klasifikasi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter application
  useEffect(() => {
    let result = [...logs];

    if (selectedBlock !== 'Semua') {
      result = result.filter(
        (log) => 
          log.warna_dominan?.toLowerCase().includes(selectedBlock.toLowerCase()) ||
          `Blok ${log.sawit_id}`.toLowerCase().includes(selectedBlock.toLowerCase())
      );
    }

    if (selectedStatus !== 'Semua') {
      result = result.filter(
        (log) => log.tingkat_kematangan?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (searchQuery) {
      result = result.filter(
        (log) =>
          log.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.tingkat_kematangan?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLogs(result);
  }, [selectedBlock, selectedStatus, searchQuery, logs]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus catatan riwayat ini?')) return;
    try {
      await riwayatService.delete(id);
      setLogs(logs.filter((log) => log.id !== id));
    } catch (err) {
      console.error('Failed to delete log:', err);
      alert('Gagal menghapus catatan riwayat.');
    }
  };

  // Calculations
  const averageAccuracy = logs.length
    ? Math.round(
        logs.reduce((sum, log) => {
          const val = parseInt(log.persentase?.replace('%', '') || '0', 10);
          return sum + (isNaN(val) ? 0 : val);
        }, 0) / logs.length
      )
    : 0;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return {
        date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
    } catch {
      return { date: dateStr, time: '' };
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(6, 78, 59); // Emerald color
    doc.text('NEUROPALM - LAPORAN LOG AUDIT KLASIFIKASI SAWIT', 14, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')} WIB`, 14, 27);
    doc.text(`Total Log Riwayat: ${filteredLogs.length} data`, 14, 33);
    doc.text(`Rata-rata Akurasi Klasifikasi: ${averageAccuracy}%`, 14, 39);

    doc.setDrawColor(6, 78, 59);
    doc.setLineWidth(0.5);
    doc.line(14, 43, 196, 43);

    // Table headers & data mapping
    const headers = [['No', 'Tanggal / Waktu', 'Lokasi / Blok', 'Hasil Klasifikasi', 'Skor Kepercayaan', 'Operator']];
    const data = filteredLogs.map((log, index) => {
      const dt = formatDate(log.created_at);
      return [
        index + 1,
        `${dt.date} - ${dt.time}`,
        log.warna_dominan?.includes('Blok') ? log.warna_dominan : `Blok ${log.sawit_id || 'Alpha'}`,
        log.tingkat_kematangan.toUpperCase(),
        log.persentase,
        log.username || 'Operator'
      ];
    });

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 48,
      theme: 'striped',
      headStyles: { fillColor: [6, 78, 59] },
      styles: { fontSize: 8.5, font: 'helvetica' },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 35 },
        3: { cellWidth: 40 },
        4: { cellWidth: 35 },
        5: { cellWidth: 30 }
      }
    });

    doc.save(`Laporan_Audit_Klasifikasi_Sawit_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'matang') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    } else if (s === 'mentah') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    } else {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex font-sans">
      <Sidebar activePage="riwayat" />

      <div className="flex-1 flex flex-col justify-start items-start overflow-x-hidden">
        {/* Top Navbar */}
        <div className="self-stretch pl-16 pr-4 py-5 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm md:px-8">
          <div className="flex justify-start items-center gap-3 min-w-0">
            <div className="w-2.5 h-6 bg-emerald-800 rounded-full shrink-0" />
            <h1 className="text-black text-sm sm:text-base md:text-xl font-bold font-['Inter'] leading-7 truncate">Riwayat Klasifikasi Sawit</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={exportToPDF}
              className="px-2.5 py-2 sm:px-4 sm:py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Ekspor PDF</span>
            </button>
            <button 
              onClick={fetchLogs}
              className="px-2.5 py-2 sm:px-4 sm:py-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs sm:text-sm font-semibold hover:bg-emerald-100 flex items-center gap-1.5 sm:gap-2 transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
              </svg>
              <span className="hidden sm:inline">Segarkan</span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8">
          
          {/* Header Summary Section */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-black text-xl sm:text-2xl font-black font-['Inter']"><span className='text-black'>Log Audit Klasifikasi</span></h2>
              <p className="text-black text-xs sm:text-sm mt-1">Daftar historis hasil deteksi tingkat kematangan buah kelapa sawit oleh AI.</p>
            </div>

            {/* Metrics Widget */}
            <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3 sm:gap-4 shrink-0 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex justify-center items-center text-emerald-800 shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="block text-neutral-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">AKURASI RERATA</span>
                <span className="text-slate-900 text-lg sm:text-xl font-black font-['Inter']">{averageAccuracy}%</span>
              </div>
            </div>
          </div>

          {/* Filter Controls Row */}
          <div className="w-full p-4 sm:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Search filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-700 text-xs font-bold uppercase tracking-wider">Cari Operator</label>
              <input
                type="text"
                placeholder="Cari username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition"
              />
            </div>

            {/* Block Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-700 text-xs font-bold uppercase tracking-wider">Blok Lokasi</label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition"
              >
                <option value="Semua">Semua Blok</option>
                <option value="Alpha">Blok Alpha</option>
                <option value="Beta">Blok Beta</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-700 text-xs font-bold uppercase tracking-wider">Hasil Klasifikasi</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white transition"
              >
                <option value="Semua">Semua Hasil</option>
                <option value="Matang">Matang</option>
                <option value="Mentah">Mentah</option>
                <option value="Lewat Matang">Lewat Matang</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSelectedBlock('Semua');
                setSelectedStatus('Semua');
                setSearchQuery('');
              }}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-neutral-700 font-bold rounded-xl text-sm transition text-center cursor-pointer"
            >
              Reset Filter
            </button>
          </div>

          {/* Table logs */}
          <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            {loading && (
              <div className="w-full p-12 text-center flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-emerald-800 border-t-transparent rounded-full animate-spin" />
                  <span className="text-neutral-500 text-sm font-medium">Sedang memuat data log audit...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="w-full p-8 text-center text-rose-800 bg-rose-50 border-b border-rose-100">
                <p className="font-semibold mb-2">{error}</p>
                <button onClick={fetchLogs} className="px-4 py-2 bg-rose-800 text-white rounded-xl text-xs font-bold hover:bg-rose-900 transition">
                  Coba Lagi
                </button>
              </div>
            )}

            {!loading && !error && filteredLogs.length === 0 && (
              <div className="w-full p-12 text-center text-neutral-500 flex flex-col justify-center items-center gap-4">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm font-medium">Tidak ada data log yang cocok dengan filter Anda.</span>
              </div>
            )}

            {!loading && !error && filteredLogs.length > 0 && (
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-neutral-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Gambar</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Tanggal / Waktu</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Lokasi / Blok</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Hasil Klasifikasi</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Skor Kepercayaan</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4">Operator</th>
                      <th className="px-3 py-3 sm:px-6 sm:py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-900">
                    {filteredLogs.map((log) => {
                      const dt = formatDate(log.created_at);
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-3 py-3 sm:px-6 sm:py-4 shrink-0">
                            <div className="w-14 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/50 flex justify-center items-center">
                              {log.gambar_sawit ? (
                                <img
                                  src={
                                    log.gambar_sawit.startsWith('http')
                                      ? log.gambar_sawit
                                      : `${BASE_URL}/${log.gambar_sawit}`
                                  }
                                  alt="Sawit"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className="block font-bold text-xs sm:text-sm">{dt.date}</span>
                            <span className="text-[10px] sm:text-xs text-neutral-500">{dt.time}</span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-xs sm:text-sm">
                            {log.warna_dominan?.includes('Blok') ? log.warna_dominan : `Blok ${log.sawit_id || 'Alpha'}`}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-black border rounded-full uppercase tracking-wider ${getStatusBadgeClass(log.tingkat_kematangan)}`}>
                              {log.tingkat_kematangan}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-12 sm:w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden xs:block">
                                <div
                                  className="h-full bg-emerald-700"
                                  style={{ width: log.persentase || '0%' }}
                                />
                              </div>
                              <span className="font-bold text-[11px] sm:text-xs">{log.persentase}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 font-mono text-[10px] sm:text-xs text-neutral-600">
                            {log.username || 'Operator'}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 text-center">
                            <button
                              onClick={() => handleDelete(log.id)}
                              className="p-1.5 hover:bg-rose-50 text-rose-700 rounded-lg transition"
                              title="Hapus Log"
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}