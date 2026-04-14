import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Menangani __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mengambil argumen nama task dari terminal
const taskName = process.argv.slice(2).join('_');

if (!taskName) {
  console.error("Gunakan format: npm run create_task [nama task]");
  process.exit(1);
}

// Format Tanggal
const now = new Date();
const date = String(now.getDate()).padStart(2, '0');
const monthNames = ["januari", "februari", "maret", "april", "mei", "juni", 
                    "juli", "agustus", "september", "oktober", "november", "desember"];
const monthName = monthNames[now.getMonth()];
const monthNum = String(now.getMonth() + 1).padStart(2, '0');
const year = now.getFullYear();

// Konfigurasi Path dan Nama File
const folderName = `${date} ${monthName} ${year}`;
const fileName = `task_${date}_${monthNum}_${taskName.toLowerCase().replace(/\s+/g, '_')}.md`;
const dirPath = path.join(__dirname, 'documentation', 'task', folderName);
const filePath = path.join(dirPath, fileName);

// 1. Buat folder secara rekursif
try {
  fs.mkdirSync(dirPath, { recursive: true });

  // 2. Isi konten default file
  const content = `# task: ${taskName.replace(/_/g, ' ')}\nTanggal: ${date} ${monthName} ${year}\n\n---`;

  // 3. Tulis file
  fs.writeFileSync(filePath, content);
  
  console.log(`\n✅ Berhasil dibuat!`);
  console.log(`Path: documentation/task/${folderName}/${fileName}\n`);
} catch (err) {
  console.error("Gagal membuat file:", err);
}