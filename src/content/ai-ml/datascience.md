---
title: Data Science Roadmap
date: 2025-01-15
author: Taimour
---

## Introduction

This comprehensive roadmap consolidates four workshops covering the complete data science journey from foundations to advanced preprocessing. Follow this guide step-by-step to master essential data science skills.

---

## Workshop 1: Foundations & Libraries

### Environment Setup

> #### 1. What is Environment Management?
>
> Environment management allows you to create isolated Python environments for different projects, ensuring that dependencies don't conflict with each other.

---

#### Conda Environment Management

**Listing Existing Environments:**
```bash
conda env list
```

**Creating a New Conda Environment:**
```bash
# Create a new environment with a specific name
conda create --name workshop_no_1

# Activate the newly created environment
conda activate workshop_no_1

# Install a specific Python version
conda install python=3.11

# Install IPython kernel (for Jupyter notebook support)
conda install ipykernel
```

**Python Virtual Environment Alternative (venv):**
```bash
# Create a virtual environment
python -m venv workshop_no_1

# Activate the environment
# On Windows
workshop_no_1\Scripts\activate

# On macOS/Linux
source workshop_no_1/bin/activate

# Deactivate the environment
deactivate
```

**Key Differences Between Conda and venv:**
- **Conda**: 
  - Manages packages and environments
  - Works across multiple programming languages
  - More robust package management
  - Easier to handle complex dependencies

- **venv**:
  - Python-specific virtual environment
  - Lighter weight
  - Part of Python standard library
  - Simpler to use for pure Python projects

**Best Practices:**
1. Always create a new environment for each project
2. Specify Python version when creating environments
3. Use `requirements.txt` or `environment.yml` to replicate environments
4. Deactivate environments when not in use

---

### Pandas

> #### 1. What is Pandas?
>
> Pandas is a powerful open-source data manipulation and analysis library in Python. It provides data structures like `DataFrame` and `Series`, which are used for handling and analyzing data in tabular form (rows and columns). Pandas makes it easy to clean, transform, and analyze large datasets efficiently.

**Why Use Pandas?**
- **Data Handling**: It simplifies data import, export, and manipulation.
- **Efficient**: Optimized for performance with large datasets.
- **Powerful Data Structures**: `DataFrame` and `Series` allow for structured data analysis.
- **Integration**: Works seamlessly with other libraries like NumPy, Matplotlib, and Scikit-learn.

---

#### Basic Pandas Operations

**Importing Libraries:**
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings("ignore")
sns.set(style="whitegrid")
```

**Creating a DataFrame:**
```python
data = {
    'Age': [23, 45, 56, 23, 34],
    'Salary': [50000, 80000, 120000, 50000, 60000],
    'City': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'Gender': ['Male', 'Female', 'Female', 'Male', 'Female'],
    'Department': ['HR', 'Engineering', 'Finance', 'HR', 'Engineering']
}

df = pd.DataFrame(data)
```

**Reading Data from CSV:**
```python
df = pd.read_csv('data.csv')
```

**Common DataFrame Operations:**

- `df.head()` - Displays the first 5 rows of a DataFrame
- `df.tail()` - Displays the last 5 rows of a DataFrame
- `df.info()` - Provides a summary of the DataFrame, including data types and non-null values
- `df.describe()` - Generates summary statistics for numerical columns
- `df.shape` - Returns the number of rows and columns in the DataFrame
- `df.columns` - Lists the column names of the DataFrame

**Handling Missing Values:**
```python
# Check for missing values
df.isnull().sum()

# Remove rows with missing values
df.dropna()

# Fill missing values
df['Age'].fillna(df['Age'].mean(), inplace=True)  # Replace with mean
df['Age'].fillna(df['Age'].median(), inplace=True)  # Or use median
```

**Data Manipulation:**
```python
# Rename columns
df = df.rename(columns={'Age': 'Employee Age', 'Salary': 'Annual Salary'})

# Sort values
df.sort_values('Age', ascending=False)

# Group by
grouped = df.groupby('Gender')['Salary'].mean()

# Merge DataFrames
merged_df = df1.merge(df2, how='inner', on='ID')

# Concatenate DataFrames
df3 = pd.concat([df1, df2], axis=1)

