---
title: GDB Cheatsheet
date: 2025-11-14
---

## GDB Commands

### i. Starting GDB

```bash
# Start GDB with a program
gdb program

# Start GDB with a program and core dump
gdb program core

# Attach to a running process by PID
gdb -p <pid>

# Start with command file
gdb -x commands.txt program

# Start in quiet mode (no intro text)
gdb -q program

# Start with arguments
gdb --args program arg1 arg2
```

### ii. Running and Controlling Execution

```bash
# Run the program
run
r

# Run with arguments
run arg1 arg2

# Continue execution
continue
c

# Step to next line (step into functions)
step
s

# Step to next line (step over functions)
next
n

# Step one instruction exactly
stepi
si

# Execute next instruction (step over)
nexti
ni

# Finish executing current function
finish
fin

# Run until specified location
until location
u location

# Kill the running program
kill
```

### iii. Breakpoints

```bash
# Set breakpoint at function
break function_name
b function_name

# Set breakpoint at line number
break filename:line_number
b filename:42

# Set breakpoint at address
break *0x400567

# Set temporary breakpoint (deleted after hit)
tbreak function_name
tb function_name

# Set conditional breakpoint
break function_name if variable == value

# List all breakpoints
info breakpoints
i b

# Delete breakpoint by number
delete breakpoint_number
d 1

# Delete all breakpoints
delete

# Disable breakpoint
disable breakpoint_number

# Enable breakpoint
enable breakpoint_number

# Clear breakpoint at location
clear function_name
```

### iv. Watchpoints

```bash
# Set watchpoint (break when variable changes)
watch variable

# Set read watchpoint (break when variable is read)
rwatch variable

# Set access watchpoint (break on read or write)
awatch variable

# List all watchpoints
info watchpoints

# Delete watchpoint
delete watchpoint_number
```

### v. Examining Variables and Memory

```bash
# Print variable value
print variable
p variable

# Print in hexadecimal
print/x variable
p/x variable

# Print in binary
print/t variable

# Print in octal
print/o variable

# Print as character
print/c variable

# Print pointer contents
print *pointer

# Print array elements
print array[0]@10

# Display variable automatically after each step
display variable

# List all displays
info display

# Remove display
undisplay display_number

# Examine memory at address
x/nfu address
# n = count, f = format (x/d/u/o/t/a/c/f/s), u = unit size (b/h/w/g)

# Example: examine 10 words in hex
x/10xw 0x400000

# Examine string
x/s address

# Print type of variable
ptype variable

# Show local variables
info locals

# Show function arguments
info args

# Show all registers
info registers
i r

# Show specific register
info registers rax
```

### vi. Stack and Frames

```bash
# Show stack backtrace
backtrace
bt

# Show full backtrace with local variables
backtrace full
bt full

# Show limited backtrace
backtrace 10

# Select frame by number
frame number
f 2

# Move up one frame
up

# Move down one frame
down

# Show current frame info
info frame
i f

# Show all frames
info stack
```

### vii. Source Code

```bash
# List source code around current line
list
l

# List specific function
list function_name

# List specific line
list line_number

# List range of lines
list 10,20

# List from file
list filename:line_number

# Set number of lines to list
set listsize 20

# Search for text in source
search text

# Reverse search
reverse-search text

# Show current location
where
```

### viii. Threads

```bash
# Show all threads
info threads

# Switch to thread
thread thread_number

# Apply command to all threads
thread apply all command

# Apply command to specific threads
thread apply 1 2 3 command

# Show thread-specific info
info thread thread_number
```

### ix. Assembly and Disassembly

```bash
# Disassemble function
disassemble function_name
disas function_name

# Disassemble address range
disassemble 0x400000,0x400100

# Disassemble current function
disassemble

# Show next instruction
x/i $pc

# Disassemble with source
disassemble /m function_name

# Set disassembly flavor (Intel or AT&T)
set disassembly-flavor intel
set disassembly-flavor att
```

### x. Working with Symbols

```bash
# Show all functions
info functions

# Show functions matching pattern
info functions pattern

# Show all variables
info variables

# Show symbol info
info symbol address

# Load symbol file
symbol-file filename

# Add symbol file
add-symbol-file filename address

# Show current symbol file
info files
```

