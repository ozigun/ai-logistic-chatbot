/**
 * @fileOverview
 * 
 * ## Features:
 * 
 * ## Purpose:
 * 
 * ## Dependencies:
 * 
 * ## Use Cases:
 * 
 * ## Usage:
 * 
 * ## Notes:
 */

// ! INCLUDED FILES
const fs = require('fs');
const { PdfReader, TableParser }  = require('pdfreader');
// ! INCLUDED FILES

/**
 * @description Handler class for all errors. The Error object is created from this class for errors that occur during each operation carried out in the project.
 * 
 * @class PDFReader 
 * 
 */
class PDFReader
{
    constructor(fileName, filePath)
    {
        this.fileName = fileName;
        this.filePath = filePath;
        this.file = `${this.filePath}/${fileName}`;
    };

    read()
    {
        return new Promise((resolve, reject) => {
                fs.readFile(this.file, (err, pdfBuffer) => {
                
                    if (err) 
                    {
                        reject(err)
                    };
                    /**
                     * @type {string}
                     */
                    let textContent = '';

                    new PdfReader().parseBuffer(pdfBuffer, (err, data) => {
                        if (err) 
                        {
                            reject(err)
                        }
                        else if (!data)
                        {
                            console.log('End of PDF');
                            resolve(textContent);
                        }
                        else if (data.text)
                        {
                            console.log(data.R)
                            textContent += `${data.text} `;
                        };
                    });
            });
        });
    };

};


module.exports = PDFReader;