var express = require('express');
var router = express.Router();
var path = require('path');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const request = require('request');
const fs = require("fs");
const readline = require('readline');

const models = require(path.join(__dirname,'..','models/index'));
const User = models.User;
const config = require(path.join(__dirname,'..','config/helloworld.json'));


// GET home page
router.get('/', function(req, res, next) {

    let lang;

    // Select a random language for our 'Hello, World' message
    const Translation = models.Translation;
    const Font = models.Font;

    // Get up our main async function
    const getStuff = async () => {

        // Get a random translation from the database
        const transModel = await Translation.findOne({
            order: [
                Sequelize.fn('RANDOM'),
            ]
        });
        trans = transModel.toJSON();

        // Do we need to translate on-the-fly?
        if (trans.translation == null) {

            // Call the API
            const escapedHelloWorld = encodeURIComponent('Hello, World');
            var getString = `${config.yandex.uri}?key=${config.yandex.apikey}&lang=en-${trans.languageCode}&text=${escapedHelloWorld}`;

            // Make the request
            const getTrans = () => new Promise((resolve, reject) => {

                request.get({uri: getString, json: true}, (error, response, body) => {

                    // Did it work? or did translation fail?
                    if(error || response.statusCode != 200) {
                        reject(error);
                    } else {
                        resolve(body);
                    }

                });

            });

            let transRes = await getTrans();

            // Add the translation to the database
            trans.translation = transRes.text[0];
            await Translation.update(
                {translation: trans.translation},
                {where: {id: trans.id}}
            );

        }

        // Get a random font
        const fontModel = await Font.findOne({
            order: [
                Sequelize.fn('RANDOM'),
            ]
        });
        const font = fontModel.toJSON();

        // A message of the day
        const abc = () => new Promise((resolve, reject) => {
            const lineno = Math.floor(Math.random() * (86)) + 1;
            let linecount = 0;
            const rl = readline.createInterface({
                input: fs.createReadStream('chuck.txt')
            });
            rl.on('line', (line) => {
                linecount++;
                if(linecount == lineno){
                    resolve(line);
                }
                
            })
        });
        const chuck = await abc();

        // Finally, a list of users
        const userList = await User.findAll({
            attributes: ['id', 'name', 'status']
        });
        
        const users = userList.map((singleUser) => {
            return singleUser.toJSON();
        });
        
        // Here's the response
        res.render('index', {greeting: trans, font, chuck, users});

    }

    getStuff();
    

});

// GET Login page
router.get('/login', function(req, res, next) {
    res.render('login', {username: req.body.username, csrf: req.csrfToken()});
});

// Attempt login
router.post('/login', function(req, res, next) {

    User.find({where: {username: req.body.username}})
        .then((user) => {

            if (user != null) {

                bcrypt.compare(req.body.password, user.password_digest, (err, result) => {

                    if (result) {

                        // Authenticated. Store the user record and redirect back to the home page.
                        req.session.user = user.toJSON();
                        res.redirect('/');

                    } else {
                    
                        // Username or Password failure
                        res.render('login', {username: req.body.username, authFailure: true, csrf: req.csrfToken()});

                    }

                });
            
            } else {

                res.render('login', {username: req.body.username, authFailure: true, csrf: req.csrfToken()});
                
            }

        });

});

// Log out (end our session)
router.get('/logout', function(req, res, next) {

    if(typeof req.session.user != 'undefined') {
        delete req.session.user;
    }

    res.render('logout');

});

// Get the weather
router.get('/weather', function(req, res, next) {

    // Build the query    
    var getString = `${config.wunderground.uri}${config.wunderground.apikey}/conditions/q/${config.wunderground.city}.json`;

    request.get({uri: getString, json: true}, (error, response, body) => {

        res.json(body);

    });

});

module.exports = router;
