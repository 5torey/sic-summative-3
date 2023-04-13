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

// ------------ GET ALL PRODUCTS -----------------
app.get('/allProducts', (req, res) => {
    Product.find().then(result => {
        res.send(result)
    });
});


// ------------ GET SINGLE PRODUCT -----------------
app.get('/singleProduct/:id', (req, res) => {
    const idParam = req.params.id;
    Product.findById(idParam).then(result => {
        res.send(result)
    }).catch(err => res.send(err))
})


// ------------ ADD PRODUCT -----------------
app.post('/addProduct', (req, res) => {
    const dbProduct = new Product({
        _id: new mongoose.Types.ObjectId,
        user_id: req.body.user_id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        sub_category: req.body.sub_category

    })

    dbProduct.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err))
})

// ------------ UPDATE PRODUCT -----------------
app.patch('/updateProduct/:id', (req, res) => {
    const idParam = req.params.id;
    Product.findById(idParam, (err, product) => {
        const updatedProduct = {
            name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        sub_category: req.body.sub_category
        }
        Product.updateOne({
            _id: idParam
        }, updatedProduct).
        then(result => {
            res.send(result);
        }).catch(err => res.send(err))
    })
})

// ------------ DELETE PRODUCT -----------------
app.delete('/deleteProduct/:id', (req, res) => {
    const idParam = req.params.id;
    Product.findOne({
        _id: idParam
    }, (err, product) => {
        if (product) {
            Product.deleteOne({
                _id: idParam
            }, err => {
                console.log('deleted on backend request')
            })
        } else {
            error('not found')
        }
    }).catch(err => res.send(err));
});

// ------------ REGISTER VENDOR -----------------
app.post('/registerVendor', (req, res) => {
    Vendor.findOne({
        email: req.body.email,
    }, (err, vendorExists) => {
        if(vendorExists){
            res.send('This email has already been registered. Please sign in or use a different email')
        } else {
            const hash = bcrypt.hashSync(req.body.password);
            const vendor = new Vendor({
                _id: new mongoose.Types.ObjectId,
                name: req.body.name,
                password: hash,
                email: req.body.email,
                artistname: req.body.artistname,
                instagram: req.body.instagram
            })
            vendor.save()
                .then(result => {
                    console.log(vendor, result);
                    res.send(result);
                }).catch(err => {
                    res.send(err)
                })
        }
    })
})

// -------------- UPDATE VENDOR --------------------

app.patch('/updateVendor/:id', (req, res) => {
    const idParam = req.params.id;
    Vendor.findById(idParam, (err, vendor) => {
        const hash = bcrypt.hashSync(req.body.password)
        const updatedVendor = {
            name: req.body.name,
            email: req.body.email, 
            password: hash, 
            artistname: req.body.artistname, 
            instagram: req.body.instagram,
            bio: req.body.bio
        }
        Vendor.updateOne({
            _id: idParam
        }, updatedVendor).
        then(result => {
            res.send(result);
        }).catch(err => res.send(err))
    })
})


// ------------ REGISTER COLLECTOR -----------------
app.post('/registerCollector', (req, res) => {
    User.findOne({
        email: req.body.email,
    }, (err, userExists) => {
        if(userExists){
            res.send('This email has already been registered. Please sign in or use a different email')
        } else {
            const hash = bcrypt.hashSync(req.body.password);
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                name: req.body.name,
                password: hash,
                email: req.body.email,
            })
            user.save()
                .then(result => {
                    console.log(vendor, result);
                    res.send(result);
                }).catch(err => {
                    res.send(err)
                })
        }
    })
})

// -------------- UPDATE COLLECTOR --------------------

app.patch('updateUser/:id', (req, res) => {
    const idParam = req.params.id;
    User.findById(idParam, (err, user) => {
        const hash = bcrypt.hashSync(req.body.password)
        const updatedUser = {
            name: req.body.name,
            email: req.body.email, 
            password: hash, 
        }
        User.updateOne({
            _id: idParam
        }, updatedUser).
        then(result => {
            res.send(result);
        }).catch(err => res.send(err))
    })
})


// ------------ LOGIN VENDOR -----------------
app.post('/loginVendor', (req, res) => {
    Vendor.findOne({email:req.body.email}, (err, userResult) => {
        if (userResult) {
            if (bcrypt.compareSync(req.body.password, userResult.password)) {
                res.send(userResult);
            } else {
                res.send('This password does not match. Please try again')
            }
        } else {
            res.send('User not found. Please register')
        }
    })
})

// ------------ LOGIN COLLECTOR -----------------
app.post('/loginCollector', (req, res) => {
    User.findOne({email:req.body.email}, (err, userResult) => {
        if (userResult) {
            if (bcrypt.compareSync(req.body.password, userResult.password)) {
                res.send(userResult);
            } else {
                res.send('This password does not match. Please try again')
            }
        } else {
            res.send('User not found. Please register')
        }
    })
})


app.get('/allVendors', (req, res) => {
    Vendor.find().then(result => {
        res.send(result)
    });
});


app.get('/singleVendor/:id', (req, res) => {
    const idParam = req.params.id;
    Vendor.findById(idParam).then(result => {
        res.send(result)
    }).catch(err => res.send(err))
})

app.get('/allComments', (req, res) => {
    Comment.find().then(result => {
        res.send(result);
    })
});

app.post('/createComment', (req, res) => {
    const newComment = new Comment({
        _id: new mongoose.Types.ObjectId,
        author: req.body.author,
        text: req.body.text,
        time: new Date(),
        user_id: req.body.user_id,
        product_id: req.body.product_id
    }); // end of const
    newComment.save()
        .then(result => {
            Product.updateOne({
                _id: req.body.product_id
            }).then(result => {
                res.send(newComment);
            }).catch(err => {
                res.send(err);
            })

        })
})

app.delete('/deleteComment/:id', (req, res) => {
    Comment.findOne({
        _id: req.params.id
    }, (err, comment) => {
        if(comment && comment['user_id'] == req.body.user_id){
            Product.updateOne({
                _id: comment.product_id
            }).then(result => {
                Comment.deleteOne({
                    _id: req.params.id
                },err => {
                    res.send('deleted')
                })
            }).catch(err => {
                res.send(err)
            })
        } //end of if
        else{
            res.send('not found/not authorised')
        }
    }) 
    
})