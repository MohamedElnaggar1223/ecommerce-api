const { logEvents } = require('./logger')

async function errorHandler(err, req, res, next)
{
    await logEvents(`${err.name}: ${err.message}\t`, 'errLog.log')
    res.status(500).send(err.message)
}

module.exports = errorHandler