---
title: Python Reference Guide
date: 2025-01-13
---

## Important Functions

### 1. Built-in Functions

#### Input/Output

```python
# Print output
print("Hello World")
print("Sum:", sum)
print(f"Sum: {sum}")  # f-string formatting
print("Sum: " + str(sum))  # String concatenation

# Get user input
name = input("Enter your name: ")
number = int(input("Enter a number: "))  # Convert to integer
float_num = float(input("Enter a decimal: "))  # Convert to float
```

#### Type Conversion
```python
# Explicit type conversion
x = 5
y = 4
print(int(x))        # 5
print(float(x))      # 5.0
print(str(x))        # "5"
print(bool(x))       # True

# String to number
num_str = "123"
num = int(num_str)   # 123
float_str = "45.6"
float_num = float(float_str)  # 45.6

# Number to string
num = 42
str_num = str(num)   # "42"
```

#### Length and Range
```python
# Get length of sequence
my_list = [1, 2, 3, 4, 5]
print(len(my_list))  # 5

my_string = "Hello"
print(len(my_string))  # 5

# Range function
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 11):    # 1, 2, 3, ..., 10
    print(i)

for i in range(1, 11, 2): # 1, 3, 5, 7, 9 (step by 2)
    print(i)

for i in range(10, 0, -1): # 10, 9, 8, ..., 1 (reverse)
    print(i)
```

#### Type Checking
```python
x = 5
print(type(x))  # <class 'int'>

name = "Ahmad"
print(type(name))  # <class 'str'>
```

### 2. String Methods

```python
# Changing case
name = "Ahmad"
print(name.lower())  # "ahmad"
print(name.upper())  # "AHMAD"

# String operations
text = "Hello World"
print(text[0])       # "H" - access by index
print(text[0:5])     # "Hello" - slicing
print(text[::-1])    # "dlroW olleH" - reverse string
```

### 3. List Methods

#### Creating Lists
```python
# Empty list
my_list = []

# List with values
numbers = [1, 2, 3, 4, 5]
mixed = ["Ahmad", 25, True, 3.14]
students = ["Ali", "Ahmad", "Ameer"]
```

#### Accessing Elements
```python
my_list = [10, 20, 30, 40, 50]

# Access by index
print(my_list[0])    # 10
print(my_list[2])    # 30
print(my_list[-1])   # 50 (last element)
print(my_list[-2])   # 40 (second from last)

# Slicing
print(my_list[0:3])      # [10, 20, 30]
print(my_list[1:])      # [20, 30, 40, 50]
print(my_list[:3])      # [10, 20, 30]
print(my_list[::-1])    # [50, 40, 30, 20, 10] (reverse)
print(my_list[0:4:2])   # [10, 30] (step by 2)
```

#### Adding Elements
```python
my_list = [1, 2, 3]

# Append (add to end)
my_list.append(4)
print(my_list)  # [1, 2, 3, 4]

# Insert (add at specific position)
my_list.insert(1, 10)  # Insert 10 at index 1
print(my_list)  # [1, 10, 2, 3, 4]

# Extend (add multiple elements)
my_list.extend([5, 6])
print(my_list)  # [1, 10, 2, 3, 4, 5, 6]
```

#### Removing Elements
```python
my_list = [10, 20, 30, 40, 20]

# Remove (by value)
my_list.remove(20)  # Removes first occurrence
print(my_list)  # [10, 30, 40, 20]

# Pop (by index)
my_list.pop()       # Removes last element
print(my_list)  # [10, 30, 40]

my_list.pop(1)      # Removes element at index 1
print(my_list)  # [10, 40]

# Delete statement
del my_list[0]      # Removes element at index 0
print(my_list)  # [40]

# Clear (remove all)
my_list.clear()
print(my_list)  # []
```

#### List Operations
```python
my_list = [34, 12, 78, 4, 56]

# Sort
my_list.sort()              # Ascending order
print(my_list)  # [4, 12, 34, 56, 78]

my_list.sort(reverse=True)  # Descending order
print(my_list)  # [78, 56, 34, 12, 4]

# Reverse
my_list.reverse()
print(my_list)  # [4, 12, 34, 56, 78]

# Index (find position)
my_list = [10, 20, 30, 40]
print(my_list.index(30))  # 2

# Count (count occurrences)
my_list = [10, 20, 20, 30, 20]
print(my_list.count(20))  # 3

# Length
print(len(my_list))  # 5

# Check membership
if 20 in my_list:
    print("Found!")

# Copy
original = [1, 2, 3]
copy_list = original.copy()
copy_list.append(4)
print(original)  # [1, 2, 3]
print(copy_list)  # [1, 2, 3, 4]
```

#### List Concatenation
```python
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list1 + list2
print(combined)  # [1, 2, 3, 4, 5, 6]
```

### 4. Dictionary Methods

#### Creating Dictionaries
```python
# Empty dictionary
student = {}

# Dictionary with values
student = {
    "name": "hamza",
    "age": 17,
    "grade": "A"
}

# Dictionary with different key types
five_table = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25
}
```

