- For NLP
- Fully managed and serverless
- Uses ML to find insights and relationships in text 
	- language 
	- key phrases, places, people, brands, events
	- positive or negative
	- tokenization and parts of speech
	- organizes a collection of text files by topic
- Sample use case:
	- Analyze customer interactions (emails) to find positive or negative experience
	- Articles by topic

Custom classification
- Organize documents into categories (classes) that you define
- Categorize customer emails so that you can provide guidance based on the type of the customer request
- Supports different document types (text, word, PDF, images)
- Real time or batch 

### Named Entity Recognition (NER)
- NER - extrats predefined general-purpose entities like people, places, organizations, dates, from **text**.

### Comprehend Custom Entity Recognition
- Analyze text for specific terms and noun-based phrases
- Extract terms like policy numbers, or phrases that imply a customer escalation, anything specific to your business
- Train the model with custom data such as a list of the entities and documents that contain them
- Real time or async analysis. 


## Comprehend - Custom Models

- You can create custom models for ER or document classification
	- Trained on your own data
- Comprehend manages model versioning
- Custom models can be copied between AWS accounts
	- Attach IAM policy to a model version, authorizing the other account
	- Other account then imports the model
		- Must be in the same region
		- Need its ARN, region, and optional KMS key
		- Can be done from the Comprehend console.

