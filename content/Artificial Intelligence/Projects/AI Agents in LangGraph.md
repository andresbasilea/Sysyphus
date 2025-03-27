## Laboratory
https://learn.deeplearning.ai/courses/ai-agents-in-langgraph/lesson/qyrpc/introduction

> [!info] Overview
>  This project will show what an agent is, and will show how to build an agent from scratch. It will also touch the main components in LangGraph, work with persistence and streaming capabilities and include the importance of having a Human in the Loop (HITL) for strategic decision making in a certain point of the agent's life cycle.  

### Building a ReAct agent from scratch

A ReAct agent (Reason + Act) is a type of agent which looks to create a synergy between reasoning and acting in language models. It combines reasoning and action in a continuous cycle. _ReAct_ prompts LLMs to generate verbal reasoning traces and actions for a task.

Generating reasoning traces allow the model to induce, track, and update action plans, and even handle exceptions. The action step allows to interface with and gather information from external sources such as knowledge bases or environments.

![[Pasted image 20250327084107.png]]

An example of this continuous cycle of reasoning and action is shown below, were the original prompt for the agent was:
`Aside from the Apple Remote, what other devices can control the program Apple Remote was originally designed to interact with?`

![[Pasted image 20250327084545.png]]
Image taken from the [original ReAct paper](https://arxiv.org/abs/2210.03629)






### Concluding remarks



### Questions to think about

