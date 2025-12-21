---
title: PDB Cheatsheet
date: 2025-11-14
---

# Python Debugger (pdb/pdb++) Cheatsheet

**Install pdb++:** `pip install pdbpp` (auto-replaces pdb with enhanced version)

## 1. Starting the Debugger

### Inline Breakpoints
```python
import pdb; pdb.set_trace()  # Python < 3.7
breakpoint()                  # Python >= 3.7 (preferred, uses pdb++)
```

### From Command Line
```bash
python -m pdb script.py       # Start with debugger
python -m pdb -c continue script.py  # Run until first breakpoint
```

### Post-Mortem Debugging
```python
import pdb
try:
    # your code
except:
    pdb.post_mortem()  # Debug after exception
```

### pdb++ Specific: Sticky Mode
```python
# In debugger, type:
sticky        # Toggle sticky mode (shows context automatically)
```

## 2. Navigation Commands

### Basic Movement
* `n` (next) - Execute current line, step over functions
* `s` (step) - Execute current line, step into functions
* `c` (continue) - Continue execution until next breakpoint
* `r` (return) - Continue until current function returns
* `unt` (until) - Continue until line greater than current
* `unt N` - Continue until line N
* `<Enter>` - Repeat last command

### Jumping Around (pdb only, not pdb++)
* `j N` (jump) - Jump to line N (can skip code!)

### pdb++ Enhanced Movement
* `step` - Smart step (skips decorators, properties by default)
* `until` - Continue to next line (useful in loops)

## 3. Breakpoints

### Setting Breakpoints
* `b` - Show all breakpoints
* `b N` - Set breakpoint at line N
* `b file.py:N` - Set breakpoint at line N in file.py
* `b function` - Set breakpoint at first line of function
* `b Class.method` - Set breakpoint at method

### Conditional Breakpoints
* `b N, condition` - Break at line N if condition is True
  ```
  b 25, x > 10
  b 30, name == "admin"
  b 42, len(items) == 0
  ```

### Managing Breakpoints
* `cl` (clear) - Clear all breakpoints
* `cl N` - Clear breakpoint at line N
* `disable N` - Disable breakpoint N
* `enable N` - Enable breakpoint N
* `ignore N count` - Ignore breakpoint N for count times

### pdb++ Enhanced Breakpoints
* `break func if condition` - More readable syntax
* Auto-completion for function names (Tab)

## 4. Inspecting Variables

### Basic Inspection
* `p expr` (print) - Print value of expression
* `pp expr` (pretty-print) - Pretty-print value
* `p locals()` - Print all local variables
* `p globals()` - Print all global variables
* `p vars(obj)` - Print object attributes

### Advanced Inspection
* `whatis expr` - Print type of expression
* `type(expr)` - Show type (can use in p command)
* `dir(obj)` - List object attributes
* `p obj.__dict__` - Object's attributes as dict

### Interactive Inspection
* `!statement` - Execute Python statement (pdb)
* `statement` - Execute directly in pdb++ (no `!` needed)
* `interact` - Start interactive interpreter (Ctrl+D to exit)

### pdb++ Enhanced Inspection
* Just type variable name - prints value automatically
* `obj.<Tab>` - Tab completion for attributes
* Syntax highlighting in output
* Smart truncation of long outputs

## 5. Stack & Frame Navigation

### Viewing Stack
* `w` (where) - Print stack trace (with color in pdb++)
* `bt` (backtrace) - Same as where
* `l` (list) - List source code around current line
* `l N` - List source code around line N
* `ll` (longlist) - List entire current function
* `source obj` (pdb++) - Show source of function/class

### Frame Navigation
* `u` (up) - Move up one frame in stack
* `d` (down) - Move down one frame in stack
* `a` (args) - Print arguments of current function

### pdb++ Stack Enhancements
* Color-coded stack traces
* `w` shows more context
* `longlist` with syntax highlighting

## 6. My Essential Workflows

