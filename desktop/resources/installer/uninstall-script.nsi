;Uninstall Script for KNOUX Player X
;Author: knoux
;Project: KNOUX Player X™

!include "installer.nsh"

Section "Uninstall"
  ; Stop any running instances
  nsProcess::_IsFirstRun 1
  Pop $R0
  StrCmp $R0 "1" stop_process  process_not_running
stop_process:
  nsProcess::_KillProcesses
  Sleep 1000
  
process_not_running:
  ; Remove registry entries
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  ; Unregister all file associations
  ${UnregisterExtension} ".mp4" "KNOUX Media File"
  ${UnregisterExtension} ".avi" "KNOUX Media File"
  ${UnregisterExtension} ".mkv" "KNOUX Media File"
  ${UnregisterExtension} ".mov" "KNOUX Media File"
  ${UnregisterExtension} ".wmv" "KNOUX Media File"
  ${UnregisterExtension} ".flv" "KNOUX Media File"
  ${UnregisterExtension} ".webm" "KNOUX Media File"
  ${UnregisterExtension} ".mp3" "KNOUX Media File"
  ${UnregisterExtension} ".wav" "KNOUX Media File"
  ${UnregisterExtension} ".aac" "KNOUX Media File"
  ${UnregisterExtension} ".flac" "KNOUX Media File"
  ${UnregisterExtension} ".m4a" "KNOUX Media File"
  ${UnregisterExtension} ".wma" "KNOUX Media File"
  
  ; Remove start menu shortcuts
  Delete "$SMPROGRAMS\KNOUX Player X\*.*"
  RMDir "$SMPROGRAMS\KNOUX Player X"
  
  ; Remove desktop shortcut
  Delete "$DESKTOP\KNOUX Player X.lnk"
  
  ; Remove application data
  RMDir /r "$APPDATA_DIR"
  
  ; Remove application files
  Delete "$INSTDIR\KNOUXPlayerX.exe"
  Delete "$INSTDIR\*.*"
  RMDir "$INSTDIR"
  
  ; Display completion message
  MessageBox MB_OK "KNOUX Player X has been successfully uninstalled."
SectionEnd