#### Accessing Values
```python
student = {"name": "hamza", "age": 17, "grade": "A"}

# Access by key
print(student["name"])   # "hamza"
print(student["age"])    # 17

# Check if key exists
if "age" in student:
    print("Key exists")
```

#### Modifying Dictionaries
```python
student = {"name": "hamza", "age": 17}

# Add new key-value pair
student["grade"] = "A"
student["city"] = "FSD"

# Update existing value
student["age"] = 20

# Remove key
del student["city"]
```

#### Dictionary Methods
```python
student = {"name": "hamza", "age": 17, "grade": "A"}

# Get all keys
print(student.keys())    # dict_keys(['name', 'age', 'grade'])

# Get all values
print(student.values())  # dict_values(['hamza', 17, 'A'])

# Get all items (key-value pairs)
print(student.items())   # dict_items([('name', 'hamza'), ('age', 17), ('grade', 'A')])

# Iterate through keys
for key in student.keys():
    print(key, ":", student[key])

# Iterate through values
for value in student.values():
    print(value)

# Iterate through items
for key, value in student.items():
    print(key, ":", value)

# Length
print(len(student))  # 3
```

#### Nested Dictionaries
```python
# List of dictionaries
students = [
    {
        "name": "hamza",
        "id": "1dff42dd",
        "age": "17",
        "education": "Intermediate"
    },
    {
        "name": "Ali",
        "id": "1dfhgf2dd",
        "age": "21",
        "education": "Undergraduate"
    }
]

# Dictionary with lists
person = {
    "name": "Ali Hassan",
    "age": "20",
    "fav_games": ["PUBG", "GTA-5", "Call of duty"]
}
```

### 5. Set Methods

#### Creating Sets
```python
# Method 1: Using set() function
nums = set([1, 4, 5, 8, 10, 4])
print(nums)  # {1, 4, 5, 8, 10} (duplicates removed)

# Method 2: Using curly braces
numbers = {2, 3, 4, 5, 5, 3, 2}
print(numbers)  # {2, 3, 4, 5} (duplicates removed)

# Empty set
empty_set = set()  # Note: {} creates empty dict, not set
```

#### Set Characteristics
```python
# Sets have unique elements, unordered, and elements must be immutable
set1 = {1, 2, 3, (4, 5)}  # Tuples are allowed
# set1 = {1, 2, [3, 4]}    # Error: lists are not allowed (mutable)
```

#### Adding and Removing Elements
```python
numbers = {1, 2, 3, 4, 5}

# Add element
numbers.add(6)
print(numbers)  # {1, 2, 3, 4, 5, 6}

# Remove element (raises error if not found)
numbers.remove(3)
print(numbers)  # {1, 2, 4, 5, 6}

# Discard element (no error if not found)
numbers.discard(10)  # Safe removal
print(numbers)  # {1, 2, 4, 5, 6}

# Pop (removes random element)
popped = numbers.pop()
print(popped)  # Random element
print(numbers)

# Clear (remove all)
numbers.clear()
print(numbers)  # set()

# Check membership
if 6 in numbers:
    print("Found!")
```

#### Set Operations
```python
set1 = {1, 2, 3, 4, 5}
set2 = {3, 4, 5, 6, 7}

# Union (all unique elements from both)
print(set1 | set2)              # {1, 2, 3, 4, 5, 6, 7}
print(set1.union(set2))         # {1, 2, 3, 4, 5, 6, 7}

# Intersection (common elements)
print(set1 & set2)              # {3, 4, 5}
print(set1.intersection(set2))  # {3, 4, 5}

# Difference (elements in set1 but not in set2)
print(set1 - set2)              # {1, 2}
print(set1.difference(set2))    # {1, 2}

# Symmetric difference (elements in either but not both)
print(set1 ^ set2)                      # {1, 2, 6, 7}
print(set1.symmetric_difference(set2))  # {1, 2, 6, 7}
```

#### Set Comparisons
```python
set1 = {1, 2, 3}
set2 = {1, 2, 3, 4, 5}
set3 = {6, 7, 8}

# Subset check
print(set1.issubset(set2))   # True

# Superset check
print(set2.issuperset(set1))  # True

# Disjoint check (no common elements)
print(set1.isdisjoint(set3))  # True
```

#### Copying Sets
```python
set1 = {1, 2, 3, 4}
set2 = set1.copy()
set2.remove(4)
print(set1)  # {1, 2, 3, 4}
print(set2)  # {1, 2, 3}
```

## Operations

### 1. Mathematical Operations
```python
# Basic arithmetic
a = 10
b = 3
print(a + b)   # 13 (addition)
print(a - b)   # 7 (subtraction)
print(a * b)   # 30 (multiplication)
print(a / b)   # 3.333... (division)
print(a // b)  # 3 (floor division)
print(a % b)   # 1 (modulus)
print(a ** b)  # 1000 (exponentiation)
```

### 2. String Operations
```python
# Concatenation
first_name = "Ahmad"
last_name = "Sultan"
full_name = first_name + " " + last_name
print(full_name)  # "Ahmad Sultan"

# Repetition
print("Hello" * 3)  # "HelloHelloHello"
```

