const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize');
const db = require('../DB/db.js')
const AAA = require('../AAA/AAA.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config()



const getProductbyName = async (request,response) =>{
    if(!(request.user.role == "admin" || request.user.role == "manager" || request.user.role == "user") ) 
      response.send(403)
    else {
    try {
      const name = request.params.name
      const product = await db.Goods.findAll({where : {name : name}})
      response.json(product)
    
    } catch (error) {
      throw error
    }
    }
  }


  const getAllGoods = async (request,response) => {

    if(!(request.user.role == "admin" || request.user.role == "manager" || request.user.role == "user") ) 
      response.send(403)
    else {
  
    try {  
      const products = await db.Goods.findAll({})
        response.status(200).json(products)
    } 
    catch (error) {
      throw error
    }
    
    }
  }
  

  const MakePurchase = async (request,response,next) =>{

    if(!(request.user.role == "admin" || request.user.role == "manager" || request.user.role == "user") ) 
      response.send(403)
      else{
    try {
      
      const numberInNeed = request.body.quantity
      const name = request.params.name
      const userName = request.user.username
        
      const product = await db.Goods.findAll({where : {name : name}})
  
      if(product[0].dataValues.quantity-numberInNeed >= 0){
        await db.Goods.update({
            quantity : product[0].dataValues.quantity-numberInNeed
        },
        {
            where : {name : product[0].dataValues.name}
        })
        
        await db.Purchase.create({
            nameofuser : userName,
            nameofgoods : name,
            quantity : numberInNeed,
            date : db.sequelize.fn('NOW')
        })
        response.sendStatus(201)
      }
      else {
        response.sendStatus(404)
      }
      
    }
    catch(error)
    {
        response.json(error)
    }
  }
  }
module.exports = {
    getProductbyName,
    getAllGoods,
    MakePurchase

  }