### Quick Variable Check
```
n              # Next line
variable       # Check value (pdb++: no 'p' needed)
p variable     # Check value (pdb: explicit print)
pp big_dict    # Pretty print complex data
!variable = 5  # Modify on the fly (pdb)
variable = 5   # Modify on the fly (pdb++)
c              # Continue
```

### Function Deep Dive
```
b function_name    # Break at function
c                  # Continue to breakpoint
s                  # Step into function
a                  # Check arguments
ll                 # See entire function (pdb++)
n n n              # Step through
r                  # Return from function
```

### Sticky Mode Workflow (pdb++ only)
```
sticky             # Enable sticky mode
n n n              # Context auto-updates
                   # No need to type 'l' repeatedly!
```

### Conditional Debugging
```
b 42, user_id == 123    # Only break for specific user
c                        # Continue
p user                   # Inspect when condition met
```

### Loop Debugging
```
b 30               # Set breakpoint in loop
c                  # Hit first time
p i, result        # Check iteration variables
unt 35             # Skip to after loop
p final_result     # Check final state
```

### Post-Crash Analysis
```python
# In code:
try:
    risky_operation()
except Exception as e:
    import pdb; pdb.post_mortem()
    
# In debugger:
w                  # See where it crashed (color-coded in pdb++)
u u                # Go up frames
p variables        # Inspect state
interact           # Interactive mode to explore
```

### Modify and Continue
```
p x                # x = 10
x = 100            # Change value (pdb++)
!x = 100           # Change value (pdb)
n                  # Continue with new value
p result           # See effect
```

## 7. Display & Monitoring

### Display Expressions (Python 3.2+)
* `display expr` - Show expr every time execution stops
* `display` - Show all display expressions
* `undisplay N` - Remove display expression N

### pdb++ Track Expression
* `track expr` - Like display but better formatted
* `track` - Show all tracked expressions
* `untrack N` - Remove tracked expression

### Example Usage
```
display len(items)         # pdb
track len(items)           # pdb++ (recommended)
display current_user.name
n n n                      # Values auto-shown each step
```

## 8. pdb++ Exclusive Features

### Sticky Mode
* `sticky` - Toggle sticky mode (auto-shows context)
* Shows current position, full function context
* Updates automatically as you step

### Smart Command Mode
* No need for `!` prefix to execute Python
* Just type expressions directly
* Tab completion everywhere

### Enhanced Output
* Syntax highlighting for code
* Color-coded stack traces
* Smart truncation of long outputs
* Better formatting for complex objects

### Editor Integration
* `edit` - Open current file in editor
* `edit obj` - Open file containing obj
* Set `$EDITOR` environment variable

### Shortcuts
* `pp` is default in pdb++ (no need to type it)
* `l` shows more context by default
* Smart command history with arrow keys

## 9. Advanced Commands

### Aliases (Both)
* `alias` - Show all aliases
* `alias name command` - Create alias
  ```
  alias pl pp locals()
  alias pg pp globals()
  alias st sticky
  ```

### Execution Control
* `run args` - Restart program with args
* `q` (quit) - Exit debugger
* `exit` - Same as quit
* `EOF` (Ctrl+D) - Exit debugger

### Help System
* `h` - Show all commands
* `h command` - Show help for specific command

### pdb++ History
* Arrow keys - Navigate command history
* Ctrl+R - Reverse search history
* Better than standard pdb history

## 10. Common Patterns

### Debug Specific Condition
```python
# In code:
for item in items:
    if item.id == target_id:
        breakpoint()  # Only break for specific item
    process(item)
```

### Debug Recursion
```
b recursive_func
c                  # First call
w                  # See stack depth (color in pdb++)
p depth            # Check depth variable
c c c              # Continue deeper
w                  # See how deep
```

### Debug Class Methods
```
b ClassName.method_name
c
self               # Inspect instance (pdb++)
p self             # Inspect instance (pdb)
self.__dict__      # All instance variables (pdb++)
pp vars(self)      # Pretty print all (pdb)
```

