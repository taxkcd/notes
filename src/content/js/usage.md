---
title: JavaScript Reference Guide
date: 2025-01-13
---

## Important Functions

### 1. Built-in

#### i. String Methods

```javascript
// toUpperCase() and toLowerCase()
let str = "Ahmad"
console.log(str.toUpperCase()) // "AHMAD"
console.log(str.toLowerCase()) // "ahmad"

// indexOf() - find first occurrence
console.log('Ahmad Sultan'.indexOf(" S")) // 5

// split() - split string into array
console.log("Ahmad,Sul,tan".split(",")) // ["Ahmad", "Sul", "tan"]
console.log("Ahmad,Sul,tan".split("")) // ["A", "h", "m", "a", "d", ",", "S", "u", "l", ",", "t", "a", "n"]

// charAt() - get character at index
let firstName = "Ahmad"
for (let index = 0; index < firstName.length; index++) {
    console.log(firstName.charAt(index))
}

// slice() - extract substring
let slicedPart = firstName.slice(2, 4) // "ma"

// length - get string length
console.log("Ahmad".length) // 5

// trim() - remove whitespace
let trimmed = "  Ahmad  ".trim() // "Ahmad"
```

#### ii. Number Methods

```javascript
// parseInt() - convert string to integer
console.log(parseInt("3.14c")) // 3

// parseFloat() - convert string to float
console.log(parseFloat("3.14c")) // 3.14

// Number() - convert to number
var pi = '3.14'
console.log(Number(pi)) // 3.14
console.log(Number(new Date())) // timestamp

// toFixed() - format decimal places
console.log(pi.toFixed(0)) // "3"

// toPrecision() - format precision
console.log(pi.toPrecision(1)) // "3"

// valueOf() - get primitive value
console.log(pi.valueOf()) // "3.14"

// Number constants
console.log(Number.MAX_VALUE)
console.log(Number.MIN_VALUE)
```

#### iii. Math Methods

```javascript
// Math.random() - random number between 0 and 1
console.log(Math.random())

// Math.floor() - round down
console.log(Math.floor(Math.random() * 6) + 1) // random number from 1 to 6

// Math constants
console.log(Math.LOG2E)
```

#### iv. Array Methods

```javascript
let arr = [3, 5, 3]

// map() - transform each element
let newArr = arr.map(function (item) {
    return item * 2
})
// or with arrow function
let sqnums = [1, 2, 3, 4, 5].map(num => num * num)

// filter() - filter elements based on condition
let filteredArr = arr.filter(function (item) {
    return item < 6
})

// find() - find first matching element
let foundElement = arr.find(function (item) {
    return item < 6
})

// findIndex() - find index of first matching element
let foundIndex = arr.findIndex(function (item) {
    return item === 3
})
console.log([2, 4, 7, 8].findIndex(item => item == 7)) // 2

// reduce() - reduce array to single value
let reduce = arr.reduce(function (prev, cur) {
    return prev + cur
})

// every() - check if all elements pass test
let everyElements = arr.every(function (item) {
    return item < 6
})

// includes() - check if array contains element
console.log([2, 4, 7, 8].includes(70)) // false

// reverse() - reverse array
let nums = [1, 2, 3]
nums.reverse() // [3, 2, 1]

// fill() - fill array with value
let v1 = [1, 2, 3]
v1.fill(1) // [1, 1, 1]

// push() - add to end
let nums = [1, 2, 3]
nums.push(4) // [1, 2, 3, 4]

// pop() - remove from end
nums.pop() // returns 4, nums = [1, 2, 3]

// splice() - remove/insert elements
let nums = [3, 2, 4, 2, 4, 5, 6, 3, 5, 3, 4]
nums.splice(2, 1) // removes element at index 2
```

#### v. Object Methods

```javascript
let person = {
    name: "Ahmad",
    age: 22,
    run: function() {
        return "He runs very fast."
    }
}

// Object.keys() - get all keys
console.log(Object.keys(person)) // ["name", "age", "run"]

// Object.values() - get all values
console.log(Object.values(person)) // ["Ahmad", 22, function...]
```

#### vi. Date Methods

```javascript
// new Date() - create date object
let date = new Date()
let date2 = new Date("jan 10, 2024")

// getDay() - get day of week (0-6)
let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
console.log("day -> ", days[date.getDay()])

// getMinutes() - get minutes
console.log("hours -> ", date.getMinutes())

// setFullYear() - set year
date.setFullYear(2004)
console.log("2004 -> ", date)
```

