const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize');
const db = require('../DB/db.js')
const AAA = require('../AAA/AAA.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config()


const  getUsers = async (request, response) => {
    
    if(!(request.user.role == "admin" || request.user.role == "manager") ) 
      response.send(403)
    else{ 
     try {
        const users = await db.Users.findAll();
    response.json(users);
     } catch (error) {
        response.sendStatus(500);    
     }  
    
    }  
  }
  
const setRole = (req,res) =>{

    if(!(req.user.role == "admin") ) 
    response.send(403)
    else{
      const { login, role } = req.body
      if (!(req.body.role == "user" || req.body.role == "manager"))
      res.sendStatus(404)
      else {
        try {
            db.Users.update(
                {
                  role: req.body.role
                },
                {
                  where : {login : login},
                }
              )
            res.sendStatus(200)  
        } catch (error) {
            res.sendStatus(500)
        }
       
        // pool.query('UPDATE users SET role = $1 WHERE login = $2 ',[role,login], (err,results) => {
        //   if(err) throw err
        //   else res.sendStatus(200)
        // })
  
      }
  
    }
  
  }

module.exports = {
setRole,
getUsers
}