# Save to CSV
df.to_csv('output.csv')
```

---

### NumPy

> #### 1. What is NumPy?
>
> NumPy (Numerical Python) is a powerful open-source library in Python for numerical computing. It provides support for large, multi-dimensional arrays and matrices, along with a collection of mathematical functions to perform operations on these arrays.

**Why Use NumPy?**
- **Efficiency**: NumPy arrays are faster and more memory-efficient than regular Python lists
- **Multi-dimensional Arrays**: Supports n-dimensional arrays, making it ideal for mathematical computations
- **Mathematical Operations**: Provides a large collection of high-level mathematical functions
- **Integration**: Works well with other libraries like Pandas, Matplotlib, and Scikit-learn

---

#### Basic NumPy Operations

**Creating Arrays:**
```python
import numpy as np

# Create array from list
data = np.array([10, 20, 30, 40, 50])

# Create array of zeros
zeros = np.zeros(5)

# Create array of ones
ones = np.ones(4)

# Create array with range
range_arr = np.arange(8)
```

**Statistical Operations:**
```python
# Mean
mean_value = np.mean(data)

# Median
median_value = np.median(data)

# Standard deviation
std_dev = np.std(data)

# Min and Max
min_value = np.min(data)
max_value = np.max(data)

# Sum
total_sum = np.sum(data)

# Unique values
unique_values = np.unique(data)
```

**Random Number Generation:**
```python
# Generate random numbers between 0 and 1
random_data = np.random.rand(10)

# Generate random integers
random_ints = np.random.randint(50, 101, size=(6,))
```

---

### Matplotlib & Seaborn

> #### 1. What is Chart Plotting?
>
> Chart plotting is the process of visualizing data through graphical representations like bar charts, line graphs, scatter plots, histograms, and more. It simplifies data analysis and communication by making complex data easier to understand.

**Why is Chart Plotting Important?**
1. **Simplifies Complex Data**: Turns overwhelming raw data into easy-to-understand visuals
2. **Identifies Patterns and Trends**: Helps in spotting trends or correlations
3. **Improves Data Communication**: Makes it easier to present data to non-experts
4. **Aids in Decision Making**: Supports decision-making by providing clear insights
5. **Highlights Outliers and Anomalies**: Detects outliers, improving data quality
6. **Improves Data Exploration**: Enhances exploratory data analysis (EDA)

---

#### Types of Charts

**1. Univariate Charts** - Analyze a single variable
- **Bar Chart**: Shows the frequency of categories in a categorical variable
- **Histogram**: Displays the distribution of a numerical variable
- **Pie Chart**: Represents the proportion of categories
- **Box Plot**: Shows variability, central tendency, and outliers

**2. Bivariate Charts** - Analyze the relationship between two variables
- **Scatter Plot**: Shows the relationship between two continuous variables
- **Line Chart**: Plots how one variable changes with another (e.g., over time)
- **Stacked Bar Chart**: Compares categories and subcategories
- **Heatmap**: Uses colors to represent the strength of relationships

**3. Trivariate Charts** - Analyze relationships between three variables
- **3D Scatter Plot**: Visualizes the relationship between three continuous variables
- **Bubble Chart**: Extends a scatter plot, with bubble size representing a third variable

---

#### Visualization Examples

**Bar Chart:**
```python
import matplotlib.pyplot as plt

categories = ['A', 'B', 'C']
values = [10, 20, 15]

plt.bar(categories, values)
plt.show()
```

**Line Plot:**
```python
time = [1, 2, 3, 4, 5]
value = [3, 7, 2, 5, 8]

plt.plot(time, value)
plt.show()
```

**Histogram:**
```python
import seaborn as sns

data = sns.load_dataset('tips')
sns.histplot(data['total_bill'], kde=True)
plt.show()
```

**Scatter Plot:**
```python
sns.scatterplot(x='total_bill', y='tip', data=data)
plt.show()
```

**Box Plot:**
```python
sns.boxplot(x='day', y='total_bill', data=data)
plt.show()
```

**Pair Plot:**
```python
data = sns.load_dataset('iris')
sns.pairplot(data)
plt.show()
```

---

## Workshop 2: Exploratory Data Analysis (EDA)

> #### 1. What is Exploratory Data Analysis?
>
> Exploratory Data Analysis (EDA) is the process of analyzing datasets to summarize their main characteristics, often with visual methods. EDA helps you understand your data, discover patterns, identify anomalies, and form hypotheses.

---

### EDA Workflow

**1. Data Loading and Initial Inspection:**
```python
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('student_performance.csv')

