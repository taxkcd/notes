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

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/daecb494-87d0-453f-8482-2c59680c277a" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/691e28e2-a110-8005-9093-fc982dce5ece" >chatgpt</a>
>  </li>
> </ul>
> </div>

``` bash
- we use Set to store unique elements.
- then check element - 1 is not in the set then start checking the longest sequeence
- this works b/c if there is no element less then current, then there is only one possible choice. more then this.

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


#### 3. [Two Sum II - Input Array Is Sorted](https://claude.ai/share/1c6b97fb-b37a-4f1a-8669-7f00553ea666)




> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/2001a832-351d-4e00-8331-ee791ec56b42" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/691e7086-5f70-8005-9140-a793bf04de6d" >chatgpt</a>
>  </li>
> </ul>
> </div>

``` bash
- indices description confused me but it is the same. easy
```






#### 4 [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) 

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/246acb28-01cf-41c5-bbf6-d8c5c7628b07" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/691fc078-fcec-8005-aa43-0c6e4b23c6f8" >chatgpt</a>
>  </li>
> </ul>
> </div>

``` bash
- I was using sliding window here in the brute force sense.
- later I realized we have to precompute one window.
- and next time thing about the boundry (that is where I was lagging)

```

#### 5. [product of array except self](https://leetcode.com/problems/product-of-array-except-self/description/)

``` bash
- use the prefix and suffix sum technique
- precalculate them
- when creating the final output array from them. 
```


#### 6. [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) And [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/description/) 

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/3b52adc4-a379-417b-9b70-796d93324caf" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/69171a50-cebc-8005-8036-fd528221a2f9" >chatgpt</a>
>  </li>
> </ul>
> </div>

``` bash
- very specific algo is used here. 
- think of bestSum and currentSum
```

``` bash
- this was a difficult one. couldn't have come up with the solution on my own. 
- need to keep track of minProduct and maxProduct. 
- just dry run it. no other good way. 
```




## Sliding Window

#### 1. [Maximum Sum of Distinct Subarrays With Length K](https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/description/)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/8b0f4cad-93f5-4b44-8824-9f09fd73f253" >claude</a>
>  </li>
> </ul>
> </div>

``` bash
- Sliding window of size k with frequency map ( distinct elements) 
- update the maximum sum only when the window has exactly k unique elements.
```

#### 2. [Count Subarrays With Score Less Than K](https://leetcode.com/problems/count-subarrays-with-score-less-than-k/description/)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://excalidraw.com/#json=74R_-7lUozRJmVjTaenDH,RwGb6BHoekOgQFsK9rGZbQ" >excalidraw</a>
>  </li>
> </ul>
> </div>

``` bash
- see excalidraw dry run.
- Use a sliding window / two-pointers approach: 
- expand the right pointer, and shrink the left pointer until the window satisfies the condition, 
- counting all valid subarrays ending at each right index.
```

#### 3. [Average Of Subarrays of size K (Educative)](https://github.com/taimourz/Grooking-Coding-Interviews/blob/main/1%20Sliding%20Window/1.1%20Average%20Of%20Subarrays%20of%20size%20K/code.js)

``` bash
- fixed-size sliding window to keep the sum of k elements.
- Slide the window forward by adding the next value and removing the leftmost one to compute averages efficiently.
```

#### 4. [209. Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/description/)

``` bash
- Use a dynamic sliding window that expands to reach the target sum and shrinks to minimize length.
- Track the smallest valid window whenever the running sum is ≥ target.
```

#### 5. [Longest Substring with K Distinct Characters (Educative)](https://github.com/taimourz/Grooking-Coding-Interviews/blob/main/1%20Sliding%20Window/1.4%20Longest%20Substring%20with%20K%20Distinct%20Characters/code.js)

``` bash
- Use a sliding window with a frequency map to track distinct characters.
- Shrink the window when distinct count exceeds k, and update the maximum length when it equals k
```

#### 6. [Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/description/)

``` bash
- same as Longest Substring with K Distinct Characters (Educative)
- We use a sliding window with a map to track counts of fruit types in the current window.
- If the window ever has more than 2 distinct fruits, we shrink it from the left, and continuously update the maximum window size seen.
```

#### 7. [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/)

``` bash
- same as Longest Substring with K Distinct Characters (Educative)
- Use a sliding window with a map to keep character frequencies and ensure all characters in the window are unique.
- When a duplicate appears, shrink the window from the left until uniqueness is restored, tracking the maximum length.
```

#### 8. [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/description/)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/a05fcefe-b73e-4c36-8420-b2d3cd9bce59" >claude</a>
>  </li>
>  <li>
>     <a href="https://excalidraw.com/#json=ulwJwzpRaAZaQYEcKelsf,tqzfRmu2u2THTOZyag2hvg" >excalidraw</a>
>  </li>
> </ul>
> </div>

``` bash
- Use a sliding window and keep track of the most frequent character in the window.
- If the window size minus that frequency exceeds k (replacements needed), shrink the window; otherwise, update the maximum length.

