const nodemailer = require('nodemailer');
const supabase   = require('../config/supabase');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

function senderEmail(data) {
    return {
        from: `"Aananthal Technologies" <${process.env.GMAIL_USER}>`,
        to: data.email,
        subject: `We got your message — Aananthal Technologies`,
        html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
            <div style="background:#000;padding:32px 40px;">
                <h1 style="color:#fff;font-size:22px;margin:0;letter-spacing:-0.02em;">Aananthal Technologies</h1>
                <p style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:6px 0 0;">Humans × AI</p>
            </div>
            <div style="padding:40px;border:1px solid #eee;border-top:none;">
                <p style="font-size:15px;line-height:1.7;color:#333;">Hi <strong>${data.name}</strong>,</p>
                <p style="font-size:15px;line-height:1.7;color:#333;">
                    Thank you for reaching out! We've received your message regarding
                    <strong>${data.interest || 'your enquiry'}</strong> and our team will get back to you within <strong>24 hours</strong>.
                </p>
                <div style="margin:28px 0;padding:20px 24px;background:#f4f4f4;border-left:3px solid #000;">
                    <p style="margin:0 0 6px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Your message</p>
                    <p style="margin:0;font-size:14px;color:#444;line-height:1.7;">${data.message}</p>
                </div>
                <p style="font-size:13px;color:#888;line-height:1.7;">
                    — Team Aananthal<br>
                    <a href="mailto:${process.env.OWNER_EMAIL}" style="color:#000;">${process.env.OWNER_EMAIL}</a>
                </p>
            </div>
        </div>`,
    };
}

function ownerEmail(data) {
    return {
        from: `"Contact Form" <${process.env.GMAIL_USER}>`,
        to: process.env.OWNER_EMAIL,
        subject: `New Enquiry: ${data.interest || 'General'} — ${data.name}`,
        html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
            <div style="background:#000;padding:24px 32px;">
                <h2 style="color:#fff;margin:0;font-size:18px;">New Contact Form Submission</h2>
            </div>
            <div style="padding:32px;border:1px solid #eee;border-top:none;">
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    <tr><td style="padding:10px 0;color:#888;width:140px;">Name</td><td style="padding:10px 0;font-weight:600;">${data.name}</td></tr>
                    <tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#888;">Email</td><td style="padding:10px 8px;"><a href="mailto:${data.email}" style="color:#000;">${data.email}</a></td></tr>
                    <tr><td style="padding:10px 0;color:#888;">Phone</td><td style="padding:10px 0;">${data.phone || '—'}</td></tr>
                    <tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#888;">Interested In</td><td style="padding:10px 8px;font-weight:600;">${data.interest || '—'}</td></tr>
                </table>
                <div style="margin-top:24px;">
                    <p style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Message</p>
                    <p style="font-size:14px;line-height:1.7;background:#f4f4f4;padding:16px;margin:0;">${data.message}</p>
                </div>
            </div>
        </div>`,
    };
}

const submitContact = async (req, res) => {
    try {
        const data = {
            name:     req.body.name,
            email:    req.body.email,
            phone:    req.body.phone,
            interest: req.body.interest,
            message:  req.body.message,
        };

        if (!data.name || !data.email || !data.message) {
            return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
        }

        await Promise.all([
            transporter.sendMail(senderEmail(data)),
            transporter.sendMail(ownerEmail(data)),
            supabase.from('contact_enquiries').insert({
                name:     data.name,
                email:    data.email,
                phone:    data.phone    || null,
                interest: data.interest || null,
                message:  data.message,
            }),
        ]);

        res.json({ success: true, message: 'Message sent!' });

    } catch (err) {
        console.error('Contact submit error:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

module.exports = { submitContact };
