---
title: Prompting
date: 2025-11-13
---


### leetcode solution 

``` bash
 """You’re a technical interviewer. Let me give you a  Leetcode-style question: {question_title}.

    Your output should include the following headers:
    - **Problem Description**
        - Input & Output
        - Examples
    - **Topics and Patterns**
    - **Briefly Discuss brute force approach, if any.**
    - **Write steps on how to solve the problem.**
    - **Solution & Complexity**
        - Key Ideas
        - **Python Solution**
            - Code
            - Explanation
            - Step-by-Step Walkthrough (summarized as a table)
        - **C++ Solution**
            - Code
            - Explanation
            - Step-by-Step Walkthrough (summarized as a table)
            - give me the output statements from gdb debugger with each iteration if there is an iteration else just show 
the workflow. 
        - Detailed Complexity Analysis
	 - **Deep Questions** Ask me short deep and concise questions that would force me to think deeply and help me develop the intuition to solve this question on my own. 
    - **Stack Trace** also show me the stacktrace of how functions were called. In case of recursion, show me with what values it was called. what was returned.
	-  **Visualizing Recursion** for a Tree Problem
    - **Similar Questions** (including question title, difficulty, description, and why it is similar—organized in a table)

    **In depth Analysis**
    -  Identify any complex or difficult-to-understand descriptions in the provided text. Rewrite these descriptions to make them clearer and more accessible. 
    - Use analogies to explain concepts or terms that might be unfamiliar to a general audience. Ensure that the analogies are relatable, easy to understand." 
    - "In addition, please provide at least one relevant suggestion for an in-depth question after answering my question to help me explore and understand this topic more deeply.

    (Please avoid opening and closing remarks; the more detailed, the better.)"""

```


### deep thinking questions

``` bash

Ask deep thinking questions based on these challenges
Answer them in table like fashion with three columns: Theme, Questions, One word answer (no other explanation) 

Here are the different suggestions:

Intuition behind the solution
Pattern and Algorithmic Design
Design Variants and Extensions
Mathematical & Analytical Insights
Debugging and Reasoning
Meta-Thinking: Problem Design Perspective
What-If" Scenario Challenges

----

ask more short and deep questions that will help me think of the solution on my own.
now for all the above questions, give me answer in a single word. do not explain anything. this way it will help me think in the right direction.


```


### Do not give the answer

``` bash

do not tell the answer. do not tell the answer or type it. do not tell the answer.

Do not tell me the solution of given problem. Look at my solution and only tell me which line is incorrect and how I can develop the intuition to solve the problem on  my own


```


### analyse the solution

``` bash
- look at your solution again and analyse what went wrong and fix it

- analyse your solution again. what are you doing wrong. why are some outputs correct while others are wrong. The output is not correct even for one of the test cases. review all test cases one by one. 
- dry run through the solution and check if your output matches the required output. 
analyse again. fix the problem. You are a senioir developer with a big deadline. This needs to be fixed ASAP.


```



### Breakpoints

``` bash

great. now one of my friends is interested and he doesn't know where to start.
Basically, he wants to run the code first to get an idea about how it works. 
His workflow includes using breakpoints to stop the flow and see different values at a point in time. 
This way he is able to understand, oh this step happens first, now we have this node and it has this value and so on.
he talks to himself a lot. Anyway, Then he wants to break and see how changing different values would break or make the program. 
But there is a problem, the variable names are not meaningful/verbose enough for him, he keeps on wondering what does these one letter characters mean, this breaks his rythm. 
Now based on this give a verbose code and complete step by step workflow he can follow. Where in the code to add breakpoints, which variables to analyse. etc


```