### 2. Custom

#### i. Basic Function Declarations

```javascript
// Regular function
function sum1(num1, num2) {
    console.log("sum1 -> num1 + num2: ", num1 + num2)
}
sum1(3, 5)

// Function expression
let sum2 = function (num1, num2) {
    let sum = num1 + num2
    console.log("sum2 -> num1 + num2: ", sum)
}
sum2(3, 5)

// Arrow function
let sum3 = (num1, num2) => console.log("sum3 -> num1 + num2: ", num1 + num2)
sum3(3, 5)

// Arrow function with return
let sumOfItself = (n1, n2) => n1 + n2
console.log(sumOfItself(2, 3)) // 5
```

#### ii. Advanced Functions

```javascript
// Generator function
function* generatorFunction() {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
}

let generator = generatorFunction()
console.log(generator.next().value) // 1
console.log(generator.next().value) // 2

// Infinite generator
function* generatorFunction() {
    let num = 0
    while (true) {
        yield num
        num = num + 1
    }
}

// Currying function
function upperFunc(num1) {
    return function (num2) {
        return function (num3) {
            return num1 + num2 + num3
        }
    }
}
console.log(upperFunc(2)(4)(8)) // 14

// Function with default parameters
function sum(n1, n2 = 5, n3 = 6, n4 = 7) {
    return n1 + n2 + n3 + n4
}
console.log(sum(3)) // 21 (3 + 5 + 6 + 7)
```

## Operations

### 1. Variable Declarations

```javascript
// var - function/global scope
var x = 7;
function func() {
    var x = 5
    console.log(x)  // 5
}
func()
console.log(x) // 7

// let - block scope
let x = 5;
if (true) {
    let x = 10
    console.log(x) // 10
}
console.log(x) // 5

// const - constant (cannot be reassigned)
const num1 = 45
// num1 = 50 // Error!
```

### 2. Template Literals

```javascript
let num1 = 2
let index = 5
console.log(`${num1} * ${index} = ${num1 * index}`) // "2 * 5 = 10"

let nam = "Ali"
console.log(`Hello Everyone, ${nam} is a good person.`) // "Hello Everyone, Ali is a good person."
```

### 3. Spread Operator

```javascript
let smallArr = [10, 11, 12, 13]
let arr = [1, 2, 4, 5, 19, 3, ...smallArr]
console.log(arr) // [1, 2, 4, 5, 19, 3, 10, 11, 12, 13]

// Spread in function calls
console.log(...arr) // 1 2 4 5 19 3 10 11 12 13

// Combining arrays
let arr1 = [1, 3, 5, 7]
let arr2 = [9, 11]
console.log([...arr1, ...arr2]) // [1, 3, 5, 7, 9, 11]
console.log([...arr1, 100, 200, ...arr2]) // [1, 3, 5, 7, 100, 200, 9, 11]
```

### 4. Rest Operator

```javascript
// Rest operator in function parameters
function sum(n1, n2, n3, n4, n5, ...nums) {
    console.log(nums) // [6, 6, 7, 8, 9]
}
sum(1, 2, 3, 4, 5, 6, 6, 7, 8, 9)
```

### 5. Destructuring

```javascript
// Array destructuring
let numbers = [2, 5, 6, 3, 4, 33, 6, 8]
const [num1, num2, , num, , ...nums] = numbers
console.log(num1, num2, num) // 2, 5, 3

let array = ['banana', 'mango', 'apple']
let [fruit1, fruit2] = array
console.log(fruit1 + ' ' + fruit2) // "banana mango"

// Object destructuring
let person = {
    name: "Ali",
    age: "22",
    height: "5.9 f",
    qualification: "BSCS"
}

let {name: firstName, qualification: qual, ...restProps} = person
console.log(firstName, qual, restProps) // "Ali", "BSCS", {age: "22", height: "5.9 f"}

let { firstname, age } = person
console.log(firstname + ' ' + age)
```

### 6. Ternary Operator

