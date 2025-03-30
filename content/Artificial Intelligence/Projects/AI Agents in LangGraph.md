## Laboratory
https://learn.deeplearning.ai/courses/ai-agents-in-langgraph/lesson/qyrpc/introduction

> [!info] Overview
>  This project will show what an agent is, and will show how to build an agent from scratch. It will also touch the main components in LangGraph, work with persistence and streaming capabilities and include the importance of having a Human in the Loop (HITL) for strategic decision making in a certain point of the agent's life cycle.  

## Github Repo
https://github.com/andresbasilea/AIAgents

### Building a ReAct agent from scratch

A ReAct agent (Reason + Act) is a type of agent which looks to create a synergy between reasoning and acting in language models. It combines reasoning and action in a continuous cycle. _ReAct_ prompts LLMs to generate verbal reasoning traces and actions for a task.

Generating reasoning traces allow the model to induce, track, and update action plans, and even handle exceptions. The action step allows to interface with and gather information from external sources such as knowledge bases or environments.

![[Pasted image 20250327084107.png]]

An example of this continuous cycle of reasoning and action is shown below, were the original prompt for the agent was:
`Aside from the Apple Remote, what other devices can control the program Apple Remote was originally designed to interact with?`

![[Pasted image 20250327084545.png]]
Image taken from the [original ReAct paper](https://arxiv.org/abs/2210.03629)

For the creation of the agent, we created a new project in Visual Studio Code and we will be working on a Jupyter notebook. Once opened, the first step will be to download the necessary libraries and we will then connect to the openAI models using the client OpenAI():

![[Pasted image 20250327162017.png]]
Make sure to get your api key from OpenAI and to load it on a .env file. Use .gitignore to ignore the .env file when pushing to remote. **There is no free tier for OpenAI**... so you will need to pay to connect to the API. 

Testing the connection:
![[Pasted image 20250327165257.png]]

The agent class will be used to initialize the agent with a specific prompt. In our case, we will use the prompt indicating:

```
You run in a loop of Thought, Action, PAUSE, Observation.
At the end of the loop you output an Answer
Use Thought to describe your thoughts about the question you have been asked.
Use Action to run one of the actions available to you - then return PAUSE.
Observation will be the result of running those actions.

Your available actions are:

calculate:
e.g. calculate: 4 * 7 / 3
Runs a calculation and returns the number - uses Python so be sure to use floating point syntax if necessary

average_dog_weight:
e.g. average_dog_weight: Collie
returns average weight of a dog when given the breed

Example session:

Question: How much does a Bulldog weigh?
Thought: I should look the dogs weight using average_dog_weight
Action: average_dog_weight: Bulldog
PAUSE

You will be called again with this:

Observation: A Bulldog weights 51 lbs

You then output:

Answer: A bulldog weights 51 lbs
""".strip()
```

Now, we need to create the functions that the agent will be using (the ones that we described on the prompt). 

```python
def calculate(what):
    return eval(what)

def average_dog_weight(name):
    if name in "Scottish Terrier": 
        return("Scottish Terriers average 20 lbs")
    elif name in "Border Collie":
        return("a Border Collies average weight is 37 lbs")
    elif name in "Toy Poodle":
        return("a toy poodles average weight is 7 lbs")
    else:
        return("An average dog weights 50 lbs")

known_actions = {
    "calculate": calculate,
    "average_dog_weight": average_dog_weight
}
```


Lets initialize the agent and prompt it asking the weight of a poodle: 
![[Pasted image 20250327165846.png]]

We see that the agent pauses, so we can calculate the requested value by prompting it as an observation:

![[Pasted image 20250327170910.png]]

However, we can add a loop so that the agent is able to automatically create the observation:

![[Pasted image 20250327171139.png]]

With this loop, we can see the chain of thought of the Agent below:

```
Thought: I need to find the average weight of both a Border Collie and a Scottish Terrier, then add them together to get the combined weight.
Action: average_dog_weight: Border Collie
PAUSE
 -- running average_dog_weight Border Collie
Observation: a Border Collies average weight is 37 lbs
Action: average_dog_weight: Scottish Terrier
PAUSE
 -- running average_dog_weight Scottish Terrier
Observation: Scottish Terriers average 20 lbs
Thought: Now that I have the average weights of both dogs, I can calculate their combined weight by adding the two values together.
Action: calculate: 37 + 20
PAUSE
 -- running calculate 37 + 20
Observation: 57
Answer: The combined weight of a Border Collie and a Scottish Terrier is 57 lbs.
```


Until this point, we have a working agent that was created from scratch. The process the agent is following looks like this:

![[Pasted image 20250327173125.png]]

Now we can create it using LangGraph. 

#### Components in LangGraph
- LG allows to use prompt templates, to add variables to the prompt definition. 
- LG allows to create cyclic graphs to make the agent think, act, observe, and loop. It also allows to have HITL. 
- LG is extension of LangChain that allows graphs. 
- Built in persistence allows for HITL. 

	- Nodes: Represent Agents or functions
	- Edges: Connect nodes
	- Conditional Edges: Decisions

 ![[Screenshot 2025-03-28 at 8.52.55 a.m..png]]![[Screenshot 2025-03-28 at 8.54.24 a.m..png]]

In this agent, we will have the openAI LLM, then a decision process where we check if the action to take exists, and then we take it if it does and return to the agent. 

The state is the list of messages to which we add over time. 

The following code allows to import the LangChain OpenAI wrapper, that lets us have a single interface for different models (OpenAI, Anthropic Claude, any other agent without changing code)
```Python
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
```

We then import Tavily, as the search engine that we are going to use as tool for this example. 

To create the agent state, we will use:

```python
class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]
```
Which creates a list to append all of the messages. 

To define the agent class, we use: 

```Python
class Agent:

    def __init__(self, model, tools, system=""):
        self.system = system
        graph = StateGraph(AgentState)
        graph.add_node("llm", self.call_openai)
        graph.add_node("action", self.take_action)
        graph.add_conditional_edges(
            "llm",
            self.exists_action,
            {True: "action", False: END}
        )
        graph.add_edge("action", "llm")
        graph.set_entry_point("llm")
        self.graph = graph.compile()
        self.tools = {t.name: t for t in tools}
        self.model = model.bind_tools(tools)

    def exists_action(self, state: AgentState):
        result = state['messages'][-1]
        return len(result.tool_calls) > 0

    def call_openai(self, state: AgentState):
        messages = state['messages']
        if self.system:
            messages = [SystemMessage(content=self.system)] + messages
        message = self.model.invoke(messages)
        return {'messages': [message]}

    def take_action(self, state: AgentState):
        tool_calls = state['messages'][-1].tool_calls
        results = []
        for t in tool_calls:
            print(f"Calling: {t}")
            if not t['name'] in self.tools:      # check for bad tool name from LLM
                print("\n ....bad tool name....")
                result = "bad tool name, retry"  # instruct LLM to retry if bad
            else:
                result = self.tools[t['name']].invoke(t['args'])
            results.append(ToolMessage(tool_call_id=t['id'], name=t['name'], content=str(result)))
        print("Back to the model!")
        return {'messages': results}
```

We first create the init function to use a model, tool and system messages for initialization. We then add the nodes for the llm and action to take. You can see that in the action to take, we instruct the llm to try a different action in case it hallucinates the name of the action. 

In the init function, we add the nodes and conditional edges, entry point and we then compile the graph to make it runnable. 

We then create a dictionary with the name of the tool and mapping to the tool itself. These tools were passed as argument to the Agent on initialization. We then pass the model the tools that it will have available to call using `self.model = model.bind_tools(tools)`.

The `call_openai` function adds the last message of calling OpenAI to our list of messages. On the `take_action`function, as we understand that the last message will be the one containing the tool to use, we believe that it will have the "tool_calls" attribute. We use the tool_call to invoke the necessary tools and save it to the state. 

The `exists_action`function checks wether the AgentState last message tool_calls exist, which would mean that there is a tool available to call. This is our conditional edge. 

To start using our agent, we set a prompt, set our model to use and then create the agent with the model, prompt and the tool we created earlier (Tavily search engine tool).

```python
prompt = """You are a smart research assistant. Use the search engine to look up information. \
You are allowed to make multiple calls (either together or in sequence). \
Only look up information when you are sure of what you want. \
If you need to look up some information before asking a follow up question, you are allowed to do that!
"""

model = ChatOpenAI(model="gpt-3.5-turbo")  #reduce inference cost
abot = Agent(model, [tool], system=prompt)
```

We can then create a visualization of the agent graph we just created using: 
```python
from IPython.display import Image
Image(abot.graph.get_graph().draw_png())
```

![[Screenshot 2025-03-28 at 9.24.57 a.m..png]]


We then call the agent by passing in "What is the weather in sf?". The result will be the final state the agent ended in. And to see the result we want, we can take the latest message (thus the -1).
![[Screenshot 2025-03-28 at 9.25.57 a.m..png]]

If we perform a more difficult message call, like asking for two cities, we get back that the agent calls the tool again to search for LA as well. 

![[Screenshot 2025-03-28 at 9.27.58 a.m..png]]



### Persistence and Streaming

Persistence let's you keep around the state of an agent at a particular point in time and resume that state in later interactions. 

In order to add persistence to the agent, we add the concept of a checkpointer to the initialization. A checkpointer checkpoints the state after and between every node. We will use a SQLite Saver to save the checkpoints and add persistence to the agent. We will use the in memory database (so if we reset the notebook, this information will disappear). We can connect this to an external database. 

![[Screenshot 2025-03-28 at 9.43.49 a.m..png]]

To add the possibility of having multiple conversations at the same time, we will create a dictionary were we save the ids of the conversations:
	`thread = {"configurable": {"thread_id": "1"}}`

We now call the graph with stream: 

```python
for event in abot.graph.stream({"messages": messages}, thread):
    for v in event.values():
        print(v['messages'])    
```

Adding the stream option will give us more visibility on what's going on at each point in time in our agent. 

We then ask another question about the weather, but in LA instead of SF, we will use the Thread ID to make sure that the agent understands that we are in the same conversation and still talking about the weather:

```Python
messages = [HumanMessage(content="What about in la?")]
thread = {"configurable": {"thread_id": "1"}}
for event in abot.graph.stream({"messages": messages}, thread):
    for v in event.values():
        print(v)
```

If we use this:
```Python
messages = [HumanMessage(content="Which one is warmer?")]
thread = {"configurable": {"thread_id": "2"}}
for event in abot.graph.stream({"messages": messages}, thread):
    for v in event.values():
        print(v)
```
The agent won't be able to understand which two things you are comparing, as the thread ID is different. 

We have showed that we can stream events. What about streaming tokens themselves? We will use the async LangGraph option. 

We will also need to use an Async SQLite saver:

```Python
from langgraph.checkpoint.aiosqlite import AsyncSqliteSaver

memory = AsyncSqliteSaver.from_conn_string(":memory:")
abot = Agent(model, [tool], system=prompt, checkpointer=memory)
```

We will look for event type being kind "on_chat_model_stream". 

```Python
messages = [HumanMessage(content="What is the weather in SF?")]
thread = {"configurable": {"thread_id": "4"}}
async for event in abot.graph.astream_events({"messages": messages}, thread, version="v1"):
    kind = event["event"]
    if kind == "on_chat_model_stream":
        content = event["data"]["chunk"].content
        if content:
            # Empty content in the context of OpenAI means
            # that the model is asking for a tool to be invoked.
            # So we only print non-empty content
            print(content, end="|")
```

This will stream the tokens as they are coming out of the LLM. 

![[Screenshot 2025-03-28 at 9.56.24 a.m..png]]

### Human in the loop

We will do a similar process as before, however, we will interrupt the agent when it gets to the point of taking an action:

```Python
self.graph = graph.compile(
            checkpointer=checkpointer,
            interrupt_before=["action"]
        )
```

This will add manual approval before running any tools. 

To continue after the interrupt, we can call stream again: 

```Python
for event in abot.graph.stream(None, thread):
    for v in event.values():
        print(v)
```

```Python
abot.graph.get_state(thread)

abot.graph.get_state(thread).next

messages = [HumanMessage("Whats the weather in LA?")]
thread = {"configurable": {"thread_id": "2"}}
for event in abot.graph.stream({"messages": messages}, thread):
    for v in event.values():
        print(v)
while abot.graph.get_state(thread).next:
    print("\n", abot.graph.get_state(thread),"\n")
    _input = input("proceed?")
    if _input != "y":
        print("aborting")
        break
    for event in abot.graph.stream(None, thread):
        for v in event.values():
            print(v)
```



We can use the thread unique identifier or thread snapshot to access the message in the thread at a precise moment in time. 