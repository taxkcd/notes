---
title: Python Assignments Reference - Complete Solutions
date: 2025-01-13
---

## Overview

This document contains **ALL** Python assignment solutions in a single master file. Every question and its complete solution code is included here.

**Total Questions: 176**
- Section A PY Ass1: 40 questions (20 Conditionals + 20 Loops)
- Section A PY Ass2: 33 questions (Functions)
- Section B PY Ass1: 40 questions (same as Section A)
- Section B PY Ass2: 33 questions (same as Section A)
- Section B PY Ass3: 30 questions (Dictionaries)

---

## Section A - PY Ass1: Conditional Statements & Loops

### Part 1: Conditional Statements (20 Questions)

#### Q1: Q1.py

```python
# Write a program that checks if a given number is positive, negative, or zero.

num = int(input("Enter a number: "))

if num > 0:
    print(num, " is positive.")
elif num < 0:
    print(num, " is negative.")
else:
    print(num, " is zero.")

```

---

#### Q2: Q2.py

```python
# Take a user's age as input and display whether they are a minor, adult, or senior citizen.

age = int(input("Enter your age: "))

if age < 18:
    print("You are a minor.")
elif age >= 18 and age <= 50:
    print("You are an adult.")
else:
    print("You are a senior citizen.")

```

---

#### Q3: Q3.py

```python
# Write a program that checks if a given year is a leap year.

year = int(input("Enter a year: "))

# A year is a leap year if:
# 1. It is divisible by 4, but not by 100, OR
# 2. It is divisible by 400
if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print(year, "is a leap year.")
else:
    print(year, "is not a leap year.")

```

---

#### Q4: Q4.py

```python
# Take an integer and check if it's even or odd.

num = int(input("Enter an integer: "))

if num % 2 == 0:
    print(num, "is even.")
else:
    print(num, "is odd.")

```

---

#### Q5: Q5.py

```python
# Ask the user for a grade percentage and display the corresponding letter grade (A, B, C, D, F).

percentage = float(input("Enter your grade percentage: "))

if percentage >= 90:
    print("Grade: A")
elif percentage >= 80:
    print("Grade: B")
elif percentage >= 70:
    print("Grade: C")
elif percentage >= 60:
    print("Grade: D")
else:
    print("Grade: F")

```

---

#### Q6: Q6.py

```python
# Write a program to find the largest of two numbers.

num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

if num1 > num2:
    print(num1, "is the largest.")
elif num2 > num1:
    print(num2, "is the largest.")
else:
    print("Both numbers are equal.")

```

---

#### Q7: Q7.py

```python
# Write a program to find the largest of three numbers.

n1 = float(input("Enter first number: "))
n2 = float(input("Enter second number: "))
n3 = float(input("Enter third number: "))

if n1 > n2 and n1 > n3:
    print(n1, "is the largest.")
elif n2 > n1 and n2 > n3:
    print(n2, "is the largest.")
else:
    print(n3, "is the largest.")

```

---

#### Q8: Q8.py

```python
# Create a program that checks if a given string is a palindrome.

text = input("Enter a string: ")

# Remove spaces and convert to lowercase for comparison
text_clean = text.replace(" ", "").lower()

# Check if string is equal to its reverse
if text_clean == text_clean[::-1]:
    print(text, "is a palindrome.")
else:
    print(text, "is not a palindrome.")

```

---

#### Q9: Q9.py

```python
# Take three sides of a triangle as input and check if they form a valid triangle.

side1 = float(input("Enter first side: "))
side2 = float(input("Enter second side: "))
side3 = float(input("Enter third side: "))

# Triangle inequality: sum of any two sides must be greater than the third side
if (side1 + side2 > side3) and (side2 + side3 > side1) and (side1 + side3 > side2):
    print("These sides form a valid triangle.")
else:
    print("These sides do not form a valid triangle.")

```

---

#### Q10: Q10.py

```python
# Write a program to determine if a given character is a vowel or consonant.

char = input("Enter a character: ").lower()

# Check if it's a single character
if len(char) != 1:
    print("Please enter a single character.")
elif char in "aeiou":
    print(char, "is a vowel.")
elif char.isalpha():
    print(char, "is a consonant.")
else:
    print("Please enter an alphabetic character.")

```

---

#### Q11: Q11.py

```python
# Check if a given number is a multiple of both 3 and 5.

num = int(input("Enter a number: "))

if num % 3 == 0 and num % 5 == 0:
    print(num, "is a multiple of both 3 and 5.")
else:
    print(num, "is not a multiple of both 3 and 5.")

```

---

#### Q12: Q12.py

```python
# Write a program that takes a temperature in Celsius and checks if it's freezing, moderate, or hot.

temp = float(input("Enter temperature in Celsius: "))

if temp <= 0:
    print("It's freezing.")
elif temp > 0 and temp <= 25:
    print("It's moderate.")
else:
    print("It's hot.")

```

---

#### Q13: Q13.py

```python
# Take two numbers and an operator (+, -, *, /) as input and perform the corresponding operation.

num1 = float(input("Enter first number: "))
operator = input("Enter operator (+, -, *, /): ")
num2 = float(input("Enter second number: "))

if operator == "+":
    result = num1 + num2
    print(num1, "+", num2, "=", result)
elif operator == "-":
    result = num1 - num2
    print(num1, "-", num2, "=", result)
elif operator == "*":
    result = num1 * num2
    print(num1, "*", num2, "=", result)
elif operator == "/":
    if num2 != 0:
        result = num1 / num2
        print(num1, "/", num2, "=", result)
    else:
        print("Error: Division by zero is not allowed.")
else:
    print("Invalid operator. Please use +, -, *, or /.")

```

---

#### Q14: Q14.py

```python
# Check if a year input by the user is a century year.

year = int(input("Enter a year: "))

if year % 100 == 0:
    print(year, "is a century year.")
else:
    print(year, "is not a century year.")

```

---

#### Q15: Q15.py

```python
# Write a program to check if a number is within a specified range.

num = float(input("Enter a number: "))
lower = float(input("Enter lower bound of range: "))
upper = float(input("Enter upper bound of range: "))

if num >= lower and num <= upper:
    print(num, "is within the range [", lower, ",", upper, "]")
else:
    print(num, "is not within the range [", lower, ",", upper, "]")

```

---

#### Q16: Q16.py

```python
# Take the length of three sides and classify the triangle (equilateral, isosceles, or scalene).

side1 = float(input("Enter first side: "))
side2 = float(input("Enter second side: "))
side3 = float(input("Enter third side: "))

# Check if valid triangle first
if (side1 + side2 > side3) and (side2 + side3 > side1) and (side1 + side3 > side2):
    if side1 == side2 == side3:
        print("Equilateral triangle (all sides equal).")
    elif side1 == side2 or side2 == side3 or side1 == side3:
        print("Isosceles triangle (two sides equal).")
    else:
        print("Scalene triangle (all sides different).")
else:
    print("These sides do not form a valid triangle.")

```

---

#### Q17: Q17.py

```python
# Write a program that asks for an integer and checks if it's divisible by 2, 3, or both.

num = int(input("Enter an integer: "))

divisible_by_2 = num % 2 == 0
divisible_by_3 = num % 3 == 0

if divisible_by_2 and divisible_by_3:
    print(num, "is divisible by both 2 and 3.")
elif divisible_by_2:
    print(num, "is divisible by 2 only.")
elif divisible_by_3:
    print(num, "is divisible by 3 only.")
else:
    print(num, "is not divisible by 2 or 3.")

```

