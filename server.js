const express = require('express');
const app = express();
const PORT = 8000;

const cors = require('cors');

//Class Chicken
const { Chicken } = require('./Chicken');

app.use(cors());

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const CHICKEN_URL = 'chicken/';

//Dataset for test
const {dataset}  = require('./dataset');

const mysql = require('mysql');

const db = mysql.createConnection({
   
    user: 'root',
    password: 'root',
    host: 'localhost',
    port : '3306',
    database: 'chicken',
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL!");
});

//Tt MEttre en ASYNC

app.get(('/'), (req, res) => {
    res.redirect('/' + CHICKEN_URL);
})

app.route('/' + CHICKEN_URL)
    .get((req, res) => {
        const name = req.query.name;
        console.log("NAME : ", name);

        if (name === undefined) return res.send(JSON.stringify(dataset));
        else if (null != dataset.find((c) => c.name === name)) 
            return res.send(JSON.stringify(dataset.find((c) => c.name === name)));
        else return res.send('Chicken not found');
        
    })
    

    .post((req, res) => {
        if (req.body.name === "" || req.body.weight === "") 
            return res.send('You MUST specify a NAME and a WEIGHT to create a new chicken');

        if (dataset.find(c => c.name === req.body.name) != null) 
            return res.send('Name already exists, change it');
        const chicken = new Chicken({
            name: req.body.name, birthday: req.body.birthday, weight: req.body.weight,
            steps: req.body.steps, isRunning: req.body.isRunning
        })
        console.log("POST REQUEST");
        dataset.push(chicken);
        res.send('Created new Chicken : ' + JSON.stringify(chicken));
    })
    
    .put((req, res) => {
        if (req.body.name === "") 
            return res.send('You NEED to specify NAME and VALUES TO UPDATE');

        const editChicken = dataset.find(c => c.name === req.body.name);
        if(editChicken == null) return res.send('Chicken name not found ...');

        const index = dataset.indexOf(editChicken);

        editChicken.birthday = req.body.birthday || editChicken.birthday;
        editChicken.weight = req.body.weight || editChicken.weight;
        editChicken.steps = req.body.steps || editChicken.steps;
        editChicken.isRunning = req.body.isRunning || editChicken.isRunning;

        dataset[index] = editChicken;

        res.send('Chicken as been edited, here the new representation' + JSON.stringify(dataset));
    })

    .delete((req, res) => {
        const name = req.query.name;
        console.log("NAME : ", name);
        if (name === undefined) return res.send('We need the name of Chicken to delete');
        else if (null != dataset.find((c) => c.name === name)) {
            const index = dataset.indexOf(dataset.find((c) => c.name === name));
            dataset.splice(index, 1);
            return res.send('Deleted chicken, name :' + name + JSON.stringify(dataset));
        }
        else return res.send('Chicken not found');
    })

app.post(('/' + CHICKEN_URL + 'run/'), (req, res) => {
    if (req.body.name === "") 
        return res.send('You MUST specify a NAME to make chicken run');

    if (dataset.find(c => c.name === req.body.name) == null) 
        return res.send('Chicken not found ... Give a valid NAME');

    dataset.find(c => c.name === req.body.name).steps++;
    res.redirect('/' + CHICKEN_URL);
})

app.get(('*'), (req, res) => {
    res.redirect('/');
})

app.listen(PORT, () => {
    console.log(`Server started successfully, listening on port: ${PORT}`);
});