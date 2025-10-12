# Install Git hooks from .githooks directory (PowerShell)

$HOOKS_DIR = ".githooks"
$GIT_HOOKS_DIR = ".git/hooks"

Write-Host "Installing Git hooks..." -ForegroundColor Cyan

if (-not (Test-Path $GIT_HOOKS_DIR)) {
    Write-Host "Error: .git/hooks directory not found. Are you in a Git repository?" -ForegroundColor Red
    exit 1
}

# Install pre-commit hook
if (Test-Path "$HOOKS_DIR/pre-commit") {
    Copy-Item "$HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-commit" -Force
    Write-Host "✓ Installed pre-commit hook" -ForegroundColor Green
} else {
    Write-Host "✗ pre-commit hook not found in $HOOKS_DIR" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Git hooks installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "The pre-commit hook will now automatically prompt you to review" -ForegroundColor Yellow
Write-Host "blog articles with Claude before committing changes." -ForegroundColor Yellow