# Initial inspection
df.head()
df.tail()
df.shape
df.info()
df.describe()
```

**2. Check for Missing Values:**
```python
df.isnull().sum()
```

**3. Understanding Data Types:**
```python
df.dtypes
df.columns
```

---

### Univariate Analysis

**Categorical Data Analysis:**

**Count Plot:**
```python
sns.countplot(x='Gender', data=df)
plt.title("Gender Distribution")
plt.show()
```

**Pie Chart:**
```python
df['Gender'].value_counts().plot(kind='pie', autopct='%1.1f%%', startangle=90)
plt.title("Gender Distribution")
plt.show()
```

**Numerical Data Analysis:**

**Histogram:**
```python
sns.histplot(df['Exam_Score'])
plt.show()
```

**Distribution Plot:**
```python
sns.distplot(df['Sleep_Hours'])
plt.show()
```

**Box Plot:**
```python
sns.boxplot(df['Hours_Studied'])
plt.show()
```

---

### Bivariate and Multivariate Analysis

**Scatter Plot:**
```python
sns.scatterplot(x='Hours_Studied', y='Exam_Score', hue='Gender', data=df)
plt.show()
```

**Box Plot (Categorical vs Numerical):**
```python
sns.boxplot(x='Internet_Access', y='Exam_Score', data=df)
plt.show()
```

**Bar Plot with Pivot Table:**
```python
pivot_data = df.pivot_table(
    index='Parental_Involvement', 
    columns='Gender', 
    values='Exam_Score', 
    aggfunc='mean'
)
pivot_data.plot(kind='bar', stacked=True, figsize=(10, 6))
plt.show()
```

**Pair Plot:**
```python
sns.pairplot(df)
plt.show()
```

---

### Statistical Summaries

**Value Counts:**
```python
df['Category'].value_counts()
```

**Group By Operations:**
```python
df.groupby('Category')['Numerical_Column'].mean()
df.groupby('Category')['Numerical_Column'].describe()
```

**Correlation Analysis:**
```python
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, annot=True)
plt.show()
```

---

## Workshop 3: Advanced Data Analysis

> #### 1. What is Advanced Data Analysis?
>
> Advanced data analysis involves deeper exploration of datasets, applying sophisticated techniques to extract meaningful insights, identify complex patterns, and prepare data for machine learning models.

---

### Advanced EDA Techniques

**1. Comprehensive Data Profiling:**
```python
# Using Sweetviz for automated EDA
import sweetviz as sv

report = sv.analyze(df)
report.show_html('report.html')
```

**2. Advanced Visualizations:**
```python
# Custom styling for better visualizations
rc = {
    "axes.facecolor": "#f7f9fc",
    "figure.facecolor": "#f7f9fc",
    "axes.edgecolor": "#000000",
    "grid.color": "#EBEBE7",
    "font.family": "serif",
    "axes.labelcolor": "#000000",
    "xtick.color": "#000000",
    "ytick.color": "#000000",
    "grid.alpha": 0.4
}

sns.set(rc=rc)
```

**3. Feature Engineering Insights:**
- Identify relationships between features
- Discover interaction effects
- Understand feature distributions
- Detect multicollinearity

**4. Pattern Discovery:**
- Time series patterns
- Seasonal trends
- Clustering patterns
- Anomaly detection

---

### Project Example: Insurance Dataset Analysis

**Dataset Overview:**
- **Goal**: Analyze insurance premium factors
- **Features**: Age, Annual Income, Marital Status, Education Level, Health Score, etc.
- **Target**: Premium Amount

**Analysis Steps:**
1. Load and inspect data
2. Handle missing values
3. Explore feature distributions
4. Analyze relationships between features and target
5. Create visualizations
6. Extract insights

---

## Workshop 4: Data Preprocessing

> #### 1. What is Data Preprocessing?
>
> Data preprocessing is the process of cleaning and transforming raw data into a format that is suitable for machine learning algorithms. It includes handling missing values, outliers, scaling, and encoding categorical variables.

---

### Missing Values Handling

> #### 1. What are Missing Values?
>
> Missing values are data points that are absent in the dataset. They can occur due to various reasons like data collection errors, incomplete surveys, or system failures.

**Types of Missing Data:**
- **MCAR (Missing Completely At Random)**: Missingness is independent of both observed and unobserved data
- **MAR (Missing At Random)**: Missingness depends only on observed data
- **MNAR (Missing Not At Random)**: Missingness depends on unobserved data

**Methods to Handle Missing Values:**

**1. Deletion:**
```python
# Remove rows with missing values
df.dropna()

