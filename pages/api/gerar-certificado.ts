import type { NextApiRequest, NextApiResponse } from 'next'
import { generateCertificate } from '@/lib/pdf-generator'
import fs from 'fs'
import path from 'path'

type SuccessResponse = {
  url: string
  fileName: string
}

type ErrorResponse = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { nome } = req.body

    if (!nome) {
      return res.status(400).json({ error: 'Nome não fornecido' })
    }

    const pdfBuffer = await generateCertificate(nome)

    const timestamp = Date.now()
    const sanitizedName = nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()

    const fileName = `certificado-${timestamp}-${sanitizedName}.pdf`
    
    const certificadosDir = path.join(process.cwd(), 'public', 'certificados')
    
    if (!fs.existsSync(certificadosDir)) {
      fs.mkdirSync(certificadosDir, { recursive: true })
    }
    
    const filePath = path.join(certificadosDir, fileName)
    fs.writeFileSync(filePath, pdfBuffer)

    const publicUrl = `/api/download/${fileName}`

    return res.status(200).json({
      url: publicUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error('ERRO GERAR CERTIFICADO:', error)
    return res.status(500).json({ error: 'Erro ao gerar certificado' })
  }
}
