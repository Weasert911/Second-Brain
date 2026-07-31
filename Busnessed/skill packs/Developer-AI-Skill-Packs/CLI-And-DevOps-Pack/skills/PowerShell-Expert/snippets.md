# PowerShell-Expert: Snippets

## 1. Advanced Function Skeleton
```powershell
function Get-Thing {
    [CmdletBinding(SupportsShouldProcess, ConfirmImpact='Medium')]
    [OutputType([PSCustomObject])]
    param([Parameter(Mandatory, ValueFromPipeline)] [string[]]$InputObject)
    begin { } process { if ($PSCmdlet.ShouldProcess($InputObject)) { } } end { }
}
```
**When to use**: Standard template for creating advanced functions with pipeline support and WhatIf.

## 2. Splatting for Clean Parameters
```powershell
$params = @{ Path = 'C:\log.txt'; ErrorAction = 'Stop'; Verbose = $true }
Get-Content @params
```
**When to use**: Pass multiple parameters to a cmdlet without long lines. Add conditionally with `$params['Key'] = $value`.

## 3. Test Path with Fallback
```powershell
$path = if (Test-Path "$env:PROGRAMFILES\MyApp\config.json") {
    "$env:PROGRAMFILES\MyApp\config.json"
} else { "$PSScriptRoot\config.json" }
```
**When to use**: Check multiple possible file locations with fallback logic.

## 4. Hashtable to Object
```powershell
[PSCustomObject]@{
    Name = 'Server01'
    IP = '192.168.1.10'
    Status = 'Online'
}
```
**When to use**: Create structured output objects from hashtables.

## 5. Remote Command with Error Handling
```powershell
$session = New-PSSession -ComputerName $computer -ErrorAction Stop
try {
    Invoke-Command -Session $session -ScriptBlock { Get-Service }
} finally { Remove-PSSession $session }
```
**When to use**: Execute commands on remote machines with proper session cleanup.

## 6. Pipeline Filtering
```powershell
Get-Process | Where-Object { $_.WorkingSet -gt 100MB } | Sort-Object WorkingSet -Descending
```
**When to use**: Filter and sort objects in the pipeline.

## 7. CSV Import/Export
```powershell
Import-Csv 'input.csv' | Select-Object Name, Email | Export-Csv 'output.csv' -NoTypeInformation
```
**When to use**: Read and write CSV files for data processing.

## 8. Error Handling with Try/Catch
```powershell
try {
    $content = Get-Content -Path 'file.txt' -ErrorAction Stop
} catch [System.IO.FileNotFoundException] {
    Write-Warning "File not found"
} catch { Write-Error "Unexpected: $_" }
```
**When to use**: Handle specific exceptions differently from general errors.

## 9. Invoke Parallel (PS 7+)
```powershell
$results = 1..10 | ForEach-Object -Parallel {
    $_ * 2
} -ThrottleLimit 5
```
**When to use**: Process items in parallel with throttling to limit concurrent operations.

## 10. Comment-Based Help
```powershell
<#
.SYNOPSIS
    Gets system information.
.DESCRIPTION
    Retrieves CPU, memory, and disk info from local or remote computers.
.PARAMETER ComputerName
    Target computer(s) to query.
.EXAMPLE
    Get-SystemInfo -ComputerName Server01
#>
```
**When to use**: Document functions with standard PowerShell help format.

## 11. SecureString Handling
```powershell
$secure = Read-Host "Enter password" -AsSecureString
$plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
```
**When to use**: Handle passwords securely in scripts (avoid plain text).

## 12. Get-CimInstance for System Info
```powershell
Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" |
    Select-Object DeviceID, @{N='FreeGB';E={[math]::Round($_.FreeSpace/1GB,2)}}
```
**When to use**: Query WMI/CIM for system information with calculated properties.

## 13. Dynamic Module Loading
```powershell
if (-not (Get-Module -Name 'ActiveDirectory')) {
    Import-Module -Name 'ActiveDirectory' -ErrorAction Stop
}
```
**When to use**: Ensure required modules are loaded before using their cmdlets.

## 14. Parameter Validation Pattern
```powershell
param(
    [ValidateSet('DEV', 'STG', 'PROD')][string]$Environment,
    [ValidateScript({ Test-Path $_ -PathType Container })][string]$Path,
    [ValidateRange(1, 100)][int]$RetryCount
)
```
**When to use**: Validate parameter values before execution with built-in attributes.

## 15. Configuration with JSON
```powershell
$config = Get-Content 'config.json' | ConvertFrom-Json
$config.ServerName
```
**When to use**: Load configuration from JSON files for script settings.
