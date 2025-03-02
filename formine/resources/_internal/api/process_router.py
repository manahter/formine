from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from datetime import datetime
from win32com import client
from pypdf import PdfWriter
import pandas as pd
import zipfile
import asyncio
import shutil
import uuid
import os

from .main import formfiles_manager, datafiles_manager, donefiles_manager, process_manager

router = APIRouter(
    prefix="/process",
    tags=["Process"],
    responses={404: {"description": "Not Found"}},
)

exampleData = [
    {"status": "success", "message": "1246456234"},
    {"status": "error", "message": "123252435"},
    {"status": "warning", "message": "4t42234234324"},
]

def msg(message="", progress=0):
    return {
            "message": message,
            "progress": progress
    }
    

{'formfile': '40905b38-cbb3-4550-a9fc-b55b9bc625b8.xlsx', 
 'datafile': 'be7bd72a-dd92-4273-941f-5ed4d897f600.xlsx', 
 'filename': '', 
 'multiPDF': False, 
 'items': [
     {'datacol': 'AD', 'formcell': 'E3'}, 
     {'datacol': 'Yaşı', 'formcell': 'D7'}, 
     {'datacol': 'SOYAD', 'formcell': 'B4'}, 
     {'datacol': 'TAM ADI', 'formcell': 'A2'}, 
     {'datacol': 'TC NO', 'formcell': 'A1'}
     ]
 }


def zipwriter(filepath, pdf_paths):
    with zipfile.ZipFile(filepath, 'w') as zipf:
        for pdf_path in pdf_paths:
            zipf.write(pdf_path, os.path.basename(pdf_path))
            
            
async def isDisconnected(websocket, outputdir, form_workbook=None):
    try:
        await asyncio.wait_for(websocket.receive_json(), timeout=0.05)
    except asyncio.TimeoutError:
        ...
    except WebSocketDisconnect:
        try:
            form_workbook and form_workbook.Close(False)
        except:
            ...
        
        shutil.rmtree(outputdir)
        return True
    
# Uzun işlem fonksiyonu
async def process(excel, websocket: WebSocket):
    data = await websocket.receive_json()
    
    outputdir = process_manager.dir / str(uuid.uuid4())
    os.mkdir(outputdir)
    
    # Form dosyasının açık olma durumuna karşılık, işlem dizinine kopyası oluşturulur
    formfilepath = outputdir / data["formfile"]
    await websocket.send_json(msg("The form file is being read", 2))
    shutil.copy(formfiles_manager.get_filepath(data["formfile"]), formfilepath)
    # Form dosyasını excel ile aç
    form_workbook = excel.Workbooks.Open(formfilepath)
    form_sheet = form_workbook.Sheets(1)
    
    if await isDisconnected(websocket, outputdir, form_workbook): return
        
    # Veri dosyasının açık olma durumuna karşılık, işlem dizinine kopyası oluşturulur
    datafilepath = outputdir / data["datafile"]
    await websocket.send_json(msg("The data file is being read", 5))
    shutil.copy(datafiles_manager.get_filepath(data["datafile"]), datafilepath)
    # Verileri oku
    datas = pd.read_excel(datafilepath)
    datas = datas.fillna("")
    
    presets = []
    pdf_paths = []
    multiPDF = data["multiPDF"]
    filename = data["filename"]
    onlyfilenames = []
    
    total_count = datas.shape[0]
    
    for i, row in datas.iterrows():
        
        if await isDisconnected(websocket, outputdir, form_workbook):
            break
        
        for item in data["items"]:

            col = item["datacol"]
            cell = item["formcell"]
            
            # VERİ dosyasının Satırından bilgiler alınır ve FORM'a işlenir
            try:
                form_sheet.Range(cell).Value = row[col]

            except Exception as e:
                print("Hata")
            
        if not filename:
            partname = "FilledForm"
        elif multiPDF and filename in row:
            partname = row[filename]
        else:
            partname = filename

        count = onlyfilenames.count(partname)
        onlyfilenames.append(partname)
        if count:
            partname = f"{partname}-{count + 1}"
        
        temp_output_path = outputdir / f"{partname}.pdf"    
        # self.log(info="FORM İŞLEME", text=filename)
        form_sheet.ExportAsFixedFormat(0, str(temp_output_path))
        pdf_paths.append(temp_output_path)

        progress = (i / total_count) * 65 + 5
        await websocket.send_json(msg(partname, progress))
        
    form_workbook.Close(False)
    
    await websocket.send_json(msg("Files are being compiled", 70))
    
    # Zip Dosyası Oluşturulur
    if multiPDF:
        filename = f"{filename or datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.zip"
        file_info = donefiles_manager.new(
            name=filename,
            file_writer=lambda file_path: zipwriter(file_path, pdf_paths))
        
    # Tek PDF Dosyası Oluşturulur
    else:
        filename = f"{filename or datetime.now().strftime("%Y-%m-%d_%H-%M-%S")}.pdf"
        
        merger = PdfWriter()
        
        # Pdf'leri sırayla birleştir
        for pdf in pdf_paths:
            if await isDisconnected(websocket, outputdir): return
            
            progress = (i / total_count) * 25 + 70
            await websocket.send_json(msg("PDF's are being compiled", progress))
            merger.append(str(pdf))

        await websocket.send_json(msg("The file is being completed", 95))
        file_info = donefiles_manager.new(
            name=filename, 
            file_writer=lambda file_path: merger.write(file_path))
        merger.close()
    
    shutil.rmtree(outputdir)
    
    await websocket.send_json(msg("The process is complete", 100))
    await websocket.send_json({"fileinfo": file_info})


                
# WebSocket endpoint
@router.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    excel = None
    
    try:
        excel = client.Dispatch("Excel.Application")
    except Exception as e:
        await websocket.send_json({"error": "Excel not found. Please check if Microsoft Excel is installed"})
        await websocket.close()
        return
    
    try:
        await process(excel, websocket)
        
        excel.Quit()
    except WebSocketDisconnect:
        print("WebSocket bağlantısı kesildi.")
    except Exception as e:
        if websocket.application_state.name == "CONNECTED":
            try:
                await websocket.send_json({"error": "Hata çıktı"})
                await websocket.close()
            except:
                ...
        print("Koptu", e)
        
    finally:
        # websocket.application_state.name  # Uygulamanın bağlantısı
        # websocket.client_state.name       # İstemcinin bağlantısı
        try:
            if websocket.application_state.name == "CONNECTED":
                await websocket.close()
        except:
            ...
        try:
            excel.Application.Quit()  # Önce düzgün kapanmayı dene
        except:
            try:
                excel.Quit()  # İlki başarısız olursa bunu dene
            except:
                pass  # Her ikisi de başarısız olursa...
        finally:
            excel = None  # Referansı temizle