# Remove columns with missing values
df.dropna(axis=1)
```

**2. Simple Imputation:**
```python
# Fill with mean
df['Age'].fillna(df['Age'].mean(), inplace=True)

# Fill with median
df['Age'].fillna(df['Age'].median(), inplace=True)

# Fill with mode
df['Category'].fillna(df['Category'].mode()[0], inplace=True)
```

**3. Advanced Imputation (Using Machine Learning):**
```python
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error

def impute_categorical_missing_data(passed_col):
    df_null = df[df[passed_col].isnull()]
    df_not_null = df[df[passed_col].notnull()]

    X = df_not_null.drop(passed_col, axis=1)
    y = df_not_null[passed_col]
    
    label_encoder = LabelEncoder()
    for col in X.columns:
        if X[col].dtype == 'object' or X[col].dtype == 'category':
            X[col] = label_encoder.fit_transform(X[col])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    rf_classifier = RandomForestClassifier()
    rf_classifier.fit(X_train, y_train)
    y_pred = rf_classifier.predict(X_test)
    
    acc_score = accuracy_score(y_test, y_pred)
    print(f"The feature '{passed_col}' has been imputed with {round((acc_score * 100), 2)}% accuracy\n")
    
    # Impute missing values
    X_null = df_null.drop(passed_col, axis=1)
    for col in X_null.columns:
        if X_null[col].dtype == 'object' or X_null[col].dtype == 'category':
            X_null[col] = label_encoder.fit_transform(X_null[col])
    
    if len(df_null) > 0:
        df_null[passed_col] = rf_classifier.predict(X_null)
    
    df_combined = pd.concat([df_not_null, df_null])
    return df_combined[passed_col]

def impute_continuous_missing_data(passed_col):
    df_null = df[df[passed_col].isnull()]
    df_not_null = df[df[passed_col].notnull()]

    X = df_not_null.drop(passed_col, axis=1)
    y = df_not_null[passed_col]
    
    label_encoder = LabelEncoder()
    for col in X.columns:
        if X[col].dtype == 'object' or X[col].dtype == 'category':
            X[col] = label_encoder.fit_transform(X[col])
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    rf_regressor = RandomForestRegressor()
    rf_regressor.fit(X_train, y_train)
    y_pred = rf_regressor.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    print(f"MAE = {mae}\n")
    
    # Impute missing values
    X_null = df_null.drop(passed_col, axis=1)
    for col in X_null.columns:
        if X_null[col].dtype == 'object' or X_null[col].dtype == 'category':
            X_null[col] = label_encoder.fit_transform(X_null[col])
    
    if len(df_null) > 0:
        df_null[passed_col] = rf_regressor.predict(X_null)
    
    df_combined = pd.concat([df_not_null, df_null])
    return df_combined[passed_col]
```

---

### Outlier Detection and Treatment

> #### 1. What are Outliers?
>
> Outliers are values that are much higher or lower than most of the other values in a dataset. They are different from the rest of the data and can be considered unusual.

**Effect of Outliers in Machine Learning:**
- **Negative Effects**:
  - Skew the results of statistical analyses
  - Affect the performance of machine learning models
  - Lead to incorrect conclusions or predictions
- **Positive Effects**:
  - Can provide valuable insights (e.g., fraud detection, rare events)

---

#### Outlier Detection Methods

| **Technique** | **Description** |
|---------------|-----------------|
| **Box Plot** | Visualizes the distribution of data and identifies outliers using IQR |
| **Z-Score** | Measures how many standard deviations a data point is from the mean |
| **IQR Method** | Uses the Interquartile Range (IQR) to identify outliers |
| **Scatter Plot** | Visualizes outliers in bivariate data |
| **Histogram** | Shows the distribution of data and highlights extreme values |

**IQR Method:**
```python
Q1 = df['column'].quantile(0.25)
Q3 = df['column'].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df['column'] < lower_bound) | (df['column'] > upper_bound)]
```

**Z-Score Method:**
```python
from scipy import stats

