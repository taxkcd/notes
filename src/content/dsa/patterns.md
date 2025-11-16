# DSA Pattern Recognition Guide

This repository contains LeetCode solutions organized by patterns and techniques. This guide helps you quickly identify which pattern to use for a given problem and navigate to relevant solutions.

---

## Quick Pattern Reference

### How to Use This Guide
1. **Identify the problem type** from the problem statement
2. **Match to pattern category** using the recognition indicators below
3. **Navigate to solutions** in `https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/` or `DailyLeetcoding/`
4. **Study pattern examples** to build recognition skills

---

## Pattern Categories

### 1. Two Pointers

**Recognition Indicators:**
- Array/string is sorted or can be sorted
- Need to find pairs/triplets that sum to target
- Need to compare elements from opposite ends
- "Two sum", "Three sum", "Container with most water" type problems

**Key Problems:**
- [Two Sum II](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/167-two-sum-ii-input-array-is-sorted/) - Sorted array, find two numbers
- [3Sum](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/15-3sum/) - Find triplets, handle duplicates
- [Container With Most Water](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/11-container-with-most-water/) - Move pointer with smaller height
- [Valid Palindrome](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/125-valid-palindrome/) - Compare from both ends

**Pattern Tips:**
- Sort array first if not sorted
- Use left=0, right=len-1 for opposite ends
- Move pointer based on comparison (smaller/larger value)
- Handle duplicates by skipping while moving pointers

---

### 2. Sliding Window

**Recognition Indicators:**
- Substring/subarray problems
- "Longest/shortest substring with condition"
- "Window of size k"
- Need to maintain a window that expands/contracts
- Character frequency/count problems

**Key Problems:**
- [Longest Substring Without Repeating Characters](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/3-longest-substring-without-repeating-characters/) - Expand until duplicate, then shrink
- [Longest Repeating Character Replacement](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/424-longest-repeating-character-replacement/) - Window with at most k replacements
- [Permutation in String](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/567-permutation-in-string/) - Fixed window size, check frequency

**Pattern Tips:**
- Use left and right pointers for window boundaries
- Expand window (right++), then shrink if needed (left++)
- Use hashmap/set to track window contents
- Check condition after expanding, adjust window size

---

### 3. Kadane's Algorithm (Maximum Subarray)

**Recognition Indicators:**
- "Maximum sum subarray"
- "Maximum product subarray"
- Contiguous subarray problems
- Need to track best sum so far and current sum

**Key Problems:**
- [Maximum Subarray](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/53-maximum-subarray/) - Classic Kadane's: reset if currentSum < 0
- [Maximum Product Subarray](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/152-maximum-product-subarray/) - Track both min and max product

**Pattern Tips:**
- Keep track of `currentSum` and `maxSum`
- If `currentSum < 0`, reset to 0 (for sum) or 1 (for product)
- For product, also track `minProduct` because negative * negative = positive

---

### 4. Prefix/Suffix Arrays

**Recognition Indicators:**
- Need product/sum of all elements except current
- "Product of array except self"
- Pre-compute values for all positions
- Avoid division operation

**Key Problems:**
- [Product of Array Except Self](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/238-product-of-array-except-self/) - Prefix then suffix pass

**Pattern Tips:**
- First pass: compute prefix values
- Second pass: compute suffix values and combine
- Can do in O(1) space by using output array

---

### 5. Binary Search

**Recognition Indicators:**
- Sorted array (or can be sorted)
- "Find target in sorted array"
- "Search in rotated sorted array"
- "Find first/last position"
- O(log n) time complexity hint

**Key Problems:**
- [Binary Search](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/792-binary-search/) - Classic binary search
- [Search in Rotated Sorted Array](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/33-search-in-rotated-sorted-array/) - Find pivot, then search
- [Find First and Last Position](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/34-find-first-and-last-position-of-element-in-sorted-array/) - Two binary searches
- [Find Minimum in Rotated Sorted Array](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/153-find-minimum-in-rotated-sorted-array/) - Modified binary search

**Pattern Tips:**
- Use `left = 0, right = len - 1`
- Calculate `mid = left + (right - left) // 2` to avoid overflow
- For rotated arrays, check which side is sorted
- For first/last position, don't return immediately, continue searching

---

### 6. Hash Map / Hash Set

**Recognition Indicators:**
- Need O(1) lookup
- "Find duplicates"
- "Group anagrams"
- "Two sum" type problems
- Frequency counting

