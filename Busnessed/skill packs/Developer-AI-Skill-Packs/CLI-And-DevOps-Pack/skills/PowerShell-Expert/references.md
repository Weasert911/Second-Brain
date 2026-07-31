# PowerShell-Expert: References

## Official Documentation Summaries
- **Microsoft PowerShell Docs** – Comprehensive cmdlet and language reference
- **Approved Verbs for PowerShell Commands** – Standard verb list for cmdlet naming
- **PowerShell Module Browser** – Searchable cmdlet documentation
- **About topics (help about_*)** – Conceptual help topics for all major features
- **Pester Testing Framework** – Unit and integration testing for PowerShell

## Glossary (15+ Terms)
- **Cmdlet** – Lightweight PowerShell command (Verb-Noun)
- **Pipeline** – Chain of commands passing objects via `|`
- **Provider** – File system-like access to data stores (registry, cert, env)
- **PSDrive** – Mapped drive to a provider namespace
- **Module** – Package of cmdlets, functions, and resources
- **Manifest (.psd1)** – Module metadata file
- **Script block** – Code block `{ ... }` passed as object or executed
- **Splatting** – Passing parameters as hash table `@params`
- **Remoting** – Executing commands on remote machines via WinRM
- **Session** – Persistent connection to remote system (PSSession)
- **Job** – Background execution unit
- **Runspace** – PowerShell execution context (for advanced parallelism)
- **DSC** – Desired State Configuration for infrastructure as code
- **Execution policy** – Security policy controlling script execution
- **WhatIf** – Preview mode for destructive operations

## Architecture Notes
- PowerShell is built on .NET (Full Framework on Windows, .NET Core on cross-platform)
- Cmdlets output objects, not text (unlike bash)
- Pipeline passes .NET objects between cmdlets
- Modules auto-load in PS 3.0+ when cmdlets are invoked
- Remoting uses WinRM (WS-Management protocol) on Windows, SSH on cross-platform

## Key Commands / APIs
- `Get-Command`/`Get-Help`/`Get-Member` – Discovery and exploration
- `Select-Object`/`Where-Object`/`ForEach-Object` – Pipeline manipulation
- `Get-ChildItem`/`Set-Location`/`New-Item`/`Remove-Item` – Provider navigation
- `Invoke-Command`/`Enter-PSSession`/`New-PSSession` – Remoting
- `Start-Job`/`Receive-Job`/`Get-Job` – Background jobs
- `New-Module`/`Import-Module`/`Export-ModuleMember` – Module management
- `Set-ExecutionPolicy`/`Get-ExecutionPolicy` – Security policy
- `Write-Output`/`Write-Error`/`Write-Warning`/`Write-Verbose` – Output streams

## Conventions
- Cmdlet naming: approved Verb-Noun (Get-Process, Set-Variable)
- Parameters: PascalCase (ComputerName, FilePath)
- Variables: `$camelCase` for script scope, `$PascalCase` for constants
- Modules: `<Name>.psm1` (script), `<Name>.psd1` (manifest)
- Functions: `<Verb>-<Noun>` for advanced functions

## Structure Recommendations
- `MyModule/MyModule.psm1` – Module code
- `MyModule/MyModule.psd1` – Module manifest
- `MyModule/en-US/` – Help files
- `MyModule/Tests/` – Pester tests
- `MyModule/Formats/` – Formatting XML files

## Keyboard Shortcuts
- `Ctrl+C` – Interrupt running command
- `Ctrl+D` – Exit session
- `Ctrl+R` – Search command history
- `Ctrl+Space` – Show parameter/argument completion
- `F7` – Show command history popup
- `Tab` – Auto-complete cmdlets, parameters, paths
- `Ctrl+Arrow` – Navigate by word
- `Home`/`End` – Beginning/end of line
