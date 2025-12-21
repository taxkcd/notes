---
title: Python Reference Guide
date: 2025-11-13
---


### Debugging Samples

#### 1. 

``` bash
    #breakpoint()
    indent = "  " * depth
    print(f"{indent}→ dfs({node!r})")
    if node == 'out':
        return 1

    result = 0
    for neighbour in adj_list[node]:
        result += dfs(neighbour, adj_list, depth+1)

    print(f"{indent}← {node!r} returns {result}")
    return result
```