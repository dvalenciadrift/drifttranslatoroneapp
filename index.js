//Declare dependencies
require('dotenv').config()
const { Translate } = require('@google-cloud/translate').v2;
const ngrok = require('ngrok')
const express = require('express')
const request = require('superagent')
const bodyParser = require('body-parser')

//Define Variables
const app = express()
const port = process.env.PORT || 4040
const conversationApiBase = 'https://driftapi.com/conversations/'
const oneAppToken = process.env.ONEAPP_TOKEN
const projectId = process.env.PROJECT_ID
const keyFilename = 'keyfile.json'
const translate = new Translate({ projectId, keyFilename });

//Global Variable to store current detected language
let detectedText

//leverage middleware for response/request objects
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//serve server locally
app.listen(port, () => {
    console.log(process.env.USER_ID)
    console.log(`App running locally on: http://localhost:${port}`);
});
//expose local webserver to internet
startNgrok = async () => {
    const url = await ngrok.connect(port)
    console.log(`Payload digestion for translating site visitor message URL is: ${url}/translate`)
}
startNgrok()

//define overall logic for listening to Drift Events and taking translation action
app.post('/translate', async (req, res) => {
    if (req.body.data.type === 'private_note' && req.body.type === 'new_command_message') {
        try {
            let driftAuthorType = req.body.data.author.type
            let driftAuthorId = req.body.data.author.id
            let driftMessageType = req.body.data.type
            let driftMessage = req.body.data.body
            let validateNote = driftMessage.search('/translate')
            if (driftAuthorType === 'user' && driftMessageType === 'private_note' && validateNote != -1) {
                let driftAuthorId = req.body.data.author.id
                let regex = /([/])\w+/g
                let ModifiedDriftMessage = driftMessage.replace(regex, '')
                console.log(`This is the ModifiedDriftMessage value: ${ModifiedDriftMessage}`)
                console.log(`Translating ${ModifiedDriftMessage} as it was an internal note created by a Drift User`)
                let driftConversationAgent = req.body.data.conversationId
                console.log(`This is the value of driftConversationAgent: ${driftConversationAgent}`)
                let translatedText = await translateText(ModifiedDriftMessage, detectedText)
                request.post(`${conversationApiBase}${driftConversationAgent}/messages`)
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${oneAppToken}`)
                    .send({
                        "type": "chat",
                        "body": `${translatedText[0]}`,
                        "userId": driftAuthorId
                    })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return {
                            error: err.message
                        }
                    })
            } else {
                console.log('Internal note was not made by a user')
            }
        } catch (error) {
            console.error(error)
        }
    } else if (req.body.data.type === 'chat' && req.body.data.author.type === 'contact') {
        try {
            let driftBot = req.body.data.author.bot
            let driftAuthorType = req.body.data.author.type
            if (driftAuthorType === 'contact') {
                let driftMessage = req.body.data.body
                let driftConversation = req.body.data.conversationId
                console.log(`Translating ${driftMessage} as it was entered by a contact`)
                detectedText = await detectLanguage(driftMessage)
                console.log('detected language', detectedText)
                let dbEntryRaw = {
                    conversationId: driftConversation,
                    langcode: detectedText[0].language
                }
                let translatedText = await translateText(driftMessage, 'en')
                console.log(translatedText)
                request.post(`${conversationApiBase}${driftConversation}/messages`)
                    .set('Content-type', 'application/json')
                    .set('Authorization', `Bearer ${oneAppToken}`)
                    .send({
                        "type": "private_note",
                        "body": `${driftMessage} *** Translates in English to: *** ${translatedText[0]}`
                    })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        return {
                            error: err.message
                        }
                    })
            } 
        } catch (error) {
            console.error(error)
        }
    }
})

//Helper Functions

//Detect language
const detectLanguage = async (driftMessage) => {
    // Run request
    const response = await translate.detect(driftMessage);

    return response[0].language
}

//Translate text 
const translateText = async (driftMessage, detectedText) => {
    const toTranslate = driftMessage
    const targetLang = 'en'
    // Run request
    const response = await translate.translate(toTranslate, detectedText);
    return response

}

//Search db of Convo ID's and associated language code
const findLang = (lang) => {
    return lang.conversationId === driftConversationAgent
}

