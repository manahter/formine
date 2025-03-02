import { exec, spawn } from 'child_process'
import { app } from 'electron'
import path from 'path'
import net from 'net';

export function getCorePath() {
  if (app.isPackaged) {
    // Production modunda app.asar.unpacked içindeki exe'yi kullan
    return path.join(process.resourcesPath, 'app.asar.unpacked', 'resources', 'formine_core.exe')
  }

  // Development modunda
  return path.join(__dirname, '../../resources/formine_core.exe')
}


export function waitForCoreToStart() {
  return new Promise((resolve, reject) => {
    // Örnek olarak, formine_core.exe'nin 8000 portunu dinlemeye başlamasını bekleyelim
    const port = 8000;
    const checkConnection = () => {
      const client = net.connect({ port }, () => {
        client.end();
        resolve(); // Port açıldı, core hazır
      });

      client.on('error', () => {
        // Port henüz açılmadı, tekrar dene
        setTimeout(checkConnection, 500); // 500ms'de bir kontrol et
      });
    };

    checkConnection();
  });
}

export const core = getCorePath()

export let coreProcess;

const args = [] // Eğer argümanlarınız varsa buraya ekleyin, örn: ['arg1', 'arg2']

coreProcess = spawn(core, args, { shell: true })

coreProcess.stdout.on('data', (data) => {
  console.log(`Çıktı: ${data}`)
})

coreProcess.stderr.on('data', (data) => {
  console.error(`Hata: ${data}`)
})

coreProcess.on('close', (code) => {
  console.log(`İşlem ${code} koduyla kapandı.`)
})

coreProcess.on('error', (error) => {
  console.error(`Başlatılamadı: ${error.message}`)
})


// Uygulama kapanırken backend kapansın
app.on('before-quit', async () => {
  try {
    console.log("Kapatıyoruz...")
    if (coreProcess) {
      console.log('Arka plan işlemi sonlandırılıyor...')
      coreProcess.kill('SIGINT') // Güvenli bir şekilde kapatır
    }
    
    // Backend'e kapanma isteği gönder
    const response = await fetch('http://localhost:8000/exit', {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error('Kapanma isteği başarısız oldu')
    }

    console.log('Backend başarıyla kapatıldı.')
  } catch (error) {
    console.error('Backend kapanırken bir hata oluştu:', error)
  }
})