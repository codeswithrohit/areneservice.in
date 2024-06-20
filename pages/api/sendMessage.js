import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
  }

  const { phoneNumber,firstName } = req.body;
  const body = `Hi ${firstName}, thank you for choosing Arene Services. Your booking with Arene has been completed successfully.`;
 // Corrected message body
  
  console.log(phoneNumber);

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN); // Removed unnecessary ${} around process.env variables

  try {
    const message = await client.messages.create({
      body,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:+917667411501`
    });
    
    console.log('Message SID:', message.sid);
    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Error sending message' });
  }
}
