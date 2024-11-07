import sendEmail from "../utils/sendEmail";

export default class EmailService {
  constructor() { }

  sendRegisterEmail = async ({ email, token }) => {
    const registerLink = `${process.env.CLIENT_URL}/auth/verify-email/${token}`;
    await sendEmail({
      from: process.env.SMTP_EMAIL || 'example@example.com',
      to: email,
      subject: 'Xác thực Email',
      html: `
      <div style="background-color: #f3f4f6; min-height: 100vh; padding: 1rem;">
        <div style="max-width: 40rem; margin: 0 auto; background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="padding: 2rem;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <img src="https://images.unsplash.com/photo-1496200186974-4293800e2c20?w=150&h=150&fit=crop" alt="Company Logo" style="width: 8rem; height: 8rem; margin: 0 auto; border-radius: 50%; object-cover; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                </div>
                
                <div style="text-align: center; margin-bottom: 2rem;">
                    <h1 style="font-size: 1.875rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem;">Welcome to Our Community!</h1>
                    <p style="color: #4b5563; font-size: 1.125rem;">Thank you for registering with us.</p>
                </div>
                
                <div style="background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem;">
                    <h2 style="font-size: 1.25rem; font-weight: 600; color: #374151; margin-bottom: 1rem;">Registration Details</h2>
                    <p style="color: #4b5563; margin-bottom: 1rem;">Your account has been successfully created. To get started, please verify your email address by clicking the button below.</p>
                    
                    <div style="background-color: #ebf8ff; border-left: 4px solid #3b82f6; padding: 1rem; margin-bottom: 1.5rem;">
                        <p style="color: #1d4ed8;">Please verify your email within 24 hours to activate your account.</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-bottom: 2rem;">
                    <a href="${registerLink}" style="display: inline-block; background-color: #2563eb; color: white; font-weight: bold; padding: 0.75rem 2rem; border-radius: 9999px; transition: transform 0.3s, box-shadow 0.3s; text-decoration: none;" onmouseover="this.style.backgroundColor='#1e40af'; this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)';" onmouseout="this.style.backgroundColor='#2563eb'; this.style.transform='scale(1)'; this.style.boxShadow='none';">
                        Verify Email Address
                    </a>
                </div>
                
                <div style="border-top: 1px solid #e5e7eb; padding-top: 1.5rem;">
                    <p style="color: #6b7280; font-size: 0.875rem; text-align: center;">If you did not create an account, please ignore this email.</p>
                </div>
            </div>
            
            <footer style="background-color: #f9fafb; padding: 1.5rem 2rem;">
                <div style="text-align: center; color: #4b5563; font-size: 0.875rem;">
                    <p style="margin-bottom: 0.5rem;">© 2024 Company Name. All rights reserved.</p>
                    <div style="display: inline-block;">
                        <a href="#" style="color: #2563eb; text-decoration: none; margin-right: 1rem;" onmouseover="this.style.color='#1e40af';" onmouseout="this.style.color='#2563eb';">Privacy Policy</a>
                        <a href="#" style="color: #2563eb; text-decoration: none; margin-right: 1rem;" onmouseover="this.style.color='#1e40af';" onmouseout="this.style.color='#2563eb';">Terms of Service</a>
                        <a href="#" style="color: #2563eb; text-decoration: none;" onmouseover="this.style.color='#1e40af';" onmouseout="this.style.color='#2563eb';">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    </div>
`
    });
  }

  sendResetPasswordEmail = async ({ email, token }) => {
    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${token}`;

    await sendEmail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      html: `<a href="${resetPasswordLink}">Bấm vào đây để đặt lại mật khẩu</a>`
    });
  }
}