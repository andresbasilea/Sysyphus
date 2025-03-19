circ
#### Confusion Matrix:
By convention on the rows you get the actual values and on the columns the predicted values. 

$$
 Accuracy = \frac{TN+TP}{TN+FN+TP+FP}
$$
$$
Precision = \frac{TP}{TP+FP}
$$
$$
\mathrm{Re}call = \frac{TP}{TP+FN}
$$
$$
F_{1} Score  = \frac{2}{\frac{1}{\mathrm{Re}call}+\frac{1}{Precision}} = 2 \times \frac{Precision \times \mathrm{Re}call}{Precision + \mathrm{Re}call}
$$

What do you care about?
- Minimizing False Positives -> Precision
- Minimizing False Negatives -> Recall

The **F1 score** is the harmonic mean of the precision and recall. It thus symmetrically represents both precision and recall in one metric (values from 0 to 1). Be aware that F1 score is sensitive to which class is positive. 

