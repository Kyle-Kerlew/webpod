const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const request = require("request");
const cors = require("cors");

dotenv.config();
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET


const app = express();
app.use(cors({origin: "http://localhost:8080", credentials: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get('/auth/refresh', function (req, res) {

    const refresh_token = req.cookies.refresh_token;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64'))},
        form: {
            grant_type: 'refresh_token', refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, undefined, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (body.refresh_token) {
                res.cookie('refresh_token', body.refresh_token, {maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true})
            }

            res.cookie('access_token', body.access_token)
                .send(JSON.stringify("success"));
        }
    });
});
app.get('/auth/callback', function (req, res) {

    const code = req.query.code;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token', form: {
            code: code, redirect_uri: "http://localhost:3000/auth/callback", grant_type: 'authorization_code'
        }, headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        }, json: true
    };

    request.post(authOptions, undefined, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res
                .cookie('refresh_token', body.refresh_token, {maxAge: 365 * 24 * 24 * 60 * 60 * 1000, httpOnly: true})
                .cookie('access_token', body.access_token)
                .redirect('http://localhost:8080')

        }
    });
});

module.exports = app;
