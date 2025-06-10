
- Find objects, people, text, scenes in images and videos using ML
- Facial analysis and facial search to do user verification, people counting
- Crate a database of familiar faces or compare with celebrities
- Use cases:
	- Labelling
	- Content moderation
	- Text detection
	- Face detection and analysis (gender, age, range, emotions)
	- Face search and verification
	- Celebrity recognition
	- Pathin (ex: for sports game analysis)

### Amazon Rekognition - Custom Labels
- Examples: find your logo in social media posts, identify your products on stores shelves (NFL uses it to find their logo in pictures)
- Label your training images and upload them to Amazon Rekognition
- Only needs a few hundred images or less
- Amazon Rekognition creates a custom model on your images set
- New subsequent images will be categorized the custom way you have defined
![[Screenshot 2025-05-30 at 11.30.05 a.m..png]]

### Content Moderation
- Automatically detect inappropriate, unwanted, or offensive content
- Filter out harmful images in social media, broadcast media, advertising
- Bring down human review to 1-5% of total content volume
- Integrated with Amazon Augmented AI (A2I) for human review
- **Custom Moderation Adaptors**
	- Extends Rekognition capabilities by providing your own *labeled* set of images
	- Enhances accuracy of content moderation or create a specific use case of Moderation
![[Screenshot 2025-05-30 at 11.32.21 a.m..png]]

![[Screenshot 2025-05-30 at 11.36.05 a.m..png]]


