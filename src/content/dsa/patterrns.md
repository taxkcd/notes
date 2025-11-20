---
title: Patterns
date: 2025-11-13
---


## Array Manipulation

#### 1. [product of array except self](https://leetcode.com/problems/product-of-array-except-self/description/)

``` bash
- use the prefix and suffix sum technique
- precalculate them
- when creating the final output array from them. 
```


#### 2. [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/description/)

``` bash
- we use Set to store unique elements.
- then check element - 1 is not in the set then start checking the longest sequeence
- this works b/c if there is no element less then current, then there is only one possible choice. more then this.

```


#### 3. [Two Sum II - Input Array Is Sorted](https://claude.ai/share/1c6b97fb-b37a-4f1a-8669-7f00553ea666)

``` bash
- indices description confused me but it is the same. easy
```


##### visualisation

``` bash
main()
  └─ longestConsecutive(nums = [100, 4, 200, 1, 3, 2])
       ├─ Create num_set = {1, 2, 3, 4, 100, 200}
       ├─ For num = 100:
       │    ├─ Check num - 1 = 99 in set? No → Start sequence
       │    ├─ While loop: Check 101? No → Exit
       │    └─ max_length = 1
       ├─ For num = 4:
       │    └─ Check num - 1 = 3 in set? Yes → Skip
       ├─ For num = 200:
       │    ├─ Check num - 1 = 199 in set? No → Start sequence
       │    ├─ While loop: Check 201? No → Exit
       │    └─ max_length = 1
       ├─ For num = 1:
       │    ├─ Check num - 1 = 0 in set? No → Start sequence
       │    ├─ While loop iteration 1: Check 2? Yes → current_num = 2
       │    ├─ While loop iteration 2: Check 3? Yes → current_num = 3
       │    ├─ While loop iteration 3: Check 4? Yes → current_num = 4
       │    ├─ While loop iteration 4: Check 5? No → Exit
       │    └─ max_length = 4
       ├─ For num = 3: Skip (2 exists)
       ├─ For num = 2: Skip (1 exists)
       └─ Return max_length = 4
```

## Trees

#### 1. [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/description/)

``` bash
- edge case
- if root is nil then return
- create an empty array (2d)
- create a queue and push root node into it.
- now we do a while loop while it has elements inside it.
- create a levels array to store level element values
- start looping the queue
- pick a node from queue and pop it.
- store its value.
- next check if it's left/right child are available and push in queue
- here we push_back the level array to the result array
- outside while we will return result

```

#### 2. [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/)

``` bash
- think in terms of what is left and right returning
- we will make decision when we have both left and right.
- if we find p or q, then we need to bubble that node upward.
- last return is img. when it get NULL when we find a node. think about it
```


#### 3. [subtree of another tree](https://leetcode.com/problems/subtree-of-another-tree/description/)

``` bash
- so everytime we visit a node. we create a subtree
- we then ask if this matches with SubRoot subtree

```

#### 4. [Same tree](https://leetcode.com/problems/same-tree/description/)

``` bash
- think about how to visualize if like claude did. 
- see chat if don't remember. otherwise draw on paper. really simple
```


##### visualize

``` bash
## Stack Trace

# For trees `p = [1,2,3]` and `q = [1,2,3]`
Call Stack Visualization:

isSameTree(p=1, q=1)                          // Stack Frame 1
│
├─→ p.val(1) == q.val(1) ✓
│
├─→ isSameTree(p=2, q=2)                      // Stack Frame 2
│   │
│   ├─→ p.val(2) == q.val(2) ✓
│   │
│   ├─→ isSameTree(p=null, q=null)            // Stack Frame 3
│   │   └─→ return true                       // Pop Frame 3
│   │
│   ├─→ isSameTree(p=null, q=null)            // Stack Frame 4
│   │   └─→ return true                       // Pop Frame 4
│   │
│   └─→ return true                           // Pop Frame 2
│
└─→ isSameTree(p=3, q=3)                      // Stack Frame 5
    │
    ├─→ p.val(3) == q.val(3) ✓
    │
    ├─→ isSameTree(p=null, q=null)            // Stack Frame 6
    │   └─→ return true                       // Pop Frame 6
    │
    ├─→ isSameTree(p=null, q=null)            // Stack Frame 7
    │   └─→ return true                       // Pop Frame 7
    │
    └─→ return true                           // Pop Frame 5

Final return: true                            // Pop Frame 1


# Recursion Tree (logical flow)           Call Stack (execution flow)
# --------------------------------------------------------------------

          (1,1)                             isSameTree(1,1)
         /     \                                   |
     (2,2)     (3,3)                        stack grows ↓
      / \       / \
   (0,0) (0,0) (0,0)(0,0)

                                          isSameTree(2,2)
                                                |
                                          isSameTree(null,null)
                                          isSameTree(null,null)
                                          (returns)
                                          isSameTree(3,3)
                                                |
                                          isSameTree(null,null)
                                          isSameTree(null,null)
                                          (returns)
                                          ALL DONE



```