Step 1: [A] → window size 1
         ^
         L,R

Step 2: [A A] → window size 2
         ^   ^
         L   R

Step 3: [A A B] → window size 3
         ^   ^
         L   R

Step 4: [A A B A] → window size 4 ✓ (max so far)
         ^     ^
         L     R

Step 5: [A A B A B] → invalid (needs 2 replacements)
         ^       ^
         L       R
        
        Shrink: [A B A B] → window size 4
                 ^       ^
                 L       R

Step 6: [A B A B B] → invalid
         ^       ^
         L       R
        
        Shrink: [B A B B] → window size 4
                 ^     ^
                 L     R

Step 7: [B A B B A] → invalid
         ^       ^
         L       R
        
        Shrink: [A B B A] → window size 4
                 ^     ^
                 L     R

Answer: 4 (longest valid window)

```

#### 9. [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/description/)

``` bash
- Use a sliding window to keep at most k zeros in the window by expanding right and shrinking from the left when zeros exceed k.
- Track and update the maximum window length, which represents the longest subarray that can be made all 1s by flipping at most k zeros.
- this hint helped me from discussion: main observation is --> atmost k zeros are allowed in window
```


#### 10. [Permutation in String](https://leetcode.com/problems/permutation-in-string/)

``` bash
- We use a fixed-size sliding window over s2 and maintain incremental character counts.
- If the window’s character counts match s1’s counts, it contains a permutation.
```

#### 11. [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/description/)


``` bash
- same as permutation in a string
- Use a fixed-size sliding window of length p.length over s, maintaining character frequency maps for the window and the pattern.
- When the window size matches, compare frequencies; if they match, the window start index is an anagram.
```

#### 12. [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/description/)

``` bash
- Use a sliding window with a frequency map to track how many required characters from t are currently covered in s.
- Expand right to include all required chars, then shrink from left to keep the window valid and minimal.
- later: do with the groking technique. counter based. 
```


#### 13. [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k/description/)

``` bash
- We use a sliding window that maintains a product < k. 
- At each position, we expand the window by including the current element, then shrink from the left while the product >= k.
- Once valid, we know that all subarrays ending at the current position (starting from anywhere in the current window) have product < k,
- so we add (windowEnd - windowStart + 1) to our count.

Step 1: windowEnd=0
Window: [10]
         ↑
    windowStart=0, windowEnd=0
    
Product = 10 < 100 ✓

Subarrays ending at index 0:
- [10] (from index 0 to 0)

Count = (0 - 0 + 1) = 1

Step 2: windowEnd=1
Window: [10, 5]
         ↑   ↑
    windowStart=0, windowEnd=1
    
Product = 10 * 5 = 50 < 100 ✓

Subarrays ending at index 1:
- [5] (from index 1 to 1) → product = 5 ✓
- [10, 5] (from index 0 to 1) → product = 50 ✓

