---
title: Cpp Reference Guide
date: 2025-11-13
---


## Important functions 

### 1. Built in
```cpp
 toupper(s[i])
 s[i] = tolower(s[i]);
 sort(nums.begin(), nums.end());
 to_string(i);
 sort(matchsticks.begin(), matchsticks.end(), greater<int>()); // sort in decreasing order
 reverse(nums.begin(), nums.end()); // for vector

//  apply binary search
  vector<int> vec = { 1, 2, 3, 4, 5, 6};
  bool res = binary_search(vec.begin(), vec.end(), 3);
  if (res) cout << "yes";

```



### 2. Custom

#### i. isPrime

```cpp
    bool isPrime(int num){
        if(num < 2) return false;
        if(num == 2) return true;
        if(num % 2 == 0) return false;
        for(int i = 3; i <= sqrt(num); i+=2){
            if(num % i == 0)
                return false;
        }

        return true;
    }
```



## Operations

### 1. Create a hash map of a to z
```cpp
//create a hash map of a to z
for (char ch = 'a'; ch <= 'z'; ch++) {
   map[ch] = ch - 'a';
}
```

### 2. append all the characters inside the map into the string
```cpp
while(!map.empty()) {
    auto it = map.begin(); 
    res += std::string(it->second, it->first); // if c->3 then returns ccc
    map.erase(it->first); 
}

```


## Data Structures


### 1. vector


#### i. Insertion
``` cpp
vector<int> v;
// Insert at end
v.push_back(1);
v.push_back(2);
// Insert at specific position
v.insert(v.begin() + 1, 5);  // insert 5 at index 1
// Insert multiple elements
v.insert(v.end(), {3, 4, 5});


// insert pairs
  vector<pair<int, int>> ans;
  ans.push_back({c, i}); 

v.emplace_back(3); // insert at the end


v1.insert(v1.begin(). 300); // insert a vector
v1.insert(v1.begin(), copy.begin(), copy.end()) // insert a vector named copy in v1


```
#### ii. Erasing
``` cpp
v.pop_back();  // removes last element
// Erase element at specific position
v.erase(v.begin() + 1);  // removes element at index 1
// Erase a range
v.erase(v.begin(), v.begin() + 2);  // removes first 2 elements
// Clear all elements
v.clear();


vector<int> v1 = {1111,2,321,3,4,5};
v1.erase(v1.begin() + 2, v1.begin() + 4);

```
#### iii. Access
``` cpp
cout << "First element: " << v.front() << endl;
cout << "Last element: " << v.back() << endl;
cout << "Element at index 2: " << v[2] << endl;
cout << "Element at index 2 (safe): " << v.at(2) << endl;  // throws exception if out of bounds

  // using iterators
  vector<int> v1 = {1,2,3};
  vector<int>::iterator it = v1.begin();
  it += 2;
  cout << *(it);


```
#### iv. Size and Capacity
``` cpp
cout << "Size: " << v.size() << endl;
cout << "Capacity: " << v.capacity() << endl;
cout << "Is empty: " << v.empty() << endl;
v.reserve(100);  // reserve space for 100 elements
v.resize(10);    // resize to 10 elements


  // copy ans vector into nums
  copy(ans.begin(), ans.end(), nums.begin());         
  // reseize a vector to a new size
  nums.resize(n);

```
#### v. Printing
```cpp
for (int i = 0; i < v.size(); i++)
    cout << v[i] << " ";
// or
for (int x : v)
    cout << x << " ";

cout << v1.at(0); // same as v[0]


// easy way to iterate a vector of vector
items1 = [[1,1],[4,5],[3,8]]
for (int i = 0; i < items1.size(); i++) {
	map[items1[i][0]] = items1[i][1];
}
// OR
for (const auto& item : items1) {
   map[item[0]] = item[1];
}


```


####  vi. copying a vector
```cpp
   vector<int> v1 = {1,2,3};
   vector<int> v2(v1);
  ```  

#### vi. initialization

