const express = require('express');
const cors  = require('cors');
const { customer, appEvents } = require('./api');

module.exports = async (app,channel) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    //listen to events:
    //appEvents(app);
    //api
    customer(app,channel);

    //error handling will happen from the index.js file
}