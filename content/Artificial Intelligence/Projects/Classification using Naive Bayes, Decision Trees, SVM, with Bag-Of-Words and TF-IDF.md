
  
### Movie Reviews: Classification Using Naive Bayes, Decision Tree, and SVM with Bag-of-Words and TF-IDF

**Preprocessing Variations:**

1. Including stopwords
2. Removing stopwords
3. Using stemming and removing stopwords
4. Using lemmatization and removing stopwords

**Metrics to Obtain for Each Model:**

- Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix

## **Data Handling Process**

1. **Import, clean, and generate a DataFrame.**  
    The output of the preprocessing step is a DataFrame named `df_movies`.

**Important Note:**  
The dataset only includes **training data** (from the "train" folder). This subset will be split into training and test sets for evaluation. The "test" folder data is excluded due to execution time constraints or potential errors when processing the entire dataset.


```python
# !curl -O https://ai.stanford.edu/~amaas/data/sentiment/aclImdb_v1.tar.gz
# !tar -xf aclImdb_v1.tar.gz
```


```python
# !rm -r aclImdb/train/unsup
# !rm -r aclImdb/train/*.txt
# !rm -r aclImdb/test/*.txt
```


```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, precision_score
import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import confusion_matrix
from sklearn.metrics import ConfusionMatrixDisplay
import os
import pandas as pd
import numpy as np
import time
import string
```


