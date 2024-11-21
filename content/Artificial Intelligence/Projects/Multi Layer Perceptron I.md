> [!info] Multi Layer Perceptron
> In deep learning, a multilayer perceptron (MLP) is a name for a modern feedforward neural network consisting of fully connected neurons with nonlinear activation functions, organized in layers, notable for being able to distinguish data that is not linearly separable. [Wikipedia](https://en.wikipedia.org/wiki/Multilayer_perceptron)


### Basile Álvarez Andrés José


```python
from google.colab import drive
drive.mount('/content/drive')
```

    Mounted at /content/drive


- Dataset: https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset

## 1.- Preprocesamiento


```python
import pandas as pd
```


```python

from google.colab import files
uploaded = files.upload()

```



     <input type="file" id="files-a568f61c-4487-4505-812b-275011bc9fcb" name="files[]" multiple disabled
        style="border:none" />
     <output id="result-a568f61c-4487-4505-812b-275011bc9fcb">
      Upload widget is only available when the cell has been executed in the
      current browser session. Please rerun this cell to enable.
      </output>
      <script>// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Helpers for google.colab Python module.
 */
(function(scope) {
function span(text, styleAttributes = {}) {
  const element = document.createElement('span');
  element.textContent = text;
  for (const key of Object.keys(styleAttributes)) {
    element.style[key] = styleAttributes[key];
  }
  return element;
}

// Max number of bytes which will be uploaded at a time.
const MAX_PAYLOAD_SIZE = 100 * 1024;

function _uploadFiles(inputId, outputId) {
  const steps = uploadFilesStep(inputId, outputId);
  const outputElement = document.getElementById(outputId);
  // Cache steps on the outputElement to make it available for the next call
  // to uploadFilesContinue from Python.
  outputElement.steps = steps;

  return _uploadFilesContinue(outputId);
}

// This is roughly an async generator (not supported in the browser yet),
// where there are multiple asynchronous steps and the Python side is going
// to poll for completion of each step.
// This uses a Promise to block the python side on completion of each step,
// then passes the result of the previous step as the input to the next step.
function _uploadFilesContinue(outputId) {
  const outputElement = document.getElementById(outputId);
  const steps = outputElement.steps;

  const next = steps.next(outputElement.lastPromiseValue);
  return Promise.resolve(next.value.promise).then((value) => {
    // Cache the last promise value to make it available to the next
    // step of the generator.
    outputElement.lastPromiseValue = value;
    return next.value.response;
  });
}

/**
 * Generator function which is called between each async step of the upload
 * process.
 * @param {string} inputId Element ID of the input file picker element.
 * @param {string} outputId Element ID of the output display.
 * @return {!Iterable<!Object>} Iterable of next steps.
 */
function* uploadFilesStep(inputId, outputId) {
  const inputElement = document.getElementById(inputId);
  inputElement.disabled = false;

  const outputElement = document.getElementById(outputId);
  outputElement.innerHTML = '';

  const pickedPromise = new Promise((resolve) => {
    inputElement.addEventListener('change', (e) => {
      resolve(e.target.files);
    });
  });

  const cancel = document.createElement('button');
  inputElement.parentElement.appendChild(cancel);
  cancel.textContent = 'Cancel upload';
  const cancelPromise = new Promise((resolve) => {
    cancel.onclick = () => {
      resolve(null);
    };
  });

  // Wait for the user to pick the files.
  const files = yield {
    promise: Promise.race([pickedPromise, cancelPromise]),
    response: {
      action: 'starting',
    }
  };

  cancel.remove();

  // Disable the input element since further picks are not allowed.
  inputElement.disabled = true;

  if (!files) {
    return {
      response: {
        action: 'complete',
      }
    };
  }

  for (const file of files) {
    const li = document.createElement('li');
    li.append(span(file.name, {fontWeight: 'bold'}));
    li.append(span(
        `(${file.type || 'n/a'}) - ${file.size} bytes, ` +
        `last modified: ${
            file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() :
                                    'n/a'} - `));
    const percent = span('0% done');
    li.appendChild(percent);

    outputElement.appendChild(li);

    const fileDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    });
    // Wait for the data to be ready.
    let fileData = yield {
      promise: fileDataPromise,
      response: {
        action: 'continue',
      }
    };

    // Use a chunked sending to avoid message size limits. See b/62115660.
    let position = 0;
    do {
      const length = Math.min(fileData.byteLength - position, MAX_PAYLOAD_SIZE);
      const chunk = new Uint8Array(fileData, position, length);
      position += length;

      const base64 = btoa(String.fromCharCode.apply(null, chunk));
      yield {
        response: {
          action: 'append',
          file: file.name,
          data: base64,
        },
      };

      let percentDone = fileData.byteLength === 0 ?
          100 :
          Math.round((position / fileData.byteLength) * 100);
      percent.textContent = `${percentDone}% done`;

    } while (position < fileData.byteLength);
  }

  // All done.
  yield {
    response: {
      action: 'complete',
    }
  };
}

scope.google = scope.google || {};
scope.google.colab = scope.google.colab || {};
scope.google.colab._files = {
  _uploadFiles,
  _uploadFilesContinue,
};
})(self);
</script> 



```python
fake_df = pd.read_csv('Fake.csv')  
true_df = pd.read_csv('True.csv')  
```


```python
fake_df.head()
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
      <th>title</th>
      <th>text</th>
      <th>subject</th>
      <th>date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Donald Trump Sends Out Embarrassing New Year’...</td>
      <td>Donald Trump just couldn t wish all Americans ...</td>
      <td>News</td>
      <td>December 31, 2017</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Drunk Bragging Trump Staffer Started Russian ...</td>
      <td>House Intelligence Committee Chairman Devin Nu...</td>
      <td>News</td>
      <td>December 31, 2017</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Sheriff David Clarke Becomes An Internet Joke...</td>
      <td>On Friday, it was revealed that former Milwauk...</td>
      <td>News</td>
      <td>December 30, 2017</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Trump Is So Obsessed He Even Has Obama’s Name...</td>
      <td>On Christmas day, Donald Trump announced that ...</td>
      <td>News</td>
      <td>December 29, 2017</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Pope Francis Just Called Out Donald Trump Dur...</td>
      <td>Pope Francis used his annual Christmas Day mes...</td>
      <td>News</td>
      <td>December 25, 2017</td>
    </tr>
  </tbody>
</table>
</div>



- Agregar etiquetas de clase


```python
fake_df['target'] = 1
true_df['target'] = 0
```


```python
len(fake_df), len(true_df)
```




    (23481, 21417)




```python
fake_df.tail()
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
      <th>title</th>
      <th>text</th>
      <th>subject</th>
      <th>date</th>
      <th>target</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>23476</th>
      <td>McPain: John McCain Furious That Iran Treated ...</td>
      <td>21st Century Wire says As 21WIRE reported earl...</td>
      <td>Middle-east</td>
      <td>January 16, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>23477</th>
      <td>JUSTICE? Yahoo Settles E-mail Privacy Class-ac...</td>
      <td>21st Century Wire says It s a familiar theme. ...</td>
      <td>Middle-east</td>
      <td>January 16, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>23478</th>
      <td>Sunnistan: US and Allied ‘Safe Zone’ Plan to T...</td>
      <td>Patrick Henningsen  21st Century WireRemember ...</td>
      <td>Middle-east</td>
      <td>January 15, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>23479</th>
      <td>How to Blow $700 Million: Al Jazeera America F...</td>
      <td>21st Century Wire says Al Jazeera America will...</td>
      <td>Middle-east</td>
      <td>January 14, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>23480</th>
      <td>10 U.S. Navy Sailors Held by Iranian Military ...</td>
      <td>21st Century Wire says As 21WIRE predicted in ...</td>
      <td>Middle-east</td>
      <td>January 12, 2016</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
</div>



- Crea un df de los dos archivos


```python
df = pd.concat([true_df, fake_df])
df = df.reset_index(drop=True) # Create id to avoid nan and replicate id bug
df.head()
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
      <th>title</th>
      <th>text</th>
      <th>subject</th>
      <th>date</th>
      <th>target</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>As U.S. budget fight looms, Republicans flip t...</td>
      <td>WASHINGTON (Reuters) - The head of a conservat...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>U.S. military to accept transgender recruits o...</td>
      <td>WASHINGTON (Reuters) - Transgender people will...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Senior U.S. Republican senator: 'Let Mr. Muell...</td>
      <td>WASHINGTON (Reuters) - The special counsel inv...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>FBI Russia probe helped by Australian diplomat...</td>
      <td>WASHINGTON (Reuters) - Trump campaign adviser ...</td>
      <td>politicsNews</td>
      <td>December 30, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Trump wants Postal Service to charge 'much mor...</td>
      <td>SEATTLE/WASHINGTON (Reuters) - President Donal...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
</div>




```python
df.tail()
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
      <th>title</th>
      <th>text</th>
      <th>subject</th>
      <th>date</th>
      <th>target</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>44893</th>
      <td>McPain: John McCain Furious That Iran Treated ...</td>
      <td>21st Century Wire says As 21WIRE reported earl...</td>
      <td>Middle-east</td>
      <td>January 16, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>44894</th>
      <td>JUSTICE? Yahoo Settles E-mail Privacy Class-ac...</td>
      <td>21st Century Wire says It s a familiar theme. ...</td>
      <td>Middle-east</td>
      <td>January 16, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>44895</th>
      <td>Sunnistan: US and Allied ‘Safe Zone’ Plan to T...</td>
      <td>Patrick Henningsen  21st Century WireRemember ...</td>
      <td>Middle-east</td>
      <td>January 15, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>44896</th>
      <td>How to Blow $700 Million: Al Jazeera America F...</td>
      <td>21st Century Wire says Al Jazeera America will...</td>
      <td>Middle-east</td>
      <td>January 14, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>44897</th>
      <td>10 U.S. Navy Sailors Held by Iranian Military ...</td>
      <td>21st Century Wire says As 21WIRE predicted in ...</td>
      <td>Middle-east</td>
      <td>January 12, 2016</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
</div>



- Verifica cadenas vacias


```python
df['text'].isna().sum()
```




    0




```python
len(df)
```




    44898



- Elimina duplicados


```python
df = df.drop_duplicates(subset=['text'])
len(df)
```




    38646