---

#### Q18: Q18.py

```python
# Take a user's score and determine if they pass or fail (pass if 50 or above).

score = float(input("Enter your score: "))

if score >= 50:
    print("You passed!")
else:
    print("You failed.")

```

---

#### Q19: Q19.py

```python
# Check if a string input is uppercase, lowercase, or a mix.

text = input("Enter a string: ")

if text.isupper():
    print("The string is uppercase.")
elif text.islower():
    print("The string is lowercase.")
else:
    print("The string is a mix of uppercase and lowercase.")

```

---

#### Q20: Q20.py

```python
# Create a program that evaluates if an inputted number is prime.

num = int(input("Enter a number: "))

if num < 2:
    print(num, "is not a prime number.")
else:
    is_prime = True
    for i in range(2, num):
        if num % i == 0:
            is_prime = False
            break
    
    if is_prime:
        print(num, "is a prime number.")
    else:
        print(num, "is not a prime number.")

```

---

### Part 2: Loops (20 Questions)

#### Q1: Q1.py

```python
# Print numbers from 1 to 20 using a for loop.

for i in range(1, 21):
    print(i)

```

---

#### Q2: Q2.py

```python
# Use a while loop to print even numbers from 1 to 50.

i = 1
while i <= 50:
    if i % 2 == 0:
        print(i, "is even number.")
    i = i + 1

```

---

#### Q3: Q3.py

```python
# Write a program to calculate the sum of all numbers between 1 and 100.

sum = 0
for i in range(1, 101):
    sum = sum + i

print("Sum of numbers from 1 to 100:", sum)

```

---

#### Q4: Q4.py

```python
# Print the multiplication table of a given number.

inputNum = int(input("Enter any number: "))

for i in range(1, 11):
    print(inputNum, "*", i, ":", inputNum * i)

```

---

#### Q5: Q5.py

```python
# Print all odd numbers between 1 and 100 using a loop.

for i in range(1, 101, 2):
    print(i)

# Alternative using if condition
# for i in range(1, 101):
#     if i % 2 != 0:
#         print(i)

```

---

#### Q6: Q6.py

```python
# Use a for loop to print each character of a string.

text = input("Enter a string: ")

for char in text:
    print(char)

```

---

#### Q7: Q7.py

```python
# Find the factorial of a number using a while loop.

factNum = int(input("Enter a number: "))
fac = 1
i = factNum

while i >= 1:
    fac = fac * i
    i = i - 1

print("Factorial of", factNum, "is", fac)

```

---

#### Q8: Q8.py

```python
# Use a for loop to print numbers from 10 down to 1.

for i in range(10, 0, -1):
    print(i)

```

---

#### Q9: Q9.py

```python
# Write a program to print the first 10 Fibonacci numbers.

# Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
a, b = 0, 1
print(a)
print(b)

for i in range(2, 10):
    next_num = a + b
    print(next_num)
    a = b
    b = next_num

```

---

#### Q10: Q10.py

```python
# Use a loop to count the number of digits in an integer.

num = abs(int(input("Enter an integer: ")))
count = 0

if num == 0:
    count = 1
else:
    while num > 0:
        count = count + 1
        num = num // 10

print("Number of digits:", count)

```

---

#### Q11: Q11.py

```python
# Print the reverse of a given number.

num = abs(int(input("Enter a number: ")))
reversed_num = 0

while num > 0:
    digit = num % 10
    reversed_num = reversed_num * 10 + digit
    num = num // 10

print("Reversed number:", reversed_num)

```

---

#### Q12: Q12.py

```python
# Print all prime numbers between 1 and 50.

for num in range(2, 50):
    isPrimeNumber = True
    
    for i in range(2, num):
        if num % i == 0:
            isPrimeNumber = False
            break
    
    if isPrimeNumber:
        print(num, "is prime number")

```

---

#### Q13: Q13.py

```python
# Use nested loops to print a pyramid pattern of *.

rows = int(input("Enter number of rows: "))

for i in range(1, rows + 1):
    # Print spaces for alignment
    for j in range(rows - i):
        print(" ", end="")
    # Print stars
    for j in range(2 * i - 1):
        print("*", end="")
    print()  # New line after each row

```

---

#### Q14: Q14.py

```python
# Write a program that breaks the loop when a certain condition is met.

target = 7

for i in range(1, 20):
    print(i)
    if i == target:
        print("Target reached! Breaking loop.")
        break

print("Loop ended.")

```

---

#### Q15: Q15.py

```python
# Print the sum of even and odd numbers separately up to a given number.

n = int(input("Enter a number: "))
even_sum = 0
odd_sum = 0

for i in range(1, n + 1):
    if i % 2 == 0:
        even_sum = even_sum + i
    else:
        odd_sum = odd_sum + i

print("Sum of even numbers:", even_sum)
print("Sum of odd numbers:", odd_sum)

```

---

#### Q16: Q16.py

```python
# Create a program to calculate the sum of the digits of an inputted integer.

num = abs(int(input("Enter any number: ")))
sum = 0

while num > 0:
    sum += num % 10
    num = num // 10

print("Sum of digits:", sum)

```

---

#### Q17: Q17.py

```python
# Write a program that continues to ask for a number until the correct number is guessed.

correct_number = 50
correct_number_found = False

while not correct_number_found:
    inputNum = int(input("Enter a number: "))
    if inputNum == correct_number:
        correct_number_found = True
        print("Congrats. You have guessed the correct number!!!")
    else:
        print("You hit a wrong number. Try again.")

```

---

#### Q18: Q18.py

```python
# Use a loop to print numbers in reverse order within a given range.

start = int(input("Enter start number: "))
end = int(input("Enter end number: "))

# Print numbers in reverse order
for i in range(end, start - 1, -1):
    print(i)

```

---

#### Q19: Q19.py

```python
# Use a for loop to print the square of each number from 1 to 10.

for i in range(1, 11):
    print(i, "squared =", i * i)

```

---

#### Q20: Q20.py

```python
# Create a program that simulates a countdown timer starting from a given number down to zero.

start_num = int(input("Enter starting number: "))

for i in range(start_num, -1, -1):
    print(i)

print("Countdown complete!")

```

---

## Section A - PY Ass2: Functions

### Basic Function Questions (6 Questions)

#### Basic Q1: Basic_Q1.py

```python
# Basic Function Questions
# 1. Write a function to calculate the area of a circle given its radius.

def area_of_circle(radius):
    pi = 3.14
    area = pi * (radius ** 2)
    return area

# Test the function
radius = float(input("Enter the radius: "))
result = area_of_circle(radius)
print("Area of circle:", result)

```

---

#### Basic Q2: Basic_Q2.py

```python
# Basic Function Questions
# 2. Create a function that takes two numbers and returns their sum.

def sum_numbers(num1, num2):
    return num1 + num2

# Test the function
a = float(input("Enter first number: "))
b = float(input("Enter second number: "))
result = sum_numbers(a, b)
print("Sum:", result)

```

---

#### Basic Q3: Basic_Q3.py

```python
# Basic Function Questions
# 3. Write a function to find the factorial of a number using recursion.

def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)

# Test the function
num = int(input("Enter a number: "))
result = factorial(num)
print(f"Factorial of {num} is {result}")

```