#### 2. [Validate BST](https://leetcode.com/problems/validate-binary-search-tree/description/)

``` bash
- min max range and it is very simple. 
- thing to be aware of, do not return early. make sure to validate all ancestors.
- fixed using condition
- both trees are needed to make a decision

```

##### visualizations

``` bash
### Invalid BST `[5,1,4,null,null,3,6]`
Time →
                                                                    
CALL    CALL    CALL    RET     CALL    RET     RET     CALL    RET     RET
#1      #2      #3      true    #4      true    true    #5      false   false
node=5  node=1  NULL    ↑       NULL    ↑       ↑       node=4  ↑       ↑
min=-∞  min=-∞  ────────┘       ────────┘       │       min=5   │       │
max=+∞  max=5                                   │       max=+∞  │       │
  │       │                                     │       4≤5 ✗   │       │
  │       └─────────────────────────────────────┘       FAIL    │       │
  └────────────────────────────────────────────────────────────┘       │
                                          FINAL RETURN: false ──────────┘


### Valid BST `[2,1,3]`
Time →
                                                                    
CALL    CALL    CALL    RET     CALL    RET     RET     CALL    CALL    RET     CALL    RET     RET     RET
#1      #2      #3      true    #4      true    true    #5      #6      true    #7      true    true    true
node=2  node=1  NULL    ↑       NULL    ↑       ↑       node=3  NULL    ↑       NULL    ↑       ↑       ↑
min=-∞  min=-∞  ────────┘       ────────┘       │       min=2   ────────┘       ────────┘       │       │
max=+∞  max=2                                   │       max=+∞                                  │       │
  │       │                                     │         │                                     │       │
  │       └─────────────────────────────────────┘         └─────────────────────────────────────┘       │
  └────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                          FINAL RETURN: true                                          

### For Invalid Tree: `[5,1,4,null,null,3,6]`

# Recursion Flow:

helper(LLONG_MIN, 5, LLONG_MAX)
├─ Check: LLONG_MIN < 5 < LLONG_MAX? ✓
├─ helper(LLONG_MIN, 1, 5)          // Left child
│  ├─ Check: LLONG_MIN < 1 < 5? ✓
│  ├─ helper(LLONG_MIN, null, 1) → true
│  └─ helper(1, null, 5) → true
│  └─ Return: true && true = true
├─ helper(5, 4, LLONG_MAX)          // Right child
│  ├─ Check: 5 < 4 < LLONG_MAX? ✗  // VIOLATION!
│  └─ Return: false
└─ Return: true && false = false    // Final result                                          


```









## Array Manipulation

#### 1. [product of array except self](https://leetcode.com/problems/product-of-array-except-self/description/)

``` bash
- use the prefix and suffix sum technique
- precalculate them
- when creating the final output array from them. 
```


#### 2. [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) And [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/description/) 

``` bash
- very specific algo is used here. 
- think of bestSum and currentSum
```

``` bash
- this was a difficult one. couldn't have come up with the solution on my own. 
- need to keep track of minProduct and maxProduct. 
- just dry run it. no other good way. 
```




## Dynamic Programming

#### 1. [Permutations](https://leetcode.com/problems/permutations/?envType=problem-list-v2&envId=plakya4j)

