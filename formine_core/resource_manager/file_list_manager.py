import os
import sys
import time
import uuid
import subprocess
from pathlib import Path
from typing import Union

from .auto_save_json import AutoSaveJSON
from .config import PROJECT_NAME


APP_FOLDER = Path.home() / f".{PROJECT_NAME}"
APP_FOLDER.mkdir(parents=True, exist_ok=True)


class FileListManager():
    """
    Root
    --| Projects
       --| kdhıhr313r2r24trf.xlsx 
       --| 4t35y46une56yhtnt.xlsx 
       --| kdhıhr313r2r24trf.xlsx 
       --| 4t35y46une56yhtnt.xlsx 
       --| info.json
    Bir projede aynı türden dosyaları tutan bir menejerdir.
    """
    def __init__(self, dir_name="Projects", info_file="info.json", load_assets=[], load_presets=None):
        self.load(dir_name=dir_name, info_file=info_file, load_assets=load_assets, load_presets=load_presets)
    
    def load(self, dir_name="Projects", info_file="info.json", load_assets=[], load_presets=None):
        self.info_filename = info_file
        self.dir = APP_FOLDER / dir_name
        
            
        self.dir.mkdir(parents=True, exist_ok=True)
        self.active = None
        
        self.info_path = self.dir / info_file
        
        is_load_assets = False
        if not os.path.exists(self.info_path):
            is_load_assets = True
            
        self.info = AutoSaveJSON(file_path=self.info_path)
        self.info.last_open = time.time()
        
        
        if "files" not in self.info:
            self.info.files = {}
        
        self.check_files()
        
        
        
        if is_load_assets:
            for filename in load_assets:
                with open(f"{sys._MEIPASS}/assets/{filename}", "rb") as f:
                    _file = self.new(filename, file_content=f.read())
                    if load_presets:
                        _file.presets = load_presets
        
        
    def check_files(self):
        """Eğer listede ismi olan bir dosya yoksa, listeden de kaldır"""
        files = []
        for file_uuid in os.listdir(self.dir):
            file_path = self.dir / file_uuid
            if os.path.isfile(file_path) and self.info_filename != file_uuid:
                files.append(file_uuid)

        will_remove = []
        for file_uuid in self.info.files:
            if file_uuid not in files:
                will_remove.append(file_uuid)
        
        for file_uuid in will_remove:
            self.info.files.pop(file_uuid)
    
    def new(self, name, file_content=None, file_writer=None):
        """Proje dizininde dosya oluşturulur ve bilgileri kayıtlara eklenir."""
        file_uuid = str(uuid.uuid4()) + Path(name).suffix
        file_path = self.dir / file_uuid
        
        # İçerik yazılmayacaksa, sadece yeni dosya yolunu dönelim
        if file_content:
            with open(file_path, "wb") as f:
                f.write(file_content)
                
        if file_writer:
            file_writer(file_path)
                        
        self.info.files[file_uuid] = {
            "uuid": file_uuid,
            "name": name,
            "lastModified": time.time(),
            "size": os.path.getsize(file_path),
            "description": "",
            "extension": Path(name).suffix,
            "created_at": time.time(),
        }
        # self.info.files[file_uuid].settings = {}
        # self.info.files[file_uuid].settings.themeMode = "dark"
        
        return self.info.files[file_uuid]
    
    def remove_file(self, file_uuids: Union[str, list]):
        if isinstance(file_uuids, str):
            if file_uuids in os.listdir(self.dir):
                os.remove(self.dir / file_uuids)
        
            self.info.files.pop(file_uuids, None)
            
        elif isinstance(file_uuids, list):
            for files_uuid in file_uuids:
                self.remove_file(files_uuid)
        
        self.check_files()

    def get_filepath(self, file_uuid=""):
        file_uuid = (file_uuid or self.active)
        if not file_uuid: return False
        
        file_path = self.dir / file_uuid
        if not os.path.exists(file_path): return False
        
        return file_path
    
    def get_info(self, file_uuid=""):
        file_uuid = (file_uuid or self.active)
        if not file_uuid: return False
        
        return self.info.files.get(file_uuid, None)
    
    def open_file(self, file_uuid=""):
        """Dosya default uygulama ile çalıştırılır"""
        file_uuid = (file_uuid or self.active)
        if not file_uuid: return False
        
        file_path = self.dir / file_uuid
        if not os.path.exists(file_path): return False
        
        self.info.files[file_uuid]["lastModified"] = time.time()
        
        subprocess.run(['start', file_path], shell=True)
        
        # Dosyanın açıldığını kontrol et
        for _ in range(10):  # Maksimum 10 saniye bekler
            if self._is_file_open(file_path):
                print(f"{file_path} başarıyla açıldı.")
                return True
            time.sleep(1)
        
        print(f"{file_path} açılamadı.")
        return False
        
    def _is_file_open(self, file_path):
        """Dosyanın açık olup olmadığını kontrol eder (sadece Windows)"""
        try:
            os.rename(file_path, file_path)  # Dosya kilitliyse yeniden adlandırılamaz
            return False
        except OSError:
            return True
# project_manager = FileListManager("Forms")
# project_manager.remove_file("214406a5-8c9e-49f7-9f0a-09fa84991145.xlsx")

# print(project_manager.info)
# project_manager.new("Form.xlsx", b"Ooo iyiyiz")

# # project_manager.remove_file("49853998-c66b-48cc-94fc-22e0f9271966")

# project_manager.open_file("8625ebb8-e706-493f-aad2-f7b9402312ba.xlsx")