const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize');
const db = require('../DB/db.js')
const AAA = require('../AAA/AAA.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require('dotenv').config()


const addGoods = async (request,response) => {
    
    if(!(request.user.role == "admin" || request.user.role == "manager") ){
      response.send(403)
    }
    else {  
    try {
      const {name,cost} = request.body

      const product = await db.Goods.create({ 
        name:  name, 
        cost: cost });
        response.status(200).json(product)
        
    } catch (error) {
      response.json('Smth wrong')
    }
      
    }
  }

  const setGoodsQuantity = async (request,response) =>{
    if(!(request.user.role == "admin" || request.user.role == "manager") ) 
      response.send(403)
    else {
  
    try {
        const {name,quantity} = request.body
            await db.Goods.update({ 
            quantity: quantity },
            {
                where : {name : name}
            });
            response.sendStatus(201)

    }
    catch (error) {
      throw error
    }
    }
  }  


module.exports = {
    addGoods,
    setGoodsQuantity
}