```python
pathtrainpos = "aclImdb/train/pos"

lista_df = []

def read_text_file(file_path):
    with open(file_path,"r",errors="ignore") as f:
        data = f.readlines()
        df = pd.DataFrame(data, columns=['Informacion'])
        lista_df.append(df)

for file in os.listdir(pathtrainpos):
    #print(file)
    file_path = f"{pathtrainpos}/{file}"
    read_text_file(file_path)


# Concatenar los DataFrames en uno solo
df_trainpos = pd.concat(lista_df)

# Mostrar el DataFrame final
df_trainpos['Clasification'] = 1
print(df_trainpos)
```

                                              Informacion  Clasification
    0   Bromwell High is a cartoon comedy. It ran at t...              1
    0   Homelessness (or Houselessness as George Carli...              1
    0   Brilliant over-acting by Lesley Ann Warren. Be...              1
    0   This is easily the most underrated film inn th...              1
    0   This is not the typical Mel Brooks film. It wa...              1
    ..                                                ...            ...
    0   Seeing as the vote average was pretty low, and...              1
    0   The plot had some wretched, unbelievable twist...              1
    0   I am amazed at how this movie(and most others ...              1
    0   A Christmas Together actually came before my t...              1
    0   Working-class romantic drama from director Mar...              1
    
    [12500 rows x 2 columns]



```python
pathtrainneg = "aclImdb/train/neg"

lista_df = []

def read_text_file(file_path):
    with open(file_path,"r",errors="ignore") as f:
        data = f.readlines()
        df = pd.DataFrame(data, columns=['Informacion'])
        lista_df.append(df)

for file in os.listdir(pathtrainneg):
    #print(file)
    file_path = f"{pathtrainneg}/{file}"
    read_text_file(file_path)


# Concatenar los DataFrames en uno solo
df_trainneg = pd.concat(lista_df)

# Mostrar el DataFrame final
df_trainneg['Clasification'] = 0
print(df_trainneg)
```

                                              Informacion  Clasification
    0   Story of a man who has unnatural feelings for ...              0
    0   Airport '77 starts as a brand new luxury 747 p...              0
    0   This film lacked something I couldn't put my f...              0
    0   Sorry everyone,,, I know this is supposed to b...              0
    0   When I was little my parents took me along to ...              0
    ..                                                ...            ...
    0   Towards the end of the movie, I felt it was to...              0
    0   This is the kind of movie that my enemies cont...              0
    0   I saw 'Descent' last night at the Stockholm Fi...              0
    0   Some films that you pick up for a pound turn o...              0
    0   This is one of the dumbest films, I've ever se...              0
    
    [12500 rows x 2 columns]



```python
pathtestpos = "aclImdb/test/pos"

lista_df = []

def read_text_file(file_path):
    with open(file_path,"r",errors="ignore") as f:
        data = f.readlines()
        df = pd.DataFrame(data, columns=['Informacion'])
        lista_df.append(df)

for file in os.listdir(pathtestpos):
    #print(file)
    file_path = f"{pathtestpos}/{file}"
    read_text_file(file_path)


# Concatenar los DataFrames en uno solo
df_testpos = pd.concat(lista_df)

# Mostrar el DataFrame final
df_testpos['Clasification'] = 1
print(df_testpos)
```

                                              Informacion  Clasification
    0   I went and saw this movie last night after bei...              1
    0   Actor turned director Bill Paxton follows up h...              1
    0   As a recreational golfer with some knowledge o...              1
    0   I saw this film in a sneak preview, and it is ...              1
    0   Bill Paxton has taken the true story of the 19...              1
    ..                                                ...            ...
    0   I was extraordinarily impressed by this film. ...              1
    0   Although I'm not a golf fan, I attended a snea...              1
    0   From the start of "The Edge Of Love", the view...              1
    0   This movie, with all its complexity and subtle...              1
    0   I've seen this story before but my kids haven'...              1
    
    [12500 rows x 2 columns]



```python
pathtestneg = "aclImdb/test/neg"

lista_df = []

def read_text_file(file_path):
    with open(file_path,"r",errors="ignore") as f:
        data = f.readlines()
        df = pd.DataFrame(data, columns=['Informacion'])
        lista_df.append(df)

for file in os.listdir(pathtestneg):
    file_path = f"{pathtestneg}/{file}"
    read_text_file(file_path)


df_testneg = pd.concat(lista_df)

df_testneg['Clasification'] = 0
print(df_testneg)
```

                                              Informacion  Clasification
    0   Once again Mr. Costner has dragged out a movie...              0
    0   This is an example of why the majority of acti...              0
    0   First of all I hate those moronic rappers, who...              0
    0   Not even the Beatles could write songs everyon...              0
    0   Brass pictures (movies is not a fitting word f...              0
    ..                                                ...            ...
    0   I occasionally let my kids watch this garbage ...              0
    0   When all we have anymore is pretty much realit...              0
    0   The basic genre is a thriller intercut with an...              0
    0   Four things intrigued me as to this film - fir...              0
    0   David Bryce's comments nearby are exceptionall...              0
    
    [12500 rows x 2 columns]



```python
#Todos los datos de entrenamiento
df_movies_train = []
df_movies_train = pd.concat([df_trainneg, df_trainpos])
print(df_movies_train)
```

                                              Informacion  Clasification
    0   Story of a man who has unnatural feelings for ...              0
    0   Airport '77 starts as a brand new luxury 747 p...              0
    0   This film lacked something I couldn't put my f...              0
    0   Sorry everyone,,, I know this is supposed to b...              0
    0   When I was little my parents took me along to ...              0
    ..                                                ...            ...
    0   Seeing as the vote average was pretty low, and...              1
    0   The plot had some wretched, unbelievable twist...              1
    0   I am amazed at how this movie(and most others ...              1
    0   A Christmas Together actually came before my t...              1
    0   Working-class romantic drama from director Mar...              1
    
    [25000 rows x 2 columns]



```python
#Todos los datos de Prueba
df_movies_test = []
df_movies_test = pd.concat([df_testneg, df_testpos])
print(df_movies_test)
```

                                              Informacion  Clasification
    0   Once again Mr. Costner has dragged out a movie...              0
    0   This is an example of why the majority of acti...              0
    0   First of all I hate those moronic rappers, who...              0
    0   Not even the Beatles could write songs everyon...              0
    0   Brass pictures (movies is not a fitting word f...              0
    ..                                                ...            ...
    0   I was extraordinarily impressed by this film. ...              1
    0   Although I'm not a golf fan, I attended a snea...              1
    0   From the start of "The Edge Of Love", the view...              1
    0   This movie, with all its complexity and subtle...              1
    0   I've seen this story before but my kids haven'...              1
    
    [25000 rows x 2 columns]



```python
df_movies_train = df_movies_train[df_movies_train['Informacion'].str.strip() != '']
df_movies_train["clean_text"] = df_movies_train["Informacion"]
df_movies_train["clean_text"] = df_movies_train['clean_text'].str.lower().str.translate(str.maketrans('', '', string.punctuation))
df_movies_train.head()
```




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
      <th>Informacion</th>
      <th>Clasification</th>
      <th>clean_text</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Story of a man who has unnatural feelings for ...</td>
      <td>0</td>
      <td>story of a man who has unnatural feelings for ...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>Airport '77 starts as a brand new luxury 747 p...</td>
      <td>0</td>
      <td>airport 77 starts as a brand new luxury 747 pl...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>This film lacked something I couldn't put my f...</td>
      <td>0</td>
      <td>this film lacked something i couldnt put my fi...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>Sorry everyone,,, I know this is supposed to b...</td>
      <td>0</td>
      <td>sorry everyone i know this is supposed to be a...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>When I was little my parents took me along to ...</td>
      <td>0</td>
      <td>when i was little my parents took me along to ...</td>
    </tr>
  </tbody>
</table>
</div>




```python
df_movies_test = df_movies_test[df_movies_test['Informacion'].str.strip() != '']
df_movies_test["clean_text"] = df_movies_test["Informacion"]
df_movies_test["clean_text"] = df_movies_test['clean_text'].str.lower().str.translate(str.maketrans('', '', string.punctuation))
df_movies_test.head()
```




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
      <th>Informacion</th>
      <th>Clasification</th>
      <th>clean_text</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Once again Mr. Costner has dragged out a movie...</td>
      <td>0</td>
      <td>once again mr costner has dragged out a movie ...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>This is an example of why the majority of acti...</td>
      <td>0</td>
      <td>this is an example of why the majority of acti...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>First of all I hate those moronic rappers, who...</td>
      <td>0</td>
      <td>first of all i hate those moronic rappers who ...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>Not even the Beatles could write songs everyon...</td>
      <td>0</td>
      <td>not even the beatles could write songs everyon...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>Brass pictures (movies is not a fitting word f...</td>
      <td>0</td>
      <td>brass pictures movies is not a fitting word fo...</td>
    </tr>
  </tbody>
</table>
</div>




```python
df_movies_train['clean_text'].value_counts()
```




    when i got this movie free from my job along with three other similar movies i watched then with very low expectations now this movie isnt bad per se you get what you pay for it is a tale of love betrayal lies sex scandal everything you want in a movie definitely not a hollywood blockbuster but for cheap thrills it is not that bad i would probably never watch this movie again in a nutshell this is the kind of movie that you would see either very late at night on a local television station that is just wanting to take up some time or you would see it on a sunday afternoon on a local television station that is trying to take up some time despite the bad acting clichã© lines and sub par camera work i didnt have the desire to turn off the movie and pretend like it never popped into my dvd player the story has been done many times in many movies this one is no different no better no worse br br just your average movie                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  3
    this show comes up with interesting locations as fast as the travel channel it is billed as reality but in actuality it is pure prime time soap opera its tries to use exotic locales as a facade to bring people into a phony contest  then proceeds to hook viewers on the contestants soap opera stylebr br it also borrows from an early cbs game show pioneer beat the clock by inventing situations for its contestants to try  overcome then it rewards the winner money if they can spice it up with a little interaction between the characters even better while the game format is in slow motion versus beat the clock the real accomplishment of this series is to escape reality br br this show has elements of several types of successful past programs reality television hardly but if your hooked on the contestants locale or contest this is your cup of tea if your not this entire series is as i say drivel dripping with gravy it is another show hiding behind the reality label which is the trend it started in 2000br br it is slick  well produced so it might last a while yet after all so do reruns of gilligans island green acres the beverly hillbillies  the brady bunch this just doesnt employ professional actors the intelligence level is about the same                                                                                                                                                                                                                                                                                                                                                                                                             3
    how has this piece of crap stayed on tv this long its terrible it makes me want to shoot someone its so fake that it is actually worse than a 1940s scifi movie id rather have a stroke than watch this nonsense i remember watching it when it first came out i thought hey this could be interesting then i found out how absolutely insanely ridiculously stupid it really was it was so bad that i actually took out my pocket knife and stuck my hand to the tablebr br please people stop watching this and all other reality shows theyre the trash that is jamming the networks and canceling quality programming that requires some thought to create                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  3
    you do realize that youve been watching the exact same show for eight years right i could understand the initial curiosity of seeing strangers coexist on an island but youd think that after watching unkempt stinkladened heroes run roughshod through the bush with an egg on a spoon for half a decade would be enough to get you to commit to something a little more original and interestingbr br and im not even speaking of the shows validity which for the record i find questionable its just hard to suspend disbelief for bushy bill eating a rat when the entire crew of producers and camera people are housed in an air conditioned makeshift biodome sipping frosty mochcinnos with moxybr br whats the appeal here i dont care about these people or their meandering lives i just dont get it but if you do find yourself being captivated by hairy unwashed people i suggest you turn off your tv and just take a trip to your local bus station where you can see people like this in their true habitat they call them homeless people and free of charge you can sit back and marvel in their uncanny ability to retrieve various cigarette debris from a plethora of garbage canisters eventually striking paydirt and fashioning a homemade dr frankensteinstyled cancerstick all the while begging people for change for food when the stink of aqua velva on their breath is enough to suggest otherwise and the best part much like survivor every week one member of the tribe leaves the island when they are unceremoniously sent packing to the local institution when the frightening unmedicated state of fullblown schizophrenia kicks into gear now thats entertainment    3
    love it love it love it this is another absolutely superb performance from the divine miss m from the beginning to the end this is one big treat dont rent it buy it now                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        2
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ..
    nobr br basically your watching something that doesnt make sense to not spoil the film for people who actually want to this take a look at the flick i will explain the storybr br a normal everyday to day women is walking down a street then finds herself driving by in her own car she follows her and many events take place during that time that include her and her familybr br i specifically made an account to comment on this film of how horribly written this was the acting was great the events were great but the story just brought it nowhere  it could of been added to tremendously and be made into a worldwide epidemic im not sure what the writer was trying to accomplish by making this usually at the end of films most of your questions get answers but this film has you asking what just happened and 1 hour 20 minutes just passed for nothingbr br spoiler startsbr br they had this area between 2 dimensions ours and behind the glass that would come into our world and kill us it was not elaborated on all during the film and you never know how it was happening or why it was or when it happened nothing gets explained during the film the main character shouldnt of even been the main character at the end of the film the guy who finally figures it all out and runs away her sisters boyfriend should of been the main character but sadly the movie ends 20 seconds after br br i bought this movie for 10 threw it out right after dont waste your time i really hope nothing like this is made again                                                                                                                                                     1
    you gotta wonder how some flics ever get made this one decided to skip with the why among many other things and just wanders off beyond the moot br br and yet you have a number of decent actors doing their best to pump some life into the story the blue tint throughout the movie overshoots into yet again which on its own would be depressing but here its overkill the idea that its not a medical condition not some house or gypsy or trinket curse but just something that for no apparent reason starts to happen to our protagonist and then to everyone else around her just winds up being much like taking a big swig out of an empty mug some doppelgangers have super powers but others dont or dont know they do it seems theyre just as clueless as we arebr br its a poor mans ripoff of invasion of the bodysnatchers with keifer sutherlands mirror and the sixth sense were you to seriously botch those three together                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                1
    this film really tries to hard if your going to make a horror film at least give it a reason to believe in to hook the viewer br br you wait and wait through the film expecting for some grand explanation but it doesnt instead it tries to be too clever ending and not revealing anything br br what was the point of the movie  where its actually going  and more importantly what the hell was going on    br br why were they there and how does it tie into anything just another weak scifi horror i love the fake reviews on imdb saying how great it is by related press releases to bump the movie either that or people have low horizons its not worth your 2hrs at allbr br im not saying the film is better than the fragile but at least that gave you reasoning and why things happened and has an end result this doesnt and it just waffles on with tons of padding to make everything feel scary this film is about as low as when a stranger calls god that was lame too br br big tip if your gonna make a horror make it believable with reasoning and explain to the viewer whats going on so they have a hook into your story because if theres no reasoning or believability then theres no firm hold on anything and it cant be scary no disrespect to the cast or crew cause they did a good job its just the poor writing                                                                                                                                                                                                                                                                                                                                                        1
    the broken is part of the after dark horrorfest iii not a slasher or filled with gore plenty of broken glass and mirrors in this edgy thriller from france and writerdirector sean ellis a successful radiologist gina mcvaylena headlyinters a strange world as her life seems to spiral out of control while attending her fathersrichard jenkinsbirthday party the guests are stunned when a mirror crashes to the floor for no obvious reason things get really strange when she witnesses a woman that is the spitting image of herself driving down a london street in a car identical to her own gina sneaks to her doppelgangers apartment and finds a photo of herself with her father she drives away and is involved in a head on collision then mysteriously her boyfriend is not the same to be exact family and friends are not easy for her to trust is gina beside herself is she in a parallel world her nightmares become more horrificis she brokenbr br kudos if you can figure this one outit wont be easy editing couldnt be any tighter lighting is questionable other players melvil poupard william armstrong michelle duncan and ulrich thomsen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       1
    workingclass romantic drama from director martin ritt is as unbelievable as they come yet there are moments of pleasure due mostly to the charisma of stars jane fonda and robert de niro both terrific shes a widow who cant move on hes illiterate and a closetinventoryou can probably guess the rest adaptation of pat barkers novel union street a better title is so laidback it verges on bland and the films editing is a mess but its still pleasant a rosyhued bluecollar fantasy there are no overtures to serious issues even the illiteracy angle is just a plottool for the ensuing love story and no real fireworks though the characters are intentionally a bit colorless and the leads are toned down to an interesting degree the finale is pure fluffand cynics will find it difficult to swallowthough these two characters deserve a happy ending and the picture wouldnt really be satisfying any other way  from                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        1
    Name: clean_text, Length: 24904, dtype: int64




```python
#Para la tabla de Resultados
ResultadosNB = {"Tipo de modelo" : [], "Train Time": [], "Predict Time": [], "Precision": []}
ResultadosArbol = {"Tipo de modelo": [], "Train Time": [], "Predict Time": [], "Precision": []}
ResultadosSVM = {"Tipo de modelo": [], "Train Time": [], "Predict Time": [], "Precision": []}

df_ResultadosNB = pd.DataFrame(ResultadosNB)
df_ResultadosArbol = pd.DataFrame(ResultadosArbol)
df_ResultadosSVM = pd.DataFrame(ResultadosSVM)

#print(df_ResultadosNB)
```


```python
#Stemming
import nltk
nltk.download('punkt')
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

ps = PorterStemmer ()
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))


def stem_w(text):  #funcion obtenida de chatGPT
  words = nltk.word_tokenize(text)
  stemmed_words = [ps.stem(word) for word in words]
  filter_words = [word for word in stemmed_words if word not in stop_words]
  return ' '.join(filter_words)


df_movies_train['stemmed_clean_text'] = df_movies_train['clean_text'].apply(stem_w)
df_movies_test['stemmed_clean_text'] = df_movies_test['clean_text'].apply(stem_w)
```

    [nltk_data] Downloading package punkt to
    [nltk_data]     C:\Users\rodol\AppData\Roaming\nltk_data...
    [nltk_data]   Package punkt is already up-to-date!
    [nltk_data] Downloading package stopwords to
    [nltk_data]     C:\Users\rodol\AppData\Roaming\nltk_data...
    [nltk_data]   Package stopwords is already up-to-date!



```python
#Lematización
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
nltk.download('wordnet')
from nltk.corpus import stopwords

lemmatizer = WordNetLemmatizer()
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def lemmatize_words(text):  #funcion obtenida con chatgpt
    words = word_tokenize(text)
    lemmatized_words = [lemmatizer.lemmatize(word, pos='v') for word in words]
    filter_words = [word for word in lemmatized_words if word not in stop_words]
    return ' '.join(filter_words)


df_movies_train['lem_clean_text'] = df_movies_train['clean_text'].apply(lemmatize_words)
df_movies_test['lem_clean_text'] = df_movies_test['clean_text'].apply(lemmatize_words)

print(df_movies_train)
```

    [nltk_data] Downloading package wordnet to
    [nltk_data]     C:\Users\rodol\AppData\Roaming\nltk_data...
    [nltk_data]   Package wordnet is already up-to-date!
    [nltk_data] Downloading package stopwords to
    [nltk_data]     C:\Users\rodol\AppData\Roaming\nltk_data...
    [nltk_data]   Package stopwords is already up-to-date!


                                              Informacion  Clasification  \
    0   Story of a man who has unnatural feelings for ...              0   
    0   Airport '77 starts as a brand new luxury 747 p...              0   
    0   This film lacked something I couldn't put my f...              0   
    0   Sorry everyone,,, I know this is supposed to b...              0   
    0   When I was little my parents took me along to ...              0   
    ..                                                ...            ...   
    0   Seeing as the vote average was pretty low, and...              1   
    0   The plot had some wretched, unbelievable twist...              1   
    0   I am amazed at how this movie(and most others ...              1   
    0   A Christmas Together actually came before my t...              1   
    0   Working-class romantic drama from director Mar...              1   
    
                                               clean_text  \
    0   story of a man who has unnatural feelings for ...   
    0   airport 77 starts as a brand new luxury 747 pl...   
    0   this film lacked something i couldnt put my fi...   
    0   sorry everyone i know this is supposed to be a...   
    0   when i was little my parents took me along to ...   
    ..                                                ...   
    0   seeing as the vote average was pretty low and ...   
    0   the plot had some wretched unbelievable twists...   
    0   i am amazed at how this movieand most others h...   
    0   a christmas together actually came before my t...   
    0   workingclass romantic drama from director mart...   
    
                                       stemmed_clean_text  \
    0   stori man ha unnatur feel pig start open scene...   
    0   airport 77 start brand new luxuri 747 plane lo...   
    0   thi film lack someth couldnt put finger first ...   
    0   sorri everyon know thi suppos art film wow han...   
    0   wa littl parent took along theater see interio...   
    ..                                                ...   
    0   see vote averag wa pretti low fact clerk video...   
    0   plot wretch unbeliev twist howev chemistri mel...   
    0   amaz thi movieand ha averag 5 star lower crapp...   
    0   christma togeth actual came befor time ive rai...   
    0   workingclass romant drama director martin ritt...   
    
                                           lem_clean_text  
    0   story man unnatural feel pig start open scene ...  
    0   airport 77 start brand new luxury 747 plane lo...  
    0   film lack something couldnt put finger first c...  
    0   sorry everyone know suppose art film wow hand ...  
    0   little parent take along theater see interiors...  
    ..                                                ...  
    0   see vote average pretty low fact clerk video s...  
    0   plot wretched unbelievable twist however chemi...  
    0   amaze movieand others average 5 star lower cra...  
    0   christmas together actually come time ive rais...  
    0   workingclass romantic drama director martin ri...  
    
    [25000 rows x 5 columns]


# BOW + eliminando stopwords


```python
from sklearn.feature_extraction.text import CountVectorizer #bolsa de palabras y pasamos las stop words.

X_train = df_movies_train['clean_text'].values
y_train = df_movies_train['Clasification'].values
X_test = df_movies_test['clean_text'].values
y_test = df_movies_test['Clasification'].values

#X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 123)
vector = CountVectorizer(stop_words = 'english') #Stopwords

X_train_bow = vector.fit_transform(X_train)
X_test_bow = vector.transform(X_test)
```


```python
X_train_bow.shape, X_test_bow.shape
```




    ((25000, 121083), (25000, 121083))




```python
#print("X_train, X_test, y_train, y_test", X_train, X_test, y_train, y_test)
print("X_train", X_train)
print(X_train.size)
```

    X_train ['story of a man who has unnatural feelings for a pig starts out with a opening scene that is a terrific example of absurd comedy a formal orchestra audience is turned into an insane violent mob by the crazy chantings of its singers unfortunately it stays absurd the whole time with no general narrative eventually making it just too off putting even those from the era should be turned off the cryptic dialogue would make shakespeare seem easy to a third grader on a technical level its better than you might think with some good cinematography by future great vilmos zsigmond future stars sally kirkland and frederic forrest can be seen briefly'
     'airport 77 starts as a brand new luxury 747 plane is loaded up with valuable paintings  such belonging to rich businessman philip stevens james stewart who is flying them  a bunch of vips to his estate in preparation of it being opened to the public as a museum also on board is stevens daughter julie kathleen quinlan  her son the luxury jetliner takes off as planned but midair the plane is hijacked by the copilot chambers robert foxworth  his two accomplices banker monte markham  wilson michael pataki who knock the passengers  crew out with sleeping gas they plan to steal the valuable cargo  land on a disused plane strip on an isolated island but while making his descent chambers almost hits an oil rig in the ocean  loses control of the plane sending it crashing into the sea where it sinks to the bottom right bang in the middle of the bermuda triangle with air in short supply water leaking in  having flown over 200 miles off course the problems mount for the survivors as they await help with time fast running outbr br also known under the slightly different tile airport 1977 this second sequel to the smashhit disaster thriller airport 1970 was directed by jerry jameson  while once again like its predecessors i cant say airport 77 is any sort of forgotten classic it is entertaining although not necessarily for the right reasons out of the three airport films i have seen so far i actually liked this one the best just it has my favourite plot of the three with a nice midair hijacking  then the crashing didnt he see the oil rig  sinking of the 747 maybe the makers were trying to cross the original airport with another popular disaster flick of the period the poseidon adventure 1972  submerged is where it stays until the end with a stark dilemma facing those trapped inside either suffocate when the air runs out or drown as the 747 floods or if any of the doors are opened  its a decent idea that could have made for a great little disaster flick but bad unsympathetic characters dull dialogue lethargic setpieces  a real lack of danger or suspense or tension means this is a missed opportunity while the rather sluggish plot keeps one entertained for 108 odd minutes not that much happens after the plane sinks  theres not as much urgency as i thought there should have been even when the navy become involved things dont pick up that much with a few shots of huge ships  helicopters flying about but theres just something lacking here george kennedy as the jinxed airline worker joe patroni is back but only gets a couple of scenes  barely even says anything preferring to just look worried in the backgroundbr br the home video  theatrical version of airport 77 run 108 minutes while the us tv versions add an extra hour of footage including a new opening credits sequence many more scenes with george kennedy as patroni flashbacks to flesh out characters longer rescue scenes  the discovery or another couple of dead bodies including the navigator while i would like to see this extra footage i am not sure i could sit through a near three hour cut of airport 77 as expected the film has dated badly with horrible fashions  interior design choices i will say no more other than the toy plane model effects arent great either along with the other two airport sequels this takes pride of place in the razzie awards hall of shame although i can think of lots of worse films than this so i reckon thats a little harsh the action scenes are a little dull unfortunately the pace is slow  not much excitement or tension is generated which is a shame as i reckon this could have been a pretty good film if made properlybr br the production values are alright if nothing spectacular the acting isnt great two time oscar winner jack lemmon has said since it was a mistake to star in this one time oscar winner james stewart looks old  frail also one time oscar winner lee grant looks drunk while sir christopher lee is given little to do  there are plenty of other familiar faces to look out for toobr br airport 77 is the most disaster orientated of the three airport films so far  i liked the ideas behind it even if they were a bit silly the production  bland direction doesnt help though  a film about a sunken plane just shouldnt be this boring or lethargic followed by the concorde  airport 79 1979'
     'this film lacked something i couldnt put my finger on at first charisma on the part of the leading actress this inevitably translated to lack of chemistry when she shared the screen with her leading man even the romantic scenes came across as being merely the actors at play it could very well have been the director who miscalculated what he needed from the actors i just dont knowbr br but could it have been the screenplay just exactly who was the chef in love with he seemed more enamored of his culinary skills and restaurant and ultimately of himself and his youthful exploits than of anybody or anything else he never convinced me he was in love with the princessbr br i was disappointed in this movie but dont forget it was nominated for an oscar so judge for yourself'
     ...
     'i am amazed at how this movieand most others has a average 5 stars and lower when there are crappy movies averaging 7 to 10 stars on imdb the fanboy mentality strikes again when this movie came out just about everyone slammed it even my exgirlfriend said this movie questionable years later i sat down to watch this movie and i found myself enjoying even laughing quite a bit this and the replacement killers are the movies that had people labeling the director antoine fuqua as the black michael bay i dont see how since most of fuquas movies are smarter than anything michael bay has came up with at any ratebr br story alvin sandersjamie foxx is former convict that is used by a nononsense treasury agent edgardavid morse as a pawn to catch a killer named bristoldoug hutchinson alvins every moves are tracked by a bug implanted in his jaw after an accident while these agents are after bristol bristol is after the gold bricks that were taken in a heist gone awrybr br jamie foxx is funny as well as great as alvin sanders alvin is a fasttalker that is a lot smarter than he lets on doug hutchinson is okay as bristol he can be overthetop sometimes in his john malkovitchesque demeanor he was better here than he was as looney bin jim in punisher war zone david morse is good as the hard edged treasury agent even mike epps is funny as alvins brother stevie both him and jamie had some funny moments on screenbr br the only flaw of the movie is the some of the attempts at a thriller fall flat the scenario at the horse race track is way overthetop but i couldnt look away the director went all out there so he gets points for that plus the bomb scene with the treasury agent tied to a chair while the detonator rests on the door was pretty niftybr br all in all bait is not a bad movie by a long shot its never boring its always funny and i wasnt checking my watch every minute that should count for something bait is one of the most underrated movies of 2000 periodbr br ps to the reviewer that claimed this movie is too violent how long have you been living under a rock im pretty sure youve seen the die hard series and every movie by quentin tarantino but those movies arent violent right weirdo'
     'a christmas together actually came before my time but ive been raised on john denver and the songs from this special were always my familys christmas music for years we had a crackling cassette made from a record that meant it was christmas a few years ago i was finally able to track down a video of it on ebay so after listening to all the music for some 21 years i got to see john and the muppets in action for myself if you ever get the chance its a lot of fungreat music heartwarming and cheesy its also interesting to see the 70s versions of the muppets and compare them to their newer versions today i believe denver actually took some heat for doing a show like thisi guess normally performers dont compromise their images by doing singalongs with the muppets but im glad he did even if you cant track down the video the soundtrack is worth it too it has some muppified traditional favorites but also some original denver tunes as well'
     'workingclass romantic drama from director martin ritt is as unbelievable as they come yet there are moments of pleasure due mostly to the charisma of stars jane fonda and robert de niro both terrific shes a widow who cant move on hes illiterate and a closetinventoryou can probably guess the rest adaptation of pat barkers novel union street a better title is so laidback it verges on bland and the films editing is a mess but its still pleasant a rosyhued bluecollar fantasy there are no overtures to serious issues even the illiteracy angle is just a plottool for the ensuing love story and no real fireworks though the characters are intentionally a bit colorless and the leads are toned down to an interesting degree the finale is pure fluffand cynics will find it difficult to swallowthough these two characters deserve a happy ending and the picture wouldnt really be satisfying any other way  from ']
    25000



```python
print("X_test",X_test)
print(X_test.size)
```

    X_test ['once again mr costner has dragged out a movie for far longer than necessary aside from the terrific sea rescue sequences of which there are very few i just did not care about any of the characters most of us have ghosts in the closet and costners character are realized early on and then forgotten until much later by which time i did not care the character we should really care about is a very cocky overconfident ashton kutcher the problem is he comes off as kid who thinks hes better than anyone else around him and shows no signs of a cluttered closet his only obstacle appears to be winning over costner finally when we are well past the half way point of this stinker costner tells us all about kutchers ghosts we are told why kutcher is driven to be the best with no prior inkling or foreshadowing no magic here it was all i could do to keep from turning it off an hour in'
     'this is an example of why the majority of action films are the same generic and boring theres really nothing worth watching here a complete waste of the then barelytapped talents of icet and ice cube whove each proven many times over that they are capable of acting and acting well dont bother with this one go see new jack city ricochet or watch new york undercover for icet or boyz n the hood higher learning or friday for ice cube and see the real deal icets horribly cliched dialogue alone makes this film grate at the teeth and im still wondering what the heck bill paxton was doing in this film and why the heck does he always play the exact same character from aliens onward every film ive seen with bill paxton has him playing the exact same irritating character and at least in aliens his character died which made it somewhat gratifyingbr br overall this is secondrate action trash there are countless better films to see and if you really want to see this one watch judgement night which is practically a carbon copy but has better acting and a better script the only thing that made this at all worth watching was a decent hand on the camera  the cinematography was almost refreshing which comes close to making up for the horrible film itself  but not quite 410'
     'first of all i hate those moronic rappers who couldnt act if they had a gun pressed against their foreheads all they do is curse and shoot each other and acting like clichã©e version of gangstersbr br the movie doesnt take more than five minutes to explain what is going on before were already at the warehouse there is not a single sympathetic character in this movie except for the homeless guy who is also the only one with half a brainbr br bill paxton and william sadler are both hill billies and sadlers character is just as much a villain as the gangsters i didnt like him right from the startbr br the movie is filled with pointless violence and walter hills specialty people falling through windows with glass flying everywhere there is pretty much no plot and it is a big problem when you root for noone everybody dies except from paxton and the homeless guy and everybody get what they deservebr br the only two black people that can act is the homeless guy and the junkie but theyre actors by profession not annoying ugly brain dead rappersbr br stay away from this crap and watch 48 hours 1 and 2 instead at lest they have characters you care about a sense of humor and nothing but real actors in the cast'
     ...
     'from the start of the edge of love the viewer is transported to the striking world of ww2 london we follow the lives of four people who might have been created just for this movie an exploration of female friendship and the strains caused on it by marriage and infidelity except one of the characters is named dylan thomas perhaps the greatest english poet of the 20th century and his reactions to the world around him were not only selfish but at times truly despicable br br this movie is based on thomas writings about love and romance these were adapted with a sharp screenplay by sharman macdonald keira knightleys mother the director john maybury does claim that the three other lead characters were actual people br br all four are performed very strongly sienna miller is dylans wife keira knightley is the cabaret singer vera phillips matthew rhys is dylan thomas and cillian murphy is william killick the first section of the movie takes place in london during the nazi air raids with vera being pursued by willaim a soldier waiting for deployment by a chance encounter dylan meets with his first love vera from there vera meets caitlin dylans wife while the three are drinking william successfully breaks veras guard br br the film follows their lives as vera and william are married and he is sent to war vera has become pregnant and returns to wales with dylan and caitlin there they face a gritty existence with vera supporting dylan and caitlin with her husbands war pay through these times veras and caitlins friendship grows so does dylans infatuation with vera she gives in this creates the first test for the two women br br when william returns from war he barely recognizes his wife and has no bond with his infant son things get worse as dylan idly watches his friend struggle with battleground fatigue post traumatic stress disorder william realizes something has happened between dylan and vera and in a drunken rage shoots up dylans housebr br edge of love starts as a stylish romance in war torn london and ends in the stark gritty life of motherhood infidelity and attempted murder in wales the treatment of ptsd is well done and should speak to an american audience some day see endingbr br each star has a great moment miller when she is yanking out stitches in her head in response to her abortion of another mans child knightley and murpy when he finally bonds with his son oh hell almost all their scenes are awesome and rhys when he purgers himself on the stand to get veras husband sent to jail br br yet the real star of the movie is jonathan freemans cinematography and john mayburys direction they seem to understand that no matter how good the story or how historical thomas is this is a film dominated by two great actresses of our time and they cherish their scenes with stunning shots while this isnt best picture material it is a very good movie much more engaging than the dutchess it has a visual lyricism that accentuates the use of thomas poetry also this is clearly knightleys second best performance of her career and perhaps millers best br br i have always had a weakness for the artist in struggle whether its hulces mozart or hoffmans capote but i was stunned at how little sympathy i felt for dylan thomas his struggles with alcohol are well known but his antagonism of william and caitlin to gain possession of his first love vera makes him out to bea bad manbr br so is this academy award worthy clearly no at least not this year it will be released state side in march 2009 making it ineligible for the academies this is 9 months after it was released in britain between atonement miss pettigrew and brideshead revisited the us has had its fill of ww2 british period pieces too bad this film is better then the other ones except atonement but in this one knightleys soldier does come back but as a shell of the man who left her'
     'this movie with all its complexity and subtlety makes for one of the most thoughtprovoking short films i have ever seen the topics it addresses are ugly cynical and at times even macabre but the film remains beautiful in its language artful with its camera angles and gorgeous in its style skillfully recreating the short story of the same name written by a master of short stories tobias wolffbr br not wishing to spoil anything of the movie i wont go into any details other than to say that this movie is magnificent in and of itself it takes pride in what it does and does it well it shows the most important memories of life all of which can be topped by the single most elusive feeling unexpected bliss this movie of its own volition has created in me the same feelings the main character tom noonan felt when words transformed his very existence and that is one impressive feat'
     'ive seen this story before but my kids havent boy with troubled past joins military faces his past falls in love and becomes a man the mentor this time is played perfectly by kevin costner an ordinary man with common everyday problems who lives an extraordinary conviction to save lives after losing his team he takes a teaching position training the next generation of heroes the young troubled recruit is played by kutcher while his scenes with the local love interest are a tad stiff and dont generate enough heat to melt butter he compliments costner well i never really understood sela ward as the neglected wife and felt she should of wanted costner to quit out of concern for his safety as opposed to her selfish needs but her presence on screen is a pleasure the two unaccredited stars of this movie are the coast guard and the sea both powerful forces which should not be taken for granted in real life or this movie the movie has some slow spots and could have used the wasted 15 minutes to strengthen the character relationships but it still works the rescue scenes are intense and well filmed and edited to provide maximum impact this movie earns the audience applause and the applause of my two sons']
    25000



```python
print("y_train", y_train)
print(y_train.size)
```

    y_train [0 0 0 ... 1 1 1]
    25000



```python
print("y_test", y_test)
print(y_test.size)
```

    y_test [0 0 0 ... 1 1 1]
    25000


## Naives Bayes


```python
start = time.time()
bayes_pred = MultinomialNB()
bayes_pred.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ",train_time)


start = time.time()
predictions = bayes_pred.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de prediccción: ",predict_time)
```

    Tiempo de entrenamiento:  0.026520252227783203
    Tiempo de prediccción:  0.025521516799926758



```python
print(classification_report(y_test, predictions))
precision = precision_score(y_test, predictions)
print("Precisión del modelo: ", precision)
```

                  precision    recall  f1-score   support
    
               0       0.79      0.88      0.83     12500
               1       0.86      0.77      0.81     12500
    
        accuracy                           0.82     25000
       macro avg       0.83      0.82      0.82     25000
    weighted avg       0.83      0.82      0.82     25000
    
    Precisión del modelo:  0.8640855192238591



```python
cm = confusion_matrix(y_test, predictions)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(y_test))
disp.plot()
plt.show()


```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_29_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "NB Bow S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosNB = df_ResultadosNB.append(nueva_fila,ignore_index=True)
```

## Decision Tree


```python

start = time.time()
ClasificacionAD = DecisionTreeClassifier(criterion='gini',random_state=0)
ClasificacionAD.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  28.542007446289062



```python
start = time.time()
Y_ClasificacionAD = ClasificacionAD.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)

```

    Tiempo de predicción:  0.04197359085083008



```python
print(Y_ClasificacionAD)
print(classification_report(y_test, Y_ClasificacionAD))
precision = precision_score(y_test, Y_ClasificacionAD)
print("Precisión del modelo: ", precision)
```

    [1 0 0 ... 1 1 1]
                  precision    recall  f1-score   support
    
               0       0.73      0.73      0.73     12500
               1       0.73      0.73      0.73     12500
    
        accuracy                           0.73     25000
       macro avg       0.73      0.73      0.73     25000
    weighted avg       0.73      0.73      0.73     25000
    
    Precisión del modelo:  0.7292671166827387



```python
cm = confusion_matrix(y_test, Y_ClasificacionAD)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Y_ClasificacionAD))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_35_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "Arbol Bow S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosArbol = df_ResultadosArbol.append(nueva_fila,ignore_index=True)
```

### Support Vector Machine


```python
start = time.time()
ModeloSVM_1 = SVC(kernel='linear')
ModeloSVM_1.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  1083.4989233016968



```python
start = time.time()
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
print(Clasificaciones_1)

#pd.DataFrame(Clasificaciones_1)

Clasificaciones = pd.DataFrame(y_test, Clasificaciones_1)
Clasificaciones

#Se calcula la exactitud promedio de la validación
ModeloSVM_1.score(X_test_bow, y_test)

#### **Validación del modelo**

#Matriz de clasificación
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
Matriz_Clasificacion = pd.crosstab(y_test.ravel(),
                                   Clasificaciones_1,
                                   rownames=['Real'],
                                   colnames=['Clasificación'])
Matriz_Clasificacion


#Reporte de la clasificación
print("Exactitud", ModeloSVM_1.score(X_test_bow, y_test))
print(classification_report(y_test, Clasificaciones_1))
precision = ModeloSVM_1.score(X_test_bow, y_test)
print("Precisión del modelo: ", precision)

VectoresSoporte_1 = ModeloSVM_1.support_vectors_
pd.DataFrame(VectoresSoporte_1)

#Vectores de soporte
print('Número de vectores de soporte: \n', ModeloSVM_1.n_support_)
print('Vectores de soporte: \n', ModeloSVM_1.support_)

```

    Tiempo de predicción:  129.1703565120697
    [0 0 0 ... 1 1 1]
    Exactitud 0.83924
                  precision    recall  f1-score   support
    
               0       0.83      0.85      0.84     12500
               1       0.85      0.83      0.84     12500
    
        accuracy                           0.84     25000
       macro avg       0.84      0.84      0.84     25000
    weighted avg       0.84      0.84      0.84     25000
    
    Precisión del modelo:  0.83924
    Número de vectores de soporte: 
     [4161 4248]
    Vectores de soporte: 
     [    0     2     3 ... 24993 24996 24999]



```python
cm = confusion_matrix(y_test, Clasificaciones_1)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Clasificaciones_1))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_40_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "SVM Bow S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosSVM = df_ResultadosSVM.append(nueva_fila,ignore_index=True)
```


# BOW + Stopwords




















```python
from sklearn.feature_extraction.text import CountVectorizer #bolsa de palabras y pasamos las stop words.

X_train = df_movies_train['clean_text'].values
y_train = df_movies_train['Clasification'].values
X_test = df_movies_test['clean_text'].values
y_test = df_movies_test['Clasification'].values

#X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 123)
vector = CountVectorizer() #Stopwords

X_train_bow = vector.fit_transform(X_train)
X_test_bow = vector.transform(X_test)
```


```python
X_train_bow.shape, X_test_bow.shape
```




    ((25000, 121393), (25000, 121393))



## Naives Bayes


```python
start = time.time()
bayes_pred = MultinomialNB()
bayes_pred.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)


start = time.time()
predictions = bayes_pred.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
```

    Tiempo de entrenamiento:  0.03652048110961914
    Tiempo de predicción:  0.0345156192779541



```python
print(classification_report(y_test, predictions))
precision = precision_score(y_test, predictions)
print("Precisión del modelo: ",precision)
```

                  precision    recall  f1-score   support
    
               0       0.78      0.88      0.83     12500
               1       0.86      0.76      0.81     12500
    
        accuracy                           0.82     25000
       macro avg       0.82      0.82      0.82     25000
    weighted avg       0.82      0.82      0.82     25000
    
    Precisión del modelo:  0.861927359007118



```python
cm = confusion_matrix(y_test, predictions)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(y_test))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_48_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "NB Bow C/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosNB = df_ResultadosNB.append(nueva_fila,ignore_index=True)
```

## Decision Tree


```python
start = time.time()
ClasificacionAD = DecisionTreeClassifier(criterion='gini',random_state=0)
ClasificacionAD.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  33.369805097579956



```python
start = time.time()
Y_ClasificacionAD = ClasificacionAD.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)

```

    Tiempo de predicción:  0.05244636535644531



```python
print(Y_ClasificacionAD)
print(classification_report(y_test, Y_ClasificacionAD))
precision = precision_score(y_test, Y_ClasificacionAD)
print("Precisión del modelo: ",precision)
```

    [1 0 1 ... 0 1 0]
                  precision    recall  f1-score   support
    
               0       0.71      0.71      0.71     12500
               1       0.71      0.71      0.71     12500
    
        accuracy                           0.71     25000
       macro avg       0.71      0.71      0.71     25000
    weighted avg       0.71      0.71      0.71     25000
    
    Precisión del modelo:  0.7120884402787792



```python
cm = confusion_matrix(y_test, Y_ClasificacionAD)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Y_ClasificacionAD))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_54_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "Arbol Bow C/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosArbol = df_ResultadosArbol.append(nueva_fila,ignore_index=True)

```

## Support Vector Machine


```python
start = time.time()
ModeloSVM_1 = SVC(kernel='linear')
ModeloSVM_1.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  2405.1553246974945



```python
start = time.time()
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
print(Clasificaciones_1)

#pd.DataFrame(Clasificaciones_1)

Clasificaciones = pd.DataFrame(y_test, Clasificaciones_1)
Clasificaciones

#Se calcula la exactitud promedio de la validación
ModeloSVM_1.score(X_test_bow, y_test)

#### **Validación del modelo**

#Matriz de clasificación
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
Matriz_Clasificacion = pd.crosstab(y_test.ravel(),
                                   Clasificaciones_1,
                                   rownames=['Real'],
                                   colnames=['Clasificación'])
Matriz_Clasificacion


#Reporte de la clasificación
print("Exactitud", ModeloSVM_1.score(X_test_bow, y_test))
print(classification_report(y_test, Clasificaciones_1))
precision = ModeloSVM_1.score(X_test_bow, y_test)
print("Precisión del modelo: ",precision)

VectoresSoporte_1 = ModeloSVM_1.support_vectors_
pd.DataFrame(VectoresSoporte_1)

#Vectores de soporte
print('Número de vectores de soporte: \n', ModeloSVM_1.n_support_)
print('Vectores de soporte: \n', ModeloSVM_1.support_)

```


    ---------------------------------------------------------------------------

    NameError                                 Traceback (most recent call last)

    <ipython-input-3-a264d478e497> in <cell line: 1>()
    ----> 1 start = time.time()
          2 Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
          3 predict_time = time.time()-start
          4 print("Tiempo de predicción: ", predict_time)
          5 print(Clasificaciones_1)


    NameError: name 'time' is not defined



```python
cm = confusion_matrix(y_test, Clasificaciones_1)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Clasificaciones_1))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_59_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "SVM Bow C/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosSVM = df_ResultadosSVM.append(nueva_fila,ignore_index=True)
```

# BOW + stemming without stopwords


```python
# import nltk
# nltk.download('punkt')
# from nltk.stem import PorterStemmer
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords

# ps = PorterStemmer ()


# def stem_w(text):  #funcion obtenida de chatGPT
#   words = nltk.word_tokenize(text)
#   stemmed_words = [ps.stem(word) for word in words]
#   return ' '.join(stemmed_words)


# df_movies_train['stemmed_clean_text'] = df_movies_train['clean_text'].apply(stem_w)
# df_movies_test['stemmed_clean_text'] = df_movies_test['clean_text'].apply(stem_w)

```


```python
from sklearn.feature_extraction.text import CountVectorizer #bolsa de palabras y pasamos las stop words.

X_train = df_movies_train['stemmed_clean_text'].values
y_train = df_movies_train['Clasification'].values
X_test = df_movies_test['stemmed_clean_text'].values
y_test = df_movies_test['Clasification'].values

#X = df_movies['stemmed_clean_text'].values
#y = df_movies['Clasification'].values

#X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 123)
vector = CountVectorizer(stop_words = 'english') #Stopwords

X_train_bow = vector.fit_transform(X_train)
X_test_bow = vector.transform(X_test)
```


```python
X_train_bow.shape, X_test_bow.shape
```




    ((25000, 92786), (25000, 92786))



## Naives Bayes


```python
start = time.time()
bayes_pred = MultinomialNB()
bayes_pred.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)


