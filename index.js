const express = require('express')
//const bodyParser = require('body-parser')
const { request } = require('express')
const {WebhookClient} = require('dialogflow-fulfillment');
const nodemailer = require('nodemailer');

const app = express()
//app.use(bodyParser.json())
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.post('/dialogflow-fullfillment', (request, response)=>{
    dialogflowFullfillment(request, response)
})

app.listen(port,() =>{
    console.log(`Listening on port ${port}`)
})

const dialogflowFullfillment =(request, response) => {
    const agent = new WebhookClient({request, response})
    function envio_email(agent){
        var nodemailer = require('nodemailer');
        var transporte = nodemailer.createTransport({
            service: 'Outlook', //servidor a ser usado
            auth: {
                user: "joaovitorsoares0802@hotmail.com", // dizer qual o usuário
                pass: "vito080202" // senha da conta
            }
        });

        var email = {
            from:"joaovitorsoares0802@hotmail.com", // Quem enviou este e-mail
            to: request.body.queryResult.parameters['email'], // Quem receberá
            subject: request.body.queryResult.parameters['assunto'], // Um assunto
            html: request.body.queryResult.parameters['mensagem'] // O conteúdo do e-mail
        };

        transporte.sendMail(email, function(error, info){
            if(error){
                console.log (error);
                throw error; // algo de errado aconteceu.
            }
            agent.add('Email enviado! Leia as informações adicionais: '+ info);
        });
    
    }
    let intentMap = new Map();
    intentMap.set("envio_email", envio_email)
    agent.handleRequest(intentMap)
}