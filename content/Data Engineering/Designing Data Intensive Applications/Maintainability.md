[[Foundations of Data Systems]]

To design software in such a way that it hopefully minimizes pain during maintenance: 
- Operability
	- Make it easy for operations teams to keep the system running smoothly.
- Simplicity
	- Make it easy for new engineers to understand the system, by removing as much complexity as possible from the system
	- There are various possible symptoms of complexity: explosion of the state space, tight coupling of modules, tangled  dependencies, inconsistent naming and terminology, hacks aimed at solving performance problems, special-casing to work around issues elsewhere, and many more.
- Evolvability
	- Make it easy for engineers to make changes to the system in the future (also known as extensibility, modifiability or plasticity)
	- The ease with which you can modify a data system, and adapt it to changing requirements, is closely linked to its simplicity and its abstractions: simple and easy-to-understand systems are usually easier to modify than complex ones.
	- Agile working patterns provide a framework for adapting to change