``` bash
- we need to return 2d array.
- base case would return an array if nums has only 1 element
- we will pick each number from nums one by one and store the rest of numbers in another array
- then we will again call the function with remaining numbers
- at this point, we have a 2d array with one element in it.
- now this 2d array will store our final result.
- first we are going to add the selected number in the begining, this will complete 1 permutation.
- add the result in result array.

```
#### 2. [house robber](https://leetcode.com/problems/house-robber/description/)

``` bash
# recursive
- draw the recursion tree to understand the logic.
- a lot of repeated logic, so create a dp array is needed for memoization
- recursive function would need size of array with other required fields.
- base case when size is 0 means we have arrive at the end of the tree. 
- moreover, if we go out of bounds then just 0. 
- 2 possibilities, rob current or skip. 
- if current is robber then n-2 b/c we can't rob the very next house as its n-1 and adjacent.
- if skip the current, then we can rob the n-1.
- out of the above 2 options we will pick the one where robbing gives max solution.
- also remember: account for repeated calculations
- return
```
#### 3. [decode ways](https://leetcode.com/problems/decode-ways/)

``` bash
# recursion

- we would need a dp array to store memoized answers
- we would also need to pass a value that we will use to iterate the string
- lets skip base case first
- first we will do the code for when the first character is 1 
- when first character is 2, then we would see upto 26 as valid alphabets
- for the above case we can recursively call the function for i + 1 and i + 2 b/c we can select a single element or a block
- but it first character is other then 1 or 2, we simply call n+1.
- now base cases, order matters.
- first we see if i becomes > s.size(). This happens for block characters only like 10. we return 1 b/c we have moved out of bounds and successfully decoded.
- when current character is 0 we return 0 b/c 0 is not valid, 03 is also not valid
- if i equals string size, means we are on one valid last character and return 1

# Iterative

- check if the string is empty or starts with zero, in that case we can't decode it.
- dp will keep track of total counts
- we initialize first 2 positions as 1 b/c it is clear that if first digit is not zero then anything from 0-9 is valid.
- then we will iterate s from position 2
- till now, we are only clear about the count till index 1.
- for the rest of them we will check two things. if given digit is valid as a single digit. Or, it is valid as a group of 2.
- for one digit we only need to look at previous digit and see it it is b/w 1 and 9
- for 2 digits we need to look at the 2 digits before. it can be 1 or 2 and nothing other then that. 
- in case of 2, it needs to be b/w 0 and 6. 

```
#### 4. [unique paths](https://leetcode.com/problems/unique-paths/)

``` bash

- we would need a dp vector to store our results. (2d)
- every step has 2 choices either we can move Right or Down. use dp for this.
- base case 1 can be we get out of bound: in that case no path
- base caes 2 we arrive at the solution.
```


#### 5. [Word Break](https://leetcode.com/problems/word-break/description/) 
``` bash
- found this a bit difficult. maybe b/c dp with no recursion.
- the main idea is to check all substrings. use 2 loops. outer from 1.
- initally all the dp would be false. first entry true b/c that is the base case.
- set for easily lookups
```

##### visualizations

``` bash
# claude did an amazing job answering followups. 

s = "leetcode"
wordDict = ["leet", "code"]

i=1:
 j=0 → "l"

i=2:
 j=0 → "le"
 j=1 → "e"

i=3:
 j=0 → "lee"
 j=1 → "ee"
 j=2 → "e"

i=4:
 j=0 → "leet"   ✔️ matches → dp[4] = true
 j=1 → "eet"
 j=2 → "et"
 j=3 → "t"

i=5:
 j=0 → "leetc"
 j=1 → "eetc"
 j=2 → "etc"
 j=3 → "tc"
 j=4 → "c"

i=6:
 j=0 → "leetco"
 j=1 → "eetco"
 j=2 → "etco"
 j=3 → "tco"
 j=4 → "co"
 j=5 → "o"

i=7:
 j=0 → "leetcod"
 j=1 → "eetcod"
 j=2 → "etcod"
 j=3 → "tcod"
 j=4 → "cod"
 j=5 → "od"
 j=6 → "d"

i=8:
 j=0 → "leetcode"
 j=1 → "eetcode"
 j=2 → "etcode"
 j=3 → "tcode"
 j=4 → "code"   ✔️ matches AND dp[4] = true → dp[8] = true
 j=5 → "ode"
 j=6 → "de"
 j=7 → "e"

----
# (detail visualization on claude)

Position:     0    1    2    3    4    5    6    7    8
String:       ""   l    e    e    t    c    o    d    e
              ↑                        ↑                 ↑
             dp[0]                   dp[4]             dp[8]
            (start)              (after "leet")   (after "code")

When we're at `i=4, j=0`:
j=0 (start position)          i=4 (target position)
    ↓                             ↓
    [dp[0]=T] ---"leet"---> [dp[4]=?]
    
We're asking: "Can I reach position 4?"
We check: "I'm at position 0 (which is reachable), 
           and there's a valid word 'leet' from 0 to 4"
Therefore: "Yes! I CAN reach position 4"
Result: dp[4] = true (mark the DESTINATION as reachable)
```