```python
df.head(10)
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
      <th>title</th>
      <th>text</th>
      <th>subject</th>
      <th>date</th>
      <th>target</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>As U.S. budget fight looms, Republicans flip t...</td>
      <td>WASHINGTON (Reuters) - The head of a conservat...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>U.S. military to accept transgender recruits o...</td>
      <td>WASHINGTON (Reuters) - Transgender people will...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Senior U.S. Republican senator: 'Let Mr. Muell...</td>
      <td>WASHINGTON (Reuters) - The special counsel inv...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>FBI Russia probe helped by Australian diplomat...</td>
      <td>WASHINGTON (Reuters) - Trump campaign adviser ...</td>
      <td>politicsNews</td>
      <td>December 30, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Trump wants Postal Service to charge 'much mor...</td>
      <td>SEATTLE/WASHINGTON (Reuters) - President Donal...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>5</th>
      <td>White House, Congress prepare for talks on spe...</td>
      <td>WEST PALM BEACH, Fla./WASHINGTON (Reuters) - T...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Trump says Russia probe will be fair, but time...</td>
      <td>WEST PALM BEACH, Fla (Reuters) - President Don...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Factbox: Trump on Twitter (Dec 29) - Approval ...</td>
      <td>The following statements were posted to the ve...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Trump on Twitter (Dec 28) - Global Warming</td>
      <td>The following statements were posted to the ve...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>9</th>
      <td>Alabama official to certify Senator-elect Jone...</td>
      <td>WASHINGTON (Reuters) - Alabama Secretary of St...</td>
      <td>politicsNews</td>
      <td>December 28, 2017</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
</div>




```python
df.sort_values(by='text', ascending=True, inplace=False)
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
      <th>title</th>
      <th>text</th>
      <th>subject</th>
      <th>date</th>
      <th>target</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>8970</th>
      <td>Graphic: Supreme Court roundup</td>
      <td></td>
      <td>politicsNews</td>
      <td>June 16, 2016</td>
      <td>0</td>
    </tr>
    <tr>
      <th>33661</th>
      <td>TRUMP SLAMS THE GLOBALISTS: “There is no globa...</td>
      <td></td>
      <td>politics</td>
      <td>Dec 1, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>35094</th>
      <td>MUSLIM INVASION OF AMERICA In Full Swing: Obam...</td>
      <td>(Welcome) to America We hope you enjoy our...</td>
      <td>politics</td>
      <td>Jun 17, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>32062</th>
      <td>WOW! MAJOR CREDIT CARD COMPANY Still Sponsorin...</td>
      <td>Delta Air Lines and Bank of America became ...</td>
      <td>politics</td>
      <td>Jun 12, 2017</td>
      <td>1</td>
    </tr>
    <tr>
      <th>33502</th>
      <td>A MUST WATCH! “It’s Time To Show America Is Bi...</td>
      <td>#PresidentElectTrumpABSOLUTELY MUST WATCHTod...</td>
      <td>politics</td>
      <td>Dec 21, 2016</td>
      <td>1</td>
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
      <th>33499</th>
      <td>OHIO ELECTOR TORCHES Anti-Trump Letters He Rec...</td>
      <td>pic.twitter.com/KMnLrwB6t1  Richard K. Jones (...</td>
      <td>politics</td>
      <td>Dec 21, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>42714</th>
      <td>EMBARRASSING: Obama Explains How He Will ‘Rebu...</td>
      <td>re buke r byo ok/ verb 1. express sharp disapp...</td>
      <td>left-news</td>
      <td>Nov 25, 2015</td>
      <td>1</td>
    </tr>
    <tr>
      <th>36178</th>
      <td>BLACK LIVES MATTER TERRORISTS May Be Shut Down...</td>
      <td>ter ror ist  ter r st/ noun a person who uses ...</td>
      <td>politics</td>
      <td>Dec 23, 2015</td>
      <td>1</td>
    </tr>
    <tr>
      <th>38658</th>
      <td>BIG BROTHER: FEDS WANT YOUR DOCTOR TO WARN YOU...</td>
      <td>totally out of bounds! This is so wrong and so...</td>
      <td>Government News</td>
      <td>Jun 26, 2015</td>
      <td>1</td>
    </tr>
    <tr>
      <th>34364</th>
      <td>GRAPHIC RIOT VIDEOS EXPOSE THUGS ATTACKING ELD...</td>
      <td>youngers these days are becoming so moist pic....</td>
      <td>politics</td>
      <td>Sep 22, 2016</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
<p>38646 rows × 5 columns</p>
</div>




```python
df.loc[8970].text
```




    ' '



- Elimina cadenas de espacios


```python
df = df[df['text'].str.strip() != '']
df
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
      <th>title</th>
      <th>text</th>
      <th>subject</th>
      <th>date</th>
      <th>target</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>As U.S. budget fight looms, Republicans flip t...</td>
      <td>WASHINGTON (Reuters) - The head of a conservat...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>U.S. military to accept transgender recruits o...</td>
      <td>WASHINGTON (Reuters) - Transgender people will...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Senior U.S. Republican senator: 'Let Mr. Muell...</td>
      <td>WASHINGTON (Reuters) - The special counsel inv...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>FBI Russia probe helped by Australian diplomat...</td>
      <td>WASHINGTON (Reuters) - Trump campaign adviser ...</td>
      <td>politicsNews</td>
      <td>December 30, 2017</td>
      <td>0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Trump wants Postal Service to charge 'much mor...</td>
      <td>SEATTLE/WASHINGTON (Reuters) - President Donal...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
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
      <th>44115</th>
      <td>The White House and The Theatrics of ‘Gun Cont...</td>
      <td>21st Century Wire says All the world s a stage...</td>
      <td>US_News</td>
      <td>January 7, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>44116</th>
      <td>Activists or Terrorists? How Media Controls an...</td>
      <td>Randy Johnson 21st Century WireThe majority ...</td>
      <td>US_News</td>
      <td>January 7, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>44117</th>
      <td>BOILER ROOM – No Surrender, No Retreat, Heads ...</td>
      <td>Tune in to the Alternate Current Radio Network...</td>
      <td>US_News</td>
      <td>January 6, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>44118</th>
      <td>Federal Showdown Looms in Oregon After BLM Abu...</td>
      <td>21st Century Wire says A new front has just op...</td>
      <td>US_News</td>
      <td>January 4, 2016</td>
      <td>1</td>
    </tr>
    <tr>
      <th>44119</th>
      <td>A Troubled King: Chicago’s Rahm Emanuel Desper...</td>
      <td>21st Century Wire says It s not that far away....</td>
      <td>US_News</td>
      <td>January 2, 2016</td>
      <td>1</td>
    </tr>
  </tbody>
</table>
<p>38644 rows × 5 columns</p>
</div>




```python
df = df.reset_index(drop=True)
```


```python
len(df)
```




    38644



- Crea nueva columna añadiendo el título al texto


```python
df['clean_text'] = df['title']+ df['text']
```


```python
df
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
      <th>title</th>
      <th>text</th>
      <th>subject</th>
      <th>date</th>
      <th>target</th>
      <th>clean_text</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>As U.S. budget fight looms, Republicans flip t...</td>
      <td>WASHINGTON (Reuters) - The head of a conservat...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
      <td>As U.S. budget fight looms, Republicans flip t...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>U.S. military to accept transgender recruits o...</td>
      <td>WASHINGTON (Reuters) - Transgender people will...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
      <td>U.S. military to accept transgender recruits o...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Senior U.S. Republican senator: 'Let Mr. Muell...</td>
      <td>WASHINGTON (Reuters) - The special counsel inv...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
      <td>Senior U.S. Republican senator: 'Let Mr. Muell...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>FBI Russia probe helped by Australian diplomat...</td>
      <td>WASHINGTON (Reuters) - Trump campaign adviser ...</td>
      <td>politicsNews</td>
      <td>December 30, 2017</td>
      <td>0</td>
      <td>FBI Russia probe helped by Australian diplomat...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Trump wants Postal Service to charge 'much mor...</td>
      <td>SEATTLE/WASHINGTON (Reuters) - President Donal...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
      <td>Trump wants Postal Service to charge 'much mor...</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>38639</th>
      <td>The White House and The Theatrics of ‘Gun Cont...</td>
      <td>21st Century Wire says All the world s a stage...</td>
      <td>US_News</td>
      <td>January 7, 2016</td>
      <td>1</td>
      <td>The White House and The Theatrics of ‘Gun Cont...</td>
    </tr>
    <tr>
      <th>38640</th>
      <td>Activists or Terrorists? How Media Controls an...</td>
      <td>Randy Johnson 21st Century WireThe majority ...</td>
      <td>US_News</td>
      <td>January 7, 2016</td>
      <td>1</td>
      <td>Activists or Terrorists? How Media Controls an...</td>
    </tr>
    <tr>
      <th>38641</th>
      <td>BOILER ROOM – No Surrender, No Retreat, Heads ...</td>
      <td>Tune in to the Alternate Current Radio Network...</td>
      <td>US_News</td>
      <td>January 6, 2016</td>
      <td>1</td>
      <td>BOILER ROOM – No Surrender, No Retreat, Heads ...</td>
    </tr>
    <tr>
      <th>38642</th>
      <td>Federal Showdown Looms in Oregon After BLM Abu...</td>
      <td>21st Century Wire says A new front has just op...</td>
      <td>US_News</td>
      <td>January 4, 2016</td>
      <td>1</td>
      <td>Federal Showdown Looms in Oregon After BLM Abu...</td>
    </tr>
    <tr>
      <th>38643</th>
      <td>A Troubled King: Chicago’s Rahm Emanuel Desper...</td>
      <td>21st Century Wire says It s not that far away....</td>
      <td>US_News</td>
      <td>January 2, 2016</td>
      <td>1</td>
      <td>A Troubled King: Chicago’s Rahm Emanuel Desper...</td>
    </tr>
  </tbody>
</table>
<p>38644 rows × 6 columns</p>
</div>



- Elimina puntuación y convierte a minúsculas
- Se utiliza el método __str.translate()__ para eliminar todos los caracteres de puntuación mediante una tabla de traducción creada con el método __str.maketrans__. La constante string.punctuation contiene todos los caracteres de puntuación ASCII, que se eliminan de los valores en la columna


```python
import string
```


```python
df['clean_text'] = df['clean_text'].str.lower().str.translate(str.maketrans('', '', string.punctuation))
df.head()
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
      <th>title</th>
      <th>text</th>
      <th>subject</th>
      <th>date</th>
      <th>target</th>
      <th>clean_text</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>As U.S. budget fight looms, Republicans flip t...</td>
      <td>WASHINGTON (Reuters) - The head of a conservat...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
      <td>as us budget fight looms republicans flip thei...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>U.S. military to accept transgender recruits o...</td>
      <td>WASHINGTON (Reuters) - Transgender people will...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
      <td>us military to accept transgender recruits on ...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Senior U.S. Republican senator: 'Let Mr. Muell...</td>
      <td>WASHINGTON (Reuters) - The special counsel inv...</td>
      <td>politicsNews</td>
      <td>December 31, 2017</td>
      <td>0</td>
      <td>senior us republican senator let mr mueller do...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>FBI Russia probe helped by Australian diplomat...</td>
      <td>WASHINGTON (Reuters) - Trump campaign adviser ...</td>
      <td>politicsNews</td>
      <td>December 30, 2017</td>
      <td>0</td>
      <td>fbi russia probe helped by australian diplomat...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Trump wants Postal Service to charge 'much mor...</td>
      <td>SEATTLE/WASHINGTON (Reuters) - President Donal...</td>
      <td>politicsNews</td>
      <td>December 29, 2017</td>
      <td>0</td>
      <td>trump wants postal service to charge much more...</td>
    </tr>
  </tbody>
</table>
</div>



## 2.- Pipeline


```python
df['target'].value_counts()
```




    0    21191
    1    17453
    Name: target, dtype: int64




```python
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' # Disable tensorflow debugging logs
import tensorflow as tf
from tensorflow.keras.layers import TextVectorization
from tensorflow.keras import Sequential
from tensorflow.keras import layers 
import re
from sklearn.model_selection import train_test_split

X = df['clean_text'].values
y = df['target'].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.25, random_state = 123)
```


```python
len(X_train), len(X_test)
```




    (28983, 9661)




```python
raw_train_ds = tf.data.Dataset.from_tensor_slices((X_train, y_train))
raw_val_ds = tf.data.Dataset.from_tensor_slices((X_test, y_test))
for text in raw_train_ds.take(1):
    print(text)