---

#### Basic Q4: Basic_Q4.py

```python
# Basic Function Questions
# 4. Write a function that takes a string and returns it reversed.

def reverse_string(text):
    return text[::-1]

# Test the function
text = input("Enter a string: ")
reversed_text = reverse_string(text)
print("Reversed string:", reversed_text)

```

---

#### Basic Q5: Basic_Q5.py

```python
# Basic Function Questions
# 5. Create a function to check if a given number is prime.

def is_prime(num):
    if num < 2:
        return False
    for i in range(2, num):
        if num % i == 0:
            return False
    return True

# Test the function
num = int(input("Enter a number: "))
if is_prime(num):
    print(num, "is a prime number.")
else:
    print(num, "is not a prime number.")

```

---

#### Basic Q6: Basic_Q6.py

```python
# Basic Function Questions
# 6. Write a function to count the vowels in a given string.

def count_vowels(text):
    vowels = "aeiouAEIOU"
    count = 0
    for char in text:
        if char in vowels:
            count += 1
    return count

# Test the function
text = input("Enter a string: ")
vowel_count = count_vowels(text)
print("Number of vowels:", vowel_count)

```

---

### Intermediate Function Questions (6 Questions)

#### Intermediate Q1: Intermediate_Q1.py

```python
# Intermediate Function Questions
# 1. Create a function that takes a list of numbers and returns the largest number.

def find_largest(numbers):
    if not numbers:
        return None
    largest = numbers[0]
    for num in numbers:
        if num > largest:
            largest = num
    return largest

# Test the function
numbers = [23, 45, 12, 78, 34, 89]
result = find_largest(numbers)
print("Largest number:", result)

```

---

#### Intermediate Q2: Intermediate_Q2.py

```python
# Intermediate Function Questions
# 2. Write a function to find the nth Fibonacci number using recursion.

def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# Test the function
n = int(input("Enter the position (n): "))
result = fibonacci(n)
print(f"The {n}th Fibonacci number is {result}")

```

---

#### Intermediate Q3: Intermediate_Q3.py

```python
# Intermediate Function Questions
# 3. Write a function to check whether a string is a palindrome.

def is_palindrome(text):
    # Remove spaces and convert to lowercase
    text_clean = text.replace(" ", "").lower()
    return text_clean == text_clean[::-1]

# Test the function
text = input("Enter a string: ")
if is_palindrome(text):
    print(text, "is a palindrome.")
else:
    print(text, "is not a palindrome.")

```

---

#### Intermediate Q4: Intermediate_Q4.py

```python
# Intermediate Function Questions
# 4. Create a function that takes a list of integers and returns the sum of all even numbers.

def sum_even_numbers(numbers):
    sum_even = 0
    for num in numbers:
        if num % 2 == 0:
            sum_even += num
    return sum_even

# Test the function
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
result = sum_even_numbers(numbers)
print("Sum of even numbers:", result)

```

---

#### Intermediate Q5: Intermediate_Q5.py

```python
# Intermediate Function Questions
# 5. Write a function to calculate the GCD (Greatest Common Divisor) of two numbers.

def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

# Test the function
num1 = int(input("Enter first number: "))
num2 = int(input("Enter second number: "))
result = gcd(num1, num2)
print(f"GCD of {num1} and {num2} is {result}")

```

---

#### Intermediate Q6: Intermediate_Q6.py

```python
# Intermediate Function Questions
# 6. Create a function that accepts a dictionary and returns the key with the highest value.

def key_with_max_value(dictionary):
    if not dictionary:
        return None
    max_key = None
    max_value = float('-inf')
    for key, value in dictionary.items():
        if value > max_value:
            max_value = value
            max_key = key
    return max_key

# Test the function
scores = {'a': 10, 'b': 15, 'c': 7}
result = key_with_max_value(scores)
print("Key with highest value:", result)

```

---

### Advanced Function Questions (6 Questions)

#### Advanced Q1: Advanced_Q1.py

```python
# Advanced Function Questions
# 1. Write a function that calculates the power of a number without using the ** operator.

def power(base, exponent):
    if exponent == 0:
        return 1
    result = 1
    for i in range(abs(exponent)):
        result *= base
    if exponent < 0:
        return 1 / result
    return result

# Test the function
base = float(input("Enter base: "))
exp = int(input("Enter exponent: "))
result = power(base, exp)
print(f"{base} raised to the power of {exp} is {result}")

```

---

#### Advanced Q2: Advanced_Q2.py

```python
# Advanced Function Questions
# 2. Create a function that converts a given temperature from Celsius to Fahrenheit and vice versa.

def convert_temperature(temp, unit):
    if unit.lower() == 'c':
        # Convert Celsius to Fahrenheit
        fahrenheit = (temp * 9/5) + 32
        return f"{temp}°C = {fahrenheit}°F"
    elif unit.lower() == 'f':
        # Convert Fahrenheit to Celsius
        celsius = (temp - 32) * 5/9
        return f"{temp}°F = {celsius}°C"
    else:
        return "Invalid unit. Use 'C' for Celsius or 'F' for Fahrenheit."

# Test the function
temp = float(input("Enter temperature: "))
unit = input("Enter unit (C for Celsius, F for Fahrenheit): ")
result = convert_temperature(temp, unit)
print(result)

```

---

#### Advanced Q3: Advanced_Q3.py

```python
# Advanced Function Questions
# 3. Write a function to flatten a nested list.

def flatten_list(nested_list):
    flat_list = []
    for item in nested_list:
        if isinstance(item, list):
            flat_list.extend(flatten_list(item))
        else:
            flat_list.append(item)
    return flat_list

# Test the function
nested = [[1, 2], [3, 4], [5, 6]]
result = flatten_list(nested)
print("Flattened list:", result)

```

---

#### Advanced Q4: Advanced_Q4.py

```python
# Advanced Function Questions
# 4. Create a function to check if two strings are anagrams.

def are_anagrams(str1, str2):
    # Remove spaces and convert to lowercase
    str1_clean = str1.replace(" ", "").lower()
    str2_clean = str2.replace(" ", "").lower()
    
    # Sort characters and compare
    return sorted(str1_clean) == sorted(str2_clean)

# Test the function
string1 = input("Enter first string: ")
string2 = input("Enter second string: ")
if are_anagrams(string1, string2):
    print("The strings are anagrams.")
else:
    print("The strings are not anagrams.")

```

---

#### Advanced Q5: Advanced_Q5.py

```python
# Advanced Function Questions
# 5. Write a function that takes a list and removes all duplicate elements.

def remove_duplicates(input_list):
    # Method 1: Using set (preserves order in Python 3.7+)
    seen = set()
    result = []
    for item in input_list:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

# Alternative: return list(set(input_list)) - simpler but may change order

# Test the function
numbers = [10, 20, 20, 30, 40, 10, 50]
result = remove_duplicates(numbers)
print("List without duplicates:", result)

```

---

#### Advanced Q6: Advanced_Q6.py

```python
# Advanced Function Questions
# 6. Create a function that takes a string and counts the frequency of each character.

def count_characters(text):
    frequency = {}
    for char in text:
        if char in frequency:
            frequency[char] += 1
        else:
            frequency[char] = 1
    return frequency

# Test the function
text = input("Enter a string: ")
result = count_characters(text)
print("Character frequencies:")
for char, count in result.items():
    print(f"'{char}': {count}")

```

