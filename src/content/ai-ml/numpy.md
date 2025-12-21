---
title: Numpy
date: 2025-11-12
author: Taimour
---





## Numpy




### 1. Numpy Basics

#### i. Code Example 1

``` python


import numpy as np

# Populate arrays with specific numbers
# Call np.array to create a NumPy array with your own hand-picked values. For example, the following call to np.array creates an 8-element array:

one_dimensional_array = np.array(["abc" , 2 , 3 ,4 ,5])
one_dimensional_array
#array(['abc', '2', '3', '4', '5'], dtype='<U11')


hetro_array = np.array([1 ,2 ,3 , 1.5])
hetro_array
#array([1. , 2. , 3. , 1.5])


#You can also use np.array to create a two-dimensional array. To create a two-dimensional array specify an extra layer of square brackets. For example, the following call creates a 3x2 array:

two_dimensional_array = np.array([[1 , 2] , [3 , 4] , [5 , 6]])
two_dimensional_array
# array([[1, 2],
#        [3, 4],
#        [5, 6]])

zeroes = np.zeros(5, dtype=int)
zeroes
# array([0, 0, 0, 0, 0])

ones = np.ones(10 , dtype=int)
ones
# array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])


#Populate arrays with sequences of numbers
#You can populate an array with a sequence of numbers:

sequence = np.arange( 5 , 20)
sequence
#array([ 5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])


#Populate arrays with random numbers
#NumPy provides various functions to populate arrays with random numbers across certain ranges. For example, np.random.randint generates random integers between a low and high value. The following call populates a 6-element array with random integers between 50 and 100.

random_number = np.random.randint(low = 50 , high = 101 , size=(6,))
random_number
#array([ 71,  56,  93, 100,  91,  97])

random_floats= np.random.random((6,))
random_floats
#array([0.36148591, 0.5039309 , 0.26607144, 0.43062768, 0.1323317 ,
 #      0.33059182])

 
#Mathematical Operations on NumPy Operands
random_number_between_2_3 = random_floats + 2.0
random_number_between_2_3
#array([2.36148591, 2.5039309 , 2.26607144, 2.43062768, 2.1323317 ,
 #      2.33059182])

random_number_between_150_300 = random_number * 3
random_number_between_150_300
#array([213, 168, 279, 300, 273, 291])


#Creating List with Mixed Data Types
arr = [1 , 2.5 , "Arham" , {"key" : "vales"} , 1]
mixed = np.array(arr)
arr
#[1, 2.5, 'Arham', {'key': 'vales'}, 1]


```

#### ii. Code Example 2


``` python

import numpy as np


# Creating Arrays
arr1 = np.array=([[1 , 2 ,3] , [4 ,5 ,6]])
arr1
#[[1, 2, 3], [4, 5, 6]]

# Array of Zeros and Ones 
zero_arr = np.zeros(8)
one_arr = np.ones(4)
print(zero_arr)
one_arr
# [0. 0. 0. 0. 0. 0. 0. 0.]
# array([1., 1., 1., 1.])

# Range of Numbers
range_arr =  np.arange(8)
range_arr
# array([0, 1, 2, 3, 4, 5, 6, 7])

# Reshaping Arrays
reshap1 = np.arange(9)
reshap1 = reshap1.reshape(3 , 3)
reshap1
# array([[0, 1, 2],
#        [3, 4, 5],
#        [6, 7, 8]])


# Basic Operations (Add, subtract, multiply, divide)
sample_arr = [8 , 9 ,10 , 11 , 12 , 13 , 14]
sample_arr2 = [ 1 , 2, 3 , 4 ,5 ,6 ,7]
print(sample_arr , sample_arr2)


plus = np.multiply(sample_arr , sample_arr2)
print(plus)
# [8, 9, 10, 11, 12, 13, 14] [1, 2, 3, 4, 5, 6, 7]
# [ 8 18 30 44 60 78 98]


# Array Statistics
stat = [8 , 9 ,10 , 11 , 12 , 13 , 14]
print(np.sum(stat))
print(np.min(stat))
print(np.max(stat))
print(np.mean(stat))
# 77
# 8
# 14
# 11.0


# Indexing and Slicing
indexing = [8 , 9 ,10 , 11 , 12 , 13 , 14]
print(indexing[0:3])
# [8, 9, 10]

# Random Numbers
random = np.random.rand(4) + 2
for i in random:
    print(i)
# 2.933902229457387
# 2.623068146383437
# 2.17947987426419
# 2.4973686731030322

# Identity Matrix
iden = np.eye(4)
iden
# array([[1., 0., 0., 0.],
#        [0., 1., 0., 0.],
#        [0., 0., 1., 0.],
#        [0., 0., 0., 1.]])


# TODO
# Flatten
# Transpose
# Concatenate
# Unique
# Sum along axis


```

