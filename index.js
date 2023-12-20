const pg = require('pg')
const client = new pg.Client('postgres://localhost/icecreamdb')

const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.get('/api/flavors', async (req, res, next) => {
    try {
        const SQL = `
            SELECT *
            FROM flavors;
        `
        const response = await client.query(SQL)
        console.log(response.rows)
        res.send(response.rows)

    } catch (error) {
        next(error)

    }

})

app.get('/api/flavors/:id', async (req, res, next) => {
    try {
        console.log(req.params.id)

        const SQL = `
            SELECT * from flavors WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        if(!response.rows.length){
            next({
                name: "id error",
                message: `flavor ${req.params.id} not found`
            })
        }
        else {
        res.send(response.rows[0])
        }

    } catch (error) {
        next(error)
    }

})



app.delete('/api/flavors/:id', async ( req, res, next) => {
    try {
        const SQL = `
            DELETE FROM flavors WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        console.log(response)
        res.sendStatus(204)


    } catch (error) {
        next(error)
        
    }
})







app.use((error, req,res,next) => {
    res.status(500)
    res.send(error)
})

app.use('*', (req,res,next) => {
    res.send('No such route exists')
})


const init = async () => {
    await client.connect()
    console.log("connected to database")

    const SQL = `
        DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20)
        );
        INSERT INTO flavors (name) VALUES ('chocolate');
        INSERT INTO flavors (name) VALUES ('vanilla');
        INSERT INTO flavors (name) VALUES ('pistachio');
        INSERT INTO flavors (name) VALUES ('vanilla');
        INSERT INTO flavors (name) VALUES ('strawberry');
        INSERT INTO flavors (name) VALUES ('mint');

    `
    await client.query(SQL)
    console.log("table created")

    const port = 3000;
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })

}

init ()