---

### Real-world Scenarios (2 Questions)

#### Real-world Q1: RealWorld_Q1.py

```python
# Real-world Scenarios
# 1. Write a function that takes a list of employee salaries and calculates the average salary.

def calculate_average_salary(salaries):
    if not salaries:
        return 0
    total = sum(salaries)
    average = total / len(salaries)
    return average

# Test the function
employee_salaries = [50000, 60000, 55000, 70000, 65000]
average = calculate_average_salary(employee_salaries)
print(f"Average salary: ${average:.2f}")

```

---

#### Real-world Q2: RealWorld_Q2.py

```python
# Real-world Scenarios
# 2. Create a function to generate a random password of given length, containing uppercase, lowercase, numbers, and special characters.

import random
import string

def generate_password(length):
    # Define character sets
    uppercase = string.ascii_uppercase
    lowercase = string.ascii_lowercase
    digits = string.digits
    special = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    # Combine all character sets
    all_chars = uppercase + lowercase + digits + special
    
    # Ensure at least one character from each set
    password = [
        random.choice(uppercase),
        random.choice(lowercase),
        random.choice(digits),
        random.choice(special)
    ]
    
    # Fill the rest randomly
    for i in range(length - 4):
        password.append(random.choice(all_chars))
    
    # Shuffle to randomize positions
    random.shuffle(password)
    
    return ''.join(password)

# Test the function
length = int(input("Enter password length (minimum 4): "))
if length < 4:
    print("Password length must be at least 4.")
else:
    password = generate_password(length)
    print("Generated password:", password)

```

---

## Section B - PY Ass3: Dictionaries

### Basic Operations (Questions 1-5)

#### Q1: Q1.py

```python
# Basic Operations
# 1. Create a dictionary student with keys: name, age, and grade. Assign them appropriate values.

student = {
    "name": "John",
    "age": 20,
    "grade": "A"
}

print(student)

```

---

#### Q2: Q2.py

```python
# Basic Operations
# 2. Access the value of the key grade in the student dictionary.

student = {"name": "John", "age": 20, "grade": "A"}

print(student["grade"])

```

---

#### Q3: Q3.py

```python
# Basic Operations
# 3. Add a new key city to the student dictionary and set its value to "New York".

student = {"name": "John", "age": 20, "grade": "A"}

student["city"] = "New York"
print(student)

```

---

#### Q4: Q4.py

```python
# Basic Operations
# 4. Update the value of the age key in the student dictionary to 20.

student = {"name": "John", "age": 18, "grade": "A"}

student["age"] = 20
print(student)

```

---

#### Q5: Q5.py

```python
# Basic Operations
# 5. Remove the key city from the student dictionary.

student = {"name": "John", "age": 20, "grade": "A", "city": "New York"}

del student["city"]
print(student)

```

---

### Iterating through Dictionaries (Questions 6-10)

#### Q6: Q6.py

```python
# Iterating through Dictionaries
# 6. Iterate through the dictionary student and print all keys.

student = {"name": "John", "age": 20, "grade": "A"}

for key in student.keys():
    print(key)

```

---

#### Q7: Q7.py

```python
# Iterating through Dictionaries
# 7. Iterate through the dictionary student and print all values.

student = {"name": "John", "age": 20, "grade": "A"}

for value in student.values():
    print(value)

```

---

#### Q8: Q8.py

```python
# Iterating through Dictionaries
# 8. Iterate through the dictionary student and print all key-value pairs in the format key: value.

student = {"name": "John", "age": 20, "grade": "A"}

for key, value in student.items():
    print(key, ":", value)

```

---

#### Q9: Q9.py

```python
# Iterating through Dictionaries
# 9. Check if the key grade exists in the student dictionary and print True or False.

student = {"name": "John", "age": 20, "grade": "A"}

if "grade" in student:
    print(True)
else:
    print(False)

```

---

#### Q10: Q10.py

```python
# Iterating through Dictionaries
# 10. Count the total number of keys in the student dictionary.

student = {"name": "John", "age": 20, "grade": "A"}

print("Total number of keys:", len(student))

```

---

### Advanced Dictionary Usage (Questions 11-15)

#### Q11: Q11.py

```python
# Advanced Dictionary Usage
# 11. Merge the following two dictionaries and print the result:
#     dict1 = {'a': 1, 'b': 2}
#     dict2 = {'c': 3, 'd': 4}

dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}

# Method 1: Using update()
merged = dict1.copy()
merged.update(dict2)
print(merged)

# Method 2: Using ** operator (Python 3.5+)
# merged = {**dict1, **dict2}
# print(merged)

```

---

#### Q12: Q12.py

```python
# Advanced Dictionary Usage
# 12. Create a dictionary from a list of tuples: [('name', 'Alice'), ('age', 25), ('city', 'Paris')].

tuple_list = [('name', 'Alice'), ('age', 25), ('city', 'Paris')]

person = dict(tuple_list)
print(person)

```

---

#### Q13: Q13.py

```python
# Advanced Dictionary Usage
# 13. Sort the keys of the dictionary {'z': 1, 'a': 2, 'c': 3} in ascending order and print the sorted dictionary.

my_dict = {'z': 1, 'a': 2, 'c': 3}

sorted_dict = {}
for key in sorted(my_dict.keys()):
    sorted_dict[key] = my_dict[key]

print(sorted_dict)

# Alternative using dictionary comprehension:
# sorted_dict = {k: my_dict[k] for k in sorted(my_dict.keys())}
# print(sorted_dict)

```

---

#### Q14: Q14.py

```python
# Advanced Dictionary Usage
# 14. Reverse the dictionary {'a': 1, 'b': 2, 'c': 3} so that keys become values and values become keys.

original = {'a': 1, 'b': 2, 'c': 3}

reversed_dict = {}
for key, value in original.items():
    reversed_dict[value] = key

print(reversed_dict)

```

---

#### Q15: Q15.py

```python
# Advanced Dictionary Usage
# 15. Write a Python function to check if two dictionaries are identical (contain the same key-value pairs).

def are_identical(dict1, dict2):
    return dict1 == dict2

# Test the function
dict1 = {'a': 1, 'b': 2, 'c': 3}
dict2 = {'a': 1, 'b': 2, 'c': 3}
dict3 = {'a': 1, 'b': 2, 'c': 4}

print(are_identical(dict1, dict2))  # True
print(are_identical(dict1, dict3))  # False

```

---

### Nested Dictionaries (Questions 16-20)

#### Q16: Q16.py

```python
# Nested Dictionaries
# 16. Create a nested dictionary to represent the following data:
#     Person:
#       Name: John
#       Age: 30
#       Address:
#         Street: 123 Elm St
#         City: Boston

person = {
    "Name": "John",
    "Age": 30,
    "Address": {
        "Street": "123 Elm St",
        "City": "Boston"
    }
}

print(person)

```

---

#### Q17: Q17.py

```python
# Nested Dictionaries
# 17. Access the value of the City key in the nested dictionary from the previous question.

person = {
    "Name": "John",
    "Age": 30,
    "Address": {
        "Street": "123 Elm St",
        "City": "Boston"
    }
}

print(person["Address"]["City"])

```

---

#### Q18: Q18.py

