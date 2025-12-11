/**
 * Calcula o próximo número sequencial para um tenant específico.
 * * @param modelDelegate - O delegate do Prisma (ex: prisma.user, prisma.customer)
 * @param tenantId - O ID da empresa
 * @param fieldName - O nome da coluna (ex: 'user_number', 'code')
 */
export async function getNextSequence(
    modelDelegate: any, 
    tenantId: number, 
    fieldName: string
): Promise<number> {
    
    // Busca o registro com o MAIOR número para este tenant
    const lastRecord = await modelDelegate.findFirst({
        where: { tenant_id: tenantId },
        orderBy: { [fieldName]: 'desc' }, // Ordenação dinâmica
        select: { [fieldName]: true }     // Seleciona apenas o campo numérico
    });

    // Se achou, soma 1. Se não (é o primeiro), retorna 1.
    return lastRecord ? lastRecord[fieldName] + 1 : 1;
}