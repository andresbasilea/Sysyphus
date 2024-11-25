A Python Virtual Environment `venv` is a method of containing specific Python interpreter and software libraries which are needed to support a project (library or application). These are by default isolated from software in other virtual environments and Python interpreters and libraries installed in the operating system. 

### A virtual environment
- Is considered as disposable: It should be simple to delete and recreate from scratch. You don't place any project code in the environment. 
- Is built into Python. 
- Is lightweight, focuses on Python packages only. 
- Uses `pip` as default packet management method. 

```python
# Create a virtual environment on terminal
python3 -m venv myenv 

# Activate the virtual environment # On Linux: 
source myenv/bin/activate 
```

### A Conda Environment
- Follows a similar principle than what is described for `venv`s.
- Is part of Anaconda/Miniconda (distribution of Python and R that aims to simplify package management and deployment).
- Manages Python and non-Python dependencies. 
- Uses `conda` packet management, but also supports `pip`

As a general rule of thumb, you should use `venv` for pure Python projects and `Conda` for mixed dependencies projects. 