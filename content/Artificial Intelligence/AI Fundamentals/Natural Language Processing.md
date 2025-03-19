
### Intents and Entities 

**Intents** represent the purpose or goal behind a user's input. They capture the meaning of what the user wants to accomplish. For example: *book a flight*, *schedule a meeting*, etc. 

**Entities** extract specific pieces of information from the user's input that help fulfill the intent. These are often nouns such as names, dates, location, or product types. 

An example of capturing both intents and entities from a user's input is shown below:

| User Query                                | Intent         | Extracted Entities                      |
| ----------------------------------------- | -------------- | --------------------------------------- |
| "Book a flight to Paris next Monday"      | `BookFlight`   | `destination=Paris`, `date=next Monday` |
| "I want to order a large pepperoni pizza" | `OrderPizza`   | `size=large`, `type=pepperoni`          |
| "What's the weather in New York today?"   | `CheckWeather` | `location=New York`, `date=today`       |

When a user inputs a message, an NLP model (like a chatbot) will:
1. **Classify the Intent** (e.g., `BookFlight`)
2. **Extract Entities** (e.g., `destination=Paris`, `date=next Monday`)
3. **Use the information to generate a response** (e.g., "Sure! Booking a flight to Paris on Monday.")

##### **Tools for Intent & Entity Recognition**
- Google Dialogflow
- Microsoft LUIS
- Rasa NLU
- spaCy & Transformers (Custom NLP models)

### Preprocessing (StopWords, Lemmatization, Word Embeddings)



### Large Language Models (LLMs)

### Transformers

### Cosine Similarity

### Language Models Anomalies 

