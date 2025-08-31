const express = require('express');

const server = express();

const PORT = 3000;

// main route
server.get("/", async function (request, response) 
                {
                    const text =  request.params;
                    const url = request.url;

                    const reader = require('./handlers/pdfReader');
                    const pdf_reader = new reader('file-example_PDF_1MB.pdf', '../libs/');

                    const pdfText = await pdf_reader.read();

                    response.send(pdfText)
                }
);



server.listen(PORT, function (){
    console.log(`NAHHHHH! Server is listnening on port ${PORT}`);
})