```

    (<tf.Tensor: shape=(), dtype=string, numpy=b'boom republican wins montana election after \xe2\x80\x9cbodyslamming\xe2\x80\x9d reporter \xe2\x80\x98i\xe2\x80\x99m sick and tired of this\xe2\x80\x99this is just too rich the democrats threw tons of money into this race and then the republican candidate  bodyslammed  an obnoxious reporter it seemed like the dems really couldn t lose this one bernie s socialist candidate would win in montana the democrats were sure they could run leftists and win in red states not so fastrepublican businessman greg gianforte won montana s sole house district in a special election thursday keeping a seat in republican hands despite facing assault charges for allegedly attacking a reporter who d asked him about the gop s healthcare billthe best ever quote from the  bodyslamming  incident is when gianforte spoke for all americans  i m sick and tired of this after he won he commented on the incident in his victory speech i shouldn t have treated that reporter that way  he told supporters at his rally hereplease check out gianforte s twitter page it s full of great photos of things he s done he makes his own sausage and even gave his wife a sausage maker for christmas he posts photos of his wild game dinners that look amazing this guy is a blast'>, <tf.Tensor: shape=(), dtype=int64, numpy=1>)



```python
# Tamaño de vocabulario
vocab_size = 10000

vectorize_layer = TextVectorization(
    standardize=None,
    max_tokens=vocab_size,
    output_mode='tf-idf')

# Obtener el texto sin etiquetas
text_ds = raw_train_ds.map(lambda x, y: x)
vectorize_layer.adapt(text_ds)
```


```python
batch_size = 16
train_ds = raw_train_ds.shuffle(20000).batch(batch_size)
val_ds = raw_val_ds.batch(batch_size)
```


```python
for inp, target in train_ds.take(1):
    print(inp)
