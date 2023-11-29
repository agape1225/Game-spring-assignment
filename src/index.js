const express = require("express")
const path = require("path")
const app = express()
// const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3007
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get('/', (req, res) => {
    res.render('login');
})
app.get('/logout', (req, res) => {
    return res.redirect("/");
})




// app.get('/home', (req, res) => {
//     res.render('home')
// })

app.post('/signup', async (req, res) => {

    // const data = new LogInCollection({
    //     name: req.body.name,
    //     password: req.body.password
    // })
    // await data.save()

    const data = {
        name: req.body.name,
        password: req.body.password
    }
    console.log(data);
    const checking = await LogInCollection.findOne({ name: req.body.name })
    console.log(checking);
    if (checking === null) {
        await LogInCollection.insertMany([data])
    }
    else {
        res.send("user details already exists")
    }
    return res.redirect("/");
    // if (checking === null || checking.name === req.body.name && checking.password===req.body.password) {
    //     console.log("asdfasdfadsf");
    //     res.send("user details already exists")
    // }
    // else{
    //     await LogInCollection.insertMany([data])

    // }
    //    try{

    //    }
    //    catch{
    //     res.send("wrong inputs")
    //    }
})


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            //res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
            res.status(201).render("rooms", { naming: `${req.body.password}+${req.body.name}` })

        }

        else {
            res.send("incorrect password")
        }


    }

    catch (e) {

        res.send("wrong details")


    }


})

app.get('/rooms', async (req, res) => {
    try {
        res.status(201).render("rooms", { naming: `${req.body.password}+${req.body.name}` })
    }
    catch (e) {
        res.send("wrong details")
    }
})

app.get('/users', async (req, res) => {
    try {
        res.status(201).render("users", { naming: `${req.body.password}+${req.body.name}` })
    }
    catch (e) {
        res.send("wrong details")
    }
})

app.get('/friends', async (req, res) => {
    try {
        res.status(201).render("friends", { naming: `${req.body.password}+${req.body.name}` })
    }
    catch (e) {
        res.send("wrong details")
    }
})



app.listen(port, () => {
    console.log('port connected');
})