start = time.time()
predictions = bayes_pred.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
```

    Tiempo de entrenamiento:  0.02794933319091797
    Tiempo de predicción:  0.02498912811279297



```python
print(classification_report(y_test, predictions))
precision = precision_score(y_test, predictions)
print("Precisión del modelo: ",precision)
```

                  precision    recall  f1-score   support
    
               0       0.78      0.87      0.82     12500
               1       0.86      0.75      0.80     12500
    
        accuracy                           0.81     25000
       macro avg       0.82      0.81      0.81     25000
    weighted avg       0.82      0.81      0.81     25000
    
    Precisión del modelo:  0.8558836892321672



```python
cm = confusion_matrix(y_test, predictions)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(y_test))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_68_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "NB Bow Stemming S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosNB = df_ResultadosNB.append(nueva_fila,ignore_index=True)
```

## Decision Tree


```python

start = time.time()
ClasificacionAD = DecisionTreeClassifier(criterion='gini',random_state=0)
ClasificacionAD.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  23.932796955108643



```python
start = time.time()
Y_ClasificacionAD = ClasificacionAD.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)

```

    Tiempo de predicción:  0.0424807071685791



```python
print(Y_ClasificacionAD)
print(classification_report(y_test, Y_ClasificacionAD))
precision = precision_score(y_test, Y_ClasificacionAD)
print("Precisión del modelo: ",precision)
```

    [1 0 0 ... 1 1 0]
                  precision    recall  f1-score   support
    
               0       0.72      0.72      0.72     12500
               1       0.72      0.71      0.72     12500
    
        accuracy                           0.72     25000
       macro avg       0.72      0.72      0.72     25000
    weighted avg       0.72      0.72      0.72     25000
    
    Precisión del modelo:  0.7207061300510162



