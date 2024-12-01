Fault vs Failure: Fault is usually defined as one component of the system deviating from its spec, whereas a failure is when the system as a whole stops providing the required service to the user. You must design fault-tolerance mechanisms that prevent faults from causing failures. 

Creating deliberate faults can be useful to test fault-tolerance. Example "Netflix Chaos Monkey" [[Netflix Chaos Monkey]]

### Hardware Faults

- Hard disks crash, Faulty RAMs, Power Grid Blackout, etc. 
- Redundancy can be a solution to hardware faults... when one piece of hardware fails, the redundant copy takes action. 
- As data volumes have increased, more applications have begun using larger numbers of machines, which increases the number of HW faults. 

### Software Faults

- Software bugs
- Runaway process that uses shared resource - CPU time, memory, disk space or network bandwidth. 
- A service that the system depends on that slows down, becomes unresponsive
- Cascading failures, where a small fault in one component triggers a fault in another component, which in turn triggers further faults. 
- There is no quick solution to the problem of systematic faults in software. Lots of small things can help: carefully thinking about assumptions and interactions in the system; thorough testing; process isolation; allowing processes to crash and restart; measuring, monitoring, and analyzing system behavior in production. 

### Human Errors

The best reliable systems combine several approaches: 
- Design systems in a way that minimizes opportunities for error. For example, well-designed abstractions, APIs, and admin interfaces. 
- Decouple the places where people make the most mistakes from the places where they can cause failures. Provide fully featured non-production *sandbox* environments where people can explore and experiment safely, using real data, without affecting real users. 
- Test thoroughly. From unit tests to whole-system integration tests and manual tests. 
- Allow quick and easy recovery from human errors. Make it fast to roll back configuration changes, roll out new code gradually, and provide tools to recompute data. 
- Set up detailed and clear monitoring, such as performance metrics and error rates. 
- Implement food management practices and training. 