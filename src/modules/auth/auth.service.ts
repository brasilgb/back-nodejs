import { compare, hash } from "bcryptjs";
import { authRepository } from "./auth.repository";
import { userRepository } from "../users/user.repository"; // Reutilizando para checar email
import { tenantRepository } from "../tenants/tenant.repository"; // Reutilizando para checar CNPJ
import { LoginDTO, RegisterDTO } from "./auth.schema";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { mailService } from "../../services/mail.service";

// Constantes secretas (Ideamente mover para .env)
const SUPERUSER_COMPANY_CODE = 'super-company-sigmaos-root';
const SUPERUSER_CNPJ_CODE = '0D82457BF990DE04D1F8F98AC7BFE7DC';

class AuthService {

    async register(data: RegisterDTO) {
        // Lógica para detectar se é Super Usuário
        const isSuperUserRegistration = 
            data.company === SUPERUSER_COMPANY_CODE && 
            data.cnpj === SUPERUSER_CNPJ_CODE;

        // 1. Hash da senha (comum para ambos)
        const passwordHash = await hash(data.password, 8);

        // --- FLUXO SUPER USUÁRIO ---
        if (isSuperUserRegistration) {
            const superUserExists = await authRepository.findSuperUser();
            
            if (superUserExists) {
                throw new Error("Já existe um superusuário registrado no sistema.");
            }

            // Verifica duplicidade de email na tabela geral
            const emailExists = await userRepository.findByEmail(data.email);
            if (emailExists) throw new Error("E-mail já cadastrado");

            // Cria
            const superUser = await authRepository.createSuperUser({
                ...data,
                password: passwordHash
            });

            return { user: superUser, type: 'admin' };
        }

        // --- FLUXO TENANT COMUM ---
        
        // Validações obrigatórias para Tenant Comum
        if (!data.company) throw new Error("Razão Social é obrigatória");
        if (!data.cnpj) throw new Error("CNPJ é obrigatório");

        // Verifica duplicidade (Email, CNPJ, Company)
        // Nota: Precisamos desses métodos implementados nos repositórios respectivos
        const emailExists = await userRepository.findByEmail(data.email);
        if (emailExists) throw new Error("E-mail já cadastrado");
        
        // Verifica CNPJ na tabela tenants
        const cnpjExists = await tenantRepository.findByCnpj(data.cnpj);
        if (cnpjExists) throw new Error("CNPJ já cadastrado");

        // Executa a transação completa
        const result = await authRepository.createTenantTransaction(data, passwordHash);

        return { user: result.user, type: 'app' };
    }

    async login(data: LoginDTO) {
        // 1. Busca o usuário pelo e-mail
        const user = await userRepository.findByEmail(data.email);

        // 2. Se não achar o usuário, lança erro genérico (Segurança: evita enumeração de usuários)
        if (!user) {
            throw new Error("E-mail ou senha incorretos");
        }

        // 3. Compara a senha enviada com o hash do banco
        const passwordMatch = await compare(data.password, user.password);

        if (!passwordMatch) {
            throw new Error("E-mail ou senha incorretos");
        }

        // 4. Se a senha bater, gera o Token JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("Erro interno: JWT_SECRET não configurado");
        }

        // O payload são os dados que ficam "dentro" do token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                tenant_id: user.tenant_id // Útil para filtrar dados depois
            }, 
            secret,
            { expiresIn: "1d" } // Token expira em 1 dia
        );

        return { token, user };
    }

    // Passo 1: Enviar o e-mail
    async forgotPassword(email: string) {
        const user = await userRepository.findByEmail(email);
        
        // Segurança: Se o usuário não existe, não fazemos nada, 
        // mas retornamos sucesso para não revelar quem é cliente ou não.
        if (!user) return; 

        // Gera token aleatório (hexadecimal)
        const token = crypto.randomBytes(20).toString('hex');

        // Expira em 1 hora
        const now = new Date();
        now.setHours(now.getHours() + 1);

        // Salva no banco
        await authRepository.saveResetToken(user.id, token, now);

        // Envia e-mail (Assíncrono: não usamos await para não travar a API, ou usamos fila)
        // Para simplificar aqui, vamos usar await
        await mailService.sendResetPasswordEmail(email, token);
    }

    // Passo 2: Resetar a senha
    async resetPassword(data: any) { // Use o tipo ResetPasswordDTO
        // Busca usuário pelo token válido
        const user = await authRepository.findByResetToken(data.token);

        if (!user) {
            throw new Error("Token inválido ou expirado");
        }

        // Hash da nova senha
        const passwordHash = await hash(data.password, 8);

        // Atualiza senha e mata o token
        await authRepository.updatePasswordAndClearToken(user.id, passwordHash);
    }

}

export const authService = new AuthService();