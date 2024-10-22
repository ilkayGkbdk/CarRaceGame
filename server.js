const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/send-email', (req, res) => {
    const score = req.query.score;
    const username = req.query.humanname;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ilkay.55.86@gmail.com',
            pass: 'snyd mbzs kwls qwye'
        }
    });

    let mailOptions = {
        from: 'ilkay.55.86@gmail.com',
        to: 'ilkayrg55@hotmail.com',
        subject: 'CarRaceGame',
        text: `${username}'s score: ${score}`
    };

    transporter.sendMail(mailOptions)
        .then(info => res.send('Email sent: ' + info.response))
        .catch(error => res.send('Error occurred: ' + error));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
