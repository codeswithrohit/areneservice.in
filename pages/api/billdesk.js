import axios from 'axios';
import jwt from 'jsonwebtoken'; // Import jwt library

export default async function handler(req, res) {
  try {
    const { mercid, orderid, amount, currency, ru, additional_info, itemcode, device } = req.body;
    const secretKey = 'CF5CDEAE743DED70770243E5797B13F0'; // Set your secret key in environment variables

    const payload = {
      mercid,
      orderid,
      amount,
      order_date: new Date().toISOString(),
      currency,
      ru,
      additional_info,
      itemcode,
      device
    };

    const headers = {
      clientid: 'AVYO63DB93AQ40OYQA' // Set your client ID in environment variables
    };

    const token = jwt.sign(payload, secretKey, { algorithm: 'HS256', header: headers });
    console.log("JWT: ", token);

    const traceid = Date.now().toString();
    const bdTimestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    console.log("BD-Traceid: ", traceid);
    console.log("BD-Timestamp: ", bdTimestamp);

    const url = "https://pguat.billdesk.io/payments/ve1_2/orders/create";

    const response = await axios.post(url, token, {
      headers: {
        Accept: 'application/jose',
        'Content-Type': 'application/jose',
        'BD-Traceid': traceid,
        'BD-Timestamp': bdTimestamp
      }
    });

    const pgresponse = jwt.decode(response.data, secretKey, { complete: true });
    console.log("PG Response encrypted: ", response.data);
    console.log("PG Response: ", pgresponse);

    res.status(200).json({ success: true, pgresponse });
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}
