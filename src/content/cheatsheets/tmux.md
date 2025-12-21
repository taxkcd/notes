---
title: Tmux Cheatsheet
date: 2025-11-14
---


**Default prefix:** `Ctrl+b` (shown as `^b` below)

## 1. Sessions

### Session Management
* `tmux` - Start new session
* `tmux new -s name` - Start new named session
* `tmux ls` - List all sessions
* `tmux a` or `tmux attach` - Attach to last session
* `tmux a -t name` - Attach to named session
* `tmux kill-session -t name` - Kill named session

### Inside tmux
* `^b d` - Detach from session
* `^b $` - Rename session
* `^b s` - List sessions (interactive)
* `^b (` - Move to previous session
* `^b )` - Move to next session

## 2. Windows (tabs)

### Window Operations
* `^b c` - Create new window
* `^b ,` - Rename current window
* `^b &` - Kill current window
* `^b w` - List windows (interactive)
* `^b f` - Find window by name

### Window Navigation
* `^b 0-9` - Switch to window by number
* `^b n` - Next window
* `^b p` - Previous window
* `^b l` - Last active window

## 3. Panes (splits)

### Creating Panes
* `^b %` - Split vertically (left|right)
* `^b "` - Split horizontally (top/bottom)
* `^b !` - Convert pane to window

### Pane Navigation
* `^b arrow` - Move to pane in arrow direction
* `^b o` - Cycle through panes
* `^b ;` - Toggle between last two panes
* `^b q` - Show pane numbers (type number to jump)

### Pane Resizing
* `^b ^arrow` - Resize pane in arrow direction (1 cell)
* `^b M-arrow` - Resize pane in arrow direction (5 cells)
* `^b z` - Toggle pane zoom (fullscreen)

### Pane Management
* `^b x` - Kill current pane
* `^b {` - Move pane left
* `^b }` - Move pane right
* `^b space` - Toggle between layouts
* `^b ^o` - Rotate panes

## 4. Copy Mode (vi-mode)

### Entering Copy Mode
* `^b [` - Enter copy mode
* `^b PgUp` - Enter copy mode and scroll up

### Navigation in Copy Mode
* `h,j,k,l` - Move cursor (vim style)
* `w` - Next word
* `b` - Previous word
* `^f` - Scroll down one page
* `^b` - Scroll up one page
* `g` - Go to top
* `G` - Go to bottom
* `/` - Search forward
* `?` - Search backward
* `n` - Next search match
* `N` - Previous search match

### Copying
* `space` - Start selection
* `v` - Toggle rectangle selection
* `y` or `Enter` - Copy selection and exit
* `q` or `Esc` - Exit copy mode

### Pasting
* `^b ]` - Paste buffer

## 5. My Essential Combos

### Quick Split Workflows
* `^b %` → `^b arrow` - Split vertical, jump to new pane
* `^b "` → `^b arrow` - Split horizontal, jump to new pane
* `^b z` - Zoom pane (focus mode), toggle again to unzoom

### Session Workflows
* `tmux new -s dev` - Start dev session
* `^b d` → `tmux a -t dev` - Detach and reattach
* `tmux ls` → `tmux kill-session -t old` - Clean up old sessions

### Multi-Pane Layouts
* `^b %` → `^b %` → `^b space` - Create 3 panes, cycle layouts
* `^b :` → `setw synchronize-panes on` - Type in all panes at once
* `^b :` → `setw synchronize-panes off` - Disable sync

### Window Organization
* `^b c` → `^b ,` → name - Create and rename window
* `^b 1` → `^b 2` → `^b 3` - Quick window switching
* `^b w` - Visual window selector (like buffer list)

## 6. Advanced Commands

### Command Mode
* `^b :` - Enter command mode

### Useful Commands (in command mode)
* `swap-window -s 2 -t 1` - Swap window 2 with window 1
* `swap-pane -D` - Swap with next pane
* `swap-pane -U` - Swap with previous pane
* `resize-pane -D 10` - Resize down 10 lines
* `resize-pane -U 10` - Resize up 10 lines
* `resize-pane -L 10` - Resize left 10 columns
* `resize-pane -R 10` - Resize right 10 columns

### Buffer Management
* `^b =` - List all paste buffers
* `^b -` - Delete most recent buffer
* `show-buffer` - Display buffer contents
* `list-buffers` - List all buffers

## 7. Configuration Tips

Add to `~/.tmux.conf`:

```bash
# Use vi mode
setw -g mode-keys vi

# Better prefix (optional)
# unbind C-b
# set -g prefix C-a

# Mouse support
set -g mouse on

# Start windows at 1 (not 0)
set -g base-index 1
setw -g pane-base-index 1

# Reload config
bind r source-file ~/.tmux.conf \; display "Reloaded!"

# Better split commands
bind | split-window -h
bind - split-window -v

# Vim-like pane switching
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
```

## 8. Quick Reference Patterns

### Development Setup
```bash
# Terminal 1: Editor
tmux new -s dev
^b %         # Split for terminal
^b "         # Split for tests

# Result: Editor | Terminal
#                | Tests
```

### Monitoring Setup
```bash
tmux new -s monitor
^b c         # Window 1: logs
^b c         # Window 2: htop
^b c         # Window 3: network
^b 1         # Quick switch between them
```

### Copy-Paste Workflow
```bash
^b [         # Enter copy mode
/pattern     # Search for text
n n n        # Jump through matches
v            # Start visual selection
y            # Yank
^b ]         # Paste in another pane
```