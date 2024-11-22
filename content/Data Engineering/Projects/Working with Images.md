![[WorkingWithImages.pdf]]
```python
from google.colab import drive
drive.mount('/gdrive')

repositorioPractica1 = '/gdrive/MyDrive/Basile_Keller_Shen_Practica1' 
```

    Mounted at /gdrive


## **3. Manipulación de Imágenes con Python**

**3.1 Recomendaciones para la manipulación básica de imágenes en Python**


```python
import matplotlib.image as mpimg
import matplotlib.pyplot as plt
import PIL
from PIL import Image
import cv2
import skimage
from skimage import io
from skimage.color import *


import os
from os import listdir
import pandas as pd
import numpy as np
import scipy.sparse as sp
import seaborn as sns
```


```python
img=mpimg.imread('/gdrive/MyDrive/Basile_Keller_Shen_Practica1/lena_color_512.tif') 
imgplot = plt.imshow(img, cmap="gray")
```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_4_0.png)
    


##**4. Ejercicios Parte A: Imágenes**

**4.1 Desarrolla un script para leer y desplegar cada imagen con los paquetes de Matplotlib, OpenCV, Scikit-Image y PIL**


```python
def leerImagen(url, paquete):
  
    if paquete == 1:
        print("\nMatplotlib: \n")
        img=mpimg.imread(url) 
        imgplot = plt.imshow(img)

    elif paquete == 2:
        print("\nOpenCV: \n")
        img = cv2.imread(url)
        cv2.imshow('Imagen', img)   
        cv2.waitKey(0)   
        cv2.destroyAllWindows()  

    elif paquete == 3:
        print("\nScikit-Image: \n")
        img = io.imread(url)
        io.imshow(img) #visualizador por default
        io.show()

    elif paquete == 4:
        print("\nPIL: ")
        img = PIL.Image.open(url)
        display(img)
        
    else:
        print("Número de paquete de visualización incorrecto. 1) Matplotlib, 2) OpenCV, 3) Scikit-Image, 4) PIL")
```

*Probando 4.1 con una sola imagen*


```python
leerImagen('/gdrive/MyDrive/Basile_Keller_Shen_Practica1/lena_color_512.tif', 1)
```

    
    Matplotlib: 
    



    ---------------------------------------------------------------------------

    NameError                                 Traceback (most recent call last)

    <ipython-input-2-daec1114521c> in <module>
    ----> 1 leerImagen('/gdrive/MyDrive/Basile_Keller_Shen_Practica1/lena_color_512.tif', 1)
    

    <ipython-input-1-837c6485c449> in leerImagen(url, paquete)
          3     if paquete == 1:
          4         print("\nMatplotlib: \n")
    ----> 5         img=mpimg.imread(url)
          6         imgplot = plt.imshow(img)
          7 


    NameError: name 'mpimg' is not defined


*Probando 4.1 con imágenes dentro de un folder*


```python
### Probar con las imágenes dentro del folder
dir_folder = "/gdrive/MyDrive/Basile_Keller_Shen_Practica1"
for img in os.listdir(dir_folder):
    if (img.endswith(".tif" or ".raw" or ".tiff" or ".jpg")):
        leerImagen("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/" + img, 4)
```

    
    PIL: 



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_11_1.png)
    


    
    PIL: 



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_11_3.png)
    


    
    PIL: 



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_11_5.png)
    


    
    PIL: 



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_11_7.png)
    


    
    PIL: 



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_11_9.png)
    


    
    PIL: 



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_11_11.png)
    


**4.2.Imprimir el tipo de imagen, el tamaño y el tipo de dato**


