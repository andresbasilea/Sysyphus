- Examples: 
	- Online payments, new accounts, trial program abuse, account takeovers
- Fully managed ML model customized to your data
	- Automatic model creation
	- Continuous learning over time
- Insights into the importance of your features (model variables)
- Ingests data from S3 or an API
- Rule-based actions
- SageMaker integration

![[Screenshot 2025-06-09 at 11.37.57 a.m..png]]


#### Using Amazon Fraud Detector
- Choose a business use case (account fraud, etc.)
- Create an event type to monitor and entities associated with that event
	- Point this to the data source for this event
	- Define labels 
	- Create necessary IAM permissions
- Create model
- Train model
- Review performance
- Deploy

