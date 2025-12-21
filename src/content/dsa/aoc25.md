



#### 1. [Day 1](https://adventofcode.com/2025/day/1)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/0a4a34b3-da44-49f5-a3b4-1b751d734322">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/692d8c4c-b0e4-8005-93de-864efce37674" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- First was easy just need to a bit of modular arithmetic
- second was a bit difficult, but got it later on. 
- just have to think a little bit outside of the box
- suprisingly, gpt was really help but claude explain better
```

#### 2. [Day 2](https://adventofcode.com/2025/day/2)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/eff3b928-0602-4636-ad81-0788b00e28a6">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/69304edb-31f8-8005-a166-678c94910df7" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- i did solve first part. but not the part 2. 
- my approch for part 2 was way off. Then used gpt and claude to do this.
- for part 2, for every digit we look at all the patterns we can make.
- if the pattern len does not divide this completely then we skip b/c this pattern can never recreate the original string
- if yes then we divide to see how many times we need to repeat to create it.
- if recreated is = to orignial then invalid
```

#### 3. [Day 3](https://adventofcode.com/2025/day/3)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/7a75406d-cf8d-4e11-aad2-97c25ed64b15">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/69309377-be90-8005-8fec-5023aa2acc5d" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- for the first one i had kind of right intuition but not quite right.
- I was thinking in terms of highest and second highest value but in actually we had to keep track of first_so_far.
- chatgpt helped with it. basically, it considers first digit as first_so_far and starts loop from second digit
- here we combine it with the first_so_far. if > max_digit we update. eg first is 9 and second is 8 then we have 98
- after this we see the current digit i.e 8, if it is greater then first_so_far then update it.

- second was difficult for me. we had to create a 12 digit number such that it's value is max
- here we recreate the new string. so we need to keep a window. 
- we need 2 things for this. where   startindex and windowends 
- windows_end = batteries[i].length - 12 - j - 1; := -1 b/c 0 indexed. 12 is the new string length. j is current pos in string.
- see visualisation in claude
```

#### 4. [Day 4](https://adventofcode.com/2025/day/4)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/b75c6da3-b613-44cd-bf10-876cab181cba">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/69330e3a-efd4-8005-9248-b4b16bc06fa2" >chatgpt</a>
>  </li>
>  <li>
>     <a href="https://excalidraw.com/#json=YKwwLoR_9_MXM38dqH9eJ,DCnxAB4685oAT1YKjyF3ZA">Excalidraw</a>
>  </li>
> </ul>
> </div>


``` bash
- this was faily easy. 
- in first part just had to use a directional vector.
- in second part had to do it multiple times
- see excali draw for the vector diagram
```

#### 5. [Day 5](https://adventofcode.com/2025/day/5)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/8afa2f7c-a825-498a-81a8-128e001bad55">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/69330d9d-54e8-8005-8e21-9e5f6379e5c8" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- first was easy. 
- for second one i did the set approach but set size was too big to fix in the memory
- then try to go for bloom filter solution but that was also not able to fit in memory (will try implementing them later on)
- finally went with the merged ranges solution
- claude really helped with visualisation of how ranges were getting merged
```

#### 6. [Day 6](https://adventofcode.com/2025/day/6)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/838a1eee-9fc1-44c2-886b-d8d8e462b794">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/6936d7db-4b28-8005-92f2-ac1784f81fe4" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- In part 1, I just had to observe the pattern about how j was behaving.
- first was easy. 
- second one was very difficult and I had to look up multiple answers. 
- The answer I did was really impressive and concise. 
- claude explained that really well.
```


#### 7. [Day 7](https://adventofcode.com/2025/day/7)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/9f262f66-8bbb-4dd4-9aeb-fce27b38e04b">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/693801f9-15b8-8005-a10a-6cc905ac7fde" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- for part 1, I had the idea but llms helped with coding part
- second i took from github and understood, I do think there are still gaps in understanding.
- to better understand I added code with cpp and python for comparison.
```

#### 8. [Day 8](https://adventofcode.com/2025/day/8)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/ff1f0385-7de5-4423-8bde-81ab6534b0dc">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/69396515-4b20-8005-8bed-63103315247b" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- explanation in comments.
```




#### 9. [Day 9](https://adventofcode.com/2025/day/9)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/f11fa0fc-a761-49bc-8d4e-83a05d035835">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/693acb84-f60c-8005-8a16-0fdd0b4881f2" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- I came up with the intution for part 1 and with some help from AI got it working. 
- Tbh, it is still not very clear to me.
```



#### 10. [Day 10](https://adventofcode.com/2025/day/10)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/e6b372cd-a83c-46c6-a474-c77c3540e71c">claude</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/693c04e3-b028-8005-acb9-e49293706d94" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- I understand the solutions but I did it from youtube. added comments explain the workings.
- for part 2, it was too slow. maybe will find the optimal solution to this later on. 

```



#### 11. [Day 11](https://adventofcode.com/2025/day/11)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/ebef7c4f-490d-480a-b210-5c1d9064efc3">claude</a>
>  </li>
> </ul>
> </div>


``` bash
- I did the part 1, with a bfs solution. 
- part2 was also done with some AI help but it was too slow so I watched a youtube video on that.

```



#### 12. [Day 12](https://adventofcode.com/2025/day/12)

> [!info]- Links
> <div>
> <ul>
>  <li>
>     <a href="https://claude.ai/share/75925c48-2d98-4df6-9654-0cb0f7654936">claude</a>
>  </li>
>  <li>
>     <a href="https://claude.ai/share/5dda752a-529e-4b4b-94e3-e512a849d3a1">claude2</a>
>  </li>
>  <li>
>     <a href="https://chatgpt.com/share/693f6321-c7a4-8005-9500-c3c82e6fe46d" >chatgpt</a>
>  </li>
> </ul>
> </div>


``` bash
- it was a fitting problem. I basically did part 1 from github. 

```



