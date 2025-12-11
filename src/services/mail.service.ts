// src/services/mail.service.ts
import nodemailer from "nodemailer";

class MailService {
    private transporter;

    constructor() {
        // Configure com os dados do Mailtrap ou seu SMTP real
        this.transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io", // Exemplo Mailtrap
            port: 2525,
            auth: {
                user: "caa650af4566ec",
                pass: "93a0adad8c26f4"
            }
        });
    }

    async sendResetPasswordEmail(to: string, token: string) {
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;

        await this.transporter.sendMail({
            from: '"Suporte SaaS" <no-reply@saas.com>',
            to: to,
            subject: "Recuperação de Senha",
            html: `
                <h3>Recuperação de Senha</h3>
                <p>Você solicitou a troca de senha.</p>
                <p>Clique no link abaixo para criar uma nova senha (válido por 1 hora):</p>
                <a href="${resetLink}">Redefinir Minha Senha</a>
                <p>Se não foi você, ignore este e-mail.</p>
            `
        });
    }
}

export const mailService = new MailService();