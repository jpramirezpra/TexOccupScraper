var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {

    //All the web scraping magic will happen here
    url = 'https://www.vct.org/schedule/licensedoccupationsTX.htm';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function (error, response, html) {

        // First we'll check to make sure no errors occurred when making the request

        if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture
            var profList = [];
            var occupation, license, education;
            var json = { occupation: "", license: "", education: "" };


            var rows = $('table.MsoNormalTable tbody').find('tr');


            for (var i = 0; i < rows.length; i++) {
                json = { occupation: "", license: "", education: "" };
                var row = rows.eq(i).find('td');

                if (row.length === 3) {
                    json.occupation = row.eq(0).text().trim().replace("\n", "").replace(/[ ]{2,}/g, " ");
                    json.license = row.eq(1).text().trim().replace("\n", "").replace(/[ ]{2,}/g, " ");
                    json.education = row.eq(2).text().trim().replace("\n", "").replace(/[ ]{2,}/g, " ");

                    if (json.occupation.length > 0 && json.education.length > 0) {
                        profList.push(json);
                    }
                }
            }

            var string = JSON.stringify(profList);
            var path = 'file.txt';
            fs.writeFile(path, string, function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
        }
    })


})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;