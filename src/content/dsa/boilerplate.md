---
title: Boilerplate
date: 2025-11-13
---

#### i. checkBounds


``` cpp
    bool check_bounds(int i, int j, int row, int col){
        if(i < 0 || j < 0 || i >= row || j >= col) return false;
        return true;
    }

```


#### ii. print stack

``` cpp
    while (!stk.empty()) {
        cout << stk.top()->val << " ";
        stk.pop();
    }

```

#### iii. find subdstring b/w a range

``` cpp
s.substr(j, i-j)
```