### 3. List Operations
```python
# Combine lists
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list1 + list2
print(combined)  # [1, 2, 3, 4, 5, 6]

# List repetition
repeated = [1, 2] * 3
print(repeated)  # [1, 2, 1, 2, 1, 2]
```

### 4. Type Checking and Conversion
```python
# Check type
x = 5
print(type(x) == int)  # True

# Convert types
num_str = "123"
num = int(num_str)
print(num + 1)  # 124
```

## Conditional Statements

### 1. If Statement
```python
# Basic if statement
num = 5
if num > 0:
    print("Number is positive")
```

### 2. If-Else Statement
```python
# If-else statement
num = int(input("Enter a number: "))
if num % 2 == 0:
    print("Number is even")
else:
    print("Number is odd")
```

### 3. If-Elif-Else Statement
```python
# Multiple conditions
num = 40
if num > 50:
    print("Number is greater than 50")
elif num > 30:
    print("Number is greater than 30")
else:
    print("Number is 30 or less")

# Grade system example
number = int(input("Enter your number: "))
if number >= 90:
    print("A+")
elif number >= 80:
    print("A")
elif number >= 70:
    print("B")
elif number >= 33 and number < 70:
    print("C")
else:
    print("The user is fail")

# Age classification
age = int(input("Enter your age: "))
if age < 18:
    print("You are a minor")
elif age >= 18 and age <= 50:
    print("You are an adult")
else:
    print("You are a senior citizen")

# Number classification
num = int(input("Enter a number: "))
if num > 0:
    print(num, "is positive")
elif num < 0:
    print(num, "is negative")
else:
    print(num, "is zero")
```

### 4. Nested If Statements
```python
# Nested conditionals
a = 34
if a < 40:
    print("a is smaller than 40")
    if a < 35:
        print("a is smaller than 35")
```

## Comparison Operators

### Basic Comparisons
```python
# Equality
x == y  # True if x equals y

# Inequality
x != y  # True if x does not equal y

# Less than
x < y   # True if x is less than y

# Greater than
x > y   # True if x is greater than y

# Less than or equal
x <= y  # True if x is less than or equal to y

# Greater than or equal
x >= y  # True if x is greater than or equal to y
```

### Examples
```python
num1 = 40
num2 = 5
num3 = 20

# Find largest of three numbers
if num1 > num2 and num1 > num3:
    print(num1, "is greater than", num2, "and", num3)
elif num2 > num1 and num2 > num3:
    print(num2, "is greater than", num1, "and", num3)
elif num3 > num1 and num3 > num2:
    print(num3, "is greater than", num1, "and", num2)
```

## Logical Operators

### 1. AND Operator
```python
# AND returns True only if both conditions are True
True and True   # True
True and False  # False
False and True  # False
False and False # False

# Example
if num > 0 and num < 100:
    print("Number is between 0 and 100")
```

### 2. OR Operator
```python
# OR returns True if at least one condition is True
True or True    # True
True or False   # True
False or True    # True
False or False  # False

# Example
if age < 18 or age > 65:
    print("Special category")
```

### 3. NOT Operator
```python
# NOT reverses the boolean value
not True   # False
not False  # True

# Example
if not (num % 2 == 0):
    print("Number is odd")
```

### Combined Examples
```python
# Check if number is multiple of both 3 and 5
if num % 3 == 0 and num % 5 == 0:
    print("Number is divisible by both 3 and 5")

# Check if divisible by 2, 3, or both
if num % 2 == 0 and num % 3 == 0:
    print("Divisible by both 2 and 3")
elif num % 2 == 0:
    print("Divisible by 2 only")
elif num % 3 == 0:
    print("Divisible by 3 only")
else:
    print("Not divisible by 2 or 3")
```

## Loops

### 1. For Loop

#### Basic For Loop
```python
# Loop through range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Loop with start and end
for i in range(1, 11):
    print(i)  # 1, 2, 3, ..., 10

# Loop with step
for i in range(1, 11, 2):
    print(i)  # 1, 3, 5, 7, 9

# Reverse loop
for i in range(10, 0, -1):
    print(i)  # 10, 9, 8, ..., 1
```

#### For Loop with Lists
```python
# Loop through list elements
students = ["Ali", "Ahmad", "Ameer"]
for student in students:
    print(student)

# Loop through list with index
for i in range(len(students)):
    print(students[i])

# Loop through string characters
name = "Ahmad"
for char in name:
    print(char)
```

#### Examples
```python
# Print numbers 1 to 20
for i in range(1, 21):
    print(i)

# Print even numbers 1 to 50
for i in range(2, 51, 2):
    print(i)

# Print odd numbers 1 to 100
for i in range(1, 101, 2):
    print(i)

# Print squares of numbers 1 to 10
for i in range(1, 11):
    print(i * i)

# Countdown timer
for i in range(50, -1, -1):
    print(i)
```

### 2. While Loop

#### Basic While Loop
```python
# Basic while loop
i = 1
while i <= 10:
    print(i)
    i = i + 1
```

