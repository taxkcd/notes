---
title: Vim2 Cheatsheet
date: 2025-11-14
---

---
## Core Features

### 1. Fuzzy Finding (FZF) - The Heart of the Workflow

| Key | Action | Description |
|-----|--------|-------------|
| `<Space>f` | `:Files` | Find files in current directory |
| `<Space>F` | `:GFiles` | Find Git-tracked files |
| `<Space>b` | `:Buffers` | Switch between open buffers |
| `<Space>s` | `:Rg` | Search content with ripgrep |
| `<Space>S` | `:RG` | Advanced ripgrep with preview |
| `<Space>:` | `:History:` | Command history |
| `<Space>?` | `:History/` | Search history |

**Workflow Example:**
```
1. <Space>f     → Type filename → Enter
2. Edit file
3. <Space>s     → Search for function → Enter
4. <Space>b     → Switch to previous buffer
```

### 2. Compilation & Running Code

| Key | Action | Description |
|-----|--------|-------------|
| `<Space>r` | Run file | Execute current file (language-aware) |
| `<Space>m` | `:make` | Compile project |
| `<Space>M` | `:make!` | Compile without jumping to errors |
| `<Space>co` | `:copen` | Open quickfix list |
| `<Space>cn` | `:cnext` | Next error |
| `<Space>cp` | `:cprevious` | Previous error |

**Supported Languages:**
- **Python**: `<Space>r` runs with python3
- **C**: Compiles with gcc and runs
- **C++**: Compiles with g++ and runs
- **Rust**: Runs `cargo run`
- **JavaScript**: Runs with node
- **Shell**: Runs with bash

### 3. Git Integration (Fugitive)

| Key | Action | Description |
|-----|--------|-------------|
| `<Space>gs` | `:Git` | Git status |
| `<Space>gd` | `:Gdiff` | Git diff |
| `<Space>gl` | `:Git log` | Git log |
| `<Space>gp` | `:Git push` | Git push |
| `<Space>gP` | `:Git pull` | Git pull |
| `<Space>gc` | `:Commits` | Browse commits with FZF |
| `<Space>gb` | `:BCommits` | Browse buffer commits |

**Git Workflow:**
```
1. Make changes
2. <Space>gs     → View status
3. Stage files with - in status window
4. cc            → Commit
5. <Space>gp     → Push
```

### 4. Code Navigation (LSP via CoC)

| Key | Action | Description |
|-----|--------|-------------|
| `gd` | Go to definition | Jump to where symbol is defined |
| `gy` | Go to type def | Jump to type definition |
| `gi` | Go to implementation | Jump to implementation |
| `gr` | Find references | Show all references |
| `K` | Show documentation | Hover documentation |
| `<Space>rn` | Rename symbol | Rename across project |
| `<Space>qf` | Quick fix | Apply quick fix |

### 5. Window & Buffer Management

| Key | Action | Description |
|-----|--------|-------------|
| `<Space>w` | `:w` | Save file |
| `<Space>q` | `:q` | Quit |
| `<Space>x` | `:x` | Save and quit |
| `<Space>v` | `:vsplit` | Vertical split |
| `<Space>h` | `:split` | Horizontal split |
| `Ctrl+h/j/k/l` | Navigate splits | Move between windows |
| `<Space>n` | `:bnext` | Next buffer |
| `<Space>p` | `:bprevious` | Previous buffer |
| `<Space>d` | `:bdelete` | Delete buffer |

### 6. Search & Replace

| Key | Action | Description |
|-----|--------|-------------|
| `<Space>/` | `:nohl` | Clear search highlighting |
| `<Space>*` | Grep word | Grep word under cursor |
| `<Space>g` | `:Grepper` | Interactive grep |
| `n/N` | Next/Prev | Jump to next/previous match (centered) |

### 7. Text Editing Enhancements

| Key | Action | Description |
|-----|--------|-------------|
| `jk` or `kj` | Escape | Exit insert mode |
| `Y` | Yank to EOL | Yank to end of line |
| `Q` | Play macro | Play macro in register q |
| `Ctrl+d/u` | Scroll | Half-page scroll (centered) |
| `J/K` (visual) | Move lines | Move selected lines up/down |
| `</>` (visual) | Indent | Indent and keep selection |

## Daily Workflow

### Morning: Starting a Project

```bash
1. cd ~/projects/myproject
2. vim
3. <Space>f → Find main file
4. <Space>gs → Check git status
5. Start coding!
```

### During Development

```
# Finding things:
<Space>f          → Find file by name
<Space>s function → Find where "function" is used
<Space>b          → Jump between recently opened files

# Editing:
gd                → Jump to definition
<Space>rn         → Rename variable everywhere
ciw               → Change word
<Space>*          → Find all occurrences

# Running:
<Space>r          → Test current file
<Space>m          → Build entire project
<Space>cn         → Jump to next error
```

### Git Workflow

```
# Check status
<Space>gs

# In status window:
-                 → Stage/unstage file
cc                → Commit
<Space>gp         → Push

# View changes
<Space>gd         → Diff current file
<Space>gc         → Browse all commits
```