```python
cm = confusion_matrix(y_test, Y_ClasificacionAD)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Y_ClasificacionAD))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_74_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "Arbol Bow Stemming S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosArbol = df_ResultadosArbol.append(nueva_fila,ignore_index=True)
```

## Support Vector Machine


```python
start = time.time()
ModeloSVM_1 = SVC(kernel='linear')
ModeloSVM_1.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  1245.8498668670654



```python
start = time.time()
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
print(Clasificaciones_1)

#pd.DataFrame(Clasificaciones_1)

Clasificaciones = pd.DataFrame(y_test, Clasificaciones_1)
Clasificaciones

#Se calcula la exactitud promedio de la validación
ModeloSVM_1.score(X_test_bow, y_test)

#### **Validación del modelo**

#Matriz de clasificación
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
Matriz_Clasificacion = pd.crosstab(y_test.ravel(),
                                   Clasificaciones_1,
                                   rownames=['Real'],
                                   colnames=['Clasificación'])
Matriz_Clasificacion


#Reporte de la clasificación
print("Exactitud", ModeloSVM_1.score(X_test_bow, y_test))
print(classification_report(y_test, Clasificaciones_1))
precision = ModeloSVM_1.score(X_test_bow, y_test)
print("Precisión del modelo: ",precision)

VectoresSoporte_1 = ModeloSVM_1.support_vectors_
pd.DataFrame(VectoresSoporte_1)