``` cpp
  vector<int> ans(2 * n);
  vector<long long> nums(n);

  // create with some initial data
  vector<vector<int>> res = { {1, 2, 3}, {2, 5, 6}, {1, 2, 3} };

  // create with specific no of rows
  vector<int> result(height.size() * height.size());

  // create with specific no of rows but no specific cols
  vector<vector<int>> ans(2, vector<int>());
  vector<vector<int>> edges(V, vector<int>());

// create with specific no of rows and cols
  vector<vector<int>> nums(n, vector<int>(n));

   // creating a 2d matrix with all the enteries as 0. we have +1 row and +1 col here too. 
   vector<vector<int>> dp(matrix.size() + 1, vector<int>(matrix[0].size() + 1, 0)); 

// create with some initial dummy data for all the enteries
  vector<int> v(5,20); // {20,20,20,20,20}


// dealing with matrices
  int row = image.size();
  int col = image[0].size();
  vector<vector<int>> ans(row, vector<int>(col));

```



####  vii. swapping a vector
```cpp
  v1.swap(v2)
  ```


#### viii. memoize matrix

```cpp
vector<vector<int>> dp(m, vector<int>(n, -1));
```






---

### 2. stack

#### i. Insertion
``` cpp
stack<int> st;
st.push(1);
st.push(2);
st.push(3);
```
#### ii. Removal
``` cpp
st.pop();  // removes top element (no return value)
```
#### iii. Access
``` cpp
cout << "Top element: " << st.top() << endl;
```
#### iv. Size
``` cpp
cout << "Size: " << st.size() << endl;
cout << "Is empty: " << st.empty() << endl;
```
#### v. Printing (destructive)
```cpp
// Print all elements (empties the stack)
while (!st.empty()) {
    cout << st.top() << " ";
    st.pop();
}

```

#### vi. swap stacks
```cpp
  st1.swap(st2);
```



---

### 3. queue

#### i. Insertion
``` cpp
queue<int> q;
q.push(1);
q.push(2);
q.push(3);
```
#### ii. Removal
``` cpp
q.pop();  // removes front element (no return value)
```
#### iii. Access
``` cpp
cout << "Front element: " << q.front() << endl;
cout << "Back element: " << q.back() << endl;
```
#### iv. Size
``` cpp
cout << "Size: " << q.size() << endl;
cout << "Is empty: " << q.empty() << endl;
```
#### v. Printing (destructive)
```cpp
// Print all elements (empties the queue)
while (!q.empty()) {
    cout << q.front() << " ";
    q.pop();
}
```

---

### 4. deque
#### i. Insertion
``` cpp
deque<int> dq;
dq.push_back(1);   // insert at end
dq.push_front(0);  // insert at beginning
dq.insert(dq.begin() + 1, 5);  // insert at position
```
#### ii. Erasing
``` cpp
dq.pop_back();   // removes last element
dq.pop_front();  // removes first element
dq.erase(dq.begin() + 1);  // removes element at position
dq.clear();  // removes all elements
```
#### iii. Access
``` cpp
cout << "First element: " << dq.front() << endl;
cout << "Last element: " << dq.back() << endl;
cout << "Element at index 2: " << dq[2] << endl;
```
#### iv. Size
``` cpp
cout << "Size: " << dq.size() << endl;
cout << "Is empty: " << dq.empty() << endl;
```
#### v. Printing
```cpp
for (int x : dq)
    cout << x << " ";
```


### 5. priority_queue

#### i. Insertion (max heap)
``` cpp
priority_queue<int> pq;  // max heap by default
  pq.push(5);
  pq.push(1);
  pq.push(5);
  pq.push(3);
  // output {5, 3, 5, 1}
```

#### ii. Insertion (min heap)
```cpp
priority_queue<int, vector<int>, greater<int>> pq;
  pq.push(5);
  pq.push(1);
  pq.push(5);
  pq.push(3);
  pq.push(1);
  pq.push(3);
  pq.push(3);
  pq.push(3);

  // output {1 1 3 3 3 5 3 5}  
```


