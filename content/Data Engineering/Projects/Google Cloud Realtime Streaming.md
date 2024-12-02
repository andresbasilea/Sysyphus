

### Github Repo:
https://github.com/andresbasilea/Google-Cloud-Realtime-Streaming

![[Pasted image 20241201172625.png]]

Project connects to YouTube API and listens to changes in selected videos' statistics. The architecture includes:
- Connection to YouTube's API via Google Cloud Platform. 
- Python code to control the streaming of data from YouTube's API and send it to Kafka for realtime streaming processing via KSQL. 
- KSQL listens to YouTube's videos' statistics and records the latest likes, views and comment counts and the new counts. 
- Missing the connection to external system, but the idea would be to connect the KSQL data to an external apps that lets the user know when a change in a YouTube statistic has been made (for example: new comment, new likes, new views).

### Docker Compose Services List: 

- **Zookeeper**: Kafka broadcast relies on the Zookeeper to manage the distributed broadcast system. 
	- **Client port**: The ZooKeeper client port, typically port 2181, is where applications and services (like Kafka brokers, Hadoop, or custom applications) connect to ZooKeeper to access its coordination services.
	- ZooKeeper acts as a centralized system for managing configurations and state in a distributed environment, helping ensure consistency across services.
	- In a Kafka setup, brokers use ZooKeeper to store metadata about topics and partitions, manage broker availability, and handle leader elections (when one broker needs to become the main coordinator for a particular partition).
	- When a Kafka broker or any client wants to connect to ZooKeeper, it uses the client port (2181 by default) to communicate with it.
	- Tick time: The ZooKeeper tick time is a basic unit of time in ZooKeeper, measured in milliseconds, used to define the length of certain intervals in the ZooKeeper system.
	- Heartbeat Interval: ZooKeeper servers send heartbeat messages to each other and to connected clients to keep track of their health and connectivity. The tick time determines the frequency of these heartbeats. For instance, if tickTime is set to 2000 milliseconds (2 seconds), ZooKeeper will send a heartbeat every 2 seconds.
	- Session Timeout: The tick time is also used to set the session timeout for clients. For example, if the tick time is 2000 milliseconds, a typical session timeout might be 2 ticks (4 seconds). If a client fails to respond within the session timeout, ZooKeeper considers the client disconnected.

- **Broker**: This is the actual Kafka broker. It is defined on port 9092 and it depends on the zookeeper being healthy. 

- **Schema Registry**: Schema-registry provides centralized repository for storing and retrieving schemas for kafka topics. Integrated with Kafka to ensure that all data conforms to predefined schema.
	- Apache Kafka. The Schema Registry provides a way to manage and enforce schemas for data messages (often Avro, JSON, or Protobuf schemas) flowing through Kafka topics.
	- By defining and validating schemas, the Schema Registry ensures that data consumers and producers communicate with a consistent data structure, minimizing errors and data compatibility issues.

- **Control Center**: Control-center is web based interface for managing and monitoring Kafka clusters. You can create, modify, monitor topics and observe kafka topics, as well as perform administrative tasks.

- **Connect**: Helps to connect Kafka to other systems (for example ElasticSearch).

- **KSQL**: Distributed data store built on kafka. Allows to perform realtime computations on kafka streams using SQL like queries.


### Confluent Control Center Overview

Once the Docker Compose  yaml file is ready, we can use the `sudo docker compose up -d` command to spin up our containers. Then, we can enter to `localhost:9021` and have a glance at the control center. 
![[Pasted image 20241201175959.png]]

<small> 1 Healthy cluster and connected services with 1 status indicate that we have correctly configured our compose file </small>

![[Pasted image 20241201180100.png]]

<small> On the left, we see the containers created for ksqlDB, our connect cluster and Kafka topics. Note that on the Overview panel, we can see under topics that there are 58 total topics. These topics are internal topics.</small>


![[Pasted image 20241201181646.png]]

<small> Here we have the ksqlDB cluster, where we can run queries on our Kafka streams </small>


### Getting YouTube's API key

Inside the Google Cloud Platform console, create a new project. In this case, I had already created the *YoutubeAnalytics* project.
![[Pasted image 20241201191616.png]]

Go to the *APIs and Services* section and look for the *YouTube Data API v3*. Enable the API.
![[Pasted image 20241201192045.png]]

Go to manage->credentials and create an API key. 

Create a config file, and add the YouTube's API key and playlist id (we are going to do analytics on a specific YouTube playlist, in this case the one defined by the following ID: *PLXhfRoiJBIis0kqgoepmm4UiHK-ixpVll*

```config.local
[youtube]
API_KEY=Here goes your API key
PLAYLIST_ID=PLXhfRoiJBIis0kqgoepmm4UiHK-ixpVll
```

We will later use this API key via the *constants.py* file to call the YouTube's API on our main function. The *constants* file should look something like this:

```python
import configparser
import os

parser = configparser.ConfigParser()
parser.read(os.path.join(os.path.dirname(__file__), 'config.local'))

YOUTUBE_API_KEY = parser.get('youtube', 'API_KEY')
PLAYLIST_ID = parser.get('youtube', 'PLAYLIST_ID')
```

On the previous code, we use the config parser to read the information from our *config.local* file. This way, we can get the API_KEY and PLAYLIST_ID values without having to expose them on public repositories.

