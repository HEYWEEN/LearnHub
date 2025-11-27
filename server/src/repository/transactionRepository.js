import getPool from "../config/db"

const withTransaction = async (callback) =>{
    const pool = getPool();
    const conn = pool.getConnection();
    try{
        await conn.beginTransaction();
        const res = await callback(conn);
        await conn.commit();
        return res;
    }catch(err){
        await conn.rollback();
        throw err;
    }finally{
        conn.release()
    }
}

const withConnection = async (callback) =>{
    const pool = getPool();
    return await callback(pool);
}