**Key Problems:**
- [Two Sum](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/1-two-sum/) - Store complement in map
- [Group Anagrams](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/49-group-anagrams/) - Use sorted string as key
- [Contains Duplicate](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/217-contains-duplicate/) - Simple set check
- [Valid Anagram](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/242-valid-anagram/) - Count frequencies

**Pattern Tips:**
- Use map for value -> index mapping
- Use set for existence checking
- For anagrams, sorted string is a good key
- Consider frequency maps for counting problems

---

### 7. Trees - DFS (Depth-First Search)

**Recognition Indicators:**
- Tree traversal problems
- "Maximum depth", "Diameter", "Path sum"
- Need to explore all paths
- Recursive structure

**Key Problems:**
- [Maximum Depth of Binary Tree](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/104-maximum-depth-of-binary-https://github.com/Ahmadjajja/_DSA_/tree/) - Recursive: 1 + max(left, right)
- [Diameter of Binary Tree](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/543-diameter-of-binary-https://github.com/Ahmadjajja/_DSA_/tree/) - Track diameter while calculating height
- [Invert Binary Tree](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/226-invert-binary-https://github.com/Ahmadjajja/_DSA_/tree/) - Swap left and right recursively
- [Lowest Common Ancestor](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/235-lowest-common-ancestor-of-a-binary-search-https://github.com/Ahmadjajja/_DSA_/tree/) - Use BST property

**Pattern Tips:**
- Base case: if node is None, return appropriate value
- Recursive case: process node, recurse on children
- For diameter: calculate height, track max diameter
- For BST: use value comparison to navigate

---

### 8. Trees - BFS (Breadth-First Search) / Level Order

**Recognition Indicators:**
- "Level order traversal"
- "Print by levels"
- Need to process nodes level by level
- Shortest path in tree (unweighted)

**Key Problems:**
- [Binary Tree Level Order Traversal](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/102-binary-tree-level-order-traversal/) - Use queue, process level by level
- [Maximum Depth](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/104-maximum-depth-of-binary-https://github.com/Ahmadjajja/_DSA_/tree/) - Can also use BFS with queue

**Pattern Tips:**
- Use queue (deque) for BFS
- Process all nodes at current level before moving to next
- Track level size: `level_size = len(queue)` before processing
- Add children to queue for next level

---

### 9. Graphs - DFS

**Recognition Indicators:**
- Graph traversal
- "Clone graph", "Number of islands"
- Cycle detection
- Connected components
- Path finding

**Key Problems:**
- [Number of Islands](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/200-number-of-islands/) - DFS from each unvisited '1'
- [Clone Graph](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/133-clone-graph/) - DFS with visited map
- [Course Schedule](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/207-course-schedule/) - DFS for cycle detection
- [Max Area of Island](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/695-max-area-of-island/) - DFS to explore island

**Pattern Tips:**
- Use visited set/map to avoid cycles
- For grid: check boundaries before recursing
- For adjacency list: iterate through neighbors
- Mark visited before recursing to avoid infinite loops

---

### 10. Graphs - BFS

**Recognition Indicators:**
- Shortest path (unweighted)
- "01 Matrix" - distance from nearest 0
- Level-by-level processing needed
- Multi-source BFS

**Key Problems:**
- [01 Matrix](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/542-01-matrix/) - BFS from all 0s simultaneously
- [Number of Islands](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/200-number-of-islands/) - Can use BFS instead of DFS
- [Rotting Oranges](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/1036-rotting-oranges/) - Multi-source BFS

**Pattern Tips:**
- Initialize queue with all starting points (multi-source)
- Process level by level (all nodes at distance d before d+1)
- Use directions array: `[(0,1), (1,0), (0,-1), (-1,0)]` for 4-directional
- Track distance/level in queue: `(row, col, distance)`

---

### 11. Backtracking

**Recognition Indicators:**
- "Generate all permutations/combinations"
- "Subsets", "Combinations"
- Need to explore all possibilities
- Make choice, recurse, undo choice

**Key Problems:**
- [Permutations](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/46-permutations/) - Use visited set, backtrack
- [Subsets](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/78-subsets/) - Include/exclude each element
- [Combinations](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/77-combinations/) - Generate C(n,k)
- [Combination Sum](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/39-combination-sum/) - Can reuse elements
- [Generate Parentheses](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/22-generate-parentheses/) - Track open/close count

**Pattern Tips:**
- Base case: add current solution to result
- Make choice: add element to current path
- Recurse: call function with updated state
- Undo choice: remove element (backtrack)
- Use visited set for permutations to avoid duplicates

---

### 12. Dynamic Programming - Memoization (Top-Down)

**Recognition Indicators:**
- Overlapping subproblems
- Optimal substructure
- "How many ways", "Count paths"
- Recursive solution with repeated calculations
- Can add memo dictionary to recursive solution

**Key Problems:**
- [House Robber](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/198-house-robber/) - Rob or skip, memoize results
- [Decode Ways](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/91-decode-ways/) - Memoize by index
- [Coin Change II](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/518-coin-change-ii/) - Memoize (index, amount)
- [Fibonacci Number](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/1013-fibonacci-number/) - Classic memoization

**Pattern Tips:**
- Start with recursive solution
- Add memo dictionary: `memo = {}`
- Check memo before recursing: `if state in memo: return memo[state]`
- Store result in memo before returning
- Key: use tuple of changing parameters as key

---

### 13. Dynamic Programming - Tabulation (Bottom-Up)

**Recognition Indicators:**
- Same as memoization but prefer iterative
- Can build solution from base cases
- "Unique paths", "Climbing stairs"
- Grid/array DP problems

**Key Problems:**
- [Climbing Stairs](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/70-climbing-stairs/) - dp[i] = dp[i-1] + dp[i-2]
- [Unique Paths](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/62-unique-paths/) - 2D DP: dp[i][j] = dp[i-1][j] + dp[i][j-1]
- [Coin Change](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/322-coin-change/) - dp[amount] = min(dp[amount-coin] + 1)
- [Longest Common Subsequence](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/1250-longest-common-subsequence/) - 2D DP for strings

**Pattern Tips:**
- Initialize DP array with base cases
- Fill DP array iteratively
- For 2D: dp[i][j] depends on previous cells
- For 1D: dp[i] depends on previous values
- Can often optimize space (use 1D instead of 2D)

---

### 14. Linked List - Fast & Slow Pointers

**Recognition Indicators:**
- "Cycle detection"
- "Find middle node"
- "Remove nth from end"
- Need to find position without knowing length

**Key Problems:**
- [Linked List Cycle](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/141-linked-list-cycle/) - Fast and slow meet if cycle exists
- [Remove Nth Node From End](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/19-remove-nth-node-from-end-of-list/) - Two pointers with n gap

**Pattern Tips:**
- Initialize: `slow = fast = head`
- Move: `slow = slow.next`, `fast = fast.next.next`
- For cycle: if `fast == slow`, cycle exists
- For nth from end: move fast n steps ahead, then move both

---

### 15. Monotonic Stack

**Recognition Indicators:**
- "Next greater element"
- "Daily temperatures" - find next warmer day
- Need to find next/previous element with certain property
- Stack maintains monotonic order

**Key Problems:**
- [Daily Temperatures](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/739-daily-temperatures/) - Stack stores indices, pop when warmer found
- [Valid Parentheses](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/20-valid-parentheses/) - Stack for matching

**Pattern Tips:**
- Use stack to store indices (or values)
- While current > stack top, pop and process
- Push current index to stack
- Stack maintains decreasing order (for next greater)

---

### 16. Interval Problems

**Recognition Indicators:**
- "Merge intervals"
- "Insert interval"
- "Non-overlapping intervals"
- Array of [start, end] pairs

**Key Problems:**
- [Merge Intervals](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/56-merge-intervals/) - Sort by start, merge overlapping
- [Insert Interval](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/57-insert-interval/) - Find position, merge if needed
- [Non-overlapping Intervals](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/435-non-overlapping-intervals/) - Greedy: remove intervals with larger end

**Pattern Tips:**
- Sort intervals by start time
- Compare current interval with previous
- If overlap: merge (update end to max)
- If no overlap: add to result

---

### 17. Heap / Priority Queue

**Recognition Indicators:**
- "Kth largest/smallest"
- "Top K elements"
- Need to maintain min/max efficiently
- "Merge K sorted lists"

**Key Problems:**
- [Kth Largest Element](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/215-kth-largest-element-in-an-array/) - Min heap of size k
- [Top K Frequent Elements](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/347-top-k-frequent-elements/) - Max heap by frequency
- [K Closest Points to Origin](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/1014-k-closest-points-to-origin/) - Max heap of size k

**Pattern Tips:**
- Use min heap for "kth largest" (keep k largest)
- Use max heap for "kth smallest" (keep k smallest)
- For "top k", heap size should be k
- Python: `heapq` module (min heap by default)

---

### 18. Greedy Algorithms

**Recognition Indicators:**
- "Jump game" - can you reach end?
- "Gas station" - circular route
- Make locally optimal choice
- Often combined with sorting

**Key Problems:**
- [Jump Game](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/55-jump-game/) - Track farthest reachable index
- [Jump Game II](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/45-jump-game-ii/) - Minimum jumps
- [Gas Station](https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/134-gas-station/) - Track total gas and current gas

**Pattern Tips:**
- Make best local choice at each step
- Track some running value (gas, reachable index)
- If running value becomes negative/invalid, reset or fail

---

## Repository Structure

### Main Solution Directories
- **`https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/`** - Primary solutions organized by problem number
- **`DailyLeetcoding/`** - Additional solutions
- **`08-arrays/Assignment-05/`** - Array problems with KeyNote.md files
- **`11-binary search questions/`** - Binary search problems
- **`19-recursion questions/`** - Recursion/backtracking problems
- **`26-linkedlist questions/`** - Linked list problems
- **`29-trees/`** - Tree problems and implementations

### Key Files
- **`SYLLABUS.md`** - Complete topic list with video links
- **`08-arrays/Assignment-05/*/KeyNote.md`** - Important problems to revisit
- **`Pirate King Approach to solve DSA in a way.txt`** - Core topics list

---

## Pattern Recognition Workflow

1. **Read Problem Statement**
   - Identify data structure (array, string, tree, graph)
   - Note constraints (sorted? size limits?)
   - Understand what's being asked (find, count, generate, optimize)

2. **Match Problem Characteristics**
   - Sorted array? → Binary Search or Two Pointers
   - Substring/subarray? → Sliding Window
   - All possibilities? → Backtracking
   - Optimal substructure? → Dynamic Programming
   - Traversal? → DFS/BFS

3. **Check Pattern Indicators**
   - Use the recognition indicators above
   - Look for keywords in problem statement
   - Consider time complexity hints

4. **Navigate to Solution**
   - Find problem in `https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/[problem-number]/`
   - Study the solution approach
   - Note the pattern implementation

---

## Learning Path Recommendation

Based on the repository structure and pattern frequency:

1. **Start with fundamentals:**
   - Hash Map/Set (Two Sum, Contains Duplicate)
   - Two Pointers (Two Sum II, 3Sum)
   - Sliding Window (Longest Substring)

2. **Move to arrays:**
   - Kadane's Algorithm (Maximum Subarray)
   - Prefix/Suffix (Product Except Self)
   - Binary Search (Search in Sorted Array)

3. **Trees:**
   - DFS (Max Depth, Diameter)
   - BFS (Level Order)

4. **Graphs:**
   - DFS (Number of Islands, Clone Graph)
   - BFS (01 Matrix)

5. **Advanced:**
   - Backtracking (Permutations, Subsets)
   - Dynamic Programming (House Robber, Coin Change)
   - Monotonic Stack (Daily Temperatures)

---

## Tips for Pattern Recognition

### Common Problem → Pattern Mappings

| Problem Type | Pattern |
|-------------|---------|
| Find two numbers that sum to target | Hash Map or Two Pointers |
| Longest substring with condition | Sliding Window |
| Maximum sum/product subarray | Kadane's Algorithm |
| Sorted array search | Binary Search |
| Generate all combinations | Backtracking |
| Count ways/paths | Dynamic Programming |
| Tree traversal | DFS or BFS |
| Graph traversal | DFS or BFS |
| Next greater element | Monotonic Stack |
| Kth largest/smallest | Heap |

### Red Flags (Wrong Pattern)

- Using nested loops for sorted array → Should use Binary Search
- Brute force for substring → Should use Sliding Window
- Recursion without memo for repeated subproblems → Should use DP
- BFS for tree when need all paths → Should use DFS

---

## Additional Resources

- **SYLLABUS.md** - Complete curriculum with video links
- **KeyNote.md files** - Important problems marked for review
- **Solution comments** - Many solutions show brute force → optimized progression

---

## Quick Navigation by Problem Number

All problems are in `https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/[problem-number]/` format.

**Examples:**
- Two Sum: `https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/1-two-sum/`
- Maximum Subarray: `https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/53-maximum-subarray/`
- House Robber: `https://github.com/Ahmadjajja/_DSA_/tree/main/DailyLeetcoding/198-house-robber/`

---

*This guide is designed to help you recognize patterns quickly. Focus on understanding the pattern recognition indicators rather than memorizing code. Practice identifying which pattern applies to new problems you encounter.*