```javascript
// Simple ternary
let ans = (2 > 5) ? 5 : 2
console.log(ans) // 2

// Nested ternary
let ans = (2 > 5) ? 5 : (2 == 2) ? 2 : 0
console.log(ans) // 2

// In template literals
let nameWithSpacing = ""
for (let index = 0; index < firstName.length; index++) {
    nameWithSpacing = nameWithSpacing + firstName.charAt(index) + (index == firstName.length - 1 ? "" : " ")
}
```

### 7. Increment/Decrement Operators

```javascript
let num1 = 22
let num2 = 23

// Prefix increment - increment first, then use
++num1 // num1 becomes 23, then used

// Postfix increment - use first, then increment
num1++ // num1 is used as 22, then becomes 23

// Prefix decrement
--num1

// Postfix decrement
num1--

if (num2 == num1++) {
    console.log(`${num1} and ${num2} are equal`)
}
```

## Data Structures

### 1. Arrays

#### i. Creation & Initialization

```javascript
// Array literal
let nums = [4, 5, 3, 5, 3, "7"]
var nums = [1, "ahmad", false, 4]

// Array with initial size
let ans = new Array(2 * n)
let nums = new Array(n)

// Array of objects
let students = [
    { nam: "ali", marks: 90 },
    { nam: "ahmad", marks: 70 },
    { nam: "hamza", marks: 99 }
]
```

#### ii. Accessing Elements

```javascript
let nums = [4, 5, 3, 5, 3]

// Access by index
console.log(nums[0]) // 4
console.log(nums[3]) // 5

// Access last element
console.log(nums[nums.length - 1]) // 3

// Length property
console.log(nums.length) // 5
```

#### iii. Array Methods

```javascript
let arr = [1, 2, 3]

// push() - add to end
arr.push(4) // [1, 2, 3, 4]

// pop() - remove from end
arr.pop() // returns 4, arr = [1, 2, 3]

// shift() - remove from beginning
arr.shift() // returns 1, arr = [2, 3]

// unshift() - add to beginning
arr.unshift(0) // [0, 2, 3]

// map() - transform array
let doubled = arr.map(function(item) {
    return item * 2
})

// filter() - filter elements
let filtered = arr.filter(function(item) {
    return item > 1
})

// find() - find first match
let found = arr.find(function(item) {
    return item > 1
})

// reduce() - reduce to single value
let sum = arr.reduce(function(prev, cur) {
    return prev + cur
}, 0)

// includes() - check if contains
console.log(arr.includes(2)) // true

// findIndex() - find index
console.log(arr.findIndex(item => item == 2)) // 1

// reverse() - reverse array
arr.reverse() // [3, 2, 1]

// fill() - fill with value
arr.fill(1) // [1, 1, 1]

// splice() - remove/insert
let nums = [3, 2, 4, 2, 4, 5, 6, 3, 5, 3, 4]
nums.splice(2, 1) // removes element at index 2
```

#### iv. Iteration

```javascript
let nums = [4, 5, 3, 5, 3]

// for loop
for (let index = 0; index < nums.length; index++) {
    console.log("element at index ", index, " -> ", nums[index])
}

// for...of loop
for (const num of nums) {
    console.log(num)
}

// forEach() method
nums.forEach(function(item, index) {
    console.log(item, index)
})
```

#### v. Common Array Patterns

```javascript
// Double every element
function doubleTheElements(numbers) {
    for (let index = 0; index < numbers.length; index++) {
        numbers[index] = numbers[index] * 2
    }
    return numbers
}

let numbersInput = [4, 5, 3, 5, 3]
let numbersOutput = doubleTheElements(numbersInput)
console.log("Double array -> ", numbersOutput) // [8, 10, 6, 10, 6]

// Find maximum in array
let nums = [3, 2, 4, 2, 4, 5, 60, 3, 500, 3, 4]
let max = -Infinity
for (let index = 0; index < nums.length; index++) {
    if (max < nums[index]) {
        max = nums[index]
    }
}
console.log(max) // 500

// Binary search
let nums = [1, 12, 23, 34, 599, 3567, 5678]
let num = 3567
let start = 0
let end = nums.length - 1
let ansLocation = -1

while(start <= end){
    let mid = Math.floor((start + end) / 2)
    if (nums[mid] == num) {
        ansLocation = mid
        break
    }
    if(nums[mid] < num){
        start = mid + 1
    } else {
        end = mid - 1
    }
}
console.log(ansLocation) // 5
```

### 2. Objects

#### i. Creation

