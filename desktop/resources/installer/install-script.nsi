;NSIS Script for KNOUX Player X
;Author: knoux
;Project: KNOUX Player X™

!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "installer.nsh"

; General settings
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "..\..\dist\KNOUXPlayerX_Setup_${PRODUCT_VERSION}.exe"
InstallDir "${INSTALL_DIR_DEFAULT}"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
RequestExecutionLevel admin

; Interface settings
!define MUI_ABORTWARNING
!define MUI_ICON "..\resources\icons\app-icon.ico"
!define MUI_UNICON "..\resources\icons\app-icon.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "welcome-image.bmp"
!define MUI_HEADERIMAGE_UNBITMAP "welcome-image.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "installer-branding.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "installer-branding.bmp"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\..\LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "Arabic"

Section -Prerequisites
  ; Check if Visual C++ Redistributable is installed
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" "Installed"
  StrCmp $0 "1" vc_installed
  
  MessageBox MB_YESNO "Microsoft Visual C++ 2015-2019 Redistributable is required. Would you like to download and install it now?" IDYES download_vc IDNO skip_vc
  
download_vc:
  DetailPrint "Downloading Visual C++ Redistributable..."
  NSISdl::download "https://aka.ms/vs/16/release/vc_redist.x64.exe" "$TEMP\vc_redist.x64.exe"
  Pop $0
  StrCmp $0 "success" run_vc_download failed_download
  
run_vc_download:
  ExecWait '"$TEMP\vc_redist.x64.exe" /quiet /norestart'
  Delete "$TEMP\vc_redist.x64.exe"
  Goto skip_vc
  
failed_download:
  MessageBox MB_OK "Failed to download Visual C++ Redistributable. Please install it manually."
  
skip_vc:
vc_installed:
SectionEnd

!insertmacro SECTION_START_APP_FILES

!insertmacro SECTION_CREATE_SHORTCUTS

!insertmacro SECTION_FILE_ASSOCIATIONS

; Post-installation actions
Section -Post
  ; Write uninstall information to registry
  WriteUninstaller "$INSTDIR\${UNINSTALLER_NAME}"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\${UNINSTALLER_NAME}"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\KNOUXPlayerX.exe"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  
  ; Register application capabilities for Default Programs
  WriteRegStr HKLM "${REGISTRY_KEY_CAPABILITIES}" "ApplicationName" "${PRODUCT_NAME}"
  WriteRegStr HKLM "${REGISTRY_KEY_CAPABILITIES}" "ApplicationDescription" "Advanced media player with glassmorphism interface"
  WriteRegStr HKLM "${REGISTRY_KEY_CAPABILITIES}\UrlAssociations" "http" "KNOUXPlayerX.URL"
  WriteRegStr HKLM "SOFTWARE\RegisteredApplications" "KNOUX Player X" "${REGISTRY_KEY_CAPABILITIES}"
  
  ; Launch application option
  ${If} $CheckBox_AssocFiles_State == ${BST_CHECKED}
    ExecShell "open" "$INSTDIR\KNOUXPlayerX.exe"
  ${EndIf}
SectionEnd

; Descriptions
LangString DESC_SecAppFiles ${LANG_ENGLISH} "Core application files required to run KNOUX Player X."
LangString DESC_SecDesktopShortcut ${LANG_ENGLISH} "Create a desktop shortcut for easy access."
LangString DESC_SecStartMenuShortcut ${LANG_ENGLISH} "Create a Start Menu shortcut."
LangString DESC_SecFileAssoc ${LANG_ENGLISH} "Associate media files with KNOUX Player X."

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
!insertmacro MUI_DESCRIPTION_TEXT ${SecAppFiles} $(DESC_SecAppFiles)
!insertmacro MUI_DESCRIPTION_TEXT ${SecDesktopShortcut} $(DESC_SecDesktopShortcut)
!insertmacro MUI_DESCRIPTION_TEXT ${SecStartMenuShortcut} $(DESC_SecStartMenuShortcut)
!insertmacro MUI_DESCRIPTION_TEXT ${SecFileAssoc} $(DESC_SecFileAssoc)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Uninstaller
!insertmacro SECTION_UNINSTALLER

; Installation functions
Function .onInit
  ; Check for previous installation
  ReadRegStr $R0 HKLM "${PRODUCT_DIR_REGKEY}" ""
  StrCmp $R0 "" no_previous_install
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
  "KNOUX Player X is already installed. $\n$\nClick `OK` to remove the previous version or `Cancel` to cancel this upgrade." \
  IDOK uninst
  Abort
uninst:
  ClearErrors
  ExecWait '$R0\${UNINSTALLER_NAME} /S _?=$R0'
  IfErrors no_remove_done present_remove_uninstaller_files_done
present_remove_uninstaller_files_done:
no_remove_done:
  Sleep 1000
no_previous_install:
FunctionEnd

; Section selection handlers
Var CheckBox_AssocFiles_State

Function ShowInstFilesPage
  ; Associate files by default on fresh installs
  StrCpy $CheckBox_AssocFiles_State ${BST_CHECKED}
FunctionEnd

Function FinishpageAction
  ; Perform post-install actions
  ExecShell "open" "$SYSDIR\cmd.exe" '/c echo Post-install script would run here'
FunctionEnd
