const express = require('express')
const exphbs = require('express-handlebars')

const mysql = require('mysql')

const app = express()

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json())

app.engine('handlebars', exphbs.engine())

app.set('view engine', 'handlebars')

app.use(express.static('public'))



app.get('/books/:id', (req, res) => {
    const id = req.params.id
    
    const query = `SELECT * FROM books WHERE ID = ${id}`

    conn.query(query, (err, data) => {
        if(err){
            console.log(err)
            return
        }

        const book = data[0]
        res.render('book', {book})
    })
})

app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pgqty = req.body.pagesqty

    const query = `INSERT INTO books (title, pageqty) VALUES ('${title}', '${pgqty}')`

    conn.query(query, (err) => {
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.get('/books', (req, res) => {
    const query = "SELECT * FROM books"

    conn.query(query, (err, data) => {
        if(err){
            console.log(err)
            return
        }

        const books = data
        res.render('books', {books})
    })
})



/* ------------------------acessar conta do banco de dados------------------------ */
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/acessarConta', (req, res) => {
    const nome = req.body.nome

    const query = `SELECT * FROM htabank WHERE Nome = '${nome}'`

    conn.query(query, (err, data) => {
        if(err){
            console.log(err)
            return
        }
        const conta = data[0]
        res.render('conta', {conta})
    })
})

/* ------------------------inserir conta no banco de dados------------------------ */
app.post('/inserirConta', (req, res) => {
    const nome = req.body.nome
    const senha = req.body.senha

    const query = `INSERT INTO htabank (Nome, Senha) VALUES ('${nome}', '${senha}')`

    conn.query(query, (err) => {
        if(err){
            console.log(err)
            return
        }

        res.redirect('/')
    })
})

app.get('/novaConta', (req, res) => {
    res.render('novaConta')
})

/* ------------------------sacar de uma conta no banco de dados------------------------ */

app.get('/saque/:id', (req, res) => {
    const id = req.params.id
    res.render('saque', {id})
})

app.post('/saque', (req, res) => {
    const id = req.body.id
    const valor = req.body.valor
    
    let query = `SELECT Saldo FROM htabank WHERE ID = ${id}`

    conn.query(query, (err, data) => {
        if(err){
            console.log(err)
            return
        }

        let saldo = data[0].Saldo

        if(saldo - valor < 0){
            console.log("Saldo insuficiente")
            res.redirect('/')
        }else{
            saldo = saldo - valor
            query = `UPDATE htabank SET Saldo = '${saldo}' WHERE id = ${id}`

            conn.query(query, (err) => {
                if(err){
                    console.log(err)
                    return
                }
                res.redirect('/')
            })
        }
        
    })
})

/* ------------------------depositar em uma conta no banco de dados------------------------ */

app.get('/deposito/:id', (req, res) => {
    const id = req.params.id
    res.render('deposito', {id})
})

app.post('/deposito', (req, res) => {
    const id = req.body.id
    const valor = req.body.valor

    let query = `SELECT Saldo FROM htabank WHERE ID = ${id}`

    conn.query(query, (err, data) => {
        if(err){
            console.log(err)
            return
        }

        const saldo = parseFloat(data[0].Saldo) + parseFloat(valor)
        
        query = `UPDATE htabank SET Saldo = '${saldo}' WHERE id = ${id}`

        conn.query(query, (err) => {
            if(err){
                console.log(err)
                return
            }
            res.redirect('/')
        })
    })
})

/* ------------------------pagina inicial------------------------ */
app.get('/', (req, res) => {
    res.render('home')
})


app.use((req, res) => {
    res.status(404).render('404')
})

/* ------------------------conexão com o banco de dados------------------------ */ 

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemysql'
})

conn.connect((err)=>{
    if(err){
        console.log(err)
        return
    }

    console.log("conectado")
    app.listen(3000)
})