
const { Sequelize, DataTypes, Model } = require('sequelize');



const sequelize = new Sequelize('sq_test', 'postgres', '1111', {
    host: 'localhost',
    dialect:  'postgres' 
  });


const Users = sequelize.define('users',{

  login : { 
    type : DataTypes.STRING(30),
    allowNull: false,
    unique : true,
    primaryKey : true
  },
  password : { 
    type : DataTypes.STRING(255),
    allowNull: false
  },
  role : { 
    type : DataTypes.STRING(10),
    allowNull: false,
    defaultValue : 'user'
  },
  accesstoken : { 
    type : DataTypes.STRING(255),
  },
  refreshtoken : { 
    type : DataTypes.STRING(255),
  }
},
{
  timestamps : false
});

const Goods = sequelize.define('goods',{
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique : true
  },
  name : { 
    type : DataTypes.STRING(30),
    allowNull: false,
    unique : true
  },
  cost : {
    type : DataTypes.FLOAT
  },
  quantity : {
    type : DataTypes.INTEGER,
    defaultValue : 0
  }
},
 {
  timestamps: false
});

const Purchase = sequelize.define('purchase',{

    nameofuser : {
      type : DataTypes.STRING(30),
      allowNull : false,
    },
    nameofgoods : { 
      type : DataTypes.STRING(150),
    },
    quantity : {
      type : DataTypes.INTEGER
    },
    date : {
      type : DataTypes.DATE
    }
  },
   {
    timestamps: false,
    freezeTableName: true
});

 
module.exports = {
    Users,
    Goods,
    Purchase,
    sequelize
    }