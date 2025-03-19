A **Neural Network (NN)** is a machine learning model inspired by the human brain. It consists of layers of interconnected nodes (**neurons**) that process information and learn patterns from data.

🔹 **Structure:**

- **Input Layer:** Receives raw data.
- **Hidden Layers:** Perform computations and feature extraction.
- **Output Layer:** Produces the final prediction.

🔹 **Key Concepts:**

- **Weights & Biases:** Control the strength of connections between neurons.
- **Activation Functions:** Determine whether a neuron "fires" (e.g., ReLU, Sigmoid, Tanh).
- **Backpropagation:** A learning algorithm that adjusts weights using **gradient descent**.

![[Pasted image 20250129111929.png]]


A **Perceptron** is the simplest form of a neural network, introduced by **Frank Rosenblatt (1958)**. It is a **single-layer** model used for binary classification.

🔹 **How it Works:**

1. Takes **input features** (e.g., pixel values in an image).
2. Applies **weights and biases**.
3. Uses an **activation function** (e.g., step function) to decide the output (0 or 1).

🔹 **Limitations of Perceptrons:**

- Can only solve **linearly separable problems** (e.g., AND, OR).
- Cannot handle complex tasks like XOR (fixed by multi-layer networks).

![[Pasted image 20250129111952.png]]

- **Perceptron = Basic single-layer neuron model (binary classification).**
- **Neural Networks = Multi-layer models capable of learning complex patterns.**
- **Deep Learning = Neural networks with many layers (deep neural networks).**



### Key differences between Machine Learning and Deep Learning

|Feature|Machine Learning (ML)|Deep Learning (DL)|
|---|---|---|
|**Data Type**|Structured|Unstructured & Structured|
|**Feature Engineering**|Manual|Automatic|
|**Algorithms**|Decision Trees, SVM, KNN|Neural Networks (CNNs, RNNs, Transformers)|
|**Computational Power**|Low to Moderate|High (Requires GPUs/TPUs)|
|**Performance on Large Data**|Limited|Excellent|
|**Best Used For**|Simple & structured tasks|Complex tasks (image, speech, NLP)|
**All Deep Learning is Machine Learning, but not all Machine Learning is Deep Learning**