#### While Loop Examples
```python
# Print even numbers 1 to 50
i = 1
while i <= 50:
    if i % 2 == 0:
        print(i, "is even number")
    i = i + 1

# Calculate sum of numbers 1 to 100
sum = 0
i = 1
while i <= 100:
    sum = sum + i
    i = i + 1
print("Sum:", sum)

# Factorial using while loop
factNum = 5
fac = 1
i = 5
while i >= 1:
    fac = fac * i
    i = i - 1
print("Factorial of", factNum, "is", fac)

# Guess the number game
number = 50
correct_number_found = False
while not correct_number_found:
    inputNum = int(input("Enter a number: "))
    if inputNum == number:
        correct_number_found = True
        print("Congrats. You have guessed the correct number!!!")
    else:
        print("You hit a wrong number")

# Sum of digits
num = abs(int(input("Enter any number: ")))
sum = 0
while num > 0:
    sum += num % 10
    num = num // 10
print("Sum of digits:", sum)
```

### 3. Nested Loops
```python
# Nested for loops
for i in range(5):
    for j in range(3):
        print(f"i={i}, j={j}")

# Pyramid pattern
rows = 5
for i in range(1, rows + 1):
    for j in range(i):
        print("*", end="")
    print()

# Prime numbers between 1 and 50
for num in range(2, 50):
    isPrimeNumber = True
    for i in range(2, num):
        if num % i == 0:
            isPrimeNumber = False
            break
    if isPrimeNumber:
        print(num, "is prime number")
```

## Loop Control Statements

### 1. Break Statement
```python
# Break exits the loop immediately
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# Break in while loop
i = 0
while True:
    if i == 5:
        break
    print(i)
    i += 1
```

### 2. Continue Statement
```python
# Continue skips the rest of the loop and continues to next iteration
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4

# Skip even numbers
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # 1, 3, 5, 7, 9
```

### 3. Pass Statement
```python
# Pass does nothing (placeholder)
for i in range(4):
    pass  # To-do nothing

# Placeholder for future code
if condition:
    pass  # Will implement later
```

## Range Function

### Range Syntax
```python
# range(stop) - starts from 0
range(5)        # 0, 1, 2, 3, 4

# range(start, stop) - from start to stop-1
range(1, 11)    # 1, 2, 3, ..., 10

# range(start, stop, step) - with step
range(1, 11, 2) # 1, 3, 5, 7, 9
range(10, 0, -1) # 10, 9, 8, ..., 1
```

### Range Examples
```python
# Count from 1 to 20
for i in range(1, 21):
    print(i)

# Even numbers
for i in range(2, 51, 2):
    print(i)

# Odd numbers
for i in range(1, 101, 2):
    print(i)

# Reverse countdown
for i in range(50, -1, -1):
    print(i)

# Multiplication table
num = int(input("Enter a number: "))
for i in range(1, 11):
    print(f"{num} * {i} = {num * i}")
```

## Common Patterns

### 1. Finding Maximum/Minimum
```python
# Find largest of two numbers
if num1 > num2:
    print(num1, "is larger")
else:
    print(num2, "is larger")

# Find largest of three numbers
if num1 > num2 and num1 > num3:
    largest = num1
elif num2 > num1 and num2 > num3:
    largest = num2
else:
    largest = num3
```

### 2. Checking Conditions
```python
# Check if number is in range
if num >= 10 and num <= 100:
    print("Number is in range")

# Check if character is vowel
char = input("Enter a character: ").lower()
if char in "aeiou":
    print("Vowel")
else:
    print("Consonant")
```

### 3. Accumulation Pattern
```python
# Sum of numbers
sum = 0
for i in range(1, 101):
    sum = sum + i
print("Sum:", sum)

# Product (factorial)
product = 1
for i in range(1, 6):
    product = product * i
print("Product:", product)
```

### 4. Counting Pattern
```python
# Count even numbers
count = 0
for i in range(1, 51):
    if i % 2 == 0:
        count = count + 1
print("Count of even numbers:", count)
```


## Function Basics

### 1. What are Functions?
Functions are blocks of code that perform specific tasks. They provide:
- **Reusability**: Write once, use multiple times
- **Modularity**: Break code into manageable pieces
- **Organization**: Make code easier to read and maintain

### 2. Function Definition and Calling

#### Basic Function
```python
# Function definition
def greet():
    print("Good afternoon everyone!!!")
    print("How are you doing?")
    print("Please sit down.")

# Function calling
greet()
print(".........")
greet()
```

#### Function with Parameters
```python
# Function with parameters
def sum(first_num, second_num):
    return first_num + second_num

# Function calling with arguments
result = sum(2, 5)
print(result)  # 7

# Multiple parameters
def calculate_area(length, width):
    area = length * width
    return area

print(calculate_area(5, 3))  # 15
```

#### Function with Return Value
```python
# Function that returns a value
def area_of_circle(radius):
    pi = 3.14
    area = pi * (radius ** 2)
    return area

result = area_of_circle(3)
print(result)  # 28.26
```

### 3. Parameters vs Arguments

