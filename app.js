const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { Buttons } = require('whatsapp-web.js')

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowCierreConsulta = addKeyword(['Masculino', 'Femenino', 'No binario']).addAnswer(['Gracias, ya te decimos tu lugar de votacion.', 'Aguardanos un instante'])

const flowSexo = addKeyword(['']).addAnswer('Por favor, indicá tu género según figura en tu DNI. *Masculino*, *Femenino*, *No Binario*:', {capture:true},(ctx, {fallBack}) => {
    if (ctx.body != "Masculino"){

        return  fallBack()
    } 
},

[flowCierreConsulta])

const consultar = addKeyword(['consultar', 'consulta'])
.addAnswer(['Para conocer tu lugar de votación 🗳️, por favor, escribí tu número de DNI sin puntos, comas ni espacios.'
],
null,
null,
[flowSexo]
)






const flowCiudades = addKeyword(['3', 'localidades', 'ciudades']).addAnswer(['San Justo', 
'Ramos Mejía',
'Aldo Bonzi'
])    
    
const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    ['Gracias por usar nuestro bot' ],
    null,
    null,
    [flowSecundario]
)



const denunciar = addKeyword(['denunciar', 'denuncia']).addAnswer (
    ['Ingresa en que localidad', 'si queres ver las localidades disponibles envia *localidades*'],
    null,
    null,
    [flowCiudades]
    )


const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'Estas son las opciones disponibles',
            '👉 *consultar* para consultar donde votas',
            '👉 *denunciar*  para denunciar irregularidades en una escuela',
        
        ],
        null,
        null,
        [flowGracias, denunciar, consultar, flowCiudades,flowSexo,flowCierreConsulta]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal,consultar, denunciar])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    //QRPortalWeb()
}

main()
