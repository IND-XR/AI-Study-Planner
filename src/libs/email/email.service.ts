import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter!: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, firstName: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    const htmlContent = `
      <h2>Welcome to AI Study Planner, ${firstName}!</h2>
      <p>Please verify your email address to activate your account.</p>
      <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Verify Email
      </a>
      <p>Or copy this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `;

    await this.sendEmail(email, 'Verify Your Email - AI Study Planner', htmlContent);
  }

  async sendPasswordResetEmail(email: string, firstName: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    const htmlContent = `
      <h2>Password Reset Request</h2>
      <p>Hi ${firstName},</p>
      <p>We received a request to reset your password. Click the link below to create a new password:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
      <p>Or copy this link: ${resetUrl}</p>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await this.sendEmail(email, 'Reset Your Password - AI Study Planner', htmlContent);
  }

  async sendStudyPlanNotification(email: string, firstName: string, planSummary: string) {
    const htmlContent = `
      <h2>Your Study Plan is Ready, ${firstName}!</h2>
      <p>Your AI-generated study plan has been created based on your exam dates and available study hours.</p>
      <p><strong>Plan Summary:</strong></p>
      <pre>${planSummary}</pre>
      <p>Log in to your account to view and start following your study plan.</p>
    `;

    await this.sendEmail(email, 'Your Study Plan is Ready - AI Study Planner', htmlContent);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const mailOptions = {
        from: this.configService.get('EMAIL_FROM'),
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}:`, error);
      throw error;
    }
  }
}