#Vectores de soporte
print('Número de vectores de soporte: \n', ModeloSVM_1.n_support_)
print('Vectores de soporte: \n', ModeloSVM_1.support_)

```

    Tiempo de predicción:  123.06663370132446
    [0 0 0 ... 1 1 0]
    Exactitud 0.83188
                  precision    recall  f1-score   support
    
               0       0.82      0.85      0.83     12500
               1       0.84      0.82      0.83     12500
    
        accuracy                           0.83     25000
       macro avg       0.83      0.83      0.83     25000
    weighted avg       0.83      0.83      0.83     25000
    
    Precisión del modelo:  0.83188
    Número de vectores de soporte: 
     [3888 3973]
    Vectores de soporte: 
     [    2     3     5 ... 24996 24997 24999]



```python
cm = confusion_matrix(y_test, Clasificaciones_1)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Clasificaciones_1))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_79_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "SVM Bow Stemming S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosSVM = df_ResultadosSVM.append(nueva_fila,ignore_index=True)
```

# BOW + lematización + eliminando stopwords


```python
# from nltk.stem import WordNetLemmatizer
# from nltk.tokenize import word_tokenize
# nltk.download('wordnet')
# from nltk.corpus import stopwords

# lemmatizer = WordNetLemmatizer()


# def lemmatize_words(text):  #funcion obtenida con chatgpt
#     words = word_tokenize(text)
#     lemmatized_words = [lemmatizer.lemmatize(word, pos='v') for word in words]
#     return ' '.join(lemmatized_words)


# df_movies_train['lem_clean_text'] = df_movies_train['clean_text'].apply(lemmatize_words)
# df_movies_test['lem_clean_text'] = df_movies_test['clean_text'].apply(lemmatize_words)

# print(df_movies_train)
```


```python
from sklearn.feature_extraction.text import CountVectorizer #bolsa de palabras y pasamos las stop words.

#X = df_movies['lem_clean_text'].values
#y = df_movies['Clasification'].values

X_train = df_movies_train['lem_clean_text'].values
y_train = df_movies_train['Clasification'].values
X_test = df_movies_test['lem_clean_text'].values
y_test = df_movies_test['Clasification'].values


#X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 123)
vector = CountVectorizer(stop_words = 'english') #Stopwords

X_train_bow = vector.fit_transform(X_train)
X_test_bow = vector.transform(X_test)
```


```python
X_train_bow.shape, X_test_bow.shape
```




    ((25000, 109928), (25000, 109928))



## Naives Bayes


```python
start = time.time()
bayes_pred = MultinomialNB()
bayes_pred.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)