```python
# Parameters are in function definition
def greet(name, age):  # name and age are parameters
    print(f"Hello {name}, you are {age} years old")

# Arguments are values passed when calling
greet("Ahmad", 25)  # "Ahmad" and 25 are arguments
```

## Function Types

### 1. Built-in Functions
```python
# Examples of built-in functions
print("Hello")           # Print function
len([1, 2, 3])          # Length function
input("Enter name: ")   # Input function
int("123")              # Type conversion
str(42)                 # Type conversion
range(10)               # Range function
```

### 2. User-defined Functions
```python
# User-defined function
def printCounting():
    for i in range(1, 11):
        print(i)

printCounting()  # Call the function
```

## Function Parameters

### 1. Required Parameters
```python
# All parameters are required
def add(a, b):
    return a + b

# Must provide both arguments
result = add(5, 3)  # 8
# result = add(5)    # Error: missing required argument
```

### 2. Default Parameters
```python
# Parameters with default values
def greet(name, message="Hello"):
    print(f"{message}, {name}")

greet("Ahmad")              # "Hello, Ahmad"
greet("Ahmad", "Hi")        # "Hi, Ahmad"

# Default parameter example
def sum(first_num, second_num=10):
    return first_num + second_num

print(sum(5))      # 15 (uses default 10)
print(sum(5, 20))  # 25 (overrides default)
```

### 3. Multiple Default Parameters
```python
def calculate(num1, num2=5, num3=10):
    return num1 + num2 + num3

print(calculate(2))        # 17 (2 + 5 + 10)
print(calculate(2, 3))     # 15 (2 + 3 + 10)
print(calculate(2, 3, 4))  # 9 (2 + 3 + 4)
```

## Return Values

### 1. Single Return Value
```python
def square(num):
    return num * num

result = square(5)
print(result)  # 25
```

### 2. Multiple Return Values
```python
def get_name_and_age():
    name = "Ahmad"
    age = 25
    return name, age

name, age = get_name_and_age()
print(name)  # "Ahmad"
print(age)   # 25
```

### 3. No Return Value
```python
# Functions without return statement return None
def print_message():
    print("This function doesn't return anything")

result = print_message()  # Prints message
print(result)  # None
```

## Function Scope

### 1. Local Scope
```python
# Variables inside function are local
def my_function():
    x = 10  # Local variable
    print(x)

my_function()
# print(x)  # Error: x is not defined outside function
```

### 2. Global Scope
```python
# Variables outside function are global
y = 20  # Global variable

def my_function():
    print(y)  # Can access global variable

my_function()  # 20
print(y)       # 20
```

### 3. Local vs Global
```python
y = "20"  # Global variable

def greet():
    x = "10"  # Local variable
    print("Good afternoon everyone!!!")
    print("How are you doing?")

greet()
print(y)  # Can access global y
# print(x)  # Error: x is local to greet function
```

### 4. Modifying Global Variables
```python
count = 0  # Global variable

def increment():
    global count  # Declare we want to use global variable
    count += 1

increment()
print(count)  # 1
```

## Nested Functions

### 1. Function Inside Function
```python
def outer_function():
    def inner_function():
        print("This is inner function")
    
    print("This is outer function")
    inner_function()  # Call inner function

outer_function()

# inner_function()  # Error: inner function is not accessible outside
```

### 2. Nested Function with Parameters
```python
def area_of_circle(r=3):
    pi = 3.14
    
    def displayPi(p):
        print(p)
    
    displayPi(pi)  # Call nested function
    return 2 * pi * (r ** 2)

result = area_of_circle(5)
print(result)
```

## Common Function Patterns

### 1. Calculate Area
```python
def area_of_circle(radius):
    pi = 3.14
    area = pi * (radius ** 2)
    return area

print(area_of_circle(3))  # 28.26
```

### 2. Check Conditions
```python
def is_even(num):
    if num % 2 == 0:
        return True
    else:
        return False

print(is_even(4))  # True
print(is_even(5))  # False
```

### 3. Process Strings
```python
def findVowels(str):
    count = 0
    for ch in str:
        if ch in "aeiou":
            count = count + 1
    return count

print(findVowels("hello"))  # 2
```

### 4. Calculate Factorial
```python
def factorial(num):
    result = 1
    while num > 0:
        result = result * num
        num = num - 1
    return result

print(factorial(5))  # 120
```

## Recursion

### 1. Basic Recursion
```python
# Recursive function calls itself
def countdown(n):
    if n <= 0:
        print("Done!")
    else:
        print(n)
        countdown(n - 1)  # Recursive call

countdown(5)
```

### 2. Factorial Using Recursion
```python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)  # Recursive call

print(factorial(5))  # 120
```

### 3. Fibonacci Using Recursion
```python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)  # Recursive calls

print(fibonacci(6))  # 8
```

## Function Best Practices

### 1. Descriptive Names
```python
# Good: descriptive name
def calculate_circle_area(radius):
    return 3.14 * radius ** 2

# Bad: unclear name
def calc(r):
    return 3.14 * r ** 2
```

