- Fully managed Gen-AI assistant for your employees
- Based on your company's knowledge and data
	- Answer questions, provide summaries, generate content, automate tasks
	- Perform routine actions (e.g., submit time-off requests, send invites, etc)
- Built on Bedrock (you cannot choose Foundational Model used)
![[Screenshot 2025-06-09 at 11.43.59 a.m..png]]

![[Screenshot 2025-06-09 at 11.47.16 a.m..png]]

### Data Connectors (fully managed RAG)
- Connects to 40+ popular enterprise data sources
	- Slack
	- SharePoint
	- MS 365
	- Salesforce
	- S3
	- RDS
	- WorkDocs
	- Aurora
	- Drive
	- Gmail

### Plugins
- Allows you to interact with 3rd party services
	- Jira, ServiceNow, Zendesk, Salesforce
- Can create jira tickets, move data, etc
- Create custom plugins as well

### Q Business + IAM Identity Center
- Users must be authenticated through IAM Identity Center
- Users receive responses generated only from the documents they have access to
- IAM Identity Center can be configured with external identity providers
	- Google Login, Microsoft Active Directory, etc.
	- Login where users are already created
- ![[Screenshot 2025-06-09 at 12.09.42 p.m..png]]

### Admin Controls
- Controls and customize responses to your organizational needs
- Admin controls == guardrails 
- Block specific words or topics
- Respond only with internal information (vs using external knowledge as well
- Global controls & topic-level controls (more granular rules)

## Hands-On Demo