### 2. Operations

#### 2a. Creating a Vector

``` python
#Use NumPy to create a one-dimensional array:
# Load library

import numpy as np
# Create a vector as a row
vector_row = np.array([1, 2, 3])
print(vector_row)


# Create a vector as a column
print(" ")
vector_column = np.array([[1],
                          [2],
                          [3]])
print(vector_column)

# [1 2 3]
 
# [[1]
#  [2]
#  [3]]

```
#### 2b. Creating a Matrix

``` python


#Use NumPy to create a two-dimensional array:
# Load library

import numpy as np
# Create a matrix
matrix = np.array([[1, 2],
 [1, 2],
 [1, 2]])

print(matrix)


# [[1 2]
#  [1 2]
#  [1 2]]

```
#### 2c. Creating a  Sparse Matrix

``` python
#Create a sparse matrix:
# Load libraries

import numpy as np
from scipy import sparse
# Create a matrix
matrix = np.array([[0, 0],
                   [0, 1],
                   [3, 0]])

# Create compressed sparse row (CSR) matrix

matrix_sparse = sparse.csr_matrix(matrix)
print(matrix_sparse)

#   (1, 1)	1
#   (2, 0)	3
```

- Sparse matrices only store nonzero elements and assume all other values will be zero, leading to significant computational savings. In our solution, we created a NumPy array with two nonzero values, then converted it into a sparse matrix. If we view the sparse matrix we can see that only the nonzero values are stored:

- There are a number of types of sparse matrices. However, in compressed sparse row (CSR) matrices, (1, 1) and (2, 0) represent the (zero-indexed) indices of the nonzero values 1 and 3, respectively. For example, the element 1 is in the second row and second column. We can see the advantage of sparse matrices if we create a much larger matrix with many more zero elements and then compare this larger matrix with our original sparse matrix:


``` python
# Create larger matrix

matrix_large = np.array([[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                         [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                         [3, 0, 0, 0, 0, 0, 0, 0, 0, 0]])

# Create compressed sparse row (CSR) matrix

matrix_large_sparse = sparse.csr_matrix(matrix_large)

# View original sparse matrix

print(matrix_sparse)
 
#    (1, 1)	1
#   (2, 0)	3
```
#### 2d. Selecting Elements

``` python

#NumPy’s arrays make that easy:
# Load library

import numpy as np
# Create row vector
vector = np.array([1, 2, 3, 4, 5, 6])

# Create matrix
matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])
# Select third element of vector

print(vector[2])

# 3




# Select second row, second column

matrix[1,1]

# 5


# Select all elements of a vector
print(vector[:])
# Select everything up to and including the third element
print(vector[:3])
# Select everything after the third element
print(vector[3:])
# Select the last element
print(vector[-1])


# [1 2 3 4 5 6]
# [1 2 3]
# [4 5 6]
# 6

# Select the first two rows and all columns of a matrix
matrix[:2,:]

# array([[1, 2, 3],
#        [4, 5, 6]])


# Select all rows and the second column
matrix[:,1:2]

# array([[2],
#        [5],
#        [8]])


```
#### 2e. Describing a Matrix

You want to describe the shape, size, and dimensions of the matrix.

``` python
#Use shape, size, and ndim:
# Load library
import numpy as np
# Create matrix
matrix = np.array([[1, 2, 3, 4],
                   [5, 6, 7, 8],
                   [9, 10, 11, 12]])
# View number of rows and columns
matrix.shape
# (3, 4)



# View number of elements (rows * columns)
matrix.size
# 12


# View number of dimensions
matrix.ndim
# 2
 
```
#### 2f. Applying Operations to Elements
You want to apply some function to multiple elements in an array.

