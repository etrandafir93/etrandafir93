#!/bin/bash
# Install Git hooks from .githooks directory

HOOKS_DIR=".githooks"
GIT_HOOKS_DIR=".git/hooks"

echo "Installing Git hooks..."

if [ ! -d "$GIT_HOOKS_DIR" ]; then
    echo "Error: .git/hooks directory not found. Are you in a Git repository?"
    exit 1
fi

# Install pre-commit hook
if [ -f "$HOOKS_DIR/pre-commit" ]; then
    cp "$HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-commit"
    chmod +x "$GIT_HOOKS_DIR/pre-commit"
    echo "✓ Installed pre-commit hook"
else
    echo "✗ pre-commit hook not found in $HOOKS_DIR"
    exit 1
fi

echo ""
echo "✓ Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will now automatically prompt you to review"
echo "blog articles with Claude before committing changes."
