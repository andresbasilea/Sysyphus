- Indexing 
	- Avoid full table scans
	- Enforce data uniqueness and integrity
- Partitioning
	- Reduce amount of data scanned
	- Helps with data lifecycle management
	- Enables parallel processing
	- Used for example in searching by date. 
- Compression
	- Speed up data transfer, reduce storage, and disk reads
	- GZIP, LZOP, BZIP2, ZSTD (Redshift examples)
	- Columnar compression (for example with Parquet), might be more efficient