```javascript
// Object literal
const person = {
    fName: "Ali",
    ID: "2345902034759023475",
    age: 22,
    run: function() {
        return "He runs very fast."
    }
}

// Object with array property
let person = {
    name: "Ahmad",
    education: ["BSCS", "SMIT Certified"],
    ID: "765432",
    run: function () {
        return "Ahmad is running."
    }
}
```

#### ii. Accessing Properties

```javascript
let person = {
    name: "Ahmad",
    age: 22
}

// Dot notation
console.log(person.name) // "Ahmad"
console.log(person.age) // 22

// Bracket notation
console.log(person["name"]) // "Ahmad"
console.log(person["age"]) // 22

// Accessing methods
console.log(person.run()) // "He runs very fast."
```

#### iii. Iteration

```javascript
let person = {
    name: "Ahmad",
    age: 22,
    run: function() {
        return "Ahmad is running."
    }
}

// for...in loop
for (const key in person) {
    console.log(key) // "name", "age", "run"
    if (key == "run") {
        console.log(person[key]()) // call function
    } else {
        console.log(person[key]) // get value
    }
}

// Using Object.keys()
let keys = Object.keys(person) // ["name", "age", "run"]
for (let index = 0; index < keys.length; index++) {
    console.log(person[keys[index]])
}

// Using Object.values()
let values = Object.values(person) // ["Ahmad", 22, function...]
```

#### iv. Array of Objects

```javascript
let classData = [
    {
        name: "Ahmad",
        education: "BSCS",
        ID: "765432",
        run: function () {
            return "Ahmad is running."
        }
    },
    {
        name: "aqib",
        education: "BSCS",
        ID: "765432"
    }
]

// Iterate and filter
for (let index = 0; index < classData.length; index++) {
    if (classData[index].name == "aqib") {
        console.log(classData[index])
    }
}
```

### 3. Classes (OOP)

#### i. Class Definition

```javascript
class Student {
    constructor(name, age, dob) { // constructor function automatically called when creating new object
        this.name = name // called data member
        this.age = age
        this.dob = dob
    }

    display(){ // called member function
        console.log(this.name, this.age, this.dob)
    }
}
```

#### ii. Object Creation

```javascript
const student1 = new Student("Zubair", "20", "2004")
const student2 = new Student("Ali", "24", "2000")

student1.display() // "Zubair 20 2004"
console.log("student1 :", student1)
student2.display() // "Ali 24 2000"
```

## DOM Manipulation

### 1. Selecting Elements

```javascript
// getElementById
let display = document.getElementById('display')

// querySelector (if needed)
let element = document.querySelector('#display')
```

### 2. Modifying Elements

```javascript
// innerHTML - set HTML content
display.innerHTML = currentInput

// innerText - set text content
display.innerText = currentInput

// textContent - set text content (alternative)
display.textContent = currentInput
```

### 3. Event Handling

```javascript
// Event listeners (typically in HTML or added via addEventListener)
// Example from calculator project
function updateDisplay() {
    display.innerHTML = currentInput
}

function clearDisplay() {
    currentInput = '0'
    operator = null
    previousInput = null
    dotExist = false
    updateDisplay()
}
```

## Browser Control

### 1. Window Object

```javascript
// Get current URL
console.log(window.location.href)

// Get hostname
console.log(window.location.hostname)

// Get pathname
console.log(window.location.pathname)

// Navigate to new URL
window.location.replace("https://github.com/Ahmadjajja")
```

### 2. History

```javascript
// Navigate through history
history.go(2) // go forward 2 pages
history.go(-1) // go back 1 page
```

### 3. User Input

```javascript
// prompt() - get user input
var firstName = prompt("Enter your first name : ", "Ahmad")
var secondName = prompt("Enter your second name : ", "Sultan")

// alert() - show message
alert(`${price1} is greater than ${price2}`)
```

## Error Handling

### 1. Try-Catch

```javascript
try {
    num
    num
    throw "somethings wrong!"
    num
    console.log("Hello Everyone!")
} catch (error) {
    console.log("Error happened: ", error)
}

console.log("asdfasdf")
```

### 2. Throw Statement

```javascript
// Throw custom error
throw "somethings wrong!"
throw new Error("Custom error message")
```

## Asynchronous JavaScript

### 1. Event Loop

