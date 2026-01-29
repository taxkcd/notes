---
title: Vim Cheatsheet (nvim config)
date: 2026-01-20
---

---

This is a cheatsheet for **this Neovim config** (`dotfiles/nvim`).

> Leader is `<Space>` (and `maplocalleader` is also `<Space>` in this config)

## 1. Leader / Navigation

### i. Windows (splits)

- `<C-h>` - Move to left split
- `<C-j>` - Move to below split
- `<C-k>` - Move to above split
- `<C-l>` - Move to right split
>
- `<C-Up>` - Resize window (shorter)
- `<C-Down>` - Resize window (taller)
- `<C-Left>` - Resize vertical split (narrower)
- `<C-Right>` - Resize vertical split (wider)

### ii. Buffers

- `<S-l>` - Next buffer
- `<S-h>` - Previous buffer
>
- `<leader><leader>` - Telescope buffers (see Telescope section)

## 2. Editing / Clipboard (better copy paste)

### i. “Don’t touch my clipboard” deletes

- `<leader>x` - Delete char to blackhole (`"_x`)
- `<leader>s` - Substitute to blackhole (`"_s`)
- `<leader>d` - Delete to blackhole (`"_d`)
- `<leader>c` - Change to blackhole (`"_c`)

### ii. System clipboard yanks

- `<leader>y` - Yank to system clipboard (`"+y`)
>
- Visual mode:
  - `<leader>y` - Yank selection to system clipboard

### iii. Visual paste without overwriting yank

- Visual mode: `<leader>p` - Paste over selection but keep yank (`"_dP`)

## 3. Moving text up / down

### i. Normal mode

- `<A-j>` - Move current line down
- `<A-k>` - Move current line up

### ii. Visual mode

- `<A-j>` - Move selection down
- `<A-k>` - Move selection up

### iii. Visual block mode

- `J` / `<A-j>` - Move block down
- `K` / `<A-k>` - Move block up

## 4. Indenting (stay in indent mode)

- Visual mode: `<` - Indent left and keep selection
- Visual mode: `>` - Indent right and keep selection

## 5. Insert-mode “flow”

- Insert mode: `jk` - Exit insert mode
- Insert mode: `<C-l>` - Jump to end of line (without leaving insert)

## 6. Search / UI quality-of-life

- Normal mode: `<Esc>` - Clear search highlight (`:nohlsearch`)

## 7. Commenting (VS Code style)

This config wires comment toggling through `Comment.nvim`’s API.

- Normal mode:
  - `<C-/>` or `<C-_>` - Toggle line comment
  - `<D-/>` or `<D-_>` - Toggle line comment (macOS “Command” key)
- Visual mode:
  - `<C-/>` or `<C-_>` - Toggle comment for selection
  - `<D-/>` or `<D-_>` - Toggle comment for selection

## 8. Formatting / Messages (custom commands)

- `:Format` - Format current buffer
  - If filetype is `json` and file is large enough + `jq` exists, uses `jq .`
  - Otherwise uses LSP formatting
>
- `<leader>f` - Run `:Format`
>
- `:ShowMessages` - Show `:messages` in a buffer named `MessagesBuffer`

## 9. LSP / Diagnostics (buffer-local when LSP attaches)

These are set in `on_attach`, so they only exist in LSP buffers.

- `gD` - Go to declaration
- `gd` - Go to definition (Lspsaga)
- `gi` - Go to implementation
- `gh` - Hover doc (Lspsaga)
- `<C-k>` - Signature help
>
- `gr` - Finder (references/defs) (Lspsaga)
- `<leader>rn` - Rename (Lspsaga)
- `<leader>ca` - Code action (Lspsaga)
>
- `[d` - Previous diagnostic (Lspsaga)
- `]d` - Next diagnostic (Lspsaga)
- `gl` - Show line diagnostics (Lspsaga)
- `<leader>q` - Diagnostics to loclist

## 10. Telescope

### i. Search mappings

- `<C-p>` - Find files
- `<leader>sf` - Search files
- `<leader>sg` - Live grep
- `<leader>sw` - Grep current word
- `<leader>sd` - Diagnostics
- `<leader>sr` - Resume last picker
- `<leader>s.` - Recent files
- `<leader>ss` - Telescope builtin pickers
- `<leader>sh` - Help tags
- `<leader>sk` - Keymaps
- `<leader>sn` - Search Neovim config files
>
- `<leader>/` - Fuzzy search in current buffer (dropdown)
- `<leader>s/` - Live grep only in open files

### ii. In Telescope picker navigation

