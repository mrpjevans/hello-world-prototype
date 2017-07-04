var express = require('express');
var router = express.Router();
var path = require('path');

const models = require(path.join(__dirname,'..','models/index'));
const User = models.User;

// GET list of all users
router.get('/', function(req, res, next) {

    let alert = {};
    if(req.query.alert && req.query.alert == 'deleted') {
        alert = {type: 'deleted'};
    }

    // Get all the users
    const users = User.findAll()
    .then((users) => {
        res.render('users/index', {users: users, alert: alert});
    });

});

// GET the creation form
router.get('/create', function(req, res, next) {
    res.render('users/create', {fields: {}, problems: {}, csrf: req.csrfToken()});
});

// Post back to the form
router.post('/create', function(req, res, next) {

    // We can go ahead and create the record as all validation is done in the model
    User.create(req.body).then(() => {

        // It worked! Return the user to the page with a blank form
        res.render('users/create', {fields: {}, problems:{}, alert: {type: 'success'}, csrf: req.csrfToken()});
        
    }).catch((errs) => {

        // Validation failed, so report back to the user
        
        // Let's make the errors a little easier to parse in the template
        // and reduce the amount of data moving around
        problems = {}
        errs.errors.forEach((item, index) => {
            problems[item.path] = item.message;
        });
       
        // Return to the page and provide info on errors
        res.render('users/create', {fields: req.body, problems: problems, alert: {type: 'validation'}, csrf: req.csrfToken()});

    });

});

// Request a specific user
router.get('/:username/', function(req, res, next) {

    // Get the user and hand the data back to the form
    User.findOne({where: {username: req.params.username}})
        .then(user => {
            res.render('users/update', {fields: user.toJSON(), problems: {}, csrf: req.csrfToken()});
        });

});

// Update a user
router.post('/:username/', function(req, res, next) {

    // Remove reference to the password fields if not populated
    if(req.body.password.length == 0){
        delete req.body.password;
        delete req.body.confirm_password;
    }

    // We can go ahead and create the record as all validation is done in the model
    User.update(
        req.body,
        {where: {id: req.body.id}}
        )
        .then(() => {

            // It worked! Return the user to the page with a blank form
            res.render('users/update', {fields: req.body, problems:{}, alert: {type: 'success'}, csrf: req.csrfToken()});
        
        }).catch((errs) => {

            // Validation failed, so report back to the user
            
            // Let's make the errors a little easier to parse in the template
            // and reduce the amount of data moving around
            problems = {}
            errs.errors.forEach((item, index) => {
                problems[item.path] = item.message;
            });
           
            // Return to the page and provide info on errors
            res.render('users/update', {fields: req.body, problems: problems, alert: {type: 'validation'}, csrf: req.csrfToken()});

        });

});

// Delete a user
router.post('/:username/delete', function(req, res, next) {

    User.destroy({
        where: {username: req.body.username}
        }).then(() => {
            res.redirect('/users/?alert=deleted');
        }
    );

    
});

module.exports = router;