#### iii. Removal
``` cpp
pq.pop();  // removes top (max/min) element
```
#### iv. Access
``` cpp
cout << "Top element: " << pq.top() << endl;
```
#### v. Size
``` cpp
cout << "Size: " << pq.size() << endl;
cout << "Is empty: " << pq.empty() << endl;
```
#### vi. Printing (destructive)
```cpp
// Print all elements (empties the priority queue)
while (!pq.empty()) {
    cout << pq.top() << " ";
    pq.pop();
}
```

---

### 6. set



#### i. Insertion
``` cpp
set<int> s;
s.insert(1);
s.insert(2);
s.insert(1);  // duplicate ignored
```
#### ii. Erasing
``` cpp
s.erase(1);  // removes element 1
auto it = s.find(2);
if (it != s.end())
    s.erase(it);  // removes element at iterator
s.clear();  // removes all elements

// delete a range in set
  auto it1 = st.find(1);
  auto it2 = st.find(5);
  st.erase(it1, it2);

```


### iii. Search/find in set
```cpp
    auto it = st.find(6)

    if(st.find(x) != st.find(6)); // if true element is present in the set

    // another way
    unordered_set<int> visited;
    if (visited.count(n)) ; // the number exists in the set

    set<int> st = { 1, 2, 3, 4, 5, 6};
    auto it = st.find(5);
    cout << *(it);

    // Another way
    set<int> sett = { 1, 2, 3, 4, 5, 6};
    int a = 5;
    if (sett.count(5) > 0) cout << "present in the set"; // it returns 1 if the elemnt is present and 0 if not
```



#### iv. Size
``` cpp
cout << "Size: " << s.size() << endl;
cout << "Is empty: " << s.empty() << endl;
```
#### v. Printing
```cpp
cout << "First element: " << *s.begin() << endl;
cout << "Last element: " << *s.rbegin() << endl;
for (int x : s)
    cout << x << " ";
```

---

### 7. unordered_map

#### i. Insertion
``` cpp
unordered_map<string, int> um;
um["apple"] = 5;
um["banana"] = 3;
um.insert({"orange", 7});

m.insert(make_pair("grape", 2));


// inserting pairs
myMap.insert({key, {i, j}});

```
#### ii. Erasing
``` cpp
um.erase("apple");  // removes key "apple"
auto it = um.find("banana");
if (it != um.end())
    um.erase(it);
um.clear();

map.erase(order[i]); // the character present at order[i] would be removed from the map


```
#### iii. Access and Search
``` cpp
cout << "Value: " << um["apple"] << endl;
cout << "Value (safe): " << um.at("apple") << endl;
if (um.find("banana") != um.end())
    cout << "Found" << endl;
if (um.count("orange") > 0)
    cout << "Found" << endl;


if (myMap.find(key) == myMap.end())	{
    // do something
  }

  if(visited.count(n)) return false;

```


#### iv. Size
``` cpp
cout << "Size: " << um.size() << endl;
cout << "Is empty: " << um.empty() << endl;
```

#### v. Printing
```cpp
for (auto& [key, value] : um)
    cout << key << ": " << value << endl;


// printing pairs
map<string, pair<int, int>> myMap;
for (auto it = myMap.begin(); it != myMap.end(); ++it){
			// std::cout << it->second.first << " " << it->second.second << std::endl;
			v.push_back(it->second.first); // the second item here is a pair. so we are accessing first of that second
			v.push_back(it->second.second);
		}


    for(const auto& num : map1){
        if(num.second == 2) ans.push_back(num.first);
    }

   // iterate a map
    for(auto it:map1){
      countPair += it.second/2;
      countInt += it.second%2;
    }    
    

    for (auto& [key, value] : m)  // C++17
      cout << key << ": " << value << endl;    


```

#### iv. Find occurences
``` cpp
    for(int i : nums) map1[i]++; 

    // in string
    for(char ch: s) map1[ch]++; 
```

#### v. Create adjacency graph

``` cpp
vector<vector<int>> times = { {1,1,1}  ,{2,1,3} ,{3,4,1} };
unordered_map<int, vector<pair<int, int>>> map;

for (vector<int> data : times) {
    map[data[0]].push_back({ data[1], data[2] });
}
```


