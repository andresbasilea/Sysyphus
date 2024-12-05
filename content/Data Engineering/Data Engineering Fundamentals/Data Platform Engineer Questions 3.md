---
draft: true
---

### **SQL**

#### **1. What is the difference between OLAP and OLTP databases?**

**Answer**:

- **OLTP (Online Transaction Processing)**: Optimized for frequent, small-scale read/write operations, used in transactional systems like e-commerce.
- **OLAP (Online Analytical Processing)**: Designed for complex queries and large-scale analytics, often used in data warehouses.

#### **2. How would you implement data partitioning in SQL?**

**Answer**:

- Use `PARTITION BY` clause during table creation.
- For example, in PostgreSQL:
    
    sql
    
    Copiar código
    
    `CREATE TABLE sales_data (   id SERIAL PRIMARY KEY,   sale_date DATE,   amount NUMERIC ) PARTITION BY RANGE (sale_date);`
    
    Create partitions based on date ranges.

#### **3. How do you handle duplicate records in SQL?**

**Answer**:

- **Using `DISTINCT`**:
    
    sql
    
    Copiar código
    
    `SELECT DISTINCT column1, column2 FROM table;`
    
- **Using `ROW_NUMBER()`**:
    
    sql
    
    Copiar código
    
    `WITH ranked_rows AS (   SELECT column1, column2, ROW_NUMBER() OVER (PARTITION BY column1 ORDER BY column2) AS rn   FROM table ) DELETE FROM ranked_rows WHERE rn > 1;`
    

---

### **Python**

#### **4. What is the difference between `deepcopy` and `copy` in Python?**

**Answer**:

- `copy.copy()`: Creates a shallow copy; nested objects are still referenced.
- `copy.deepcopy()`: Creates a deep copy; nested objects are fully duplicated.

#### **5. How do you handle exception logging in a data pipeline?**

**Answer**:

- Use Python’s `logging` module:
    
    python
    
    Copiar código
    
    `import logging logging.basicConfig(level=logging.ERROR, filename="pipeline.log") try:     # Pipeline task     risky_function() except Exception as e:     logging.error("Error occurred", exc_info=True)`
    

#### **6. How do you work with large datasets in Python efficiently?**

**Answer**:

- Use **Dask** for parallel processing.
- Process files in chunks:
    
    python
    
    Copiar código
    
    `for chunk in pd.read_csv("large_file.csv", chunksize=10000):     process(chunk)`
    

---

### **Databricks**

#### **7. How do you optimize Delta Lake tables in Databricks?**

**Answer**:

- Use `OPTIMIZE` to compact small files.
- Implement `Z-ORDER` indexing for frequently queried columns:
    
    sql
    
    Copiar código
    
    `OPTIMIZE delta_table ZORDER BY (column_name);`
    
- Regularly clean metadata with `VACUUM`.

#### **8. How does Databricks handle streaming data?**

**Answer**:

- Databricks uses **Structured Streaming** in Spark, processing data incrementally with options for at-least-once or exactly-once guarantees.

---

### **Snowflake**

#### **9. How do you optimize Snowflake queries?**

**Answer**:

- Use **clustering keys** on frequently filtered columns.
- Use **result caching** for repeated queries.
- Use **Pruning**: Snowflake automatically skips irrelevant partitions.

#### **10. Explain time travel in Snowflake.**

**Answer**:  
Snowflake’s **Time Travel** allows querying historical data by specifying a timestamp or offset:

sql

Copiar código

`SELECT * FROM table_name AT (TIMESTAMP => '2024-12-01 10:00:00');`

---

### **S3, Glue, and Athena**

#### **11. How would you structure an S3 bucket for a data lake?**

**Answer**:

- Use folders for hierarchy:
    - **Raw Data**: `/raw/year/month/day/`
    - **Processed Data**: `/processed/year/month/day/`
    - **Analytics**: `/analytics/year/month/day/`
- Use consistent naming conventions.

#### **12. What is the difference between Glue and Athena?**

**Answer**:

- **AWS Glue**: Used for ETL tasks, schema inference, and data cataloging.
- **Athena**: A serverless SQL query service to query data directly on S3.

---

### **Spark**

#### **13. What is the difference between transformations and actions in Spark?**

**Answer**:

- **Transformations**: Lazy operations that define a new RDD or DataFrame (e.g., `map()`, `filter()`).
- **Actions**: Trigger computation and return results (e.g., `count()`, `collect()`).

#### **14. How do you use Spark with Parquet files?**

**Answer**:

python

Copiar código

`df = spark.read.parquet("s3://path/to/parquet") df.write.parquet("s3://output/path", mode="overwrite")`

---

### **Kubernetes**

#### **15. How do you manage secrets in Kubernetes?**

**Answer**:

- Use **Kubernetes Secrets** to store sensitive data:
    
    yaml
    
    Copiar código
    
    `apiVersion: v1 kind: Secret metadata:   name: db-secret data:   password: cGFzc3dvcmQ= # Base64 encoded`
    
    Mount the secret in pods.

#### **16. How would you deploy a Spark job on Kubernetes?**

**Answer**:

- Use Spark’s native Kubernetes support with a Dockerized Spark image.
    
    bash
    
    Copiar código
    
    `spark-submit \     --master k8s://https://k8s-cluster:443 \     --deploy-mode cluster \     --conf spark.kubernetes.container.image=spark-image:latest \     --class com.example.MyApp myapp.jar`
    

---

### **Kafka**

#### **17. How would you monitor Kafka performance?**

**Answer**:

- Use tools like **Kafka Manager**, **Confluent Control Center**, or **Prometheus/Grafana** for metrics.
- Key metrics: throughput, consumer lag, broker CPU/memory usage.

#### **18. How do you ensure exactly-once delivery in Kafka?**

**Answer**:

- Enable **idempotence** for producers: `enable.idempotence=true`.
- Use **transactions**:
    
    java
    
    Copiar código
    
    `producer.initTransactions(); producer.beginTransaction(); producer.send(record); producer.commitTransaction();`
    

---

### **Best Practices**

#### **19. What are the key considerations for building a resilient data platform?**

**Answer**:

- **Fault Tolerance**: Replicate data and use retry mechanisms.
- **Monitoring**: Set up dashboards and alerts.
- **Scalability**: Design for both vertical and horizontal scaling.
- **Security**: Encrypt data and restrict access using IAM.
- **Automation**: Use CI/CD for deployments and pipeline testing.