### 2. Single Responsibility
```python
# Good: each function does one thing
def get_user_name():
    return input("Enter your name: ")

def greet_user(name):
    print(f"Hello, {name}")

# Bad: function does multiple things
def get_and_greet():
    name = input("Enter your name: ")
    print(f"Hello, {name}")
```

### 3. Document with Comments
```python
def area_of_circle(radius):
    """
    Calculate the area of a circle.
    
    Parameters:
    radius (float): The radius of the circle
    
    Returns:
    float: The area of the circle
    """
    pi = 3.14
    area = pi * (radius ** 2)
    return area
```

## Common Function Examples

### 1. Sum Function
```python
def sum(a, b, c=0):
    return a + b + c

print(sum(1, 2))     # 3
print(sum(1, 2, 3))  # 6
```

### 2. Maximum Function
```python
def find_max(a, b):
    if a > b:
        return a
    else:
        return b

print(find_max(10, 5))  # 10
```

### 3. Check Prime
```python
def is_prime(num):
    if num < 2:
        return False
    for i in range(2, num):
        if num % i == 0:
            return False
    return True

print(is_prime(7))   # True
print(is_prime(10))  # False
```


## Lists

### 1. Creating Lists

#### Basic Creation
```python
# Empty list
my_list = []

# List with values
numbers = [1, 2, 3, 4, 5]
names = ["Ali", "Ahmad", "Ameer"]
mixed = ["Ahmad", 25, True, 3.14, "FSD"]

# List from string
char_list = list("Ahmad")  # ['A', 'h', 'm', 'a', 'd']
```

### 2. Accessing Elements

#### Indexing
```python
students = ["Ali", "Ahmad", "Ameer", 56, 72, 32]

# Positive indexing (from start)
print(students[0])  # "Ali"
print(students[1])  # "Ahmad"
print(students[2])  # "Ameer"

# Negative indexing (from end)
print(students[-1])  # 32 (last element)
print(students[-2])  # 72 (second from last)
print(students[-3])  # 56
```

#### Slicing
```python
students = ["Ali", "Ahmad", "Ameer", 56, 72, 32]

# Basic slicing: list[start:end:step]
print(students[0:3])      # ["Ali", "Ahmad", "Ameer"]
print(students[3:])       # [56, 72, 32]
print(students[:3])       # ["Ali", "Ahmad", "Ameer"]
print(students[0:4:2])   # ["Ali", "Ameer"] (step by 2)
print(students[::-1])    # [32, 72, 56, "Ameer", "Ahmad", "Ali"] (reverse)
```

### 3. Modifying Lists

#### Changing Elements
```python
students = ["Ali", "Ahmad", "Ameer"]
students[2] = "Amir"  # Change element at index 2
print(students)  # ["Ali", "Ahmad", "Amir"]
```

#### Adding Elements
```python
students = ["Ali", "Ahmad", "Ameer"]

# Append (add to end)
students.append(56)
students.append(42)
print(students)  # ["Ali", "Ahmad", "Ameer", 56, 42]

# Insert (add at specific position)
students.insert(2, "Azam")  # Insert at index 2
print(students)  # ["Ali", "Ahmad", "Azam", "Ameer", 56, 42]

# Extend (add multiple elements)
students.extend([100, 200])
print(students)  # Adds 100 and 200 to the end
```

#### Removing Elements
```python
students = ["Ali", "Ahmad", "Ameer", 32, 56]

# Remove (by value)
students.remove(32)  # Removes first occurrence of 32
print(students)  # ["Ali", "Ahmad", "Ameer", 56]

# Pop (by index)
students.pop(2)  # Removes element at index 2
print(students)  # ["Ali", "Ahmad", 56]

students.pop()  # Removes last element
print(students)  # ["Ali", "Ahmad"]

# Delete statement
del students[1]  # Removes element at index 1
print(students)  # ["Ali"]

# Clear (remove all)
students.clear()
print(students)  # []
```

### 4. List Methods

#### Sorting
```python
# Sort in ascending order
nums = [34, 12, 78, 4, 56]
nums.sort()
print(nums)  # [4, 12, 34, 56, 78]

# Sort in descending order
nums.sort(reverse=True)
print(nums)  # [78, 56, 34, 12, 4]

# Sort strings
names = ["Zaka", "Ali", "Babu", "Ahmad"]
names.sort()
print(names)  # ["Ahmad", "Ali", "Babu", "Zaka"]
```

#### Reversing
```python
nums = [1, 2, 3, 4, 5]
nums.reverse()
print(nums)  # [5, 4, 3, 2, 1]
```

#### Finding Elements
```python
student_data = ["Ali", 22, 22, 22, "FSD"]

# Index (find position)
print(student_data.index(22))  # 1 (first occurrence)

# Count (count occurrences)
print(student_data.count(22))  # 3
```

#### Length and Membership
```python
students = ["Ali", "Ahmad", "Ameer"]

# Length
print(len(students))  # 3

# Membership check
if "Ahmad" in students:
    print("Found!")

if 50 not in students:
    print("Not found")
```

### 5. Copying Lists

