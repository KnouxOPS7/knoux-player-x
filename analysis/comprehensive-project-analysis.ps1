<#
================================================================================
KNOUX PLAYER X™ - COMPREHENSIVE PROJECT ANALYSIS
================================================================================
Author: knoux (SADEK ELGAZAR)
Project: KNOUX Player X™
Purpose: Complete project structure analysis with completion percentages
Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
================================================================================
#>

function Get-ProjectAnalysis {
    param(
        [string]$ProjectPath = "C:\Users\Aisha\Downloads\knox-player-x™"
    )
    
    # Define project structure mapping
    $projectStructure = @{
        "desktop/preload" = @{
            Name = "Preload Module"
            Files = @("preload.ts")
            Weight = 3
        }
        "desktop/main/native/dsp" = @{
            Name = "Audio DSP Engine"
            Files = @("audio_dsp.h", "audio_dsp.cpp", "dsp_bridge.ts")
            Weight = 5
        }
        "desktop/resources/icons" = @{
            Name = "Application Icons"
            Files = @("app-icon.svg", "tray-icon.svg", "installer-banner.svg", "app-icon.ico", "app-icon.icns")
            Weight = 4
        }
        "desktop/resources/installer" = @{
            Name = "Installer Scripts"
            Files = @("installer.nsh", "install-script.nsi", "uninstall-script.nsi", "post-install.ps1")
            Weight = 5
        }
        "plugins/plugin-sdk" = @{
            Name = "Plugin SDK"
            Files = @("types.ts", "api.ts", "registry.ts", "utils.ts", "README.md", "example-plugin.ts")
            Weight = 6
        }
        "plugins/sdk" = @{
            Name = "Developer SDK"
            Files = @("package.json", "README.md", "tsconfig.json", "webpack.config.js", "docs", "tools", "templates")
            Weight = 7
        }
        "public/assets" = @{
            Name = "Public Assets"
            Files = @("fonts", "icons", "splash", "animations")
            Weight = 4
        }
        "src/constants" = @{
            Name = "Application Constants"
            Files = @("index.ts")
            Weight = 2
        }
        "src/types" = @{
            Name = "Global Types"
            Files = @("index.ts")
            Weight = 3
        }
        "src/utils" = @{
            Name = "Utility Functions"
            Files = @("index.ts")
            Weight = 3
        }
        "src/state/middleware" = @{
            Name = "Redux Middleware"
            Files = @("index.ts")
            Weight = 4
        }
        "src/state/store" = @{
            Name = "Redux Store"
            Files = @("index.ts")
            Weight = 4
        }
        "src/ui/animations" = @{
            Name = "UI Animations"
            Files = @("index.ts")
            Weight = 3
        }
        "src/ui/components/neon" = @{
            Name = "Neon Glass Components"
            Files = @("index.ts")
            Weight = 5
        }
        "tests/unit" = @{
            Name = "Unit Tests"
            Files = @("*")
            Weight = 6
        }
    }
    
    # Track overall statistics
    $totalWeight = 0
    $completedWeight = 0
    $sectionResults = @()
    
    Write-Host "================================================================================" -ForegroundColor Cyan
    Write-Host "                    KNOUX PLAYER X™ PROJECT ANALYSIS REPORT                     " -ForegroundColor Cyan
    Write-Host "================================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Analysis Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Yellow
    Write-Host "Project Path: $ProjectPath" -ForegroundColor Yellow
    Write-Host ""
    
    # Analyze each section
    foreach ($section in $projectStructure.GetEnumerator()) {
        $relativePath = $section.Key
        $fullPath = Join-Path $ProjectPath $relativePath
        $sectionInfo = $section.Value
        
        $totalWeight += $sectionInfo.Weight
        
        # Check if folder exists
        if (Test-Path $fullPath) {
            $existingFiles = Get-ChildItem -Path $fullPath -File -Recurse | Select-Object -ExpandProperty Name
            $requiredFiles = $sectionInfo.Files
            
            # Calculate completion percentage
            if ($requiredFiles[0] -eq "*") {
                # Special case for unit tests - check if folder has files
                $completionPercent = if ($existingFiles.Count -gt 0) { 100 } else { 0 }
            } else {
                $foundFiles = ($requiredFiles | Where-Object { $existingFiles -contains $_ }).Count
                $completionPercent = [Math]::Round(($foundFiles / $requiredFiles.Count) * 100, 1)
            }
            
            # Determine status
            $status = if ($completionPercent -eq 100) { 
                "COMPLETE" 
                $completedWeight += $sectionInfo.Weight
            } elseif ($completionPercent -gt 0) { 
                "PARTIAL" 
                $completedWeight += ($sectionInfo.Weight * ($completionPercent / 100))
            } else { 
                "EMPTY" 
            }
            
            # Create result object
            $result = [PSCustomObject]@{
                Section = $sectionInfo.Name
                Path = $relativePath
                Completion = $completionPercent
                Status = $status
                FilesFound = if ($requiredFiles[0] -eq "*") { "N/A" } else { "$foundFiles/$($requiredFiles.Count)" }
                Weight = $sectionInfo.Weight
            }
            
            $sectionResults += $result
            
            # Display section result
            $statusColor = switch ($status) {
                "COMPLETE" { "Green" }
                "PARTIAL" { "Yellow" }
                "EMPTY" { "Red" }
            }
            
            Write-Host ("{0,-30} | {1,6}% | {2,-10} | {3,-12} | W:{4}" -f 
                $sectionInfo.Name, 
                $completionPercent, 
                $status, 
                $result.FilesFound,
                $sectionInfo.Weight) -ForegroundColor $statusColor
        } else {
            # Folder doesn't exist
            $result = [PSCustomObject]@{
                Section = $sectionInfo.Name
                Path = $relativePath
                Completion = 0
                Status = "MISSING"
                FilesFound = "0/0"
                Weight = $sectionInfo.Weight
            }
            
            $sectionResults += $result
            
            Write-Host ("{0,-30} | {1,6}% | {2,-10} | {3,-12} | W:{4}" -f 
                $sectionInfo.Name, 
                0, 
                "MISSING", 
                "0/0",
                $sectionInfo.Weight) -ForegroundColor Red
        }
    }
    
    # Calculate overall completion
    $overallCompletion = [Math]::Round(($completedWeight / $totalWeight) * 100, 1)
    
    Write-Host ""
    Write-Host "================================================================================" -ForegroundColor Cyan
    Write-Host "                           OVERALL PROJECT STATUS                           " -ForegroundColor Cyan
    Write-Host "================================================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Overall statistics
    $completedSections = ($sectionResults | Where-Object { $_.Status -eq "COMPLETE" }).Count
    $partialSections = ($sectionResults | Where-Object { $_.Status -eq "PARTIAL" }).Count
    $emptySections = ($sectionResults | Where-Object { $_.Status -eq "EMPTY" -or $_.Status -eq "MISSING" }).Count
    
    Write-Host "Total Sections: $($sectionResults.Count)" -ForegroundColor White
    Write-Host "Completed Sections: $completedSections" -ForegroundColor Green
    Write-Host "Partial Sections: $partialSections" -ForegroundColor Yellow
    Write-Host "Empty/Missing Sections: $emptySections" -ForegroundColor Red
    Write-Host ""
    
    # Overall completion with color coding
    $overallColor = if ($overallCompletion -ge 90) { "Green" }
                   elseif ($overallCompletion -ge 70) { "Yellow" }
                   elseif ($overallCompletion -ge 50) { "DarkYellow" }
                   else { "Red" }
    
    Write-Host "OVERALL PROJECT COMPLETION: $overallCompletion%" -ForegroundColor $overallColor
    Write-Host ""
    
    # Detailed breakdown by status
    Write-Host "COMPLETION BREAKDOWN:" -ForegroundColor Cyan
    Write-Host "=====================" -ForegroundColor Cyan
    
    $completeWeight = ($sectionResults | Where-Object { $_.Status -eq "COMPLETE" } | Measure-Object -Property Weight -Sum).Sum
    $partialWeight = ($sectionResults | Where-Object { $_.Status -eq "PARTIAL" } | Measure-Object -Property Weight -Sum).Sum
    $incompleteWeight = ($sectionResults | Where-Object { $_.Status -eq "EMPTY" -or $_.Status -eq "MISSING" } | Measure-Object -Property Weight -Sum).Sum
    
    Write-Host "Complete Sections: $([Math]::Round(($completeWeight/$totalWeight)*100, 1))%" -ForegroundColor Green
    Write-Host "Partial Sections: $([Math]::Round(($partialWeight/$totalWeight)*100, 1))%" -ForegroundColor Yellow
    Write-Host "Incomplete Sections: $([Math]::Round(($incompleteWeight/$totalWeight)*100, 1))%" -ForegroundColor Red
    Write-Host ""
    
    # Priority recommendations
    Write-Host "PRIORITY RECOMMENDATIONS:" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    
    $incompleteSections = $sectionResults | Where-Object { $_.Status -ne "COMPLETE" } | Sort-Object Completion
    
    if ($incompleteSections.Count -gt 0) {
        Write-Host "Top priority incomplete sections:" -ForegroundColor Yellow
        $incompleteSections | Select-Object -First 5 | ForEach-Object {
            Write-Host "  ▶ $($_.Section) ($($_.Completion)%" -NoNewline
            Write-Host ")" -ForegroundColor $(if ($_.Completion -gt 50) { "Yellow" } else { "Red" })
        }
    } else {
        Write-Host "✓ All sections are complete!" -ForegroundColor Green
    }
    
    Write-Host ""
    
    # Risk assessment
    Write-Host "RISK ASSESSMENT:" -ForegroundColor Cyan
    Write-Host "===============" -ForegroundColor Cyan
    
    if ($overallCompletion -lt 50) {
        Write-Host "HIGH RISK: Project completion below 50%" -ForegroundColor Red
        Write-Host "Recommendation: Focus on core functionality first" -ForegroundColor Yellow
    } elseif ($overallCompletion -lt 70) {
        Write-Host "MODERATE RISK: Project completion between 50-70%" -ForegroundColor DarkYellow
        Write-Host "Recommendation: Address partial implementations" -ForegroundColor Yellow
    } elseif ($overallCompletion -lt 90) {
        Write-Host "LOW RISK: Project completion between 70-90%" -ForegroundColor Green
        Write-Host "Recommendation: Polish remaining sections" -ForegroundColor Yellow
    } else {
        Write-Host "MINIMAL RISK: Project completion above 90%" -ForegroundColor Green
        Write-Host "Recommendation: Final testing and optimization" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Analysis completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
    
    # Return results object for further processing
    return [PSCustomObject]@{
        OverallCompletion = $overallCompletion
        TotalSections = $sectionResults.Count
        CompletedSections = $completedSections
        PartialSections = $partialSections
        EmptySections = $emptySections
        SectionDetails = $sectionResults
        AnalysisDate = Get-Date
    }
}

# Execute analysis
$result = Get-ProjectAnalysis

# Export to JSON for reporting
$reportPath = Join-Path (Resolve-Path "C:\Users\Aisha\Downloads\knox-player-x™") "analysis\project-analysis-report.json"
$result | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host ""
Write-Host "Detailed report exported to: $reportPath" -ForegroundColor White
