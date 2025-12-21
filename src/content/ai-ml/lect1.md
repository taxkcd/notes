---
title: lect 1
date: 2025-11-12
author: Taimour
---


## Lecture Video

[Stanford CS229: Machine Learning - Linear Regression and Gradient Descent | Lecture 2 (Autumn 2018)](https://www.youtube.com/watch?v=4b4MUYve_U8)

## Reference Sheet

| Symbol | Name | Meaning | Example |
| --- | --- | --- | --- |
| m | Number of examples | Size of training set | m = 100 |
| n | Number of features | Dimensionality of input | n = 1 |
| x⁽ⁱ⁾ | Input feature | i-th training input | x⁽¹⁾ = 12 |
| y⁽ⁱ⁾ | Output target | i-th training output | y⁽¹⁾ = 35 |
| h\_θ(x) | Hypothesis | Prediction function | h(x) = θ₀ + θ₁x |
| θⱼ | Parameter | j-th model parameter | θ₁ = 0.8 |
| J(θ) | Cost function | Error measure | J = 42.3 |
| α | Learning rate | Step size | α = 0.01 |
| ∂J/∂θⱼ | Partial derivative | Gradient component | 2.5 |

* * *

### The Problem

We have data about people's experience and their salaries. We want to build a model that can predict: **"If someone has X months of experience, what should their salary be?"**

### The Solution: Linear Regression

We're trying to find a **straight line** that best fits our data. This line is represented by:

    h(x) = θ₀ + θ₁x
    

or in simpler notation you might see:

    y = b + wx
    

**Key terminology:**

-   **h(x)** = hypothesis function (our prediction)
-   **θ₀** (theta zero) = intercept = **b** = starting salary
-   **θ₁** (theta one) = slope = **w** = how much salary increases per month
-   **x** = input feature (experience in months)

* * *

## Part 1: The Hypothesis Function

### What Is a Hypothesis?

In machine learning, a **hypothesis** is just our prediction function. For linear regression:

    h_θ(x) = θ₀ + θ₁x
    

**Real Example:** Let's say we found θ₀ = 30 and θ₁ = 0.8

-   For 12 months experience: h(12) = 30 + 0.8(12) = 39.6k salary
-   For 48 months experience: h(48) = 30 + 0.8(48) = 68.4k salary

The hypothesis maps inputs (experience) to outputs (salary predictions).

* * *

## Part 2: Training Data and Notation

### Standard ML Notation

-    `m = number of training examples` (e.g., 100 people in our dataset)
-    `n = number of features` (for simple linear regression, n=1)
-   `x⁽ⁱ⁾ = input features of the i-th training example`
-   `y⁽ⁱ⁾ = output/target of the i-th training example`
-   `(x⁽ⁱ⁾, y⁽ⁱ⁾) = the i-th training example`

**Example from my salary dataset:**

-   m = 7 (I have 7 people's data)
-   `(x⁽¹⁾, y⁽¹⁾)` = (12, 35) → 12 months exp, 35k salary
-   `(x⁽²⁾, y⁽²⁾)` = (24, 45) → 24 months exp, 45k salary
-   ...and so on

* * *

## Part 3: The Cost Function (Why We Need It)

### The Core Idea

We need a way to measure **"How good is our line?"**

If we just guess `θ₀=50 and θ₁=2`, our predictions might be way off! The cost function tells us how wrong we are.

### The Mathematical Definition

The **Mean Squared Error (MSE)** cost function:

    J(θ₀, θ₁) = (1/2m) × Σᵢ₌₁ᵐ [h_θ(x⁽ⁱ⁾) - y⁽ⁱ⁾]²
    

-   `h_θ(x⁽ⁱ⁾) = our prediction for person i`
-   `y⁽ⁱ⁾ = actual salary for person i`
-   `h_θ(x⁽ⁱ⁾) - y⁽ⁱ⁾\] = prediction error`
-   We **square** the error (to make negatives positive and penalize big errors more)
-   We **sum** over all m examples
-   We **divide by 2m** (the 2 makes calculus cleaner later)

### Why Squared Error?

1.  **Always positive**: Squaring ensures we don't have positive and negative errors canceling out
2.  **Penalizes large errors more**: Being off by 10 is worse than being off by 5 twice
3.  **Mathematically convenient**: Makes derivatives clean (you'll see why!)

### Visual Intuition

Imagine plotting all possible values of θ₀ and θ₁ on a 3D graph, with J(θ₀, θ₁) as the height:

-   You'd see a **bowl-shaped surface**
-   High cost (bad predictions) = high up on the bowl
-   Low cost (good predictions) = bottom of the bowl
-   **Our goal: Find the bottom of the bowl!**

* * *

## Part 4: Gradient Descent (The Core Algorithm)

### What Is Gradient Descent?

Gradient descent is the algorithm that finds the θ values that minimize our cost function. Think of it as:

**"You're blindfolded on a mountain and want to reach the valley. You feel around with your feet to find which direction goes downhill, then take a small step in that direction. Repeat until you reach the bottom."**

### The Update Rule

The gradient descent algorithm repeatedly updates θ values:

    θⱼ := θⱼ - α × (∂/∂θⱼ)J(θ₀, θ₁)
    

Where:

-   **:=** means "update" or "assign"
-   **α** (alpha) = learning rate (how big of a step to take)
-   **∂/∂θⱼ** = partial derivative (which direction to step)

### The Partial Derivatives

Through calculus (taking derivatives of the cost function), we get:

For **θ₀** (intercept):

    ∂J/∂θ₀ = (1/m) × Σᵢ₌₁ᵐ [h_θ(x⁽ⁱ⁾) - y⁽ⁱ⁾]
    

For **θ₁** (slope):

    ∂J/∂θ₁ = (1/m) × Σᵢ₌₁ᵐ [h_θ(x⁽ⁱ⁾) - y⁽ⁱ⁾] × x⁽ⁱ⁾
    

### The Complete Update Equations

**Simultaneously update** both parameters:

    θ₀ := θ₀ - α × (1/m) × Σᵢ₌₁ᵐ [h_θ(x⁽ⁱ⁾) - y⁽ⁱ⁾]
    
    θ₁ := θ₁ - α × (1/m) × Σᵢ₌₁ᵐ [h_θ(x⁽ⁱ⁾) - y⁽ⁱ⁾] × x⁽ⁱ⁾
    

**Important:** "Simultaneously" means calculate both new values using the OLD θ values, then update both at once.

* * *

## Part 5: Implementing Gradient Descent - Step by Step

### Algorithm Pseudocode

    1. Initialize θ₀ = 0, θ₁ = 0 (or random small values)
    2. Choose learning rate α (e.g., 0.01)
    3. Repeat until convergence:
       a. For each training example i:
          - Calculate prediction: h_θ(x⁽ⁱ⁾) = θ₀ + θ₁x⁽ⁱ⁾
          - Calculate error: error = h_θ(x⁽ⁱ⁾) - y⁽ⁱ⁾
       b. Sum up all errors
       c. Update θ₀: θ₀ := θ₀ - α × (1/m) × Σ(errors)
       d. Update θ₁: θ₁ := θ₁ - α × (1/m) × Σ(errors × x⁽ⁱ⁾)
       e. Calculate new cost J(θ₀, θ₁)
    4. Stop when cost stops decreasing significantly
    

### Python Implementation
``` python
    def gradient_descent(X, Y, learning_rate=0.01, iterations=1000):
        """
        X: array of experience values
        Y: array of salary values
        """
        m = len(Y)  # number of training examples
        theta_0 = 0  # initialize intercept
        theta_1 = 0  # initialize slope
        cost_history = []
        
        for iteration in range(iterations):
            # Step 1: Calculate predictions for ALL examples
            predictions = theta_0 + theta_1 * X
            
            # Step 2: Calculate errors for ALL examples
            errors = predictions - Y
            
            # Step 3: Calculate gradients (sum of errors)
            gradient_0 = (1/m) * np.sum(errors)
            gradient_1 = (1/m) * np.sum(errors * X)
            
            # Step 4: Update parameters SIMULTANEOUSLY
            theta_0 = theta_0 - learning_rate * gradient_0
            theta_1 = theta_1 - learning_rate * gradient_1
            
            # Step 5: Calculate and store cost
            cost = (1/(2*m)) * np.sum(errors ** 2)
            cost_history.append(cost)
            
            # Optional: Print progress
            if iteration % 100 == 0:
                print(f"Iteration {iteration}: Cost = {cost:.4f}")
        
        return theta_0, theta_1, cost_history
```

* * *

## Part 6: The Learning Rate (α)

### What Does α Control?

The learning rate determines **how big of a step** we take when updating θ.

### Choosing α: The Goldilocks Problem

**Too Small (α = 0.001):**

-   Guaranteed to converge (reach minimum)
-   Takes FOREVER (millions of iterations)
-   Like taking baby steps down the mountain

**Too Large (α = 1.0):**

-   Might overshoot the minimum
-   Can even diverge (bounce around and get worse!)
-   Cost increases instead of decreases
-   Like taking huge leaps and jumping over the valley

**Just Right (α = 0.01):**

-   Converges reasonably fast
-   Stable descent
-   Cost decreases smoothly

### How to Check If α Is Good

Plot **cost vs. iteration number**:

-   Should see a **smooth downward curve**
-   Cost should decrease every iteration
-   Eventually flattens out at minimum

**Red flags:**

-   Cost going up → α too large
-   Cost barely changing → α too small

### Practical Tip

Try multiple values: \[0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1.0\] and see which works best!

* * *

## Part 7: Batch Gradient Descent vs Other Variants

The algorithm described above is called **Batch Gradient Descent** because:

-   We use the **entire batch** of training data in each iteration
-   We sum errors over ALL m examples before updating θ

**Formula reminder:**

    θⱼ := θⱼ - α × (1/m) × Σᵢ₌₁ᵐ [error for example i]
    

### Why "Batch"?

In each iteration:

1.  We calculate predictions for ALL training examples
2.  We calculate errors for ALL training examples
3.  We sum ALL errors
4.  THEN we update θ

### Pros and Cons

**Pros:**

-   Stable convergence (smooth path to minimum)
-   Gets to exact minimum for convex problems
-   Easier to understand and implement

**Cons:**

-   Slow for large datasets (millions of examples)
-   Must load entire dataset into memory
-   Can't learn from new data until full pass complete

### Other Variants

**Stochastic Gradient Descent (SGD):**

-   Update θ after EACH example (not waiting for all m)
-   Faster but noisier path
-   Better for huge datasets

**Mini-Batch Gradient Descent:**

-   Update θ after small batches (e.g., 32 examples)
-   Balance between batch and stochastic
-   Most commonly used in practice

* * *

## Part 8: The Geometry and Intuition

### Why Does This Work? The Calculus Intuition

The derivative **∂J/∂θⱼ** tells us:

-   **Direction:** Which way to move θⱼ to decrease cost
-   **Magnitude:** How steep the slope is

**At the minimum:**

-   Derivative = 0 (flat, no slope)
-   Can't go down anymore
-   We've found the best θ!

### The Convex Property

For linear regression, the cost function J(θ) is **convex** (bowl-shaped):

-   Only ONE minimum (no local minima to get stuck in)
-   Gradient descent WILL find it (with proper α)
-   This is why linear regression is so reliable!

### Note

In practice, we use **vectorized** operations:
``` python
    # Instead of loops
    predictions = X.dot(theta)  # Matrix multiplication
    errors = predictions - Y
    gradient = (1/m) * X.T.dot(errors)
```    

This is:

-   100x faster (uses optimized linear algebra)
-   More concise code
-   Industry standard

* * *

## Part 9: Checking Your Implementation

### Convergence Criteria

When should gradient descent stop? Common approaches:

**1\. Fixed iterations:**

    for i in range(1000):  # Just run 1000 times
    

**2\. Cost threshold:**

    if cost < 0.001:  # Cost small enough
        break
    

**3\. Change threshold:**

    if abs(cost - previous_cost) < 1e-6:  # Cost not changing much
        break
    

### Debugging Tips

**If cost is increasing:**

-   Learning rate too high → decrease α
-   Bug in code → check your math!

**If cost decreasing very slowly:**

-   Increase learning rate (carefully!)
-   Run more iterations
-   Consider feature scaling (next section)

**If results seem wrong:**

-   Plot your data and the fitted line visually
-   Calculate cost manually for a few examples
-   Check your gradient calculations

* * *

## Part 10: Feature Scaling (Critical for Real Data!)

### The Problem

If your features have very different scales:

-   Experience: 0-100 months
-   Age: 20-60 years
-   Previous salary: 20,000-100,000

Gradient descent becomes **very slow** and **unstable**!

### The Solution: Normalize Your Features

**Method 1: Min-Max Scaling (0 to 1)**

    X_scaled = (X - X.min()) / (X.max() - X.min())
    

**Method 2: Standardization (mean=0, std=1)**

    X_scaled = (X - X.mean()) / X.std()
    

### Why This Helps

With similar scales:

-   Gradient descent converges MUCH faster
-   Can use larger learning rates
-   More numerically stable

After scaling the salary data, my model converged in 100 iterations instead of 10,000!

* * *

## Part 11: Takeaways

### The Core Concepts

1.  **Linear regression finds the best straight line** through data
2.  **The cost function measures how wrong** our predictions are
3.  **Gradient descent is an iterative algorithm** that finds the minimum cost
4.  **Learning rate controls the step size** - too big or too small causes problems
5.  **Feature scaling is crucial** for real-world data

### Common Mistakes

1.  Using learning rate too high (cost exploded!)
2.  Not normalizing features (took forever to converge)
3.  Forgetting to update θ₀ and θ₁ simultaneously
4.  Using way too large initial values for θ

### The Aha! Moments

-   **Derivatives tell us which direction to go** - that's why calculus matters!
-   **The cost function is like a GPS** - it guides us to the destination
-   **Batch gradient descent uses ALL data** - that's why it's called "batch"
-   **Linear regression is convex** - we'll always find the global minimum!

* * *

## Part 12: Applying This to My Salary Prediction Project

### My Data

-   **m = 7** training examples
-   **Feature:** Experience in months (12, 24, 36, 48, 60, 72, 84)
-   **Target:** Salary in thousands (35, 45, 55, 65, 75, 85, 95)

### Step 1: Feature Scaling

    X_mean = X.mean()  # 48 months
    X_std = X.std()    # 25.46 months
    X_scaled = (X - X_mean) / X_std
    
    Y_mean = Y.mean()  # 65k
    Y_std = Y.std()    # 21.6k  
    Y_scaled = (Y - Y_mean) / Y_std
    

### Step 2: Run Gradient Descent

    theta_0, theta_1, costs = gradient_descent(
        X_scaled, 
        Y_scaled, 
        learning_rate=0.01, 
        iterations=1000
    )
    

### Step 3: Results

After training:

-   **θ₀ ≈ 0** (makes sense - scaled data is centered!)
-   **θ₁ ≈ 1.0** (perfect linear relationship in my data)
-   **Final cost ≈ 0.001** (very low - great fit!)

### Step 4: Making Predictions

For someone with 30 months experience:

    # Scale the input
    x_scaled = (30 - X_mean) / X_std
    
    # Make prediction (scaled)
    y_scaled_pred = theta_0 + theta_1 * x_scaled
    
    # Unscale the output
    y_pred = y_scaled_pred * Y_std + Y_mean
    # Result: approximately 50k salary
    

* * *

## Further Learning

1.  **Multiple Linear Regression** - More than one feature (experience + education + age)
2.  **Polynomial Regression** - For non-linear relationships
3.  **Regularization** - Preventing overfitting (Ridge, Lasso)
4.  **Normal Equation** - Closed-form solution (no iterations needed!)

* * *

## Conclusion: 

-   It's an **optimization problem** - we're minimizing error
-   **Gradient descent** is a general algorithm used everywhere in ML
-   The **math isn't scary** - it's just derivatives pointing us downhill
-   **Implementation is straightforward** - ~20 lines of Python!

* * *

