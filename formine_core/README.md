```shell
conda deactivate

# Sanal ortamı oluştur
python3 -m venv .env

# Environment aktive et
.\.env\Scripts\activate

#📦 Bağımlılıklar yüklenir
pip install --upgrade pip
pip install -r requirements.txt

# Geliştirici modunda Çalıştır
uvicorn api.main:app --reload

# Veya sadece çalıştır
python .\run.py 

# Paketle
pyinstaller .\formine_core.spec
```

Paketleme yaptıktan sonra, "formine_core -> dist -> formine" klasörünün içindekileri, "formine -> resources" dizininin içine kopyala.

API Kullanımı:
http://localhost:8000/docs