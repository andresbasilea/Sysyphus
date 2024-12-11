

Joe Reis (OREILLY, *Fundamentals of Data Engineering*, 2022), enlists the principles of good data architecture as follows:
1. Choose common components wisely
2. Plan for failure
3. Architect for scalability
4. Architecture is leadership
5. Always be architecting
6. Build loosely coupled systems
7. Make reversible decisions
8. Prioritize security
9. Embrace FinOps

#### **Some Best Practices:**
- Data Products Approach
- Leverage Data versioning
- Design efficient and scalable pipelines
- Automate data pipelines and monitoring
- Avoid data duplicates with idempotent pipelines
- Principle of least access. Make sure buckets, instances, etc. are only accessible by those who need to access them.

#### Production version control best practices
- No merge/pull request can pass without approval: In the true nature of peer review, all changes (except arguably the most critical bug fixes) should be reviewed and approved before being merged. These ideally should also be reviewed by the SME for which the changes involve (i.e. the Airflow expert for any Airflow changes).
- Main should be a protected branch: Committing straight to main or the production branch ideally should be prohibited and can only be done through merges.
- All repositories should have the corresponding CI/CD set up in the early phases: Whether it’s a tool like Jenkins or GitLab CI/CD, setting up the pipelines at the beginning of the project ensures that the process will be smooth going forward. Pipelines should run the corresponding tests before sending the artifacts to their final location.
- Document the code: Yes, commenting the code is important, but a proper README goes a long way as well in making sure the critical pieces of the code are understood.
