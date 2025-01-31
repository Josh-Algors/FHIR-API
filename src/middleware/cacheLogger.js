const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600, checkperiod: 60 }); //store for 10mins, remove every minute if expired

const cacheMiddleware = (req, res, next) => {
  
  const getUrl = req.originalUrl || req.url;
  const key = `${getUrl} ${JSON.stringify(req.body)}`;

  const cachedData = cache.get(key);

  if (cachedData)
  {
    return res.json(JSON.parse(cachedData));
  }

  res.sendResponse = res.send;

  res.send = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };

  next();
};

module.exports = {cacheMiddleware};