Count = (1 - 0 + 1) = 2


Step 3: windowEnd=2
Window: [10, 5, 2]
Product = 50 * 2 = 100 >= 100 ✗

While loop shrinks window:
  Remove 10: product = 100/10 = 10, windowStart=1
  
Window: [5, 2]
         ↑  ↑
    windowStart=1, windowEnd=2
    
Product = 10 < 100 ✓

Subarrays ending at index 2:
- [2] (from index 2 to 2) → product = 2 ✓
- [5, 2] (from index 1 to 2) → product = 10 ✓

Count = (2 - 1 + 1) = 2

Step 4: windowEnd=3
Window: [5, 2, 6]
         ↑     ↑
    windowStart=1, windowEnd=3
    
Product = 10 * 6 = 60 < 100 ✓

Subarrays ending at index 3:
- [6] (from index 3 to 3) → product = 6 ✓
- [2, 6] (from index 2 to 3) → product = 12 ✓
- [5, 2, 6] (from index 1 to 3) → product = 60 ✓

Count = (3 - 1 + 1) = 3

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

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/07291803-631f-4afe-b566-62270f77adfd" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/69168d80-abcc-8005-a6ae-744793201087" >chatgpt</a>
>  </li>
> </ul>
> </div>


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

#### 5. [Validate BST](https://leetcode.com/problems/validate-binary-search-tree/description/)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/6631a278-80ee-4909-9a79-7af603ef4b39" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/6919c7c3-ebd8-8005-aa22897071f906fb" >chatgpt</a>
>  </li>
> </ul>
> </div>

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
#### 5. [maximum depth](https://leetcode.com/problems/validate-binary-search-tree/description/)

``` bash

helper(3, 0):
  left = 1 + helper(9, 0)
       = 1 + max(1+0, 1+0)  // 9's children are null
       = 1 + 1 = 2
       
  right = 1 + helper(20, 0)
        = 1 + max(1+helper(15), 1+helper(7))
        = 1 + max(1+1, 1+1)  // 15 and 7's children are null
        = 1 + 2 = 3
        
  curr_max = max(2, 3) = 3
  return 3

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

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/536cdbd8-3035-40f4-9e40-bd36cb6baaf4" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/691e0a01-5010-8005-8bd3-1d71cde0ab44" >chatgpt</a>
>  </li>
> </ul>
> </div>

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

#### 6. [Coin Change II](https://leetcode.com/problems/coin-change-ii/description/)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/b11fcc56-53f4-403b-8e2a-5b06b34264c2" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/692cc7ac-a7b0-8005-83a6-952a3fe1110f" >chatgpt</a>
>  </li>
>  <li>
>     <a href="https://excalidraw.com/#json=wbiL1_bAks0XvJWa-zCrI,v-cvbmWytRUmsxtVXnldEQ" >Excalidraw</a>
>  </li>
> </ul>
> </div>

``` bash
- I spent a lot of time on this one. I was confused about how do we deal with making all possible choices everytime.
- Then i was confused about why we are skipping and chossing the next one. 
- Then i thought we are moving in the array whereas we were just making decisions. 
- A lot of things need to be learned from this question. 
- see claude followup questions
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


> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/0a2606f8-4683-4f48-bebf-a90954215baf" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/691b383a-26e4-8005-8dec-9d6b086a5de4" >chatgpt</a>
>  </li>
> </ul>
> </div>

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

#### 5. [Reorder List](https://leetcode.com/problems/reorder-list/) 


> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/54052dd5-504a-46c7-a404-91ebab3837cb" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/691ca064-fad0-8005-82ac-9358870a15f9" >chatgpt</a>
>  </li>
> </ul>
> </div>

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

#### 5. [Remove linked list elements](https://leetcode.com/problems/remove-linked-list-elements/description/) 
> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/3ec580f8-4202-4cc3-a239-e6e416eb4946" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/69267167-ea28-8005-9239-e66904dfe610" >chatgpt</a>
>  </li>
> </ul>
> </div>

