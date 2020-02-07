module.exports = {
    secret: process.env.SECRET || 'whatifisayclass',
    salt: process.env.SALT || 10,
    dbname: process.env.DB_NAME || '',
    dbhost: process.env.DB_HOST || '',
    dbport: process.env.DB_PORT || '',
    dbusername: process.env.DB_USERNAME || '',
    dbpassword: process.env.DB_PASSWORD
};