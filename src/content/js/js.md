---
title: JavaScript Reference Guide
date: 2025-12-18
---


## Important Functions

### 1. Built-in

```javascript
// String methods
str.toUpperCase()
str.toLowerCase()
str.charAt(i)
str.charCodeAt(i)
str.slice(start, end)
str.substring(start, end)
str.split('')
str.trim()
str.includes('substring')
str.indexOf('char')
str.replace('old', 'new')

// Number methods
parseInt(str)
parseFloat(str)
Number(str)
num.toString()
num.toFixed(2)
Math.floor(num)
Math.ceil(num)
Math.round(num)
Math.abs(num)
Math.max(...arr)
Math.min(...arr)
Math.sqrt(num)
Math.pow(base, exp)

// Array methods
arr.sort()
arr.sort((a, b) => a - b) // ascending
arr.sort((a, b) => b - a) // descending
arr.reverse()
arr.join('')
arr.includes(item)
arr.indexOf(item)
arr.find(item => item > 5)
arr.filter(item => item > 5)
arr.map(item => item * 2)
arr.reduce((acc, curr) => acc + curr, 0)
arr.some(item => item > 5)
arr.every(item => item > 5)

// Binary search (requires sorted array)
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

### 2. Custom

#### i. isPrime

```javascript
function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}
```

## Operations

### 1. Create a hash map of a to z

```javascript
const map = {};
for (let i = 0; i < 26; i++) {
  const ch = String.fromCharCode(97 + i);
  map[ch] = i;
}
```

### 2. Append all characters from map into string

```javascript
let res = '';
for (const [char, count] of Object.entries(map)) {
  res += char.repeat(count);
}
```

## Data Structures

### 1. Array

#### i. Insertion

```javascript
const arr = [];
// Insert at end
arr.push(1);
arr.push(2);
// Insert at beginning
arr.unshift(0);
// Insert at specific position
arr.splice(1, 0, 5); // insert 5 at index 1
// Insert multiple elements
arr.push(3, 4, 5);
arr.push(...[6, 7, 8]);

// Insert pairs
const ans = [];
ans.push([c, i]);
```

#### ii. Erasing

```javascript
arr.pop(); // removes last element
arr.shift(); // removes first element
// Remove element at specific position
arr.splice(1, 1); // removes 1 element at index 1
// Remove a range
arr.splice(0, 2); // removes first 2 elements
// Clear all elements
arr.length = 0;
// or
arr.splice(0, arr.length);

const v1 = [1111, 2, 321, 3, 4, 5];
v1.splice(2, 2); // remove 2 elements starting at index 2
```

#### iii. Access

```javascript
console.log('First element:', arr[0]);
console.log('Last element:', arr[arr.length - 1]);
console.log('Element at index 2:', arr[2]);
console.log('Element at index 2 (safe):', arr.at(2)); // supports negative indices

// Using iteration
const v1 = [1, 2, 3];
for (let i = 0; i < v1.length; i++) {
  console.log(v1[i]);
}
```

#### iv. Size and Capacity

```javascript
console.log('Length:', arr.length);
console.log('Is empty:', arr.length === 0);

// Copy array
const nums = [...ans];
// or
const nums = Array.from(ans);

// Resize array
nums.length = n;
```

#### v. Printing

```javascript
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
// or
for (const x of arr) {
  console.log(x);
}
// or
arr.forEach(x => console.log(x));

// Easy way to iterate 2D array
const items1 = [[1, 1], [4, 5], [3, 8]];
for (let i = 0; i < items1.length; i++) {
  map[items1[i][0]] = items1[i][1];
}
// OR
for (const [key, value] of items1) {
  map[key] = value;
}
```

#### vi. Copying an array

```javascript
const v1 = [1, 2, 3];
const v2 = [...v1];
// or
const v2 = Array.from(v1);
// or
const v2 = v1.slice();
```

#### vii. Initialization

```javascript
const ans = new Array(2 * n);
const nums = new Array(n);

