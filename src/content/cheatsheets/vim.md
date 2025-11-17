---
title: Vim Cheatsheet
date: 2025-11-14
---

---

[Vim: Tutorial on Editing, Navigation, and File Management (2018)](https://www.youtube.com/watch?v=E-ZbrtoSuzw) 

[How to Do 90% of What Plugins Do (With Just Vim)](https://www.youtube.com/watch?v=XA2WjJbmmoM) 

## 1. Motions

### i. Scrolling

![[vim_scrolling.png]]

- `zz` - Center the screen on the current line

### ii. Replacing & Editing

- `ry` - Replace the character under the cursor with the next character `y`
- `ce` - Remove word and put u in insert mode
- `cc` - Remove line and enter insert mode
- `c$` - Delete from the cursor to the end of the line and put u in insert mode
- `d$` - Delete from the cursor to the end of the line (without entering insert mode)
- `dw` or `de` - Delete the current word
- `db` - Delete the previous word
- `d^` - Delete to the first nonblank character.
>

- `dd` - Delete the current line
- `4dd` - Delete the next 4 lines
- `d2d` or `2dd` - Delete the next 2 lines
>

- `shift + v + d` - Delete the currently selected line
- `shift + v + 6j`- Select the current line and delete the next 6 lines
- `shift + d` `D` - Delete everything from the cursor to the end of the line
- `shift + s` `S` - Delete the current line and enter insert mode
>

- `x` - Delete the character under the cursor
- `X` - Delete the character behind the cursorweadaad

>

- `yy` - Copy (yank) the current line
- `yyp` - Copy the current line and paste it below
- `yyP` - Copy the current line and paste it above
- `p` - Paste the copied text below the current line (or after the cursor for partial lines)
- `P` - Paste the copied text above the current line (or at the cursor position)
>
- `yiw` - Copy (yank) the current word
- `viwp` - Replace the current word with the previously copied text
- `caw` - Delete the current word and enter insert mode
- `ci(` - Delete everything inside the parenthesis and puts you in insert mode
- `vi(` - selects everything inside the parenthesis


>

- `ggVG` + `"+y` - Copy the entire file to the system clipboard
- `"+y` - Copy selection to the system clipboard

- `^vg_` - Select all words in the line (excludes leading and trailing whitespace)
- `_y$` - Copy everything in the line without leading whitespace
>

- `gv` - Reselect the last visual selection

>

- `u` - Undo the last command
- `ctrl + r` - Redo the last undone command (cant make it work for some reason)
- `U` - Undo all changes made on the current line `!!!!`


### iii. Misc

- `gg` - Go to the start of the file

- `%` - Jump back and forth to the matching brace, bracket, or parenthesis
- `J` - Join the current line with the line below `!!!!`
- `f{char}` - Jump to the next occurrence of the specified character `!!!!`
- `F{char}` - Jump befind to the specified character `eg F<Space>`
- `~` - Toggle case (converts lowercase to uppercase and vice versa). keep pressing to move forward
- `vit` - Select everything between HTML tags

### iv. Using motions with context

![[vim_motion.png]]

- I need to delete a while loop and I am before the while loop. so i look at it and it ends with `}`, so i do `d}` it deletes everything till that
- I am in the middle of the line. I need to delete 3 words in the middle. so i go before it and do `3ce`, this changes the 3 words forward
- I am on line 8, and i need to go 8 lines down relative to current line. I do `8+`. This takes me to the end of 8th line
- capatilize a word. `gUaW`. go upper case one word
- I have 4 lines below me. I want to go to the end of 4rth line. so i do `4$`. This takes me to the end of the line 4 times.
- I have 2 for loops above me and one while loop below me. To go to start of first for loop above me i do, `[m`. If i want to go the below while loop i do `]m`. Here m is method and should work, need to look how.


- if my cursor is after the comma and i want to delete till the closing brackets. I would do `dt)`. 
This means delete upto the delimeter ) 
``` cpp

    ListNode* reverseList(ListNode* head, ListNode* endingNode){
        // does something
    }

```


### v. Basics



- `j` - Move down one line
- `k` - Move up one line
- `l` - Move right one character
- `h` - Move left one character
>
- `w` - Jump forward to the beginning of the next word
- `b` - Jump backward to the beginning of the previous word
- `e` - Move to the end of the current word
>
- `G` - Go to the end of the file
- `0` - Move to the start of the line
>
- `_` - Move to the start of the first word in the line (skip leading whitespace)
- `^` - Move to the first non-whitespace character in the line
- `$` - Move to the end of the line
>
- `v` - Start visual mode (character-wise selection)
- `V` - Start visual line mode (select entire lines)
>
- `vi(` - Select everything inside parentheses
- `vi"` or `vi'` - Select everything inside quotes
>
- `>` or `2>` - Indent the selected text (move 1 or 2 tabs forward)
- `<` or `2<` - Unindent the selected text (move 1 or 2 tabs backward)

>

- `I` - Move to the first non-whitespace character and enter insert mode
- `A` - Move to the end of the line and enter insert mode
- `o` - Open a new line below the current line and enter insert mode
- `O` - Open a new line above the current line and enter insert mode

>




### vi. Regular Expressions

- `/err.*` - Search for everything containing "err" followed by any characters
- `:s/error/taimour` - Replace the first occurrence of "error" with "taimour" in the current line
- `:%s/foo/taimour` - Replace the first occurrence of "foo" with "taimour" on every line in the file
- `:s/foo/taimour/g` - Replace all occurrences of "foo" with "taimour" in the current line
- `:%s/foo/taimour/g` - Replace all occurrences of "foo" with "taimour" in the entire file
- `:s/foo/taimour/gc` - Replace all occurrences in the current line with confirmation prompts (press `y` for yes, `n` for no)



### vii File Handling

- go on import command and press `gf`, it will take you to that file.
- `gd` will take you to the defination where it was deined
>
- `ctrl + w` - Enter window mode for managing multiple splits
- `ctrl + ^` - Switch to the previously opened file
- `ctrl + o` - Jump backward through the jumplist (files/directories history)
- `ctrl + i` - Jump forward through the jumplist
- `ctrl + G` - Display information about the current file

>

- `:source %` - Source the current file (useful for reloading configuration files like `init.vim`)
- `:e {filename}` - Open or create a new file
- `:jumplist` - Display the list of recent file jumps


### viii. Marks & Bookmarks

- `m{A-Z}` (e.g., `mA`) - Create a global bookmark that can be accessed from anywhere in the directory
- `m{a-z}` (e.g., `ma`) - Create a local bookmark accessible only within the same file
- `'{mark}` (e.g., `'a`) - Jump to the bookmarked line

### ix. Tips

- `d`, `c`, and `y` can be combined with any motion command
- Most commands accept a count prefix like `3w`. Experiment with this. `TODO`
- use motions as often as possible
- Commands like `ciw` (change inner word), `di"` (delete inside quotes), and `ca{` (change around braces)


## 2. Modes

### i. Windows Mode

After pressing `ctrl + w`:

- `s` - Split the screen horizontally
- `v` - Split the screen vertically
- `o` - Close all other open splits except the current one

### ii. Command Mode

- `ctrl + d` - Show a popup menu with recommended commands
- `ctrl + w` (in Insert Mode) - Delete the previous word
- `ctrl + u` (in Insert Mode) - Delete the entire line before the cursor

>

- `ctrl + p` - Move backward in a list (like fuzzy finding)
- `ctrl + n` - Move forward in a list (like fuzzy finding)
- `ctrl + j` - Grep a word and navigate forward through search results
- `ctrl + k` - Grep a word and navigate backward through search results

>

- `/word` - Search forward for "word"
- `?word` - Search backward for "word"

## 3. Vim Settings

- `:set scrolloff=8` - Automatically scroll when you're within 8 lines from the top or bottom
- `:set number` - show absolute line numbers
- `:set relativenumber` or `:set rnu` - show relative line numbers from the current line

## 4. Help
- `ctrl + n` - Move to the next section in the help menu
- `ctrl + b` - Move back in the help menu
- `:help options` - Open the help documentation for the options menu


## References

``` js 
// copy paste the code in vim and play around.
const { data } = await client.get('statuses/user_timeline', {
  email: user.email,
  count: 100
  tweet_mode: 'extended',
});

const tweets: Tweet[] = data.map((tweet: any) => ({
  id: tweeet.id_ster,
  text: tweet.full_text,
  created_at: tweet.created_at,
  user: {
    id: tweet.user.id_str,
    screen_name: tweet.user.screen_name,
  },
  email: user.email,
}));

```



## Resources

[Matt wiki vim](https://wiki.dzx.cz/computer_science/command_line/vim) 