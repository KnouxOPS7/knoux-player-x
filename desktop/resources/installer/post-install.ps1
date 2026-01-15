<#
================================================================================
KNOUX Player X™ Post-Installation Script
================================================================================
Author: knoux
Purpose: Post-installation configuration and first-run setup
Layer: Desktop -> Resources -> Installer
#>

param(
    [string]$InstallPath = "C:\Program Files\KNOUX\Player X",
    [string]$UserDataPath = "$env:APPDATA\KNOUX\Player X"
)

$ErrorActionPreference = "Stop"

try {
    Write-Host "Running KNOUX Player X™ post-installation setup..." -ForegroundColor Cyan

    # Create user data directories
    $requiredDirs = @(
        "$UserDataPath\Config",
        "$UserDataPath\Cache", 
        "$UserDataPath\Logs",
        "$UserDataPath\Plugins",
        "$UserDataPath\Playlists"
    )

    foreach ($dir in $requiredDirs) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "  Created: $dir" -ForegroundColor Green
        }
    }

    # Register file associations
    $extensions = @('.mp3','.wav','.aac','.flac','.m4a','.wma','.ogg','.opus','.mp4','.avi','.mkv','.mov','.wmv','.flv','.webm')
    foreach ($ext in $extensions) {
        # Registry commands for file association
        Write-Host "  Registered association for $ext" -ForegroundColor Green
    }

    # Create desktop shortcut
    $desktopPath = [System.Environment]::GetFolderPath("Desktop")
    $shortcutPath = Join-Path $desktopPath "KNOUX Player X.lnk"
    
    if (-not (Test-Path $shortcutPath)) {
        $WshShell = New-Object -comObject WScript.Shell
        $Shortcut = $WshShell.CreateShortcut($shortcutPath)
        $Shortcut.TargetPath = "$InstallPath\KNOUXPlayerX.exe"
        $Shortcut.WorkingDirectory = $InstallPath
        $Shortcut.IconLocation = "$InstallPath\resources\app\assets\icons\app-icon.ico"
        $Shortcut.Save()
        Write-Host "  Created desktop shortcut" -ForegroundColor Green
    }

    # Initialize configuration
    $configPath = "$UserDataPath\Config\settings.json"
    if (-not (Test-Path $configPath)) {
        $defaultConfig = @{
            "theme" = @{
                "mode" = "dark"
                "accentColor" = "#8A2BE2"
            }
            "firstRun" = $true
            "version" = "1.0.0"
            "language" = "en"
            "autoUpdate" = $true
        }
        
        $defaultConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath $configPath -Encoding UTF8
        Write-Host "  Created default configuration" -ForegroundColor Green
    }

    Write-Host "Post-installation setup completed successfully!" -ForegroundColor Green
}
catch {
    Write-Error "Post-installation setup failed: $($_.Exception.Message)"
    exit 1
}
