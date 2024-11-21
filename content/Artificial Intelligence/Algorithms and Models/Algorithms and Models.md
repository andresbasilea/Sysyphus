### Linear and Logistic Regression

![[LinearAndLogisticRegression.pdf]]

### Linear Regression



#### Import the required packages


```python
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D 
```

#### Function to calculate the Gradiend descent
You may find helpful the use of cost (one of the costFunction output parameters) to debug this method
Hint: print("Iteration %d | Cost: %f" % (i, cost))


```python
# Diapositiva 22, Gradient Descent algorithm
def gradientDescent(x, y, theta, alpha, m, maxsteps): # x valores independientes, y valores dependientes, theta parametro de aprendizaje, Alpha tasa de aprendizaje, m ejemplos de entrenamiento, max numero maximo de iteraciones
    thetaHist = np.empty([maxsteps, 2])
    xTrans = x.transpose()

    for i in range(0, maxsteps):
        predictions = np.dot(x, theta)        # hθ(xi) Obtener predicciones con los valores de theta inicial
        error = predictions - y               # hθ(xi)-yi Obtener el error entre la predicción y valores reales (Objetivos)
        gradient = np.dot(xTrans, error) / m  # XT(hθ(xi)-yi) Obtener el gradiente 
        theta = theta - alpha * gradient      # θ-α(δ/δθj) = θ-α(XT(hθ(xi)-yi)) Obtener nuevos valores de thetas
        thetaHist[i] = theta

    return theta, thetaHist, i    
```


```python
def gradientDescentIndependentUpdate(x, y, theta, alpha, m, maxsteps):  # x valores independientes, y valores dependientes, theta parametro de aprendizaje, Alpha tasa de aprendizaje, m ejemplos de entrenamiento, max numero maximo de iteraciones
    thetaHist = np.empty([maxsteps, 2])
    xTrans = x.transpose()

    for i in range(0, maxsteps):
        predictions = np.dot(x, theta)        # hθ(xi) Obtener predicciones con los valores de theta inicial
        error = predictions - y               # hθ(xi)-yi Obtener el error entre la predicción y valores reales (Objetivos)
        
        gradient0 = np.dot(xTrans[0], error) / m  # XT(hθ(xi)-yi) Obtener el gradiente para theta0
        theta[0] = theta[0] - alpha * gradient0   # θ-α(δ/δθ0) = θ-α(XT(hθ(xi)-yi)) Actualizar theta0
        
        thetaHist[i] = theta
        
    for i in range(0, maxsteps):
        predictions = np.dot(x, theta)        # hθ(xi) Obtener predicciones con los valores de theta inicial
        error = predictions - y               # hθ(xi)-yi Obtener el error entre la predicción y valores reales (Objetivos)
        
        gradient1 = np.dot(xTrans[1], error) / m  # XT(hθ(xi)-yi) Obtener el gradiente para theta1
        theta[1] = theta[1] - alpha * gradient1   # θ-α(δ/δθ1) = θ-α(XT(hθ(xi)-yi)) Actualizar theta1
        
        thetaHist[i] = theta

    return theta, thetaHist  
```

#### Function to calcultate the cost function
The cost function template is returning two parameters, loss and cost. We proposed these two paremeters to facilitate the implementation having not only the cost but also the difference between y and the prediction directly (loss).


```python
#Diapositiva 22, Linear Regression Model - Cost Function
def costFunction(x, y, theta):
    predictions = np.dot(x, theta)                    # hθ(xi)
    error = predictions - y                           # hθ(xi)-yi
    cost = np.sum(np.square(error)) / (2 * len(y))    # (1/2m)Σ(hθ(xi)-yi)
    loss = np.sqrt(cost)      
    return cost, loss
```

#### Define some training data
To test your algorithm it is a good idea to start with very simple test data where you know the right answer. So let's put all data points on a line first. Variables x and y represent a (very simple) training set (a dataset with 9 instances). Feel free to play with this test data or use a more realistic one.

$NOTE:$ The column with 1’s included in the variable x is used to facilitate the calculations in the Gradient Descent function (do you remember the x<sub>0</sub> to use the matrix form? If not, revise the lecture).


```python
x=np.array([[1, 0], [1, 0.5], [1, 1], [1, 1.5], [1, 2], [1, 2.5], [1, 3], [1, 4], [1, 5]])
y=np.array([0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5])
```

#### Calculate length of training set



```python
m, n = np.shape(x)
```

#### Plot training set



```python
fig = plt.figure(1)  # An empty figure with no axes
plt.plot(x[:,1], y, 'x') # Segundo valor de X vs Y
```




    [<matplotlib.lines.Line2D at 0x1f727e912d0>]