start = time.time()
predictions = bayes_pred.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
```

    Tiempo de entrenamiento:  0.02453017234802246
    Tiempo de predicción:  0.02644038200378418



```python
print(classification_report(y_test, predictions))
precision = precision_score(y_test, predictions)
print("Precisión del modelo: ",precision)
```

                  precision    recall  f1-score   support
    
               0       0.79      0.88      0.83     12500
               1       0.86      0.76      0.81     12500
    
        accuracy                           0.82     25000
       macro avg       0.82      0.82      0.82     25000
    weighted avg       0.82      0.82      0.82     25000
    
    Precisión del modelo:  0.860177151120752



```python
cm = confusion_matrix(y_test, predictions)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(y_test))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_88_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "NB Bow Lematización S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosNB = df_ResultadosNB.append(nueva_fila,ignore_index=True)
```

## Decision Tree


```python
start = time.time()
ClasificacionAD = DecisionTreeClassifier(criterion='gini',random_state=0)
ClasificacionAD.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  25.144221782684326



```python
start = time.time()
Y_ClasificacionAD = ClasificacionAD.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)

```

    Tiempo de predicción:  0.03499341011047363



```python
print(Y_ClasificacionAD)
print(classification_report(y_test, Y_ClasificacionAD))
precision = precision_score(y_test, Y_ClasificacionAD)
print("Precisión del modelo: ",precision)
```

    [0 0 0 ... 1 1 0]
                  precision    recall  f1-score   support
    
               0       0.73      0.73      0.73     12500
               1       0.73      0.73      0.73     12500
    
        accuracy                           0.73     25000
       macro avg       0.73      0.73      0.73     25000
    weighted avg       0.73      0.73      0.73     25000
    
    Precisión del modelo:  0.7282442748091603



```python
cm = confusion_matrix(y_test, Y_ClasificacionAD)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Y_ClasificacionAD))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_94_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "Arbol Bow Lematización S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosArbol = df_ResultadosArbol.append(nueva_fila,ignore_index=True)
```

## Support Vector Machine


```python
start = time.time()
ModeloSVM_1 = SVC(kernel='linear')
ModeloSVM_1.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)

```

    Tiempo de entrenamiento:  1085.8809096813202



```python
start = time.time()
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
print(Clasificaciones_1)

#pd.DataFrame(Clasificaciones_1)

Clasificaciones = pd.DataFrame(y_test, Clasificaciones_1)
Clasificaciones

#Se calcula la exactitud promedio de la validación
ModeloSVM_1.score(X_test_bow, y_test)

#### **Validación del modelo**

#Matriz de clasificación
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
Matriz_Clasificacion = pd.crosstab(y_test.ravel(),
                                   Clasificaciones_1,
                                   rownames=['Real'],
                                   colnames=['Clasificación'])
Matriz_Clasificacion


#Reporte de la clasificación
print("Exactitud", ModeloSVM_1.score(X_test_bow, y_test))
print(classification_report(y_test, Clasificaciones_1))
precision = ModeloSVM_1.score(X_test_bow, y_test)
print("Precisión del modelo: ",precision)

VectoresSoporte_1 = ModeloSVM_1.support_vectors_
pd.DataFrame(VectoresSoporte_1)

#Vectores de soporte
print('Número de vectores de soporte: \n', ModeloSVM_1.n_support_)
print('Vectores de soporte: \n', ModeloSVM_1.support_)

```

    Tiempo de predicción:  119.12732028961182
    [0 0 0 ... 1 1 0]
    Exactitud 0.83316
                  precision    recall  f1-score   support
    
               0       0.82      0.85      0.84     12500
               1       0.84      0.82      0.83     12500
    
        accuracy                           0.83     25000
       macro avg       0.83      0.83      0.83     25000
    weighted avg       0.83      0.83      0.83     25000
    
    Precisión del modelo:  0.83316
    Número de vectores de soporte: 
     [4057 4150]
    Vectores de soporte: 
     [    0     2     3 ... 24991 24992 24999]



```python
cm = confusion_matrix(y_test, Clasificaciones_1)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Clasificaciones_1))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_99_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "SVM Bow Lematización S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosSVM = df_ResultadosSVM.append(nueva_fila,ignore_index=True)
```

# TF-IDF eliminando stopwords


```python

X_train = df_movies_train['clean_text'].values
y_train = df_movies_train['Clasification'].values
X_test = df_movies_test['clean_text'].values
y_test = df_movies_test['Clasification'].values

#X_train, X_test, y_train, y_test = train_test_split(X,y, test_size = 0.25, random_state = 123)

tfidf = TfidfVectorizer(stop_words = 'english')
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)


```


```python
X_train_tfidf.shape, X_test_tfidf.shape
```




    ((25000, 121083), (25000, 121083))



## Naive Bayes


```python
start = time.time()
bayes_pred = MultinomialNB()
bayes_pred.fit(X_train_tfidf, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)


start = time.time()
predictions = bayes_pred.predict(X_test_tfidf)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
```

    Tiempo de entrenamiento:  0.03955984115600586
    Tiempo de predicción:  0.019536733627319336



```python
print(classification_report(y_test, predictions))
precision = precision_score(y_test, predictions)
print("Precisión del modelo: ",precision)
```

                  precision    recall  f1-score   support
    
               0       0.81      0.88      0.84     12500
               1       0.87      0.79      0.83     12500
    
        accuracy                           0.84     25000
       macro avg       0.84      0.84      0.83     25000
    weighted avg       0.84      0.84      0.83     25000
    
    Precisión del modelo:  0.8670403783831129



```python
cm = confusion_matrix(y_test, predictions)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(y_test))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_107_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "NB TF-IDF S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosNB = df_ResultadosNB.append(nueva_fila,ignore_index=True)
```

## Decision Tree


```python

start = time.time()
ClasificacionAD = DecisionTreeClassifier(criterion='gini',random_state=0)
ClasificacionAD.fit(X_train_tfidf, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  36.19351077079773



```python
start = time.time()
Y_ClasificacionAD = ClasificacionAD.predict(X_test_tfidf)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)

```

    Tiempo de predicción:  0.08188772201538086



```python
print(Y_ClasificacionAD)
print(classification_report(y_test, Y_ClasificacionAD))
precision = precision_score(y_test, Y_ClasificacionAD)
print("Precisión del modelo: ",precision)
```

    [0 1 0 ... 1 1 1]
                  precision    recall  f1-score   support
    
               0       0.71      0.72      0.71     12500
               1       0.71      0.71      0.71     12500
    
        accuracy                           0.71     25000
       macro avg       0.71      0.71      0.71     25000
    weighted avg       0.71      0.71      0.71     25000
    
    Precisión del modelo:  0.7137657715949531



```python
cm = confusion_matrix(y_test, Y_ClasificacionAD)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Y_ClasificacionAD))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_113_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "Arbol TF-IDF S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosArbol = df_ResultadosArbol.append(nueva_fila,ignore_index=True)
```

## Support Vector Machine


```python
start = time.time()
ModeloSVM_1 = SVC(kernel='linear')
ModeloSVM_1.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  1080.6168222427368



```python
start = time.time()
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
print(Clasificaciones_1)

#pd.DataFrame(Clasificaciones_1)

Clasificaciones = pd.DataFrame(y_test, Clasificaciones_1)
Clasificaciones

#Se calcula la exactitud promedio de la validación
ModeloSVM_1.score(X_test_bow, y_test)

#### **Validación del modelo**

#Matriz de clasificación
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
Matriz_Clasificacion = pd.crosstab(y_test.ravel(),
                                   Clasificaciones_1,
                                   rownames=['Real'],
                                   colnames=['Clasificación'])
Matriz_Clasificacion


#Reporte de la clasificación
print("Exactitud", ModeloSVM_1.score(X_test_bow, y_test))
print(classification_report(y_test, Clasificaciones_1))
precision = ModeloSVM_1.score(X_test_bow, y_test)
print("Precisión del modelo: ",precision)

VectoresSoporte_1 = ModeloSVM_1.support_vectors_
pd.DataFrame(VectoresSoporte_1)

#Vectores de soporte
print('Número de vectores de soporte: \n', ModeloSVM_1.n_support_)
print('Vectores de soporte: \n', ModeloSVM_1.support_)

```

    Tiempo de predicción:  118.84722876548767
    [0 0 0 ... 1 1 0]
    Exactitud 0.83316
                  precision    recall  f1-score   support
    
               0       0.82      0.85      0.84     12500
               1       0.84      0.82      0.83     12500
    
        accuracy                           0.83     25000
       macro avg       0.83      0.83      0.83     25000
    weighted avg       0.83      0.83      0.83     25000
    
    Precisión del modelo:  0.83316
    Número de vectores de soporte: 
     [4057 4150]
    Vectores de soporte: 
     [    0     2     3 ... 24991 24992 24999]



```python
cm = confusion_matrix(y_test, Clasificaciones_1)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Clasificaciones_1))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_118_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "SVM TF-IDF S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosSVM = df_ResultadosSVM.append(nueva_fila,ignore_index=True)
```

# TF-IDF incluyendo stopwords


```python
X_train = df_movies_train['clean_text'].values
y_train = df_movies_train['Clasification'].values
X_test = df_movies_test['clean_text'].values
y_test = df_movies_test['Clasification'].values

#X_train, X_test, y_train, y_test = train_test_split(X,y, test_size = 0.25, random_state = 123)

tfidf = TfidfVectorizer()
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

```


```python
X_train_tfidf.shape, X_test_tfidf.shape
```




    ((25000, 121393), (25000, 121393))



## Naive Bayes


```python
start = time.time()
bayes_pred = MultinomialNB()
bayes_pred.fit(X_train_tfidf, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)



start = time.time()
predictions = bayes_pred.predict(X_test_tfidf)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
```

    Tiempo de entrenamiento:  0.03901267051696777
    Tiempo de predicción:  0.025968074798583984



```python
print(classification_report(y_test, predictions))
precision = precision_score(y_test, predictions)
print("Precisión del modelo: ",precision)
```


    ---------------------------------------------------------------------------

    NameError                                 Traceback (most recent call last)

    <ipython-input-1-8ba3f41196a9> in <cell line: 1>()
    ----> 1 print(classification_report(y_test, predictions))
          2 precision = precision_score(y_test, predictions)
          3 print("Precisión del modelo: ",precision)


    NameError: name 'classification_report' is not defined



```python
cm = confusion_matrix(y_test, predictions)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(y_test))
disp.plot()
plt.show()
```


    ---------------------------------------------------------------------------

    NameError                                 Traceback (most recent call last)

    <ipython-input-2-f604d53274e4> in <cell line: 1>()
    ----> 1 cm = confusion_matrix(y_test, predictions)
          2 
          3 # plot the confusion matrix
          4 disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(y_test))
          5 disp.plot()


    NameError: name 'confusion_matrix' is not defined



```python
nueva_fila = {"Tipo de modelo" : "NB TF-IDF C/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosNB = df_ResultadosNB.append(nueva_fila,ignore_index=True)
```

## Decision Tree


