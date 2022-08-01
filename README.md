# Drift Translator App / One App Version

Server side application written in Node that listens for message events and translates them according to the last detected language written by the user.
Based on [this original repo](https://github.com/davehthompson/TranslateDriftChat) by [Dave Thompson](https://github.com/davehthompson)

### Application Logic

When a site visitor engages with a bot in a specific language the application will detect the language, listen for any messages sent by the site visitor, translate them, and write an internal note inside of the conversation to the target language (English in this example). Additionally, when a chat agent writes back to the chat the application will translate the message into the visitors identified language. 

### Installation and Setup
---
There are _three_ core components of this application
* Access to Google's Translation API
* One Drift Developer Application for listening for specific message events (```new_message``` and ```new_command_message```)
* Node.js runtime with appropriate dependencies executing serverside logic

#### Google Translation API
Before you can start using the Cloud Translation API, you must have a project that has the Cloud Translation API enabled, and you must have a private key with the appropriate credentials. You can also install client libraries for common programming languages to help you make calls to the API. This [setup page](https://cloud.google.com/translate/docs/setup) will walk you through getting it setup properly.

#### Drift Developer Applications
In order for Drift to expose data to the application we need to create one drift developer applications with the appropriate scopes. [This guide](https://devdocs.drift.com/docs/quick-start) will walk you through setting an dev application up. You need to subscribe to the ```new_message``` and ```new_command_message``` webhooks.

#### Node and core dependencies

This project leverages core libraries/dependencies that are listed below:

* @google-cloud/translate (https://cloud.google.com/translate/docs/reference/libraries/v2/nodejs)
* body-parser (https://www.npmjs.com/package/body-parser)
* dotenv (https://www.npmjs.com/package/dotenv)
* express (https://www.npmjs.com/package/express)
* ngrok (https://www.npmjs.com/package/ngrok)
* node (https://nodejs.org/en/)
* npm (https://www.npmjs.com/package/npm)
* superagent (https://www.npmjs.com/package/superagent)

Install Node.js first (npm should be included) locally or in the cloud depending on where you are developing. Then simply clone/download the repo locally and install the relevant dependences listed. For a one line command to install the dependencies see below:

```
npm i @google-cloud/translate body-parser dotenv express ngrok superagent
```

Once installed navigate to the root directoy where the files resides and run the following command in the IDE of your choice 
```
node index.js
```

### Considerations
---
#### Drift Developer Application

In order for the experience to function properly you will need to set up a developer app inside of your drift account for Drift to POST relevant information to your application. Please ensure you are leveraging proper scopes/subscribing to relevant webhooks. [This guide will help get this set up for you](https://devdocs.drift.com/docs/quick-start).

##### HTTP POST Requests
This application leverages `ngrok` as it's means to listening and digesting events from Drift. It is being leveraged in a free capacity and therefore whenever the service restarts a new randomly generated URL will be exposed to recieve POST requests from Drift. This URL will need to be updated inside of the relevant Drift Dev Application in order to function properly after each restart -- as seen below: 

![Capture](https://user-images.githubusercontent.com/57994411/151228007-563fafb8-e7e2-438c-98a5-81537987e4e6.JPG)
## Demo

<<<<<<< HEAD
[Watch Demo here](https://video.drift.com/v/abplTArfuQO/)
=======
[Watch Demo here](https://video.drift.com/v/abplTArfuQO/)
>>>>>>> f291b79bb56b916ad100b5dee0ff713585d4be49