```

    tf.Tensor(
    [b'german police hunt former raf guerrillas for suspected robberyberlin reuters  german police on monday published videos showing three former members of the red army faction raf militant group taking part in a 2016 armed robbery in northern germany and called for public help to track them down the leftwing militia which arose out of the student protests of the late 1960s was suspected of killing 34 people between 1972 and 1991 the group formally disbanded in 1998 with many members slipping back into ordinary lives  the three former members being sought  two men and a woman aged between 49 and 63  have been on the run for more than 25 years since 2011 they have been suspected of involvement in robberies in which more than 370000 euros have been stolen from supermarkets and money transfer stores the new security camera videos from july 2016 show two men strolling into a supermarket in the central city of hildesheim with their faces covered before they suddenly raise a gun at one of the employees and force him into a room  the other video showed the two standing in a bus in osnabruck lower saxony carrying bulging backpacks googl7u811o german police officers have visited more than 4000 car dealers to trace the suspects who buy cheap cars weeks before their robberies a reward of 80000 euros has been offered to anyone who provides significant information about them the raf captured world headlines in 1977 with their kidnapping and killing of industrialist hanns martin schleyer they hoped to secure the release of guerrilla comrades held in a high security prison in stuttgart twenty years ago german authorities said they believed most of raf s members were either dead in jail or now living  ordinary  lives '
     b'modi says india shares myanmars concern about extremist violencenaypyitaw reuters  prime minister narendra modi said on wednesday that india shared myanmar s concern about  extremist violence  in its rakhine state where a security force operation against muslim rebels has sent about 125000 people fleeing to bangladesh modi spoke after talks with myanmar s de facto leader aung san suu kyi during a visit aimed at expanding commercial ties as part of an  act east  policy and pushing back against chinese influence  myanmar has come under international pressure after some 125000 rohingya muslims fled from a surge of violence in rakhine state beginning with an aug 25 attack by rohingya insurgents on dozens of police posts and an army base the rebel attacks triggered a sweep by the myanmar security forces in which refugees and right groups say many innocent rohingya have been targeted buddhistmajority myanmar rejects accusations by refugees and rights groups that its armed forces have violated the rights of the mostly stateless rohingya saying the army and police are fighting  terrorists  mostly hindu india has faced years of attacks by islamist militants  suu kyi told a joint news conference at the presidential palace in the capital naypyitaw that myanmar was grateful for india s stance on the attack on her country and they could work together to face the challenge  we would like to thank india particularly for its strong that it has taken with regard to terrorist threat that came to our country a couple of weeks ago  she said in brief remarks  we believe that together we can work to make sure that terrorism is not allowed to take root on our soil  modi said india and myanmar had similar security interests in the region    we share your concerns about extremist violence in rakhine state and specially the violence against security forces and how innocent lives have been affected  he said    we hope that all the stakeholders together can find a way out in which the unity and territorial integrity of myanmar is respected and at the same time we can have peace justice dignity and democratic values for all  modi s government has taken a strong stance on an influx into india of some 40000 rohingya from myanmar over the years vowing last month to deport them all that decision has drawn criticism from rights groups and prompted a petition in the supreme court to stop the government from doing so         international concern in particular from muslim countries is growing about the latest exodus of rohingya turkish president tayyip erdogan has pressed world leaders to do more to help the population of roughly 11 million saying they are facing genocide un secretarygeneral antonio guterres warned on tuesday of the risk of ethnic cleansing and regional destabilization india is trying to boost economic ties with resourcerich myanmar with which it shares a 1600km 1000mile border to counter chinese influence and step up links with a country it considers its gateway to southeast asia twoway trade has grown to about 22 billion as india courts myanmar following the gradual end of military rule but indianfunded projects have moved slowly india recently started exporting diesel to myanmar via a land route in a boost to modi s pledge to enhance hydrocarbon trade with neighbors '
     b'michigan governor issues appeal over flint funds denialreuters  michigan governor rick snyder has urged federal officials to reconsider their denial for funds to help deal with the crisis caused by leadcontaminated water in the city of flint his office said on thursday  the contamination and the state\xe2\x80\x99s long delay in addressing the problem have sparked outrage and drawn attention from us presidential candidates in the latest appeal to the federal emergency management agency snyder is requesting money to pay for food water and other essential needs the removal of health and safety hazards activation of emergency operations centers measures to avoid further damage and homeowners\xe2\x80\x99 repairs not covered by insurance a fema spokesman said snyder\xe2\x80\x99s appeal was under review by the agency the agency turned down an earlier request for financial help in january because the areas in which snyder requested aid were deemed not appropriate but has provided nonmonetary support in the form of a fema coordinator  also in january snyder asked for federal declarations of emergency and major disaster president barack obama approved the federal emergency declaration but denied a major disaster declaration snyder appealed that decision and was denied    snyder said on thursday that flint needed continued local state federal and national efforts \xe2\x80\x9cassistance from our federal partners could go a long way in moving flint forward\xe2\x80\x9d he said activists and some democratic state lawmakers have demanded that snyder resign but a spokesman said the republican governor had no intention of stepping down snyder is scheduled to testify before a us congressional committee on march 17 also on thursday snyder said the federal government approved a waiver allowing for medicaid coverage for children and pregnant women in flint flint a predominantly black city of 100000 about 60 miles 100 km northwest of detroit was under the control of a stateappointed emergency manager when it switched the source of its tap water from detroit\xe2\x80\x99s system to the flint river in april 2014     the city switched back last october after tests found high levels of lead in blood samples taken from children water from the flint river which was more corrosive than detroit\xe2\x80\x99s leached lead from the city\xe2\x80\x99s pipes posing widespread health risks experts have said it could take some time for anticorrosive chemicals now being added to the water to recoat pipes so that they will not leach more lead  meanwhile flint officials said they would begin replacing lead pipes running to homes with copper on friday as part of a 55 million project '
     b' msnbc producer reminds idiot trump that \xe2\x80\x98morning joe\xe2\x80\x99s\xe2\x80\x99 ratings are setting record highs tweetdonald trump spent his week on twitter blasting mika brzezinski and joe scarborough hosts of msnbc s morning joe rather than focus on something important like the fact that his party is trying to kick millions of people off of their health care and leave them to die he would rather spout off about the host of a cable news show  bleeding badly from a facelift i heard poorly rated morningjoe speaks badly of me don t watch anymore then how come low iq crazy mika along with psycho joe came  donald j trump realdonaldtrump june 29 2017 to maralago 3 nights in a row around new year s eve and insisted on joining me she was bleeding badly from a facelift i said no  donald j trump realdonaldtrump june 29 2017he continued his attack tweeting about morning joe being  lowrated   fake news  refusing to let it drop he attacked again on saturday writing that scarborough is  crazy  and brzezinski is as  dumb as a rock watched low rated morningjoe for first time in long time fake news he called me to stop a national enquirer article i said no bad show  donald j trump realdonaldtrump june 30 2017crazy joe scarborough and dumb as a rock mika are not bad people but their low rated show is dominated by their nbc bosses too bad  donald j trump realdonaldtrump july 1 2017but msnbc producer jesse rodriguez decided to set the record straight and remind trump that morning joes is currently experiencing record high ratings apparently our tweeterinchief missed the memo that the show had msnbc s highest rating ever in the time period in the key demographic last quarterjust a reminder about the morningjoe ratings httpstcon6gth99siw  jesse rodriguez jesserodriguez july 1 2017thanks to our viewers  morning joe  had msnbc s highest rating ever in the time period in the key demographic last quarter pictwittercomhl2j1scibv  jesse rodriguez jesserodriguez june 27 2017ironically trump s own ratings have been sinking lower by the day maybe instead of attacking women on twitter because he thinks are mean to him on tv he should focus on doing his job and maybe try to not embarrass himself the office of the presidency and our entire country on a daily basis just a thoughtfeatured image via gettyolivier douliery'
     b'huma abedin makes covert visit to dearborn michigan \xe2\x80\x93 home of largest muslim population in usto think that huma abedin had access to top secret state department documents is frightening she and her family have super shady connections to radical muslim groups it s interesting that the local muslim community would have such a controversial person in to make an appearance in michigan the denial continues but the facts are there that prove abedin had no business being an insider in the state department or the white house as revelations broke in recent weeks regarding her role in a radical muslim journal laced with antigay and antifemale comments huma abedin quietly slipped in to michigan for a visit to dearborn dearborn has the largest population of muslims in americathe radical muslim journal also employed her mother and was funded by the saudis according to the arab american news huma abedin vice chair for the hillary for america campaign met with arab and muslim american leaders on aug 11 to discuss issues that matter to the communitycommunity representatives included heads of organizations small business owners doctors lawyers and other professions us rep debbie dingell ddearborn and the retired dean of congress john dingell were also present at the discussion at habib s cuisineabedin was joined by farooq mitha national director of muslim outreach for hillary for americaabedin praised the muslim and arab american communities for their political engagement she highlighted the contrasts between clinton and trumpshe said the republican nominee uses divisive and inflammatory rhetoric against muslims to divide our country while clinton embraces the values and contributions immigrants make to our countryif she s calling  make america safe again  divisive and inflammatory rhetoric then so be it there is nothing wrong with making america safe from terrorists and those who don t hold our beliefs abedin praised the patriotism and heroism of muslims across the country including the khan family a muslim gold star family whose son captain humayun khan was killed in iraq while protecting his fellow service membersthe truth on the khan family that huma abedin claims embrace our valueshillary s  khan man  who is khizr khan the shocking truth about his job his ties to hillary saudi arabia and the muslim brotherhoodabedin also discussed ways to strengthen communities including making college more affordable who pays for this  ensuring small businesses have the resources and support needed to succeed and building an economy that works for everyone not just those at the top redistribution of wealth doesn t work we ve had 8 years with obamaabedin answered individual questions from the audience abedin s publication is full of controversial statementsaccording to the new york post  headlined  women s rights are islamic rights  a 1996 article argues that single moms working moms and gay couples with children should not be recognized as families in a separate january 1996 article abedin s mother   who was the muslim world league s delegate to the un conference   wrote that clinton and other speakers were advancing a  very aggressive and radically feminist  agenda that was unislamic and wrong because it focused on empowering women she seemed to rationalize domestic abuse as a result of  the stress and frustrations that men encounter in their daily lives  while denouncing such violence she didn t think it did much good to punish men for it via wmp'
     b' trump\xe2\x80\x99s deplorables freak out demand we repeal women\xe2\x80\x99s right to vote tweetswomen now have even more of a reason to vote overwhelmingly against trump and the gop on november 8thon tuesday fivethirtyeight s nate silver released a graphic showing that if only men voted trump would win 350 electoral votes to hillary s 188 thus becoming president on the other hand if only women voted hillary would win by an even bigger landslide 458 to 80here s what the map would look line if only women voted httpstcosjvy67qoue pictwittercomrrc3guxmgl  nate silver natesilver538 october 11 2016and here s if just dudes voted pictwittercomhjqjzivwc4  nate silver natesilver538 october 11 2016of course this news immediately sent conservative trump supporters into a rage and now they are calling for repealing the 19th amendment to guarantee that only men can vote so that democrats can never again win the presidencyrepealthe19thhere s why these brainwashed dumb slutbags can vote  decide the future of this countryhttpstcojnnxavxix1   anudapussycaust  libertyslap october 12 2016female suffrage coincides w a ballooning of the state openness to mass 3rd world immigration  accelerated social decay repealthe19th   aberrant harpooner  cruisinggallows october 12 2016repeal it men who have a family  own property should be the only ones allowed to vote anyway repealthe19th  deplorable american skinheadneonazi october 12 2016to prevent the us from becoming brazil repealthe19th pictwittercomqqvd3qre7o  ad benedict  adben october 12 2016women s suffrage is a force of chaos and destruction civilization will collapse under femalepoc coalitionrepealthe19th httpstcodvn5rr43qk  contrarian gent contrariangent october 12 2016give out nice enough handbags and most broads would gladly trade their voting rights for one repealthe19th  michael maier mmaier2112 october 12 2016repealthe19th and fight our cultural suicide    msisatori september 30 2016if women are truly childish enough to not vote for trump since he thought miss universe needed to stay in shape repealthe19thkellyfile   l  c s  t s mrjohnqzombie september 29 2016women reacting to hillaryclinton with tears exaggerated  you go girl  cheers c is a solid argument for why we need to repealthe19th   l  c s  t s mrjohnqzombie september 27 2016this is why we need to repeal and not replace the 19th amendment repealthe19th httpstcobv4wnbgq2h  david mccall woodrowmelkin october 12 2016natesilver538 women are not fit for politics repealthe19th  reichsf hrer pepe smugpepe1488 october 11 2016emmaroller men should never have given women the right to vote repealthe19th  haunted holly   hollyanswers october 11 2016bells8911 villainial repealthe19th  deplorable 13300472 2000ravensd september 15 2016this is how unhinged trump voters are and why it is even more important now than ever before that women exercise their right to vote because if trump and his conservative supporters have their way women will lose itfeatured image the progressive redneck'
     b' trump just bailed on his own pittsburgh not paris rally the reason why is infuriatingthis week donald trump disappointed the entire world by pulling out of the paris climate deal it was a decision that was condemned by several world leaders and marked yet another way that trump had ruined america s standing as a global leader to celebrate his horrible decision trump organized a  pittsburgh not paris  rally to celebrate america s exit from the deal there was just one major problem   trump blew it offthe trump campaign had hyped up this event so much and even organized it to be located right across the street from the white house   put donnie wasn t there he bailed and decided to play golf instead so much for being a dedicated potus and showing his dwindling number of supporters that he appreciates them as his approval ratings continue to plummet to historic lowsthe white house press pool told politicususa after an uneventful ride along highways and byways toward sterling virginia motorcade pulled up to the trump national golf club at 1042 ammotorcade split off and pool is now holding in a spectacular clubhouse overlooking indoor tennis courts if any of trump s supporters still think trump cared about and appreciated them this is a pretty rude awakening when trump s campaign announced the rally it certainly sounded like trump would actually be present however the event invitation was a little more cryptic it said as you know the president has been under siege from the mainstream media and the democrats especially now that he put american jobs first by withdrawing from the paris accord therefore we are organizing a group to demonstrate our support for president trump and his fearless leadership either way these trump supporters expected trump to be there and he wasn t because he was playing golf   his main hobby when he wants to avoid doing his job trump must know that his presidency is doomed because blowing off a rally full of supporters when his popularity is suffering is a bold move to make matters worse this rally couldn t have been more convenient   it was just across the street and yet trump couldn t be botheredfeatured image via chip somodevilla  getty images'
     b'us charges two with bribing african officials for china energy firmwashington reuters  the united states has charged a former senegalese foreign minister and a former top hong kong government official with links to a chinese energy conglomerate with bribing highlevel officials in chad and uganda in exchange for contracts for the mainland company chi ping patrick ho 68 of hong kong and cheikh gadio 61 were charged with violating the foreign corrupt practices act international money laundering and conspiracy the us justice department said in a statement on monday  it said gadio a former foreign minister of senegal was arrested in new york on friday it added that ho a former hong kong home affairs secretary who heads a nongovernmental organization based in hong kong and virginia was arrested on saturday  wiring almost a million dollars through new york s banking system in furtherance of their corrupt schemes the defendants allegedly sought to generate business through bribes paid to the president of chad and the ugandan foreign minister  joon kim acting us attorney for the southern district of new york was quoted as saying in the statement no one could be reached at the embassies of chad and uganda in washington late on monday the missions did not immediately respond to emails requesting comment in a statement the us justice department said the case against ho involved two bribery schemes to pay highlevel officials of chad and uganda in exchange for business advantages for a shanghaiheadquartered multibilliondollar energy firm this energy company funded a nongovernment organization ngo based in hong kong and virginia that ho heads the statement said without naming the shanghai company or the ngo  ho is the secretary general of the hong kongbased china energy fund committee a mainlandbacked thinktank that describes itself as a charitable nongovernment organization  china energy fund committee is fully funded by cefc china energy a shanghaibased private conglomerate according to the think tank s website the organization did not respond to an email requesting comment cefc china energy said in a statement posted on its website late on tuesday that  as a nongovernmental nonprofit organization the fund is not involved in the commercial activities of cefc china energy  cefc does not have any investment in uganda the company said in the statement and its investment in chad had been acquired via a stake bought from taiwan s stateowned chinese petroleum corp and it had not dealt directly with the chad government  the company will continue monitoring this matter and will take necessary measures based on developments  it said cefc has been a key player in chinese president xi jinping s belt and road initiative which aims to bolster china s global leadership ambitions by building infrastructure and trade links between asia africa europe and beyond chinese foreign ministry spokesman lu kang told a regular news briefing tuesday that he was not aware of the specific details of the case  i want to emphasize that the chinese government consistently requires chinese companies abroad to operate lawfully and abide by local laws and regulations   idriss deby has been chad s president since 1990 ugandan foreign minister sam kutesa served as the president of the un general assembly in 2014 and 2015 ho s attorney ed kim of krieger kim  lewin llp declined to comment to reuters bob baum of federal defenders who represented gadio for the bail argument did not immediately respond to a request for comment ho was ordered detained after appearing in court on monday the justice department statement said it said gadio appeared before a judge on saturday and is being held until he can meet the conditions of a 1 million bond according to court records the justice department said a 2 million bribe was paid to chad s president who then provided the company with an opportunity to obtain oil rights in chad without international competition the department said in the statement that gadio was the gobetween and was paid 400000 by ho via wire transfers through new york the justice department accused ho of being involved with bribes and promises of future benefits to uganda s foreign minister in exchange for help in obtaining business advantages for the chinese company        '
     b'senate plans september hearings on health insurance marketwashington reuters  the chairman of the us senate health committee on tuesday urged us president donald trump to drop his threat to cut government subsidy payments to insurers that make obamacare plans affordable and allow the payments through september republican senator lamar alexander said his committee would begin bipartisan hearings on stabilizing the individual health insurance market the week of sept 4 and urged fellow lawmakers to fund the costsharing subsidies for one year '
     b'immigrant dreamers  and their bosses  wait anxiously for trump decisionreuters  ilka eren 25 came to the united states from turkey with her parents more than 15 years ago and lives in the country without legal authorization  while in college she applied and qualified for deferred action for childhood arrivals daca an obamaera program that  president donald trump vowed to end during his 2016 presidential campaign the program does not change an immigrant\xe2\x80\x99s legal status but rather protects from deportation and gives the right to work to socalled \xe2\x80\x9cdreamers\xe2\x80\x9d young people brought to the united states as children and living in the country illegally nearly 800000 immigrants have received daca protection since the program\xe2\x80\x99s launch in 2012 eren\xe2\x80\x99s daca status opened the door to several internships and eventually to a job in new york at ovation travel group which provides travel services to corporations as executive assistant to the chief financial officer \xe2\x80\x9cdaca literally changed my life\xe2\x80\x9d she said \xe2\x80\x9ci really don\xe2\x80\x99t know where i would be without it\xe2\x80\x9d paul metselaar ovation\xe2\x80\x99s chief executive doesn\xe2\x80\x99t know where he\xe2\x80\x99d be without eren  he said her job responsibilities have grown because of her abilities he said she reminded him of his own grandparents who immigrated to the united states to seek a better life if eren were to lose her work eligibility it would be a blow to his company metselaar said but he added \xe2\x80\x9cit would be much more of a blow to her family and to who we are as a country\xe2\x80\x9d trump is expected to announce a decision to end daca on tuesday according to two sources with knowledge of the situation but with a delay of up to six months to allow congress to find a legislative solution on the campaign trail trump promised to quickly repeal the program but since taking office  even as he has stepped up immigration enforcement  he has at times taken a softer tone about daca \xe2\x80\x9cwe love the dreamers\xe2\x80\x9d he told reporters on friday immigration hardliners within the republican party have pressured the president\xc2\xa0to scrap the program nine republican state attorneys general have said they will file a legal challenge to the program if the trump administration does not end it by\xc2\xa0tuesday many business leaders have urged the president to keep daca protections in place including the heads of tech giants microsoft msfto  apple aaplo  and facebook fbo they have generally cited a potential hit to the economy if the program were to end although there is scant government data on dreamers as a distinct economic group still with the us economy at close to full employment ending daca would bring a net loss in productivity said giovanni peri an economics professor at the university of california davis who studies immigration  groups that support stricter immigration enforcement say that eliminating the program would bring benefits too \xe2\x80\x9cthe end of daca would result in muchwelcomed job openings for american college graduates and other american workers who are either unemployed or underemployed and feel completely locked out of the workforce and blocked from achieving their american dream\xe2\x80\x9d said dave ray communications director for the federation for american immigration reform which favors reduced immigration\xc2\xa0 in interviews with reuters daca recipients and their employers emphasized another aspect of what it would mean to end the program the holes such a move would leave in lives and workplaces     georgina lepe who runs a real estate law and probate practice from her office in rancho cucamonga california liked karla martinez so much she hired her twice \xc2\xa0 she first met martinez when she was busing tables at a mexican restaurant owned by lepe\xe2\x80\x99s family and was impressed with her work ethic when martinez graduated from the university of southern california in december 2015 lepe hired her to help temporarily with marketing  martinez left after a few months to work elsewhere lepe later tracked her down and asked her to come back this time as a fulltime legal assistant \xe2\x80\x9ceven when she was working at the restaurant i knew she would be someone\xe2\x80\x9d said lepe who is 30 and like martinez from a mexican family \xe2\x80\x9cthe difference between us is my family was able to help me out financially to achieve my goals\xe2\x80\x9d  martinez who came to the united states with her mother when she was four helps pay the bills in the home she shares with her mother and two younger siblings now 24 she\xe2\x80\x99s planning to apply to law school  if daca doesn\xe2\x80\x99t end and she can still afford to go back to school \xe2\x80\x9cobviously i think about it and it\xe2\x80\x99s a little scary but i don\xe2\x80\x99t let it take over me\xe2\x80\x9d martinez said lepe says if martinez\xe2\x80\x99s work permit is rescinded \xe2\x80\x9ci would keep karla until the very last second\xe2\x80\x9d and probably wouldn\xe2\x80\x99t hire a replacement \xe2\x80\x9ci don\xe2\x80\x99t think anyone can compare\xe2\x80\x9d she says chuck rocha the founder of solidarity strategies employs daca recipient luis alcauter at his washington dcbased political consulting firm which specializes in outreach to latinos losing alcauter \xe2\x80\x9cwould be devastating\xe2\x80\x9d rocha said  alcauter 27 came to the united states from mexico when he was 13 and attended california state university fresno where he developed an interest in politics which led to his interning on capitol hill\xc2\xa0 the internship was possible he said because of his daca status  \xe2\x80\x9cto be able to have the documents and be able to apply wherever you want it really empowers you to think beyond the place you were\xe2\x80\x9d alcauter said \xe2\x80\x9cit just empowers people to be able to find a job to get a car to buy a house to move around to contribute to their families\xe2\x80\x9d juan ochoa ceo of miramar group an illinoisbased facilities management company that oversees 1200 buildings nationwide said his company will hire an attorney to try to keep daca employee jay meza 23 if the program ends \xe2\x80\x9ci have a good job now\xe2\x80\x9d said meza who came to the united states from mexico with his parents and brother when he was 3 years old \xe2\x80\x9ci actually am looking forward to buying my first house i actually have a good car\xe2\x80\x9d ochoa said meza started at miramar doing data entry and analyzing spreadsheets and went on to help the company build a system allowing it to track its buildings and employees \xe2\x80\x9cwe have invested a lot of time and money in training jay and so it would be a significant loss to us\xe2\x80\x9d he said this story corrects year that martinez graduated to 2015 instead of 2016  '
     b'japan says trumpxi call is positive for region spokesmanwashington reuters  japan views us president donald trump\xe2\x80\x99s call with chinese president xi jinping as a good and positive step a spokesman for japan said on friday following the uschina call thursday night nl4n1fv21k \xe2\x80\x9cit\xe2\x80\x99s good and positive in terms of peace and security of the region and the international community\xe2\x80\x9d norio maruyama told reporters during a news conference  \xe2\x80\x9cwe consider that it is constructive and frank discussions on the terms relating to the peace and security in the regions this is the right way forward\xe2\x80\x9d '
     b' trump claims \xe2\x80\x98any negative polls\xe2\x80\x99 are \xe2\x80\x98fake news\xe2\x80\x99 and gets savaged by the internet tweetsdonald trump kicked off his monday morning by tweeting something so stupid that it was necessary to check multiple times if it was a parody account apparently the emperor has been told he is wearing the finest of clothing for so long that he is completely unaware he stands naked in the figurative not the  claw your eyes out to make the awful visage disappear manner and looking pretty stupid before usaccording to the donald any and all negative polls are  fake news  and don t at all reflect the actual feelings of the millions of people who are protesting him in the streets and the millions more who are gathering to denounce him online  sorry people want border security and extreme vetting  trump saysany negative polls are fake news just like the cnn abc nbc polls in the election sorry people want border security and extreme vetting  donald j trump realdonaldtrump february 6 2017trump of course is referencing his muslim ban which stopped people from seven muslimmajority countries from entering our country including a baby who needed heart surgery for a time the ban was met by widespread condemnation before a judge ultimately shut it down   at least for now contrary to the donald s assertion most americans actually oppose the ban politico reportsfiftythree percent opposed the order according to a cnnorc poll with 46 percent arguing that it makes the us less safe from terrorism and 49 percent saying it harms american values by preventing those seeking asylum from entering the usfiftyone percent expressed disapproval with the ban in a cbs news survey in which 57 percent of respondents said the ban goes against the country s founding principles i call my own shots largely based on an accumulation of data and everyone knows it  trump who posted a completely fake story on his timeline to support the ban and whose propaganda minister completely invented a massacre in an effort to sway public opinion in the donald s direction  some fake news media in order to marginalize lies i call my own shots largely based on an accumulation of data and everyone knows it some fake news media in order to marginalize lies  donald j trump realdonaldtrump february 6 2017trump does indeed call his own shots the ones president steve bannon doesn t call for him anyway but none of them are based in reality thanks to his cozy relationship with russian dictator vladimir putin who helped trump win the election through an aggressive propaganda campaign and hacks of his political opponents something trump specifically requested during his campaign and the numerous horrific actions he has taken since assuming office trump has managed to become the most hated president in history  and americans happily let him know it dailylol fake news fake judge fake voting right realdonaldtrump pictwittercomdhuz5z1crm  david g mcafee davidgmcafee february 6 2017realdonaldtrump so anything you dont like is fake well america doesnt like you so we will call you the fake president  roland scahill rolandscahill february 6 2017realdonaldtrump you are my favourite character in alice in wonderland the mad king who denies any negative opinion of himself  matt haig matthaig1 february 6 2017realdonaldtrump saying muslims are  pouring in  is the sort of racist language nazi propaganda used to justify attacks on certain people pictwittercomljbfqblwnv  the socialist party officialspgb february 6 2017realdonaldtrump nobannowall muslimban theresistance alternativefacts womensmarchpictwittercomggjoz7yqiu  lil kim ms goat killerbee805 february 6 2017realdonaldtrump anything out of your mouth or twitter feed is fake news youre supposedly the president youre failing get to work  john pavlovitz johnpavlovitz february 6 2017realdonaldtrump pictwittercomlymzj6aa0d  ciaran jenkins c4ciaran february 6 2017the narcissist in chief is now living in fantasyland fulltime realdonaldtrump httpstcok0hzwcempd  charles johnson greenfootballs february 6 2017realdonaldtrump donald we ve been over this a thousand times the us already has border security and extreme vetting  emma kennedy emmakennedy february 6 2017realdonaldtrump  any negative polls  for the rest of time is this how it works now if the data isn t in your favor it s fake resist  matthewdicks matthewdicks february 6 2017realdonaldtrump this is exactly something that a leader like the vladimir putin would be saying right now  impeach donald trump impeachdtrump february 6 2017realdonaldtrump this is literally dictator language  nick brennan nfbrennan february 6 2017realdonaldtrump be honest did you plagiarize this from fascism for dummies  pourmecoffee pourmecoffee february 6 2017realdonaldtrump youre like americas drunk angry controlling father but you dont drink which makes this all the more disturbing  elan gale theyearofelan february 6 2017but despite reality s uncomfortable bias against him trump is convinced that anyone who tells him he is not wearing any clothing is   like his tailor steve bannon tells him   unfit for their position and must be removed this isn t limited to his administration ultimately this includes you it includes me it includes muslims women hispanics africanamericans and anyone else who largely opposes himtrump is growing more unhinged before our eyes it is up to our elected leaders to do their jobs and make sure he is not in a position to act on it for much longer   for the good of our nationfeatured image via getty images joe raedlescreengrab'
     b'southern yemen leader sees independence referendum parliament bodyaden reuters  a rebel former governor of aden who is leading a movement for southern yemen s secession has said an independence referendum would be announced soon and a parliamentary body set up to administer the territory  aidaroos alzubaidi who was sacked as aden governor by  president abdrabbu mansour hadi set out his secessionist plans to thousands of supporters gathered on saturday in yemen s main southern city to mark 54 years since the october 1963 uprising against the british  zubaidi who has previously declared a council that seeks secession for southern yemen said in a television interview late on friday that an independence referendum would be held soon speaking to supporters on saturday zubaidi said a new 303member parliamentary body the national association would act like a small parliament to represent yemenis from all areas of the south  zubaidi announced in may a new council formed by senior tribal military and political figures the council seeks the secession of southern yemen and is looking to establish a political leadership under his presidency that would administer the south  the move threatens more turmoil in the impoverished arabian peninsular country where the internationallyrecognized government is forced to sit in aden because houthi rebels control the capital sanaa  the council was born out of a power struggle between the southerners and president abdrabbu mansour hadi that has undermined regional power saudi arabia s efforts to coordinate a military campaign against the tehransupported houthis  hadi s government has rejected the formation of the council saying it would deepen divisions and play into the hands of the houthi rebels  many southerners feel that officials in the north have exploited their resources and cut them off from jobs and influence '
     b'wow georgia refused election cybersupport from obama\xe2\x80\x99s dhs\xe2\x80\xa6now sec of state demands answers after claiming dhs tried to breach his office\xe2\x80\x99s firewallthis is pretty scary stuff a federal government agency run by an obama crony attempting to penetrate the firewall of a state agency tasked with overseeing the elections what conceivable reason could obama s dhs have for hacking the georgia sec of state s office after the electiongeorgia s secretary of state has claimed the department of homeland security tried to breach his office s firewall and has issued a letter to homeland security secretary jeh johnson asking for an explanationbrian kemp issued a letter to johnson on thursday after the state s thirdparty cybersecurity provider detected an ip address from the agency s southwest dc office trying to penetrate the state s firewall according to the letter the attempt was unsuccessfulthe attempt took place on nov 15 a few days after the presidential election the office of the georgia secretary of state is responsible for overseeing the state s elections at no time has my office agreed to or permitted dhs to conduct penetration testing or security scans of our network  kemp wrote in the letter which was also sent to the state s federal representatives and senators  moreover your department has not contacted my office since this unsuccessful incident to alert us of any security event that would require testing or scanning of our network this is especially odd and concerning since i serve on the election cyber security working group that your office created the department of homeland security has received secretary kemp s letter  a dhs spokesperson told cyberscoop  we are looking into the matter dhs takes the trust of our public and private sector partners seriously and we will respond to secretary kemp directly georgia was one of two states that refused cyberhygiene support and penetration testing from dhs in the lead up to the presidential election the department had made a significant push for it after hackers spent months exposing the democratic national committee s internal communications and datadavid dove kemp s chief of staff told cyberscoop the georgia secretary of state s office  got a lot of grief  for refusing help from dhs we basically said we don t need dhs s help  because of the contract with the thirdparty provider dove saidthe office of the georgia secretary of state would not reveal who the provider is only saying the company  analyzes more than 180 billion events a day globally across a 5000 customer base which includes many fortune 500 companies johnson announced shortly after the election that dhs found no evidence of an attack on election dayin the months and weeks leading up to the election fake news sources like the washington post did everything in their power to convince americans that georgia was in play for hillary the attempt took place on nov 15 a few days after the presidential election the office of the georgia secretary of state is responsible for overseeing the state s elections at no time has my office agreed to or permitted dhs to conduct penetration testing or security scans of our network  kemp wrote in the letter which was also sent to the state s federal representatives and senators  moreover your department has not contacted my office since this unsuccessful incident to alert us of any security event that would require testing or scanning of our network this is especially odd and concerning since i serve on the election cyber security working group that your office created the department of homeland security has received secretary kemp s letter  a dhs spokesperson told cyberscoop  we are looking into the matter dhs takes the trust of our public and private sector partners seriously and we will respond to secretary kemp directly georgia was one of two states that refused cyberhygiene support and penetration testing from dhs in the leadup to the presidential election the department had made a significant push for it after hackers spent months exposing the democratic national committee s internal communications and datain an interview with politico kemp intimated that the federal government s hacking fears were overblown saying  they now think our whole system is on the verge of disaster because some russian s going to tap into the voting system david dove kemp s chief of staff told cyberscoop the georgia secretary of state s office  got a lot of grief  for refusing help from dhs we basically said we don t need dhs s help  because of the contract with the thirdparty provider dove saidthe office of the georgia secretary of state would not reveal who the provider is only saying the company  analyzes more than 180 billion events a day globally across a 5000 customer base which includes many fortune 500 companies while the majority of states worked with dhs for help in protecting their election systems from hacks cybersecurity experts were at oddsas to what portions of the country would be targeted for election day attacksjohnson announced shortly after the election that dhs found no evidence of an attack on election day analyzes more than 180 billion events a day globally across a 5000 customer base which includes many fortune 500 companies while the majority of states worked with dhs for help in protecting their election systems from hacks cybersecurity experts were at oddsas to what portions of the country would be targeted for election day attacksjohnson announced shortly after the election that dhs found no evidence of an attack on election daythe manipulation of minds americans witnessed by our leftist media leading up to and during this election was unprecedented leftist news sources like the washington post tried to convince voters that hillary had a shot at winning the solidly red state of georgia a new atlanta journalconstitution poll of the presidential race in that state puts hillary clinton in a slight lead over donald trump 44 to 40 this is insidethemarginoferror stuff mind you but only barely it s also a break from the state of the race in the realclearpolitics polling average which gives trump a fourpoint lead though with only a handful of polls includedgeorgia has been shifting a bit politically in recent presidential elections becoming slightly less republican relative to the rest of the country   but it still has been voting more republican than america on the whole so in 2012 when barack obama won by four points mitt romney won georgia by eight   making the state 12 points more republican just a tick less than it was in 2008with so many forces and resources being used against donald j trump it s absolutely amazing he won the election '
     b'house approves new russia sanctions defying trumpwashington reuters  the us house of representatives voted overwhelmingly on tuesday to slap new sanctions on russia and force president donald trump to obtain lawmakers\xe2\x80\x99 permission before easing any sanctions on moscow in a rare rebuke\xc2\xa0of the republican president it was unclear how quickly the bill would make its way to the white house for trump to sign into law or veto the bill still must be passed by the senate which is mired in debate over efforts to overhaul the us healthcare system as lawmakers try to clear the decks to leave washington for their summer recess the sanctions bill comes as lawmakers investigate possible meddling by russia in the 2016 presidential election and potential collusion by republican trump\xe2\x80\x99s campaign moscow has denied it worked to influence the election in trump\xe2\x80\x99s favor and he has denied his campaign colluded the white house said the president had not yet decided whether he would sign the measure rejecting the bill  which would potentially hamper his hopes of pursuing improved relations with moscow  would carry a risk that his veto could be overridden by lawmakers \xe2\x80\x9cwhile the president supports tough sanctions on north korea iran and russia the white house is reviewing the house legislation and awaits a final legislative package for the president\xe2\x80\x99s desk\xe2\x80\x9d said spokeswoman sarah sanders house members backed the bill which also imposes sanctions on iran and north korea by a nearunanimous margin of 4193 with strong support from trump\xe2\x80\x99s fellow republicans as well as democrats despite objections from trump who wanted more control over the ability to impose sanctions the republicancontrolled senate passed an earlier version of the bill with nearunanimous support the house added the north korea measures after becoming frustrated with the senate\xe2\x80\x99s failure to advance a bill it passed in may representative ed royce the republican chairman of the house foreign affairs committee said the three countries \xe2\x80\x9care threatening vital us interests and destabilizing their neighbors it is well past time that we forcefully respond\xe2\x80\x9d but the combined bill has run into objections from some senators who are unhappy that the house added the north korea sanctions after holding up the measure for more than a month senate leaders have not said when they might consider the house bill senator bob corker the republican chairman of the senate foreign relations committee said he was not sure the bill would \xe2\x80\x9cfly through\xe2\x80\x9d his chamber \xe2\x80\x9cthe only language we agreed to was iran and russia so adding north korea on i just don\xe2\x80\x99t know how we\xe2\x80\x99re going to deal with it yet\xe2\x80\x9d corker told reporters \xe2\x80\x9cthe better route would have been to send over what had been agreed to\xe2\x80\x9d the bill had raised concerns in the european union where us allies depend on supplies of russian gas but house members said the bill was tweaked to try to alleviate the worries of europeans and the energy sector the intense focus on russia involving several congressional probes and a separate investigation by a justice departmentappointed special counsel robert mueller has overshadowed trump\xe2\x80\x99s agenda the scrutiny has angered and frustrated the president who calls the investigations a politically motivated witch hunt fueled by democrats who cannot accept his upset win in last november\xe2\x80\x99s election against democratic candidate hillary clinton a former us secretary of state without offering evidence trump lashed out on twitter on tuesday about \xe2\x80\x9cukrainian efforts to sabotage\xe2\x80\x9d his presidential campaign in order to aid clinton the ukrainian embassy in washington denied the accusations the senate judiciary committee had been set to compel trump\xe2\x80\x99s former campaign manager paul manafort to testify at a hearing on wednesday but rescinded the subpoena late on tuesday as negotiations over his participation continued manafort has started turning over documents to the committee and is negotiating a date to be interviewed the panel said in a statement the committee is looking at a june 2016 meeting in new york with a russian lawyer organized by trump\xe2\x80\x99s eldest son donald trump jr trump jr released emails this month that showed he welcomed the prospect of receiving damaging information at the meeting about clinton on friday the panel had asked that manafort and trump jr appear at the wednesday hearing but a witness list released on tuesday evening included neither of their names  manafort met with senate intelligence committee staff on tuesday morning his spokesman said on tuesday trump\xe2\x80\x99s soninlaw jared kushner spent three hours with the house of representatives intelligence panel his second straight day on capitol hill answering questions about his contacts with russians during the campaign kushner had a \xe2\x80\x9cvery productive session\xe2\x80\x9d with the house intelligence committee democratic representative adam schiff said after the meeting republican representative michael conaway said kushner was \xe2\x80\x9cstraightforward and forthcoming he wanted to answer every question that we had\xe2\x80\x9d kushner who is now a top aide in trump\xe2\x80\x99s white house told reporters on monday he had no part in any kremlin plot us house republicans on tuesday rejected a legislative effort by democrats to obtain treasury department documents that could show any ties between the finances of trump his inner circle and the russian government '
     b'commandos storm plane in philippinesus hijack simulationmanila reuters  philippine commandos and law enforcers have practiced hostage negotiations and the storming of a commercial jet to free american passengers in a major joint exercise with us counterparts to boost the country s counterterrorism readiness the philippine defense ministry on tuesday said some 1200 uniformed and civilian filipino and american personnel took part in the exercise  tempest wind  last week at a former us air force base outside manila and in hawaii most of the filipino civilian participants were not told it was a drill the simulation was the latest exercise between the two longtime defense treaty allies at a critical time for the philippines which is facing its biggest internal security crisis in years as supporters of islamic state try to gain a foothold in the south defence department spokesman arsenio andolong said civilian participants were told a plane from sydney bound for honolulu had been seized midair by eight islamic state militants and was making an emergency landing in clark north of manila he said the hijacking was made to appear realistic when officials from the us state department and federal bureau of investigation started to provide technical intelligence about the hijackers and the flight manifest to philippine authorities  many of the participants were unaware of the drill until the last minute thinking the hijacking was for real  andolong told reporters he said the operation was executed by filipino forces guided by us information and technical advice the drill featured a negotiation phase when philippine authorities talked around the clock with hijackers for nearly 72 hours before commandos were sent in to  neutralize  all eight hijackers in the scenario some of the 182 passengers were killed   the drill gave both sides valuable lessons on dealing with such crisis  andolong said  there were many operational and tactical gaps discovered even the us found some of its protocols did not work the way it is expected  militaries of both countries have for decades held training exercises in transnational crime disaster response and maritime security  washington has provided more than 700 million in security aid to the philippines over the past 17 years most recently the united states has been providing technical support to philippine ground and air forces who have battled for four months to retake southern marawi city from islamic state loyalists the joint exercises do not however have the support of philippine president rodrigo duterte who has made clear his disdain for the rotating us troop presence in his country during frequent tirades against the former colonial power defence secretary delfin lorenzana said the hijacking exercise was the first of its kind involving multiple levels of security and civilian authorities   the drill was designed to provide realistic scenarios on terrorism that demanded both highlevel engagements and responses on tactical level  he said '], shape=(16,), dtype=string)



```python
vectorize_layer(inp)
```




    <tf.Tensor: shape=(16, 10000), dtype=float32, numpy=
    array([[148.45087  ,  10.473082 ,   2.831915 , ...,   0.       ,
              0.       ,   0.       ],
           [ 84.12216  ,  14.662315 ,  12.743617 , ...,   0.       ,
              0.       ,   0.       ],
           [113.81233  ,  15.36052  ,   7.0797873, ...,   0.       ,
              0.       ,   0.       ],
           ...,
           [331.54028  ,  52.36541  ,  19.823404 , ...,   0.       ,
              0.       ,   0.       ],
           [143.5025   ,  43.986946 ,  16.28351  , ...,   0.       ,
              0.       ,   0.       ],
           [202.88286  ,  25.135397 ,   7.787766 , ...,   0.       ,
              0.       ,   0.       ]], dtype=float32)>



## 3.- Modelo


```python
import numpy as np
import matplotlib.pyplot as plt