```python

start = time.time()
ClasificacionAD = DecisionTreeClassifier(criterion='gini',random_state=0)
ClasificacionAD.fit(X_train_tfidf, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  34.11984419822693



```python
start = time.time()
Y_ClasificacionAD = ClasificacionAD.predict(X_test_tfidf)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
```

    Tiempo de predicción:  0.1033027172088623



```python
print(Y_ClasificacionAD)
print(classification_report(y_test, Y_ClasificacionAD))
precision = precision_score(y_test, Y_ClasificacionAD)
print("Precisión del modelo: ",precision)
```

    [1 1 1 ... 0 1 1]
                  precision    recall  f1-score   support
    
               0       0.70      0.70      0.70     12500
               1       0.70      0.70      0.70     12500
    
        accuracy                           0.70     25000
       macro avg       0.70      0.70      0.70     25000
    weighted avg       0.70      0.70      0.70     25000
    
    Precisión del modelo:  0.6959680638722555



```python
cm = confusion_matrix(y_test, Y_ClasificacionAD)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Y_ClasificacionAD))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_132_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "Arbol TF-IDF C/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosArbol = df_ResultadosArbol.append(nueva_fila,ignore_index=True)
```

## Support Vector Machine


```python
start = time.time()
ModeloSVM_1 = SVC(kernel='linear')
ModeloSVM_1.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  1051.8271927833557



```python
start = time.time()
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
print(Clasificaciones_1)

#pd.DataFrame(Clasificaciones_1)

Clasificaciones = pd.DataFrame(y_test, Clasificaciones_1)
Clasificaciones

#Se calcula la exactitud promedio de la validación
ModeloSVM_1.score(X_test_bow, y_test)

#### **Validación del modelo**

#Matriz de clasificación
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
Matriz_Clasificacion = pd.crosstab(y_test.ravel(),
                                   Clasificaciones_1,
                                   rownames=['Real'],
                                   colnames=['Clasificación'])
Matriz_Clasificacion


#Reporte de la clasificación
print("Exactitud", ModeloSVM_1.score(X_test_bow, y_test))
print(classification_report(y_test, Clasificaciones_1))
precision = ModeloSVM_1.score(X_test_bow, y_test)
print("Precisión del modelo: ",precision)

VectoresSoporte_1 = ModeloSVM_1.support_vectors_
pd.DataFrame(VectoresSoporte_1)

#Vectores de soporte
print('Número de vectores de soporte: \n', ModeloSVM_1.n_support_)
print('Vectores de soporte: \n', ModeloSVM_1.support_)
```

    Tiempo de predicción:  116.98048520088196
    [0 0 0 ... 1 1 0]
    Exactitud 0.83316
                  precision    recall  f1-score   support
    
               0       0.82      0.85      0.84     12500
               1       0.84      0.82      0.83     12500
    
        accuracy                           0.83     25000
       macro avg       0.83      0.83      0.83     25000
    weighted avg       0.83      0.83      0.83     25000
    
    Precisión del modelo:  0.83316
    Número de vectores de soporte: 
     [4057 4150]
    Vectores de soporte: 
     [    0     2     3 ... 24991 24992 24999]



```python
cm = confusion_matrix(y_test, Clasificaciones_1)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Clasificaciones_1))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_137_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "SVM TF-IDF C/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosSVM = df_ResultadosSVM.append(nueva_fila,ignore_index=True)
```

# TF-IDF con stemming y eliminando stopwords


```python
# import nltk
# nltk.download('punkt')
# from nltk.stem import PorterStemmer
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords

# ps = PorterStemmer ()
# nltk.download('stopwords')
# stop_words = set(stopwords.words('english'))


# def stem_w(text):  #funcion obtenida de chatGPT
#   words = nltk.word_tokenize(text)
#   stemmed_words = [ps.stem(word) for word in words]
#   filter_words = [word for word in stemmed_words if word not in stop_words]
#   return ' '.join(filter_words)


# df_movies_train['stemmed_clean_text'] = df_movies_train['clean_text'].apply(stem_w)
# df_movies_test['stemmed_clean_text'] = df_movies_test['clean_text'].apply(stem_w)

```


```python

#X = df_movies['stemmed_clean_text'].values
#y = df_movies['Clasification'].values


X_train = df_movies_train['stemmed_clean_text'].values
y_train = df_movies_train['Clasification'].values
X_test = df_movies_test['stemmed_clean_text'].values
y_test = df_movies_test['Clasification'].values

#X_train, X_test, y_train, y_test = train_test_split(X,y, test_size = 0.25, random_state = 123)

tfidf = TfidfVectorizer()
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)


```


```python
X_train_tfidf.shape, X_test_tfidf.shape
```




    ((25000, 92948), (25000, 92948))



## Naive Bayes


```python
start = time.time()
bayes_pred = MultinomialNB()
bayes_pred.fit(X_train_tfidf, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)


start = time.time()
predictions = bayes_pred.predict(X_test_tfidf)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
```

    Tiempo de entrenamiento:  0.029557466506958008
    Tiempo de predicción:  0.01747608184814453



```python
print(classification_report(y_test, predictions))
precision = precision_score(y_test, predictions)
print("Precisión del modelo: ",precision)
```

                  precision    recall  f1-score   support
    
               0       0.80      0.88      0.84     12500
               1       0.86      0.78      0.82     12500
    
        accuracy                           0.83     25000
       macro avg       0.83      0.83      0.83     25000
    weighted avg       0.83      0.83      0.83     25000
    
    Precisión del modelo:  0.8626319992900878



```python
cm = confusion_matrix(y_test, predictions)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(y_test))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_146_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "NB TF-IDF Stemming S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosNB = df_ResultadosNB.append(nueva_fila,ignore_index=True)
```

## Decision Tree


```python

start = time.time()
ClasificacionAD = DecisionTreeClassifier(criterion='gini',random_state=0)
ClasificacionAD.fit(X_train_tfidf, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  27.582786321640015



```python
start = time.time()
Y_ClasificacionAD = ClasificacionAD.predict(X_test_tfidf)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
```

    Tiempo de predicción:  0.0964956283569336



```python
print(Y_ClasificacionAD)
print(classification_report(y_test, Y_ClasificacionAD))
precision = precision_score(y_test, Y_ClasificacionAD)
print("Precisión del modelo: ",precision)
```

    [1 0 0 ... 1 0 0]
                  precision    recall  f1-score   support
    
               0       0.72      0.72      0.72     12500
               1       0.72      0.71      0.72     12500
    
        accuracy                           0.72     25000
       macro avg       0.72      0.72      0.72     25000
    weighted avg       0.72      0.72      0.72     25000
    
    Precisión del modelo:  0.716360426863516



```python
cm = confusion_matrix(y_test, Y_ClasificacionAD)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Y_ClasificacionAD))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_152_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "Arbol TF-IDF Stemming S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosArbol = df_ResultadosArbol.append(nueva_fila,ignore_index=True)
```

## Support Vector Machine


```python
start = time.time()
ModeloSVM_1 = SVC(kernel='linear')
ModeloSVM_1.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  1111.6969285011292



```python
start = time.time()
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
print(Clasificaciones_1)

#pd.DataFrame(Clasificaciones_1)

Clasificaciones = pd.DataFrame(y_test, Clasificaciones_1)
Clasificaciones

#Se calcula la exactitud promedio de la validación
ModeloSVM_1.score(X_test_bow, y_test)

#### **Validación del modelo**

#Matriz de clasificación
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
Matriz_Clasificacion = pd.crosstab(y_test.ravel(),
                                   Clasificaciones_1,
                                   rownames=['Real'],
                                   colnames=['Clasificación'])
Matriz_Clasificacion


#Reporte de la clasificación
print("Exactitud", ModeloSVM_1.score(X_test_bow, y_test))
print(classification_report(y_test, Clasificaciones_1))
precision = ModeloSVM_1.score(X_test_bow, y_test)
print("Precisión del modelo: ",precision)

VectoresSoporte_1 = ModeloSVM_1.support_vectors_
pd.DataFrame(VectoresSoporte_1)

#Vectores de soporte
print('Número de vectores de soporte: \n', ModeloSVM_1.n_support_)
print('Vectores de soporte: \n', ModeloSVM_1.support_)

```

    Tiempo de predicción:  128.9149305820465
    [0 0 0 ... 1 1 0]
    Exactitud 0.83316
                  precision    recall  f1-score   support
    
               0       0.82      0.85      0.84     12500
               1       0.84      0.82      0.83     12500
    
        accuracy                           0.83     25000
       macro avg       0.83      0.83      0.83     25000
    weighted avg       0.83      0.83      0.83     25000
    
    Precisión del modelo:  0.83316
    Número de vectores de soporte: 
     [4057 4150]
    Vectores de soporte: 
     [    0     2     3 ... 24991 24992 24999]



```python
cm = confusion_matrix(y_test, Clasificaciones_1)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Clasificaciones_1))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_157_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "SVM TF-IDF Stemming S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosSVM = df_ResultadosSVM.append(nueva_fila,ignore_index=True)
```

# TF-IDF con lematización y eliminando stopwords


```python
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer

# vectorizer = TfidfVectorizer()

# tfidf_matrix = vectorizer.fit_transform(df_movies['stemmed_clean_text'])

# print(tfidf_matrix)

# tfidf_df = pd.DataFrame(tfidf_matrix.toarray())

# print(tfidf_df)
# print(vectorizer.vocabulary_)
# print(vectorizer.idf_)
```


```python
# from nltk.stem import WordNetLemmatizer
# from nltk.tokenize import word_tokenize
# nltk.download('wordnet')
# from nltk.corpus import stopwords

# lemmatizer = WordNetLemmatizer()
# nltk.download('stopwords')
# stop_words = set(stopwords.words('english'))

# def lemmatize_words(text):  #funcion obtenida con chatgpt
#     words = word_tokenize(text)
#     lemmatized_words = [lemmatizer.lemmatize(word, pos='v') for word in words]
#     filter_words = [word for word in lemmatized_words if word not in stop_words]
#     return ' '.join(filter_words)


# df_movies_train['lem_clean_text'] = df_movies_train['clean_text'].apply(lemmatize_words)
# df_movies_test['lem_clean_text'] = df_movies_test['clean_text'].apply(lemmatize_words)

# print(df_movies_train)
```


```python

#X = df_movies['lem_clean_text'].values
#y = df_movies['Clasification'].values

X_train = df_movies_train['lem_clean_text'].values
y_train = df_movies_train['Clasification'].values
X_test = df_movies_test['lem_clean_text'].values
y_test = df_movies_test['Clasification'].values

#X_train, X_test, y_train, y_test = train_test_split(X,y, test_size = 0.25, random_state = 123)

tfidf = TfidfVectorizer()
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)


```


```python
X_train_tfidf.shape, X_test_tfidf.shape
```




    ((25000, 110170), (25000, 110170))



## Naive Bayes