### Quick Expression Testing
```
interact           # Start interpreter
x = complicated_expression()
print(x)
# Test multiple things
exit()             # Back to debugger
```

### pdb++ Rapid Development
```
sticky             # Enable context view
n n n              # Step through with auto-context
obj.<Tab>          # Explore with completion
edit               # Fix code in editor
run                # Re-run with changes
```

## 11. Quick Reference Card

### Most Used Commands
```
n        - Next line
s        - Step into
c        - Continue
b N      - Breakpoint at line N
p var    - Print variable (pdb)
var      - Print variable (pdb++)
pp var   - Pretty print
w        - Where am I? (stack)
l        - List source
ll       - List entire function
u/d      - Up/down stack
q        - Quit

# pdb++ only:
sticky   - Toggle sticky mode
track    - Monitor expression
edit     - Open in editor
```

### Investigation Workflow
```
1. breakpoint()          # Add to code
2. Run script
3. sticky                # Enable context (pdb++)
4. w                     # Where am I?
5. variable              # Inspect (pdb++)
6. p variable            # Inspect (pdb)
7. n n n                 # Step through
8. c                     # Continue
```

### Emergency Debugging
```
# When program crashes:
python -m pdb script.py
c                        # Continue to crash
w                        # See stack trace (color in pdb++)
u                        # Go up to your code
locals()                 # See what went wrong (pdb++)
p locals()               # See what went wrong (pdb)
```

## 12. Configuration

### pdb: `~/.pdbrc`
```python
# Pretty print by default
alias pp pp %1

# Print locals shortcut
alias pl pp locals()

# List more lines
alias ll longlist
```

### pdb++: `~/.pdbrc.py`
```python
import pdb

class Config(pdb.DefaultConfig):
    # Enable sticky mode by default
    sticky_by_default = True
    
    # Show more lines in listings
    list_lines = 20
    
    # Color scheme
    use_pygments = True
    
    # Editor command
    editor = 'vim'
    
    # Truncate long strings
    truncate_long_lines = True
```

## 13. Feature Comparison

| Feature | pdb | pdb++ |
|---------|-----|-------|
| Syntax highlighting | ❌ | ✅ |
| Tab completion | ❌ | ✅ |
| Sticky mode | ❌ | ✅ |
| Smart stepping | ❌ | ✅ |
| `!` prefix needed | ✅ | ❌ |
| Color output | ❌ | ✅ |
| Edit command | ❌ | ✅ |
| Track expressions | ❌ | ✅ |
| Better history | ❌ | ✅ |

## 14. Tips & Tricks

### Avoid Naming Conflicts (pdb)
```
# BAD: variable named 'c' conflicts with continue
c = 5          # This will continue execution!

# GOOD: use print/exec syntax
!c = 5         # This works (pdb)
c = 5          # This works (pdb++)
```

### Quick Stack Navigation
```
w              # Print stack
u u u          # Up 3 frames quickly
important_var  # Check value (pdb++)
p important_var # Check value (pdb)
d d d          # Back down
```

### Breakpoint on Exception
```python
import sys
def debug_on_exception(type, value, tb):
    import pdb
    pdb.post_mortem(tb)

sys.excepthook = debug_on_exception
# Now any exception drops into debugger
```

### pdb++ Pro Tips
* Use `sticky` mode for visual debugging
* Tab completion works everywhere
* No need for `p` or `!` prefixes
* Arrow keys for command history
* `edit` to jump to editor and back

## 15. Installation & Setup

### Install pdb++
```bash
pip install pdbpp

# pdb++ automatically replaces pdb when imported
# All breakpoint() calls will use pdb++
```

### Verify Installation
```python
import pdb
print(pdb.__file__)  # Should show pdbpp location

# Or check in debugger:
breakpoint()
# Type: import pdb; pdb.__version__
```

### Use Standard pdb When Needed
```python
import pdb as pdb_original  # Before pdbpp import
# or
python -m pdb script.py  # Usually uses standard pdb
```