#### Shallow Copy
```python
# Using copy() method
original = [1, 2, 3, 4, 5]
copy_list = original.copy()
copy_list.append(6)
print(original)   # [1, 2, 3, 4, 5]
print(copy_list)  # [1, 2, 3, 4, 5, 6]

# Using slicing
copy_list2 = original[:]
copy_list2.append(7)
print(original)    # [1, 2, 3, 4, 5]
print(copy_list2)  # [1, 2, 3, 4, 5, 7]
```

### 6. List Operations

#### Concatenation
```python
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list1 + list2
print(combined)  # [1, 2, 3, 4, 5, 6]
```

#### Repetition
```python
repeated = [1, 2] * 3
print(repeated)  # [1, 2, 1, 2, 1, 2]
```

### 7. Iterating Through Lists

#### For Loop
```python
students = ["Ali", "Ahmad", "Ameer"]

# Iterate through elements
for student in students:
    print(student)

# Iterate with index
for i in range(len(students)):
    print(students[i])

# Iterate with enumerate
for index, student in enumerate(students):
    print(f"Index {index}: {student}")
```

#### While Loop
```python
students = ["Ali", "Ahmad", "Ameer"]
index = 0
while index < len(students):
    print(students[index])
    index = index + 1
```

### 8. List Comprehensions

```python
# Create list of squares
squares = [x**2 for x in range(1, 11)]
print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# Create list of even numbers
evens = [x for x in range(1, 21) if x % 2 == 0]
print(evens)  # [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

# Flatten nested list
nested = [[1, 2], [3, 4], [5, 6]]
flat = [item for sublist in nested for item in sublist]
print(flat)  # [1, 2, 3, 4, 5, 6]
```

### 9. Nested Lists

```python
# 2D list (matrix)
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Access elements
print(matrix[0][0])  # 1
print(matrix[1][2])  # 6

# Iterate through nested list
for row in matrix:
    for element in row:
        print(element)
```

## Dictionaries

### 1. Creating Dictionaries

#### Basic Creation
```python
# Empty dictionary
student = {}

# Dictionary with values
student = {
    "name": "hamza",
    "age": 17,
    "grade": "A",
    "education": "Intermediate"
}

# Dictionary with different key types
five_table = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25
}

# Dictionary with tuple keys
table = {
    (1, 2): 5,
    2: 10,
    3: 15
}
```

### 2. Accessing Values

#### Basic Access
```python
student = {"name": "hamza", "age": 17, "grade": "A"}

# Access by key
print(student["name"])   # "hamza"
print(student["age"])    # 17
print(student["grade"])  # "A"

# Check if key exists
if "age" in student:
    print("Key exists")
    print(student["age"])
```

### 3. Modifying Dictionaries

#### Adding and Updating
```python
student = {"name": "hamza", "age": 17}

# Add new key-value pair
student["grade"] = "A"
student["city"] = "FSD"

# Update existing value
student["age"] = 20

print(student)  # {"name": "hamza", "age": 20, "grade": "A", "city": "FSD"}
```

#### Removing Elements
```python
student = {"name": "hamza", "age": 17, "city": "FSD"}

# Remove key
del student["city"]
print(student)  # {"name": "hamza", "age": 17}
```

### 4. Dictionary Methods

#### Keys, Values, Items
```python
student = {"name": "hamza", "age": 17, "grade": "A"}

# Get all keys
print(student.keys())    # dict_keys(['name', 'age', 'grade'])

# Get all values
print(student.values())  # dict_values(['hamza', 17, 'A'])

# Get all items (key-value pairs)
print(student.items())   # dict_items([('name', 'hamza'), ('age', 17), ('grade', 'A')])
```

#### Iterating Through Dictionaries
```python
student = {"name": "hamza", "age": 17, "grade": "A"}

# Iterate through keys
for key in student.keys():
    print(key, ":", student[key])

# Iterate through values
for value in student.values():
    print("value ->", value)

# Iterate through items
for key, value in student.items():
    print(key, ":", value)
```

### 5. Nested Dictionaries

#### Dictionary of Dictionaries
```python
# List of dictionaries
students = [
    {
        "name": "hamza",
        "id": "1dff42dd",
        "age": "17",
        "education": "Intermediate",
        "programming_skills": "Python"
    },
    {
        "name": "Ali",
        "id": "1dfhgf2dd",
        "age": "21",
        "education": "Undergraduate",
        "programming_skills": "Python, Java, C++"
    }
]

# Access nested dictionary
for student in students:
    print(student["name"])
    print(student["age"])
```

#### Dictionary with Lists
```python
person = {
    "name": "Ali Hassan",
    "age": "20",
    "fav_games": ["PUBG", "GTA-5", "Call of duty", "Ludo", "Free-fire"],
    "fav_movies": ["shutter_island", "iron_man", "game_of_throne"]
}

# Access list in dictionary
print(person["fav_games"][0])  # "PUBG"
```

### 6. Dictionary Operations

#### Length
```python
student = {"name": "hamza", "age": 17, "grade": "A"}
print(len(student))  # 3
```

