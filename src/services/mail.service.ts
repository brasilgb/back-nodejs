// src/services/mail.service.ts
import nodemailer from "nodemailer";

class MailService {
    private transporter;

    constructor() {
        // Configure com os dados do Mailtrap ou seu SMTP real
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            
            // Converte a string "true" do .env para boolean true
            secure: process.env.SMTP_SECURE === 'true', 
            
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            
            // Opcional: Ajuda a depurar erros de conexão no terminal
            logger: true,
        });
    }

    async sendResetPasswordEmail(to: string, token: string) {
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;

        await this.transporter.sendMail({
            from: '"Suporte SigmaOs" <no-reply@megb.com.br>',
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

    async sendWelcomeEmail(to: string, name: string) {
        // Link para o login (ajuste conforme seu front-end)
        const loginLink = "http://localhost:3000/login"; 
        const responseMail = "mailto:suporte@megbos.com.br"

        await this.transporter.sendMail({
            from: '"Equipe SigmaOs" <no-reply@megb.com.br>',
            to: to,
            subject: `Bem-vindo(a), ${name}! 🚀`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4F46E5;">Olá, ${name}!</h2>
                    <p>Estamos muito felizes em ter você conosco.</p>
                    <p>Sua conta foi criada com sucesso e sua empresa já está configurada no nosso sistema.</p>
                    <br>
                    <a href="${loginLink}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Acessar Minha Conta
                    </a>
                    <br><br>
                    <p>Se tiver qualquer dúvida, responda por este <a href="${responseMail}">suporte@sigmaos.com.br</a>.</p>
                    <p>Atenciosamente,<br>Equipe SigmaOs</p>
                </div>
            `
        });
    }
}

export const mailService = new MailService();