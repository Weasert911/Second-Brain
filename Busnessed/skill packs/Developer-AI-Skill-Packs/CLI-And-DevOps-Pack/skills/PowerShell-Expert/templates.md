# PowerShell-Expert: Templates

## 1. Advanced Function Template
```
Name: advanced-function
Description: PowerShell advanced function with proper cmdlet binding and validation
Template:
function {{Verb}}-{{Noun}} {
    [CmdletBinding(DefaultParameterSetName='{{PARAM_SET}}',
                  SupportsShouldProcess=$true,
                  ConfirmImpact='{{LOW/MEDIUM/HIGH}}')]
    [OutputType([{{OUTPUT_TYPE}}])]
    param(
        [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
        [ValidateNotNullOrEmpty()]
        [string[]]${{Param1}},

        [Parameter(ParameterSetName='{{PARAM_SET}}')]
        [ValidateRange({{MIN}}, {{MAX}})]
        [int]${{Param2}} = {{DEFAULT}},

        [Parameter()]
        [ValidateSet('Option1', 'Option2', 'Option3')]
        [string]$Mode = 'Option1'
    )

    begin {
        Write-Verbose "Starting {{Verb}}-{{Noun}}"
        $items = [System.Collections.ArrayList]::new()
    }

    process {
        if ($PSCmdlet.ShouldProcess(${{Param1}}, "{{ACTION_DESCRIPTION}}")) {
            foreach ($item in ${{Param1}}) {
                {{PROCESSING_LOGIC}}
                [void]$items.Add($result)
            }
        }
    }

    end {
        $items
    }
}
Usage Notes: Replace Verb-Noun with approved verb. Use ShouldProcess for destructive operations. Add comment-based help.
```

## 2. Module Manifest Template
```
Name: module-manifest
Description: PowerShell module manifest (.psd1) template
Template:
@{
    RootModule        = '{{ModuleName}}.psm1'
    ModuleVersion     = '{{VERSION}}'
    Author            = '{{AUTHOR}}'
    CompanyName       = '{{COMPANY}}'
    Copyright         = '(c) {{YEAR}} {{AUTHOR}}'
    Description       = '{{DESCRIPTION}}'

    PowerShellVersion = '5.1'
    CompatiblePSEditions = @('Desktop', 'Core')

    FunctionsToExport = @('{{Function1}}', '{{Function2}}')
    CmdletsToExport   = @()
    VariablesToExport = @()
    AliasesToExport   = @()
    ModuleList        = @()

    PrivateData = @{
        PSData = @{
            Tags       = @('{{TAG1}}', '{{TAG2}}')
            LicenseUri = '{{LICENSE_URL}}'
            ProjectUri = '{{PROJECT_URL}}'
        }
    }
}
Usage Notes: Use New-ModuleManifest for creation. FunctionsToExport should explicitly list public functions. Tags help with Find-Module discovery.
```

## 3. Error Handling Template
```
Name: error-handling
Description: Comprehensive error handling with try/catch/finally
Template:
function Safe-{{Operation}} {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Target
    )

    begin {
        $ErrorActionPreference = 'Stop'
    }

    process {
        try {
            Write-Verbose "Processing: $Target"
            {{OPERATION}}

            if (-not $?) {
                throw "Operation failed silently"
            }
        }
        catch [System.UnauthorizedAccessException] {
            Write-Error "Access denied to $Target. Run as Administrator."
            throw
        }
        catch [System.IO.FileNotFoundException] {
            Write-Warning "File not found: $Target"
        }
        catch {
            Write-Error "Unexpected error: $_"
            if ($PSItem.InvocationInfo) {
                Write-Debug "At line $($PSItem.InvocationInfo.ScriptLineNumber)"
            }
            throw
        }
        finally {
            {{CLEANUP}}
        }
    }
}
Usage Notes: Use specific exception types where possible. Always re-throw exceptions that cannot be handled. Use finally for cleanup.
```

