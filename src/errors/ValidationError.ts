export class ValidationError extends Error {
  status = 400
  fieldErrors: Record<string, string>

  constructor(fieldErrors: Record<string, string>) {
    super("Erro de validação")
    this.fieldErrors = fieldErrors
  }
}