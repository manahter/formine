from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel

from .main import formfiles_manager

router = APIRouter(
    prefix="/formfiles",
    tags=["Form Files"],
    responses={404: {"description": "Not Found"}},
)

@router.get("/")
def liste():
    return list(formfiles_manager.info.files.values())


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    # Dosya adının uzantısını kontrol et
    if not file.filename.endswith(".xls") and not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Sadece .xls | .xlsx dosyalar kabul edilmektedir.")

    # Dosya içeriğini okuma
    content = await file.read()

    try:
        formfiles_manager.new(name=file.filename, file_content=content)
        return {"success": True}
    except:
        return {"errors": ["Yüklenemedi"]}
    

@router.get("/remove/{uuid}")
async def remove(uuid: str):
    formfiles_manager.remove_file(file_uuids=uuid)
    return list(formfiles_manager.info.files.values())
   
  
@router.get("/open/{uuid}")
async def open(uuid: str):
    return formfiles_manager.open_file(file_uuid=uuid)


@router.get("/loadPresets/{uuid}")
async def loadPresets(uuid: str):
    return formfiles_manager.info.files[uuid].get("presets", [])

class ItemPresets(BaseModel):
    uuid: str
    presets: list
    
@router.post("/savePresets")
async def savePresets(data: ItemPresets):
    file = formfiles_manager.info.files[data.uuid]
    
    if "presets" not in file:
        file.presets = []
    
    file.presets = [*file.presets, *data.presets]

    return {"success": True}