### xi. Checkpoints and Snapshots

```bash
# Create checkpoint (snapshot)
checkpoint

# List checkpoints
info checkpoints

# Restart from checkpoint
restart checkpoint_id

# Delete checkpoint
delete checkpoint checkpoint_id
```

### xii. Scripting and Automation

```bash
# Execute GDB commands from file
source script.gdb

# Define custom command
define command_name
  # commands here
end

# Set variable value
set variable var = value

# Call function
call function_name(args)

# Execute shell command
shell command

# Log output to file
set logging on
set logging file output.txt

# Python scripting
python print("Hello from Python")

# Execute multiple commands
commands breakpoint_number
  # commands to execute
end
```

### xiii. Process and Core Dumps

```bash
# Generate core dump
generate-core-file
gcore

# Detach from process
detach

# Attach to process
attach pid

# Show mapped memory regions
info proc mappings

# Show process status
info proc status

# Show all process info
info proc all
```

### xiv. Settings and Configuration

```bash
# Show all settings
show

# Set print settings
set print pretty on
set print array on
set print array-indexes on

# Set pagination
set pagination off

# Set history
set history save on
set history filename ~/.gdb_history

# Set prompt
set prompt (my-gdb) 

# Show architecture
show architecture

# Set architecture
set architecture i386

# Show configuration
show configuration
```

### xv. TUI (Text User Interface)

```bash
# Enable TUI mode
tui enable
Ctrl-x a

# Disable TUI mode
tui disable

# Switch focus between windows
focus next
focus cmd
focus src

# Show specific window
layout src      # Source code
layout asm      # Assembly
layout split    # Both source and assembly
layout regs     # Registers

# Refresh display
refresh
Ctrl-L

# Update display
update
```

### xvi. Remote Debugging

```bash
# Connect to remote target
target remote hostname:port
target remote localhost:1234

# Connect to extended remote
target extended-remote hostname:port

# Load program to remote
load

# Show remote target info
info target

# Set remote timeout
set remotetimeout seconds
```

### xvii. Advanced Features

```bash
# Reverse debugging (record execution)
record
record full

# Reverse continue
reverse-continue
rc

# Reverse step
reverse-step
rs

# Reverse next
reverse-next
rn

# Set scheduler locking (for multi-threaded debugging)
set scheduler-locking on/off/step

# Show inferior (process being debugged)
info inferiors

# Add inferior
add-inferior

# Switch inferior
inferior number

# Follow fork behavior
set follow-fork-mode parent/child

# Catch system calls
catch syscall
catch syscall open

# Catch signals
catch signal SIGINT

# Catch C++ exceptions
catch throw
catch catch
```

### xviii. Convenience Variables and History

```bash
# Access last value
print $

# Access value history
print $1
print $2

# Set convenience variable
set $myvar = 10

# Show convenience variables
show convenience

# Access command history
show commands

# Execute previous command
<Enter>
```

### xix. Exiting GDB

```bash
# Quit GDB
quit
q

# Quit without confirmation
quit -force
```

## Quick Tips

```bash
# Use Tab completion for commands and symbols
# Use <Enter> to repeat last command
# Use Ctrl-C to interrupt running program
# Use Ctrl-D to exit GDB (same as quit)
# Abbreviate commands (b for break, r for run, etc.)
# Use command history with up/down arrows

# Print complex expressions
print (int)some_float
print array[i].member

# Modify variables during debugging
set variable count = 0
set {int}0x400000 = 42

# Examine memory relative to register
x/10xw $rsp

# Break on main and run automatically
break main
run
```

## Common Debugging Workflows

```bash
# Basic debugging session
gdb program
break main
run
next
print variable
continue
quit

# Debugging a crash with core dump
gdb program core
backtrace
frame 0
info locals
print variable
quit

# Debugging segmentation fault
gdb program
run
# Program crashes
backtrace
frame
list
print *pointer
quit

# Attaching to running process
gdb -p 1234
backtrace
info threads
continue
detach
quit
```

## .gdbinit Configuration Example

```bash
# ~/.gdbinit
set disassembly-flavor intel
set pagination off
set print pretty on
set history save on
set history filename ~/.gdb_history
set history size 10000

# Custom commands
define hook-stop
  info registers
  x/1i $pc
end
```