``` python

#Use NumPy’s vectorize:
# Load library

import numpy as np
# Create matrix
matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])
# Create function that adds 100 to something
add_100 = lambda i: i + 100
add_100
# <function __main__.<lambda>(i)>


# Create vectorized function
vectorized_add_100 = np.vectorize(add_100)
print(vectorized_add_100)
# <numpy.vectorize object at 0x00000258B4E66250>



# Apply function to all elements in matrix
vectorized_add_100(matrix)
# array([[101, 102, 103],
#        [104, 105, 106],
#        [107, 108, 109]])


# Add 100 to all elements
matrix + 100
# array([[101, 102, 103],
#        [104, 105, 106],
#        [107, 108, 109]])       



```
#### 2g. Finding the Maximum and Minimum Values

``` python

# Load library
import numpy as np
# Create matrix

matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])
# Return maximum element
max = np.max(matrix)
print(max)
print()

# Return minimum element
min=np.min(matrix)
print(min)

# 9

# 1




# Find maximum element in each column
max = np.max(matrix, axis=0)
print(max)
print()

# Find maximum element in each row
min = np.max(matrix, axis=1)
print(min)

# [7 8 9]

# [3 6 9]


```
#### 2h. Calculating the Average, Variance, and Standard Deviation

``` python

#Use NumPy’s mean, var, and std:
# Load library
import numpy as np
# Create matrix

matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])
# Return mean
np.mean(matrix)
# 5.0



# Return variance
np.var(matrix)
# 6.666666666666667


# Return standard deviation
np.std(matrix)
# 2.581988897471611



# Find the mean value in each column
np.mean(matrix, axis=0)
# array([4., 5., 6.])


```
#### 2i. Reshaping Arrays

You want to change the shape (number of rows and columns) of an array without changing the element values

``` python

#Use NumPy’s reshape:
# Load library
import numpy as np
# Create 4x3 matrix

matrix = np.array([[1, 2, 3],
                 [4, 5, 6],
                 [7, 8, 9],
                 [10, 11, 12]])
# Reshape matrix into 2x6 matrix
matrix.reshape(2, 6)
# array([[ 1,  2,  3,  4,  5,  6],
#        [ 7,  8,  9, 10, 11, 12]])



matrix.size
# 12

matrix.reshape(1, -1)
# array([[ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12]])


matrix.reshape(12)
# array([ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12])

```
#### 2j. Transposing a Vector or Matrix

``` python

#Use the T method:
# Load library
import numpy as np
# Create matrix

matrix = np.array([[1, 2, 3],
 [4, 5, 6],
 [7, 8, 9]])
# Transpose matrix
matrix.T
# array([[1, 4, 7],
#        [2, 5, 8],
#        [3, 6, 9]])

# Transpose vector
np.array([1, 2, 3, 4, 5, 6]).T
# array([1, 2, 3, 4, 5, 6])

# Tranpose row vector
np.array([[1, 2, 3, 4, 5, 6]]).T
# array([[1],
#        [2],
#        [3],
#        [4],
#        [5],
#        [6]])


```
#### 2k. Flattening a Matrix
You need to transform a matrix into a one-dimensional array.

``` python
#Use flatten:
# Load library
import numpy as np
# Create matrix

matrix = np.array([[1, 2, 3],
 [4, 5, 6],
 [7, 8, 9]])

# Flatten matrix
matrix.flatten() 

# array([1, 2, 3, 4, 5, 6, 7, 8, 9])



# flatten is a simple method to transform a matrix into a one-dimensional array. Alternatively, we can use reshape to create a row vector:

matrix.reshape(1, -1)
# array([[1, 2, 3, 4, 5, 6, 7, 8, 9]])




```
#### 2l. Finding the Rank of a Matrix

``` python

#Use NumPy’s linear algebra method matrix_rank:
# Load library
import numpy as np
# Create matrix
matrix = np.array([[1, 1, 1],
                 [1, 1, 10],
                 [1, 1, 15]])
# Return matrix rank
np.linalg.matrix_rank(matrix)
# 2



```
#### 2m. Calculating the Determinant

