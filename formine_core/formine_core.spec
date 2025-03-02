# -*- mode: python ; coding: utf-8 -*-
a = Analysis(
    ['run.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('api', 'api'), 
        ('assets', 'assets'),
        ('resource_manager', 'resource_manager')
    ],
    hiddenimports=[
        'fastapi',
        'fastapi.middleware',
        'fastapi.middleware.cors',
        'python-multipart',
        'uvicorn',
        'pypdf',
        'pandas',
        'openpyxl',
        'pywin32',
        'win32com',
        'darkdetect',
        'psutil'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='formine_core',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='icn.ico'
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='formine_core',
)