## 4. Pester Test Template
```
Name: pester-test
Description: Pester unit test template for PowerShell functions
Template:
BeforeAll {
    . $PSScriptRoot/../{{Module}}.psm1
    $testData = @(
        @{ Input = {{INPUT1}}; Expected = {{EXPECTED1}} }
        @{ Input = {{INPUT2}}; Expected = {{EXPECTED2}} }
    )
}

Describe "{{Verb}}-{{Noun}}" {
    It "Should return expected output for valid input" {
        $result = {{Verb}}-{{Noun}} -{{Param}} $testData[0].Input
        $result | Should -Be $testData[0].Expected
    }

    It "Should throw for invalid input" {
        { {{Verb}}-{{Noun}} -{{Param}} $null } | Should -Throw
    }

    It "Should support WhatIf" {
        { {{Verb}}-{{Noun}} -{{Param}} "test" -WhatIf } | Should -Not -Throw
    }

    It "Should process pipeline input" {
        $testData.Input | {{Verb}}-{{Noun}} | Should -HaveCount $testData.Count
    }
}
Usage Notes: Use BeforeAll for module import. Test boundary conditions, error cases, and pipeline input. Use Should -Be, -BeOfType, -HaveCount for assertions.
```

## 5. Configuration File Loader
```
Name: config-loader
Description: Load JSON configuration with validation
Template:
function Get-{{App}}Config {
    [CmdletBinding()]
    [OutputType([PSCustomObject])]
    param(
        [Parameter(Mandatory)]
        [ValidateScript({Test-Path $_ -PathType Leaf})]
        [string]$Path
    )

    $config = Get-Content -Path $Path -Raw | ConvertFrom-Json
    $requiredFields = @('{{FIELD1}}', '{{FIELD2}}', '{{FIELD3}}')

    foreach ($field in $requiredFields) {
        if (-not $config.PSObject.Properties.Name -contains $field) {
            throw "Missing required config field: $field"
        }
    }

    return $config
}
Usage Notes: Validate required fields exist. Use PSCustomObject for structured output. Cache config with script scope variable if called frequently.
```

## 6. Remote Command Executor
```
Name: remote-executor
Description: Execute commands on multiple remote computers with error handling
Template:
function Invoke-{{Command}}Remote {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string[]]$ComputerName,

        [Parameter()]
        [pscredential]$Credential,

        [Parameter()]
        [int]$ThrottleLimit = 10
    )

    $sessionParams = @{
        ComputerName  = $ComputerName
        ErrorAction   = 'Stop'
    }
    if ($Credential) { $sessionParams.Credential = $Credential }

    try {
        $sessions = New-PSSession @sessionParams -EnableNetworkAccess
        $results = Invoke-Command -Session $sessions -ScriptBlock {
            {{SCRIPT_BLOCK}}
        } -ErrorAction Continue

        $results | Select-Object PSComputerName, *
    }
    catch {
        Write-Warning "Failed to connect: $_"
    }
    finally {
        $sessions | Remove-PSSession -ErrorAction SilentlyContinue
    }
}
Usage Notes: Use throttling to avoid overwhelming network. Handle connection failures per-computer (not all-or-nothing). Clean up sessions in finally block.
```

## 7. Splatting Template for Complex Calls
```
Name: splatting-pattern
Description: Use splatting for cmdlets with many parameters
Template:
$params = @{
    {{Param1}} = {{Value1}}
    {{Param2}} = {{Value2}}
    {{Param3}} = {{Value3}}
    ErrorAction = 'Stop'
    Verbose     = $true
}

if ($condition) {
    $params['{{OptionalParam}}'] = $true
}

Get-{{Cmdlet}} @params
Usage Notes: Build hashtable of parameters and splat with @. Add optional parameters conditionally. Improves readability over long parameter lines.
```

## 8. Script Module Structure
```
Name: script-module
Description: PowerShell script module (.psm1) with proper exports
Template:
# {{ModuleName}}.psm1
# Private functions (not exported)
function Get-{{PrivateHelper}} {
    {{HELPER_LOGIC}}
}

# Public functions exported via module manifest
function Get-{{PublicFunction1}} {
    [CmdletBinding()]
    param()

    {{FUNCTION_LOGIC}}
}

function Set-{{PublicFunction2}} {
    [CmdletBinding(SupportsShouldProcess)]
    param()

    {{FUNCTION_LOGIC}}
}

# Module initialization
Write-Verbose "{{ModuleName}} loaded version {{VERSION}}"

Export-ModuleMember -Function @(
    'Get-{{PublicFunction1}}'
    'Set-{{PublicFunction2}}'
)
Usage Notes: Only export public functions. Helper functions remain private. Module initialization runs on import. Use Verbose for load diagnostics.