```python
# Nested Dictionaries
# 18. Add a new key Phone to the nested dictionary with the value "123-456-7890".

person = {
    "Name": "John",
    "Age": 30,
    "Address": {
        "Street": "123 Elm St",
        "City": "Boston"
    }
}

person["Phone"] = "123-456-7890"
print(person)

```

---

#### Q19: Q19.py

```python
# Nested Dictionaries
# 19. Delete the Address key from the nested dictionary.

person = {
    "Name": "John",
    "Age": 30,
    "Address": {
        "Street": "123 Elm St",
        "City": "Boston"
    }
}

del person["Address"]
print(person)

```

---

#### Q20: Q20.py

```python
# Nested Dictionaries
# 20. Iterate through all the keys in the outermost level of the nested dictionary and print them.

person = {
    "Name": "John",
    "Age": 30,
    "Address": {
        "Street": "123 Elm St",
        "City": "Boston"
    }
}

for key in person.keys():
    print(key)

```

---

### Applications of Dictionaries (Questions 21-25)

#### Q21: Q21.py

```python
# Applications of Dictionaries
# 21. Use a dictionary to count the occurrences of each word in the string "hello world hello python world".

text = "hello world hello python world"
words = text.split()

word_count = {}
for word in words:
    if word in word_count:
        word_count[word] += 1
    else:
        word_count[word] = 1

print(word_count)

```

---

#### Q22: Q22.py

```python
# Applications of Dictionaries
# 22. Write a Python program to find the key with the maximum value in the dictionary {'a': 10, 'b': 15, 'c': 7}.

scores = {'a': 10, 'b': 15, 'c': 7}

max_key = None
max_value = float('-inf')
for key, value in scores.items():
    if value > max_value:
        max_value = value
        max_key = key

print("Key with maximum value:", max_key)

# Alternative using max() function:
# max_key = max(scores, key=scores.get)
# print("Key with maximum value:", max_key)

```

---

#### Q23: Q23.py

```python
# Applications of Dictionaries
# 23. Create a dictionary to map numbers 1 to 5 to their squares (e.g., {1: 1, 2: 4, 3: 9, ...}).

squares_dict = {}
for i in range(1, 6):
    squares_dict[i] = i ** 2

print(squares_dict)

# Alternative using dictionary comprehension:
# squares_dict = {i: i**2 for i in range(1, 6)}
# print(squares_dict)

```

---

#### Q24: Q24.py

```python
# Applications of Dictionaries
# 24. Write a Python program to remove duplicate values from the dictionary {'a': 10, 'b': 15, 'c': 10, 'd': 15}.

original = {'a': 10, 'b': 15, 'c': 10, 'd': 15}

# Create a new dictionary with unique values
seen_values = set()
unique_dict = {}

for key, value in original.items():
    if value not in seen_values:
        seen_values.add(value)
        unique_dict[key] = value

print(unique_dict)

```

---

#### Q25: Q25.py

```python
# Applications of Dictionaries
# 25. Write a Python function that accepts a dictionary and a key, and returns the value associated with the key.
#     If the key doesn't exist, return "Key not found".

def get_value(dictionary, key):
    if key in dictionary:
        return dictionary[key]
    else:
        return "Key not found"

# Test the function
student = {"name": "John", "age": 20, "grade": "A"}

print(get_value(student, "name"))   # John
print(get_value(student, "city"))   # Key not found

```

---

### Challenging Problems (Questions 26-30)

#### Q26: Q26.py

```python
# Challenging Problems
# 26. Given two dictionaries dict1 = {'a': 5, 'b': 10} and dict2 = {'a': 3, 'b': 7},
#     write a Python program to add the values of matching keys and print the result.

dict1 = {'a': 5, 'b': 10}
dict2 = {'a': 3, 'b': 7}

result = {}
for key in dict1.keys():
    if key in dict2:
        result[key] = dict1[key] + dict2[key]
    else:
        result[key] = dict1[key]

# Add keys from dict2 that are not in dict1
for key in dict2.keys():
    if key not in result:
        result[key] = dict2[key]

print(result)

```

---

#### Q27: Q27.py

```python
# Challenging Problems
# 27. Write a Python program to create a dictionary where the keys are the first n positive integers,
#     and the values are their cubes. Take n as user input.

n = int(input("Enter a number (n): "))

cubes_dict = {}
for i in range(1, n + 1):
    cubes_dict[i] = i ** 3

print(cubes_dict)

# Alternative using dictionary comprehension:
# cubes_dict = {i: i**3 for i in range(1, n + 1)}
# print(cubes_dict)

```

---

#### Q28: Q28.py

```python
# Challenging Problems
# 28. Flatten the following nested dictionary into a single-level dictionary:
#     {'a': {'b': 1, 'c': 2}, 'd': {'e': 3, 'f': 4}}

nested = {'a': {'b': 1, 'c': 2}, 'd': {'e': 3, 'f': 4}}

def flatten_dict(nested_dict, parent_key='', sep='_'):
    items = []
    for key, value in nested_dict.items():
        new_key = f"{parent_key}{sep}{key}" if parent_key else key
        if isinstance(value, dict):
            items.extend(flatten_dict(value, new_key, sep=sep).items())
        else:
            items.append((new_key, value))
    return dict(items)

flattened = flatten_dict(nested)
print(flattened)

```

---

#### Q29: Q29.py

```python
# Challenging Problems
# 29. Write a Python program to split a dictionary into two based on whether the values are odd or even.

original = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}

even_dict = {}
odd_dict = {}

for key, value in original.items():
    if value % 2 == 0:
        even_dict[key] = value
    else:
        odd_dict[key] = value

print("Even values dictionary:", even_dict)
print("Odd values dictionary:", odd_dict)

```

---

#### Q30: Q30.py

```python
# Challenging Problems
# 30. Create a dictionary comprehension to filter out all keys in {'a': 1, 'b': 2, 'c': 3, 'd': 4}
#     where the value is less than 3.

original = {'a': 1, 'b': 2, 'c': 3, 'd': 4}

filtered = {key: value for key, value in original.items() if value >= 3}

print(filtered)

```

---



## Section B - PY Ass1: Conditional Statements & Loops

*Note: Same questions as Section A PY Ass1. Solutions are identical.*

### Part 1: Conditional Statements (20 Questions)

#### Q1: Q1.py

```python
# Write a program that checks if a given number is positive, negative, or zero.

num = int(input("Enter a number: "))

if num > 0:
    print(num, " is positive.")
elif num < 0:
    print(num, " is negative.")
else:
    print(num, " is zero.")

```

---

#### Q2: Q2.py

```python
# Take a user's age as input and display whether they are a minor, adult, or senior citizen.

age = int(input("Enter your age: "))

if age < 18:
    print("You are a minor.")
elif age >= 18 and age <= 50:
    print("You are an adult.")
else:
    print("You are a senior citizen.")

```

---

#### Q3: Q3.py

```python
# Write a program that checks if a given year is a leap year.

year = int(input("Enter a year: "))

# A year is a leap year if:
# 1. It is divisible by 4, but not by 100, OR
# 2. It is divisible by 400
if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print(year, "is a leap year.")
else:
    print(year, "is not a leap year.")

```

---

#### Q4: Q4.py

```python
# Take an integer and check if it's even or odd.

num = int(input("Enter an integer: "))

if num % 2 == 0:
    print(num, "is even.")
else:
    print(num, "is odd.")

```

