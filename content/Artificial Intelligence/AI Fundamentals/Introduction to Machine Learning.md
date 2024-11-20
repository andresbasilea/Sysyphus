
>[!danger] This note is profoundly skewed to Google Cloud Platform, as I wrote this while taking notes and studying for the GCP Professional Data Engineer exam. There is more out there than GCP's products! 

### Machine Learning Introduction

Google Pre trained models:

- Cloud Vision API: detect and label objects in images. read printed text, etc.

- Cloud Video Intelligence API: Identify objects, places and actions on videos.

- Cloud Translation API: translate

- Cloud Text-to-Speech API: Converts text to human language like speech. 180 voices available.

- Cloud Speech-to-Text API: Convert from audio to text. Recognizes more than 120 languages.

- Cloud Natural Language API: Sentiment analysis, entity analysis, entity sentiment analysis, content classification, etc.
  

**Training your Own Models with AutoML**

Using reusable models in GCP -> using **cloud autoML**. where you need more specific models than the pre-trained ones (cloud vision api, clou text to speech, etc.)

**Cloud AutoML** uses transfer learning -> train own custom models. AutoML vision, AutoML Video Intelligence, AutoML Natural Language, AutoML Natural Translation, AutoML Tables.

**Google AI Platform:** Tensorflow, Tensorflow Extended, TPU, Kubeflow -> build machine learning pipelines.


### Machine Learning Basics

Machine Learning Pipeline: 3 phases -> data preparation, model training, operating

#### Optimization with gradient descent
![[Pasted image 20241120112831.png]]