```javascript
// JavaScript is single-threaded
// Event Loop manages:
// 1. Call Stack - where functions are executed
// 2. Callback Queue - where callbacks wait

let num1 = 4
let num2 = 5

setTimeout(() => {
    console.log(num1, num2) // Executed after call stack is empty
}, 0)

function sum(n1, n2) {
    return n1 + n2
}

console.log(sum(num1, num2)) // Executed first
```

### 2. Callbacks

```javascript
// Simple callback
function greet(name) {
    console.log(`Hello, I'm ${name[0]} ${name[1]}`)
}

function secondFunc(fullName, callback) {
    let nameArr = fullName.split(" ")
    callback(nameArr)
}

secondFunc("Ahmad Sultan", greet)

// Callback in function
function job(callback1, callback2) {
    callback1()
    callback2()
    callback2()
    callback2()
}
```

### 3. Promises

```javascript
// Create promise
let promise = new Promise((success, reject) => {
    let promiseContent = "kaam kr k ayen hyn."
    if (promiseContent == "kaam kr k ayen hyn.") {
        success("I have done the work.")
    } else {
        reject("I haven't done the work")
    }
})

// Handle promise
promise
    .then((res) => {
        console.log(res)
    })
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log("err: ", err)
    })

// Promise chain
let prom = new Promise((resolve, reject) => {
    resolve("Start counting")
})

function counter(value) {
    console.log(value)
}

prom
    .then((res) => {
        counter(res)
        return "One"
    })
    .then((res) => {
        counter(res)
        return "Two"
    })
    .then((res) => {
        counter(res)
        return "Three"
    })
    .catch((res) => {
        counter(res)
    })
```

### 4. Async/Await

```javascript
// Async function
let saysomething = (num) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Something" + num)
        }, 2000)
    })
}

let talk = async (n) => {
    let promise = await saysomething(n)
    console.log(promise)
}

talk(2)
talk(4)
talk(6)

// Async with await
let counter = 0
function func1(args1) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            counter++
            resolve([counter, args1])
        }, 1000)
    })
}

let func2 = async (value) => {
    console.log("counter: ", counter)
    console.log("value: ", value)
    let returnedValue = await func1(value)
    console.log("returnedValue: ", returnedValue)
}

for (let index = 1; index <= 10; index++) {
    func2(index)
}
```

### 5. setTimeout and setInterval

```javascript
// setTimeout - execute after delay
setTimeout(() => {
    console.log("Hello Everyone!")
}, 3000)

// setInterval - execute repeatedly
let count = 0
let interval = setInterval(encourage, 5000)

function encourage() {
    console.log("You're doing great, keep going!")
    console.log("count - ", count)
    count++
    if (count == 2) {
        clearInterval(interval) // stop interval
    }
}
```

## Control Flow

### 1. Loops

```javascript
// for loop
for (let index = 1; index < 11; index++) {
    console.log(index)
}

// while loop
let num = 1030
let count = 0
while (num >= 1) {
    num = num / 10
    count++
}
console.log("count -> ", count)

// do...while loop
do {
    // code
} while (condition)

// for...in loop (objects)
for (const key in person) {
    console.log(person[key])
}

// for...of loop (arrays, strings)
for (const num of nums) {
    console.log(num)
}

// break - exit loop
for (let index = 0; index < 100; index++) {
    if (index > 5 && index < 99) {
        continue // skip to next iteration
    }
    console.log(index)
}
```

### 2. Conditionals

```javascript
// if/else
if (num1 > 40) {
    console.log("num1 is greater than 40")
} else {
    console.log("num1 is not greater than 40")
}

// if/else if/else
if (marks > 80) {
    callback("A")
} else if (marks > 60) {
    callback("B")
} else if (marks > 50) {
    callback("C")
} else if (marks > 40) {
    callback("D")
} else {
    callback("F")
}

// switch/case
function displayGradeInfo(g) {
    switch (g) {
        case "A":
            console.log(`Ahmad got ${g} grade`)
            break
        case "B":
            console.log(`Ahmad got ${g} grade`)
            break
        case "C":
            console.log(`Ahmad got ${g} grade`)
            break
        case "D":
            console.log(`Ahmad got ${g} grade`)
            break
        case "F":
            console.log(`Ahmad got the ${g} grade`)
            break
        default:
            console.log(`Incorrect Input`)
            break
    }
}

