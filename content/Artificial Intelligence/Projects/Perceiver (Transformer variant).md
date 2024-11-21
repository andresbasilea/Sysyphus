
> [!danger] Attempt to build a Perceiver
> This was my attempt to build a Perceiver. A Perceiver is a variant of the Transformer architecture, adapted for processing arbitrary forms of data, such as images, sounds and video, and spatial data. Unlike previous notable Transformer systems such as BERT and GPT-3, which were designed for text processing, the Perceiver is designed as a general architecture that can learn from large amounts of heterogeneous data. It accomplishes this with an asymmetric attention mechanism to distill inputs into a latent bottleneck.
> Perceiver matches or outperforms specialized models on classification tasks. [Wikipedia](https://en.wikipedia.org/wiki/Perceiver)

>[!failure] Could not recreate the Perceiver Architecture
>Attempting to recreate the Perceiver has been one of the hardest projects I have ever done. This is my attempt at it. I will come back to this project sometime.


```python

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' # Disable tensorflow debugging logs
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.layers import TextVectorization
import numpy as np
import os
import re
import string
import random
import time
```

## 1.- Dataset


```python
import pathlib

path_to_zip = tf.keras.utils.get_file(
    'spa-eng.zip', origin='http://storage.googleapis.com/download.tensorflow.org/data/spa-eng.zip',
    extract=True)
path_to_file = pathlib.Path(path_to_zip).parent/'spa-eng/spa.txt'

with open(path_to_file) as f:
    lines = f.read().split("\n")[:-1]
    
text_pairs = []
for line in lines:
    eng, spa = line.lower().split("\t")
    text_pairs.append((eng, spa + ' [END]'))
```

    Downloading data from http://storage.googleapis.com/download.tensorflow.org/data/spa-eng.zip
    2638744/2638744 [==============================] - 1s 0us/step



```python
random.Random(43).shuffle(text_pairs)
num_val_samples = int(0.005 * len(text_pairs))
num_train_samples = len(text_pairs) - num_val_samples
train_pairs = text_pairs[:num_train_samples]
val_pairs = text_pairs[num_train_samples:]

print(f"{len(text_pairs)} total pairs")
print(f"{len(train_pairs)} training pairs")
print(f"{len(val_pairs)} validation pairs")
```

    118964 total pairs
    118370 training pairs
    594 validation pairs



```python
for s in train_pairs[:5]:
    print(s)

print(max(train_pairs)) # Max 9 palabras
```

    ('the old woman fell and could not get up.', 'la anciana se cayó y no pudo levantarse. [END]')
    ('what is this the abbreviation for?', '¿de qué es abreviatura esto? [END]')
    ("you're not sick.", 'no estás enferma. [END]')
    ('i have no knife to cut with.', 'no tengo un cuchillo con que cortarlo. [END]')
    ('americans admire lincoln for his honesty.', 'los estadounidenses admiran a lincoln por su honestidad. [END]')
    ('zürich is considered to be a major financial hub.', 'zürich es considerada una metrópoli financiera. [END]')



```python

```

## 2.- Pipeline (17. Seq2Seq)


```python
strip_chars = string.punctuation + "¿"
strip_chars = strip_chars.replace("[", "")
strip_chars = strip_chars.replace("]", "")

vocab_size = 15000 #Tamaño de vocabulario
maxlen = 10
batch_size = 64

def custom_standardization(input_string):
    lowercase = tf.strings.lower(input_string)
    return tf.strings.regex_replace(lowercase, "[%s]" % re.escape(strip_chars), "")

eng_vectorization = TextVectorization(
    max_tokens=vocab_size, output_mode="int", 
    output_sequence_length=maxlen,
)
spa_vectorization = TextVectorization(
    max_tokens=vocab_size,
    output_mode="int",
    output_sequence_length=maxlen,
    standardize=custom_standardization,
)
train_eng_texts = [pair[0] for pair in train_pairs]
train_spa_texts = [pair[1] for pair in train_pairs]
eng_vectorization.adapt(train_eng_texts)
spa_vectorization.adapt(train_spa_texts)
```


```python
AUTOTUNE = tf.data.experimental.AUTOTUNE
```


```python
def preprocess(eng, spa):
    eng = eng_vectorization(eng)
    spa = spa_vectorization(spa)
    return tf.reverse(eng[:,:-1], [1]), spa[:, :-1], spa[:, 1:]
    # eng_spa = eng + spa
    # return tf.reverse(eng, [1]), spa[:, :-1], spa[:, 1:], eng_spa # Devuelve tensores (64,10), (64,9), (64,9)
    #return tf.reverse(eng, [1]), spa[:, :], spa[:, :]      # Devuelve tensores (64,10), (64,10), (64,10)


def make_dataset(pairs):
    eng_texts, spa_texts = zip(*pairs)
    eng_texts = list(eng_texts)
    spa_texts = list(spa_texts)
    dataset = tf.data.Dataset.from_tensor_slices((eng_texts, spa_texts))
    dataset = dataset.batch(batch_size)
    dataset = dataset.map(preprocess)
    return dataset.shuffle(2048).prefetch(AUTOTUNE).cache()


train_ds = make_dataset(train_pairs)
val_ds = make_dataset(val_pairs)
```


```python
for inp_enc, inp_dec, tar_dec in train_ds.take(1):
# for inp_enc, inp_dec, tar_dec, eng_spa in train_ds.take(1):
    print("inp_enc (Inglés): ", inp_enc[0]) 
    print("inp_dec (Español): ", inp_dec[0])
    print("tar_dec (Español): ", tar_dec[0])
    # print("eng_spa (Inglés-Español): ", eng_spa[0])
```

    inp_enc (Inglés):  tf.Tensor([   0    0    0    0    0    0 1308 2748  276], shape=(9,), dtype=int64)
    inp_dec (Español):  tf.Tensor([746  14   1   2   0   0   0   0   0], shape=(9,), dtype=int64)
    tar_dec (Español):  tf.Tensor([14  1  2  0  0  0  0  0  0], shape=(9,), dtype=int64)



```python
for inp_enc, inp_dec, tar_dec in train_ds:
  inp_enc_dec = tf.concat([inp_enc, inp_dec], axis=-1)
  break
```


```python

```

## 3.- Modelo


```python
class CrossAttention(layers.Layer):
    def __init__(self, model_dim, n_heads, rate=0.1, initializer='glorot_uniform'):
        super(CrossAttention, self).__init__()
        self.n_heads = n_heads
        self.model_dim = model_dim

        assert model_dim % self.n_heads == 0

        self.head_dim = model_dim // self.n_heads

        self.wq = layers.Dense(model_dim, kernel_initializer=initializer)
        self.wk = layers.Dense(model_dim, kernel_initializer=initializer)
        self.wv = layers.Dense(model_dim, kernel_initializer=initializer)
        
        self.dropout1 = layers.Dropout(rate)
        self.dropout2 = layers.Dropout(rate)
        
        self.wo = layers.Dense(model_dim, kernel_initializer=initializer)

    def split_heads(self, x, batch_size):
        x = tf.reshape(x, (batch_size, -1, self.n_heads, self.head_dim))
        return tf.transpose(x, perm=[0, 2, 1, 3])

    def call(self, q, k, v, mask=None):
        batch_size = tf.shape(q)[0]

        q = self.wq(q)  
        k = self.wk(k)  
        v = self.wv(v)
        #print("v.shape", v.shape)  
        #v.shape (64, 18, 64)


        q = self.split_heads(q, batch_size) 
        k = self.split_heads(k, batch_size)  
        v = self.split_heads(v, batch_size) 
        #print("v.shape",v.shape)
        #v.shape (64, 4, 18, 16)

        dh = tf.cast(self.head_dim, tf.float32)
        qk = tf.matmul(k,q, transpose_b=True)
        scaled_qk =  qk / tf.math.sqrt(dh)
        
        if mask is not None:
            scaled_qk += (mask * -1e9) # mask (64,1,18,9)

        #print("scaled_qk.shape", scaled_qk.shape) # scaled_qk.shape (64, 4, 18, 9)

        attn = self.dropout1(tf.nn.softmax(scaled_qk, axis=-1))
        attn = tf.transpose(attn, perm=[0, 1, 3, 2]) 
        attn = tf.matmul(attn,v) #Matrix size-incompatible: In[0]: [64,4,18,9], In[1]: [64,4,18,16] [Op:BatchMatMulV2]

        attn = tf.transpose(attn, perm=[0, 2, 1, 3]) 
        original_size_attention = tf.reshape(attn, (batch_size, -1, self.model_dim)) 

        output = self.dropout2(self.wo(original_size_attention))
        return output
```


```python
class CrossTransformerBlock(layers.Layer):
    def __init__(self, emb_dim, n_heads=4, mlp_dim=256, 
                 rate=0.1, initializer='glorot_uniform', eps=1e-6, activation='gelu'):
        super(CrossTransformerBlock, self).__init__()
        self.attn = CrossAttention(emb_dim, n_heads, initializer=initializer)
        self.mlp = tf.keras.Sequential([
            layers.Dense(mlp_dim, activation=activation, kernel_initializer=initializer), 
            layers.Dense(emb_dim, kernel_initializer=initializer),
            layers.Dropout(rate)
        ])
        self.ln1 = layers.LayerNormalization(epsilon=eps)
        self.ln2 = layers.LayerNormalization(epsilon=eps)
        self.ln3 = layers.LayerNormalization(epsilon=eps)

    def call(self, inp_enc, inp_enc_dec, mask=None):
        x = self.ln1(inp_enc)
        #print("y inside cross transformer before layer normalization shape", inp_enc_dec.shape)
        y = self.ln2(inp_enc_dec)
        #print("y inside cross transformer (inp_enc_dec) after layer normalization shape", y.shape)
        x_qkv = inp_enc + self.attn(x, y, y, mask) 
        x_qkv = x_qkv + self.mlp(self.ln3(x_qkv))
        return x_qkv
    
    
# emb_dim = 128
# test_layer = CrossTransformerBlock(emb_dim)
# test_layer(tf.ones([1, maxlen, emb_dim])).shape
```


```python
class MultiHeadAttention(layers.Layer):
    def __init__(self, model_dim, n_heads, rate=0.1, initializer='glorot_uniform'):
        super(MultiHeadAttention, self).__init__()
        self.n_heads = n_heads
        self.model_dim = model_dim

        assert model_dim % self.n_heads == 0

        self.head_dim = model_dim // self.n_heads

        self.wq = layers.Dense(model_dim, kernel_initializer=initializer)
        self.wk = layers.Dense(model_dim, kernel_initializer=initializer)
        self.wv = layers.Dense(model_dim, kernel_initializer=initializer)
        
        self.dropout1 = layers.Dropout(rate)
        self.dropout2 = layers.Dropout(rate)
        
        self.wo = layers.Dense(model_dim, kernel_initializer=initializer)

    def split_heads(self, x, batch_size):
        x = tf.reshape(x, (batch_size, -1, self.n_heads, self.head_dim))
        return tf.transpose(x, perm=[0, 2, 1, 3])

    def call(self, q, k, v, mask=None):
        batch_size = tf.shape(q)[0]

        q = self.wq(q)  
        k = self.wk(k)  
        v = self.wv(v)  

        q = self.split_heads(q, batch_size) 
        k = self.split_heads(k, batch_size)  
        v = self.split_heads(v, batch_size) 

        dh = tf.cast(self.head_dim, tf.float32)
        qk = tf.matmul(q, k, transpose_b=True)
        scaled_qk =  qk / tf.math.sqrt(dh)
        
        if mask is not None:
            scaled_qk += (mask * -1e9) 

        attn = self.dropout1(tf.nn.softmax(scaled_qk, axis=-1))
        attn = tf.matmul(attn, v) 

        attn = tf.transpose(attn, perm=[0, 2, 1, 3]) 
        original_size_attention = tf.reshape(attn, (batch_size, -1, self.model_dim)) 

        output = self.dropout2(self.wo(original_size_attention))
        return output
```


```python
class TransformerBlock(layers.Layer):
    def __init__(self, emb_dim, n_heads=4, mlp_dim=256, 
                 rate=0.1, initializer='glorot_uniform', eps=1e-6, activation='gelu'):
        super(TransformerBlock, self).__init__()
        self.attn = MultiHeadAttention(emb_dim, n_heads, initializer=initializer)
        self.mlp = tf.keras.Sequential([
            layers.Dense(mlp_dim, activation=activation, kernel_initializer=initializer), 
            layers.Dense(emb_dim, kernel_initializer=initializer),
            layers.Dropout(rate)
        ])
        self.ln1 = layers.LayerNormalization(epsilon=eps)
        self.ln2 = layers.LayerNormalization(epsilon=eps)

    def call(self, inputs, mask=None):
        x = self.ln1(inputs)
        x = inputs + self.attn(x, x, x, mask) 
        x = x + self.mlp(self.ln2(x))
        return x
    
    
# emb_dim = 128
# test_layer = TransformerBlock(emb_dim)
# test_layer(tf.ones([1, maxlen, emb_dim])).shape
```


```python
class TokenEmbedding(layers.Layer):
    def __init__(self, maxlen, vocab_size, emb_dim, 
                 rate=0.1, initializer='glorot_uniform'):
        super(TokenEmbedding, self).__init__()
        self.max_len = maxlen
        self.token_emb = layers.Embedding(
            input_dim=vocab_size, output_dim=emb_dim, 
            embeddings_initializer=initializer)
        self.position_emb = layers.Embedding(
            input_dim=maxlen, output_dim=emb_dim, 
            embeddings_initializer=initializer)
        self.dropout = layers.Dropout(rate)

    def call(self, x):
        token_embeddings = self.token_emb(x)
        positions = tf.range(start=0, limit=self.max_len-1, delta=1)
        positions = self.position_emb(positions)
        return self.dropout(token_embeddings + positions) 
```


```python
class CrossTokenEmbedding(layers.Layer):
    def __init__(self, maxlen, vocab_size, emb_dim, 
                 rate=0.1, initializer='glorot_uniform'):
        super(CrossTokenEmbedding, self).__init__()
        self.max_len = maxlen
        self.token_emb = layers.Embedding(
            input_dim=vocab_size, output_dim=emb_dim, 
            embeddings_initializer=initializer)
        self.position_emb = layers.Embedding(
            input_dim=2*maxlen, output_dim=emb_dim, 
            embeddings_initializer=initializer)
        self.dropout = layers.Dropout(rate)

    def call(self, x):
        token_embeddings = self.token_emb(x)
        positions = tf.range(start=0, limit=tf.shape(x)[1], delta=1)
        #print(positions)
        positions = self.position_emb(positions)
        #print(positions)
        return self.dropout(token_embeddings + positions) 
```


```python
class GPT(tf.keras.models.Model):
    def __init__(self, vocab_size=15000, maxlen=10, 
                 emb_dim=64, heads=4, mlp_dim=256, depth=3, 
                 rate=0.2, initializer='glorot_uniform', 
                 embedding_initializer='glorot_uniform', eps=1e-6,
                 mlp_activation='gelu'):
        super(GPT, self).__init__()
        self.depth = depth
        self.tok_emb = TokenEmbedding(maxlen, vocab_size, 
                        emb_dim, rate=rate, initializer=embedding_initializer)
        self.cross_tok_emb = CrossTokenEmbedding(maxlen, vocab_size, 
                        emb_dim, rate=rate, initializer=embedding_initializer)
        self.drop = layers.Dropout(rate)
            
        self.transformer = [TransformerBlock(emb_dim, 
                                heads, mlp_dim, rate=rate,
                                initializer=initializer, eps=eps, 
                                activation=mlp_activation)
                            for _ in range(depth)]

        self.crossTransformer = [CrossTransformerBlock(emb_dim, 
                                heads, mlp_dim, rate=rate,
                                initializer=initializer, eps=eps, 
                                activation=mlp_activation)
                            for _ in range(depth)]

        self.layernorm = layers.LayerNormalization(epsilon=eps)
        self.out = layers.Dense(vocab_size, kernel_initializer=initializer)
        
    def get_padding_mask(self, seq):
        seq = tf.cast(tf.math.equal(seq, 0), tf.float32)
        # add extra dimensions to add the padding
        # to the attention logits.
        return seq[:, tf.newaxis, tf.newaxis, :]  # (batch_size, 1, 1, seq_len)

    def get_attention_mask(self, size):
        mask = 1 - tf.linalg.band_part(tf.ones((size, size)), -1, 0)
        return mask  # (seq_len, seq_len)
    
    def create_mask(self, x):
        attn_mask = self.get_attention_mask(tf.shape(x)[1])
        #print("############## att",attn_mask)
        padding_mask = self.get_padding_mask(x)
        #print("############## padd",padding_mask)
        attn_mask = tf.maximum(padding_mask, attn_mask)
        #print("############## max att padd",attn_mask)
        return attn_mask


    def get_padding_mask_cross(self,seq):
        seq = tf.cast(tf.math.equal(seq, 0), tf.float32)
        return seq[:, tf.newaxis, tf.newaxis, :]  # (batch_size, 1, 1, seq_len)

    def get_attention_mask_cross(self,size, size2):
        mask = 1 - tf.linalg.band_part(tf.ones((size2, size)), -1, 0)
        return mask  # (seq_len, seq_len)

    def create_mask_cross(self,x,k):
        seq_len = tf.shape(x)[1]
        seq_len2 = tf.shape(k)[1]
        attn_mask = self.get_attention_mask_cross(seq_len, seq_len2)
        #print("############## cross att",attn_mask.shape)
        padding_mask = self.get_padding_mask_cross(x)
        #print("############## cross padd",padding_mask.shape)
        attn_mask = tf.maximum(padding_mask, attn_mask)
        #print("############## cross max att padd",attn_mask.shape)
        return attn_mask

    def call(self, x, y):

        #print(x)

        #print(x.shape, y.shape)
        mask = self.create_mask(x)
        mask_cross = self.create_mask_cross(x,y)
        print(mask_cross[0])
        x = self.cross_tok_emb(x)
        y = self.cross_tok_emb(y)

        # x = self.tok_emb(x)
        x = self.drop(x)
        y = self.drop(y)

        for i in range(self.depth):
            x = self.crossTransformer[i](x, y, mask_cross)

        #print("salida cross attention: ",x.shape)
        for i in range(self.depth):
            y = self.transformer[i](x, mask)

        y = self.layernorm(y)
        y = self.out(y)
        return y
       
        
emb_dim = 64
depth = 3
mlp_dim = 256

gpt = GPT(maxlen=maxlen, vocab_size=vocab_size, emb_dim=emb_dim,
            mlp_dim=mlp_dim, depth=depth)
out = gpt(inp_dec, inp_enc_dec )
out.shape
```

    tf.Tensor(
    [[[0. 1. 1. 1. 1. 1. 1. 1. 1.]
      [0. 0. 1. 1. 1. 1. 1. 1. 1.]
      [0. 0. 0. 1. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]
      [0. 0. 0. 0. 1. 1. 1. 1. 1.]]], shape=(1, 18, 9), dtype=float32)





    TensorShape([64, 9, 15000])




```python
gpt.summary()
```

    Model: "gpt"
    _________________________________________________________________
     Layer (type)                Output Shape              Param #   
    =================================================================
     token_embedding (TokenEmbed  multiple                 0 (unused)
     ding)                                                           
                                                                     
     cross_token_embedding (Cros  multiple                 961280    
     sTokenEmbedding)                                                
                                                                     
     dropout_2 (Dropout)         multiple                  0         
                                                                     
     transformer_block (Transfor  multiple                 49984     
     merBlock)                                                       
                                                                     
     transformer_block_1 (Transf  multiple                 49984     
     ormerBlock)                                                     
                                                                     
     transformer_block_2 (Transf  multiple                 49984     
     ormerBlock)                                                     
                                                                     
     cross_transformer_block (Cr  multiple                 50112     
     ossTransformerBlock)                                            
                                                                     
     cross_transformer_block_1 (  multiple                 50112     
     CrossTransformerBlock)                                          
                                                                     
     cross_transformer_block_2 (  multiple                 50112     
     CrossTransformerBlock)                                          
                                                                     
     layer_normalization_15 (Lay  multiple                 128       
     erNormalization)                                                
                                                                     
     dense_36 (Dense)            multiple                  975000    
                                                                     
    =================================================================
    Total params: 2,236,696
    Trainable params: 2,236,696
    Non-trainable params: 0
    _________________________________________________________________



```python

```

## 4.- Training


```python
from tensorflow.keras.preprocessing.sequence import pad_sequences
```


```python
text_to_ids_eng = tf.keras.layers.StringLookup(
                vocabulary=eng_vectorization.get_vocabulary(),
                mask_token='')

text_to_ids_spa = tf.keras.layers.StringLookup(
                vocabulary=spa_vectorization.get_vocabulary(),
                mask_token='')

```


```python
ids_to_text_eng = tf.keras.layers.StringLookup(
                vocabulary=eng_vectorization.get_vocabulary(),
                mask_token='',
                invert=True)

ids_to_text_spa = tf.keras.layers.StringLookup(
                vocabulary=spa_vectorization.get_vocabulary(),
                mask_token='',
                invert=True)
```


```python

```


```python
# context = ['spanish sentence = Me gustan los perros rojos. english sentence = ',
#            'spanish sentence = Me encanta escribir. english sentence = ',
#            'spanish sentence = Los elefantes comen manzanas. english sentence = ']

context_eng = ['I love my dog', 'I love to sleep', 'The cat wants to eat']
context_spa = ['Amo a mi perro', 'Me encanta dormir', 'El gato quiere comer']

def sample(model, context_eng, context_spa, maxlen):
    words_eng = [context_eng.split()] 
    words_spa = [context_spa.split()] # add batch dim
    x = tf.cast(text_to_ids_eng(words_eng), tf.int32)
    y = tf.cast(text_to_ids_spa(words_spa), tf.int32)
    #print(x)
    #print(y)
    #
    # x = tf.tile(x, [64, 1])
    xy = tf.concat([x, y], axis=-1)
    #
    #print(x.shape[1])
    # Generate new text by sampling from the model
    for i in range(x.shape[1], maxlen):
        #print(i)
        # Pad the input sequence to seq_len
        x_pad = tf.keras.preprocessing.sequence.pad_sequences(x, maxlen=maxlen-1, padding="post")
        y_pad = tf.keras.preprocessing.sequence.pad_sequences(y, maxlen=maxlen-1, padding="post")
        xy_pad = tf.keras.preprocessing.sequence.pad_sequences(xy, maxlen=2*maxlen-2, padding="post")
        # print("xpad",x_pad)
        # print("ypad",y_pad)
        # print("xy",xy_pad, xy_pad.shape)

        # Generate logits from the model
        #print("x_pad", x_pad, x_pad.shape, "\n\n")
        logits = model(y_pad, xy_pad, training=False)
        #print(logits, logits.shape)
        #print(logits[:,i-1,:])
        pred_index = tf.argmax(logits[:, i-1, :], axis=-1, 
                               output_type=tf.dtypes.int32)
        pred_index = pred_index[tf.newaxis]
        if ids_to_text_spa(pred_index) == '[END]':
            break
        # Concatenate the new token to the sequence
        x = tf.concat([x, pred_index], axis=-1)

    str_list = ids_to_text_spa(x)[0].numpy()
    text = ' '.join([s.decode('utf-8') for s in str_list])
    return text

for c,d in zip(context_eng, context_spa):
    trans = sample(gpt, c,d, maxlen)
    print(f"{trans}")
```

    [UNK] vida su semana dulcemente vas doloroso echarán rodea esfuerzo
    [UNK] vida que dije concesionario eventos acuesta explicado rodea esfuerzo
    [UNK] fuerte hacerlo que tres vas doloroso explicado rodea esfuerzo



```python
optimizer = tf.keras.optimizers.Adam(0.001, beta_1=0.9, beta_2=0.999)
train_loss = tf.keras.metrics.Mean(name='train_loss')
```


```python
def loss_function(label, pred):
    mask = label != 0
    loss_object = tf.keras.losses.SparseCategoricalCrossentropy(
    from_logits=True, reduction='none')
    loss = loss_object(label, pred)

    mask = tf.cast(mask, dtype=loss.dtype)
    loss *= mask

    loss = tf.reduce_sum(loss)/tf.reduce_sum(mask)
    return loss
```


```python
# for inp_enc, inp_dec, tar_dec in train_ds:
#   tar_enc_dec = tf.concat([inp_enc, tar_dec], axis=-1)
#   break
```


```python
@tf.function
def train_step(inp_dec, inp_enc_dec_train, tar):
    with tf.GradientTape() as tape:
        #print("inp_dec", tf.print(inp_dec))
        #print("inp_enc_dec",  inp_enc_dec)
        pred = gpt(inp_dec, inp_enc_dec_train, training=True)
        loss = loss_function(tar, pred)
    gradients = tape.gradient(loss, gpt.trainable_variables)
    optimizer.apply_gradients(zip(gradients, gpt.trainable_variables))
    train_loss(loss)
```


```python
epochs = 10


for epoch in range(1, epochs):
    start = time.time()
    train_loss.reset_states()
    for (batch, (inp_enc,inp_dec, tar_dec)) in enumerate(train_ds):
        #print("antes de llamar a train step, shape de inp_dec:",inp_dec.shape)
        inp_enc_dec_train = tf.concat([inp_enc, inp_dec], axis=-1)
        if tf.shape(inp_dec)[0] == 64:
          train_step(inp_dec,inp_enc_dec_train, tar_dec)
        else:
          print("shape diferente a 64")
    
    print(f'Time taken for epoch {epoch} is: {time.time() - start:.2f} secs', end=' ')
    print(f'Loss: {train_loss.result():.4f}')
    
    if epoch % 2 == 0:
        print('Output: ')
        for c,d in zip(context_spa, context_eng):
            trans = sample(gpt, c, d, maxlen)
            print(f"{trans}")
```

    WARNING:tensorflow:Gradients do not exist for variables ['gpt/transformer_block/multi_head_attention/dense/kernel:0', 'gpt/transformer_block/multi_head_attention/dense/bias:0', 'gpt/transformer_block/multi_head_attention/dense_1/kernel:0', 'gpt/transformer_block/multi_head_attention/dense_1/bias:0', 'gpt/transformer_block/multi_head_attention/dense_2/kernel:0', 'gpt/transformer_block/multi_head_attention/dense_2/bias:0', 'gpt/transformer_block/multi_head_attention/dense_3/kernel:0', 'gpt/transformer_block/multi_head_attention/dense_3/bias:0', 'dense_4/kernel:0', 'dense_4/bias:0', 'dense_5/kernel:0', 'dense_5/bias:0', 'gpt/transformer_block/layer_normalization/gamma:0', 'gpt/transformer_block/layer_normalization/beta:0', 'gpt/transformer_block/layer_normalization_1/gamma:0', 'gpt/transformer_block/layer_normalization_1/beta:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_6/kernel:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_6/bias:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_7/kernel:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_7/bias:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_8/kernel:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_8/bias:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_9/kernel:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_9/bias:0', 'dense_10/kernel:0', 'dense_10/bias:0', 'dense_11/kernel:0', 'dense_11/bias:0', 'gpt/transformer_block_1/layer_normalization_2/gamma:0', 'gpt/transformer_block_1/layer_normalization_2/beta:0', 'gpt/transformer_block_1/layer_normalization_3/gamma:0', 'gpt/transformer_block_1/layer_normalization_3/beta:0'] when minimizing the loss. If you're using `model.compile()`, did you forget to provide a `loss` argument?
    WARNING:tensorflow:Gradients do not exist for variables ['gpt/transformer_block/multi_head_attention/dense/kernel:0', 'gpt/transformer_block/multi_head_attention/dense/bias:0', 'gpt/transformer_block/multi_head_attention/dense_1/kernel:0', 'gpt/transformer_block/multi_head_attention/dense_1/bias:0', 'gpt/transformer_block/multi_head_attention/dense_2/kernel:0', 'gpt/transformer_block/multi_head_attention/dense_2/bias:0', 'gpt/transformer_block/multi_head_attention/dense_3/kernel:0', 'gpt/transformer_block/multi_head_attention/dense_3/bias:0', 'dense_4/kernel:0', 'dense_4/bias:0', 'dense_5/kernel:0', 'dense_5/bias:0', 'gpt/transformer_block/layer_normalization/gamma:0', 'gpt/transformer_block/layer_normalization/beta:0', 'gpt/transformer_block/layer_normalization_1/gamma:0', 'gpt/transformer_block/layer_normalization_1/beta:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_6/kernel:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_6/bias:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_7/kernel:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_7/bias:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_8/kernel:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_8/bias:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_9/kernel:0', 'gpt/transformer_block_1/multi_head_attention_1/dense_9/bias:0', 'dense_10/kernel:0', 'dense_10/bias:0', 'dense_11/kernel:0', 'dense_11/bias:0', 'gpt/transformer_block_1/layer_normalization_2/gamma:0', 'gpt/transformer_block_1/layer_normalization_2/beta:0', 'gpt/transformer_block_1/layer_normalization_3/gamma:0', 'gpt/transformer_block_1/layer_normalization_3/beta:0'] when minimizing the loss. If you're using `model.compile()`, did you forget to provide a `loss` argument?