---

#### Q5: Q5.py

```python
# Ask the user for a grade percentage and display the corresponding letter grade (A, B, C, D, F).

percentage = float(input("Enter your grade percentage: "))

if percentage >= 90:
    print("Grade: A")
elif percentage >= 80:
    print("Grade: B")
elif percentage >= 70:
    print("Grade: C")
elif percentage >= 60:
    print("Grade: D")
else:
    print("Grade: F")

```

---

#### Q6: Q6.py

```python
# Write a program to find the largest of two numbers.

num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

if num1 > num2:
    print(num1, "is the largest.")
elif num2 > num1:
    print(num2, "is the largest.")
else:
    print("Both numbers are equal.")

```

---

#### Q7: Q7.py

```python
# Write a program to find the largest of three numbers.

n1 = float(input("Enter first number: "))
n2 = float(input("Enter second number: "))
n3 = float(input("Enter third number: "))

if n1 > n2 and n1 > n3:
    print(n1, "is the largest.")
elif n2 > n1 and n2 > n3:
    print(n2, "is the largest.")
else:
    print(n3, "is the largest.")

```

---

#### Q8: Q8.py

```python
# Create a program that checks if a given string is a palindrome.

text = input("Enter a string: ")

# Remove spaces and convert to lowercase for comparison
text_clean = text.replace(" ", "").lower()

# Check if string is equal to its reverse
if text_clean == text_clean[::-1]:
    print(text, "is a palindrome.")
else:
    print(text, "is not a palindrome.")

```

---

#### Q9: Q9.py

```python
# Take three sides of a triangle as input and check if they form a valid triangle.

side1 = float(input("Enter first side: "))
side2 = float(input("Enter second side: "))
side3 = float(input("Enter third side: "))

# Triangle inequality: sum of any two sides must be greater than the third side
if (side1 + side2 > side3) and (side2 + side3 > side1) and (side1 + side3 > side2):
    print("These sides form a valid triangle.")
else:
    print("These sides do not form a valid triangle.")

```

---

#### Q10: Q10.py

```python
# Write a program to determine if a given character is a vowel or consonant.

char = input("Enter a character: ").lower()

# Check if it's a single character
if len(char) != 1:
    print("Please enter a single character.")
elif char in "aeiou":
    print(char, "is a vowel.")
elif char.isalpha():
    print(char, "is a consonant.")
else:
    print("Please enter an alphabetic character.")

```

---

#### Q11: Q11.py

```python
# Check if a given number is a multiple of both 3 and 5.

num = int(input("Enter a number: "))

if num % 3 == 0 and num % 5 == 0:
    print(num, "is a multiple of both 3 and 5.")
else:
    print(num, "is not a multiple of both 3 and 5.")

```

---

#### Q12: Q12.py

```python
# Write a program that takes a temperature in Celsius and checks if it's freezing, moderate, or hot.

temp = float(input("Enter temperature in Celsius: "))

if temp <= 0:
    print("It's freezing.")
elif temp > 0 and temp <= 25:
    print("It's moderate.")
else:
    print("It's hot.")

```

---

#### Q13: Q13.py

```python
# Take two numbers and an operator (+, -, *, /) as input and perform the corresponding operation.

num1 = float(input("Enter first number: "))
operator = input("Enter operator (+, -, *, /): ")
num2 = float(input("Enter second number: "))

if operator == "+":
    result = num1 + num2
    print(num1, "+", num2, "=", result)
elif operator == "-":
    result = num1 - num2
    print(num1, "-", num2, "=", result)
elif operator == "*":
    result = num1 * num2
    print(num1, "*", num2, "=", result)
elif operator == "/":
    if num2 != 0:
        result = num1 / num2
        print(num1, "/", num2, "=", result)
    else:
        print("Error: Division by zero is not allowed.")
else:
    print("Invalid operator. Please use +, -, *, or /.")

```

---

#### Q14: Q14.py

```python
# Check if a year input by the user is a century year.

year = int(input("Enter a year: "))

if year % 100 == 0:
    print(year, "is a century year.")
else:
    print(year, "is not a century year.")

```

---

#### Q15: Q15.py

```python
# Write a program to check if a number is within a specified range.

num = float(input("Enter a number: "))
lower = float(input("Enter lower bound of range: "))
upper = float(input("Enter upper bound of range: "))

if num >= lower and num <= upper:
    print(num, "is within the range [", lower, ",", upper, "]")
else:
    print(num, "is not within the range [", lower, ",", upper, "]")

```

---

#### Q16: Q16.py

```python
# Take the length of three sides and classify the triangle (equilateral, isosceles, or scalene).

side1 = float(input("Enter first side: "))
side2 = float(input("Enter second side: "))
side3 = float(input("Enter third side: "))

# Check if valid triangle first
if (side1 + side2 > side3) and (side2 + side3 > side1) and (side1 + side3 > side2):
    if side1 == side2 == side3:
        print("Equilateral triangle (all sides equal).")
    elif side1 == side2 or side2 == side3 or side1 == side3:
        print("Isosceles triangle (two sides equal).")
    else:
        print("Scalene triangle (all sides different).")
else:
    print("These sides do not form a valid triangle.")

```

---

#### Q17: Q17.py

```python
# Write a program that asks for an integer and checks if it's divisible by 2, 3, or both.

num = int(input("Enter an integer: "))

divisible_by_2 = num % 2 == 0
divisible_by_3 = num % 3 == 0

if divisible_by_2 and divisible_by_3:
    print(num, "is divisible by both 2 and 3.")
elif divisible_by_2:
    print(num, "is divisible by 2 only.")
elif divisible_by_3:
    print(num, "is divisible by 3 only.")
else:
    print(num, "is not divisible by 2 or 3.")

```

---

#### Q18: Q18.py

```python
# Take a user's score and determine if they pass or fail (pass if 50 or above).

score = float(input("Enter your score: "))

if score >= 50:
    print("You passed!")
else:
    print("You failed.")

```

---

#### Q19: Q19.py

```python
# Check if a string input is uppercase, lowercase, or a mix.

text = input("Enter a string: ")

if text.isupper():
    print("The string is uppercase.")
elif text.islower():
    print("The string is lowercase.")
else:
    print("The string is a mix of uppercase and lowercase.")

```

---

#### Q20: Q20.py

```python
# Create a program that evaluates if an inputted number is prime.

num = int(input("Enter a number: "))

if num < 2:
    print(num, "is not a prime number.")
else:
    is_prime = True
    for i in range(2, num):
        if num % i == 0:
            is_prime = False
            break
    
    if is_prime:
        print(num, "is a prime number.")
    else:
        print(num, "is not a prime number.")

```

---

### Part 2: Loops (20 Questions)

#### Q1: Q1.py

```python
# Print numbers from 1 to 20 using a for loop.

for i in range(1, 21):
    print(i)

```

---

#### Q2: Q2.py

```python
# Use a while loop to print even numbers from 1 to 50.

i = 1
while i <= 50:
    if i % 2 == 0:
        print(i, "is even number.")
    i = i + 1

```

---

#### Q3: Q3.py

```python
# Write a program to calculate the sum of all numbers between 1 and 100.

sum = 0
for i in range(1, 101):
    sum = sum + i

print("Sum of numbers from 1 to 100:", sum)

```