// Create with initial data
const res = [[1, 2, 3], [2, 5, 6], [1, 2, 3]];

// Create with specific size
const result = new Array(height.length * height.length);

// Create 2D array with specific rows
const ans = Array.from({ length: 2 }, () => []);

// Create 2D array with specific rows and cols
const nums = Array.from({ length: n }, () => new Array(n));

// Create 2D matrix with all entries as 0
const dp = Array.from({ length: matrix.length + 1 }, 
  () => new Array(matrix[0].length + 1).fill(0));

// Create with initial dummy data
const v = new Array(5).fill(20); // [20, 20, 20, 20, 20]

// Dealing with matrices
const row = image.length;
const col = image[0].length;
const ans = Array.from({ length: row }, () => new Array(col));
```

#### viii. Swapping arrays

```javascript
[v1, v2] = [v2, v1];
```

#### ix. Memoize matrix

```javascript
const dp = Array.from({ length: m }, () => new Array(n).fill(-1));
```

---

### 2. Stack (using Array)

#### i. Insertion

```javascript
const st = [];
st.push(1);
st.push(2);
st.push(3);
```

#### ii. Removal

```javascript
st.pop(); // removes and returns top element
```

#### iii. Access

```javascript
console.log('Top element:', st[st.length - 1]);
// or
console.log('Top element:', st.at(-1));
```

#### iv. Size

```javascript
console.log('Size:', st.length);
console.log('Is empty:', st.length === 0);
```

#### v. Printing (destructive)

```javascript
while (st.length > 0) {
  console.log(st.pop());
}
```

#### vi. Swap stacks

```javascript
[st1, st2] = [st2, st1];
```

---

### 3. Queue (using Array)

#### i. Insertion

```javascript
const q = [];
q.push(1);
q.push(2);
q.push(3);
```

#### ii. Removal

```javascript
q.shift(); // removes and returns front element
```

#### iii. Access

```javascript
console.log('Front element:', q[0]);
console.log('Back element:', q[q.length - 1]);
```

#### iv. Size

```javascript
console.log('Size:', q.length);
console.log('Is empty:', q.length === 0);
```

#### v. Printing (destructive)

```javascript
while (q.length > 0) {
  console.log(q.shift());
}
```

---

### 4. Deque (using Array)

#### i. Insertion

```javascript
const dq = [];
dq.push(1);        // insert at end
dq.unshift(0);     // insert at beginning
dq.splice(1, 0, 5); // insert at position
```

#### ii. Erasing

```javascript
dq.pop();           // removes last element
dq.shift();         // removes first element
dq.splice(1, 1);    // removes element at position
dq.length = 0;      // removes all elements
```

#### iii. Access

```javascript
console.log('First element:', dq[0]);
console.log('Last element:', dq[dq.length - 1]);
console.log('Element at index 2:', dq[2]);
```

#### iv. Size

```javascript
console.log('Size:', dq.length);
console.log('Is empty:', dq.length === 0);
```

#### v. Printing

```javascript
for (const x of dq) {
  console.log(x);
}
```

---

### 5. Priority Queue (Min/Max Heap)

JavaScript doesn't have a built-in priority queue. Here's a simple implementation:

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  push(val) {
    this.heap.push(val);
    this.bubbleUp();
  }
  
  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown();
    return top;
  }
  
  top() {
    return this.heap[0];
  }
  
  size() {
    return this.heap.length;
  }
  
  isEmpty() {
    return this.heap.length === 0;
  }
  
  bubbleUp() {
    let idx = this.heap.length - 1;
    while (idx > 0) {
      let parent = Math.floor((idx - 1) / 2);
      if (this.heap[idx] >= this.heap[parent]) break;
      [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
      idx = parent;
    }
  }
  
  bubbleDown() {
    let idx = 0;
    const len = this.heap.length;
    while (true) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let smallest = idx;
      
      if (left < len && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < len && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
      if (smallest === idx) break;
      
      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }
}

// For MaxHeap, change comparison operators in bubbleUp and bubbleDown

const pq = new MinHeap();
pq.push(5);
pq.push(1);
pq.push(3);
console.log(pq.top()); // 1
pq.pop();
console.log(pq.top()); // 3
```

