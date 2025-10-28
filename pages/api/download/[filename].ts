import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename } = req.query

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Nome do arquivo não fornecido' })
  }

  try {
    // Caminho do arquivo
    const filePath = path.join(process.cwd(), 'public', 'certificados', filename)

    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.error('Arquivo não encontrado:', filePath)
      return res.status(404).json({ error: 'Certificado não encontrado' })
    }

    // Ler o arquivo
    const fileBuffer = fs.readFileSync(filePath)

    // Configurar headers para PDF
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`)
    res.setHeader('Content-Length', fileBuffer.length)

    // Enviar o arquivo
    res.send(fileBuffer)
  } catch (error) {
    console.error('Erro ao servir certificado:', error)
    return res.status(500).json({ error: 'Erro ao servir certificado' })
  }
}
