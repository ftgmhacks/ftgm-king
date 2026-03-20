const axios = require('axios');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { number, key } = req.query;
  const VALID_KEY = "ftgmdb.pages.dev";

  const credits = {
    dev: "RANA FAISAL ALI (FTGM)",
    site: "https://ftgmtools.pages.dev",
    more: "Search ftgm tools on google"
  };

  // 1. Secret Key Validation
  if (!key || key !== VALID_KEY) {
    const keyError = JSON.stringify({ 
      status: "error", 
      message: "Invalid or Missing Secret Key!", 
      credits 
    }, null, 2);
    return res.status(401).send(keyError);
  }

  // 2. Number Validation
  if (!number) {
    const errorRes = JSON.stringify({ 
      status: "error", 
      message: "Number missing", 
      credits 
    }, null, 2);
    return res.status(400).send(errorRes);
  }

  try {
    const response = await axios.get(`https://sim-db-api.fakcloud.tech/?number=${number}`);
    
    const finalData = {
      success: response.data.success || true,
      number: response.data.number || number,
      name: response.data.name || "Not Found",
      cnic: response.data.cnic || "Not Found",
      address: response.data.address || "Not Found",
      credits: credits
    };

    const prettyJson = JSON.stringify(finalData, null, 2);
    res.status(200).send(prettyJson);

  } catch (error) {
    const errorRes = JSON.stringify({ 
      error: "Fetch failed or API down", 
      credits 
    }, null, 2);
    res.status(500).send(errorRes);
  }
};
