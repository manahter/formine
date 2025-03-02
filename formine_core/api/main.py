import os
import locale
import darkdetect
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from resource_manager import FileListManager

import psutil

presets = [
    {
        "datacol": "İsim",
        "formcell": "D15"
    },
    {
        "datacol": "1. Onaylayan",
        "formcell": "D31"
    },
    {
        "datacol": "1. Unvan",
        "formcell": "D33"
    },
    {
        "datacol": "2. Onaylayan",
        "formcell": "K31"
    },
    {
        "datacol": "2. Unvan",
        "formcell": "K33"
    },
    {
        "datacol": "Fullname",
        "formcell": "D15"
    },
    {
        "datacol": "1. Approver",
        "formcell": "D31"
    },
    {
        "datacol": "1. Approver's Title",
        "formcell": "D33"
    },
    {
        "datacol": "2. Approver",
        "formcell": "K31"
    },
    {
        "datacol": "2. Approver's Title",
        "formcell": "K33"
    }
]

formfiles_manager = FileListManager(dir_name="FormFiles", load_assets=["Sertifika.xlsx", "Certificate.xlsx"], load_presets=presets)
datafiles_manager = FileListManager(dir_name="DataFiles", load_assets=["DataEn.xlsx", "DataTr.xlsx"])
donefiles_manager = FileListManager(dir_name="DoneFiles")
process_manager = FileListManager(dir_name="Process")

app = FastAPI(
    title="Formine API",
    description="Formine API",
    version="1.0.0",
)

# CORS ayarlarını ekle
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],  # Tüm HTTP metodlarına izin ver
    allow_headers=["*"],  # Tüm headers'lara izin ver
    allow_credentials=True,
)

@app.get("/")
def read_root():
    return {
        "language": locale.getdefaultlocale()[0].split("_")[0],
        "darkMode": darkdetect.isDark()
    }


@app.post("/exit")
def exit_app():
    print("Sunucu kapatılıyor...")
    parent_pid = os.getpid()  # Ana PID'yi al
    parent = psutil.Process(parent_pid)

    # Alt süreçleri bul ve kapat
    for child in parent.children(recursive=True):
        print(f"Alt süreç kapatılıyor: PID {child.pid}")
        child.terminate()

    # Ana süreci kapat
    parent.terminate()
    
    os._exit(0)
    
    return {"message": "Sunucu kapatılıyor..."}


from api import datafiles_router, formfiles_router, process_router, donefiles_router

# Rotaları ekliyoruz
app.include_router(formfiles_router.router)
app.include_router(datafiles_router.router)
app.include_router(donefiles_router.router)
app.include_router(process_router.router)

