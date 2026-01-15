/**
 * Project: KNOUX Player X™
 * File: installer.nsh
 * Author: knoux
 * Purpose: Common NSIS definitions and macros used across installer scripts
 * Layer: Desktop -> Installer -> Configuration
 */

!ifndef KNOUX_INSTALLER_COMMON_INCLUDED
!define KNOUX_INSTALLER_COMMON_INCLUDED

; Product information
!define PRODUCT_NAME "KNOUX Player X"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SADEK ELGAZAR (KNOUX)"
!define PRODUCT_WEB_SITE "https://github.com/knuux7-ctrl/KNOX-Player-X-"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\KNOUXPlayerX.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; Installation directories
!define INSTALL_DIR_DEFAULT "$PROGRAMFILES\KNOUX\Player X"
!define APPDATA_DIR "$APPDATA\KNOUX\Player X"

; Installation features
!define FEATURE_DESKTOP_SHORTCUT 1
!define FEATURE_STARTMENU_SHORTCUT 1
!define FEATURE_ASSOCIATE_FILES 1

; Registry keys for file associations
!define REGISTRY_KEY_APPPATHS "SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\KNOUXPlayerX.exe"
!define REGISTRY_KEY_CLASSES "SOFTWARE\Classes"
!define REGISTRY_KEY_CAPABILITIES "SOFTWARE\KNOUX\Player X\Capabilities"

; File extensions to associate
!define ASSOCIATED_EXTENSIONS ".mp4 .avi .mkv .mov .wmv .flv .webm .mp3 .wav .aac .flac .m4a .wma"

; Custom page IDs
!define PAGE_WELCOME 1
!define PAGE_LICENSE 2
!define PAGE_DIRECTORY 3
!define PAGE_INSTFILES 4
!define PAGE_FINISH 5

; Uninstaller executable name
!define UNINSTALLER_NAME "unins000.exe"

; Macros for standard sections
!macro SECTION_START_APP_FILES
Section "Application Files" SecAppFiles
  SectionIn RO
  SetOutPath "$INSTDIR"
  
  ; Main application executable
  File "${PROJECT_DIR}\dist\win-unpacked\KNOUXPlayerX.exe"
  
  ; Application dependencies
  File /r "${PROJECT_DIR}\dist\win-unpacked\*.dll"
  File /r "${PROJECT_DIR}\dist\win-unpacked\resources\*.*"
  
  ; Write installation path to registry
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\KNOUXPlayerX.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "Path" "$INSTDIR"
SectionEnd
!macroend

!macro SECTION_CREATE_SHORTCUTS
Section "Desktop Shortcut" SecDesktopShortcut
  CreateShortCut "$DESKTOP\KNOUX Player X.lnk" "$INSTDIR\KNOUXPlayerX.exe"
SectionEnd

Section "Start Menu Shortcut" SecStartMenuShortcut
  CreateDirectory "$SMPROGRAMS\KNOUX Player X"
  CreateShortCut "$SMPROGRAMS\KNOUX Player X\KNOUX Player X.lnk" "$INSTDIR\KNOUXPlayerX.exe"
  CreateShortCut "$SMPROGRAMS\KNOUX Player X\Uninstall.lnk" "$INSTDIR\${UNINSTALLER_NAME}"
SectionEnd
!macroend

!macro SECTION_FILE_ASSOCIATIONS
Section "File Associations" SecFileAssoc
  ; Register file extensions
  ${RegisterExtension} "$INSTDIR\KNOUXPlayerX.exe" ".mp4" "KNOUX Media File"
  ${RegisterExtension} "$INSTDIR\KNOUXPlayerX.exe" ".avi" "KNOUX Media File"
  ${RegisterExtension} "$INSTDIR\KNOUXPlayerX.exe" ".mkv" "KNOUX Media File"
  ; Additional extensions...
SectionEnd
!macroend

!macro SECTION_UNINSTALLER
Section "Uninstall"
  ; Remove registry keys
  DeleteRegKey HKLM "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  ; Remove file associations
  ${UnregisterExtension} ".mp4" "KNOUX Media File"
  ${UnregisterExtension} ".avi" "KNOUX Media File"
  ${UnregisterExtension} ".mkv" "KNOUX Media File"
  ; Additional extensions...
  
  ; Remove shortcuts
  Delete "$DESKTOP\KNOUX Player X.lnk"
  Delete "$SMPROGRAMS\KNOUX Player X\*.*"
  RMDir "$SMPROGRAMS\KNOUX Player X"
  
  ; Remove application files
  RMDir /r "$INSTDIR"
SectionEnd
!macroend

!endif ; KNOUX_INSTALLER_COMMON_INCLUDED
