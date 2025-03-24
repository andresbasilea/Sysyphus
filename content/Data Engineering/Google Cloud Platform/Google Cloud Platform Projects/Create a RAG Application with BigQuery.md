## Laboratory
https://www.coursera.org/learn/googlecloud-create-a-rag-application-with-bigquery-aowin/gradedLti/LQBfH/create-a-rag-application-with-bigquery

> [!info] Overview
>  This lab will show how to implement a Retrieval Augmented Generation pipeline to address the issue of "hallucinations" in LLM. 

### BigQuery Introduction
See:
[[Data Analysis with BigQuery]]
### Retrieval Augmented Generation (RAG) Introduction
See:
[[Retrieval Augmented Generation]]

### Introduction to this project
We will assume that we are helping Coffee-on-Wheels, a pioneering mobile coffee vendor, to analyze feedback on its services. Without access to latest data, using Gemini's responses might be inaccurate. We will create a RAG pipeline with 3 steps: 
- **Generate embeddings**
- **Search vector space**
- **Generate improved answers**

BIg Query has a connection to remote generative AI models on Vertex AI. 

### Creating a source connection and granting IAM permissions

##### Creating a source connection
We will create a new external source connection. First, go to BigQuery and click on **Explorer -> +Add -> Connections to external data sources** and select the **Vertex AI remote models, remote functions and BigLake**, choosing the connection ID field to be `embedding_conn`. Click on create connection. 

![[Pasted image 20250323201739.png]]

![[Pasted image 20250323201817.png]]

Once created, copy the **service account ID** value, because we will need it to grant the necessary IAM permissions:
![[Pasted image 20250323201918.png]]

##### Granting IAM Permissions
We will  grant the service account the necessary IAM permissions to use BigQuery and Vertex AI resources. We will assign the role of *BigQuery Data Owner* and *Vertex AI User*.

- Click on grant access
	- ![[Pasted image 20250323202013.png]]
- In the "Add Principals" section, copy the service account ID for the BigQuery external connection created on the previous step. Add the BigQuery Data Owner and Vertex AI User roles:
	- ![[Pasted image 20250323202218.png]]


>[!danger]
>Don't forget to enable the Vertex AI API:
![[Pasted image 20250323202400.png]]
 



### Generating embeddings

- First, let's create a Dataset on BigQuery:
	- Navigate to BigQuery and click on the 3 dots next to the current project.
	![[Pasted image 20250323202638.png]]

- To connect to the embedding model, run the following SQL query:
```SQL
CREATE OR REPLACE MODEL `CustomerReview.Embeddings`
REMOTE WITH CONNECTION `us.embedding_conn`
OPTIONS (ENDPOINT = 'text-embedding-005');
```
![[Pasted image 20250323203045.png]]

We will upload the dataset from a CSV file using the following Query:

```SQL
LOAD DATA OVERWRITE CustomerReview.customer_reviews
(
    customer_review_id INT64,
    customer_id INT64,
    location_id INT64,
    review_datetime DATETIME,
    review_text STRING,
    social_media_source STRING,
    social_media_handle STRING
)
FROM FILES (
    format = 'CSV',
    uris = ['gs://spls/gsp1249/customer_reviews.csv']
);
```

![[Pasted image 20250323203214.png]]
We can see the uploaded schema here:
![[Pasted image 20250323203322.png]]
We can also check a preview of the data here:
![[Pasted image 20250323203345.png]]

- To generate embeddings from recent customer feedback and store them in a table, run the following SQL query in the query editor:
	- This process takes approximately 3 seconds to complete: 
		- ![[Pasted image 20250323203731.png]]


```SQL
CREATE OR REPLACE TABLE `CustomerReview.customer_reviews_embedded` AS
SELECT *
FROM ML.GENERATE_EMBEDDING(
    MODEL `CustomerReview.Embeddings`,
    (SELECT review_text AS content FROM `CustomerReview.customer_reviews`)
);
```

This creates the embeddings table, called *customer_reviews_embedded*:
	![[Pasted image 20250323203841.png]]
We can see, for example, the vector representation of the review "Great coffee":
	![[Pasted image 20250323203913.png]]
	

### Searching the vector space and retrieving similar items

To create an index of the vector search space, run the following SQL query:

> [!Note] 
> For datasets with fewer than 5,000 rows, as in this lab, creating an index is unnecessary. This step demonstrates the code required to create a vector space index when needed for larger datasets.

```SQL
CREATE OR REPLACE VECTOR INDEX `CustomerReview.reviews_index`
ON `CustomerReview.customer_reviews_embedded`(ml_generate_embedding_result)
OPTIONS (distance_type = 'COSINE', index_type = 'IVF');
```

Running the Index creation SQL query will return an error, as our dataset has less than 5,000 rows. 
![[Pasted image 20250323204147.png]]


To search the vector space and retrieve similar vectors, run the following SQL query:

```SQL
CREATE OR REPLACE TABLE `CustomerReview.vector_search_result` AS
SELECT
    query.query,
    base.content
FROM
    VECTOR_SEARCH(
        TABLE `CustomerReview.customer_reviews_embedded`,
        'ml_generate_embedding_result',
        (
            SELECT
                ml_generate_embedding_result,
                content AS query
            FROM
                ML.GENERATE_EMBEDDING(
                    MODEL `CustomerReview.Embeddings`,
                    (SELECT 'service' AS content)
                )
        ),
        top_k => 5,
        options => '{"fraction_lists_to_search": 0.01}'
    );
```

The previous query will create the table *vector_search_result*, which looks like this: 
![[Pasted image 20250323204304.png]]
For the "service" query, our 5 most similar vectors returned were: 
![[Pasted image 20250323204345.png]]

### Generating improved answer

To connect to the Gemini model, use: 

``` SQL
CREATE OR REPLACE MODEL `CustomerReview.Gemini`
REMOTE WITH CONNECTION `us.embedding_conn`
OPTIONS (ENDPOINT = 'gemini-pro');
```

This will create the Gemini model, which we can see in more detail under *Models -> Gemini*
![[Pasted image 20250323204613.png]]

To enhance the Gemini responses, we will provide it with relevant information retrieved from the vector search on our embeddings database, using: 

```SQL
SELECT
    ml_generate_text_llm_result AS generated
FROM
    ML.GENERATE_TEXT(
        MODEL `CustomerReview.Gemini`,
        (
            SELECT
                CONCAT(
                    'Summarize what customers think about our services',
                    STRING_AGG(FORMAT('review text: %s', base.content), ',\n')
                ) AS prompt
            FROM
                `CustomerReview.vector_search_result` AS base
        ),
        STRUCT(
            0.4 AS temperature,
            300 AS max_output_tokens,
            0.5 AS top_p,
            5 AS top_k,
            TRUE AS flatten_json_output
        )
    );
```

We could modify the parameters for *temperature, max_output_tokens*, etc. if our use case required a different maximum number of tokens, for example. 

By running the previous query, we see that Gemini enhanced our response using latest data from our embeddings database: 

![[Pasted image 20250323204957.png]]


### Concluding remarks

We now have successfully implemented a RAG pipeline in BigQuery, providing Gemini with relevant and up-to-date information. You connected to remote generative AI models, including an embedding model and Gemini, and followed three steps: creating embeddings, searching a vector space, and generating an improved answer.

### Questions to think about

How can the code be improved? For example, instead of saving vector search results to a table, could that process be embedded directly into answer generation for real-time retrieval? 