z_scores = np.abs(stats.zscore(df['column']))
outliers = df[z_scores > 3]
```

---

#### Outlier Treatment Methods

| **Technique** | **Description** | **When to Use** |
|---------------|-----------------|-----------------|
| **Trimming** | Removes outliers from the dataset | When outliers are errors or irrelevant |
| **Capping** | Replaces outliers with a specified upper or lower limit | When outliers are valid but extreme |
| **Transformation** | Applies mathematical transformations (e.g., log, square root) | When data is highly skewed |
| **Imputation** | Replaces outliers with mean, median, or mode | When outliers are errors but data is valuable |
| **Winsorization** | Replaces outliers with nearest non-outlier values | To preserve data while reducing impact |

**Trimming Example:**
```python
# Remove outliers using IQR method
Q1 = df['column'].quantile(0.25)
Q3 = df['column'].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

df_trimmed = df[(df['column'] >= lower_bound) & (df['column'] <= upper_bound)]
```

**Capping Example:**
```python
# Cap outliers at 1st and 99th percentiles
lower_limit = df['column'].quantile(0.01)
upper_limit = df['column'].quantile(0.99)

df['column'] = df['column'].clip(lower=lower_limit, upper=upper_limit)
```

**Transformation Example:**
```python
# Log transformation
df['column'] = np.log1p(df['column'])

# Square root transformation
df['column'] = np.sqrt(df['column'])
```

---

### Scaling and Standardization

> #### 1. What is Scaling?
>
> Scaling transforms features so that their values fall within a specific range, typically [0, 1] or [-1, 1]. This method adjusts the scale of data without altering its distribution.

**Min-Max Scaling Formula:**
```
X_scaled = (X - X_min) / (X_max - X_min)
```

**When to Use Scaling?**
- When features have different units or scales
- When using distance-based algorithms (KNN, SVM, K-Means)

---

> #### 2. What is Standardization?
>
> Standardization transforms data to have a mean of 0 and a standard deviation of 1. It normalizes the distribution of features and reduces the influence of outliers.

**Standardization Formula:**
```
X_standardized = (X - μ) / σ
```
where:
- μ is the mean of the feature
- σ is the standard deviation of the feature

**When to Use Standardization?**
- When features have different distributions
- When using algorithms that assume normally distributed data (Logistic Regression, PCA, Linear Regression)

---

#### Key Differences

| **Aspect** | **Scaling (Min-Max)** | **Standardization** |
|------------|------------------------|----------------------|
| **Definition** | Transforms data to a fixed range | Centers data to have mean = 0 and std = 1 |
| **Formula** | (X - X_min) / (X_max - X_min) | (X - μ) / σ |
| **Range of Values** | Typically [0, 1] or [-1, 1] | Unbounded |
| **Sensitivity to Outliers** | Sensitive to outliers | Less sensitive to outliers |
| **Use Case** | Distance-based algorithms | Algorithms assuming normal distribution |

---

#### Implementation

**Min-Max Scaling:**
```python
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df[['feature1', 'feature2']])
scaled_df = pd.DataFrame(scaled_data, columns=['feature1', 'feature2'])
```

**Standardization:**
```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
standardized_data = scaler.fit_transform(df[['feature1', 'feature2']])
standardized_df = pd.DataFrame(standardized_data, columns=['feature1', 'feature2'])
```

**Visualization Comparison:**
```python
import matplotlib.pyplot as plt
import seaborn as sns

# Before Scaling
plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
sns.histplot(df[['feature1', 'feature2']], kde=True)
plt.title('Before Scaling')

