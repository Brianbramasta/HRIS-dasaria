import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Menangani __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mengambil argumen dari terminal
const args = process.argv.slice(2);
const command = args[0];
const documentName = args.slice(1).join('_');

if (!command || !documentName) {
  console.error("Gunakan format:");
  console.error("  npm run create brief [nama brief]");
  console.error("  npm run create task [nama task]");
  console.error("  npm run create both [nama dokumen]");
  process.exit(1);
}

// Format Tanggal dan Waktu
const now = new Date();
const date = String(now.getDate()).padStart(2, '0');
const monthNames = ["januari", "februari", "maret", "april", "mei", "juni", 
                    "juli", "agustus", "september", "oktober", "november", "desember"];
const monthName = monthNames[now.getMonth()];
const monthNum = String(now.getMonth() + 1).padStart(2, '0');
const year = now.getFullYear();
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');

// Fungsi untuk membuat file
function createFile(type, name) {
  const folderName = `${date} ${monthName} ${year}`;
  const fileName = `${type}_${year}${monthNum}${date}_${hours}${minutes}_${name.toLowerCase().replace(/\s+/g, '_')}.md`;
  const dirPath = path.join(__dirname, 'documentation', type, folderName);
  const filePath = path.join(dirPath, fileName);

  try {
    // 1. Buat folder secara rekursif
    fs.mkdirSync(dirPath, { recursive: true });

    // 2. Isi konten default file
    const title = type === 'brief' ? 'Brief' : 'Task';
    const content = `# ${title}: ${name.replace(/_/g, ' ')}\nTanggal: ${date} ${monthName} ${year} ${hours}:${minutes}\n\n---`;

    // 3. Tulis file
    fs.writeFileSync(filePath, content);
    
    console.log(`\n${type === 'brief' ? 'Brief' : 'Task'} berhasil dibuat!`);
    console.log(`Path: documentation/${type}/${folderName}/${fileName}\n`);
    
    return true;
  } catch (err) {
    console.error(`Gagal membuat ${type}:`, err);
    return false;
  }
}

// Eksekusi berdasarkan command
switch (command) {
  case 'brief':
    createFile('brief', documentName);
    break;
  case 'task':
    createFile('task', documentName);
    break;
  case 'both':
    console.log('Membuat Brief dan Task...\n');
    const briefSuccess = createFile('brief', documentName);
    const taskSuccess = createFile('task', documentName);
    
    if (briefSuccess && taskSuccess) {
      console.log('Semua dokumen berhasil dibuat!');
    }
    break;
  default:
    console.error("Command tidak valid. Gunakan 'brief', 'task', atau 'both'");
    process.exit(1);
}