```python
# Para todas las imágenes de un folder

dir_folder = "/gdrive/MyDrive/Basile_Keller_Shen_Practica1"
i = 0
for img in os.listdir(dir_folder):
    if (img.endswith(".tif" or ".raw" or ".tiff" or ".jpg")):
        i += 1
        img_ = PIL.Image.open("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/" + img)
        print("Imagen " + str(i))
        print('Nombre: ', img_.filename)
        print('Tamaño: ', img_.size)
        print('Tipo de dato: ', img_.format)
        print('Descripción del formato: ', img_.format_description)
        print("\n")
```

    Imagen 1
    Nombre:  /gdrive/MyDrive/Basile_Keller_Shen_Practica1/rxpie-rodilla.tif
    Tamaño:  (324, 447)
    Tipo de dato:  TIFF
    Descripción del formato:  Adobe TIFF
    
    
    Imagen 2
    Nombre:  /gdrive/MyDrive/Basile_Keller_Shen_Practica1/lake.tif
    Tamaño:  (512, 512)
    Tipo de dato:  TIFF
    Descripción del formato:  Adobe TIFF
    
    
    Imagen 3
    Nombre:  /gdrive/MyDrive/Basile_Keller_Shen_Practica1/peppers_color.tif
    Tamaño:  (512, 512)
    Tipo de dato:  TIFF
    Descripción del formato:  Adobe TIFF
    
    
    Imagen 4
    Nombre:  /gdrive/MyDrive/Basile_Keller_Shen_Practica1/cameraman.tif
    Tamaño:  (512, 512)
    Tipo de dato:  TIFF
    Descripción del formato:  Adobe TIFF
    
    
    Imagen 5
    Nombre:  /gdrive/MyDrive/Basile_Keller_Shen_Practica1/lena_color_512.tif
    Tamaño:  (512, 512)
    Tipo de dato:  TIFF
    Descripción del formato:  Adobe TIFF
    
    
    Imagen 6
    Nombre:  /gdrive/MyDrive/Basile_Keller_Shen_Practica1/house.tif
    Tamaño:  (512, 512)
    Tipo de dato:  TIFF
    Descripción del formato:  Adobe TIFF
    
    


**4.3.De las imágenes “lena_color_512.tif”, “peppers_color.tif”. Desarrolla un script con OpenCV y Scikit-Image para cambiar el espacio de color de:**

*4.3.1. RGB a Escala de grises*


```python
# OpenCV y Scikit-Image


def RGBaEscalaGrises(url, paquete):
    
    if paquete == 1:
        img = cv2.imread(url)
        img_escalaGrises = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        cv2.imshow('Escala de Grises', img_escalaGrises)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    if paquete == 2:
        img = skimage.io.imread(url)
        img_escalaGrises = rgb2gray(img)
        io.imshow(img_escalaGrises) #visualizador por default
        io.show()


RGBaEscalaGrises("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/lena_color_512.tif", 2)
RGBaEscalaGrises("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/peppers_color.tif", 2)

```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_16_0.png)
    


    <ipython-input-8-9d43db87a072>:15: FutureWarning: The behavior of rgb2gray will change in scikit-image 0.19. Currently, rgb2gray allows 2D grayscale image to be passed as inputs and leaves them unmodified as outputs. Starting from version 0.19, 2D arrays will be treated as 1D images with 3 channels.
      img_escalaGrises = rgb2gray(img)



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_16_2.png)
    


*4.3.2. RGB a YUV*


```python
# OpenCV y Scikit-Image

# YUV -> Es un sistema de señal de video que la separa en dos componentes: luminancia (Y) y crominancia (UV). De esta manera hace que los errores de transmisión o las imperfecciones de compresión se oculten más eficientemente a la percepción humana. (https://es.wikipedia.org/wiki/YUV)

def RGBaYUV(url, paquete):
    
    if paquete == 1:
        img = cv2.imread(url)
        img_YUV = cv2.cvtColor(img, cv2.COLOR_RGB2YUV)
        cv2.imshow('YUV', img_YUV)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    if paquete == 2:
        img = skimage.io.imread(url)
        img_YUV = rgb2yuv(img)
        io.imshow(img_YUV) #visualizador por default
        io.show()


RGBaYUV("/gdrive/MyDrive/Basile_Keller_Shen_Practica1//lena_color_512.tif", 2)
RGBaYUV("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/peppers_BW.jpg", 2)
```

    WARNING:matplotlib.image:Clipping input data to the valid range for imshow with RGB data ([0..1] for floats or [0..255] for integers).



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_18_1.png)
    


    WARNING:matplotlib.image:Clipping input data to the valid range for imshow with RGB data ([0..1] for floats or [0..255] for integers).



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_18_3.png)
    


*4.3.3.RGB a HSV*


```python
# OpenCV y Scikit-Image

# HSV -> El modelo HSV (del inglés Hue, Saturation, Value – Matiz, Saturación, Valor) (https://es.wikipedia.org/wiki/Modelo_de_color_HSV)

def RGBaYUV(url, paquete):
    
    if paquete == 1:
        img = cv2.imread(url)
        img_hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
        cv2.imshow('HSV', img_hsv)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    if paquete == 2:
        img = skimage.io.imread(url)
        img_hsv = rgb2hsv(img)
        io.imshow(img_hsv) #visualizador por default
        io.show()


RGBaYUV("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/lena_color_512.tif", 2)
RGBaYUV("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/peppers_BW.jpg", 2)
```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_20_0.png)
    


    /usr/local/lib/python3.8/dist-packages/skimage/io/_plugins/matplotlib_plugin.py:150: UserWarning: Low image data range; displaying image with stretched contrast.
      lo, hi, cmap = _get_display_range(image)



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_20_2.png)
    


