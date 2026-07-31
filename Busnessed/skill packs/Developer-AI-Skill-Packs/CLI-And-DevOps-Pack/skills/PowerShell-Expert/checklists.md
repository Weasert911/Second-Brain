# PowerShell-Expert: Checklists

## Pre-Flight Checklist
- [ ] PowerShell version 5.1+ or 7+ verified ($PSVersionTable.PSVersion)
- [ ] Execution policy allows script execution
- [ ] Module dependencies installed (Get-Module -ListAvailable)
- [ ] Verb approved for cmdlet name (Get-Verb)
- [ ] Function follows Verb-Noun naming convention
- [ ] Comment-based help written for all public functions
- [ ] Parameter validation attributes applied
- [ ] ShouldProcess support for destructive operations
- [ ] Output type defined with [OutputType()]
- [ ] Pester test framework available for testing

## Implementation Checklist
- [ ] Advanced function with [CmdletBinding()] attribute
- [ ] Parameters have proper types and validation
- [ ] Pipeline input handled in begin/process/end blocks
- [ ] Error handling with try/catch/finally
- [ ] $ErrorActionPreference set appropriately
- [ ] Write-Error used for non-terminating errors
- [ ] Splatting for commands with 3+ parameters
- [ ] WhatIf support via SupportsShouldProcess
- [ ] Verbose output with Write-Verbose
- [ ] Debug output with Write-Debug
- [ ] No Write-Host for data output (use Write-Output)
- [ ] Module manifest exports only public functions

## Testing Checklist
- [ ] Pester tests cover all public functions
- [ ] Test boundary conditions (empty, null, max values)
- [ ] Pipeline input works correctly
- [ ] WhatIf does not modify system state
- [ ] Error paths produce meaningful error messages
- [ ] Verbose output provides useful debugging info
- [ ] Performance acceptable for expected data sizes
- [ ] No parameter binding errors
- [ ] Test with both -ErrorAction Stop and Continue
- [ ] Remoting functions handle connection failures gracefully

## Release Checklist
- [ ] Module version bumped in manifest
- [ ] CHANGELOG updated with changes
- [ ] All Pester tests pass
- [ ] Module script signed with certificate
- [ ] Help files updated (comment-based or external)
- [ ] Published to PowerShell Gallery if public
- [ ] Release tagged in version control
- [ ] Documentation updated for parameter changes
- [ ] Deprecated functions marked with warning
- [ ] Breaking changes documented

## Maintenance Checklist
- [ ] PowerShell version compatibility verified quarterly
- [ ] Deprecated cmdlets replaced (e.g., Get-WmiObject → Get-CimInstance)
- [ ] Module dependencies updated
- [ ] Pester tests run on CI
- [ ] Code reviewed for security (Invoke-Expression, credential handling)
- [ ] Performance profiled for large data sets
- [ ] Module uninstall/cleanup tested
- [ ] Help accuracy verified against implementation