```python
start = time.time()
bayes_pred = MultinomialNB()
bayes_pred.fit(X_train_tfidf, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)


start = time.time()
predictions = bayes_pred.predict(X_test_tfidf)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
```

    Tiempo de entrenamiento:  0.03466224670410156
    Tiempo de predicción:  0.019474506378173828



```python
print(classification_report(y_test, predictions))
precision = precision_score(y_test, predictions)
print("Precisión del modelo: ",precision)
```

                  precision    recall  f1-score   support
    
               0       0.80      0.88      0.84     12500
               1       0.87      0.78      0.82     12500
    
        accuracy                           0.83     25000
       macro avg       0.83      0.83      0.83     25000
    weighted avg       0.83      0.83      0.83     25000
    
    Precisión del modelo:  0.8669147616516037



```python
cm = confusion_matrix(y_test, predictions)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(y_test))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_167_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "NB TF-IDF Lematización S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosNB = df_ResultadosNB.append(nueva_fila,ignore_index=True)
```

## Decision Tree


```python

start = time.time()
ClasificacionAD = DecisionTreeClassifier(criterion='gini',random_state=0)
ClasificacionAD.fit(X_train_tfidf, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  28.504585027694702



```python
start = time.time()
Y_ClasificacionAD = ClasificacionAD.predict(X_test_tfidf)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)

```

    Tiempo de predicción:  0.09986639022827148



```python
print(Y_ClasificacionAD)
print(classification_report(y_test, Y_ClasificacionAD))
precision = precision_score(y_test, Y_ClasificacionAD)
print("Precisión del modelo: ",precision)
```

    [1 0 0 ... 1 1 0]
                  precision    recall  f1-score   support
    
               0       0.70      0.73      0.71     12500
               1       0.72      0.69      0.70     12500
    
        accuracy                           0.71     25000
       macro avg       0.71      0.71      0.71     25000
    weighted avg       0.71      0.71      0.71     25000
    
    Precisión del modelo:  0.7160391441366728



```python
cm = confusion_matrix(y_test, Y_ClasificacionAD)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Y_ClasificacionAD))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_173_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "Arbol TF-IDF Lematización S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosArbol = df_ResultadosArbol.append(nueva_fila,ignore_index=True)
```

## Support Vector Machine


```python
start = time.time()
ModeloSVM_1 = SVC(kernel='linear')
ModeloSVM_1.fit(X_train_bow, y_train)
train_time = time.time()-start
print("Tiempo de entrenamiento: ", train_time)
```

    Tiempo de entrenamiento:  1110.5319106578827



```python
start = time.time()
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
predict_time = time.time()-start
print("Tiempo de predicción: ", predict_time)
print(Clasificaciones_1)

#pd.DataFrame(Clasificaciones_1)

Clasificaciones = pd.DataFrame(y_test, Clasificaciones_1)
Clasificaciones

#Se calcula la exactitud promedio de la validación
ModeloSVM_1.score(X_test_bow, y_test)

#### **Validación del modelo**

#Matriz de clasificación
Clasificaciones_1 = ModeloSVM_1.predict(X_test_bow)
Matriz_Clasificacion = pd.crosstab(y_test.ravel(),
                                   Clasificaciones_1,
                                   rownames=['Real'],
                                   colnames=['Clasificación'])
Matriz_Clasificacion


#Reporte de la clasificación
print("Exactitud", ModeloSVM_1.score(X_test_bow, y_test))
print(classification_report(y_test, Clasificaciones_1))
precision = ModeloSVM_1.score(X_test_bow, y_test)
print("Precisión del modelo: ",precision)

VectoresSoporte_1 = ModeloSVM_1.support_vectors_
pd.DataFrame(VectoresSoporte_1)

#Vectores de soporte
print('Número de vectores de soporte: \n', ModeloSVM_1.n_support_)
print('Vectores de soporte: \n', ModeloSVM_1.support_)

```

    Tiempo de predicción:  143.66255927085876
    [0 0 0 ... 1 1 0]
    Exactitud 0.83316
                  precision    recall  f1-score   support
    
               0       0.82      0.85      0.84     12500
               1       0.84      0.82      0.83     12500
    
        accuracy                           0.83     25000
       macro avg       0.83      0.83      0.83     25000
    weighted avg       0.83      0.83      0.83     25000
    
    Precisión del modelo:  0.83316
    Número de vectores de soporte: 
     [4057 4150]
    Vectores de soporte: 
     [    0     2     3 ... 24991 24992 24999]



```python
cm = confusion_matrix(y_test, Clasificaciones_1)

# plot the confusion matrix
disp = ConfusionMatrixDisplay(cm, display_labels=np.unique(Clasificaciones_1))
disp.plot()
plt.show()
```


    
![png](Programa1_BasileKellerVFinalTodosLosDatos_files/Programa1_BasileKellerVFinalTodosLosDatos_178_0.png)
    



```python
nueva_fila = {"Tipo de modelo" : "SVM TF-IDF Lematización S/Stw", "Train Time" : train_time, "Predict Time": predict_time, "Precision":precision}
df_ResultadosSVM = df_ResultadosSVM.append(nueva_fila,ignore_index=True)
```

# Results Table


```python
# ResultadosNB = {"Tipo de modelo Naive Bayes:" : ["BOW - Sin stopwords", "BOW - Con Stopwords","BOW - Stemming S/StW", "BOW - Lematización S/StW", "TF-IDF - Con Stopwords", "TF-IDF - Sin stopwords","TF-IDF - Stemming S/StW", "TF-IDF - Lematización S/StW"],
#               "Train Time: " : ["0.066", "0.034", "0.031", "0.036", "0.032", "0.041", "0.033", "0.046"],
#               "Predict Time: " : ["0.022", "0.009", "0.006", "0.007", "0.003", "0.015", "0.011", "0.007"],
#               "Precision: " : ["85%", "85%", "85%", "85%", "86%", "86%", "86%", "86%"]}
# dfResultadosNB = pd.DataFrame(ResultadosNB)
# print(dfResultadosNB)

# ResultadosArbol = {"Tipo de modelo Árbol:" : ["BOW - Sin stopwords", "BOW - Con Stopwords","BOW - Stemming S/StW", "BOW - Lematización S/StW", "TF-IDF - Con Stopwords", "TF-IDF - Sin stopwords","TF-IDF - Stemming S/StW", "TF-IDF - Lematización S/StW"],
#               "Train Time: " : ["90.390", "29.573", "15.702", "19.603", "21.931", "30.729", "20.238", "25.697"],
#               "Predict Time: " : ["0.029", "0.018", "0.018", "0.010", "0.021", "0.038", "0.038", "0.040"],
#               "Precision: " : ["72%", "71%", "71%", "72%", "71%", "70%", "71%", "71%"]}
# dfResultadosArbol = pd.DataFrame(ResultadosArbol)
# print(dfResultadosArbol)

# ResultadosSVM = {"Tipo de modelo SVM:" : ["BOW - Sin stopwords", "BOW - Con Stopwords","BOW - Stemming S/StW", "BOW - Lematización S/StW", "TF-IDF - Con Stopwords", "TF-IDF - Sin stopwords","TF-IDF - Stemming S/StW", "TF-IDF - Lematización S/StW"],
#               "Train Time: " : ["761.632", "894.791", "466.566", "437.948", "471.674", "441.488", "476.732", "514.449"],
#               "Train Time: " : ["32.550", "58.589", "29.143", "28.229", "27.392", "29.952", "29.307", "31.287"],
#               "Precision: " : ["86%", "86%", "85%", "85%", "85%", "85%", "85%", "85%"]}
# dfResultadosSVM = pd.DataFrame(ResultadosSVM)
# print(dfResultadosSVM)
```


```python
print(df_ResultadosNB,df_ResultadosArbol,df_ResultadosSVM)
```

                     Tipo de modelo  Train Time  Predict Time  Precision
    0                  NB Bow S/Stw    0.026520      0.025522   0.864086
    1                  NB Bow C/Stw    0.036520      0.034516   0.861927
    2         NB Bow Stemming S/Stw    0.027949      0.024989   0.855884
    3     NB Bow Lematización S/Stw    0.024530      0.026440   0.860177
    4               NB TF-IDF S/Stw    0.039560      0.019537   0.867040
    5               NB TF-IDF C/Stw    0.039013      0.025968   0.879223
    6      NB TF-IDF Stemming S/Stw    0.029557      0.017476   0.862632
    7  NB TF-IDF Lematización S/Stw    0.034662      0.019475   0.866915                     Tipo de modelo  Train Time  Predict Time  Precision
    0                  Arbol Bow S/Stw   28.542007      0.041974   0.729267
    1                  Arbol Bow C/Stw   33.369805      0.052446   0.712088
    2         Arbol Bow Stemming S/Stw   23.932797      0.042481   0.720706
    3     Arbol Bow Lematización S/Stw   25.144222      0.034993   0.728244
    4               Arbol TF-IDF S/Stw   36.193511      0.081888   0.713766
    5               Arbol TF-IDF C/Stw   34.119844      0.103303   0.695968
    6      Arbol TF-IDF Stemming S/Stw   27.582786      0.096496   0.716360
    7  Arbol TF-IDF Lematización S/Stw   28.504585      0.099866   0.716039                   Tipo de modelo   Train Time  Predict Time  Precision
    0                  SVM Bow S/Stw  1083.498923    129.170357    0.83924
    1                  SVM Bow C/Stw  2405.155325    201.661782    0.85120
    2         SVM Bow Stemming S/Stw  1245.849867    123.066634    0.83188
    3     SVM Bow Lematización S/Stw  1085.880910    119.127320    0.83316
    4               SVM TF-IDF S/Stw  1080.616822    118.847229    0.83316
    5               SVM TF-IDF C/Stw  1051.827193    116.980485    0.83316
    6      SVM TF-IDF Stemming S/Stw  1111.696929    128.914931    0.83316
    7  SVM TF-IDF Lematización S/Stw  1110.531911    143.662559    0.83316


# Conclusions

During this exercise, we worked with "BOW" (Bag of Words) and "TF-IDF" vector representations, applying various classification algorithms to categorize movie reviews as either "positive" or "negative."

To achieve this, we implemented several variations of the algorithms: including stopwords, removing stopwords, performing stemming and removing stopwords, and performing lemmatization while removing stopwords. From these models, we observed that the algorithms with the highest accuracy were Naive Bayes and Support Vector Machines (SVM), achieving approximately 86% and 83% accuracy, respectively. However, the significantly longer time required to train and predict new classifications using SVMs, compared to the Naive Bayes algorithm, makes the latter much more suitable for this application.

It was initially considered that future tests should analyze the possibility of working with the complete dataset, as excessive training and execution times posed challenges during this exercise. As a result, we initially decided to use only the test dataset, splitting it into two subsets: one for training (containing 75% of the data) and another for testing (containing 25% of the data). However, in this new phase, tests were conducted using the full datasets, which increased the accuracy of the Naive Bayes algorithm while also significantly raising the training and testing times for the SVMs.