*Script para convertir a Gray, YUV o HSV desde RGB:*


```python
# paquete: 1 = cv2, 2 = skimage
# formato: 1 = a gray, 2 = a YUV, 3 = a HSV
def RGBaGray_YUV_HSV(url, paquete, formato):
    
    if paquete == 1:
      if formato == 1:
        img = cv2.imread(url)
        img_escalaGrises = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        cv2.imshow('Escala de Grises', img_escalaGrises)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
      elif formato == 2:
        img = cv2.imread(url)
        img_YUV = cv2.cvtColor(img, cv2.COLOR_RGB2YUV)
        cv2.imshow('YUV', img_YUV)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
      elif formato == 3:
        img = cv2.imread(url)
        img_hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
        cv2.imshow('HSV', img_hsv)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        
    if paquete == 2:
      if formato == 1:
        img = skimage.io.imread(url)
        img_escalaGrises = rgb2gray(img)
        io.imshow(img_escalaGrises) #visualizador por default
        io.show()
      elif formato == 2:
        img = skimage.io.imread(url)
        img_YUV = rgb2yuv(img)
        io.imshow(img_YUV) #visualizador por default
        io.show()
      elif formato == 3:
        img = skimage.io.imread(url)
        img_hsv = rgb2hsv(img)
        io.imshow(img_hsv) #visualizador por default
        io.show()
        


RGBaGray_YUV_HSV("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/lena_color_512.tif", 2, 3)
```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_22_0.png)
    


**4.4. Despliega la paleta de colores de RGB por separado, la barra de la derecha con valores es la paleta de colores.**



```python
print("Imagen: ")
imagen = plt.imread('/gdrive/MyDrive/Basile_Keller_Shen_Practica1/lena_color_512.tif')
plt.imshow(imagen)
plt.show()

# gray
print("Imagen con paleta gray")
plt.imshow(rgb2gray(imagen), cmap="gray")
plt.colorbar()
plt.show()

# Paleta hsv
print("Imagen con paleta HSV")
plt.imshow(imagen, cmap="hsv")
plt.colorbar()
plt.show()

# paleta brg
print("Imagen con paleta BRG")
plt.imshow(imagen, cmap="brg")
plt.colorbar()
plt.show()


```

    Imagen: 



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_24_1.png)
    


    Imagen con paleta gray



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_24_3.png)
    


    Imagen con paleta HSV



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_24_5.png)
    


    Imagen con paleta BRG



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_24_7.png)
    


**4.5.De una imagen que usted escoja, dejarla en escala de grises y procure que sea igual en renglones y en columnas. Programe una función que realice decimación de una imagen, reduciendola a la mitad de su tamaño original. Y promediando en grupos de 4 pixeles. Pruebe con su imagen.**


```python

# Decimation -> Decimation is used to reduce the image resolution while maintaining the field of view. 
# A typical application is having live view of the lower resolution image to reduce camera bandwidth and increase framerate.
# On the moment you want to capture the image you will disable decimation and you will capture the image with its full resolution.
# (https://www.get-cameras.com/Pixel-Binning-and-Decimation-(pixel-skipping)-explained)


img = PIL.Image.open("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/lena_color_512.tif").convert("L")

width, height = img.size

if width > height:
    new_width = height
    new_height = height
else:
    new_width = width
    new_height = width

# Redimensionamos la imagen
img = img.resize((new_width, new_height))
display(img)
```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_26_0.png)
    



```python
# forma 1

def decimate_image(img): # acepta imágenes con width = height
    arr = np.array(img)
    width, height = arr.shape[0], arr.shape[1]

    # uint porque queremos enteros de 8 bits que representen un valor en la escala de grises del 0 al 255.
    # la imagen de salida tendrá la mitad del tamaño de la de entrada.
    arr_img_decimada = np.zeros((width // 2, height // 2), dtype=np.uint8) 

    # Recorremos la imagen original y promediamos los valores de cada grupo de 4 píxeles
    for i in range(0, width-1):
        for j in range(0, height-1):
            suma_px = arr[i, j] + arr[i, j+1] + arr[i+1, j] + arr[i+1, j+1]
            nuevo_px = suma_px // 4
            arr_img_decimada[i//2, j//2] = nuevo_px


    # Convertimos el arreglo en una imagen PIL
    new_img = Image.fromarray(arr_img_decimada)

    return new_img



# forma 2

def decimate_image2(img):
  width, height = img.size
  dim = (width//2, height//2)
  # ocupamos resize para hacer una imagen que tenga como tamaño la mitad de la original y que ocupe interpolación para obtener el valor de cada pixel. 
  dec_img = cv2.resize(np.array(img), dim, interpolation=cv2.INTER_AREA)

  cv2.imshow('Imagen con decimación', dec_img)
  cv2.waitKey(0)
  cv2.destroyAllWindows()




```