---

#### Q4: Q4.py

```python
# Print the multiplication table of a given number.

inputNum = int(input("Enter any number: "))

for i in range(1, 11):
    print(inputNum, "*", i, ":", inputNum * i)

```

---

#### Q5: Q5.py

```python
# Print all odd numbers between 1 and 100 using a loop.

for i in range(1, 101, 2):
    print(i)

# Alternative using if condition
# for i in range(1, 101):
#     if i % 2 != 0:
#         print(i)

```

---

#### Q6: Q6.py

```python
# Use a for loop to print each character of a string.

text = input("Enter a string: ")

for char in text:
    print(char)

```

---

#### Q7: Q7.py

```python
# Find the factorial of a number using a while loop.

factNum = int(input("Enter a number: "))
fac = 1
i = factNum

while i >= 1:
    fac = fac * i
    i = i - 1

print("Factorial of", factNum, "is", fac)

```

---

#### Q8: Q8.py

```python
# Use a for loop to print numbers from 10 down to 1.

for i in range(10, 0, -1):
    print(i)

```

---

#### Q9: Q9.py

```python
# Write a program to print the first 10 Fibonacci numbers.

# Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
a, b = 0, 1
print(a)
print(b)

for i in range(2, 10):
    next_num = a + b
    print(next_num)
    a = b
    b = next_num

```

---

#### Q10: Q10.py

```python
# Use a loop to count the number of digits in an integer.

num = abs(int(input("Enter an integer: ")))
count = 0

if num == 0:
    count = 1
else:
    while num > 0:
        count = count + 1
        num = num // 10

print("Number of digits:", count)

```

---

#### Q11: Q11.py

```python
# Print the reverse of a given number.

num = abs(int(input("Enter a number: ")))
reversed_num = 0

while num > 0:
    digit = num % 10
    reversed_num = reversed_num * 10 + digit
    num = num // 10

print("Reversed number:", reversed_num)

```

---

#### Q12: Q12.py

```python
# Print all prime numbers between 1 and 50.

for num in range(2, 50):
    isPrimeNumber = True
    
    for i in range(2, num):
        if num % i == 0:
            isPrimeNumber = False
            break
    
    if isPrimeNumber:
        print(num, "is prime number")

```

---

#### Q13: Q13.py

```python
# Use nested loops to print a pyramid pattern of *.

rows = int(input("Enter number of rows: "))

for i in range(1, rows + 1):
    # Print spaces for alignment
    for j in range(rows - i):
        print(" ", end="")
    # Print stars
    for j in range(2 * i - 1):
        print("*", end="")
    print()  # New line after each row

```

---

#### Q14: Q14.py

```python
# Write a program that breaks the loop when a certain condition is met.

target = 7

for i in range(1, 20):
    print(i)
    if i == target:
        print("Target reached! Breaking loop.")
        break

print("Loop ended.")

```

---

#### Q15: Q15.py

```python
# Print the sum of even and odd numbers separately up to a given number.

n = int(input("Enter a number: "))
even_sum = 0
odd_sum = 0

for i in range(1, n + 1):
    if i % 2 == 0:
        even_sum = even_sum + i
    else:
        odd_sum = odd_sum + i

print("Sum of even numbers:", even_sum)
print("Sum of odd numbers:", odd_sum)

```

---

#### Q16: Q16.py

```python
# Create a program to calculate the sum of the digits of an inputted integer.

num = abs(int(input("Enter any number: ")))
sum = 0

while num > 0:
    sum += num % 10
    num = num // 10

print("Sum of digits:", sum)

```

---

#### Q17: Q17.py

```python
# Write a program that continues to ask for a number until the correct number is guessed.

correct_number = 50
correct_number_found = False

while not correct_number_found:
    inputNum = int(input("Enter a number: "))
    if inputNum == correct_number:
        correct_number_found = True
        print("Congrats. You have guessed the correct number!!!")
    else:
        print("You hit a wrong number. Try again.")

```

---

#### Q18: Q18.py

```python
# Use a loop to print numbers in reverse order within a given range.

start = int(input("Enter start number: "))
end = int(input("Enter end number: "))

# Print numbers in reverse order
for i in range(end, start - 1, -1):
    print(i)

```

---

#### Q19: Q19.py

```python
# Use a for loop to print the square of each number from 1 to 10.

for i in range(1, 11):
    print(i, "squared =", i * i)

```

---

#### Q20: Q20.py

```python
# Create a program that simulates a countdown timer starting from a given number down to zero.

start_num = int(input("Enter starting number: "))

for i in range(start_num, -1, -1):
    print(i)

print("Countdown complete!")

```

---

## Section B - PY Ass2: Functions

*Note: Same questions as Section A PY Ass2. Solutions are identical.*

### Basic Function Questions (6 Questions)

#### Basic Q1: Basic_Q1.py

```python
# Basic Function Questions
# 1. Write a function to calculate the area of a circle given its radius.

def area_of_circle(radius):
    pi = 3.14
    area = pi * (radius ** 2)
    return area

# Test the function
radius = float(input("Enter the radius: "))
result = area_of_circle(radius)
print("Area of circle:", result)

```

---

#### Basic Q2: Basic_Q2.py

```python
# Basic Function Questions
# 2. Create a function that takes two numbers and returns their sum.

def sum_numbers(num1, num2):
    return num1 + num2

# Test the function
a = float(input("Enter first number: "))
b = float(input("Enter second number: "))
result = sum_numbers(a, b)
print("Sum:", result)

```

---

#### Basic Q3: Basic_Q3.py

```python
# Basic Function Questions
# 3. Write a function to find the factorial of a number using recursion.

def factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)

# Test the function
num = int(input("Enter a number: "))
result = factorial(num)
print(f"Factorial of {num} is {result}")

```

---

#### Basic Q4: Basic_Q4.py

```python
# Basic Function Questions
# 4. Write a function that takes a string and returns it reversed.

def reverse_string(text):
    return text[::-1]

# Test the function
text = input("Enter a string: ")
reversed_text = reverse_string(text)
print("Reversed string:", reversed_text)

```

---

#### Basic Q5: Basic_Q5.py

```python
# Basic Function Questions
# 5. Create a function to check if a given number is prime.

def is_prime(num):
    if num < 2:
        return False
    for i in range(2, num):
        if num % i == 0:
            return False
    return True

# Test the function
num = int(input("Enter a number: "))
if is_prime(num):
    print(num, "is a prime number.")
else:
    print(num, "is not a prime number.")

```

---

#### Basic Q6: Basic_Q6.py

```python
# Basic Function Questions
# 6. Write a function to count the vowels in a given string.

def count_vowels(text):
    vowels = "aeiouAEIOU"
    count = 0
    for char in text:
        if char in vowels:
            count += 1
    return count

# Test the function
text = input("Enter a string: ")
vowel_count = count_vowels(text)
print("Number of vowels:", vowel_count)

```

---

### Intermediate Function Questions (6 Questions)

#### Intermediate Q1: Intermediate_Q1.py

```python
# Intermediate Function Questions
# 1. Create a function that takes a list of numbers and returns the largest number.

def find_largest(numbers):
    if not numbers:
        return None
    largest = numbers[0]
    for num in numbers:
        if num > largest:
            largest = num
    return largest

# Test the function
numbers = [23, 45, 12, 78, 34, 89]
result = find_largest(numbers)
print("Largest number:", result)

```