# Funciones de activación
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def tanh(x):
    return np.tanh(x)

def relu(x):
    return np.maximum(0, x)

# Datos para graficar
x = np.linspace(-5, 5, 100)

# Graficar las funciones de activación
plt.plot(x, sigmoid(x), label='Sigmoid')
plt.plot(x, tanh(x), label='Tanh')
plt.plot(x, relu(x), label='ReLU')

# Configuraciones del gráfico
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid()

# Mostrar el gráfico
plt.show()

```


    
![png](10_MLP_TF_BasileKeller_files/10_MLP_TF_BasileKeller_44_0.png)
    


- Definir método build y call de la clase Linear(tf.keras.layers.Layer). Utilizar método self.add_weight para crear los pesos "W" y "b". 
- Incluir la opción de función sigmoide, tanh y relu.


```python
class Linear(tf.keras.layers.Layer):
    def __init__(self, num_neurons, activation=None):
        super(Linear, self).__init__()
        self.num_neurons = num_neurons
        self.activation = activation

    def build(self, input_shape):
      self.kernel = self.add_weight("kernel", shape=[int(input_shape[-1]),self.num_neurons])

      self.bias = self.add_weight("bias", shape=[1,self.num_neurons])

        
    def call(self, inputs):
      x = tf.matmul(inputs,self.kernel) + self.bias #Primera capa neuronal
      
      
      if self.activation == 'relu':
        x = tf.nn.relu(x)
      elif self.activation == 'tanh':
        x = tf.math.tanh(x)
      else:
        x = tf.math.sigmoid(x)  #Aplicando la función sigmoide
      
      return x


