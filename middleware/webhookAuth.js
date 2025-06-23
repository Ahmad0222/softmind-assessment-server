import crypto from 'crypto';

export const verifyWebhook = (req, res, next) => {
    if (!process.env.WEBHOOK_SECRET) return next();

    const signature = req.headers['x-signature'];
    const payload = JSON.stringify(req.body);

    if (!signature) {
        return res.status(401).json({ error: 'Missing signature header' });
    }

    const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
    const digest = hmac.update(payload).digest('hex');

    if (signature !== digest) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
};