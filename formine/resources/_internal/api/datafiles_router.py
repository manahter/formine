from fastapi import APIRouter, HTTPException, File, UploadFile
import pandas as pd

from .main import datafiles_manager

router = APIRouter(
    prefix="/datafiles",
    tags=["Data Files"],
    responses={404: {"description": "Not Found"}},
)

@router.get("/")
def liste():
    return list(datafiles_manager.info.files.values())


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    # Dosya adının uzantısını kontrol et
    if not file.filename.endswith(".xls") and not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Sadece .xls | .xlsx dosyalar kabul edilmektedir.")

    # Dosya içeriğini okuma
    content = await file.read()

    try:
        datafiles_manager.new(name=file.filename, file_content=content)
        return {"success": True}
    except:
        return {"errors": ["Yüklenemedi"]}
    

@router.get("/remove/{uuid}")
async def remove(uuid: str):
    datafiles_manager.remove_file(file_uuids=uuid)
    return list(datafiles_manager.info.files.values())
   
   
@router.get("/open/{uuid}")
async def open(uuid: str):
    return datafiles_manager.open_file(file_uuid=uuid)


@router.get("/columns/{uuid}")
async def columns(uuid: str):
    if not uuid or uuid not in datafiles_manager.info.files:
        return
    
    file_path = datafiles_manager.dir / uuid

    # Excel dosyasını bir DataFrame olarak oku
    datafiles_manager.df = df = pd.read_excel(file_path)

    print(df.columns.tolist())
    # Sütun başlıklarını al
    return df.columns.tolist()