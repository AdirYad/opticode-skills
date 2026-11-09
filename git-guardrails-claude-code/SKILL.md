---
name: git-guardrails-claude-code
description: Set up Claude Code permission rules that block dangerous git commands (push, reset --hard, clean, branch -D, checkout ., restore .) before they run, on Windows, Mac and Linux, in Bash and PowerShell. Use when the user wants to prevent destructive git operations, add git safety rules, or block git push or reset in Claude Code.
---

# Git Guardrails

Adds `deny` rules to Claude Code's settings so it cannot run destructive git commands, even in a
permissive mode. These are built-in permission rules: no hook script, no `jq`, nothing to install,
and they work the same on every operating system.

## What gets blocked

| Command | Why |
|---|---|
| `git push` (every form, including `--force`) | Publishes work the user has not reviewed |
| `git reset --hard` | Throws away uncommitted work |
| `git clean -f`, `git clean -fd`, `git clean -fdx` | Deletes untracked files for good |
| `git branch -D` | Deletes a branch even if it is not merged |
| `git checkout .`, `git checkout -- .`, `git restore .` | Discards every local change |
| `git rebase` | Rewrites history |

When Claude tries one of these, Claude Code refuses before it runs and tells Claude it is not allowed.
The user can still run them in their own terminal.

## Steps

### 1. Ask the scope

Ask: install for **this project only** (`.claude/settings.json` in the project) or for **every
project on this computer** (`~/.claude/settings.json`)? Default to every project.

### 2. Read the settings file

Read the chosen file if it exists. Keep everything already in it. If it does not exist, start
from `{}`.

### 3. Merge these rules into `permissions.deny`

Add each rule only if it is not already in the list. Never remove or change existing rules,
and never move anything from `deny` to `allow`.

```json
{
  "permissions": {
    "deny": [
      "Bash(git push)",
      "Bash(git push *)",
      "Bash(git reset --hard*)",
      "Bash(git clean -f*)",
      "Bash(git clean -d*)",
      "Bash(git branch -D *)",
      "Bash(git checkout .)",
      "Bash(git checkout -- .)",
      "Bash(git restore .)",
      "Bash(git rebase *)",
      "PowerShell(git push)",
      "PowerShell(git push *)",
      "PowerShell(git reset --hard*)",
      "PowerShell(git clean -f*)",
      "PowerShell(git clean -d*)",
      "PowerShell(git branch -D *)",
      "PowerShell(git checkout .)",
      "PowerShell(git checkout -- .)",
      "PowerShell(git restore .)",
      "PowerShell(git rebase *)"
    ]
  }
}
```

Write the file back as valid JSON and show the user the lines that were added.

### 4. Check it works

Ask Claude Code to run `git push --dry-run` in a git repository. It must be refused before it
runs. If it is not refused, the user is probably running an old version of Claude Code: tell them
to update (`claude update`) and try again.

### 5. Tell the user

- The rules take effect in new sessions. Restarting Claude Code is the safe way.
- To allow one command again, remove its line from `permissions.deny`.
- This is a safety net, not a guarantee: a command written in an unusual way, or run through a
  script, can still get past a prefix rule. Keep backups and commit often.