---

### 8. unordered_set

#### i. Insertion
``` cpp
unordered_set<int> us;
us.insert(1);
us.insert(2);
us.insert(1);  // duplicate ignored
```
#### ii. Erasing
``` cpp
us.erase(1);  // removes element 1
auto it = us.find(2);
if (it != us.end())
    us.erase(it);
us.clear();
```
#### iii. Search
``` cpp
if (us.find(1) != us.end())
    cout << "Found" << endl;
if (us.count(2) > 0)
    cout << "Found" << endl;
```
#### iv. Size
``` cpp
cout << "Size: " << us.size() << endl;
cout << "Is empty: " << us.empty() << endl;
```
#### v. Printing
```cpp
for (int x : us)
    cout << x << " ";
```

---

### 9. list (doubly linked list)

#### i. Insertion
``` cpp
list<int> lst;
lst.push_back(1);   // insert at end
lst.push_front(0);  // insert at beginning
auto it = lst.begin();
advance(it, 1);
lst.insert(it, 5);  // insert before position

  list<int> ls;
  ls.push_back(2);
  ls.emplace_back(4);
  ls.push_front(6);
  // output {6,2,4}
  // rest func same as vec

```
#### ii. Erasing
``` cpp
lst.pop_back();   // removes last element
lst.pop_front();  // removes first element
lst.remove(5);    // removes all elements with value 5
auto it = lst.begin();
lst.erase(it);    // removes element at position
lst.clear();
```
#### iii. Access
``` cpp
cout << "First element: " << lst.front() << endl;
cout << "Last element: " << lst.back() << endl;
```
#### iv. Size
``` cpp
cout << "Size: " << lst.size() << endl;
cout << "Is empty: " << lst.empty() << endl;
```
#### v. Printing
```cpp
for (int x : lst)
    cout << x << " ";
```

### 10 Pairs

#### 1. creating pairs
```cpp
    pair<int, int> p = { 1,2 };
    cout << p.first << " " << p.second;
  ```
  
#### 2. pairs of pairs
```cpp
    pair<int, pair<int, int>> p2 =  {1, { 3 , 4 }};
    cout << p2.first << " " << p2.second.second;
  ```
####  3. pairs of arrays
```cpp
    pair<int, int> arr[] = { {1,2}, {3,4} };
    cout << arr[1].second;
  ```
  
####  4. vector of pairs
```cpp
    vector<pair<int, int>> vec;
    vec.push_back({ 2,7 });
    vec.emplace_back( 2,10 );
    cout << vec[0].second;
  ```

### 11. multiset
#### i. Insertion
``` cpp
multiset<int> ms;
// Insert elements (duplicates allowed)
ms.insert(1);
ms.insert(1);
ms.insert(1);
```
#### ii. Erasing
``` cpp
ms.erase(1);  // removes all 1s
// Erase only ONE occurrence of 1
auto it = ms.find(1);
if (it != ms.end())
    ms.erase(it);  // removes only the first found 1     
// Erase a RANGE of elements (e.g., two occurrences)
auto start = ms.find(1);
auto end = start;
advance(end, 2);  // move iterator 2 steps forward
ms.erase(start, end);      
```
#### iii. Count
``` cpp
cout << "Count of 1: " << ms.count(1) << endl;    
```
#### iv. Printing
```cpp
cout << "First element: " << *ms.begin() << endl;       
// Print all elements
cout << "Elements: ";
for (int x : ms)
    cout << x << " ";
```

## Resources

- [C by Example](https://www.cbyexample.com/)


- [C++ STL Guide For Online Coding Rounds](https://leetcode.com/discuss/post/1387739/c-stl-guide-for-online-coding-rounds-by-tm923/) 
  - contains some explanations for comperators and stuff

- [C++ STL Guide | STL Operations and Time Complexities](https://leetcode.com/discuss/post/1327203/c-stl-guide-stl-operations-and-time-comp-dask/) 
  - shows Time complexities etc

