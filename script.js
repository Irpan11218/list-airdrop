// Load data saat pertama kali aplikasi dibuka
useEffect(() => {
  const savedProjects = localStorage.getItem('airdropProjects');
  if (savedProjects) {
    setProjects(JSON.parse(savedProjects));
  }
}, []);

// Simpan data setiap kali projects berubah
useEffect(() => {
  localStorage.setItem('airdropProjects', JSON.stringify(projects));
}, [projects]);