#### Cost function
Also it is useful for simple test cases to not just run an optimization but first to do a systematic search. So let us first calculate the values of the cost function for different parameters theta



```python
theta0 = np.arange(-2, 2.01, 0.25)
theta1 = np.arange(-2, 3.01, 0.25)

#Inicializar la matriz J
J = np.zeros((len(theta0), len(theta1)))

# Calculate values of the cost function
for i in range(0, len(theta0)):  
    for j in range(0, len(theta1)):
        cost, loss = costFunction(x, y, [theta0[i], theta1[j]]) #Usar costFunction con diferentes valores de Theta
        J[i, j] = cost #Almacenar el costo en una matriz
```


```python
print(np.shape(J))
print(J[0][0])
```

    (17, 21)
    46.875


#### Visualize the cost function
Let us do some test plots to see the cost function J and to analyze how it depends on the parameters theta0 and theta1



```python
theta0, theta1 = np.meshgrid(theta0, theta1)
fig2 = plt.figure(2)
ax = fig2.add_subplot(121, projection="3d")
surf = ax.plot_surface(theta0, theta1, np.transpose(J))
ax.set_xlabel('theta 0')
ax.set_ylabel('theta 1')
ax.set_zlabel('Cost J')
ax.set_title('Cost function Surface plot')

ax = fig2.add_subplot(122)
contour = ax.contour(theta0, theta1, np.transpose(J))
ax.set_xlabel('theta 0')
ax.set_ylabel('theta 1')
ax.set_title('Cost function Contour plot')

fig2.subplots_adjust(bottom=0.1, right=1.5, top=0.9)
```


    
![png](Basile_Keller_Shen_Lab4_LinearRegression_files/Basile_Keller_Shen_Lab4_LinearRegression_18_0.png)
    


#### Gradient descent implementation
Here we implement Gradient Descent



```python
alpha = 0.05        # learning parameter
maxsteps= 10000      # number of iterations that the algorithm is running

# First estimates for our parameters
thet = [2, 0]

thet, thetaHist, i = gradientDescent(x, y, thet, alpha, m, maxsteps)
#thet, thetaHist, i = gradientDescentIndependentUpdate(x, y, thet, alpha, m, maxsteps)
print(i)
```

    9999



```python
print(thetaHist)
```

    [[2.00833333e+00 1.37500000e-01]
     [2.00135417e+00 2.25399306e-01]
     [1.98520153e+00 2.82923683e-01]
     ...
     [8.88178420e-16 1.00000000e+00]
     [8.88178420e-16 1.00000000e+00]
     [8.88178420e-16 1.00000000e+00]]



```python
def checkConvergence(thetaHist):
    for i in range(1, thetaHist.shape[0]):
        if np.allclose(thetaHist[i], thetaHist[i-1], atol=1.0e-23):
            break
    return i
```


```python
print(thetaHist[3018], thetaHist[3017])
```

    [8.89759057e-16 1.00000000e+00] [8.89767887e-16 1.00000000e+00]



```python
i = checkConvergence(thetaHist)
print("Convergencia alcanzada en la iteración:", i)

```

    Convergencia alcanzada en la iteración: 3017


#### Print found optimal values




```python
print("Optimized Theta0 is ", thet[0])
print("Optimized Theta1 is ", thet[1])
```

    Optimized Theta0 is  8.88178419700143e-16
    Optimized Theta1 is  0.9999999999999996



```python
print("Optimized Theta for iteration 5621 is ", thetaHist[5621])
print("Optimized Theta for iteration 6000 is ", thetaHist[6000])
print("Optimized Theta is ", thetaHist[9999])
```

    Optimized Theta for iteration 5621 is  [8.8817842e-16 1.0000000e+00]
    Optimized Theta for iteration 6000 is  [8.8817842e-16 1.0000000e+00]
    Optimized Theta is  [8.8817842e-16 1.0000000e+00]


#### Visualization of the solution
Now let's plot the found solutions of the Gradient Descent algorithms on the contour plot of our cost function to see how it approaches the desired minimum.



```python
fig3 = plt.figure(3)
plt.contour(theta0, theta1, np.transpose(J))
plt.plot(thetaHist[:,0], thetaHist[:,1], 'x')
ax.set_xlabel('theta 0')
ax.set_ylabel('theta 1')

# Finally, let's plot the hypothesis function into our data
xs = np.array([x[0,1], x[x.shape[0]-1,1]])
h = np.array([[thet[1] * xs[0] + thet[0]], [thet[1] * xs[1] + thet[0]]])
plt.figure(1)
plt.plot(x[:,1], y, 'x')  # Data
plt.plot(xs, h, '-o')     # hypothesis function
plt.show()
```


