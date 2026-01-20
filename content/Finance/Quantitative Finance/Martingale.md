
Sequence of random variables that is like a fair game. you have an equal prob of going forwards or backwards, on average you will stay on the same value. 

In probability theory, a martingale is a stochastic process in which the expected value of the next observation, given all prior observations, is equal to the most recent value. In other words, the conditional expectation of the next value, given the past, is equal to the present value. Martingales are used to model fair games, where future expected winnings are equal to the current amount regardless of past outcomes.


## Conditional Expectation

If $X$ is a [[Random variable (stochastic variable)]], then its expectation, $\mathbb{E}[X]$ can be thought of as the best guess for $X$ given no information about the result of the trial. A **conditional expectation** can be considered as the best guess given some but not total information. 

Let $X_1, X_2, ...$ be random variables which we think of as a time series with the data arriving one at a time. At time $n$, we have viewed the values $X_1, ..., X_n$. If $Y$ is another random variable, then $\mathbb{E}(Y|X_1, ... , X_n)$ is the best guess for $Y$ given $X_1, ... X_n$. 

We will assume that $Y$ is an integrable random variable, which means $E[|Y|] < \infty$. 
To save some space, we will write $F_n$ for “the information contained in 
$X_1, \dots, X_n$” and $E[Y \mid F_n]$ for $E[Y \mid X_1, \dots, X_n]$. 
We view $F_0$ as no information. The best guess should satisfy the following properties:

- If we have no information, then the best guess is the expected value. In other words, $\mathbb{E}[Y|F_0] = \mathbb{E}[Y]$. 
- The conditional expectation $\mathbb{E}[Y|F_n]$ should only use the information available at time $n$. In other words, it should be a function of $X_1, ..., X_n$, 
	- $E[Y \mid \mathcal{F}_n] = \phi(X_1, \dots, X_n)$. 
	- We say that $E[Y \mid \mathcal{F}_n]$ is $\mathcal{F}_n$-measurable.

The definitions in the last paragraph are certainly vague. We can use measure theory 
to be precise. We assume that the random variables $Y, X_1, X_2, \dots$ are
defined on a probability space $(\Omega, \mathcal{F}, P)$. Here $\mathcal{F}$ is a $\sigma$-algebra or $\sigma$-field of subsets of $\Omega$, that is, 
a collection of subsets satisfying:
- $\emptyset \in \mathcal{F}$;
- $A \in \mathcal{F}$ implies that $\Omega \setminus A \in \mathcal{F}$;
- $A_1, A_2, \dots \in \mathcal{F}$ implies that $\bigcup_{n=1}^{\infty} A_n \in \mathcal{F}$.

The information $\mathcal{F}_n$ is the smallest sub $\sigma$-algebra $\mathcal{G}$ of $\mathcal{F}$ such that $X_1, \dots, X_n$ are $\mathcal{G}$-measurable. 
The latter statement means that for all $t \in \mathbb{R}$, the event $\{X_j \le t\} \in \mathcal{F}_n$. The “no information” $\sigma$-algebra $\mathcal{F}_0$ is the trivial $\sigma$-algebra containing only $\emptyset$ and $\Omega$.

##### What is "Information" ($F_n$)?

In the text, $F_n$ represents the **information** we have gained by observing the first $n$ random variables ($X_1$ through $X_n$).
Mathematically, we call this a **filtration**. Imagine you are watching a stock price day by day.

- $F_0$ is the start of the day; you know nothing.
    
- $F_1$ is what you know after Day 1.
    
- $F_n$ is the total history of the stock up to Day $n$.

The text explains that $F_n$ is the "smallest $\sigma$-algebra" that makes those variables measurable. This is just a fancy way of saying: "$F_n$ contains exactly the information revealed by $X_1, \dots, X_n$ and nothing more."







