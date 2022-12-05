const bodyParser = require('body-parser')
const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize');
const db = require('./DB/db.js');
const AAA = require('./AAA/AAA.js')
const ADMN = require('./AdminService/admin.js')
const MNGR = require('./Managers/manage.js')
const USRS = require('./UsersService/users_activities.js')

const app = express()
const port = 3000


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)



app.post('/user', AAA.createUser) // done
app.put('/user/login', AAA.loginUser) // done
app.put('/token', AAA.RefreshAccessToken) // done
app.put('/user/logout',AAA.userLogout) // done

app.get('/users/get_all', AAA.authenticateToken, ADMN.getUsers) //done
app.put('/user/setrole',AAA.authenticateToken, ADMN.setRole)  //dick

app.post('/products/add', AAA.authenticateToken, MNGR.addGoods) //done
app.post('/products/setquantity', AAA.authenticateToken, MNGR.setGoodsQuantity) //done


app.get('/products/:name', AAA.authenticateToken, USRS.getProductbyName) //done
app.get('/products', AAA.authenticateToken, USRS.getAllGoods) //done
app.put('/products/:name', AAA.authenticateToken, USRS.MakePurchase) //




app.listen(port, async () => {
    console.log(`App running on port ${port}.`)
    try {
     await db.sequelize.sync({alter: true})
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })