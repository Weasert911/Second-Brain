# Examples — Clap-CLI-Expert

## Beginner: Simple CLI with Options and Flags

```rust
use clap::Parser;

#[derive(Parser)]
#[command(name = "greet", version, about = "A friendly greeter")]
struct Cli {
    /// Name of the person to greet
    name: String,

    /// Number of times to greet
    #[arg(short, long, default_value_t = 1)]
    count: u32,

    /// Use a formal greeting
    #[arg(short, long)]
    formal: bool,
}

fn main() {
    let cli = Cli::parse();
    let greeting = if cli.formal { "Good day" } else { "Hi" };
    for _ in 0..cli.count {
        println!("{greeting}, {}!", cli.name);
    }
}
```

**Explanation**: Basic CLI with a positional `name` argument, an optional `--count` option, and a `--formal` flag. The `#[command]` attribute sets metadata. Field doc comments become help text.

## Intermediate: CLI with Subcommands

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "my-tool", version, about = "A multi-purpose CLI")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Build the project
    Build {
        /// Target to build for
        #[arg(short, long, default_value = "debug")]
        target: String,
    },
    /// Run tests
    Test {
        /// Test name filter
        #[arg(short, long)]
        name: Option<String>,
        /// Show verbose output
        #[arg(short, long)]
        verbose: bool,
    },
    /// Initialize a new project
    Init {
        /// Project name
        name: String,
        /// Project template
        #[arg(short, long, default_value = "default")]
        template: String,
    },
}

fn main() {
    let cli = Cli::parse();
    match cli.command {
        Commands::Build { target } => println!("Building for {target}"),
        Commands::Test { name, verbose } => {
            println!("Testing (verbose={verbose}, filter={name:?})");
        }
        Commands::Init { name, template } => {
            println!("Initializing {name} with {template} template");
        }
    }
}
```

**Explanation**: Subcommands provide a multi-command CLI. Each variant of the `Commands` enum represents a different command with its own arguments.

## Advanced: Full-Featured CLI with Validation and Completions

```rust
use clap::{Parser, Subcommand, ValueEnum, Args};
use std::path::PathBuf;

#[derive(Debug, Clone, ValueEnum)]
enum OutputFormat { Json, Yaml, Toml }

#[derive(Debug, Args)]
struct CommonArgs {
    /// Config file path
    #[arg(short, long, env = "MY_TOOL_CONFIG", default_value = "config.toml")]
    config: PathBuf,

    /// Output format
    #[arg(short, long, value_enum, default_value_t = OutputFormat::Json)]
    format: OutputFormat,

    /// Verbose output (-v, -vv, -vvv)
    #[arg(short, long, action = clap::ArgAction::Count)]
    verbose: u8,
}

#[derive(Parser)]
#[command(name = "my-tool", version, about, long_about = "A full-featured CLI tool")]
#[command(arg_required_else_help = true)]
struct Cli {
    #[command(flatten)]
    common: CommonArgs,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Process data from input file
    Process {
        /// Input file path
        input: PathBuf,

        /// Output file path
        #[arg(short, long)]
        output: Option<PathBuf>,

        /// Skip validation
        #[arg(short, long)]
        no_validate: bool,
    },
    /// Validate configuration
    Validate {
        /// Config file to validate
        #[arg(default_value = "config.toml")]
        path: PathBuf,
    },
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();
    println!("Config: {}", cli.common.config.display());
    println!("Verbosity: {}", cli.common.verbose);

    match cli.command {
        Commands::Process { input, output, no_validate } => {
            if !no_validate {
                println!("Validating...");
            }
            println!("Processing {} -> {:?}", input.display(), output);
        }
        Commands::Validate { path } => {
            println!("Validating config at {}", path.display());
        }
    }
    Ok(())
}
```

**Explanation**: Advanced CLI with `ValueEnum` for format selection, `Args` derive for reusable argument groups, `env` attribute for environment variable fallback, `Count` action for verbosity levels, and `arg_required_else_help` for better UX.
