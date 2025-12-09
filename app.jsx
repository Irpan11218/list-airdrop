import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    link: '',
    wallet: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    date: '',
    link: '',
    wallet: ''
  });

  useEffect(() => {
    const savedProjects = localStorage.getItem('airdropProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('airdropProjects', JSON.stringify(projects));
  }, [projects]);

  const ensureProtocol = (url) => {
    if (!url) return '';
    const trimmedUrl = url.trim();
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      return `https://${trimmedUrl}`;
    }
    return trimmedUrl;
  };

  const handleAddProject = () => {
    if (!formData.name || !formData.date || !formData.link) {
      alert('Mohon isi semua field!');
      return;
    }

    const newProject = {
      id: Date.now(),
      no: projects.length + 1,
      name: formData.name,
      date: formData.date,
      link: ensureProtocol(formData.link),
      wallet: formData.wallet
    };

    setProjects([...projects, newProject]);
    setFormData({ name: '', date: '', link: '', wallet: '' });
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects
      .filter(project => project.id !== id)
      .map((project, index) => ({ ...project, no: index + 1 }));
    setProjects(updatedProjects);
  };

  const handleResetAll = () => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus SEMUA ${projects.length} project?\n\nTindakan ini tidak dapat dibatalkan!`
    );
    
    if (confirmed) {
      const doubleConfirm = window.confirm(
        'Konfirmasi sekali lagi: Hapus semua data project?'
      );
      
      if (doubleConfirm) {
        setProjects([]);
        setEditingId(null);
        setFormData({ name: '', date: '', link: '', wallet: '' });
        alert('Semua project berhasil dihapus!');
      }
    }
  };

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setEditFormData({
      name: project.name,
      date: project.date,
      link: project.link,
      wallet: project.wallet || ''
    });
  };

  const handleSaveEdit = (id) => {
    const updatedProjects = projects.map(project =>
      project.id === id
        ? { ...project, name: editFormData.name, date: editFormData.date, link: ensureProtocol(editFormData.link), wallet: editFormData.wallet }
        : project
    );
    setProjects(updatedProjects);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({ name: '', date: '', link: '', wallet: '' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Alamat wallet berhasil disalin!');
  };

  return (
    <div className="min-h-screen bg-[#141616] text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#bb00ff]/20 blur-[100px]"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#90B5FF]/20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#3d107a]/20 blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="./assets/airdrop.svg.webp" 
              alt="Airdrop" 
              className="w-20 h-20 animate-float"
            />
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90B5FF] bg-clip-text text-transparent [text-shadow:_0px_0px_30px_rgb(135_70_235_/_0.5)]">
              Airdrop List
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Kelola daftar airdrop cryptocurrency Anda
          </p>
        </div>

        {/* Add New Project Form */}
        <div className="glass-morphism rounded-xl p-6 mb-8 animate-pulse-glow">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#be0eff] to-[#8fb4ff] mb-6 flex items-center gap-2">
            <img src="./assets/add.svg.webp" alt="Add" className="w-6 h-6" />
            Tambah Project Baru
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nama Project</label>
              <input
                type="text"
                placeholder="Contoh: Arbitrum Airdrop"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#343434]/80 backdrop-blur-sm border border-[#4e4e4e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ae75fb]/50 focus:border-transparent transition-all duration-300 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tanggal Project</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#343434]/80 backdrop-blur-sm border border-[#4e4e4e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ae75fb]/50 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Link Project</label>
              <input
                type="text"
                placeholder="example.com atau https://example.com"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full bg-[#343434]/80 backdrop-blur-sm border border-[#4e4e4e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ae75fb]/50 focus:border-transparent transition-all duration-300 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Alamat Wallet</label>
              <input
                type="text"
                placeholder="0x..."
                value={formData.wallet}
                onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                className="w-full bg-[#343434]/80 backdrop-blur-sm border border-[#4e4e4e] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#ae75fb]/50 focus:border-transparent transition-all duration-300 placeholder-gray-500"
              />
            </div>
          </div>
          <button
            onClick={handleAddProject}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#be0eff] to-[#8fb4ff] rounded-lg font-medium hover:shadow-lg hover:shadow-[#ae75fb]/50 transition-all duration-300"
          >
            Tambah Project
          </button>
        </div>

        {/* Projects Table */}
        <div className="glass-morphism rounded-xl overflow-hidden animate-pulse-glow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#be0eff]/20 to-[#8fb4ff]/20 border-b border-[#4e4e4e]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#be0eff] to-[#8fb4ff]">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#be0eff] to-[#8fb4ff]">
                    Nama Project
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#be0eff] to-[#8fb4ff]">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#be0eff] to-[#8fb4ff]">
                    Link
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#be0eff] to-[#8fb4ff]">
                    Alamat Wallet
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#be0eff] to-[#8fb4ff]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4e4e4e]">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-[#ae75fb]/50 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <h3 className="text-xl font-semibold mb-2 text-gray-300">Belum ada project</h3>
                        <p className="text-gray-400">Tambahkan project airdrop pertama Anda!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr 
                      key={project.id} 
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      {editingId === project.id ? (
                        <>
                          <td className="px-6 py-4 font-medium text-[#90B5FF]">
                            {project.no}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                              className="w-full bg-[#343434]/80 border border-[#4e4e4e] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ae75fb]/50"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={editFormData.date}
                              onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                              className="w-full bg-[#343434]/80 border border-[#4e4e4e] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ae75fb]/50"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editFormData.link}
                              onChange={(e) => setEditFormData({ ...editFormData, link: e.target.value })}
                              className="w-full bg-[#343434]/80 border border-[#4e4e4e] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ae75fb]/50"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editFormData.wallet}
                              onChange={(e) => setEditFormData({ ...editFormData, wallet: e.target.value })}
                              placeholder="0x..."
                              className="w-full bg-[#343434]/80 border border-[#4e4e4e] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ae75fb]/50"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleSaveEdit(project.id)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-300 text-sm"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-all duration-300 text-sm"
                              >
                                Batal
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 font-medium text-[#90B5FF]">
                            {project.no}
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {project.name}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {new Date(project.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <a
                              href={ensureProtocol(project.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#ae75fb] hover:text-[#90B5FF] hover:underline transition-colors duration-200 flex items-center gap-1 w-fit"
                            >
                              Kunjungi
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            {project.wallet ? (
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-[#343434]/60 px-3 py-1 rounded border border-[#4e4e4e] text-gray-300 font-mono">
                                  {project.wallet.slice(0, 6)}...{project.wallet.slice(-4)}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(project.wallet)}
                                  className="p-1.5 hover:bg-[#343434] rounded transition-colors duration-200"
                                  title="Copy to clipboard"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-[#ae75fb]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(project)}
                                className="px-4 py-2 bg-[#343434] hover:bg-[#444444] border border-[#4e4e4e] rounded-lg transition-all duration-300 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="px-4 py-2 bg-red-600/80 hover:bg-red-700 rounded-lg transition-all duration-300 text-sm"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        {projects.length > 0 && (
          <div className="mt-6 glass-morphism rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Total Project:</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#be0eff] to-[#8fb4ff]">
                    {projects.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleResetAll}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-600/50 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Reset Semua
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);