---

#### Intermediate Q2: Intermediate_Q2.py

```python
# Intermediate Function Questions
# 2. Write a function to find the nth Fibonacci number using recursion.

def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# Test the function
n = int(input("Enter the position (n): "))
result = fibonacci(n)
print(f"The {n}th Fibonacci number is {result}")

```

---

#### Intermediate Q3: Intermediate_Q3.py

```python
# Intermediate Function Questions
# 3. Write a function to check whether a string is a palindrome.

def is_palindrome(text):
    # Remove spaces and convert to lowercase
    text_clean = text.replace(" ", "").lower()
    return text_clean == text_clean[::-1]

# Test the function
text = input("Enter a string: ")
if is_palindrome(text):
    print(text, "is a palindrome.")
else:
    print(text, "is not a palindrome.")

```

---

#### Intermediate Q4: Intermediate_Q4.py

```python
# Intermediate Function Questions
# 4. Create a function that takes a list of integers and returns the sum of all even numbers.

def sum_even_numbers(numbers):
    sum_even = 0
    for num in numbers:
        if num % 2 == 0:
            sum_even += num
    return sum_even

# Test the function
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
result = sum_even_numbers(numbers)
print("Sum of even numbers:", result)

```

---

#### Intermediate Q5: Intermediate_Q5.py

```python
# Intermediate Function Questions
# 5. Write a function to calculate the GCD (Greatest Common Divisor) of two numbers.

def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

# Test the function
num1 = int(input("Enter first number: "))
num2 = int(input("Enter second number: "))
result = gcd(num1, num2)
print(f"GCD of {num1} and {num2} is {result}")

```

---

#### Intermediate Q6: Intermediate_Q6.py

```python
# Intermediate Function Questions
# 6. Create a function that accepts a dictionary and returns the key with the highest value.

def key_with_max_value(dictionary):
    if not dictionary:
        return None
    max_key = None
    max_value = float('-inf')
    for key, value in dictionary.items():
        if value > max_value:
            max_value = value
            max_key = key
    return max_key

# Test the function
scores = {'a': 10, 'b': 15, 'c': 7}
result = key_with_max_value(scores)
print("Key with highest value:", result)

```

---

### Advanced Function Questions (6 Questions)

#### Advanced Q1: Advanced_Q1.py

```python
# Advanced Function Questions
# 1. Write a function that calculates the power of a number without using the ** operator.

def power(base, exponent):
    if exponent == 0:
        return 1
    result = 1
    for i in range(abs(exponent)):
        result *= base
    if exponent < 0:
        return 1 / result
    return result

# Test the function
base = float(input("Enter base: "))
exp = int(input("Enter exponent: "))
result = power(base, exp)
print(f"{base} raised to the power of {exp} is {result}")

```

---

#### Advanced Q2: Advanced_Q2.py

```python
# Advanced Function Questions
# 2. Create a function that converts a given temperature from Celsius to Fahrenheit and vice versa.

def convert_temperature(temp, unit):
    if unit.lower() == 'c':
        # Convert Celsius to Fahrenheit
        fahrenheit = (temp * 9/5) + 32
        return f"{temp}°C = {fahrenheit}°F"
    elif unit.lower() == 'f':
        # Convert Fahrenheit to Celsius
        celsius = (temp - 32) * 5/9
        return f"{temp}°F = {celsius}°C"
    else:
        return "Invalid unit. Use 'C' for Celsius or 'F' for Fahrenheit."

# Test the function
temp = float(input("Enter temperature: "))
unit = input("Enter unit (C for Celsius, F for Fahrenheit): ")
result = convert_temperature(temp, unit)
print(result)

```

---

#### Advanced Q3: Advanced_Q3.py

```python
# Advanced Function Questions
# 3. Write a function to flatten a nested list.

def flatten_list(nested_list):
    flat_list = []
    for item in nested_list:
        if isinstance(item, list):
            flat_list.extend(flatten_list(item))
        else:
            flat_list.append(item)
    return flat_list

# Test the function
nested = [[1, 2], [3, 4], [5, 6]]
result = flatten_list(nested)
print("Flattened list:", result)

```

---

#### Advanced Q4: Advanced_Q4.py

```python
# Advanced Function Questions
# 4. Create a function to check if two strings are anagrams.

def are_anagrams(str1, str2):
    # Remove spaces and convert to lowercase
    str1_clean = str1.replace(" ", "").lower()
    str2_clean = str2.replace(" ", "").lower()
    
    # Sort characters and compare
    return sorted(str1_clean) == sorted(str2_clean)

# Test the function
string1 = input("Enter first string: ")
string2 = input("Enter second string: ")
if are_anagrams(string1, string2):
    print("The strings are anagrams.")
else:
    print("The strings are not anagrams.")

```

---

#### Advanced Q5: Advanced_Q5.py

```python
# Advanced Function Questions
# 5. Write a function that takes a list and removes all duplicate elements.

def remove_duplicates(input_list):
    # Method 1: Using set (preserves order in Python 3.7+)
    seen = set()
    result = []
    for item in input_list:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

# Alternative: return list(set(input_list)) - simpler but may change order

# Test the function
numbers = [10, 20, 20, 30, 40, 10, 50]
result = remove_duplicates(numbers)
print("List without duplicates:", result)

```

---

#### Advanced Q6: Advanced_Q6.py

```python
# Advanced Function Questions
# 6. Create a function that takes a string and counts the frequency of each character.

def count_characters(text):
    frequency = {}
    for char in text:
        if char in frequency:
            frequency[char] += 1
        else:
            frequency[char] = 1
    return frequency

# Test the function
text = input("Enter a string: ")
result = count_characters(text)
print("Character frequencies:")
for char, count in result.items():
    print(f"'{char}': {count}")

```

---

### Real-world Scenarios (2 Questions)

#### Real-world Q1: RealWorld_Q1.py

```python
# Real-world Scenarios
# 1. Write a function that takes a list of employee salaries and calculates the average salary.

def calculate_average_salary(salaries):
    if not salaries:
        return 0
    total = sum(salaries)
    average = total / len(salaries)
    return average

# Test the function
employee_salaries = [50000, 60000, 55000, 70000, 65000]
average = calculate_average_salary(employee_salaries)
print(f"Average salary: ${average:.2f}")

```

---

#### Real-world Q2: RealWorld_Q2.py

```python
# Real-world Scenarios
# 2. Create a function to generate a random password of given length, containing uppercase, lowercase, numbers, and special characters.

import random
import string

def generate_password(length):
    # Define character sets
    uppercase = string.ascii_uppercase
    lowercase = string.ascii_lowercase
    digits = string.digits
    special = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    # Combine all character sets
    all_chars = uppercase + lowercase + digits + special
    
    # Ensure at least one character from each set
    password = [
        random.choice(uppercase),
        random.choice(lowercase),
        random.choice(digits),
        random.choice(special)
    ]
    
    # Fill the rest randomly
    for i in range(length - 4):
        password.append(random.choice(all_chars))
    
    # Shuffle to randomize positions
    random.shuffle(password)
    
    return ''.join(password)

# Test the function
length = int(input("Enter password length (minimum 4): "))
if length < 4:
    print("Password length must be at least 4.")
else:
    password = generate_password(length)
    print("Generated password:", password)

```

---

