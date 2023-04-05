const express = require('express'); // pull in express into the b/e
const app = express();  // sets variable of 'app' to use the js express method

const cors = require('cors');   // set up CORS

const bodyParse = require('body-parser');   // bring in body parser

const mongoose = require('mongoose');   // bring in mongoose

const bcrypt = require('bcryptjs'); // bring in bcrypt to encrypt the password

const config = require('./config.json');

const Product = require('./models/products');
const Vendor = require('./models/vendors');
const User = require('./models/users');
const Comment = require('./models/comments');
const bodyParser = require('body-parser');

const port = 8080;  // now set up port for our local server

// Now start off the server

// call upon express
app.use((req, res, next) => {
    // which method has been sent and where has it been sent to
    console.log(`${req.method} request ${req.url}`);
    next();
})

app.use(bodyParser.json()); // calling Body Parser method to stringify or parse
app.use(bodyParser.urlencoded({     // says says not to bodyparse the url
    extended: false
}));

app.use(cors());        // Whenever you use express use the CORS method

// sent to BE on request
app.get('/', (req, res) => res.send('hello from the backend'));

// Set up mongoose connection to mongoDB
mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_DBNAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connected'))
.catch(err => {
    console.log(`DB connection error: ${err.message}`);
})


// while using express want to listen to port and go into arrow function and ...
// sent to nodemon
app.listen(port, () => console.log(`my fullstack app is listening on port ${port}`));