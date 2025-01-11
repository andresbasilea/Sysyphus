### Laboratory
https://www.coursera.org/learn/googlecloud-etl-processing-on-google-cloud-using-dataflow-and-bigquery-4lxht/home/week/1


> [!abstract] Overview
> We will build Python code to ingest and transform data from public datasets into BigQuery using: 
> - Cloud Storage
> - [[Cloud Dataflow]]
> - [[Data Analysis with BigQuery]]

For this project, we will first access the GCP Console and activate the Cloud Shell. This will open up a shell like this:

![[Pasted image 20250111105707.png]]

We can see the active account by running `gcloud auth list`:
![[Pasted image 20250111105810.png]]

And list the current project using `gcloud config list project`:
![[Pasted image 20250111105850.png]]


### Enable Dataflow API

As with almost all services in GCP, to use it, we first need to enable the API. For this, search "Dataflow API" in the top search bar. 

![[Pasted image 20250111110018.png]]

Sometimes, the API appears as enabled, but it is better to click on *manage* and then disable and enable again the API. 


### Dataflow Python Scripts

For this project, we will use code from the [Google Cloud's professional services Github](https://github.com/GoogleCloudPlatform/professional-services/blob/main/examples/dataflow-python-examples/README.md). For this, lets use the following command in the Cloud Shell:

```
gcloud storage cp -r gs://spls/gsp290/dataflow-python-examples .
```

Once copied, we will create a variable equal to the project ID, as we will be using this ID during the project. 

```
export PROJECT=qwiklabs-gcp-01-8d011e8a2e82
```

```
gcloud config set project $PROJECT
```

This will update the `[core/project]` property. 


### Creating a GCS Bucket

We will create a regional bucket in `us-east1` region within our project:

```
gcloud storage buckets create gs://$PROJECT --location=us-east1
```


### Copying our data to the GCS Bucket

We will copy the files from a cloud bucket into the cloud bucket we created previously. For this, we use: 

```
gcloud storage cp gs://spls/gsp290/data_files/usa_names.csv gs://$PROJECT/data_files/
gcloud storage cp gs://spls/gsp290/data_files/head_usa_names.csv gs://$PROJECT/data_files/
```


### Creating the BigQuery Dataset

We will create a BigQuery dataset called `lake`. This is where the tables will be loaded in BigQuery. For this, we use:

```
bq mk lake
```


### Build the Dataflow pipeline

Until this point, we have created the needed resources to store our Dataset in the GCS bucket, and created our BigQuery dataset, where we will work with the data. However, we still need to define the processes that will let us ingest data from GCS into BigQuery. 

The Dataflow pipeline will be append-only. Let's open the Cloud Shell Code Editor, which will allow us to edit files in the Cloud Shell environment. 

![[Pasted image 20250111112005.png]]

The Dataflow pipeline will use TextIO as a source and a BigQueryIO destination to ingest data into BIgQuery. More specifically it will: 
- Ingest the files from Cloud Storage
- Filter out the header row in the files
- Convert the lines read to dictionary objects
- Output the rows to BigQuery

The Python script that we will use is the following (it will populate the dataset `lake` with a table in BigQuery):

#### Data Ingestion Python Script
```Python
# Copyright 2017 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""`data_ingestion.py` is a Dataflow pipeline which reads a file and writes its
contents to a BigQuery table.
This example does not do any transformation on the data.
"""


import argparse
import logging
import re
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions


class DataIngestion:
    """A helper class which contains the logic to translate the file into
    a format BigQuery will accept."""
    def parse_method(self, string_input):
        """This method translates a single line of comma separated values to a
        dictionary which can be loaded into BigQuery.

        Args:
            string_input: A comma separated list of values in the form of
                state_abbreviation,gender,year,name,count_of_babies,dataset_created_date
                Example string_input: KS,F,1923,Dorothy,654,11/28/2016

        Returns:
            A dict mapping BigQuery column names as keys to the corresponding value
            parsed from string_input. In this example, the data is not transformed, and
            remains in the same format as the CSV.
            example output:
            {
                'state': 'KS',
                'gender': 'F',
                'year': '1923',
                'name': 'Dorothy',
                'number': '654',
                'created_date': '11/28/2016'
            }
         """
        # Strip out carriage return, newline and quote characters.
        values = re.split(",",
                          re.sub('\r\n', '', re.sub('"', '', string_input)))
        row = dict(
            zip(('state', 'gender', 'year', 'name', 'number', 'created_date'),
                values))
        return row


def run(argv=None):
    """The main function which creates the pipeline and runs it."""

    parser = argparse.ArgumentParser()

    # Here we add some specific command line arguments we expect.
    # Specifically we have the input file to read and the output table to write.
    # This is the final stage of the pipeline, where we define the destination
    # of the data. In this case we are writing to BigQuery.
    parser.add_argument(
        '--input',
        dest='input',
        required=False,
        help='Input file to read. This can be a local file or '
        'a file in a Google Storage Bucket.',
        # This example file contains a total of only 10 lines.
        # Useful for developing on a small set of data.
        default='gs://spls/gsp290/data_files/head_usa_names.csv')

    # This defaults to the lake dataset in your BigQuery project. You'll have
    # to create the lake dataset yourself using this command:
    # bq mk lake
    parser.add_argument('--output',
                        dest='output',
                        required=False,
                        help='Output BQ table to write results to.',
                        default='lake.usa_names')

    # Parse arguments from the command line.
    known_args, pipeline_args = parser.parse_known_args(argv)

    # DataIngestion is a class we built in this script to hold the logic for
    # transforming the file into a BigQuery table.
    data_ingestion = DataIngestion()

    # Initiate the pipeline using the pipeline arguments passed in from the
    # command line. This includes information such as the project ID and
    # where Dataflow should store temp files.
    p = beam.Pipeline(options=PipelineOptions(pipeline_args))

    (p
     # Read the file. This is the source of the pipeline. All further
     # processing starts with lines read from the file. We use the input
     # argument from the command line. We also skip the first line which is a
     # header row.
     | 'Read from a File' >> beam.io.ReadFromText(known_args.input,
                                                  skip_header_lines=1)
     # This stage of the pipeline translates from a CSV file single row
     # input as a string, to a dictionary object consumable by BigQuery.
     # It refers to a function we have written. This function will
     # be run in parallel on different workers using input from the
     # previous stage of the pipeline.
     | 'String To BigQuery Row' >>
     beam.Map(lambda s: data_ingestion.parse_method(s))
     | 'Write to BigQuery' >> beam.io.Write(
         beam.io.BigQuerySink(
             # The table name is a required argument for the BigQuery sink.
             # In this case we use the value passed in from the command line.
             known_args.output,
             # Here we use the simplest way of defining a schema:
             # fieldName:fieldType
             schema='state:STRING,gender:STRING,year:STRING,name:STRING,'
             'number:STRING,created_date:STRING',
             # Creates the table in BigQuery if it does not yet exist.
             create_disposition=beam.io.BigQueryDisposition.CREATE_IF_NEEDED,
             # Deletes all data in the BigQuery table before writing.
             write_disposition=beam.io.BigQueryDisposition.WRITE_TRUNCATE)))
    p.run().wait_until_finish()


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    run()

```


![[Pasted image 20250111113356.png]]

### Running the Apache Beam pipeline

The Dataflow job in this lab requires `Python3.8`. To ensure you are on the proper version, you will run the Dataflow processes in a Python 3.8 Docker container. On the Cloud Shell, we will run: 

```
docker run -it -e PROJECT=$PROJECT -v $(pwd)/dataflow-python-examples:/dataflow python:3.8 /bin/bash
```

The previous command will pull a Docker image with the latest stable Python 3.8 and execute a command shell to run the next commands within the container. The `-v` flag provides the source code as a `volume` for the container. 

Once the container finishes pulling and executing in the Cloud Shell, run (**inside the** **container**): 

```
pip install apache-beam[gcp]==2.59.0
```

Now, in the running container in the Cloud Shell, we will change directories into where the linked source code is: 

```
cd dataflow/
```

#### Running the ingestion Dataflow pipeline in the cloud

The following code will spin up the workers required and shut them down once completed:

```python
python dataflow_python_examples/data_ingestion.py \
  --project=$PROJECT \
  --region=us-east1 \
  --runner=DataflowRunner \
  --machine_type=e2-standard-2 \
  --staging_location=gs://$PROJECT/test \
  --temp_location gs://$PROJECT/test \
  --input gs://$PROJECT/data_files/head_usa_names.csv \
  --save_main_session
```

![[Pasted image 20250111114025.png]]

You can view the status of the job on the Cloud Console -> Navigation menu -> Dataflow. 

![[Pasted image 20250111114139.png]]

Once *Succeeded*, we can go to BigQuery and, under our current project, and inside the `lake` dataset that we created previously, we will find the dataset that we ingested from a CSV file using dataflow.

![[Pasted image 20250111114704.png]]


#### Data transformation with Dataflow

Now, we will:
- ingest files from Cloud Storage
- convert the lines read to dictionary objects
- transform the data which contains the year to a format BigQuery understands as a date
- Output rows to BigQuery

For this purpose, we will use the following `data transformation python script`:


``` Python
# Copyright 2017 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

""" data_transformation.py is a Dataflow pipeline which reads a file and writes
its contents to a BigQuery table.

This example reads a json schema of the intended output into BigQuery,
and transforms the date data to match the format BigQuery expects.
"""


import argparse
import csv
import logging
import os

import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.io.gcp.bigquery_tools import parse_table_schema_from_json


class DataTransformation:
    """A helper class which contains the logic to translate the file into a
  format BigQuery will accept."""

    def __init__(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        self.schema_str = ''
        # Here we read the output schema from a json file.  This is used to specify the types
        # of data we are writing to BigQuery.
        schema_file = os.path.join(dir_path, 'resources', 'usa_names_year_as_date.json')
        with open(schema_file) \
                as f:
            data = f.read()
            # Wrapping the schema in fields is required for the BigQuery API.
            self.schema_str = '{"fields": ' + data + '}'

    def parse_method(self, string_input):
        """This method translates a single line of comma separated values to a
    dictionary which can be loaded into BigQuery.

        Args:
            string_input: A comma separated list of values in the form of
            state_abbreviation,gender,year,name,count_of_babies,dataset_created_date
                example string_input: KS,F,1923,Dorothy,654,11/28/2016

        Returns:
            A dict mapping BigQuery column names as keys to the corresponding value
            parsed from string_input.  In this example, the data is not transformed, and
            remains in the same format as the CSV.  There are no date format transformations.

                example output:
                      {'state': 'KS',
                       'gender': 'F',
                       'year': '1923-01-01', <- This is the BigQuery date format.
                       'name': 'Dorothy',
                       'number': '654',
                       'created_date': '11/28/2016'
                       }
        """
        # Strip out return characters and quote characters.
        schema = parse_table_schema_from_json(self.schema_str)

        field_map = [f for f in schema.fields]

        # Use a CSV Reader which can handle quoted strings etc.
        reader = csv.reader(string_input.split('\n'))
        for csv_row in reader:
            # Our source data only contains year, so default January 1st as the
            # month and day.
            month = '01'
            day = '01'
            # The year comes from our source data.
            year = csv_row[2]

            row = {}
            i = 0
            # Iterate over the values from our csv file, applying any transformation logic.
            for value in csv_row:
                # If the schema indicates this field is a date format, we must
                # transform the date from the source data into a format that
                # BigQuery can understand.
                if field_map[i].type == 'DATE':
                    # Format the date to YYYY-MM-DD format which BigQuery
                    # accepts.
                    value = '-'.join((year, month, day))

                row[field_map[i].name] = value
                i += 1

            return row


def run(argv=None):
    """The main function which creates the pipeline and runs it."""
    parser = argparse.ArgumentParser()
    # Here we add some specific command line arguments we expect.   Specifically
    # we have the input file to load and the output table to write to.
    parser.add_argument(
        '--input', dest='input', required=False,
        help='Input file to read.  This can be a local file or '
             'a file in a Google Storage Bucket.',
        # This example file contains a total of only 10 lines.
        # It is useful for developing on a small set of data
        default='gs://spls/gsp290/data_files/head_usa_names.csv')
    # This defaults to the temp dataset in your BigQuery project.  You'll have
    # to create the temp dataset yourself using bq mk temp
    parser.add_argument('--output', dest='output', required=False,
                        help='Output BQ table to write results to.',
                        default='lake.usa_names_transformed')

    # Parse arguments from the command line.
    known_args, pipeline_args = parser.parse_known_args(argv)
    # DataTransformation is a class we built in this script to hold the logic for
    # transforming the file into a BigQuery table.
    data_ingestion = DataTransformation()

    # Initiate the pipeline using the pipeline arguments passed in from the
    # command line.  This includes information like where Dataflow should
    # store temp files, and what the project id is.
    p = beam.Pipeline(options=PipelineOptions(pipeline_args))
    schema = parse_table_schema_from_json(data_ingestion.schema_str)

    (p
     # Read the file.  This is the source of the pipeline.  All further
     # processing starts with lines read from the file.  We use the input
     # argument from the command line.  We also skip the first line which is a
     # header row.
     | 'Read From Text' >> beam.io.ReadFromText(known_args.input,
                                                skip_header_lines=1)
     # This stage of the pipeline translates from a CSV file single row
     # input as a string, to a dictionary object consumable by BigQuery.
     # It refers to a function we have written.  This function will
     # be run in parallel on different workers using input from the
     # previous stage of the pipeline.
     | 'String to BigQuery Row' >> beam.Map(lambda s:
                                            data_ingestion.parse_method(s))
     | 'Write to BigQuery' >> beam.io.Write(
        beam.io.BigQuerySink(
            # The table name is a required argument for the BigQuery sink.
            # In this case we use the value passed in from the command line.
            known_args.output,
            # Here we use the JSON schema read in from a JSON file.
            # Specifying the schema allows the API to create the table correctly if it does not yet exist.
            schema=schema,
            # Creates the table in BigQuery if it does not yet exist.
            create_disposition=beam.io.BigQueryDisposition.CREATE_IF_NEEDED,
            # Deletes all data in the BigQuery table before writing.
            write_disposition=beam.io.BigQueryDisposition.WRITE_TRUNCATE)))
    p.run().wait_until_finish()


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    run()

```

To run the data pipeline in the cloud, we will use the following command:

```python
python dataflow_python_examples/data_transformation.py \
	--project=$PROJECT \
	--region=us-east1 \
	--runner=DataFlowRunner \
	--machine_type=e2-standard-2 \
	--staging_location=gs://$PROJECT/test \
	--temp_location gs://$PROJECT/test \
	--input gs://$PROJECT/data_files/head_usa_names.csv \
	--save_main_session
```

Once the status of the Job appears as *succeeded* inside Dataflow, we will see the populated data in BigQuery. We will see the usa_names_transformed table under the lake dataset. 


#### Data Enrichment with Dataflow

Similarly, we will now build a Dataflow pipeline with TextIO source and BigQueryIO destination to ingest data into BigQuery:
- ingest the files from Cloud Storage
- Filter out the header row in the files
- Convert the lines read to dictionary objects
- Output the rows to BigQuery

We will use the following `data enrichment python script`:

```Python
# Copyright 2017 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

""" data_enrichment.py demonstrates a Dataflow pipeline which reads a file and
 writes its contents to a BigQuery table.  Along the way, data from BigQuery
 is read in as a side input and joined in with the primary data from the file.

"""


import argparse
import csv
import logging
import os
import sys

import apache_beam as beam
from apache_beam.io.gcp import bigquery
from apache_beam.io.gcp.bigquery import parse_table_schema_from_json
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.pvalue import AsDict


class DataIngestion(object):
    """A helper class which contains the logic to translate the file into a
  format BigQuery will accept."""

    def __init__(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        self.schema_str = ''
        # This is the schema of the destination table in BigQuery.
        schema_file = os.path.join(dir_path, 'resources', 'usa_names_with_full_state_name.json')
        with open(schema_file) \
                as f:
            data = f.read()
            # Wrapping the schema in fields is required for the BigQuery API.
            self.schema_str = '{"fields": ' + data + '}'

    def parse_method(self, string_input):
        """This method translates a single line of comma separated values to a
    dictionary which can be loaded into BigQuery.

        Args:
            string_input: A comma separated list of values in the form of
            state_abbreviation,gender,year,name,count_of_babies,dataset_created_date
                example string_input: KS,F,1923,Dorothy,654,11/28/2016

        Returns:
            A dict mapping BigQuery column names as keys to the corresponding value
            parsed from string_input.  In this example, the data is not transformed, and
            remains in the same format as the CSV.  There are no date format transformations.

                example output:
                      {'state': 'KS',
                       'gender': 'F',
                       'year': '1923-01-01', <- This is the BigQuery date format.
                       'name': 'Dorothy',
                       'number': '654',
                       'created_date': '11/28/2016'
                       }

     """
        # Strip out return characters and quote characters.
        schema = bigquery.parse_table_schema_from_json(self.schema_str)

        field_map = [f for f in schema.fields]

        # Use a CSV Reader which can handle quoted strings etc.
        reader = csv.reader(string_input.split('\n'))
        for csv_row in reader:
            if (sys.version_info.major < 3.0):
                values = [x.decode('utf8') for x in csv_row]
            else:
                values = csv_row
            # Our source data only contains year, so default January 1st as the
            # month and day.
            month = '01'
            day = '01'
            # The year comes from our source data.
            year = values[2]
            row = {}
            i = 0
            # Iterate over the values from our csv file, applying any transformation logic.
            for value in values:
                # If the schema indicates this field is a date format, we must
                # transform the date from the source data into a format that
                # BigQuery can understand.
                if field_map[i].type == 'DATE':
                    # Format the date to YYYY-MM-DD format which BigQuery
                    # accepts.
                    value = '-'.join((year, month, day))

                row[field_map[i].name] = value
                i += 1

            return row


def run(argv=None):
    """The main function which creates the pipeline and runs it."""
    parser = argparse.ArgumentParser()
    # Here we add some specific command line arguments we expect.   Specifically
    # we have the input file to load and the output table to write to.
    parser.add_argument(
        '--input', dest='input', required=False,
        help='Input file to read.  This can be a local file or '
             'a file in a Google Storage Bucket.',
        # This example file contains a total of only 10 lines.
        # Useful for quickly debugging on a small set of data
        default='gs://spls/gsp290/data_files/head_usa_names.csv')
    # The output defaults to the lake dataset in your BigQuery project.  You'll have
    # to create the lake dataset yourself using this command:
    # bq mk lake
    parser.add_argument('--output', dest='output', required=False,
                        help='Output BQ table to write results to.',
                        default='lake.usa_names_enriched')

    # Parse arguments from the command line.
    known_args, pipeline_args = parser.parse_known_args(argv)

    # DataIngestion is a class we built in this script to hold the logic for
    # transforming the file into a BigQuery table.
    data_ingestion = DataIngestion()

    # Initiate the pipeline using the pipeline arguments passed in from the
    # command line.  This includes information like where Dataflow should store
    #  temp files, and what the project id is
    p = beam.Pipeline(options=PipelineOptions(pipeline_args))
    schema = parse_table_schema_from_json(data_ingestion.schema_str)

    # This function adds in a full state name by looking up the
    # full name in the short_to_long_name_map.  The short_to_long_name_map
    # comes from a read from BigQuery in the next few lines
    def add_full_state_name(row, short_to_long_name_map):
        row['state_full_name'] = short_to_long_name_map[row['state']]
        return row

    # This is a second source of data.  The source is from BigQuery.
    # This will come into our pipeline a side input.

    read_query = """
    SELECT
    name as state_name,
    abbreviation as state_abbreviation
    FROM
    `qwiklabs-resources.python_dataflow_example.state_abbreviations`"""

    state_abbreviations = (
        p
        | 'Read from BigQuery' >> beam.io.Read(
            beam.io.BigQuerySource(query=read_query, use_standard_sql=True))
        # We must create a python tuple of key to value pairs here in order to
        # use the data as a side input.  Dataflow will use the keys to distribute the
        # work to the correct worker.
        | 'Abbreviation to Full Name' >> beam.Map(
            lambda row: (row['state_abbreviation'], row['state_name'])))

    (p
     # Read the file.  This is the source of the pipeline.  All further
     # processing starts with lines read from the file.  We use the input
     # argument from the command line.  We also skip the first line which is
     # a header row.
     | 'Read From Text' >> beam.io.ReadFromText(known_args.input,
                                                skip_header_lines=1)
     # Translates from the raw string data in the CSV to a dictionary.
     # The dictionary is a keyed by column names with the values being the values
     # we want to store in BigQuery.
     | 'String to BigQuery Row' >> beam.Map(lambda s:
                                            data_ingestion.parse_method(s))
     # Here we pass in a side input, which is data that comes from outside our
     # CSV source.  The side input contains a map of states to their full name.
     | 'Join Data' >> beam.Map(add_full_state_name, AsDict(
        state_abbreviations))
     # This is the final stage of the pipeline, where we define the destination
     #  of the data.  In this case we are writing to BigQuery.
     | 'Write to BigQuery' >> beam.io.Write(
        beam.io.BigQuerySink(
            # The table name is a required argument for the BigQuery sink.
            # In this case we use the value passed in from the command line.
            known_args.output,
            # Here we use the JSON schema read in from a JSON file.
            # Specifying the schema allows the API to create the table correctly if it does not yet exist.
            schema=schema,
            # Creates the table in BigQuery if it does not yet exist.
            create_disposition=beam.io.BigQueryDisposition.CREATE_IF_NEEDED,
            # Deletes all data in the BigQuery table before writing.
            write_disposition=beam.io.BigQueryDisposition.WRITE_TRUNCATE)))
    p.run().wait_until_finish()


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    run()

```

Use the following code to start the Dataflow Job and shut down instances once done:
```python
python dataflow_python_examples/data_enrichment.py \
	--project=$PROJECT \
	--region=us-east1 \
	--runner=DataFlowRunner \
	--machine_type=e2-standard-2 \
	--staging_location=gs://$PROJECT/test \
	--temp_location gs://$PROJECT/test \
	--input gs://$PROJECT/data_files/head_usa_names.csv \
	--save_main_session
```

We can see the Jobs running inside Dataflow:

![[Pasted image 20250111115304.png]]


Once done, you should see the `usa_names_enriched` table under the `lake` dataset in BigQuery.


#### Data lake to Mart

Now, we will build a Dataflow pipeline that reads data from two BigQuery data sources, and then joins the data sources. Specifically:
- Ingest files from tow BigQuery sources
- Join the data sources
- Filter out the header row in the files
- Convert the lines read to dictionary objects
- Output the rows to BigQuery

For this purpose, we will use the following script:

```python
# Copyright 2024 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

""" data_lake_to_mart.py demonstrates a Dataflow pipeline which reads a
large BigQuery Table, joins in another dataset, and writes its contents to a
BigQuery table.
"""


import argparse
import logging
import os
import traceback

import apache_beam as beam
from apache_beam.io.gcp.bigquery_tools import parse_table_schema_from_json
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.pvalue import AsDict

class AddAccountDetails(beam.DoFn):
    def process(self, row, account_details):
        """add_account_details joins two datasets together.  Dataflow passes in the
        a row from the orders dataset along with the entire account details dataset.

        This works because the entire account details dataset can be passed in memory.

        The function then looks up the account details, and adds all columns to a result
        dictionary, which will be written to BigQuery."""

        result = row.copy()
        result.update(account_details[row['acct_number']])
        yield result

class DataLakeToDataMart:
    """A helper class which contains the logic to translate the file into
    a format BigQuery will accept.

    This example uses side inputs to join two datasets together.
    """

    def __init__(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        self.schema_str = ''
        # This is the schema of the destination table in BigQuery.
        schema_file = os.path.join(dir_path, 'resources', 'orders_denormalized.json')
        with open(schema_file) as f:
            data = f.read()
            # Wrapping the schema in fields is required for the BigQuery API.
            self.schema_str = '{"fields": ' + data + '}'

    def get_orders_query(self):
        """This returns a query against a very large fact table.  We are
        using a fake orders dataset to simulate a fact table in a typical
        data warehouse."""
        orders_query = """SELECT
            acct_number,
            col_number,
            col_number_1,
            col_number_10,
            col_number_100,
            col_number_101,
            col_number_102,
            col_number_103,
            col_number_104,
            col_number_105,
            col_number_106,
            col_number_107,
            col_number_108,
            col_number_109,
            col_number_11,
            col_number_110,
            col_number_111,
            col_number_112,
            col_number_113,
            col_number_114,
            col_number_115,
            col_number_116,
            col_number_117,
            col_number_118,
            col_number_119,
            col_number_12,
            col_number_120,
            col_number_121,
            col_number_122,
            col_number_123,
            col_number_124,
            col_number_125,
            col_number_126,
            col_number_127,
            col_number_128,
            col_number_129,
            col_number_13,
            col_number_130,
            col_number_131,
            col_number_132,
            col_number_133,
            col_number_134,
            col_number_135,
            col_number_136,
            col_number_14,
            col_number_15,
            col_number_16,
            col_number_17,
            col_number_18,
            col_number_19,
            col_number_2,
            col_number_20,
            col_number_21,
            col_number_22,
            col_number_23,
            col_number_24,
            col_number_25,
            col_number_26,
            col_number_27,
            col_number_28,
            col_number_29,
            col_number_3,
            col_number_30,
            col_number_31,
            col_number_32,
            col_number_33,
            col_number_34,
            col_number_35,
            col_number_36,
            col_number_37,
            col_number_38,
            col_number_39,
            col_number_4,
            col_number_40,
            col_number_41,
            col_number_42,
            col_number_43,
            col_number_44,
            col_number_45,
            col_number_46,
            col_number_47,
            col_number_48,
            col_number_49,
            col_number_5,
            col_number_50,
            col_number_51,
            col_number_52,
            col_number_53,
            col_number_54,
            col_number_55,
            col_number_56,
            col_number_57,
            col_number_58,
            col_number_59,
            col_number_6,
            col_number_60,
            col_number_61,
            col_number_62,
            col_number_63,
            col_number_64,
            col_number_65,
            col_number_66,
            col_number_67,
            col_number_68,
            col_number_69,
            col_number_7,
            col_number_70,
            col_number_71,
            col_number_72,
            col_number_73,
            col_number_74,
            col_number_75,
            col_number_76,
            col_number_77,
            col_number_78,
            col_number_79,
            col_number_8,
            col_number_80,
            col_number_81,
            col_number_82,
            col_number_83,
            col_number_84,
            col_number_85,
            col_number_86,
            col_number_87,
            col_number_88,
            col_number_89,
            col_number_9,
            col_number_90,
            col_number_91,
            col_number_92,
            col_number_93,
            col_number_94,
            col_number_95,
            col_number_96,
            col_number_97,
            col_number_98,
            col_number_99,
            col_number_num1,
            date,
            foo,
            num1,
            num2,
            num3,
            num5,
            num6,
            product_number,
            quantity
        FROM
            `qwiklabs-resources.python_dataflow_example.orders` orders
        LIMIT
            10
        """
        return orders_query


def run(argv=None):
    """The main function which creates the pipeline and runs it."""
    parser = argparse.ArgumentParser()
    # Here we add some specific command line arguments we expect.   S
    # This defaults the output table in your BigQuery you'll have
    # to create the example_data dataset yourself using bq mk temp
    parser.add_argument('--output', dest='output', required=False,
                        help='Output BQ table to write results to.',
                        default='lake.orders_denormalized_sideinput')

    # Parse arguments from the command line.
    known_args, pipeline_args = parser.parse_known_args(argv)

    # DataLakeToDataMart is a class we built in this script to hold the logic for
    # transforming the file into a BigQuery table.
    data_lake_to_data_mart = DataLakeToDataMart()

    p = beam.Pipeline(options=PipelineOptions(pipeline_args))
    schema = parse_table_schema_from_json(data_lake_to_data_mart.schema_str)
    # This query returns details about the account, normalized into a
    # different table.  We will be joining the data in to the main orders dataset in order
    # to create a denormalized table.
    account_details_source = (
        p
        | 'Read Account Details from BigQuery ' >> beam.io.ReadFromBigQuery(query="""
                SELECT
                  acct_number,
                  acct_company_name,
                  acct_group_name,
                  acct_name,
                  acct_org_name,
                  address,
                  city,
                  state,
                  zip_code,
                  country
                FROM
                  `qwiklabs-resources.python_dataflow_example.account`""",
                                   # This next stage of the pipeline maps the acct_number to a single row of
                                   # results from BigQuery.  Mapping this way helps Dataflow move your data around
                                   # to different workers.  When later stages of the pipeline run, all results from
                                   # a given account number will run on one worker.
                                   use_standard_sql=True)
        | 'Account Details' >> beam.Map(lambda row: (row['acct_number'], row)))

    orders_query = data_lake_to_data_mart.get_orders_query()
    (p
     # Read the orders from BigQuery.  This is the source of the pipeline.  All further
     # processing starts with rows read from the query results here.
     | 'Read Orders from BigQuery ' >> beam.io.ReadFromBigQuery(query=orders_query, use_standard_sql=True)
     # Here we pass in a side input, which is data that comes from outside our
     # main source.  The side input contains a map of states to their full name
     | 'Join Data with sideInput' >> beam.ParDo(AddAccountDetails(),
                                                account_details=AsDict(account_details_source))
     # This is the final stage of the pipeline, where we define the destination
     # of the data.  In this case we are writing to BigQuery.
     | 'Write Data to BigQuery' >> beam.io.WriteToBigQuery(
            # The table name is a required argument for the BigQuery sink.
            # In this case we use the value passed in from the command line.
            known_args.output,
            # Here we use the JSON schema read in from a JSON file.
            # Specifying the schema allows the API to create the table correctly if it does not yet exist.
            schema=schema,
            # Creates the table in BigQuery if it does not yet exist.
            create_disposition=beam.io.BigQueryDisposition.CREATE_IF_NEEDED,
            # Deletes all data in the BigQuery table before writing.
            write_disposition=beam.io.BigQueryDisposition.WRITE_TRUNCATE))
    p.run().wait_until_finish()


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.INFO)
    run()

```

And the following command to start up and shut down instances once done:

```python
python dataflow_python_examples/data_lake_to_mart.py \
	--worker_disk_type="compute.googleapis.com/projects//zones//
	--max_num_workers=4 \
	--project=$PROJECT \
	--region=us-east1 \
	--runner=DataFlowRunner \
	--machine_type=e2-standard-2 \
	--staging_location=gs://$PROJECT/test \
	--temp_location gs://$PROJECT/test \
	--save_main_session
```

This Apache Beam Dataflow pipeline will perform the Data Join and create the resulting table in BigQuery. Once done, the `orders_denormalized_sideinput` table should appear under the `lake` dataset. 








