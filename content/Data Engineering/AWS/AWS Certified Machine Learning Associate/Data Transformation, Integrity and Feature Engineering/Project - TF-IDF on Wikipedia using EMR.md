
### Preparing data for TF-IDF with Spark and EMR Studio

TF-IDF
- Term Frequency and Inverse Document Frequency. Important data for search, figuring out which terms are relevant for a document. 
- Term frequency: 
	- How often a word appears in a document
- Document frequency: 
	- How often a word occurs in an entire set of documents, i.e., all of Wikipedia or every web page.

So, you calculate TF-IDF by doing the product TermFrequency * Inverse Document Frequency. We actually use the log of the IDF, since word frequencies are distributed exponentially. 

TF-IDF assumes a document is just a "bag of words"
- Parsing documents into a bag of words can be most of the work
- Words can be represented as a has value (number) for efficiency
- What about synonyms, capitalization, tenses, abbreviations?
- Doing this at scale is hard, and that's where tools like **Spark** come in. 

An extension of TF-IDF takes into account n-grams as well. For example "I love AWS exams" can be written in:
- unigrams: "I", "love", "AWS", "exams"
- bigrams: "I love", "love AWS", "AWS exams"
- etc.

