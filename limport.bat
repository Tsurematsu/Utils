@echo off
setlocal

:: Ruta de la carpeta localScripts (ajusta esta ruta según tu estructura)
set "LOCAL_SCRIPTS_DIR=C:\Users\danie\Documents\localUtils\Utils"

:: Verifica si se proporcionó el nombre del script o la palabra clave "list"
if "%~1"=="" (
    echo Error: Debes proporcionar el nombre del script a importar o usar 'list' para ver los scripts disponibles.
    echo Uso: %~nx0 nombre_del_script [ruta_relativa_opcional]
    exit /b 1
)

:: Comprobar si el argumento es "list"
if "%~1"=="list" (
    echo Listando scripts disponibles en %LOCAL_SCRIPTS_DIR%:
    dir /b "%LOCAL_SCRIPTS_DIR%"
    exit /b 0
)

:: Nombre del script a importar
set "SCRIPT_NAME=%~1"

:: Ruta de la carpeta del script a importar
set "SOURCE_SCRIPT_DIR=%LOCAL_SCRIPTS_DIR%\%SCRIPT_NAME%"

:: Verifica si la carpeta del script existe
if not exist "%SOURCE_SCRIPT_DIR%" (
    echo Error: No se encontró el script "%SCRIPT_NAME%" en %LOCAL_SCRIPTS_DIR%.
    exit /b 1
)

:: Verifica si se proporcionó una ruta relativa adicional
if not "%~2"=="" (
    :: Convertir la ruta relativa a absoluta con base en el directorio actual
    for %%I in ("%~2") do set "DEST_DIR=%%~fI"
    echo Usando ruta de destino personalizada: %DEST_DIR%
) else (
    :: Usar carpeta utils como destino predeterminado
    set "DEST_DIR=%cd%"
)

:: Crear la carpeta utils dentro del destino si no existe
set "FINAL_DEST_DIR=%DEST_DIR%\utils"
if not exist "%FINAL_DEST_DIR%" (
    mkdir "%FINAL_DEST_DIR%"
    echo Carpeta 'utils' creada en %FINAL_DEST_DIR%.
)

:: Copia la carpeta del script a la carpeta 'utils' dentro del destino
xcopy /E /I "%SOURCE_SCRIPT_DIR%" "%FINAL_DEST_DIR%\%SCRIPT_NAME%"

if %ERRORLEVEL% equ 0 (
    echo El script "%SCRIPT_NAME%" ha sido copiado exitosamente a la carpeta '%FINAL_DEST_DIR%\%SCRIPT_NAME%'.
) else (
    echo Error al copiar el script.
)

endlocal