layer = Linear(10)                #Número de neuronas de salida
layer(tf.ones([16,10000])).shape
```




    TensorShape([16, 10])




```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='sigmoid'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.001                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador
```


```python
model(inp)
```




    <tf.Tensor: shape=(16, 1), dtype=float32, numpy=
    array([[0.78333604],
           [0.8139965 ],
           [0.7903517 ],
           [0.75371754],
           [0.7618401 ],
           [0.80450034],
           [0.77252746],
           [0.77671665],
           [0.7936211 ],
           [0.84982044],
           [0.75041485],
           [0.8071402 ],
           [0.82495415],
           [0.81543505],
           [0.838269  ],
           [0.83082837]], dtype=float32)>



## 4.- Entrenamiento

### Sigmoide


```python
loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')

loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio

validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')


@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Validation Loss: {validation_loss_epoch:.4f} Validation Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()



```

    Epoch: 0 Loss: 0.2787 Accuracy: 0.4488
    Epoch: 0 Validation Loss: 0.2613 Validation Acc: 0.4601
    Epoch: 1 Loss: 0.2572 Accuracy: 0.4481
    Epoch: 1 Validation Loss: 0.2532 Validation Acc: 0.4425
    Epoch: 2 Loss: 0.2516 Accuracy: 0.4974
    Epoch: 2 Validation Loss: 0.2509 Validation Acc: 0.5122
    Epoch: 3 Loss: 0.2499 Accuracy: 0.5293
    Epoch: 3 Validation Loss: 0.2502 Validation Acc: 0.5225
    Epoch: 4 Loss: 0.2492 Accuracy: 0.5361
    Epoch: 4 Validation Loss: 0.2500 Validation Acc: 0.5289


**Tasa aprendizaje 0.001**


```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```


    
![png](10_MLP_TF_BasileKeller_files/10_MLP_TF_BasileKeller_53_0.png)
    


**Tasa aprendizaje 0.0001**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='sigmoid'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.0001                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()

```

    Epoch: 0 Loss: 0.2439 Accuracy: 0.5780
    Epoch: 0 Val Loss: 0.2384 Val Acc: 0.6142
    Epoch: 1 Loss: 0.2303 Accuracy: 0.6571
    Epoch: 1 Val Loss: 0.2215 Val Acc: 0.6974
    Epoch: 2 Loss: 0.2151 Accuracy: 0.7245
    Epoch: 2 Val Loss: 0.2082 Val Acc: 0.7567
    Epoch: 3 Loss: 0.2031 Accuracy: 0.7707
    Epoch: 3 Val Loss: 0.1976 Val Acc: 0.7915
    Epoch: 4 Loss: 0.1932 Accuracy: 0.7990
    Epoch: 4 Val Loss: 0.1888 Val Acc: 0.8134



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```


    
![png](10_MLP_TF_BasileKeller_files/10_MLP_TF_BasileKeller_56_0.png)
    


**Tasa aprendizaje 0.01**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='sigmoid'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.01                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.1523 Accuracy: 0.8545
    Epoch: 0 Val Loss: 0.1207 Val Acc: 0.8764
    Epoch: 1 Loss: 0.0780 Accuracy: 0.9576
    Epoch: 1 Val Loss: 0.0571 Val Acc: 0.9724
    Epoch: 2 Loss: 0.0480 Accuracy: 0.9750
    Epoch: 2 Val Loss: 0.0449 Val Acc: 0.9735
    Epoch: 3 Loss: 0.0338 Accuracy: 0.9828
    Epoch: 3 Val Loss: 0.0329 Val Acc: 0.9774
    Epoch: 4 Loss: 0.0264 Accuracy: 0.9854
    Epoch: 4 Val Loss: 0.0245 Val Acc: 0.9859



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```


    
![png](10_MLP_TF_BasileKeller_files/10_MLP_TF_BasileKeller_59_0.png)
    


