const nodemailer = require('nodemailer');
const supabase   = require('../config/supabase');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

function applicantEmail(data) {
    return {
        from: `"Aananthal Technologies" <${process.env.GMAIL_USER}>`,
        to: data.email,
        subject: `We received your application — ${data.position}`,
        html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#111;">
            <div style="background:#000;padding:32px 40px;">
                <h1 style="color:#fff;font-size:22px;margin:0;letter-spacing:-0.02em;">Aananthal Technologies</h1>
                <p style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:6px 0 0;">Humans × AI</p>
            </div>
            <div style="padding:40px;border:1px solid #eee;border-top:none;">
                <p style="font-size:15px;line-height:1.7;color:#333;">Hi <strong>${data.name}</strong>,</p>
                <p style="font-size:15px;line-height:1.7;color:#333;">
                    Thank you for applying for the <strong>${data.position}</strong> role at Aananthal Technologies.
                    We've received your application and our team will review it shortly.
                </p>
                <p style="font-size:15px;line-height:1.7;color:#333;">
                    We'll be in touch within <strong>3–5 business days</strong>.
                </p>
                <div style="margin:32px 0;padding:20px 24px;background:#f4f4f4;border-left:3px solid #000;">
                    <p style="margin:0;font-size:13px;color:#555;font-style:italic;">"No degrees. No DSA. Just passion."</p>
                </div>
                <p style="font-size:13px;color:#888;line-height:1.7;">
                    — Team Aananthal<br>
                    <a href="mailto:${process.env.OWNER_EMAIL}" style="color:#000;">${process.env.OWNER_EMAIL}</a>
                </p>
            </div>
        </div>`,
    };
}

function ownerEmail(data, resumeAttachment) {
    const mail = {
        from: `"Careers Form" <${process.env.GMAIL_USER}>`,
        to: process.env.OWNER_EMAIL,
        subject: `New Application: ${data.position} — ${data.name}`,
        html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
            <div style="background:#000;padding:24px 32px;">
                <h2 style="color:#fff;margin:0;font-size:18px;">New Career Application</h2>
            </div>
            <div style="padding:32px;border:1px solid #eee;border-top:none;">
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    <tr><td style="padding:10px 0;color:#888;width:160px;">Name</td><td style="padding:10px 0;font-weight:600;">${data.name}</td></tr>
                    <tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#888;">Position</td><td style="padding:10px 8px;font-weight:600;">${data.position}</td></tr>
                    <tr><td style="padding:10px 0;color:#888;">Email</td><td style="padding:10px 0;"><a href="mailto:${data.email}" style="color:#000;">${data.email}</a></td></tr>
                    <tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#888;">Phone</td><td style="padding:10px 8px;">${data.phone || '—'}</td></tr>
                    <tr><td style="padding:10px 0;color:#888;">Portfolio</td><td style="padding:10px 0;"><a href="${data.portfolio}" style="color:#000;">${data.portfolio || '—'}</a></td></tr>
                    <tr style="background:#f9f9f9;"><td style="padding:10px 8px;color:#888;">Availability</td><td style="padding:10px 8px;">${data.availability || '—'}</td></tr>
                </table>
                <div style="margin-top:24px;">
                    <p style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Something they built</p>
                    <p style="font-size:14px;line-height:1.7;background:#f4f4f4;padding:16px;margin:0;">${data.built || '—'}</p>
                </div>
                <div style="margin-top:16px;">
                    <p style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Why Aananthal</p>
                    <p style="font-size:14px;line-height:1.7;background:#f4f4f4;padding:16px;margin:0;">${data.why || '—'}</p>
                </div>
            </div>
        </div>`,
    };

    if (resumeAttachment) {
        mail.attachments = [{
            filename: resumeAttachment.originalname,
            content:  resumeAttachment.buffer,
        }];
    }

    return mail;
}

const submitCareers = async (req, res) => {
    try {
        const data = {
            name:         req.body.name,
            position:     req.body.position,
            email:        req.body.email,
            phone:        req.body.phone,
            portfolio:    req.body.portfolio,
            availability: req.body.availability,
            built:        req.body.built,
            why:          req.body.why,
        };

        if (!data.name || !data.email || !data.position) {
            return res.status(400).json({ success: false, message: 'Name, email and position are required.' });
        }

        const resume = req.file || null;
        let resume_url = null;

        // Upload resume to Supabase Storage
        if (resume) {
            const fileName = `${Date.now()}_${resume.originalname.replace(/\s+/g, '_')}`;
            const { error: uploadError } = await supabase.storage
                .from('resumes')
                .upload(fileName, resume.buffer, { contentType: resume.mimetype });

            if (!uploadError) {
                const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(fileName);
                resume_url = urlData.publicUrl;
            } else {
                console.error('Resume upload error:', uploadError.message);
            }
        }

        await Promise.all([
            transporter.sendMail(applicantEmail(data)),
            transporter.sendMail(ownerEmail(data, resume)),
            supabase.from('careers_applications').insert({
                name:         data.name,
                position:     data.position,
                email:        data.email,
                phone:        data.phone        || null,
                portfolio:    data.portfolio    || null,
                availability: data.availability || null,
                built:        data.built        || null,
                why:          data.why          || null,
                resume_name:  resume ? resume.originalname : null,
                resume_url:   resume_url,
            }),
        ]);

        res.json({ success: true, message: 'Application received!' });

    } catch (err) {
        console.error('Careers submit error:', err);
        res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
};

module.exports = { submitCareers };