> [!info] This example's playlist
> For this project, we will be analyzing data from this playlist: https://www.youtube.com/watch?v=Tk23kQRFWcw&list=PLL0BXIloA_5y3uX2UO0ktpQtUcuc2zGj-
> 
> The playlist is actually the album *Artaud* by *Pescado Rabioso*, one of the famous rock artist Luis Alberto Spinetta's bands. This album is iconic not only because it is named after the famous french poet Antonin Artaud (whose life is extremely interesting by itself, and is described in greater detail here [[Antonin Artaud]]), but also because the vinyl's irregular case shape made the music stores extremely furious, as they could not place it in the stands to sell. 
> ![[Pasted image 20241201205058.png]]




### Building the Python Script

We will build a simple Python script to call the YouTube's API and get information from the videos inside our playlist. 

#### Helper Functions

###### fetch_page
```python
def fetch_page(url, parameters, page_token=None):
	params = {**parameters, 'key': YOUTUBE_API_KEY, 'page_token': page_token}
	response = requests.get(url, params)
	payload = json.loads(response.text)

	return payload
```

The fetch_page function will allow us to call the *get* method from YouTube's API, returning the information from a single video from the playlist. 

###### fetch_page_lists
```python
def fetch_page_lists(url, parameters, page_token=None):

	while True:
		payload = fetch_page(url, parameters, page_token)
		yield from payload['items']		
		
		page_token = payload.get('nextPageToken')
		if page_token is None:
			break
```

###### format_response
```python
def format_response(video):
	video_res = {
		'title': video['snippet']['title'],	
		'likes': int(video['statistics'].get('likeCount', 0)),
		'comments': int(video['statistics'].get('commentCount', 0)),
		'views': int(video['statistics'].get('viewCount', 0)),
		'favorites': int(video['statistics'].get('favoriteCount', 0)),
		'thumbnail': video['snippet']['thumbnails']['default']['url']
	}
	return video_res
```

We can use the format_response function to, as its name implies, format the API response and only get some information in a specified key-value format. 

And we call the previous methods to publish into the Kafka producer using the code  in the *main* function:
```python
if __name__ == "__main__":

	logging.basicConfig(level=logging.INFO)	
	producer = KafkaProducer(bootstrap_servers=['localhost:9092'])
	
	for video_item in fetch_page_lists(
		"https://www.googleapis.com/youtube/v3/playlistItems",
		{'playlistId': PLAYLIST_ID, 'part': 'snippet,contentDetails'},
		None):	
		video_id = video_item['contentDetails']['videoId']
			
		for video in fetch_page_lists(
			"https://www.googleapis.com/youtube/v3/videos",
			{'id': video_id, 'part': 'snippet,statistics'},
			None):
	
			# logging.info("Video here => %s", pprint(format_response(video)))
			producer.send('youtube_videos',
						json.dumps(format_response(video)).encode('utf-8'),
						key=video_id.encode('utf-8'))
			print('Sent ', video['snippet']['title'])
			# producer.flush()
```



Once we have created the code to send messages to the *youtube_videos* topic, we can test it by running the *youtube_analytics.py* script using `python youtube_analytics.py` on the bash. The output from running the code can be seen on the following image, where the Kafka topic is filled with messages with information from the youtube videos of the playlist. 

![[Pasted image 20241201223038.png]]

<small> We can see that the topic youtube_videos is filled with new messages when we run the youtube_analytics.py file. If we click on a topic, we can see the information gathered from a specific video </small>

### Using ksqlDB

To perform queries on the data streamed to our Kafka topic, we use ksqlDB. As a first step, we need to create a stream to analyze. To do this, we define the schema of our messages, and link the ksql stream to a Kafka topic, in this case the *youtube_videos* topic. 

![[Pasted image 20241201224647.png]]

<small> Linking the stream to our youtube_videos topic </small>

The response from the previous *CREATE STREAM* returns *SUCCESS*, as seen below:
![[Pasted image 20241201224824.png]]

Now we can run queries on our topic messages. For example, let's select the videos with more than one thousand likes:

![[Pasted image 20241201225326.png]]

<small> Using the ksqlDB Editor to query videos with more than one thousand likes inside our topic </small>

Let's use the following query to check the likes on each video from the playlist in realtime:

```sql
SELECT
video_id, 
latest_by_offset(title) AS title, 
latest_by_offset(likes, 2) AS likes
FROM youtube_videos
GROUP BY video_id
EMIT CHANGES;
```


![[Pasted image 20241201231906.png]]

<small> When running the query, each time an event is produced into the topic, the query will bring the latest number of likes for each of the videos inside our playlist. This way, we can track on realtime the changes to likes (or other metrics) inside youtube videos. </small>

> [!abstract] Running queries
> When running the query, each time an event is produced into the topic, the query will bring the latest number of likes for each of the videos inside our playlist. This way, we can track on realtime the changes to likes (or other metrics) inside youtube videos. 


We can change the query and create a table so that ksqlDB stores the previous and the current number of likes for each video inside the playlist. Let's give it a try with the video *A Starosta, El Idiota - Artaud - Spinetta*, which originally had 3020 likes. 

![[Pasted image 20241201232721.png]]

Once we have liked the video, we can see that the query now shows the previous number of likes and the current (3021) correctly. 

![[Pasted image 20241201233207.png]]

Once we have created the table, we can use the following query to listen and select only the videos which have changes in the number of likes. 

![[Pasted image 20241201233609.png]]

Now, after liking another video, the query immediately brings back the results! This way, I can keep track of changes inside the Kafka topics and query for specific data changes!

![[Pasted image 20241201233715.png]]

This query's result can be sent to an external application to perform some action or to notify the changes in the videos metadata (likes, in this case). For example, we could constantly query changes in videos likes and have a realtime analysis of what video inside our playlist is having a bigger increase in likes in a specific range of time. 



##### Errors:
Kafka-Six-Moves error: http://elrincondekike.com/post/15