## Graphs

#### 1. [max area of island](https://leetcode.com/problems/max-area-of-island/description/)

``` bash
- traverse the matrix.
- for every one start exploring_area of the island and compare to see if we find the max one. 
- in exploring_area, make sure to not go out of bounds. Also change current box to 0 after exploring
```
#### 2. [Surrounded Regions](https://leetcode.com/problems/surrounded-regions/description/)

``` bash
- we would need to traverse the matrix.
- we will check the end edges and see if we find 'O'
- since edges can never be surrounded so they will remain like that.
- Moreover, anything in their neihbour would also not be able to be surrounded.
- Now that we know that, we will change these to some random alphabet like 'P'
- At the end remaining O will need to be converted to X. and P to O
```
#### 3. [course schedule](https://leetcode.com/problems/course-schedule/description/)

``` bash
- we need to create adj list, remember that this is a directed graph. 
- then we are going to need a vector thats gonna store the indegree
- Also note that the dependent node indegree needs to increase.
- initially consider all nodes have indegree 0, increment only that are required.
- then we would need to have a queue, this will contain only nodes indegree 0.
- then we take each element from the queue one by one.
- now we need to think about all of it's neighbours, there indegree needs to be decremented b/c we have visited (popped) front element in queue.
- Moreover, if zero then it needs to be queued, so we can repeat the whole process again.
- Everytime we pop, we increment count. At the end, if this count is equal totalcourses then true.
```
#### 4. [01-matrix](https://leetcode.com/problems/01-matrix/description/)

``` bash
- need a 2d ans matrix with -1 initialized
- the enteries where we have 0, will be flipped to 0
- We will use these 0 for BFS. bfs will set the distance to its neighbours
- ofcourse, -1 also indicates that we have not visited that area.
- in bfs we do the standard, adding neighbour after processing it.
- impt thing, the distance added would be sum of current node + 1
- return an
```
#### 5. [Number of islands](https://leetcode.com/problems/number-of-islands/description/)

``` bash
- very simple DFS.
- done on every cell with 1. Done
```
#### 6. [Clone Graphs](https://leetcode.com/problems/clone-graph/description/)

``` bash
- need a map. 1-1 mapping from orignal to cloned nodes
- edge cases
- normal bfs
- obviosly, need to check if node already present or not

```

#### 7. [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/description/) 
``` bash
- It was a normal multi search graph problem. 
- The important thing here was how to keep track of time. 
```

##### visualize

``` bash
main() / test harness
  ↓
Solution.orangesRotting(grid)
  ↓
  ├─ Initialization Loop (nested for loops)
  │    └─ Scans each cell: grid[0][0], grid[0][1], ..., grid[m-1][n-1]
  │    └─ Enqueues rotten oranges: queue.push((0,0,0))
  │
  ├─ BFS Loop (while queue not empty)
  │    ├─ Iteration 1: Process (0,0,0)
  │    │    ├─ Check direction (0,1) → rot (0,1), enqueue (0,1,1)
  │    │    ├─ Check direction (1,0) → rot (1,0), enqueue (1,0,1)
  │    │    ├─ Check direction (0,-1) → out of bounds
  │    │    └─ Check direction (-1,0) → out of bounds
  │    │
  │    ├─ Iteration 2: Process (0,1,1)
  │    │    ├─ Check direction (0,1) → rot (0,2), enqueue (0,2,2)
  │    │    ├─ Check direction (1,0) → already rotten
  │    │    ├─ Check direction (0,-1) → already rotten
  │    │    └─ Check direction (-1,0) → out of bounds
  │    │
  │    ├─ Iteration 3: Process (1,0,1)
  │    │    └─ [similar neighbor checks]
  │    │
  │    └─ ... continues until queue empty
  │
  └─ Return maxTime or -1


Initial: [(0,0,0)]
After (0,0,0): [(0,1,1), (1,0,1)]
After (0,1,1): [(1,0,1), (0,2,2)]
After (1,0,1): [(0,2,2), (1,1,2)]
After (0,2,2): [(1,1,2)]
After (1,1,2): [(2,1,3)]
After (2,1,3): [(2,2,4)]
After (2,2,4): []

Time 0:                  Time 1:                  Time 2:
  [2] 1  1                 [2][2] 1                [2][2][2]
   1  1  0                 [2] 1  0                [2][2] 0
   0  1  1                  0  1  1                 0 [2] 1

Time 3:                  Time 4:
  [2][2][2]               [2][2][2]
  [2][2] 0                [2][2] 0
   0 [2] 1                 0 [2][2]

```


