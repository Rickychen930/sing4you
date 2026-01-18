import nodemailer from 'nodemailer';
import { IContactForm } from '../../shared/interfaces';

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static initializeTransporter(): nodemailer.Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    // Support multiple email providers
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.ADMIN_EMAIL,
        pass: process.env.SMTP_PASSWORD || process.env.ADMIN_EMAIL_PASSWORD,
      },
    };

    // If using Gmail with App Password
    if (process.env.SMTP_SERVICE === 'gmail') {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER || process.env.ADMIN_EMAIL,
          pass: process.env.SMTP_PASSWORD || process.env.ADMIN_EMAIL_PASSWORD,
        },
      });
    } else {
      this.transporter = nodemailer.createTransport(emailConfig);
    }

    return this.transporter;
  }

  public static async sendContactNotification(formData: IContactForm): Promise<void> {
    // Skip email if not configured
    if (!process.env.ADMIN_EMAIL || !process.env.SMTP_USER) {
      console.warn('⚠️  Email service not configured. Skipping email notification.');
      console.log('Contact form submission:', formData);
      return;
    }

    try {
      const transporter = this.initializeTransporter();

      const adminEmail = process.env.ADMIN_EMAIL;
      const siteName = process.env.SITE_NAME || 'Christina Sings4U';
      const siteUrl = process.env.SITE_URL || 'https://christinasings4u.com.au';

      const subject = `New Contact Form Submission${formData.eventType ? ` - ${formData.eventType}` : ''}`;

      const html = this.formatContactEmail(formData, siteName, siteUrl);

      await transporter.sendMail({
        from: `"${siteName}" <${process.env.SMTP_USER || process.env.ADMIN_EMAIL}>`,
        to: adminEmail,
        replyTo: formData.email,
        subject,
        html,
        text: this.formatContactEmailText(formData),
      });

      console.log('✅ Contact form email notification sent successfully');
    } catch (error) {
      const err = error as Error;
      console.error('❌ Failed to send contact form email:', err);
      // Don't throw - log the submission anyway
      console.log('Contact form submission (email failed):', formData);
    }
  }

  private static formatContactEmail(formData: IContactForm, siteName: string, siteUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #d4af37; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; color: #333; }
            .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${this.escapeHtml(formData.name)}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${formData.email}">${this.escapeHtml(formData.email)}</a></div>
              </div>
              ${formData.phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${this.escapeHtml(formData.phone)}</div>
              </div>
              ` : ''}
              ${formData.eventType ? `
              <div class="field">
                <div class="label">Event Type:</div>
                <div class="value">${this.escapeHtml(formData.eventType)}</div>
              </div>
              ` : ''}
              ${formData.eventDate ? `
              <div class="field">
                <div class="label">Event Date:</div>
                <div class="value">${this.escapeHtml(formData.eventDate)}</div>
              </div>
              ` : ''}
              ${formData.location ? `
              <div class="field">
                <div class="label">Location:</div>
                <div class="value">${this.escapeHtml(formData.location)}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Message:</div>
                <div class="value" style="white-space: pre-wrap;">${this.escapeHtml(formData.message)}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from ${siteName} contact form.</p>
              <p><a href="${siteUrl}">${siteUrl}</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static formatContactEmailText(formData: IContactForm): string {
    return `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.eventType ? `Event Type: ${formData.eventType}` : ''}
${formData.eventDate ? `Event Date: ${formData.eventDate}` : ''}
${formData.location ? `Location: ${formData.location}` : ''}

Message:
${formData.message}

---
This email was sent from Christina Sings4U contact form.
    `.trim();
  }

  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  public static async verifyConnection(): Promise<boolean> {
    if (!process.env.ADMIN_EMAIL || !process.env.SMTP_USER) {
      return false;
    }

    try {
      const transporter = this.initializeTransporter();
      await transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}