```python

decimate_image(img)
#decimate_image2(img)
```

    <ipython-input-72-da133de7c6e5>:14: RuntimeWarning: overflow encountered in ubyte_scalars
      suma_px = arr[i, j] + arr[i, j+1] + arr[i+1, j] + arr[i+1, j+1]





    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_28_1.png)
    



**4.6.Convierte la imagen peppers_color.tif a escala de grises**

*4.6.1.Recortela de manera que solo quede uno de los pimientos verdes en ese recorte
4.6.2.Guárdela en formato .jpg.*


```python
from PIL import Image

imagen = PIL.Image.open("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/peppers_color.tif")
display(imagen)

imagen_grey = imagen.convert("L")

# Definir las coordenadas del recorte
left = 170
top = 180
right = 430
bottom = 490

# Recortar la imagen
imagen_recortada = imagen_grey.crop((left, top, right, bottom))
display(imagen_recortada)

imagen_recortada.save('pimientoGray.jpg')
```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_30_0.png)
    



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_30_1.png)
    


**4.7.Un formato de imágenes sin ningún tipo de codificación se conoce como formato crudo (RAW). De la imagen “rosa800x600.raw” lea y despliegue la imagen. Tome en cuenta que esta imagen maneja la precisión de integer8 y el tamaño es de 600x800 pixeles.**


```python
# USANDO PIL


path = '/gdrive/MyDrive/Basile_Keller_Shen_Practica1/rosa800x600.raw'
width = 600
height = 800

# 'rb' para leer binario, ya que raw generalmente implica lectura de un archivo binario.
# Cada pixel se representa por un byte o una serie de bytes

with open(path, 'rb') as archivo_raw:
    raw = archivo_raw.read()
img = Image.frombytes('L',(width, height), raw) # Utilizamos la L para imágenes blanco y negro, asumiendo que la imagen raw está en formato grayscale.

img.show()


```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_32_0.png)
    



```python
# Parte B Iris Setosa

# 5.1.Cargue los datos iris en un data frame (pandas) e imprima la descripción de los datos (columnas y
# renglones), tipo y las 10 primeras filas de los datos. Fuente de datos:
# https://archive.ics.uci.edu/ml/datasets/Iris.
# 5.2.Imprima las llaves y el número de filas y de columnas.
# 5.3.Obtenga el número de muestras faltantes o Nan.
# 5.4.Cree un arreglo 2-D de tamaño 5x5 con unos en la diagonal y ceros en el resto. Convierta el arreglo NumPy
# a una matriz dispersa de ScyPy en formato CRS. Nota: una matriz se considera dispersa cuando el
# porcentaje de ceros es mayor a 0.5.
# 5.5.Muestre estadísticas básicas como percentil, media, mínimo, máximo y desviación estándar de los datos.
# Use describe para ello. Imprima sólo la media y la desviación estándar.
# 5.6.Obtenga el número de muestras para cada clase.
# 5.7.Añada un encabezado a los datos usando los nombres en iris.names y repita el ejercicio anterior. LAS HICE SIN QUIERER
# 5.8.Imprima las diez primeras filas y las dos primeras columnas del data frame usando los índices de las
# columnas.
# VISUALIZACION: Utilizando matplotlib y/o seaborn
# 5.9.Cree una gráfica de barras que muestre la media, mínimo y máximo de todos los datos.
# 5.10. Muestre la frecuencia de las tres especies como una gráfica de pastel.
# 5.11. Cree una gráfica que muestre la relación entre la longitud y ancho del sépalo de las tres especies
# conjuntamente.
# 5.12. Obtenga los histogramas de las variables SepalLength, SepalWidth, PetalLength y PetalWidth.
# 5.13. Cree gráficas de dispersión usando pairplot de seaborn y muestre con distintos colores las tres
# especies en las gráficas de dispersión.
# 5.14. Cree una gráfica usando joinplot de seaborn para mostrar la dispersión entre la longitud y ancho
# del sépalo y las distribuciones de estas dos variables.
# 5.15. Repita el ejercicio anterior, pero esta vez usando joinplot con kind="hex".f
```