### Logistic Regression

#### Import the Dataset


```python
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score

```


```python
from google.colab import drive
drive.mount('/content/drive')

```

    Drive already mounted at /content/drive; to attempt to forcibly remount, call drive.mount("/content/drive", force_remount=True).



```python
file_path = '/content/drive/MyDrive/Basile_Keller_Shen_Practica4/diabetes.xlsx'
df = pd.read_excel(file_path)
mapping = {'tested_positive': 1, 'tested_negative': 0}
df['class'] = df['class'].map(mapping)
df

```





  <div id="df-fa920e2a-60a7-431e-90e4-dc27bb1ca484">
    <div class="colab-df-container">
      <div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>preg</th>
      <th>plas</th>
      <th>pres</th>
      <th>skin</th>
      <th>insu</th>
      <th>mass</th>
      <th>pedi</th>
      <th>age</th>
      <th>class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>6</td>
      <td>148</td>
      <td>72</td>
      <td>35</td>
      <td>0</td>
      <td>33.6</td>
      <td>0.627</td>
      <td>50</td>
      <td>1</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1</td>
      <td>85</td>
      <td>66</td>
      <td>29</td>
      <td>0</td>
      <td>26.6</td>
      <td>0.351</td>
      <td>31</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>8</td>
      <td>183</td>
      <td>64</td>
      <td>0</td>
      <td>0</td>
      <td>23.3</td>
      <td>0.672</td>
      <td>32</td>
      <td>1</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1</td>
      <td>89</td>
      <td>66</td>
      <td>23</td>
      <td>94</td>
      <td>28.1</td>
      <td>0.167</td>
      <td>21</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0</td>
      <td>137</td>
      <td>40</td>
      <td>35</td>
      <td>168</td>
      <td>43.1</td>
      <td>2.288</td>
      <td>33</td>
      <td>1</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>763</th>
      <td>10</td>
      <td>101</td>
      <td>76</td>
      <td>48</td>
      <td>180</td>
      <td>32.9</td>
      <td>0.171</td>
      <td>63</td>
      <td>0</td>
    </tr>
    <tr>
      <th>764</th>
      <td>2</td>
      <td>122</td>
      <td>70</td>
      <td>27</td>
      <td>0</td>
      <td>36.8</td>
      <td>0.340</td>
      <td>27</td>
      <td>0</td>
    </tr>
    <tr>
      <th>765</th>
      <td>5</td>
      <td>121</td>
      <td>72</td>
      <td>23</td>
      <td>112</td>
      <td>26.2</td>
      <td>0.245</td>
      <td>30</td>
      <td>0</td>
    </tr>
    <tr>
      <th>766</th>
      <td>1</td>
      <td>126</td>
      <td>60</td>
      <td>0</td>
      <td>0</td>
      <td>30.1</td>
      <td>0.349</td>
      <td>47</td>
      <td>1</td>
    </tr>
    <tr>
      <th>767</th>
      <td>1</td>
      <td>93</td>
      <td>70</td>
      <td>31</td>
      <td>0</td>
      <td>30.4</td>
      <td>0.315</td>
      <td>23</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>768 rows × 9 columns</p>
