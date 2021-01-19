const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());

/* Get all popular dishes for specified restaurant w. reviews
   and all relevent infomation */
app.get('/restaurants/:id', function(req, res) {
    const id = req.params.id;
    axios.get(`http://ec2-18-218-130-114.us-east-2.compute.amazonaws.com:3001/restaurants/${id}`)
        .then((response) => {
            res.send(response.data)
        })
        .catch((err) => {
            res.end(err);
        })
})

app.get('/restaurants/:i/dish/review/:id', function(req, res) {
    const reviewId = req.params.id;
    axios.get(`http://ec2-18-218-130-114.us-east-2.compute.amazonaws.com:3001/restaurants/1/dish/review/${reviewId}`)
        .then((response) => {
            res.send(response.data)
        })
        .catch((err) => {
            res.end(err);
        })
})

app.post('/restaurants/:id/review', function(req, res) {
    const review = req.body;
    const id = '1';
    axios.post(`http://ec2-18-218-130-114.us-east-2.compute.amazonaws.com:3001/restaurants/${id}/review`, review)
        .then(() => {
            console.log('success insert review');
            res.sendStatus(200);
        })
        .catch((err) => {
            res.end(err);
        })
})

app.delete('/restaurants/:id/dish/review/:id', function(req, res) {
    const id = '1';
    const reviewId = req.params.id;
    axios.delete(`http://ec2-18-218-130-114.us-east-2.compute.amazonaws.com:3001/restaurants/${id}/dish/review/${reviewId}`)
        .then(() => {
            console.log('success delete review');
            res.sendStatus(200);
        })
        .catch((err) => {
            res.end(err);
        })
})

app.patch('/restaurants/:id/dish/review/:id', function(req, res) {
    const id = '1';
    const patchId = req.params.id;
    const reviewUpdate = req.body;

    axios.patch(`http://ec2-18-218-130-114.us-east-2.compute.amazonaws.com:3001/restaurants/${id}/dish/review/${patchId}`, reviewUpdate)
        .then(() => {
            console.log('success update review');
            res.sendStatus(200);
        })
        .catch((err) => {
            res.end(err);
        })
})

app.get('/gallery-bundle.js', function(req, res) {
    axios.get('https://popular-dishes.s3-us-west-1.amazonaws.com/cole/bundle.js')
        .then((response) => {
            res.end(response.data);
        })
        .catch((err) => {
            res.end(err);
    })
})

app.get('/reservations-bundle.js', function(req, res) {
    axios.get('https://popular-dishes.s3-us-west-1.amazonaws.com/zach/bundle.js')
        .then((response) => {
            res.end(response.data);
        })
        .catch((err) => {
            res.end(err);
    })
})



app.listen(PORT, () => console.log('Listening on port: ' + PORT));