``` cpp
queue<tuple<int, int, int>> q; // here we have i, j, time
```

## Linked List

#### 1. [reverse linked list](https://leetcode.com/problems/reverse-linked-list/description/)

``` bash
- three pointers needed. 
- cur and nxt will be at same point initially 
- and prev is NULL initially
- at end, think which pointer to return
```
#### 2. [merge two sorted lists](https://leetcode.com/problems/merge-two-sorted-lists/)

``` bash
- tail pointer will be responsible for creating the new list
- need to think about what happens when traversing and one pointer becomes null
- after comparison, need to think about is it the first time
- big hint. curr1 or curr2 will always move but tail can stay.

```
#### 3. [reverse nodes in k groups](https://leetcode.com/problems/reverse-nodes-in-k-group/)

``` bash

- we will traverse. 
- we check if enough nodes are available to reverse else break out
- once confirmed. move the curr pointer till the end node. 
- you know both new list head and tail
- pass the head to function. it returns new head
- set head and tail segments for new reversed list
- here check if it was first reversal. in that case you need to change the head (for returning)
- otherwise, we know we need to connect both tail of previous segment and now tail of current list to rest of list
- at end, you need to make sure new tail is merged with old list
- plus, store current tail as you are going to need it next time.


1 2 3 4 5

        2               1               3       4   5
segmentHead   reverseHead         curr    

2  1            3               4                5
        segmentHead      reverseHead           curr 
```


#### 4.  [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) 
``` bash
very easy. solved this on my own. think of the way how i solved it.

```

#### 4. [Reorder List](https://leetcode.com/problems/reorder-list/) 

``` bash
- three steps, find middle, push on stack and merge at the end.
- I had the intution but could only write code partially
- my mistake not making sure the first half has an end (NULL)
- merging logic, needed a temp. 
- looked up how to do slow and fast


```

##### visualizing

``` bash
# very good visualization by claude
Step 1: SAVE
   temp = curr->next
   
   1 → 2 → 3
   ↑   ↑
 curr temp

Step 2: CONNECT TO STACK NODE
   curr->next = top
   
   1 → 4
   ↑   
 curr  (top from stack)

Step 3: CONNECT STACK NODE TO SAVED
   top->next = temp
   
   1 → 4 → 2 → 3
           ↑
         temp

Step 4: ADVANCE
   curr = temp
   
   1 → 4 → 2 → 3
           ↑
         curr (ready for next iteration)

```


### Two Pointer approach

#### 1. [3Sum](https://leetcode.com/problems/3sum/)

``` bash
- will use 2 pointer while holding current element.
- most imp is how to skip duplicates. 2 ways. one in outer loop
- other when we are moving left and right.
```
#### 2. [move zeros](https://leetcode.com/problems/move-zeroes/description/)

``` bash
so we will use 2 points. 
one to keep track of the current element.
other to find the first non zero and swap.

aka partition algorithm
```
#### 3. [contianer with most water](https://leetcode.com/problems/container-with-most-water/)

``` bash
- two pointers
- move pointer with small height b/c we want to maximize the area.
- imp thing to note x-axis starts from 0
```




### Resources 

[CPP patterns](https://cpppatterns.com/) 