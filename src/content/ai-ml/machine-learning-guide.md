---
title: Machine Learning Guide
date: 2025-11-12
author: Taimour
---


## Prerequisities


> #### 1. What is Machine Learning?
>
> Machine Learning is a feild of computer science that uses a statistical technique to give computer systems the ability to learn with data, without being explicted programming.
>
> In Simple words Machine learning is all about Learning from data.
---


> #### 2. What is Explict programming?
> 
> In Explict Programming we have to write code of every single scenario to handle this scenario.

---

> #### 3. Uses of ML:
>
> We have many scenarios but we can't write code in these scenarios. So in these scenarios we use Machine Learning.
>
> `1) Email Spam:`
>
> You could write if-else rules like: “If an email contains 3 ‘discount’ words and 3 words in CAPS, mark as spam.”
> But spammers easily bypass these rules by changing words (e.g., replacing HUGE with massive).
>
> ML learns patterns from data and adapts automatically, no need to rewrite logic every time.
>
> `2) Image Classifications`
>
> If asked to write code to detect whether an image contains a dog, you would need endless conditions for every breed, angle, color, and size.
>
> ML learns from images (like humans do) and identifies patterns on its own, making it suitable for such tasks.


---


> #### 4. What is Data Analysis?
>
> Data Analysis is the process where we find the hidden information or useful insights from data by plotting graphs or anything else. 
>
> Like : Predicting weather , Trading and Bitcoin price.
>
> But sometime we can't find the useful insights by just plotting graphs.


---



> #### 5. What is data mining?
>
>Like if we want to create a email span identifier you will apply an algorithm on data and this algorithm should identify the data and give you the output.
>
> In simple words we create a prediction model.	
>
> Then you should go and check the ML model and check that ML model follow which patterns to check wether the email is spam or not.
>
> And this is called Data Mining. Like extract information very deeply and maybe extract information by using ML patterns.
>  
> So that's why ML is very important. So that's for Data Mining Machine Learning is the best tool.


---



> #### 6. History of ML:
>
>As ML are in industry for a very long time but no body knows about ML.
> 
> Why peoples don't know about ML?
> 
> Bcz for ML we need data and for processing we need algoirthm that our Machine not handle.
> 
> Let's suppose if we have data but not a good hardware then this data is nothing.
> 
> So when the internet comes we will create many data in just one year 2016. Like data from the start of the world to 2015 are only create in 2016.
> 
> So then ML graph starting up.


---

