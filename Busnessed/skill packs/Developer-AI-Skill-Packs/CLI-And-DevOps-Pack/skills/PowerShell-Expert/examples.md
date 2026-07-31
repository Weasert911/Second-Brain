# PowerShell-Expert: Examples

## Beginner: Get System Information
```powershell
# Get OS information
Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, BuildNumber, OSArchitecture

# Get processor details
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, MaxClockSpeed

# Get memory information
Get-CimInstance Win32_ComputerSystem | Select-Object TotalPhysicalMemory

# Get disk information
Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" |
  Select-Object DeviceID, @{N='SizeGB';E={[math]::Round($_.Size/1GB,2)}},
    @{N='FreeGB';E={[math]::Round($_.FreeSpace/1GB,2)}}
```
**Explanation**: Uses CIM/WMI to gather system information. Calculated properties convert bytes to GB. Shows OS, CPU, RAM, and disk info.

## Intermediate: Advanced Function with Validation
```powershell
function Get-LargeFileReport {
    [CmdletBinding(SupportsShouldProcess=$true)]
    [OutputType([PSCustomObject])]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [ValidateScript({Test-Path $_ -PathType Container})]
        [string]$Path,

        [Parameter()]
        [ValidateRange(1MB, 10TB)]
        [int64]$MinimumSize = 100MB,

        [Parameter()]
        [ValidateSet("Name", "Size", "LastWriteTime")]
        [string]$SortBy = "Size"
    )

    begin {
        Write-Verbose "Scanning for files larger than $($MinimumSize / 1MB) MB"
        $results = [System.Collections.ArrayList]::new()
    }

    process {
        if ($PSCmdlet.ShouldProcess($Path, "Scan for large files")) {
            $files = Get-ChildItem -Path $Path -File -Recurse -ErrorAction SilentlyContinue |
                Where-Object { $_.Length -ge $MinimumSize }

            foreach ($file in $files) {
                [void]$results.Add([PSCustomObject]@{
                    Path = $file.FullName
                    SizeMB = [math]::Round($file.Length / 1MB, 2)
                    LastWriteTime = $file.LastWriteTime
                    Extension = $file.Extension
                })
            }
        }
    }

    end {
        $results | Sort-Object -Property $SortBy -Descending |
            Select-Object -First 100
    }
}

Get-LargeFileReport -Path "C:\Users" -MinimumSize 50MB -Verbose
```
**Explanation**: Advanced function with ShouldProcess (WhatIf support), parameter validation (ValidateScript, ValidateRange, ValidateSet), pipeline input, ArrayList for performance, calculated properties, and Verbose output.

## Advanced: Parallel Processing with Runspaces
```powershell
$servers = @("Server01", "Server02", "Server03")
$scriptBlock = {
    param($computerName)
    try {
        $session = New-PSSession -ComputerName $computerName -ErrorAction Stop
        $result = Invoke-Command -Session $session -ScriptBlock {
            Get-CimInstance Win32_OperatingSystem |
                Select-Object Caption, Version, LastBootUpTime
        }
        Remove-PSSession $session
        return [PSCustomObject]@{
            Computer = $computerName
            Status = "OK"
            Data = $result
        }
    } catch {
        return [PSCustomObject]@{
            Computer = $computerName
            Status = "FAILED"
            Error = $_.Exception.Message
        }
    }
}

$runspacePool = [runspacefactory]::CreateRunspacePool(1, 5)
$runspacePool.Open()
$jobs = @()

foreach ($server in $servers) {
    $powershell = [powershell]::Create().AddScript($scriptBlock).AddArgument($server)
    $powershell.RunspacePool = $runspacePool
    $jobs += @{
        PowerShell = $powershell
        AsyncResult = $powershell.BeginInvoke()
        Computer = $server
    }
}

$results = foreach ($job in $jobs) {
    $job.PowerShell.EndInvoke($job.AsyncResult)
    $job.PowerShell.Dispose()
}
$runspacePool.Dispose()
$results | Format-Table Computer, Status
```
**Explanation**: Uses runspace pool for parallel remote execution with concurrency control. Each server gets a PowerShell instance in the pool. Results are collected after all complete. Error handling per-server prevents one failure from blocking others.

## Production: DSC Configuration for Web Server
```powershell
Configuration WebServerConfig {
    param(
        [Parameter(Mandatory)]
        [string[]]$ComputerName
    )

    Node $ComputerName {
        WindowsFeature IIS {
            Ensure = "Present"
            Name = "Web-Server"
            IncludeAllSubFeature = $true
        }

        File WebContent {
            Ensure = "Present"
            Type = "Directory"
            DestinationPath = "C:\inetpub\wwwroot\myapp"
            DependsOn = "[WindowsFeature]IIS"
        }

        Script DeployApp {
            GetScript = {
                @{ Result = Test-Path "C:\inetpub\wwwroot\myapp\index.html" }
            }
            TestScript = {
                Test-Path "C:\inetpub\wwwroot\myapp\index.html"
            }
            SetScript = {
                $content = "<h1>Deployed by DSC</h1>"
                Set-Content -Path "C:\inetpub\wwwroot\myapp\index.html" -Value $content
            }
            DependsOn = "[File]WebContent"
        }

        WindowsFeature IISManagementConsole {
            Ensure = "Present"
            Name = "Web-Mgmt-Console"
        }
    }
}

WebServerConfig -ComputerName "WebServer01"
Start-DscConfiguration -Path .\WebServerConfig -Wait -Verbose
```
**Explanation**: DSC configuration that installs IIS, creates web directories, deploys content, and adds management tools. Apply with Start-DscConfiguration. The Script resource implements custom idempotent logic.
