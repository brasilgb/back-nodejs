import { Request, Response, NextFunction } from "express"
import { ZodObject, ZodError } from "zod"

export const validate = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {}

        error.issues.forEach((err) => {
          const field = String(err.path[0])
          if (!fieldErrors[field]) {
            fieldErrors[field] = []
          }
          fieldErrors[field].push(err.message)
        })

        return res.status(400).json({
          message: "Erro de validação",
          fieldErrors,
        })
      }

      return res.status(500).json({
        message: "Erro interno de validação",
      })
    }
  }
}