##**5. Ejercicios Parte B: Iris Setosa**

**5.1.Cargue los datos iris en un data frame (pandas) e imprima la descripción de los datos (columnas y renglones), tipo y las 10 primeras filas de los datos. Fuente de datos: https://archive.ics.uci.edu/ml/datasets/Iris.**


```python
# Leer el archivo iris.data.  
print("\nDatos iris en un data frame: \n")
datos = pd.read_csv("/gdrive/MyDrive/Basile_Keller_Shen_Practica1/iris.data", header=None )
datos
```

    
    Datos iris en un data frame: 
    






  <div id="df-bbbb63c2-503f-4140-8f5f-86c101190bea">
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
      <th>0</th>
      <th>1</th>
      <th>2</th>
      <th>3</th>
      <th>4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>5.1</td>
      <td>3.5</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>1</th>
      <td>4.9</td>
      <td>3.0</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>2</th>
      <td>4.7</td>
      <td>3.2</td>
      <td>1.3</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4.6</td>
      <td>3.1</td>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5.0</td>
      <td>3.6</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>145</th>
      <td>6.7</td>
      <td>3.0</td>
      <td>5.2</td>
      <td>2.3</td>
      <td>Iris-virginica</td>
    </tr>
    <tr>
      <th>146</th>
      <td>6.3</td>
      <td>2.5</td>
      <td>5.0</td>
      <td>1.9</td>
      <td>Iris-virginica</td>
    </tr>
    <tr>
      <th>147</th>
      <td>6.5</td>
      <td>3.0</td>
      <td>5.2</td>
      <td>2.0</td>
      <td>Iris-virginica</td>
    </tr>
    <tr>
      <th>148</th>
      <td>6.2</td>
      <td>3.4</td>
      <td>5.4</td>
      <td>2.3</td>
      <td>Iris-virginica</td>
    </tr>
    <tr>
      <th>149</th>
      <td>5.9</td>
      <td>3.0</td>
      <td>5.1</td>
      <td>1.8</td>
      <td>Iris-virginica</td>
    </tr>
  </tbody>
