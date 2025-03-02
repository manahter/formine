from fastapi.responses import FileResponse
from fastapi import APIRouter
import os

from .main import donefiles_manager

router = APIRouter(
    prefix="/donefiles",
    tags=["Done Files"],
    responses={404: {"description": "Not Found"}},
)

@router.get("/")
def liste():
    return list(donefiles_manager.info.files.values())

   
@router.get("/{uuid}")
async def download(uuid: str):
    
    file_path  = donefiles_manager.get_filepath(file_uuid=uuid)
    file_name = donefiles_manager.get_info(uuid).name
    
    if os.path.exists(file_path):
        return FileResponse(
                path=file_path, 
                filename=file_name,
                media_type='application/octet-stream'
            )
    
    return {"error": "Dosya bulunamadı"}
    # return donefiles_manager.open_file(file_uuid=uuid)
