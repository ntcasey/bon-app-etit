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

app.get('/review/:reviewId', function(req, res) {
    const reviewId = req.params.reviewId;
    axios.get(`http://ec2-18-218-130-114.us-east-2.compute.amazonaws.com:3001/review/${reviewId}`)
        .then((response) => {
            res.send(response.data)
        })
        .catch((err) => {
            res.end(err);
        })
})

app.post('/restaurants/:restId/dish/:dishId/review', function(req, res) {
    const { restId, dishId } = req.params;
    const review = req.body;
    axios.post(`http://ec2-18-218-130-114.us-east-2.compute.amazonaws.com:3001/restaurants/${restId}/dish/${dishId}/review`, review)
        .then(() => {
            console.log('success insert review');
            res.sendStatus(200);
        })
        .catch((err) => {
            res.end(err);
        })
})

app.delete('/review/:reviewId', function(req, res) {
    const reviewId = req.params.reviewId;
    axios.delete(`http://ec2-18-218-130-114.us-east-2.compute.amazonaws.com:3001/review/${reviewId}`)
        .then(() => {
            console.log('success delete review');
            res.sendStatus(200);
        })
        .catch((err) => {
            res.end(err);
        })
})

app.patch('/review/:revId', function(req, res) {
    const reviewId = req.params.reviewId;
    const reviewUpdate = req.body;
    axios.patch(`http://ec2-18-218-130-114.us-east-2.compute.amazonaws.com:3001/review/${reviewId}`, reviewUpdate)
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