---

### 6. Set

#### i. Insertion/Initialization

```javascript
const wordSet = new Set(wordDict);

const s = new Set();
s.add(1);
s.add(2);
s.add(1); // duplicate ignored
```

#### ii. Erasing

```javascript
s.delete(1); // removes element 1
s.clear();   // removes all elements

// Delete a range (convert to array first)
const arr = [...s];
const filtered = arr.filter(x => x < 1 || x >= 5);
const newSet = new Set(filtered);
```

#### iii. Search/Find

```javascript
if (s.has(6)) {
  console.log('Element exists');
}

const visited = new Set();
if (visited.has(n)) {
  // element exists
}
```

#### iv. Size

```javascript
console.log('Size:', s.size);
console.log('Is empty:', s.size === 0);
```

#### v. Printing

```javascript
console.log('First element:', [...s][0]);
console.log('Last element:', [...s][s.size - 1]);

for (const x of s) {
  console.log(x);
}

// Convert to array
const arr = Array.from(s);
// or
const arr = [...s];
```

---

### 7. Map

#### i. Initialization

```javascript
const mp = new Map();
mp.set(2, ['a', 'b', 'c']);
mp.set(3, ['d', 'e', 'f']);

// Or using object
const mp = {
  2: ['a', 'b', 'c'],
  3: ['d', 'e', 'f']
};
```

#### ii. Insertion

```javascript
const m = new Map();
m.set('apple', 5);
m.set('banana', 3);

// Insert pairs
const myMap = new Map();
myMap.set(key, [i, j]);

// Using object
const obj = {};
obj['grape'] = 2;
```

#### iii. Erasing

```javascript
m.delete('apple'); // removes key 'apple'
m.clear();         // removes all entries

// Using object
delete obj['apple'];
```

#### iv. Access and Search

```javascript
console.log('Value:', m.get('apple'));

if (m.has('banana')) {
  console.log('Found');
}

// Using object
if ('banana' in obj) {
  console.log('Found');
}

if (myMap.has(key)) {
  // do something
}

if (visited.has(n)) return false;
```

#### v. Size

```javascript
console.log('Size:', m.size);
console.log('Is empty:', m.size === 0);

// Using object
console.log('Size:', Object.keys(obj).length);
```

#### vi. Printing

```javascript
for (const [key, value] of m) {
  console.log(`${key}: ${value}`);
}

// Printing pairs
const myMap = new Map();
for (const [key, [first, second]] of myMap) {
  console.log(first, second);
  arr.push(first);
  arr.push(second);
}

// Using object
for (const key in obj) {
  console.log(`${key}: ${obj[key]}`);
}

// Filter values
const ans = [];
for (const [key, value] of map1) {
  if (value === 2) ans.push(key);
}

// Iterate and count
for (const [key, value] of map1) {
  countPair += Math.floor(value / 2);
  countInt += value % 2;
}
```

#### vii. Find Occurrences

```javascript
const map1 = new Map();
for (const num of nums) {
  map1.set(num, (map1.get(num) || 0) + 1);
}

// In string
const map1 = {};
for (const ch of s) {
  map1[ch] = (map1[ch] || 0) + 1;
}
```

#### viii. Create Adjacency Graph

```javascript
const times = [[1, 1, 1], [2, 1, 3], [3, 4, 1]];
const graph = new Map();

for (const [from, to, weight] of times) {
  if (!graph.has(from)) graph.set(from, []);
  graph.get(from).push([to, weight]);
}
```

---

### 8. Object (as Hash Map)