</div>
      <button class="colab-df-convert" onclick="convertToInteractive('df-fa920e2a-60a7-431e-90e4-dc27bb1ca484')"
              title="Convert this dataframe to an interactive table."
              style="display:none;">

  <svg xmlns="http://www.w3.org/2000/svg" height="24px"viewBox="0 0 24 24"
       width="24px">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M18.56 5.44l.94 2.06.94-2.06 2.06-.94-2.06-.94-.94-2.06-.94 2.06-2.06.94zm-11 1L8.5 8.5l.94-2.06 2.06-.94-2.06-.94L8.5 2.5l-.94 2.06-2.06.94zm10 10l.94 2.06.94-2.06 2.06-.94-2.06-.94-.94-2.06-.94 2.06-2.06.94z"/><path d="M17.41 7.96l-1.37-1.37c-.4-.4-.92-.59-1.43-.59-.52 0-1.04.2-1.43.59L10.3 9.45l-7.72 7.72c-.78.78-.78 2.05 0 2.83L4 21.41c.39.39.9.59 1.41.59.51 0 1.02-.2 1.41-.59l7.78-7.78 2.81-2.81c.8-.78.8-2.07 0-2.86zM5.41 20L4 18.59l7.72-7.72 1.47 1.35L5.41 20z"/>
  </svg>
      </button>

  <style>
    .colab-df-container {
      display:flex;
      flex-wrap:wrap;
      gap: 12px;
    }

    .colab-df-convert {
      background-color: #E8F0FE;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: none;
      fill: #1967D2;
      height: 32px;
      padding: 0 0 0 0;
      width: 32px;
    }

    .colab-df-convert:hover {
      background-color: #E2EBFA;
      box-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px 1px rgba(60, 64, 67, 0.15);
      fill: #174EA6;
    }

    [theme=dark] .colab-df-convert {
      background-color: #3B4455;
      fill: #D2E3FC;
    }

    [theme=dark] .colab-df-convert:hover {
      background-color: #434B5C;
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
      filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
      fill: #FFFFFF;
    }
  </style>

      <script>
        const buttonEl =
          document.querySelector('#df-fa920e2a-60a7-431e-90e4-dc27bb1ca484 button.colab-df-convert');
        buttonEl.style.display =
          google.colab.kernel.accessAllowed ? 'block' : 'none';

        async function convertToInteractive(key) {
          const element = document.querySelector('#df-fa920e2a-60a7-431e-90e4-dc27bb1ca484');
          const dataTable =
            await google.colab.kernel.invokeFunction('convertToInteractive',
                                                     [key], {});
          if (!dataTable) return;

          const docLinkHtml = 'Like what you see? Visit the ' +
            '<a target="_blank" href=https://colab.research.google.com/notebooks/data_table.ipynb>data table notebook</a>'
            + ' to learn more about interactive tables.';
          element.innerHTML = '';
          dataTable['output_type'] = 'display_data';
          await google.colab.output.renderOutput(dataTable, element);
          const docLink = document.createElement('div');
          docLink.innerHTML = docLinkHtml;
          element.appendChild(docLink);
        }
      </script>
    </div>
  </div>





```python
#Dividimos los datos en datos de entrenamiento y prueba
from sklearn.model_selection import train_test_split

X = df.iloc[:, :-1]  # Características (todas las columnas excepto la última)
y = df.iloc[:, -1]   # Etiquetas (última columna)

# División en conjuntos de entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

```


```python
X = X_train.values
Y = y_train.values
X_t = X_test.values
Y_t = y_test.values
```

#### Model using library


```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
```


```python
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
predictions = model.predict(X_test)
theta = model.coef_
accuracy = accuracy_score(y_test, predictions)
print(theta)
print("Exactitud:", accuracy)


```

    [[ 0.06454373  0.03409222 -0.01387313  0.00328315 -0.00180345  0.10261653
       0.62730352  0.03706176]]
    Exactitud: 0.7467532467532467


#### Functions


```python
def sigmoid(z):
    return 1 / (1 + np.exp(-z))
```


```python
# Diapositiva 22, Gradient Descent algorithm
def gradientDescent(x, y, theta, alpha, m, maxsteps): 
    thetaHist = np.empty([maxsteps, len(theta)])
    xTrans = x.transpose()

    for i in range(0, maxsteps):
        z = np.dot(x, theta)
        h = sigmoid(z)
        error = h - y
        gradient = np.dot(xTrans, error) / m
        theta -= alpha * gradient
        thetaHist[i] = theta

    return theta, thetaHist   
```


```python
#Diapositiva 22, Linear Regression Model - Cost Function
def costFunction(X, Y, theta):
    m = len(Y) 
    z = np.dot(X, theta) 
    predictions = sigmoid(z) 
    epsilon = 1e-10  # Pequeña corrección para evitar divisiones por cero
    cost = (-1/m) * (np.dot(Y, np.log(predictions + epsilon)) + np.dot((1-Y), np.log(1-predictions + epsilon)))
    return cost
```

#### Model using Functions



```python
alpha = 0.01      
maxsteps= 1000      
theta_initial = [0,0,0,0,0,0,0,0]

thet, thetaHist = gradientDescent(X, Y, theta_initial, alpha, len(Y), maxsteps)
print(thet)
```

    [ 1.17802637  0.31741276 -1.05008194 -0.06815892  0.00170839  0.22688641
      0.05184131  0.37874229]


#### Metric




```python
#Función de costo
cost = costFunction(X_t, Y_t, thet)
print("Costo:", cost)
```

    Costo: 4.027106967175376



```python
# Datos de prueba para hacer predicciones
# Hacer predicciones utilizando los parámetros finales
predictions = sigmoid(np.dot(X_t, thet))

# Si las predicciones son mayores o iguales a 0.5, clasificar como 1, de lo contrario, clasificar como 0
predictions = np.where(predictions >= 0.5, 1, 0)

accuracy = accuracy_score(Y_t, predictions)

print("Exactitud:", accuracy)

```

    Exactitud: 0.7012987012987013
