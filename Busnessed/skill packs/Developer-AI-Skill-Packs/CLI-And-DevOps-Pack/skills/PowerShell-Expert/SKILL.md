---
name: PowerShell-Expert
version: 1.0.0
domain: Windows Automation
activation_description: Activate when writing PowerShell scripts or managing Windows systems
purpose: Master PowerShell for Windows automation, configuration management, and system administration
---

# PowerShell-Expert

## Capabilities
- Design cmdlets following Verb-Noun naming conventions
- Build efficient pipeline processing chains
- Manipulate objects with Select-Object, Where-Object, ForEach-Object
- Create and manage PowerShell modules and manifests
- Sign scripts for security compliance
- Implement error handling with try/catch/finally and -ErrorAction
- Execute remote commands with Enter-PSSession and Invoke-Command
- Manage background jobs and runspaces for parallel execution
- Implement Desired State Configuration (DSC) for infrastructure
- Navigate filesystem and registry with PSProviders
- Format output with Format-Table, Format-List, and custom views
- Create advanced functions with parameter validation and splatting

## Limitations
- Cannot run on non-Windows without PowerShell Core (cross-platform edition)
- Cannot execute cmdlets without appropriate execution policy
- Cannot call all .NET APIs without understanding assembly loading
- Cannot handle SSH remoting without PowerShell 6+ or OpenSSH
- Cannot bypass user account control (UAC) for privileged operations
- Cannot import modules with unresolved dependencies without manual resolution

## Required Tools
- PowerShell 5.1+ (Windows) or PowerShell 7+ (cross-platform)
- Visual Studio Code with PowerShell extension
- .NET Framework/.NET Core SDK (for module development)
- Execution policy configured appropriately

## Execution Workflow

1. Define script/function purpose and output requirements
2. Choose appropriate cmdlet naming (Verb-Noun)
3. Set up parameters with validation attributes
4. Use pipeline input handling (ValueFromPipeline, Process block)
5. Implement business logic with PowerShell operators and .NET calls
6. Handle errors with try/catch/finally and -ErrorAction preferences
7. Test with ShouldProcess (WhatIf support) for destructive operations
8. Format output for readability (Format-Table, Format-List, custom PS1XML)
9. Package as module with manifest (.psd1) if reusable
10. Sign script with Authenticode certificate if required
11. Document with comment-based help
12. Test with Pester framework for unit/integration tests

## Decision Tree

```
What kind of PowerShell code?
├── One-off script → .ps1 file with parameters
├── Reusable function → .psm1 module with manifest
├── Configuration → DSC configuration (.ps1)
└── GUI tool → WinForms or WPF with PowerShell

Need to process data?
├── Pipeline object → Filter with Where-Object, transform with Select-Object
├── Collection → ForEach-Object, ForEach method, or foreach statement
└── CSV/JSON → Import-Csv, ConvertFrom-Json, Import-Clixml

How to handle errors?
├── Terminating → try/catch/finally
├── Non-terminating → -ErrorAction Stop or $ErrorActionPreference
└── Check conditions → if/else before dangerous operations

Remote execution?
├── One-off command → Invoke-Command -ScriptBlock
├── Interactive session → Enter-PSSession
├── Many computers → Invoke-Command -ComputerName with -ThrottleLimit
└── Background → Start-Job, Register-ScheduledJob

Need performance?
├── Small data → Normal pipeline
├── Large data → Stream processing, avoid collecting in memory
└── Parallel → ForEach-Object -Parallel (PS 7+) or Runspaces
```

## Review Checklist
- [ ] Verb-Noun naming convention followed
- [ ] Parameters have validation attributes ([ValidateSet], [ValidateRange], [ValidatePattern])
- [ ] Pipeline input handled in appropriate block (begin/process/end)
- [ ] WhatIf support implemented for destructive operations
- [ ] Error handling covers terminating and non-terminating errors
- [ ] Comment-based help included with .SYNOPSIS, .PARAMETER, .EXAMPLE
- [ ] Output type defined with [OutputType()] attribute
- [ ] Module manifest (.psd1) includes version, author, description
- [ ] Script signed with valid certificate
- [ ] Execution policy documented for deployment
- [ ] Pester tests cover critical functions
- [ ] No plain-text passwords (use SecureString or credential objects)
- [ ] Format file (.ps1xml) used for custom object display
- [ ] Splatting used for cmdlets with many parameters

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Script cannot run | Execution policy restricted | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Module not found | PSModulePath not updated | Import module with full path or update $env:PSModulePath |
| Access denied | Insufficient permissions | Run as Administrator; check ACL on resources |
| Pipeline too slow | Collecting objects in memory | Use streaming, avoid @() and += on collections |
| RSAT/remoting fails | WinRM not configured | `Enable-PSRemoting -Force`; check firewall |
| .NET assembly conflict | Version mismatch | Use `Add-Type -Path` with specific assembly version |
| Cmdlet not recognized | Module not imported | `Get-Module -ListAvailable` to find and Import-Module |
| Encoding issues | File encoding not specified | Use `-Encoding UTF8` for all file operations |

## Best Practices
- Follow verb naming from the approved verb list
- Use singular nouns for cmdlet names
- Support -WhatIf and -Confirm for all destructive operations
- Write PowerShell objects to pipeline, not formatted strings
- Use `$using:` scope in remote script blocks
- Prefer `$null -eq $var` over `$var -eq $null` (left-associative comparison)
- Use splatting (`@params`) for readability with complex cmdlet calls
- Use `try/finally` without catch for resource cleanup only
- Name parameters consistently with common parameters
- Use Write-Progress for long-running operations
- Test policy edge cases with Pester's -Skip parameter
- Use approved verbs: Get, Set, New, Remove, Invoke, Add, Update, Export, Import

## Anti-Patterns
- Using Write-Host for data output (use Write-Output or pipeline)
- Modifying collection while iterating with ForEach-Object
- Using `Select-Object -ExpandProperty` instead of `ForEach-Object MemberAccess`
- Adding to arrays with `+=` in loops (creates new array each time)
- Catching all exceptions without re-throwing or logging
- Hard-coding computer names or credentials in scripts
- Using positional parameters instead of named parameters
- Ignoring -ErrorAction and letting errors propagate silently
- Using `Invoke-Expression` on user input (security risk)
- Mixing PowerShell and cmd.exe syntax in the same script

## References
See references.md, examples.md, templates.md, checklists.md, snippets.md for companion resources.
