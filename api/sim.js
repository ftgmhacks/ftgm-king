const axios = require('axios');

module.exports = async (req, res) => {
    // CORS & Content-Type Headers
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

    // 1. Secret Key Check
    if (!key || key !== VALID_KEY) {
        return res.status(401).send(JSON.stringify({ 
            status: "error", 
            message: "Invalid or Missing Secret Key!", 
            credits 
        }, null, 2));
    }

    // 2. Number Check
    if (!number) {
        return res.status(400).send(JSON.stringify({ 
            status: "error", 
            message: "Number missing", 
            credits 
        }, null, 2));
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

        res.status(200).send(JSON.stringify(finalData, null, 2));

    } catch (error) {
        res.status(500).send(JSON.stringify({ 
            error: "Fetch failed", 
            credits 
        }, null, 2));
    }
};
