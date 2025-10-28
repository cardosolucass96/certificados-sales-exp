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
    
    // Salvar o PDF na pasta public/certificados
    const certificadosDir = path.join(process.cwd(), 'public', 'certificados')
    
    // Criar diretório se não existir
    if (!fs.existsSync(certificadosDir)) {
      fs.mkdirSync(certificadosDir, { recursive: true })
      console.log('Diretório de certificados criado:', certificadosDir)
    }
    
    const filePath = path.join(certificadosDir, fileName)
    fs.writeFileSync(filePath, pdfBuffer)
    console.log('PDF salvo em:', filePath)

    // Retornar URL da API de download ao invés de arquivo estático
    const publicUrl = `/api/download/${fileName}`
    
    console.log('PDF disponível em:', publicUrl)

    return res.status(200).json({
      url: publicUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error('Erro ao gerar certificado:', error)
    return res.status(500).json({ error: 'Erro ao gerar certificado' })
  }
}
