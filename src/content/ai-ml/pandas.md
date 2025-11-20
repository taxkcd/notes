---
title: Pandas
date: 2025-11-12
author: Taimour
---



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
