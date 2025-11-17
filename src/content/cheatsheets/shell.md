---
title: Shell Cheatsheet
date: 2025-11-18
---

## Bash Keyboard Shortcuts

### i. Navigation & History
``` bash
Ctrl + n          # Move to next command (same as Down arrow)
Ctrl + p          # Move to previous command (same as Up arrow)
Ctrl + r          # Search command history backward (press repeatedly to cycle)
Ctrl + s          # Pause terminal output
Ctrl + q          # Resume terminal output after Ctrl + s
Ctrl + a          # Move cursor to beginning of line
Ctrl + e          # Move cursor to end of line
Alt + b           # Move backward one word
Alt + f           # Move forward one word
```

### ii. Editing & Deletion
``` bash
Ctrl + d          # Delete character under cursor (or exit shell if line is empty)
Ctrl + k          # Delete from cursor to end of line
Ctrl + u          # Delete from cursor to beginning of line
Ctrl + w          # Delete word before cursor
Ctrl + y          # Paste previously deleted text
Ctrl + t          # Transpose character before cursor with character under cursor
Alt + t           # Transpose two words before cursor
Ctrl + _          # Undo last edit
Ctrl + x + Backspace  # Delete from beginning of line to cursor
```

### iii. Screen & Editor
``` bash
Ctrl + l          # Clear screen (equivalent to clear command)
Ctrl + x + Ctrl + e   # Open current command in $EDITOR for multi-line editing
```

## File Processing & Data Manipulation

### i. Text Processing
``` bash
# Search and filter
grep -r pattern dir/          # Recursively search for pattern
grep -i pattern file          # Case-insensitive search
grep -v pattern file          # Invert match (exclude lines with pattern)
ack pattern                   # Fast code searching (install via package manager)
ag pattern                    # The Silver Searcher (faster than ack)
rg pattern                    # Ripgrep (fastest option)

# Text manipulation
cut -d',' -f1,3 file.csv      # Extract columns 1 and 3 from CSV
paste file1 file2             # Merge lines from two files side by side
join file1 file2              # Join files on common field
tr 'a-z' 'A-Z' < file         # Convert lowercase to uppercase
sed 's/old/new/g' file        # Replace text in file
awk '{print $1, $3}' file     # Print columns 1 and 3
```

### ii. Sorting & Counting
``` bash
sort file                     # Sort lines alphabetically
sort -n file                  # Sort numerically
sort -h file                  # Sort human-readable numbers (1K, 2M, etc.)
sort -r file                  # Reverse sort
sort -u file                  # Sort and remove duplicates
uniq file                     # Remove adjacent duplicate lines
uniq -c file                  # Count occurrences of each line
uniq -d file                  # Show only duplicate lines
wc -l file                    # Count lines
wc -w file                    # Count words
wc -c file                    # Count bytes
```

### iii. Data Analysis
``` bash
# Set operations on sorted files
sort a b | uniq > c           # Union of a and b
sort a b | uniq -d > c        # Intersection of a and b
sort a b b | uniq -u > c      # Set difference a - b

# Statistical operations
datamash sum 1 < file         # Sum values in column 1
datamash mean 1 < file        # Calculate mean of column 1
datamash groupby 1 sum 2 < file   # Group by column 1, sum column 2

# Column formatting
column -t file                # Format output in columns
column -t -s',' file.csv      # Format CSV as table
```

### iv. File Conversions
``` bash
# Format conversions
iconv -f utf-8 -t latin1 input > output   # Convert text encoding
pandoc file.md -o file.pdf                # Convert Markdown to PDF
pandoc file.md -o file.docx               # Convert Markdown to Word

# JSON/XML/YAML processing
jq '.' file.json              # Pretty-print JSON
jq '.[] | select(.age > 30)' file.json    # Filter JSON data
xmlstarlet sel -t -v "//item" file.xml    # Extract XML values
shyaml get-value key < file.yaml          # Parse YAML

# CSV processing
csvcut -c 1,3 file.csv        # Extract CSV columns
csvgrep -c name -m "John" file.csv        # Filter CSV rows
csvjoin file1.csv file2.csv   # Join CSV files
```

### v. Compression & Archives
``` bash
# Working with compressed files
zcat file.gz                  # View gzip file without extracting
zless file.gz                 # Page through gzip file
zgrep pattern file.gz         # Search in gzip file
xz file                       # Compress with xz (high ratio)
tar czf archive.tar.gz dir/   # Create compressed tarball
tar xzf archive.tar.gz        # Extract compressed tarball
```

### vi. Binary Files
``` bash
hd file                       # Hex dump
hexdump -C file               # Hex dump with ASCII
xxd file                      # Hex dump (xxd format)
strings file                  # Extract readable text from binary
file file                     # Identify file type
```

### vii. Advanced Search
``` bash
# Find files
find . -name "*.txt"          # Find files by name
find . -type f -mtime -7      # Find files modified in last 7 days
find . -size +10M             # Find files larger than 10MB
locate filename               # Fast file search (uses database)

# Combine find with other commands
find . -name "*.py" -exec grep "def" {} \;   # Search in found files
find . -type f -print0 | xargs -0 grep pattern   # Safe for filenames with spaces
```

### viii. Parallel Processing
``` bash
# Process multiple files in parallel
cat files.txt | xargs -P 4 -I {} process.sh {}   # Run 4 processes in parallel
cat urls.txt | parallel curl -O {}                # GNU parallel (install separately)
```

### ix. Monitoring & Progress
``` bash
pv file | process             # Show progress bar for pipeline
watch -n 2 'command'          # Run command every 2 seconds
watch -d -n 1 'ls -lh file'   # Highlight differences between updates
```

## Resources 

- [Command line Wiki](https://wiki.dzx.cz/computer_science/command_line) 
- [Cheat.sh very useful](https://cheat.sh/) 

- [Shell productivity tips and tricks](https://blog.balthazar-rouberol.com/shell-productivity-tips-and-tricks) 

- [5 Types Of ZSH Aliases You Should Know](https://www.thorsten-hans.com/5-types-of-zsh-aliases/) 

- [awesome-console-services github](https://github.com/chubin/awesome-console-services) 


- [the-art-of-command-line github](https://github.com/jlevy/the-art-of-command-line?tab=readme-ov-file#processing-files-and-data)
    - already added most commands. keeping here for refernce.



- [Grep for System Admins: Using Grep to Automate Daily Tasks](https://developer.okta.com/blog/2020/05/06/grep-for-system-admins) 

- [Conventions for Command Line Options](https://nullprogram.com/blog/2020/08/01/) 

- [Bash-Oneliner](https://github.com/onceupon/Bash-Oneliner) 
    - slowly add them here otherwise you will forget it. 

- [What happens when you press a key in your terminal?](https://jvns.ca/blog/2022/07/20/pseudoterminals/)

- [Nushell Book - very good](https://www.nushell.sh/book/coming_from_bash.html) 



## Todo

- [Twitter fileter later](https://x.com/b0rk/status/993165679833567233)

