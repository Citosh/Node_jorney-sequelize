const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize');
const db = require('../DB/db.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config()



const createUser = async(request, response) => {
    try {
      const { login, password } = request.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const [created] = await db.Users.findOrCreate({
        where: { login: login },
        defaults: {
          password: hashedPassword
        }
      });
      if(created)
      response.status(201).json(`User ${login} created successfully`)
      else
      response.json(`User ${login} already exzists, try analther name`)
   }  
    catch (error) {
       response.status(403)
    }
  }

  const loginUser = async(request,response) =>{

    const { login, password } = request.body

    const [user] = await db.Users.findAll({
      where: { login: login}
    });

    if (!user)
    response.json(`user ${login} does not exists`)
    else{
        if(!bcrypt.compareSync(password,user.dataValues.password))
          response.json('invalid pass')
        else{
        const accessToken = jwt.sign({username : user.dataValues.login, role : user.dataValues.role}, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '300m'})
        const refreshToken = jwt.sign({username : user.dataValues.login, role : user.dataValues.role}, process.env.REFRESH_TOKEN_SECRET)  

        await db.Users.update(
          {
            accesstoken: accessToken,
            refreshtoken: refreshToken
          },
          {
            where: { login: login },
          }
        );
        response.json({accessToken : accessToken, refreshToken : refreshToken})
      }    
    }  
  }
  

  const RefreshAccessToken = (req,res) =>{
    const refreshToken = req.body.reftoken
      if (refreshToken == null) return res.sendStatus(401)
      
  
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
          if (err)  
          response.status(401)
          else{
            const FromToken = user
            console.log(FromToken)
            const userFromq = db.Users.findAll({
              where : {login : FromToken.username}
            }) 
           if(!userFromq)
           response.json('you entered invalid token')
           else{
              accessToken = jwt.sign({username : FromToken.username,role: FromToken.role},process.env.ACCESS_TOKEN_SECRET)
              res.json({accessToken : accessToken})
           }
            
          }
      })
  }
  
  const userLogout = (req,res) => {
    const name = req.body.login
    try {
      db.Users.update(
        {
          refreshtoken : null
        },
        {
          where : {login : name},
        }
      )
      res.sendStatus(200)
    } catch (error) {
      response.json(error)
    }
  }

  function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ') [1]
    if(token == null)
      return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
      
       if(err) 
        res.sendStatus(403)
        req.user = user
        next()
    })
    
  }  

  module.exports = {
    createUser,
    authenticateToken,
    RefreshAccessToken,
    loginUser,
    userLogout
  }