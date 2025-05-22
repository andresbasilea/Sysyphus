- Helps with auditing and recording compliance of your AWS resources
- Helps record configurations and changes over time
- Questions that can be solved with AWS Config:
	- Is there unrestricted SSH access to my security groups? 
	- Do my buckets have any public access?
	- How has my ALB configuration changed over time? 
- You can receive alerts (SNS Notifications) for any changes
- AWS Config is a per-region service
- Can be aggregated across regions and accounts
- Possibility of storing the configuration data into S3 (analyzed by Athena)

### Config Rules 
- Can use AWS managed config rules (over 75)
- Can make custom config rules (must be defined in AWS Lambda)
- Rules can be evaluated / triggered: 
	- For each config change
	- And / or: at regular time intervals
- AWS Config Rules does not prevent actions from happening (NO DENY)

### Config Rules - Remediations
- Automate remediation of non-compliant resources using SSM Automation Documents
- Use AWS-Managed Automation Documents or create custom Automation Documents
	- You can create custom Automation Documents that invokes Lambda function
- You can set **Remediation Retries** if the resource is still non-compliant after auto-remediation

![[Screenshot 2025-05-21 at 4.54.37 p.m..png]]

### Config Rules - Notifications
- Use EventBridge event to trigger notifications when AWS resources are non-compliant
- Ability to send configuration changes and compliance state notifications to SNS (all events - use SNS Filtering or filter at client-side)