#### Copying
```python
original = {"a": 1, "b": 2}
copy_dict = original.copy()
copy_dict["c"] = 3
print(original)   # {"a": 1, "b": 2}
print(copy_dict)  # {"a": 1, "b": 2, "c": 3}
```

## Sets

### 1. Creating Sets

#### Basic Creation
```python
# Method 1: Using set() function
set1 = set([1, 4, 5, 8, 10, 4])
print(set1)  # {1, 4, 5, 8, 10} (duplicates removed)

# Method 2: Using curly braces
set2 = {2, 3, 4, 5, 5, 3, 2}
print(set2)  # {2, 3, 4, 5} (duplicates removed)

# Empty set
empty_set = set()  # Note: {} creates empty dict, not set
```

### 2. Set Characteristics

```python
# Sets have:
# 1. Unique elements (no duplicates)
# 2. Unordered elements
# 3. Immutable elements (but set itself is mutable)
# 4. Set itself is mutable

# Valid set elements (immutable types)
valid_set = {1, 2, 3, (4, 5), "hello"}  # Numbers, tuples, strings

# Invalid set elements (mutable types)
# invalid_set = {1, 2, [3, 4]}  # Error: lists are mutable
```

### 3. Set Methods

#### Adding and Removing
```python
numbers = {1, 2, 3, 4, 5}

# Add element
numbers.add(6)
print(numbers)  # {1, 2, 3, 4, 5, 6}

# Remove element (raises error if not found)
numbers.remove(3)
print(numbers)  # {1, 2, 4, 5, 6}

# Discard element (no error if not found)
numbers.discard(10)  # Safe removal
print(numbers)  # {1, 2, 4, 5, 6}

# Pop (removes random element)
popped = numbers.pop()
print(popped)  # Random element
print(numbers)

# Clear (remove all)
numbers.clear()
print(numbers)  # set()
```

#### Set Operations
```python
set1 = {1, 2, 3, 4, 5}
set2 = {3, 4, 5, 6, 7}

# Union (all unique elements from both)
print(set1 | set2)              # {1, 2, 3, 4, 5, 6, 7}
print(set1.union(set2))         # {1, 2, 3, 4, 5, 6, 7}

# Intersection (common elements)
print(set1 & set2)              # {3, 4, 5}
print(set1.intersection(set2))  # {3, 4, 5}

# Difference (elements in set1 but not in set2)
print(set1 - set2)              # {1, 2}
print(set1.difference(set2))   # {1, 2}

# Symmetric difference (elements in either but not both)
print(set1 ^ set2)                      # {1, 2, 6, 7}
print(set1.symmetric_difference(set2))  # {1, 2, 6, 7}
```

#### Set Comparisons
```python
set1 = {1, 2, 3}
set2 = {1, 2, 3, 4, 5}
set3 = {6, 7, 8}

# Subset check
print(set1.issubset(set2))   # True

# Superset check
print(set2.issuperset(set1))  # True

# Disjoint check (no common elements)
print(set1.isdisjoint(set3))  # True
```

#### Copying Sets
```python
set1 = {1, 2, 3, 4}
set2 = set1.copy()
set2.remove(4)
print(set1)  # {1, 2, 3, 4}
print(set2)  # {1, 2, 3}
```

### 4. Set Membership

```python
numbers = {1, 2, 3, 4, 5}

# Check membership
if 3 in numbers:
    print("Found!")

if 10 not in numbers:
    print("Not found")
```

## Tuples

### 1. Creating Tuples

```python
# Tuple with values
my_tuple = (1, 2, 3, 4, 5)

# Single element tuple (note the comma)
single = (5,)  # Not (5) which is just an integer

# Empty tuple
empty = ()
```

### 2. Tuple Characteristics

```python
# Tuples are:
# 1. Immutable (cannot be changed)
# 2. Ordered
# 3. Allow duplicates

my_tuple = (1, 2, 3)
# my_tuple[0] = 10  # Error: tuples are immutable
```

### 3. Accessing Tuple Elements

```python
my_tuple = (1, 2, 3, 4, 5)

# Indexing
print(my_tuple[0])   # 1
print(my_tuple[-1])  # 5

# Slicing
print(my_tuple[1:4])  # (2, 3, 4)
```

## Common Patterns

### 1. Removing Duplicates
```python
# Using set
numbers = [10, 20, 20, 30, 40, 10, 50]
unique = list(set(numbers))
print(unique)  # [10, 20, 30, 40, 50]
```

### 2. Counting Occurrences
```python
# Using dictionary
text = "hello world hello python world"
words = text.split()
count = {}
for word in words:
    count[word] = count.get(word, 0) + 1
print(count)  # {'hello': 2, 'world': 2, 'python': 1}
```

### 3. Finding Maximum/Minimum
```python
# In list
numbers = [23, 45, 12, 78, 34, 89]
print(max(numbers))  # 89
print(min(numbers))  # 12

# In dictionary (by value)
scores = {'a': 10, 'b': 15, 'c': 7}
max_key = max(scores, key=scores.get)
print(max_key)  # 'b'
```

