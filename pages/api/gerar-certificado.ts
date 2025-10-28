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
    const { nome, email, telefone, codigo } = req.body

    if (!nome) {
      return res.status(400).json({ error: 'Nome não fornecido' })
    }

    console.log('Gerando certificado para:', nome)

    // Gerar o PDF
    const pdfBuffer = await generateCertificate(nome)
    console.log('PDF gerado com sucesso, tamanho:', pdfBuffer.length, 'bytes')

    // Gerar nome do arquivo único
    const timestamp = Date.now()
    const sanitizedName = nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()

    const fileName = `certificado-${timestamp}-${sanitizedName}.pdf`
    
    // Salvar na pasta public/certificados
    const publicDir = path.join(process.cwd(), 'public', 'certificados')
    
    // Criar diretório se não existir
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }
    
    const filePath = path.join(publicDir, fileName)
    fs.writeFileSync(filePath, pdfBuffer)
    
    console.log('Arquivo salvo em:', filePath)

    // URL pública para acessar o arquivo
    const fileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/certificados/${fileName}`

    return res.status(200).json({
      url: fileUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error('Erro ao gerar certificado:', error)
    return res.status(500).json({ error: 'Erro ao gerar certificado' })
  }
}
