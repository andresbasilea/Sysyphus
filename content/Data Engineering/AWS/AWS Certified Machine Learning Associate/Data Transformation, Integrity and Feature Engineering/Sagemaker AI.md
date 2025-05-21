
SageMaker is Amazon's service for Machine Learning. It can do deep learning and generative AI, but it wasn't built with that purpose in mind. 

- SageMaker is built to handle the entire ML workflow. 
	- Deploy model, fetch clean and prepare data and train and evaluate a model
- SageMaker Training and Deployment![[Screenshot 2025-04-24 at 12.02.07 p.m..png]]


- SageMaker notebooks can direct the process
	- **Notebook instances on EC2 are spun up from the console**
		- S3 data access
		- Scikit_learn, Spark, TensorFlow
		- Wide variety of built-in models
		- Ability to spin up training instances
		- Ability to deploy trained models for making predictions at scale
- You can do all through a Jupyter Notebook.
- But you can also do it from the console: create training job, select data, train, etc. 


### SageMaker AI Domains

- Domains organize users, apps and resources
	- Domains share an EFS volume
	- List of authorized users that can access the domain
		- User profiles own personal apps
			- SageMaker Studio instances
			- Private EFS directory
			- Shared resources across other users
	- Shared spaces
		- Shared EFS directory
		- Communal IDE app
	- Config settings (like VPC settings)


### VPC's for SageMaker AI Domains

By default, a domain has 2 VPC's (by default):
- One for internet access
	- Managed by SageMaker AI
- And your own
	- Encrypted traffic to your EFS volume
	- You specify the VPC, its subnets, and security groups
	![[Screenshot 2025-04-24 at 12.19.29 p.m..png]]



### Data Processing, Training, and Deployment with SageMaker AI

Data usually comes from S3
- Ideal format varies with algorithm - often it is recordIO / Protobuf
- Or some sort of columnar format for example

You can also ingest from Athena, EMR, Redshift, Amazon Keyspaces DB or integrate with Apache Spark

#### SageMaker Processing
- Processing Jobs
	- Copy data from S3
	- Spin up a processing container
		- SageMaker built-in or user provided
	- Output processed data to S3
	![[Screenshot 2025-04-24 at 12.24.08 p.m..png]]

#### Training on SageMaker
- Create a training job
	- URL of S3 bucket with training data
	- ML compute resources
	- URL of S3 bucket for output
	- ECR path to training code (container for training code)
- Training options
	- Built-in training algorithms
	- Spark MLlib
	- Custom python TensorFlow / MXNet code
	- PyTorch, Scikit-Learn
	- XGBoost, Hugging Face, Chainer
	- Your own Docker Image
- Deploy trained models
	- Model normally saved to S3
	- Can deploy two ways: 
		- Persistent endpoint for making individual predictions on demand
		- SageMaker Batch Transform to get predictions from entire dataset

#### Deploying Trained Models
- Save your trained models to S3
- Can deploy two ways: 
	- Persistent endpoint for making predictions on demand 
	- SageMaker Batch Transform to get predictions for an entire dataset
- Other options
	- Inference Pipelines for more complex processing 
	- Elastic Inference for accelerating deep learning models 
	- Automatic scaling
	- SageMaker Neo for deploying to edge devices

### Amazon SageMaker Ground Truth and Label Generation
- Sometimes you don't have training data labeled, and you need humans
- Ground Truth manages humans who will label your data for training purposes
- Example: labeling images
- Ground Truth **creates its own model as images are labeled by people**
- And as time goes on, only the ambiguos cases will be sent to human beings, other images are going to be classified or labeled automatically by the model create by ground truth. 
- The human labelers can be: 
	- Mechanical Turk
	- Your own internal team
	- Labeling companies

Other ways to generate training labels:
- Rekognition
- Comprehend
- Any pre-trained model or unsupervised technique that may be helpful.

 Ground Truth Plus lets you do all this but completely managed by AWS workers

#### Mechanical Turk
- Crowdsourcing marketplace to perform simple human tasks
- Distributed virtual workforce
- Example: 
	- Tagging images (10 cents by image for example), data collection, business processing
- Big workforce

#### SageMaker Data Wrangler
- Visual interface
- ETL pipeline
- Used to prepare data for ML
- Import data 
- Visualize data 
- Transform data 
	- Choose Wrangler transformations or use your own PySpark, Pandas
- Quick model to train your model with your data and test results quickly

![[Screenshot 2025-04-24 at 3.04.09 p.m..png]]

Data Wrangler is NOT DOING THE TRANSFORMATIONS, but rather creating the code to perform those transformations once the processing pipeline is ran, for example, in a notebook. 

Normally exports a jupyter notebook that then can be ran. Data Wrangler is not sitting in the data pipeline itself, but generating code for the data pipeline. 

If problems: 
- Make sure permissions on your data sources allow Data Wrangler access. 
	- Add AmazonSageMakerFullAccess policy.
- EC2 instance limit
	- If you get the "the following instance type is not available" error
	- May need to request a quota increase
	- Service quotas / Amazon SageMaker / Studio KernelGateway Apps running on ml.m5.4xlarge instance


### Demo: SageMaker Studio, Canvas and Data Wrangler

![[Screenshot 2025-04-24 at 3.25.51 p.m..png]]

You can chat to a chatbot to create the data transforms. 
You can even fine tune a foundational model on SageMaker canva
You can even deploy the model from sagemaker studio


### SageMaker Model Monitor and SageMaker Clarify

#### Model monitor
- Nature of data coming in to the model can change over time. 
- Alerts through cloudwatch on quality deviations on your deployed models
- Visualize data drift
- Detect anomalies and outliers
- Detect new features
- Feature attribution drift
- Integrates with SageMaker Clarify

#### SageMaker Clarify
- Detects potential bias
	- Class Imbalance (CI)
	- Difference proportions of labels (DPL)
	- Kullback-Leibler Divergence (KL)
	- Lp-norm (LP)
	- Total variation distance (TVD)
	- Kolmogorov-Smirnov (KS)
	- Conditional Demographic Disparity (CDD)
- Clarify also helps explain model behavior
	- Understand which features contribute the most to your predictions

SageMaker Model Monitor data is stored in S3.
Monitoring jobs are scheduled via a Monitoring Schedule

Metrics are emitted to CloudWatch



### Clarify and Partial Dependence Plots (PDPs)

- PDP shows dependence of predicted target response on a set of input features
- 