# After Scaling
plt.subplot(1, 2, 2)
sns.histplot(scaled_df, kde=True)
plt.title('After Scaling')
plt.tight_layout()
plt.show()
```

---

### Encoding Categorical Variables

> #### 1. What is Encoding?
>
> Encoding is the process of converting categorical data (text or labels) into numerical format so that machine learning algorithms can process it. Most algorithms work with numerical data, so encoding is a crucial step in data preprocessing.

**Why Encoding?**
- Machine learning algorithms cannot process categorical data directly
- Encoding transforms categorical data into a format that algorithms can understand
- It helps in preserving the relationship between categories or creating binary columns

---

#### Types of Encoding

| **Encoding Type** | **Description** | **When to Use** |
|-------------------|-----------------|-----------------|
| **Label Encoding** | Converts each category into a unique integer | When categories have an ordinal relationship |
| **One-Hot Encoding** | Creates binary columns for each category | When categories are nominal (no ordinal relationship) |
| **Ordinal Encoding** | Converts categories into integers based on their order | When categories have a clear order |
| **Frequency Encoding** | Replaces categories with their frequency in the dataset | When the frequency of categories is meaningful |
| **Target Encoding** | Replaces categories with the mean of the target variable | When the target variable is correlated with categories |

---

#### Implementation Examples

**Label Encoding:**
```python
from sklearn.preprocessing import LabelEncoder

encoder = LabelEncoder()
df['category_encoded'] = encoder.fit_transform(df['category'])

# Example: "High School" → 0, "Bachelor's" → 1, "Master's" → 2
```

**One-Hot Encoding:**
```python
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(sparse_output=False)
encoded_data = encoder.fit_transform(df[['category']])
encoded_df = pd.DataFrame(encoded_data, columns=encoder.get_feature_names_out(['category']))

df = pd.concat([df, encoded_df], axis=1)
```

**Ordinal Encoding:**
```python
from sklearn.preprocessing import OrdinalEncoder

categories = [['Small', 'Medium', 'Large']]  # Define order
encoder = OrdinalEncoder(categories=categories)
df['size_encoded'] = encoder.fit_transform(df[['size']])
```

**Frequency Encoding:**
```python
frequency_map = df['category'].value_counts().to_dict()
df['category_frequency'] = df['category'].map(frequency_map)
```

**Target Encoding:**
```python
target_mean = df.groupby('category')['target'].mean()
df['category_target_encoded'] = df['category'].map(target_mean)
```

---

### Complete Preprocessing Pipeline

**Step-by-Step Preprocessing Workflow:**

```python
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.impute import SimpleImputer

def preprocess_data(df):
    """
    Complete preprocessing pipeline
    """
    df_processed = df.copy()
    
    # 1. Handle Missing Values
    # For numerical columns
    numerical_cols = df_processed.select_dtypes(include=[np.number]).columns
    imputer_num = SimpleImputer(strategy='median')
    df_processed[numerical_cols] = imputer_num.fit_transform(df_processed[numerical_cols])
    
    # For categorical columns
    categorical_cols = df_processed.select_dtypes(include=['object']).columns
    imputer_cat = SimpleImputer(strategy='most_frequent')
    df_processed[categorical_cols] = imputer_cat.fit_transform(df_processed[categorical_cols])
    
    # 2. Handle Outliers (using IQR method)
    for col in numerical_cols:
        Q1 = df_processed[col].quantile(0.25)
        Q3 = df_processed[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        df_processed[col] = df_processed[col].clip(lower=lower_bound, upper=upper_bound)
    
    # 3. Encode Categorical Variables
    le = LabelEncoder()
    for col in categorical_cols:
        df_processed[col] = le.fit_transform(df_processed[col])
    
    # 4. Scale Numerical Features
    scaler = StandardScaler()
    df_processed[numerical_cols] = scaler.fit_transform(df_processed[numerical_cols])
    
    return df_processed

# Apply preprocessing
df_processed = preprocess_data(df)
```

---

## Summary

This roadmap covers the complete data science journey:

1. **Workshop 1**: Foundation libraries (Pandas, NumPy, Matplotlib, Seaborn) and environment setup
2. **Workshop 2**: Exploratory Data Analysis (EDA) with univariate, bivariate, and multivariate analysis
3. **Workshop 3**: Advanced data analysis techniques and deeper insights extraction
4. **Workshop 4**: Data preprocessing including missing values, outliers, scaling/standardization, and encoding

**Key Takeaways:**
- Always start with proper environment setup
- Understand your data through EDA before preprocessing
- Handle missing values appropriately based on data type
- Detect and treat outliers carefully
- Scale or standardize features based on algorithm requirements
- Encode categorical variables using appropriate methods
- Follow a systematic preprocessing pipeline

**Next Steps:**
After completing this roadmap, you'll be ready to:
- Build machine learning models
- Perform feature engineering
- Evaluate model performance
- Deploy data science solutions

---