// Logical operators
// AND (&&)
if (sum > 20 && sum != 20) {
    console.log("sum is greater than 20")
}

// OR (||)
if (condition1 || condition2) {
    // code
}

// NOT (!)
if (!condition) {
    // code
}
```

## String Operations

### 1. Common Patterns

```javascript
// Calculate string length
function calculateLength(userName) {
    return userName.length
}
console.log(calculateLength("shahzad")) // 7

// Concatenate strings
var firstName = "Ahmad"
var secondName = "Ali"
console.log(firstName + " " + secondName) // "Ahmad Ali"

// Check if string is empty
function checkString(str) {
    if (!str.trim()) {
        return "Empty String"
    } else {
        return "No Empty String"
    }
}
console.log(checkString("Ahmad")) // "No Empty String"

// Count vowels in string
function countVowels(str) {
    let count = 0
    str = str.toLowerCase()
    for (let index = 0; index < str.length; index++) {
        let character = str.charAt(index)
        if (character == "a" || character == "e" || character == "i" || 
            character == "o" || character == "u") {
            count++
        }
    }
    return count
}
console.log(countVowels("Ahmad")) // 2

// Convert to uppercase
let str = "Ahmad"
console.log(str.toUpperCase()) // "AHMAD"

// Find first occurrence
let firstName = "Ahmad"
let removingIndex = firstName.indexOf("ma")
console.log(removingIndex) // 2

// Remove substring
let firstName = "Ahmad"
let removingIndex = firstName.indexOf("ma")
firstName = firstName.slice(0, removingIndex) + firstName.slice(removingIndex + "ma".length)
console.log(firstName) // "Ahd"

// Print every character
let firstName = "Ahmad"
let nameWithSpacing = ""
for (let index = 0; index < firstName.length; index++) {
    nameWithSpacing = nameWithSpacing + firstName.charAt(index) + 
        (index == firstName.length - 1 ? "" : " ")
}
console.log(nameWithSpacing) // "A h m a d"
```

## Modules (ES6)

### 1. Export

```javascript
// Export default
const num1 = 50
const num2 = 40
export default { num1, num2 }
```

### 2. Import

```javascript
// Import default
import nums from "./main.js"
let sumOfItself = (n1, n2) => n1 + n2
console.log(sumOfItself(nums.num1, nums.num2))
```

## Common Algorithms

### 1. Finding Maximum

```javascript
let nums = [3, 2, 4, 2, 4, 5, 60, 3, 500, 3, 4]
let max = -Infinity
for (let index = 0; index < nums.length; index++) {
    if (max < nums[index]) {
        max = nums[index]
    }
}
console.log(max) // 500
```

### 2. Sum of Digits

```javascript
let num = 1030
let sum = 0
while (num >= 1) {
    sum = Math.floor(sum + num % 10)
    num = Math.floor(num / 10)
}
console.log("sum -> ", sum) // 4
```

### 3. Number of Digits

```javascript
let num = 1030
let count = 0
while (num >= 1) {
    num = num / 10
    count++
}
console.log("count -> ", count) // 4
```

### 4. Fibonacci Series

```javascript
let e1 = 0
let e2 = 1
let n = 1000

for (let index = 2; index < n; index++) {
    let temp = e1
    e1 = e2
    e2 = e2 + temp
    console.log(e2)
}
```

### 5. Delete All Occurrences

```javascript
let deletionValue = 3
let nums = [3, 2, 4, 2, 4, 5, 6, 3, 5, 3, 4]

for(let index = 0; index < nums.length; index++){
    if (nums[index] == deletionValue) {
        nums.splice(index, 1)
        index-- // adjust index after deletion
    }
}
console.log(nums) // [2, 4, 2, 4, 5, 6, 5, 4]
```

## Notes

- **Block Scoping**: `let` and `const` are block-scoped, `var` is function/global scoped
- **Template Literals**: Use backticks and `${}` for string interpolation
- **ES6 Features**: Arrow functions, spread/rest operators, destructuring, classes, modules
- **JavaScript is Single-threaded**: Uses event loop for asynchronous operations
- **Case-sensitive**: JavaScript is case-sensitive (e.g., `name` vs `Name` are different)
- **Type Coercion**: JavaScript automatically converts types in some operations
- **Hoisting**: `var` declarations are hoisted, `let` and `const` are not