</table>
<p>150 rows × 5 columns</p>
</div>
      <button class="colab-df-convert" onclick="convertToInteractive('df-bbbb63c2-503f-4140-8f5f-86c101190bea')"
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
          document.querySelector('#df-bbbb63c2-503f-4140-8f5f-86c101190bea button.colab-df-convert');
        buttonEl.style.display =
          google.colab.kernel.accessAllowed ? 'block' : 'none';

        async function convertToInteractive(key) {
          const element = document.querySelector('#df-bbbb63c2-503f-4140-8f5f-86c101190bea');
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
# Descripción 
print("\nDescripción de los datos (columnas y renglones) \n")
print(datos.describe())
print("\n\n\n")
print(datos.info())


```

    
    Descripción de los datos (columnas y renglones) 
    
                    0           1           2           3
    count  147.000000  150.000000  150.000000  149.000000
    mean     5.857823    3.054000    3.758667    1.196644
    std      0.828013    0.433594    1.764420    0.765331
    min      4.300000    2.000000    1.000000    0.100000
    25%      5.100000    2.800000    1.600000    0.300000
    50%      5.800000    3.000000    4.350000    1.300000
    75%      6.400000    3.300000    5.100000    1.800000
    max      7.900000    4.400000    6.900000    2.500000
    
    
    
    
    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 150 entries, 0 to 149
    Data columns (total 5 columns):
     #   Column  Non-Null Count  Dtype  
    ---  ------  --------------  -----  
     0   0       147 non-null    float64
     1   1       150 non-null    float64
     2   2       150 non-null    float64
     3   3       149 non-null    float64
     4   4       150 non-null    object 
    dtypes: float64(4), object(1)
    memory usage: 6.0+ KB
    None



```python
# Tipo de datos, registros no nulos, 
print("\nTipo: \n")
datos.dtypes
```

    
    Tipo: 
    





    0    float64
    1    float64
    2    float64
    3    float64
    4     object
    dtype: object




```python
# Primeros 10 registros
print("\nlas 10 primeras filas de los datos: \n")
datos.head(10)
```

    
    las 10 primeras filas de los datos: 
    






  <div id="df-4b7872d6-f98d-47f3-8d60-e5636253d4b0">
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
      <th>0</th>
      <th>1</th>
      <th>2</th>
      <th>3</th>
      <th>4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>5.1</td>
      <td>3.5</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>1</th>
      <td>4.9</td>
      <td>3.0</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>2</th>
      <td>4.7</td>
      <td>3.2</td>
      <td>1.3</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4.6</td>
      <td>3.1</td>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5.0</td>
      <td>3.6</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>5</th>
      <td>5.4</td>
      <td>3.9</td>
      <td>1.7</td>
      <td>0.4</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>6</th>
      <td>4.6</td>
      <td>3.4</td>
      <td>1.4</td>
      <td>0.3</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>7</th>
      <td>5.0</td>
      <td>3.4</td>
      <td>1.5</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>8</th>
      <td>4.4</td>
      <td>2.9</td>
      <td>1.4</td>
      <td>0.2</td>
      <td>Iris-setosa</td>
    </tr>
    <tr>
      <th>9</th>
      <td>4.9</td>
      <td>3.1</td>
      <td>1.5</td>
      <td>0.1</td>
      <td>Iris-setosa</td>
    </tr>
  </tbody>
</table>
</div>
      <button class="colab-df-convert" onclick="convertToInteractive('df-4b7872d6-f98d-47f3-8d60-e5636253d4b0')"
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
          document.querySelector('#df-4b7872d6-f98d-47f3-8d60-e5636253d4b0 button.colab-df-convert');
        buttonEl.style.display =
          google.colab.kernel.accessAllowed ? 'block' : 'none';

        async function convertToInteractive(key) {
          const element = document.querySelector('#df-4b7872d6-f98d-47f3-8d60-e5636253d4b0');
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




**5.2.Imprima las llaves y el número de filas y de columnas.**


```python
print("\nLlaves: ", datos.columns)
print("\nFilas: ", datos.shape[0])
print("\nColumnas: ", datos.shape[1]) 

```

    
    Llaves:  Int64Index([0, 1, 2, 3, 4], dtype='int64')
    
    Filas:  150
    
    Columnas:  5


**5.3.Obtenga el número de muestras faltantes o Nan.**


```python
print("\nNúmero de muestras faltantes:\n",datos.isnull().sum())
```

    
    Número de muestras faltantes:
     0    3
    1    0
    2    0
    3    1
    4    0
    dtype: int64


**5.4.Cree un arreglo 2-D de tamaño 5x5 con unos en la diagonal y ceros en el resto. Convierta el arreglo NumPy a una matriz dispersa de ScyPy en formato CRS. Nota: una matriz se considera dispersa cuando el porcentaje de ceros es mayor a 0.5.**


```python
arr = np.eye(5)
print("\nArreglo de 2D, 5x5, unos en la diagonal y ceros en el resto\n\n",arr)
sparse_arr = sp.csr_matrix(arr)
print("\nMatriz dispersa de ScyPy\n",sparse_arr)
```

    
    Arreglo de 2D, 5x5, unos en la diagonal y ceros en el resto
    
     [[1. 0. 0. 0. 0.]
     [0. 1. 0. 0. 0.]
     [0. 0. 1. 0. 0.]
     [0. 0. 0. 1. 0.]
     [0. 0. 0. 0. 1.]]
    
    Matriz dispersa de ScyPy
       (0, 0)	1.0
      (1, 1)	1.0
      (2, 2)	1.0
      (3, 3)	1.0
      (4, 4)	1.0


**5.5.Muestre estadísticas básicas como percentil, media, mínimo, máximo y desviación estándar de los datos. Use describe para ello. Imprima sólo la media y la desviación estándar.**


```python
print("\nEstadística básicas: sólo la media y la desviación estándar\n")
datos.describe().loc[['mean', 'std'], :]
```

    
    Estadística básicas: sólo la media y la desviación estándar
    






  <div id="df-2ee69b6a-1225-4fcb-ab9e-3ccdd944b6d3">
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
      <th>0</th>
      <th>1</th>
      <th>2</th>
      <th>3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>mean</th>
      <td>5.857823</td>
      <td>3.054000</td>
      <td>3.758667</td>
      <td>1.196644</td>
    </tr>
    <tr>
      <th>std</th>
      <td>0.828013</td>
      <td>0.433594</td>
      <td>1.764420</td>
      <td>0.765331</td>
    </tr>
  </tbody>
</table>
</div>
      <button class="colab-df-convert" onclick="convertToInteractive('df-2ee69b6a-1225-4fcb-ab9e-3ccdd944b6d3')"
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
          document.querySelector('#df-2ee69b6a-1225-4fcb-ab9e-3ccdd944b6d3 button.colab-df-convert');
        buttonEl.style.display =
          google.colab.kernel.accessAllowed ? 'block' : 'none';

        async function convertToInteractive(key) {
          const element = document.querySelector('#df-2ee69b6a-1225-4fcb-ab9e-3ccdd944b6d3');
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




**5.6.Obtenga el número de muestras para cada clase.**


```python
print("\nClases:\n", datos[4].value_counts())
```

    
    Clases:
     Iris-setosa        50
    Iris-versicolor    50
    Iris-virginica     50
    Name: 4, dtype: int64


**5.7.Añada un encabezado a los datos usando los nombres en iris.names y repita el ejercicio anterior.**


```python
# Leer el archivo iris.names para extraer la información de los datos
with open('/gdrive/MyDrive/Basile_Keller_Shen_Practica1/iris.names', 'r') as f:
    content = f.read()

# Extraer nombres de columnas del archivo .names
print(content)
```

    1. Title: Iris Plants Database
    	Updated Sept 21 by C.Blake - Added discrepency information
    
    2. Sources:
         (a) Creator: R.A. Fisher
         (b) Donor: Michael Marshall (MARSHALL%PLU@io.arc.nasa.gov)
         (c) Date: July, 1988
    
    3. Past Usage:
       - Publications: too many to mention!!!  Here are a few.
       1. Fisher,R.A. "The use of multiple measurements in taxonomic problems"
          Annual Eugenics, 7, Part II, 179-188 (1936); also in "Contributions
          to Mathematical Statistics" (John Wiley, NY, 1950).
       2. Duda,R.O., & Hart,P.E. (1973) Pattern Classification and Scene Analysis.
          (Q327.D83) John Wiley & Sons.  ISBN 0-471-22361-1.  See page 218.
       3. Dasarathy, B.V. (1980) "Nosing Around the Neighborhood: A New System
          Structure and Classification Rule for Recognition in Partially Exposed
          Environments".  IEEE Transactions on Pattern Analysis and Machine
          Intelligence, Vol. PAMI-2, No. 1, 67-71.
          -- Results:
             -- very low misclassification rates (0% for the setosa class)
       4. Gates, G.W. (1972) "The Reduced Nearest Neighbor Rule".  IEEE 
          Transactions on Information Theory, May 1972, 431-433.
          -- Results:
             -- very low misclassification rates again
       5. See also: 1988 MLC Proceedings, 54-64.  Cheeseman et al's AUTOCLASS II
          conceptual clustering system finds 3 classes in the data.
    
    4. Relevant Information:
       --- This is perhaps the best known database to be found in the pattern
           recognition literature.  Fisher's paper is a classic in the field
           and is referenced frequently to this day.  (See Duda & Hart, for
           example.)  The data set contains 3 classes of 50 instances each,
           where each class refers to a type of iris plant.  One class is
           linearly separable from the other 2; the latter are NOT linearly
           separable from each other.
       --- Predicted attribute: class of iris plant.
       --- This is an exceedingly simple domain.
       --- This data differs from the data presented in Fishers article
    	(identified by Steve Chadwick,  spchadwick@espeedaz.net )
    	The 35th sample should be: 4.9,3.1,1.5,0.2,"Iris-setosa"
    	where the error is in the fourth feature.
    	The 38th sample: 4.9,3.6,1.4,0.1,"Iris-setosa"
    	where the errors are in the second and third features.  
    
    5. Number of Instances: 150 (50 in each of three classes)
    
    6. Number of Attributes: 4 numeric, predictive attributes and the class
    
    7. Attribute Information:
       1. sepal length in cm
       2. sepal width in cm
       3. petal length in cm
       4. petal width in cm
       5. class: 
          -- Iris Setosa
          -- Iris Versicolour
          -- Iris Virginica
    
    8. Missing Attribute Values: None
    
    Summary Statistics:
    	         Min  Max   Mean    SD   Class Correlation
       sepal length: 4.3  7.9   5.84  0.83    0.7826   
        sepal width: 2.0  4.4   3.05  0.43   -0.4194
       petal length: 1.0  6.9   3.76  1.76    0.9490  (high!)
        petal width: 0.1  2.5   1.20  0.76    0.9565  (high!)
    
    9. Class Distribution: 33.3% for each of 3 classes.
    



```python
datos.columns=['sepal length in cm', 'sepal width in cm', 'petal length in cm', 'petal width in cm', 'class']
print("\nClases:\n", datos["class"].value_counts())
```

    
    Clases:
     Iris-setosa        50
    Iris-versicolor    50
    Iris-virginica     50
    Name: class, dtype: int64


**5.8.Imprima las diez primeras filas y las dos primeras columnas del data frame usando los índices de las columnas.**




```python
print("\nDatos: \n", datos.iloc[:10, :2])
```

    
    Datos: 
        sepal length in cm  sepal width in cm
    0                 5.1                3.5
    1                 4.9                3.0
    2                 4.7                3.2
    3                 4.6                3.1
    4                 5.0                3.6
    5                 5.4                3.9
    6                 4.6                3.4
    7                 5.0                3.4
    8                 4.4                2.9
    9                 4.9                3.1


### **VISUALIZACION: Utilizando matplotlib y/o seaborn**

**5.9.Cree una gráfica de barras que muestre la media, mínimo y máximo de todos los datos.**


```python

valores = datos.describe().loc[['mean', 'min', 'max'], :]
x = valores.columns.tolist()
y = valores.iloc[0].tolist() #mean
y2 = valores.iloc[1].tolist() #min
y3 = valores.iloc[2].tolist() #max

# Establecer el ancho de las barras
bar_width = 0.25

# Calcular el centro de cada barra
x1 = np.arange(len(x))
x2 = [i + bar_width for i in x1]
x3 = [i + bar_width*2 for i in x1]

# Crear una figura y un eje
fig, ax = plt.subplots(figsize=(10, 4))

# Crear una gráfica de barras
# Crear la primera serie de barras
ax.bar(x1, y, bar_width, color='b', alpha=0.5, label='Media')

# Crear la segunda serie de barras
ax.bar(x2, y2, bar_width, color='r', alpha=0.5, label='Mínimo')

# Crear la tercera serie de barras
ax.bar(x3, y3, bar_width, color='g', alpha=0.5, label='Máximo')

# Agregar la leyenda
ax.legend()


# Establecer etiquetas y títulos
ax.set_xlabel('Variables')
ax.set_ylabel('Valor')
ax.set_title('Iris')

ax.set_xticks(x2)
ax.set_xticklabels(x)

# Mostrar la gráfica
plt.show()
```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_57_0.png)
    


**5.10. Muestre la frecuencia de las tres especies como una gráfica de pastel.**


```python
# Crear la gráfica de pastel
datos['class'].value_counts().plot.pie(autopct='%1.1f%%', startangle=90)

# Agregar título
plt.title('Gráfica de pastel')

# Mostrar la gráfica
plt.show()

```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_59_0.png)
    


**5.11. Cree una gráfica que muestre la relación entre la longitud y ancho del sépalo de las tres especies conjuntamente.**


```python
print("\nRelación entre la longitud y ancho\n")

# Obtener los valores unicos de la columna class
valores_unicos = datos["class"].unique()

relacion=[]
for v in valores_unicos:
  resultado = (datos.loc[datos["class"] == v, "sepal length in cm"].sum()) / (datos.loc[datos["class"] == v, "sepal width in cm"].sum())
  relacion.append(resultado)
print(relacion)
plt.bar(valores_unicos, relacion)
plt.show()


```

    
    Relación entre la longitud y ancho
    
    [1.3744880046811, 2.142960288808664, 2.215198386012104]



    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_61_1.png)
    


**5.12. Obtenga los histogramas de las variables SepalLength, SepalWidth, PetalLength y PetalWidth.**


```python
datos.hist(figsize=(10,10), xrot=45)
plt.show()
```


    
![png](Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_files/Basile_Keller_Shen_Pr%C3%A1ctica1%282%29_63_0.png)
    


**5.13. Cree gráficas de dispersión usando pairplot de seaborn y muestre con distintos colores las tres especies en las gráficas de dispersión.**


```python
sns.pairplot(datos, hue="class")
```




    <seaborn.axisgrid.PairGrid at 0x7f25e5fe9cd0>




**5.14. Cree una gráfica usando joinplot de seaborn para mostrar la dispersión entre la longitud y ancho del sépalo y las distribuciones de estas dos variables.**


```python
sns.jointplot(x="sepal length in cm", y="sepal width in cm", data=datos)
```




    <seaborn.axisgrid.JointGrid at 0x7f25e632b760>




**5.15. Repita el ejercicio anterior, pero esta vez usando joinplot con kind="hex".** 


```python
sns.jointplot(x="sepal length in cm", y="sepal width in cm", data=datos, kind="hex")
```




    <seaborn.axisgrid.JointGrid at 0x7f25e5d48be0>



