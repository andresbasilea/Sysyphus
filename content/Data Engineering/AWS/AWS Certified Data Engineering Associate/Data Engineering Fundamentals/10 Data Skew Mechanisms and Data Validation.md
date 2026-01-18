
Causes: 
- Non-uniform distribution of data
- Inadequate partitioning strategy
- Temporal skew (maybe data grows exponentially in a period of time)


Important to monitor data distribution and alert when skew issues arise


## Data Validation
- Completeness
	- Ensure all required data is present
	- Checks: Missing values, null counts, percentage of populated fields
	- Importance: Missing data can lead to inaccurate analysis
- Consistency
	- Ensures data values are consistent across datasets and do not contradict each other
	- Checks: Cross-field validation, comparing data from different sources or periods
	- Importance: Inconsistent data can cause confusion
- Accuracy
	- Ensures data is correct, reliable and represents what is supposed to
	- Checks: Comparing with trusted sources, validation against known standards or rules
- Integrity
	- Ensures data maintains its correctness and consistency over its lifecycle and across systems
	- Checks: Referential integrity (e.g. foreign key checks in databases), relationship validations.
	- 