```javascript
const obj = {};

// Insertion
obj['key1'] = 'value1';
obj.key2 = 'value2';

// Access
console.log(obj['key1']);
console.log(obj.key2);

// Check existence
if ('key1' in obj) {
  console.log('exists');
}
if (obj.hasOwnProperty('key1')) {
  console.log('exists');
}

// Delete
delete obj.key1;

// Iterate
for (const key in obj) {
  console.log(`${key}: ${obj[key]}`);
}

// Get keys/values
const keys = Object.keys(obj);
const values = Object.values(obj);
const entries = Object.entries(obj);
```

---

### 9. Tuples (using Arrays)

#### 1. Creating Tuples

```javascript
const t1 = [1, 'hello', 3.14];
const t2 = [42, 'world', 2.71];
```

#### 2. Accessing Elements

```javascript
const t = [10, 'test', 5.5];
console.log(t[0]); // 10
console.log(t[1]); // 'test'
console.log(t[2]); // 5.5

const q = [];
const [i, j, time] = q[0];
```

#### 3. Tuple Size

```javascript
const t = [1, 'abc', 3.14];
console.log(t.length); // 3
```

#### 4. Destructuring

```javascript
const t = [7, 'abc', 9.9];
const [x, y, z] = t;
console.log(x, y, z);
```

#### 5. Ignoring Elements

```javascript
const t = [8, 'skip', 4.56];
const [x, y, ] = t;
console.log(x, y);
```

#### 6. Nested Tuples

```javascript
const nested = [1, ['inner', 2.5]];
console.log(nested[0]);       // 1
console.log(nested[1][0]);    // 'inner'
console.log(nested[1][1]);    // 2.5
```

#### 7. Array of Tuples

```javascript
const vec = [];
vec.push([1, 'first', 1.1]);
vec.push([2, 'second', 2.2]);
console.log(vec[0][1]); // 'first'
```

#### 8. Tuple Comparison

```javascript
const t1 = [1, 'apple'];
const t2 = [1, 'banana'];
if (JSON.stringify(t1) < JSON.stringify(t2)) {
  console.log('t1 is less than t2');
}
```

#### 9. Tuple Concatenation

```javascript
const t1 = [1, 'hello'];
const t2 = [3.14, 'A'];
const combined = [...t1, ...t2];
console.log(combined[2]); // 3.14
```

#### 10. Swapping Tuples

```javascript
let t1 = [1, 'first'];
let t2 = [2, 'second'];
[t1, t2] = [t2, t1];
console.log(t1[0]); // 2
```

---

### 10. Strings

#### i. Common Operations

```javascript
const s = 'hello world';

// Length
console.log(s.length);

// Access character
console.log(s[0]);
console.log(s.charAt(0));

// Convert to array
const arr = s.split('');
const arr2 = [...s];
const arr3 = Array.from(s);

// Substring
console.log(s.substring(0, 5));
console.log(s.slice(0, 5));
console.log(s.slice(-5)); // last 5 chars

// Search
console.log(s.includes('world'));
console.log(s.indexOf('world'));
console.log(s.lastIndexOf('o'));

// Replace
console.log(s.replace('world', 'javascript'));
console.log(s.replaceAll('o', '0'));

// Case conversion
console.log(s.toUpperCase());
console.log(s.toLowerCase());

// Trim
console.log(s.trim());
console.log(s.trimStart());
console.log(s.trimEnd());

// Repeat
console.log('a'.repeat(5)); // 'aaaaa'

// Pad
console.log('5'.padStart(3, '0')); // '005'
console.log('5'.padEnd(3, '0'));   // '500'

// Check start/end
console.log(s.startsWith('hello'));
console.log(s.endsWith('world'));
```

#### ii. String Builder

```javascript
// Using array (efficient for many concatenations)
const builder = [];
builder.push('hello');
builder.push(' ');
builder.push('world');
const result = builder.join('');

// Template literals
const name = 'John';
const age = 30;
const str = `My name is ${name} and I am ${age} years old`;
```

---

## Resources

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)
- [BigO Cheat Sheet](https://www.bigocheatsheet.com/)