- Insert mode: `<C-j>` - Next item
- Insert mode: `<C-k>` - Previous item
- Normal mode: `<C-j>` - Next item
- Normal mode: `<C-k>` - Previous item

## 11. Harpoon

- `<leader>a` - Add file to Harpoon
- `<C-m>` - Toggle Harpoon quick menu
>
- `<leader>1` - Jump to Harpoon file 1
- `<leader>2` - Jump to Harpoon file 2
- `<leader>3` - Jump to Harpoon file 3
- `<leader>4` - Jump to Harpoon file 4

## 12. File Explorer (Neo-tree)

- `<leader>e` - Toggle Neo-tree
  - Also provides `:Neotree` command

## 13. Terminal (ToggleTerm)

### i. Open/close basics

- `<C-\>` - Toggle terminal (open mapping)
>
- Terminal mode (inside ToggleTerm terminal buffers):
  - `<esc>` - Exit to normal mode
  - `jk` - Exit to normal mode
  - `<C-h/j/k/l>` - Navigate splits from terminal mode

### ii. Your “special terminals”

- `<leader>tg` - Toggle Lazygit
  - If in tmux: opens `tmux display-popup`
  - Otherwise uses a floating ToggleTerm
- `<leader>tn` - Toggle Node REPL
- `<leader>tp` - Toggle Python REPL
- `<leader>th` - Toggle horizontal terminal
- `<leader>tf` - Toggle floating terminal

### iii. Run / Debug current file

- `<C-r>` or `<leader>r` - Run current file (based on filetype) in a floating terminal
  - In that float:
    - Normal mode: `q` - Close
    - Terminal mode: `<C-q>` - Close
    - Terminal mode: `<C-c><C-c>` - Close
>
- `<leader>db` - Debug current file (JS / TS / Python supported)
  - In that float:
    - Normal mode: `q` - Close
    - Terminal mode: `<C-q>` - Close
    - Terminal mode: `<C-c><C-c>` - Close

## 14. Git

### i. Fugitive

- `<leader>mg` - `:Git` (Fugitive status + commands)

### ii. Gitsigns

- `[c` - Previous hunk
- `]c` - Next hunk
>
- `<leader>hs` - Stage hunk (normal + visual)
- `<leader>hr` - Reset hunk (normal + visual)
- `<leader>hS` - Stage buffer
- `<leader>hR` - Reset buffer
- `<leader>hp` - Preview hunk
- `<leader>hi` - Preview hunk inline
- `<leader>hb` - Blame line (full)
- `<leader>hd` - Diff this
- `<leader>hD` - Diff this `~`
- `<leader>hQ` - Quickfix all hunks
- `<leader>hq` - Quickfix hunks
>
- `<leader>tb` - Toggle current line blame
- `<leader>tw` - Toggle word diff
>
- Textobj: `ih` - Select hunk (operator-pending + visual)

## 15. Completion (nvim-cmp)

Inside completion menu / snippets:

- `<C-j>` - Next item
- `<C-k>` - Previous item
- `<C-b>` / `<C-f>` - Scroll docs
- `<C-Space>` - Trigger completion
- `<C-e>` - Abort / close
- `<CR>` - Confirm (select = true)
>
- `<Tab>` - Next item / expand snippet / jump snippet
- `<S-Tab>` - Previous item / jump snippet backwards
>
- Also works:
  - `<Up>` / `<Down>` - Prev / next item

## 16. Autopairs

- `<M-e>` - Fast wrap (quickly wrap existing text with `{`, `[`, `(`, `"`, `'`)

## 17. Which-key

- `<leader>?` - Show buffer-local keymaps (which-key)

## 18. Defaults (plugin defaults you asked to include)

These are **common defaults** for the plugins you use (if you didn’t remap them). Defaults can vary by version/config, so if something feels off:

- For Comment.nvim: check `:help Comment.nvim` (or the repo docs)
- For nvim-surround: check `:help nvim-surround`
- For terminal behavior: check `:help terminal` / `:help terminal-input`

### i. Comment.nvim (common defaults)

- `gcc` - Toggle line comment
- `gc{motion}` - Toggle comment for a motion (example: `gc}` / `gcip`)
- Visual mode: `gc` - Toggle comment for selection

### ii. nvim-surround (common defaults)

- `ys{motion}{char}` - Add surround (example: `ysiw"` to surround word with quotes)
- `ds{char}` - Delete surround
- `cs{old}{new}` - Change surround

### iii. ToggleTerm (common defaults you’ll see a lot)

- Terminal mode: `<C-\><C-n>` - Exit terminal mode (built-in vim terminal behavior)