``` python
#Use NumPy’s linear algebra method det:
# Load library
import numpy as np
# Create matrix
matrix = np.array([[1, 2, 3],
 [2, 4, 6],
 [3, 8, 9]])
# Return determinant of matrix
np.linalg.det(matrix)
# 0.0


```
#### 2n. Getting the Diagonal of a Matrix


``` python

#Use diagonal:
# Load library

import numpy as np
# Create matrix
matrix = np.array([[1, 2, 3],
                 [2, 4, 6],
                 [3, 8, 9]])


# Return diagonal elements
matrix.diagonal()
# array([1, 4, 9])


```
#### 2o. Calculating the Trace of a Matrix

``` python
#Use trace:
# Load library

import numpy as np
# Create matrix
matrix = np.array([[1, 2, 3],
                 [2, 4, 6],
                 [3, 8, 9]])


# Return trace
matrix.trace()
# 14



```
#### 2p. Finding Eigenvalues and Eigenvectors

``` python
#Use NumPy’s linalg.eig:
# Load library

import numpy as np
# Create matrix
matrix = np.array([[1, -1, 3],
                     [1, 1, 6],
                     [3, 8, 9]])


# Calculate eigenvalues and eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(matrix)

# View eigenvalues
eigenvalues
# array([13.55075847,  0.74003145, -3.29078992])

# View eigenvectors
eigenvectors
# array([[-0.17622017, -0.96677403, -0.53373322],
#        [-0.435951  ,  0.2053623 , -0.64324848],
#        [-0.88254925,  0.15223105,  0.54896288]])


```



#### 2q. Calculating Dot Products

``` python
Calculating Dot Products
#Use NumPy’s dot:
# Load library

import numpy as np
# Create two vectors
vector_a = np.array([1,2,3])
vector_b = np.array([4,5,6])

# Calculate dot product

np.dot(vector_a, vector_b)
# 32

```
#### 2r. Adding and Subtracting Matrices

``` python
# Load library
import numpy as np
# Create matrix

matrix_a = np.array([[1, 1, 1],
                     [1, 1, 1],
                     [1, 1, 2]])

# Create matrix
matrix_b = np.array([[1, 3, 1],
                     [1, 3, 1],
                     [1, 3, 8]])

# Add two matrices
np.add(matrix_a, matrix_b)

# array([[ 2,  4,  2],
#        [ 2,  4,  2],
#        [ 2,  4, 10]])



# Subtract two matrices
np.subtract(matrix_a, matrix_b)
# array([[ 0, -2,  0],
#        [ 0, -2,  0],
#        [ 0, -2, -6]])

```
#### 2s. Multiplying Matrices

``` python

# Load library
import numpy as np
# Create matrix

matrix_a = np.array([[1, 1],
                    [1, 2]])
# Create matrix
matrix_b = np.array([[1, 3],
                     [1, 2]])

# Multiply two matrices
np.dot(matrix_a, matrix_b)
# array([[2, 5],
#        [3, 7]])


```
#### 2t. Inverting a Matrix

``` python
#Use NumPy’s linear algebra inv method:
# Load library

import numpy as np
# Create matrix
matrix = np.array([[1, 4],
                   [2, 5]])

# Calculate inverse of matrix
np.linalg.inv(matrix)
# array([[-1.66666667,  1.33333333],
#        [ 0.66666667, -0.33333333]])

```
#### 2u. Generating Random Values

``` python
# Load library
import numpy as np
# Set seed

np.random.seed(0)
# Generate three random floats between 0.0 and 1.0

np.random.random(3)
# array([0.5488135 , 0.71518937, 0.60276338])

# Generate three random integers between 1 and 10
np.random.randint(0, 11, 3)
# array([3, 7, 9])


# Draw three numbers from a normal distribution with mean 0.0
# and standard deviation of 1.0
np.random.normal(0.0, 1.0, 3)
# array([-1.42232584,  1.52006949, -0.29139398])


# Draw three numbers from a logistic distribution with mean 0.0 and scale of 1.0
np.random.logistic(0.0, 1.0, 3)
# array([-0.98118713, -0.08939902,  1.46416405])


# Draw three numbers greater than or equal to 1.0 and less than 2.0
np.random.uniform(1.0, 2.0, 3)
array([1.47997717, 1.3927848 , 1.83607876])

```