> #### 7. What is Data Frame?
>
> A data frame is like a table in which you can organize and store data. It has rows and columns, where:
>
> Each `column` represents a different type of data (e.g., names, ages, scores).
>
> Each `row` represents a single data entry (e.g., one person's details across different columns).
>
> In programming, data frames are used to handle and manipulate data efficiently, especially in languages like Python (using pandas) and R.

---

> #### 8. What is AI Artificial Intelligence?
>
> AI means Artificial Intelligence. It means putting Intelligence in the Machines. After 1950: The scientists started thinking about how to put intelligence in machines.They build symbolic Ai.
> 
>`Symbolic Ai` means putting If else conditions and make a huge system.
> eg: Expert System like Chess System. Like Lunger Cancer Disease Detection

---

> #### 9. What is Machine Learning?
>
> ML is a subset of AI that enables systems to learn and improve from data without being explicitly programmed.
>
> Example
>
> `Problem:`Consider the task of recognizing dogs in images. Symbolic AI fails, because there are so many breeds of dogs. Writing if-else conditions for every breed is impractical and nearly impossible
> 
> `Solution:` Then ML comes. In ML you just give data to the system and it will create logics by itself. And it will recognize the patterns byitself from this data.
>
> `Misconception`Many people claim ML is purely statistics-based. While statistics plays a role, ML involves much more: like Algorithm design and implementation, Feature engineering, Model optimization. So, we mostly do coding in it.

---

> #### 10. What is Deep Learning
>
> Deep Learning is a specialized subset of Machine Learning that uses neural networks with multiple layers.
> 
> | Aspect                | Machine Learning                                   | Deep Learning                                           |
> |-----------------------|----------------------------------------------------|----------------------------------------------------------|
> | Feature Engineering   | Manual – humans identify relevant features         | Automatic – the model extracts features itself           |
> | Data Requirements     | Works well with smaller datasets                   | Requires large amounts of data                           |
> | Algorithm Complexity  | Simpler algorithms                                 | Complex, multi-layered neural networks                   |
> | Example               | Requires manual labeling: “this is a dog”, “this is a cat” | Automatically learns distinguishing features     |
> 
> `Misconception:`Many peoples said that DL work same as our brain works but its totally false.
>  Deep Learning is the mathematical model, its smallest unit is called neuron. it's only conceptually similar to a biological neuron.


---
---
---
---


## Types of ML 

---

### 1. Supervised Machine Learning 

Machine Learning is all about Learning from data. So, If in data you have both input and output but you want to find the realtion between them.

So for the new input you will tell the output. So this learning is called Supervised Machine Learning.

#### Example

Lets suppose we have data of 5000 students.

| IQ | CGPA | Placement (Y/N)  |
|----|-------|-----------------|
| 76 | 7.8   | Yes             |
| 84 | 8.1   | Yes             |
| 56 | 6.3   | No              |


So in this data set we have both input and output. From this dataset our ML model recognize the main relationship between the input and output for future use.

> Note :  We use mostly Supervised Machine Learning ahead.

---

#### i.  Regression

Let's suppose we have a Supervised ML problem. It means in the dataset we have both input and output columns.

We just have to check that wether the output column is numerical or categorical. If column is `numerical` then we use Regression model there.

---

#### ii.  Classification

Let's suppose we have a Supervised ML problem. It means in the dataset we have both input and output columns.

We just have to check that wether the output column is numerical or categorical. If column is `catergorical` then we use Classification model there.

##### For Example

If we have a dateset where all the info of the house is stored like how many rooms , bathrooms and kitchens and in the output we have house pize. 

Then we use Regression Model there.

As we dicussed before about the dataset of students. It will be the example of Classification model.

---


### 2 UnSupervised Machine Learning

UnSupervised Machine Learning is quite opposite from Supervised Machine Learning.

In UnSupervised Machine Learning we only have input we don't have output. It means Prediction is not possible.

So we may work with Clustering , Anomoly Detection , Dimensionally Reduction or Associate Rule Learning


---


#### i. Clustering

Let's suppose we have dataset of 5000 students.

| IQ  | CGPA | Output / Label |
|-----|-------|----------------|
| 80  | 9.8   | 0              |
| 43  | 1.3   | 1              |
| 54  | 6.4   | 2              |


In the Clustering, I grouping the IQ OR CGPA and label the data according to me for Supervised ML like 0 if both are ok , 1 if IQ is less and 2 if both are less.

In simple words I caterized the data.

Clustering is very useful in today's industries.


![[clustering.png]]

---

#### ii. Dimensionally Reduction

In simple terms, dimensionality reduction involves reducing the number of columns in a dataset like 2 columns to 1 columns or 3 columns to 1 columns for better use.

Let's suppose we have a dataset that has more than 1000 columns so our algorithm works very slowly on this dataset. 

If we want add more columns in it. It's very difficult for us to add. So in this scenerio we use Dimensionally Reduction.

##### Example

We have a dataset of house in which we have 3 columns , No of rooms , No of bathrooms and No of Kitchens. So in these scenerio we have to predict the prize of house.

So if we concatenate all the 3 columns to one by squrefit area like we create a new columns from the existing columns. It's called `Feature Selection`.

So we create a new columns by given multiple columns since no of columns reduced. Then its called Dimensionally Reduction.

There is an algorithm called `PCA` we will work on Principal component analysis (PCA) in future.

---


#### iii. Anomoly Detection

Anomaly detection, also known as outlier detection, is the process of identifying data points, events, or patterns that

deviate significantly from the expected behavior of a dataset. 

These anomalies can indicate critical issues, such as technical faults, fraudulent activities, or changes in system behavior. 

![[anomoly_detection.png]]


#### iv. Associate Rule Learning


Association Rule Learning is a method in data mining that identifies interesting relationships (associations) between variables in large datasets. 
 
The primary goal is to discover hidden patterns and correlations that can be useful for decision-making. 

This method is widely used in market basket analysis, where it helps in finding product associations that frequently occur together in transactions.

---

### 3 Semi Supervised Machine Learning

It is partially Supervised and partially UnSupervised Machine Learning.

Labeling is very difficult like creating output from the data. It reuires many human hours to right.

But then the peoples thinks what if we don't need to label all the data like we only label 3 or 4 input columns and others get automatically labeled.

#### Example:
Google Photos if we give data to google photos it grouping the data like seperate the image on person and the other person and then ask you to name this.

If we name this it will automatically labeled the remaining data.

---

### 4. Reinforcement 

In these scenerio we don't have any data. In this your algorithm start learning from scratch like us human beings.

There a company called Deep mind. They made agents. Go game , Alpha go they beat the world champion straight in the 4 games.

We give -points if the scenerio is wrong and reward if the scenerio is right.

![[reinforcement.png]]

---
---
---
---


## Batch vs Online ML

---

### 1. Batch Machine Learning

In Batch Machine Learning you train the model by all data. It means you don't train the model in chunks of data. We train the model by all data. Its also called 
Offline Machine Learning. In Ofline Machine Learning we train our model ofline in our Machine. And then when the model will train we let them go to the produciton enviornment.

`Problem:` our model is static. It means our model learn once. Then it will work on the previous problem.

`For example:`We train our model on netflix recomendation system. But the netflix are adding new movies every week. So we have to re train our model on that. so, we have to re train our model again and again then we have to deploy it.

Main Disadvantages of Machine Learning

1. Lots of Data   -> If we have a lots of data and our code don't pulled it so it will not train. As we have to train the data at once.
2. Hardware Limitation 
3. Availability -> News update after 24 hour

![[batch_ml.png]]

---

### 2. Online Machine Learning

Have you ever listen that a company told that you use our product more the performance of our product will be better more and more. Like according to useability the performance of our product will be better more and more.

Many companies are talking about Online Machine Learning. It means they train there model according to it like on the way on the server there model improve by new data.
Online machine learning refers to a model training approach where the algorithm learns from data in a sequential manner, updating its knowledge as new data arrives. 

Unlike traditional batch learning, which requires the entire dataset to be processed at once, online learning processes data incrementally. 
This is particularly useful for situations where data is too large to fit into memory, or when the data is constantly changing and needs to be updated in real-time.

![[online_ml.png]]
![[ofline_online_ml.jpg]]
![[out_of_core_learning.png]]

---

## Model vs Instance

Machine Learning Model train data in two forms. There are two ways to train our model that is:

 1.  Memorizing: our algorithm memorize all the data and works according to them. This is called `Instance Based Learning.`

 2. Generalization: Our algorithm underline the concept behind them. This is called `Model Based Learning.`

![[modal_vs_instance_ml.jpg]]

---

### 1. Model Based Learning

Model-based machine learning refers to a type of machine learning approach where the learning process involves constructing and training a model based on the data.  The goal is to create a model that can make predictions or decisions based on input data. 

![[model_based_learning.png]]



---


### 2. Instance Based Learning

| IQ | CGPA | Placement (Yes/No) |
|----|------|---------------------|
| 8  | 80   | Yes                 |
| 7  | 7.5  | No                  |


It gives result according to their neighbours. There is not concept of training and learning in Instance based learning.

We mostly use `KNN (K nearest Neighbour) Algorithm` in Instance Based Learning.

![[Instance_based_learning.png]]


---
---
---
---


## Challenges in Machine Learning

There are 8 Major Challenges in Machine Learning that you will face in your career.

### 1. Data Collection

Machine Learning is all about learning from data. So if we have not data how we train our model? If we have not required data. Then, we may perform 2 steps.

- 1. Fetch Data from API
- 2. Web Scrapping

> Note: There may be some issue or error while gathering data from them. It's a difficult task.

---

### 2. Insufficient Data / Labeled Data

Let's Suppoose we have two algorithms working on the same problem but the amout of data is different.

Algorithm A is much better than algorithm B.

| A          | B             |
|------------|----------------|
| 100 Rows   | 10 Lakh Rows   |
| M1         | M2             |


 When you have enormous amounts of data, the choice of algorithm becomes less important. A simpler algorithm with more data can beat a sophisticated algorithm with less data. This phenomenon is called `The Unreasonable Effectiveness of Data`

But gathering a huge set of data is a bit difficult task. Nowadays, We have small or medium datasets, so algorithm is matter.

---

### 3. Non-representative Data

Non-representative data occurs when the data collected does not accurately reflect the broader population or context it is meant to represent. This often leads to incorrect predictions or conclusions.

`For example:` if we conduct a survey in Pakistan asking who will win the World Cup, and predict that Pakistan will win simply because it is our home country,

The prediction may be biased. To make an accurate prediction, the survey should include responses from individuals in all countries participating in the World Cup.
This ensures that the data is representative of all the relevant stakeholders, rather than just a partial view.

This is called `Sampling Noise. and Sampling biased`. Like 200 pakistanis from other countries.

---

### 4. Poor Quality Data

It's said that if you are woking on a Machine Learning project. You should give 60% time to data . and the other 40% time to the reamining algorithm. This is because the quality of your data has a direct impact on how well your model performs.

Poor data means:
1. missing values
2. Double values 
3. Incorrect or inconsistent data
4. Outliers or noisy data
5. Imbalanced data

---

### 5. Irrelevant Features

Features means Columns. So consider, we have some columns that do not contribute in our data analysis. So it's also a problem.

There is a phrase : Garbage in, Garbage out. It means if we put garbage in we will get garbage in the output.

`For example:` Let's suppose you arrange a race. And you have data of so many peoples. You have age , weight , height , fitness etc.

So a fit person can participate in race right? 

Input columns :  Age , Weight , Height , Location. Here, Location is nothing if we remove it our work should go.

---

### 6. OverFitting

If you train a model with some data and this Machine Learning Model remember the data only but not concept of the data. The next time when we give new data to our model it does not work properly. This is b/c it's remembering the previous data. Then it's called `overfitting.`

`For example:` I go to lahore then i go cinema and i watch the movie and the price of the ticket is very costly and I remember that everything in lahore is costly.

Same as in ML model they remember everything and it thinks everyhing is just like that.

---

### 7. Underfitting

Underfitting in machine learning is when a model is too simple to understand the patterns in the data. Resulting in poor performance on both the training and new data. 
It's like trying to solve a complex problem with a basic tool that can't handle the job.

---

### 8. Software Integerations

When you are working on ML problem, the end goal is to make sure that this model will make a software that's going to help users such as a recomendation System, Loan default system

There can be compatibility issues due to different platforms like windows , mac , linux , android. Sometimes our model does not works properly on previous techs likes JAVA , C++. 

---

### 9. Offline Learning

Explanined above

---

### 10. Cost Involved

A lot of costs are required like we don't know how our money expand.

---
---
---
---

## Applications of Machine Learning

### 1. Business to Business (B2B)

In B2B, machine learning is used to help businesses make smarter decisions using data.

##### Examples

###### 1. Amazon, Big Bazaar

Amazon has 6+ crore (60 million+) products listed on its platform. During sales season, Amazon cannot discount every product, so it uses machine learning to:
   - Analyze historical sales data
   - Identify which products will sell the most
   - Offer discounts only on selected products to maximize profit

   

###### 2. Customer Data Selling

When you shop at a mall like Chase Up and share your phone number at checkout, your purchasing data is recorded.
If you mostly buy health products, your data may be sold to: Gyms, Fitness product companies ,watch sellers

A company may buy 1 lakh phone numbers, but only 100 may convert into real customers.



###### 3. Product Placement in Stores

In malls, products like baby diapers and beer are sometimes placed close to each other based on ML-driven customer behavior studies. Machine learning analyzes shopping patterns to increase sales through strategic product placement.

---

### 2. Banking & Finance

Promotion plans , where we open the banks etc.

Let's suppose you want to take loan from bank. So the ML algorithm compare your profile with the previous defaulters profile.  If your accuracy comes higher, then they do not give you loan otherwise give it to you.

---


### 3. Transport. / Uber

Machine learning is used to determine dynamic pricing based on demand and supply.
- During peak hours (8 AM – 8 PM), prices are higher.
- During off-peak hours, prices are lower.

---
---
---
---

##  MLDLC

Machine Learning Devlopement Life Cycle is the set of guideline that we have to follow when we are working on any ML Base Project. There are 9 steps of Machine Learning


### 1. Framing the Problem

Firstly we have to analyze the problem. 

- Like what's the problem? 
- How I solve it. 
- How many peoples are needed for that.
- How many time needed for that
- May I used Supervized Learning or UnSupervized Learning.
- How much data I have. and also many more

---

### 2. Gathering the Data

Following are some resources where from we gather the data.

- From API 
- CSV Files 
- Web Scraping 
- From Clusters  ( Usually used for big Data )

>  DataBase (We cannot access the data directly from database becuase error for this we use DV [Data Wear House] ) and also we use ETL (Extract Transform Load.) 

---

### 3. Data Prepoccessing

In simple words Data Preprocessing means we clean the data like there are many errors in our data so firsly we have to clean the data.

These errors include
- Missing Values in our Data
- Duplicates Values in our Data
- Outliers (Like our data are coming from various resources it also cause effects)
- Scale Values (We have to scale all the values equally like 1 cr or decimal form etc.). Its also called Standarization.

---

### 4. EDA (Exploratory Data Analysis)  

So from the word Data Analysis its clear that like we have to analyze the input and output relationship.

Like in EDA we have to make so many experiments to know what are in the data like we discover the hidden patterns , relationships and many more.

Here we do these things:

- `Visulization` ( By Plotting Graphs ) 
- `UniVariant` ( Like we analysis independly on every columns like what is the mean , mode and what is the curve.) 
- `ByVariant` ( In this we analyze two columns at the same time to get the data )
- `MultiVariant` ( In this we analyze the multiple columns at the same time to get the data. ) 

So in the whole step we find the core concepts from the data for futher use.

---

### 5. Feature Engineering + Selection

Inputs are called features so Features are very important because our outputs are depends on the inputs. The main is that we create some new columns by our own.

> `For example:` We have the data of house and we want to sale the house and we have 3 columns
> - No of washrooms
> - No of Bedrooms
> - location
> 
> So as we want to sell our house we need only square foots area so we make a new column name `Area` and there we store square feet of the house and remove other columns.

`Feature Selection:`Sometimes, we have so many features upto 100 200. Here, we do not move ahead with these 100 , 200 features. Becuase all these features are never helpful in generating our output. So we have to find those features that do not impact our input and remove them.

And the second reason, these 100 200 features take a lot of time. So we need to remove them.

---

### 6. Model Training , Evaluation and Selection.

So once you are sure about your data like you gather the data , Data Preprocssing and also you do feature engineering and selection on your data.

Then you are almost ready to train your data. Then you gather differents algorithms and  you give the data to these algorithms and train the algorithms on your data.

Here, we check the results of different algorithms and then we decide which algorithm is best for our data.

---

### 7 Evaluation

We evaluate all the models like this,

- Model Selection: 
we get 3 or 4 algorithms then we tune their parameters

> What is Parameter?
>
>In simple words parameters are called settings. Like we tune our tv channels according to our need like films first , then news channels etc.
---

### 8 Model Deployement

So now your model is ready to predict . But our work is not over yet we have to deploy it. It can be a desktop app, web app or may be mobile app.

So from this model, we make a file called binary file, it's like a text file. We use different tools to convert that. Then we convert this file into an API.

---

### 9. Testing

We test our model with some trusted customers. If our model works ok we show the changings to all the customer but if it not then we change in the model.

Error may be in data preproccesing , Feature Selection and also many more.

---


### 10. Optimize

Here, we launch our model for all the customers. After that we perfrom some important steps like:
- Data Backup
- Model Backup
- If our model not works properly what we do we do all these are covered in that.

---
---
---
---
## Tensors
---
> ### 1. Why we start Tensosrs when we start practical implementation of ML?
>
>We have other libraries like numpy, pandans and any other library but why we start with tensors.
>
>Tensor is basically a data strucutre. The reason is every machine learning system or leading libraries like sickit learn , tensor flow use tensors more frequently.Tensors is the basic data structure used by all these libraies. They are not only used in ML but also in DL. So tensors are important in both. You can imagine their importantance by the fact that the no.1 ML or DL Library is named Tensor Flow.
>
> Simply, tensors are nothing but the data strucutue that store numerical values. They work as a container that store numerical values mostly. It also store string and other data types but its very very rare like 99.9% we use numercal values.

---

> ### 2. What is tensor?
> If you have ever study about vectors and matrices, than actually you used tensors.
>
>- When its `0D` we called `scalar` number like single number . e.g 1 ,2 ,3
>- When its `1D` we called them `vectors` or lists like arr = [1 ,2 , 4] 
>- When its `2D` we called them `matrix` like [[1 , 2] , [2 ,4]]
>
> So whats about 3d vectors and 4d , 5d we don't have their individual names so the scientists discover the term tensors that follow all the rules.


---

> ### 3. What are 0D Tensors / Scalars.
>
> If we ever store only a single number then we called 0D tensors or Scalars 1 , 2 these are scalars we also called them 0D Tensors
>
> Note: 0D Tensors means there are no dimensions like 0 Dimensions.	 

---

> ### 4. What are 1D Tensors . Vector?
>
> If we have a list of numbers like this [1 , 2 , 4]. We called them 1D Tensors , 1D Array , Array and Vectors.
> 
> What are the `dimensions` of vector? Its 3 becuase dimensios of vectors depends on the number of elements in the array.


---



> ### 5. What are Axis?
> 
> Axis are basically like x axis , y axis , z axis
> 
> Number of Axis == dimensions in the Tensors. Number of axis are also called `rank and dimensions.`
> 
> Note:  1D Tensors are basically collection of scalars  ,  2D Tensors are basically collection of Vectors ,  3D Tensors are basically collection of Matrixes

---

> ### 6. What are 2d Tensors?
> 
> 2D Tensors are nothig but the collection of vectors like this
>  
>  [ [1 , 2 , 3]    ,     [4 ,  5 , 6 ]  ,  [7 ,8,9]    ]
> 
> Rank = 2 = ndim


---


> ### 7. Important points
> We mostly used 0D to 5D Tensors 
>
> ```No of axis = Dimensions of tensors = No of ranks.```
> 
> These 3 are same almost. Rank , Axis  and  Space:
> 
> `Shape of Matrix:`
> Lets suppose we have a matrix of 3 * 3 it means we have 3 rows and 3 column. So the shape is (3 , 3).  2 * 3 -> shape is (2 , 3)
> 
> `Size of Matrix` Multiple all elements of shape (3 , 3) = 9


---

### 8. Code example

``` python
import numpy as np

# OD Tensors / Scalar
a = np.array(12)
a
a.ndim

# 1D Tensors / Vector
arr = np.array([1 , 2 ,3 ,4])
arr
arr.ndim

# 2D Tensors / Matrixes
arr = np.array([[1 , 2 ,3] , [4 , 5 ,6] , [7  ,8 ,9]])
arr
array([[1, 2, 3],
       [4, 5, 6],
       [7, 8, 9]])

```


---


## Overview of Datasets

``` python

import pandas as pd
data = pd.read_csv("indian_food.csv")
data

# kaggle dataset
# !mkdir -p ~/.kaggle
# !cp kaggle.json ~/.kaggle/

import zipfile
zip_ref = zipfile.ZipFile('face-mask-detection-dataset.zip', 'r')
zip_ref.extractall('/content')
zip_ref.close()
     
```


## Project 1

``` python
import numpy as np
import pandas as pd

df = pd.read_csv("placement_dataset.csv")
df.tail()
df.shape
df.info()
df = df.iloc[: , 1:]
df.head()

import matplotlib.pyplot as plt
plt.scatter(df["cgpa"] , df["iq"] , c=df["placement"])

X = df.iloc[: , 0 : 2]
Y = df.iloc[: , -1]

X
Y


from sklearn.model_selection import train_test_split
X_train , X_test , Y_train , Y_test = train_test_split(X , Y , test_size = 0.1)

X_train
X_test
Y_train
Y_test

from sklearn.preprocessing import StandardScaler
scalar = StandardScaler()
X_train = scalar.fit_transform(X_train)
X_train

X_test = scalar.transform(X_test)
X_test


from sklearn.linear_model import LogisticRegression
clf = LogisticRegression()

# Model Training
clf.fit(X_train , Y_train)

y_pred = clf.predict(X_test)
Y_test

from sklearn.metrics import accuracy_score
accuracy_score(Y_test , y_pred)


# !pip install mlxtend

from mlxtend.plotting import plot_decision_regions
plot_decision_regions(X_train, Y_train.values, clf=clf, legend=2)

import pickle
pickle.dump(clf , open('model.pkl' , 'wb'))

```

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



## Pandas

## 1. Operations Guide

#### i. DataFrame Creation and Inspection
- `read_csv(filepath):` Reads a CSV file into a DataFrame.
- `head():` Returns the first n rows of the DataFrame.
- `tail(5):` Returns the last n rows of the DataFrame.
- `shape:` Returns a tuple representing the dimensionality of the DataFrame.
- `info():` Provides a concise summary of the DataFrame.
- `describe():` Generates descriptive statistics for numerical columns.

#### ii. Data Selection and Filtering
- `Fetching rows and columns from data:` Select specific rows and columns using labels or indices.
- `iloc:` Integer-location based indexing.
- `Masking:` Filters the DataFrame.
- `value_counts():` Returns a Series containing counts of unique values.

#### iii. Data Visualization
- `plot():` Plots data from the DataFrame using matplotlib.

#### iv. Data Manipulation
- `sort_values(by, ascending=True):` Sorts the DataFrame by specified column(s).
- `drop_duplicates(subset=None, keep='first'):` Removes duplicate rows from the DataFrame.
- `groupby(by):` Groups DataFrame using a mapper or by a Series of columns.
- `isin(values):` Filters DataFrame where values in a column are in the provided list.

#### 2. Code Example

``` python

import pandas as pd
import seaborn as sns
import numpy as np
import matplotlib.pyplot as plt

df = sns.load_dataset("titanic")
df

df.head(10)
df.tail(20)
df.shape
df.info()
df.describe()

# For Loading DataSets from Seaborn

# df = sns.get_dataset_names()
# df
# df['sex']
type(df['sex'])


row = df.iloc[0:10, 2:]
row


col = df[["age" , "sex"]]
col


# For Specific Rows and Columns
specific_row = df.iloc[2]
specific_col = df.iloc[2 , 3]


# Filter Like Conditions
filter_row = df[df['age'] > 30]
filter_row

```

### 3. Homelessness Dataset

``` python

import pandas as pd
import numpy as np
homelessness = pd.read_csv('homelessness.csv' , index_col = 0)
homelessness

print(homelessness.values[0:5])
print("___" * 50)
print(homelessness.columns)
print("___" * 50)
print(homelessness.index)
print("___" * 50)


homelessness.shape

homelessness.dtypes
homelessness.describe()
homelessness.info()

homelessness_ind = homelessness.sort_values('individuals')
homelessness_ind.head()

homelessness_index = homelessness.sort_values("individuals" , ascending=False)
homelessness_index.head(10)

two = homelessness.sort_values(["individuals" , "family_members"])
two.head(20)

sorting =  homelessness.sort_values(["region" , "family_members"] , ascending=[True , False])
sorting

subseting = homelessness[["individuals" , "region"]]
subseting.head()

ind_get_10k = homelessness["individuals"]  > 10000
ind_get_10k.head()

ind_get_10k = homelessness[homelessness["individuals"] > 10000]
ind_get_10k.reset_index()

```

### 4. Sales Dataset

``` python

import pandas as pd
df = pd.read_csv("sales_subset.csv" , index_col = 0)
df.head()

df.describe()
df["type"].unique()


df["type"].value_counts()

total_sum = df["weekly_sales"].unique().sum()
total_sum

sales_A = df[df["type"] == "A"]["weekly_sales"].sum()
(sales_A / total_sum) * 100

sales_B = df[df["type"] == "B"]["weekly_sales"].sum()
(sales_B / total_sum) * 100

group_sales = df.groupby("type")["weekly_sales"].sum()
(group_sales / total_sum) * 100

```


### 5. Temperature Dataset

``` python

import pandas as pd
df = pd.read_csv("temperatures.csv" , index_col=0)
df

df.describe()

df.info()

avg_temp = df[df["country"] == "Pakistan"]
avg_temp

temp_id = df.set_index(["country" , "city"])
temp_id

rows_to_keep = [('Brazil' , 'Rio de Janerio') , ('Pakistan' , 'Lahore')]
rows_to_keep

```


## Working with CSV files

``` python

import pandas as pd
df = pd.read_csv("CSV.csv")
df.head()


#Index Col Parameter
data = pd.read_csv("CSV.csv" , index_col = "Country Name")
data.head()

# Header Parameter
header = pd.read_csv("CSV.csv" , header = 1)
header

# use_col parameter
df = pd.read_csv("CSV.csv" , usecols=["Country Name" , "Country Code"])
print(df)

# Skip rows
skip_row = pd.read_csv("CSV.csv" , skiprows = [0 , 1])
skip_row

# Remove nrows
nrows = pd.read_csv("CSV.csv" , nrows = 100)
nrows

# Dtype Parameters
dtype = pd.read_csv("CSV.csv" , dtype = {1961 : int})
dtype

# Handling Dates
pd.read_csv("CSV.csv"  , parse_dates=["data"])

# NAN Values
pd.read_csv("CSV.csv" , na_values= ["ABW"])

# Loading DataSets in Chunks
dfs = pd.read_csv("CSV.csv", chunksize=100)
dfs

```


## Diabetes Project

``` python

import pandas as pd
df = pd.read_csv("Diabetes.csv")
df

import matplotlib.pyplot as plt
plt.scatter(df['Pregnancies'] , df['BloodPressure'] , c=df['Outcome'])

X = df.iloc[:, :-1]
Y = df.iloc[:,-1]
Y
X

from sklearn.model_selection import train_test_split
X_train , X_test , Y_train , Y_test = train_test_split(X , Y , test_size = 0.1)
X_train

X_test
Y_train

Y_test

from sklearn.preprocessing import StandardScaler
scalar = StandardScaler()
X_train = scalar.fit_transform(X_train)
X_train

X_test = scalar.transform(X_test)
X_test

from sklearn.linear_model import LogisticRegression
clf = LogisticRegression()
clf.fit(X_train , Y_train)

y_pred = clf.predict(X_test)
Y_test

from sklearn.metrics import accuracy_score
accuracy_score(Y_test , y_pred)


from mlxtend.plotting import plot_decision_regions

```




## Debugging

``` bash
!ls /content/drive/MyDrive/Datasets
```