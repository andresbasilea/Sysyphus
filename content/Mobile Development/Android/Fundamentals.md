

### Language

Android apps can be written using Kotlin, Java or C++, with a preference for the first one. The Android Software Development Kit (SDK) compiles your code and data into an APK or Android App Bundle. 

### APK

An Android package is a file with the `.apk`suffix and contains the contents of an Android app required at runtime. 

### Android App Bundle

File with a `.aab`suffix, contains the contents of an Android app project including additional metadata NOT needed at runtime. This is a publishing format that can't be installed on Android devices. 

### Android Security Features

- Android OS is a multi-user Linux system in which each app is a different user. 
- By default, the system assigns each app a unique Linux user ID, which is used only by the system and is unknown to the app. Only the user ID assigned to that app can have permission to access all the files in the app. 
- Each process has its own VM, so an app's code runs in isolation from other apps. 
- Android OS implements the principle of least privilege. 
- If an app needs access to device data such as Bluetooth or location, the user has to explicitly grant these permissions. 


### App components

- The essential building blocks of an Android app. There are four types of components: 
	- Activities
	- Services
	- Broadcast receivers
	- Content providers

##### Activities
- Entry point for interfacing with the user. It represents a single screen with a user interface. Although they work together to form a cohesive UX, each one is independent of the others. 
- A different app can start any of these activities if the app containing them allows it. For example, an email app may concede permission to a camera app to start the email composing activity to send a photo via email. 

##### Services
- General purpose entry point for keeping an app running in the background. Component that runs in the background to perform long-running operations or to perform work for remote processes. A service does not provide a user interface. 
- For example, a service might play music in the background while the user is in a different app. 
- Two types of services that tell the system how to manage an app: 
	- **Started services**
	- **Bound services**