**Tasa aprendizaje 0.1**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='sigmoid'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.1                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.2482 Accuracy: 0.5484
    Epoch: 0 Val Loss: 0.2485 Val Acc: 0.5422
    Epoch: 1 Loss: 0.2445 Accuracy: 0.5645
    Epoch: 1 Val Loss: 0.1768 Val Acc: 0.8224
    Epoch: 2 Loss: 0.1366 Accuracy: 0.8370
    Epoch: 2 Val Loss: 0.0442 Val Acc: 0.9705
    Epoch: 3 Loss: 0.1392 Accuracy: 0.7819
    Epoch: 3 Val Loss: 0.0385 Val Acc: 0.9696
    Epoch: 4 Loss: 0.1508 Accuracy: 0.7931
    Epoch: 4 Val Loss: 0.0325 Val Acc: 0.9770



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```

![[Pasted image 20241120212311.png]]


### Tanh

**Tasa aprendizaje 0.0001**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='tanh'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.0001                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.2302 Accuracy: 0.6222
    Epoch: 0 Val Loss: 0.1965 Val Acc: 0.7245
    Epoch: 1 Loss: 0.1756 Accuracy: 0.7782
    Epoch: 1 Val Loss: 0.1645 Val Acc: 0.8089
    Epoch: 2 Loss: 0.1527 Accuracy: 0.8386
    Epoch: 2 Val Loss: 0.1475 Val Acc: 0.8523
    Epoch: 3 Loss: 0.1391 Accuracy: 0.8709
    Epoch: 3 Val Loss: 0.1360 Val Acc: 0.8787
    Epoch: 4 Loss: 0.1297 Accuracy: 0.8906
    Epoch: 4 Val Loss: 0.1290 Val Acc: 0.8943



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```

