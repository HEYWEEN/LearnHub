<<<<<<< HEAD

function authenticate() {

}

function sync(){
  
}
=======
//src/config/db.js
import mysql from 'mysql2/promise';
import LOG_COLOR from '../constants/logColor.js';

let pool = null;

export const connectDB = ()=>{
  if(pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10
  });
  console.log(LOG_COLOR.FG_GREEN + '[info] 数据库连接成功' + LOG_COLOR.RESET);
  return pool;
}

const getPool = ()=>{
  if(!pool){
    Error(LOG_COLOR.FG_RED + '[err] 数据库未连接,请先调用connectDB()' + LOG_COLOR.RESET);
  }
  return pool;
};

export default getPool;
>>>>>>> 782526c0ec88ab7497ce607f9e84a2a3aab7d653