[Optimization with Gradient Descent](https://www.pluralsight.com/cloud-guru)

Learning rate is the distance we move in the Loss Function curve

### Machine Learning Types and Models

Main types -> supervised, unsupervised, reinforcement

**Supervised learning:**

- Label data

**Unsupervised Learning:**

- input data only features, without labels

**Reinforcement learning:**

- we have an agent (model) that interacts with the environment, based on the state of the environment, the agent performs an action that changes the environment. The agent is rewarded or punished for each action on the environment.


**Model Types:**

**Regression** -> predict real number (y') based on features

**Classification** -> predict class from specified set {A,B,C,D} with probability

**Clustering** -> group elements into clusters or groups (unsupervised)


**Transfer Learning: Benefit of not having to train with a lot of images as in original classifier model.**

![[Pasted image 20241120113123.png]]

[Example of the concept of transfer learning](https://www.pluralsight.com/cloud-guru)


### Overfitting

**Overfitting** is "the production of an analysis that corresponds too closely or exactly to a particular set of data, and may therefore fail to fit to additional data or predict future observations reliably". [Wikipedia](https://en.wikipedia.org/wiki/Overfitting)

![[Pasted image 20241120113423.png]]


[Overfitting](https://www.pluralsight.com/cloud-guru)

#### Stopping Overfitting

![[Pasted image 20241120113511.png]]

- increase training data

- feature selection

- early stopping

- cross-validation: divide training data into much smaller training sets (folds) like k folds cross validation

- dropout (in neural networks)


### Hyperparameters

Two types of hyperparameters:

- model hyperparameters: relate directly to the model that is selected

- algorithm hyperparameters: relate to the training of the model (like learning rate).


**Hyperparameters**:

- batch size (algorithm hyperparameter)

- training epochs (algorithm hyperparameter)

- number of hidden layers in network (model hyperparameter)

- regularization type (l1,l2)

- regularization rate

- learning rate
- etc.


### Feature Engineering

We start with raw data -> almost never fit for ML model

Feature engineering: transform data so that it is fit for ML model.

**Missing data:**

1. ignore it

2. remove lines with missing data (remove rows)

3. impute -> assign a value where none was present initially.

**Types of missing data:**

1. missing completely at random (MCAR) -> nothing to do with its hypothetical value or the value of other data in our set. Missing data is a random subset of our full dataset.

2. missing at random (MAR) -> missing data is not related to a hypothetical value of the data, but it is related to other data that we have available (other observed data)

3. Not Missing at Random (NMAR) -> there is some cause to the missing data

  
  

**Imputation:**

- Use mean or median values

- Fixed constant -> 0 for example

- use most frequent values

- Use K-Nearest Neighbours to impute data to predict value of missing data

- use deep learning

  
  

**Outliers and Feature Clipping**

Remove outliers -> do it before other feature engineering

  
  

**One-hot encoding (categorical data)**

transform categorical values to numerical


**Linear Scaling**

Transform values in one range to another range. for example, transform 0-255 to the range 0-1.


**Log Scaling**

Useful when small number of values have many points, while the vast majority have few points.


## Machine Learning with TensorFlow

### Deep Learning with TensorFlow

Hidden layers are an example of Hyperparameters

input layer -> L0

hidden layers -> L1-LN

output layer -> LN + 1

![[Pasted image 20241120113656.png]]

[Neuron](https://www.pluralsight.com/cloud-guru)

Activation functions are functions that introduce non linearity, so that the neural network can learn a more complex relation between the features and labels.
- Rectified Linear Units (ReLu)
- Sigmoid/Logistic
- Hyperbolic tangent


### Neural Network Architectures

**Feed Forward Neural Networks:**

Simplest and most common type of DNN. Applications in computer vision and NLP. First type of DNN to be used. Information flows in one direction only (input to output).

**Recurrent Neural Network:**

Flow of information forms cycles/loops. Directed cycles. RNNs can be difficult to train. RNNs are dynamic.

**Convolutional Neural Network:**

Mostly used for visual learning tasks. Hidden layers contain convolutional layers and / or pooling layers. Convolutional layers summarize features in an image (filters of the image). Pooling layers simplify (downsample) inputs, usually succeed a non-linear activatoin function. Two types of pooling:

- Average pooling

- Max pooling -> max value for each patch we look at.



### Building a Neural Network

Keras Layers:

- tf.keras.layers.Add -> add a list of inputs.

- tf.keras.layers.Dense -> fully connected neural network layer.

- tf.keras.layers.Flatten -> flatten input. convert matrix to vector, for example.

- tf.keras.layers.Conv2D

- AveragePooling2D

- MaxPool2D

etc.

  
  

Keras activations:

- tf.keras.activations.relu

- tf.keras.activations.softmax

  
  

Optimizers:

- tf.keras.optimizers.Adam

- RMSprop

- SGD

  
  

Loss:

- tf.keras.losses.MeanSquaredError

- tf.keras.losses.BinaryCrossentropy

- CategoricalCrossentropy

  
  

Keras Callback Methods:

- tf.keras.callbacks.Callback -> execute code on specific moments



## Using Pre-Trained ML Cloud APIs

## Cloud AI APIs

Google divides AI in three blocks:

- **AI Building Blocks****:** 4 main areas:

- Sight: Vision and video

- Language: translation and Natural language

- Conversation: Dialogflow, text to speech, speech to text

- Structured Data: autoML tables, recommendation AI, cloud inference API

- **AI HUB:** Facilitates sharing AI resources inside an organization. Hosted repository of plug and play AI components. End to end pipelines from within your org. Standard algorithms to solve common problems. Foster collaboration.

- **AI Platform:** Large number of components to help you build and deploy ML solutions. Includes AI platform notebooks (managed service for jupyter notebooks). Includes Deep Learning Virtual Machine Images (pre conf vm for deep learning). Includes Deep Learning Containers (pre conf containers for Deep Learning). Includes AI Platform Training (facilitates distributed training and automatic hyperparameter tuning). Includes AI Platform Predictions (facilitates serverless hosting of ML models). Includes Continuous Evaluations (models can be optimized using ground truth labels). Includes What-If tool (model evaluation tool with user interface). Include Cloud TPUs. Includes Q-Flow (kubernets)

  
  

**Basic Capabilities within sight/vision Building Block:**

**Sight/Vision API:**

Static images

two modes: synchronous or online mode -> responses returned immediately

asynchronous or offline mode -> results once processing is completed

Optical Character Recognition**:** Extracts text from images. -> handwritings, signs, documents.

Cropping Hints: -> suggested cropping of an image.

Face Detection and facial attributes

Image Property Detection -> properties like dominant colors

Label Detection -> identify and label objects, locations, activities, products, animal species, etc.

Landmark detection -> natural or manmade landmark detection

Logo Detection -> detect popular product logos on images.

Explicit Content Detection -> adult content, violent content: adult, spoof, medical, violence, racist?

Web Entity and Page Detection -> webs or pages that use the image in some way

**Basic Capabilities within sigh/video Building Block:**

**Sight/Video API:**

Powerful content discovery within video

Time duration based

Supports common formats like mov, mpeg4, mp4, avi

API capabilities:

Detect labels -> annotates the video with entities that are detected. List of video segment annotations. List of frame annotations. List of shots.

Shot change detection -> Annotates the video based on shots or scenes. Entities associated with specific scenes.

Detect Explicit Content

Transcribe speech -> can also filter profanity, etc.

Track Objects -> track multiple objects, provide location of object within frames.

Detect text -> OCR on text ocurring within videos.

Google Knowledge Graph Search API:

Allows to perform searches on google knowledge graph. Lets you get a ranked list of the most notable entities that match criteria, predictively completing entities within a search box or annotating or organising content using the knowledge graph entities.

All objects detected on VISION or VIDEO API will be added to the Google Knowledge Graph.

  
  

**Basic Capabilities within Language Building Block:**

Translation: Uses Neural Machine Translation (NMT) which is not supported for all languages. If not supported, the Phrase-Based Machine Translation (PBMT) is used instead.

Natural Language: uncover structure and meaning in text. Sentiment analysis, entity analysis, syntax analysis, entity-sentiment analysis, content classification.

Sentiment Analysis: positive or negative emotionality.

Entity Analysis: Identifies entities within text and provides information on the identified entities (nouns/things).

Entity sentiment analysis: combines previous two. Identifies sentiment on things.

Syntax analysis: for example for sentance extraction.

Content classification: content classes on text.

  
  

**Basic Capabilities within Conversation Building Block:**

Dialogflow -> create chatbots. Natural language interaction platform. Analyses text or audio inputes. Responds in text or speech. Dialogflow can understand intent.



## Leveraging Auto ML Platform

### Introduction to AutoML

Used when fully pre trained api are insufficient. -> Suite of ML products. Facilitates training of custom ML models. Highly performant models. Speed of delivery. Human Labelling service (team of people annotates labels). Serving models through the autoML API.

![[Pasted image 20241120113923.png]]
[AutoML overview](https://www.pluralsight.com/cloud-guru)

### Language with AutoML

**AutoML Natural Language** allows to:

- create custom models to classify content into custom categories you define.

when predefined categories are insufficient

**AutoML Translation:**

To translate sentences on specific contexts -> fill the car with juice does not translate to remplir la voiture avec des jous

AutoML Translation Training: train it with pairs of source target sentences.

  
  

### Structured Data with AutoML

**AutoML Tables** allows you to quickly build and deploy ML models on structured data.

Some of its capabilities:

1. Data support -> provides information on missing data. Provides correlations, cardinality and distributions for each feature.

2. Automatic feature engineering -> Normalises and bucketizes numerical features. Creates one-hot encoding and embeddings for categorical features. Performs basic text processing for text fields. Extract time and date features from time stamp data.

3. Model training -> parallel testing of multiple models -> find best model for each situation.



## Operationalizing Machine Learning Models

### Introduction to Operationalizing ML Models


Operationalize ML -> process of deploying predictive models to a production environment, together with ongoing measurement, monitoring and improvement of the models.

Deployment -> scoring -> logging -> monitoring -> retraining

Deployment: Separate infrastructure fro training and for deployment of the model. Data preparation pipeline should be the same for training and deployment (same input for the model). Validations of requests on deployment. Design to run anywhere.

Scoring: Make model interfaces flexible -> online, offline, batch, stream. Use standardized frameworks like: PMML (Predictive Model Markup Language) or ONNX (Open Neural Network Exchange).

Logging: Input request, output response, model version, data validation errors, output, response time

Monitoring: Fast enough, predictive performance (decay in predictive ability), processing performance (infrastructure change).

Retraining: Data drift (unforseen changes in input data), concept drift (statistical properties model is trying to predict changed in the outside world and are not longer good), retrain with same features or rebuild with new features.



