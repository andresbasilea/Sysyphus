
# Pandas Basics in Python


## Data Structures in Pandas

### a) Series (1D Data)

A **Series** is like a column in a table (1D array with labels).

```python
data = pd.Series([10, 20, 30, 40], index=["a", "b", "c", "d"])
print(data)
```

🔹 **Accessing Elements**

```python
print(data["b"])  # Output: 20
```

### b) DataFrame (2D Data - Like a Table)

A **DataFrame** is a 2D table with rows and columns.

```python
data = {
    "Name": ["Alice", "Bob", "Charlie"],
    "Age": [25, 30, 35],
    "Salary": [50000, 60000, 70000]
}
df = pd.DataFrame(data)
print(df)
```

## Reading & Writing Data

🔹 **Read CSV File**

```python
df = pd.read_csv("data.csv")
```

🔹 **Write to CSV**

```python
df.to_csv("output.csv", index=False)
```

🔹 **Read Excel File**

```python
df = pd.read_excel("data.xlsx")
```

## Exploring Data

🔹 **View First & Last Rows**

```python
print(df.head())   # First 5 rows
print(df.tail(3))  # Last 3 rows
```

🔹 **Get Summary Statistics**

```python
print(df.info())   # Column data types & non-null values
print(df.describe())  # Summary statistics (mean, min, max, etc.)
```

🔹 **Check Missing Values**

```python
print(df.isnull().sum())  # Count missing values per column
```

## Selecting & Filtering Data

🔹 **Select a Column**

```python
print(df["Name"])  # Select 'Name' column
```

🔹 **Select Multiple Columns**

```python
print(df[["Name", "Salary"]])
```

🔹 **Select Rows by Index**

```python
print(df.iloc[1])    # Select second row (Index-based)
print(df.loc[1])     # Select row with label index 1
```

🔹 **Filter Data (Conditional Selection)**

```python
print(df[df["Age"] > 28])  # Select rows where Age > 28
```

## Modifying Data

🔹 **Add a New Column**

```python
df["Bonus"] = df["Salary"] * 0.1
```

🔹 **Update Values**

```python
df.loc[df["Name"] == "Alice", "Salary"] = 55000
```

🔹 **Drop a Column**

```python
df = df.drop(columns=["Bonus"])
```

## Grouping & Aggregation

🔹 **Group by a Column**

```python
print(df.groupby("Age")["Salary"].mean())
```

🔹 **Apply Multiple Aggregations**

```python
print(df.groupby("Age").agg({"Salary": ["mean", "sum"]}))
```

## Merging & Joining Data

🔹 **Merge DataFrames**

```python
df1 = pd.DataFrame({"ID": [1, 2, 3], "Name": ["Alice", "Bob", "Charlie"]})
df2 = pd.DataFrame({"ID": [1, 2, 3], "Salary": [50000, 60000, 70000]})

merged_df = pd.merge(df1, df2, on="ID")
```

🔹 **Concatenate DataFrames (Stacking)**

```python
df_concat = pd.concat([df1, df2], axis=0)  # Vertical stacking
```

## Handling Missing Data

🔹 **Fill Missing Values**

```python
df.fillna(0, inplace=True)
```

🔹 **Drop Missing Values**

```python
df.dropna(inplace=True)
```

## Sorting Data

🔹 **Sort by a Column**

```python
df = df.sort_values(by="Salary", ascending=False)
```
