
Dataflow in GCP

- Batch and streaming data processing.
- Write once, run anywhere data processing. (Run on apache spark, google dataflow and other platforms)

#### Dataflow Pipeline Concepts
**ParDo** transforms-> parallel do -> generic parallel processing transform. Perform transform on each element of PCollection1 and locate each one on a PCollection2. Each transform on a PC1 element produces one element, no element or multiple elements on PC2. User defined function -> distributed processing function.

**Aggregation** transforms -> Computing a single value from multiple input elements. In apache beam it normally means aggregating on elements with the same key within a common window.

**PCollections**: Can be any data type, but in one pcollection it must be of the same type. Transforms are applied to every element in the PCollection. PCollections are inmmutable!