![[Pasted image 20241120212257.png]]


**Tasa aprendizaje 0.001**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='tanh'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.001                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.2245 Accuracy: 0.7184
    Epoch: 0 Val Loss: 0.1917 Val Acc: 0.8585
    Epoch: 1 Loss: 0.1593 Accuracy: 0.8973
    Epoch: 1 Val Loss: 0.1307 Val Acc: 0.9197
    Epoch: 2 Loss: 0.1090 Accuracy: 0.9369
    Epoch: 2 Val Loss: 0.0921 Val Acc: 0.9453
    Epoch: 3 Loss: 0.0789 Accuracy: 0.9537
    Epoch: 3 Val Loss: 0.0718 Val Acc: 0.9551
    Epoch: 4 Loss: 0.0605 Accuracy: 0.9642
    Epoch: 4 Val Loss: 0.0569 Val Acc: 0.9625



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```


![[Pasted image 20241120212244.png]]



**Tasa aprendizaje 0.01**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='tanh'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.01                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.2015 Accuracy: 0.7020
    Epoch: 0 Val Loss: 0.2367 Val Acc: 0.5520
    Epoch: 1 Loss: 0.0935 Accuracy: 0.9077
    Epoch: 1 Val Loss: 0.1128 Val Acc: 0.8589
    Epoch: 2 Loss: 0.0620 Accuracy: 0.9364
    Epoch: 2 Val Loss: 0.0252 Val Acc: 0.9834
    Epoch: 3 Loss: 0.0548 Accuracy: 0.9424
    Epoch: 3 Val Loss: 0.1554 Val Acc: 0.8146
    Epoch: 4 Loss: 0.0392 Accuracy: 0.9605
    Epoch: 4 Val Loss: 0.0295 Val Acc: 0.9711



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```

![[Pasted image 20241120212232.png]]


**Tasa aprendizaje 0.1**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='tanh'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.1                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.2483 Accuracy: 0.5537
    Epoch: 0 Val Loss: 0.2489 Val Acc: 0.5411
    Epoch: 1 Loss: 0.2396 Accuracy: 0.5834
    Epoch: 1 Val Loss: 0.2522 Val Acc: 0.5290
    Epoch: 2 Loss: 0.1909 Accuracy: 0.7170
    Epoch: 2 Val Loss: 0.0594 Val Acc: 0.9502
    Epoch: 3 Loss: 0.1652 Accuracy: 0.7554
    Epoch: 3 Val Loss: 0.2520 Val Acc: 0.5465
    Epoch: 4 Loss: 0.1512 Accuracy: 0.7755
    Epoch: 4 Val Loss: 0.1721 Val Acc: 0.8107



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```

![[Pasted image 20241120212218.png]]



### ReLu

**Tasa aprendizaje 0.0001**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='relu'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.0001                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.2455 Accuracy: 0.5825
    Epoch: 0 Val Loss: 0.1966 Val Acc: 0.6932
    Epoch: 1 Loss: 0.1705 Accuracy: 0.7548
    Epoch: 1 Val Loss: 0.1532 Val Acc: 0.7980
    Epoch: 2 Loss: 0.1393 Accuracy: 0.8271
    Epoch: 2 Val Loss: 0.1321 Val Acc: 0.8428
    Epoch: 3 Loss: 0.1214 Accuracy: 0.8662
    Epoch: 3 Val Loss: 0.1165 Val Acc: 0.8780
    Epoch: 4 Loss: 0.1091 Accuracy: 0.8922
    Epoch: 4 Val Loss: 0.1086 Val Acc: 0.8938



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```

![[Pasted image 20241120212204.png]]

    


**Tasa aprendizaje 0.001**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='relu'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.001                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.1400 Accuracy: 0.8161
    Epoch: 0 Val Loss: 0.0727 Val Acc: 0.9326
    Epoch: 1 Loss: 0.0586 Accuracy: 0.9472
    Epoch: 1 Val Loss: 0.0499 Val Acc: 0.9526
    Epoch: 2 Loss: 0.0404 Accuracy: 0.9666
    Epoch: 2 Val Loss: 0.0357 Val Acc: 0.9698
    Epoch: 3 Loss: 0.0316 Accuracy: 0.9748
    Epoch: 3 Val Loss: 0.0387 Val Acc: 0.9588
    Epoch: 4 Loss: 0.0263 Accuracy: 0.9787
    Epoch: 4 Val Loss: 0.0283 Val Acc: 0.9757



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```

![[Pasted image 20241120212149.png]]


**Tasa aprendizaje 0.01**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='relu'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.01                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.2306 Accuracy: 0.5755
    Epoch: 0 Val Loss: 0.1359 Val Acc: 0.9339
    Epoch: 1 Loss: 0.0988 Accuracy: 0.9296
    Epoch: 1 Val Loss: 0.1584 Val Acc: 0.7752
    Epoch: 2 Loss: 0.0463 Accuracy: 0.9632
    Epoch: 2 Val Loss: 0.0537 Val Acc: 0.9369
    Epoch: 3 Loss: 0.0271 Accuracy: 0.9688
    Epoch: 3 Val Loss: 0.0317 Val Acc: 0.9633
    Epoch: 4 Loss: 0.0195 Accuracy: 0.9786
    Epoch: 4 Val Loss: 0.0199 Val Acc: 0.9771



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```

![[Pasted image 20241120212134.png]]



**Tasa aprendizaje 0.1**


```python
model = Sequential([
  vectorize_layer,                  #Vectores TF IDF
  Linear(3, activation='relu'),  #3 neuronas
  Linear(1)                         #1 neurona de salida, 1 es Fake News, 0 es Real News
])

lr = 0.1                          #Tasa de aprendizaje (Muy alta rebota mucho, muy chica tarda mucho)
opt = tf.keras.optimizers.experimental.SGD(lr)  #Definimos optimizador

loss_avg = tf.keras.metrics.Mean(name="loss")
acc_avg = tf.keras.metrics.Accuracy(name='accuracy')
loss_fn = tf.keras.losses.MeanSquaredError()  #Funcion de perdida Error Cuadratico Medio
validation_loss_fn = tf.keras.losses.MeanSquaredError()
validation_loss_avg = tf.keras.metrics.Mean(name="validation_loss")
validation_acc_avg = tf.keras.metrics.Accuracy(name='validation_accuracy')

@tf.function
def train_step(batch, model, optimizer):
    x, y = batch            #Textos x, Etiquetas y

    with tf.GradientTape() as tape:
        output = model(x, training=True) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
        loss_value = loss_fn(y, output)

    grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    optimizer.apply_gradients(zip(grads, model.trainable_weights))  #Aplicamos gradientes al modelo, es la actualizacion de los pesos al modelo
    loss_avg(loss_value)
    acc_avg(y, tf.math.round(output))


#Lo que añadimos

def test_step(batch, model):
    x, y = batch            #Textos x, Etiquetas y

  #No gradient tape
    #with tf.GradientTape() as tape:
    output = model(x, training=False) #Pasamos texto por modelo y nos regresa lotes
        # Compute loss
    loss_value = validation_loss_fn(y, output)

    #grads = tape.gradient(loss_value, model.trainable_weights)      #Se almacenan los gradientes, donde necesitamos perdida y pesos
    validation_loss_avg(loss_value)
    validation_acc_avg(y, tf.math.round(output))
    # print(loss_value,validation_loss_avg,validation_acc_avg)

################ 

     
epochs = 5
loss_train = []
acc_train = []

validation_loss_train = []
validation_acc_train = []

for epoch in range(epochs):
    for batch in train_ds:
        train_step(batch, model, opt)

    loss_epoch = loss_avg.result().numpy()
    acc_epoch = acc_avg.result().numpy()
    print(f'Epoch: {epoch} Loss: {loss_epoch:.4f} Accuracy: {acc_epoch:.4f}')
    loss_train.append(loss_epoch)
    acc_train.append(acc_epoch)

    
    #Lo que añadimos
    for batch in val_ds:
        test_step(batch, model)
    validation_loss_epoch = validation_loss_avg.result().numpy()
    validation_acc_epoch = validation_acc_avg.result().numpy()
    print(f'Epoch: {epoch} ' f'Val Loss: {validation_loss_epoch:.4f} Val Acc: {validation_acc_epoch:.4f}')
    validation_loss_train.append(validation_loss_epoch)
    validation_acc_train.append(validation_acc_epoch)
    ################

    
    
    # Reset metrics
    loss_avg.reset_states()
    acc_avg.reset_states()
    validation_loss_avg.reset_states()
    validation_acc_avg.reset_states()
```

    Epoch: 0 Loss: 0.2530 Accuracy: 0.5409
    Epoch: 0 Val Loss: 0.2402 Val Acc: 0.5401
    Epoch: 1 Loss: 0.1735 Accuracy: 0.7703
    Epoch: 1 Val Loss: 0.0443 Val Acc: 0.9576
    Epoch: 2 Loss: 0.0679 Accuracy: 0.9249
    Epoch: 2 Val Loss: 0.0531 Val Acc: 0.9372
    Epoch: 3 Loss: 0.0376 Accuracy: 0.9589
    Epoch: 3 Val Loss: 0.0206 Val Acc: 0.9772
    Epoch: 4 Loss: 0.0436 Accuracy: 0.9519
    Epoch: 4 Val Loss: 0.0141 Val Acc: 0.9853



```python
import matplotlib.pyplot as plt

# Crear figura con dos subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

# Plot de accuracy en el primer subplot
ax1.plot(acc_train, 'bx-', label = 'train')
ax1.plot(validation_acc_train, 'rx-', label='test')

ax1.set_title('Accuracy de entrenamiento')
ax1.set_xlabel('Época')
ax1.set_ylabel('Accuracy')

# Plot de error en el segundo subplot
ax2.plot(loss_train, 'bx-', label = 'train')
ax2.plot(validation_loss_train, 'rx-', label='test')
ax2.set_title('Error de entrenamiento')
ax2.set_xlabel('Época')
ax2.set_ylabel('Error')

# Mostrar figura
plt.show()
```


![[Pasted image 20241120212121.png]]
