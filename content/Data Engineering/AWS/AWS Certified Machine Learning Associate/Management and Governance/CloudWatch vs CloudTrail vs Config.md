### CloudWatch
- Performance monitoring (metrics, cpu, network, etc) & dashboards
- Events & Alerting
- Log aggregation and analysis

### CloudTrail
- Record API calls made within your Account by everyone
- Can define trails for specific resources
- Global service

### Config 
- Record configuration changes 
- Evaluate resources against compliance rules
- Get timeline of changes and compliance


#### For an Elastic Load Balancer

CloudWatch
- Can monitor incoming connections metric
- visualize error codes as a % over time
- Make a dashboard to get an idea of the load balancer performance
Config
- Track security group rules for the load balancer
- Track configuration changes for the load balancer
- Ensure an SSL certificate is always assigned to the Load Balancer 
CloudTrail
- Track who made any changes to the Load Balancer with API calls