``` bash

- This seemed easy but took me a long time
- My key mistake was confusing b/c I was trying to do it with 2 pointers.
- it can simply be done by one pointer

```



### Two Pointer approach

#### 1. [3Sum](https://leetcode.com/problems/3sum/)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/59bf338d-0b48-4f3b-9265-aa9cb28486b1" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/691f0c0f-3fa8-8005-8e86-cfe12c416b23" >chatgpt</a>
>  </li>
>  <li>
>     <a href="https://excalidraw.com/#json=MqepFOfnetCltdMkn6wq5,u9HzU-h43qOnjrfVtI3Pyg" >excalidraw visualisation</a>
>  </li>
> </ul>
> </div>

``` bash
- same as 2sum
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

#### 4. [Pair with Target sum (Educative)]


``` bash
- The solution uses a two-pointer technique with one pointer at the start and one at the end of the array. 
- It moves the pointers inward based on whether the current sum is greater than or less than the target, finding the pair in O(n) time (assumes sorted array).
```
#### 5. [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

``` bash
- The solution uses a slow-fast pointer approach where the slow pointer (nextNonDuplicate) tracks the position for the next unique element.
- The fast pointer (r) scans through the array, and whenever a new unique element is found, it's placed at the nextNonDuplicate position and the pointer advances.
```

#### 6. [Remove Element](https://leetcode.com/problems/remove-element/description/)

``` bash
- similar to Remove Duplicates from a sorted Array
- The solution uses a slow-fast pointer approach where the slow pointer (nextElement) tracks where to place the next non-target element. 
- The fast pointer (r) scans through the array, and whenever it finds an element that's not equal to val, 
it copies it to the nextElement position and advances the slow pointer.
```

#### 7. [Square of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/description/)

``` bash
- Since the array is sorted, the largest squared values must come from either end (most negative or most positive numbers).
- Use two pointers to compare both ends, repeatedly pick the larger square and place it at the back of the result array, working backwards.
```

#### 8. [3Sum Closest](https://leetcode.com/problems/3sum-closest/description/)

``` bash
- The solution sorts the array, then for each element, uses two pointers from both ends to find the three numbers whose sum is closest to the target.
- It tracks the minimum difference encountered and returns the sum with the smallest absolute difference from the target.
```
#### 9. [Tiplets with smaller sum (G)]()

``` bash
- The solution sorts the array and for each element, uses two pointers to count pairs where the triplet sum is less than the target. 
- When a valid pair is found at positions l and r, it counts all pairs between them (r - l)
- since the sorted array guarantees all elements between l and r will also form valid triplets.
```

#### 10. [Sort Colors](https://leetcode.com/problems/sort-colors/description/)

``` bash
- We use three pointers: l marks where the next 0 should go, r marks where the next 2 should go, and i scans through the array.
- When we find a 0, we swap it to the left and move on; when we find a 2, we swap it to the right but don't move i (since we need to check what we just swapped in)
- when we find a 1, we just move forward. We stop when i passes r because everything after r is already sorted 2s.
```

#### 11. [4Sum](https://leetcode.com/problems/4sum/)

``` bash
- same as 3sum
```

#### 12. [Backspace String Compare](https://leetcode.com/problems/backspace-string-compare/)

``` bash
- Process both strings backwards simultaneously.
- When you hit a hashtag(#), count it; when you hit a regular character, either skip it (if you have backspaces to apply) or compare it (if no backspaces left).
```

#### 13. [Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray/description/)

``` bash
- Find the initial unsorted window by scanning from both ends until elements stop being in ascending order, 
- one pass each side
- find the min/max within that window.
- Expand the window boundaries by checking if any sorted elements outside the window are greater than the min or less than the max (meaning they'd be out of place after sorting).
- handle duplicates
```


### Slow Fast Pointer approach

#### 1. [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

``` bash
- we use 2 pointers. if there's a cycle, the faster pointer will eventually lap and meet the slower one.
- If the fast pointer reaches the end (undefined), there's no cycle.
```

#### 2. [Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/description/)

``` bash
- First detects if a cycle exists using fast/slow pointers,
- then calculates the cycle length by counting nodes until the slow pointer loops back to itself.
- Finally, uses two pointers separated by the cycle length to find the cycle's starting node—when they meet, that's where the cycle begins.
```

#### 3. [Happy Number](https://leetcode.com/problems/happy-number/description/)

``` bash
- if a number is happy, the cycle will end at 1,
- otherwise it enters an endless cycle at some other number. 
- Returns true only if the cycle meeting point is 1.

```
#### 4. [Middle of Linked List](https://leetcode.com/problems/middle-of-the-linked-list/description/)

``` bash
- easy
```
#### 5. [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/description/)

``` bash
- Find the middle using slow/fast pointers, reverse the second half in-place
- Compare the first half with the reversed second half by walking both lists simultaneously
```


#### 6. [Reorder List](https://leetcode.com/problems/reorder-list/description/)

``` bash
- Find the middle of the list using slow/fast pointers, 
- Reverse the second half of the list starting from the middle,
- Merge the first half and reversed second half by alternating nodes (left, right, left, right...).
```
> [!info]-  Complexity
> ##### Time
> Time: O(n) - We traverse the list three times: once to find middle, once to reverse, once to merge.
> ##### Space
> Space: O(1)


#### 7. [Circular Array Loop](https://leetcode.com/problems/circular-array-loop/description/)

``` bash
- We check each index as a potential cycle start using Floyd's Cycle Detection (fast & slow pointers).
- The slow pointer moves 1 step, fast moves 2 steps. 
- If they meet at a valid position (same direction throughout, no self-loops), we found a cycle. 
- We use -1 to mark invalid paths (direction changes or self-loops) and break early.
- tbh, i did not understood this very well. just got the explanation and understood. Try again

```
> [!info]-  Complexity
> ##### Time
> Time: O(n²) - For each of n starting positions, we might traverse the entire array in the worst case.
> ##### Space
> Space: O(1) - Only using a few pointers (slow, fast, isForward), no extra data structures.



### Backtracking


#### 1. [Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/description/)

- T: O(4^n × n)
- S; O(n). can do optimizations see claude

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/d00bb1a2-97b2-4650-a3a4-76b756ae1e16" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/692b3657-ac40-8005-acf0-9b688d4e47dd" >chatgpt</a>
>  </li>
>  <li>
>     <a href="https://excalidraw.com/#json=vHhLhVMaOob6ImKp_5QQC,PPZ_hYmM4hwJuVJ0N7kWFQ" >Exalidraw</a>
>  </li>
>  <li>
>     <a href="https://www.youtube.com/watch?v=irkG33phXuw" >Youtube</a>
>  </li>
> </ul>
> </div>




``` bash
- spent a lot of time on this but this is still not very clear to me.  need to look at this again
- started with an unordered_map appraoch but finally decided to go with other approach
- vector to store keys, then doing recusion and backtracking.
- we are passing index in the recursive func, base case is when we reach the end of string

```

### Binary Search

#### 1. [Find firs and last position of an element in a sorted array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/e07d2e5f-317c-49e6-b0c6-1c77261f29cc" >claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/692b6009-8ee4-8005-8ef4-5d9df932ad0c" >chatgpt</a>
>  </li>
>  <li>
>     <a href="https://excalidraw.com/#json=Jf1AT4lrOrB2h5dtSaoUa,yAoE4dk6OthZoT6HXQ8uIQ" >Excalidraw</a>
>  </li>
> </ul>
> </div>


``` bash
- Its actually easy i was not thinking about this right so took time. 
- think about bounds. 
```


### Resources 

[CPP patterns](https://cpppatterns.com/) 