## Plugin Overview

### Essential Plugins

1. **FZF** - Fuzzy finder for files, buffers, content
2. **Fugitive** - Best Git integration for Vim
3. **CoC** - Modern LSP support (autocomplete, goto def, etc.)
4. **Grepper** - Fast project-wide search
5. **Commentary** - Quick commenting with `gcc`
6. **Surround** - Manipulate surroundings: `cs"'` changes quotes

### Color Scheme

**Gruvbox** - A retro color scheme that's easy on the eyes, similar to tsoding's aesthetic.

## Customization

### Change Leader Key

```vim
" Default is Space, change to comma:
let mapleader = ","
```

### Add Your Own Keybindings

```vim
" Add at the end of .vimrc
nnoremap <leader>t :TestSuite<CR>
nnoremap <leader>c :!clear<CR>
```

### Language-Specific Settings

```vim
" Add to File-specific Settings section
autocmd FileType java nnoremap <buffer> <leader>r :!javac % && java %:r<CR>
```

### Project-Specific Configuration

Create `.vimrc` in your project root:

```vim
" Project-specific settings
set tabstop=2
compiler gradle
nnoremap <leader>t :!./gradlew test<CR>
```

## Advanced Usage

### Macros

```
1. qa            → Start recording macro in register 'a'
2. (do actions)
3. q             → Stop recording
4. Q             → Play macro (mapped to @q)
5. 10Q           → Play macro 10 times
```

### Marks

```
ma              → Set mark 'a'
'a              → Jump to mark 'a'
<Space>f<CR>    → Fuzzy find, then 'a to return
```

### Visual Block Mode

```
Ctrl+v          → Enter visual block mode
I               → Insert at start of block
A               → Append at end of block
c               → Change block
```

### Search and Replace

```
:%s/old/new/g   → Replace all in file
:'<,'>s/old/new/g → Replace in selection
<Space>s old    → Find with ripgrep, then cdo
```

## Tips & Tricks

### Speed Tips from Tsoding's Workflow

1. **Use relative line numbers**: `12j` jumps 12 lines down
2. **Master dot command**: `.` repeats last change
3. **Use marks for long jumps**: `ma` then `'a` to return
4. **FZF is your friend**: Don't navigate manually, fuzzy find!
5. **Learn text objects**: `ci"`, `da(`, `vi{`, etc.
6. **Use macros**: Automate repetitive tasks
7. **Keep hands on home row**: Use `hjkl`, not arrow keys

### Productivity Hacks

```vim
" Quick file switching (no mouse needed)
<Space>b → type few letters → Enter

" Search and edit in one go
<Space>s pattern → Enter → edit → :cdo %s/old/new/g

" Multi-file editing
<Space>g pattern → Select files with Tab → Enter
:cfdo %s/old/new/g | update
```

## Troubleshooting

### Plugins not installing

```bash
# Manually install vim-plug
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

# Then in vim:
:PlugInstall
```

### FZF not working

```bash
# Install FZF system-wide
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install

# Restart vim
```

### CoC not working

```vim
" Check CoC status
:checkhealth

" Install Node.js (required for CoC)
# macOS: brew install node
# Linux: Install via your package manager

" Install language servers
:CocInstall coc-json coc-python coc-clangd
```

### Slow performance

```vim
" Check which plugin is slow
:profile start profile.log
:profile func *
:profile file *
" Use vim for a bit
:profile pause
:noautocmd qall!

" Then check profile.log
```

## Learning Path

### Week 1: Basic Movement
- Master `hjkl` navigation
- Learn `w`, `b`, `e` for word movement
- Use `f` and `t` for inline searching
- Practice `<Space>f` for file finding

### Week 2: Editing
- `ci"`, `ca(`, `di{` - text objects
- `.` - repeat command
- `u` - undo, `Ctrl+r` - redo
- Visual mode selections

### Week 3: Advanced Navigation
- `<Space>s` - content search
- `gd` - go to definition
- Marks with `ma` and `'a`
- Jump list with `Ctrl+o` and `Ctrl+i`

### Week 4: Workflows
- Git workflow with Fugitive
- Compilation and debugging
- Macros for automation
- Project-wide refactoring

## Resources

- [Vim Help](https://vimhelp.org/) - Built-in documentation (`:help`)
- [Vim Adventures](https://vim-adventures.com/) - Game to learn Vim
- [Practical Vim](https://pragprog.com/titles/dnvim2/practical-vim-second-edition/) - Best Vim book

## FAQ

**Q: Why not NeoVim?**
A: This config works with both! Just use `nvim` instead of `vim`.

**Q: Can I use mouse?**
A: Yes, it's enabled, but you'll be faster without it!

**Q: What if I forget a keybinding?**
A: Type `<Space>` and wait. You can also check this README or `:map` to see all mappings.

**Q: How do I update plugins?**
A: `:PlugUpdate` then `:PlugUpgrade` (for vim-plug itself)

**Q: Can I use this with VSCode?**
A: Yes! Install VSCodeVim extension and cherry-pick the keybindings you like.
