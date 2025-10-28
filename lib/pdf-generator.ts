import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import path from 'path'

// Função para capitalizar primeira letra de cada palavra
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function generateCertificate(nome: string): Promise<Buffer> {
  console.log('Gerando certificado para:', nome)
  
  try {
    // Buscar a imagem usando fetch (compatível com Vercel)
    const imageUrl = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3001'}/modelo-certificado.jpg`
    console.log('Buscando modelo de:', imageUrl)
    
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Falha ao buscar modelo: ${imageResponse.status}`)
    }
    
    const imageBytes = await imageResponse.arrayBuffer()
    
    // Criar PDF
    const pdfDoc = await PDFDocument.create()
    
    // Embed da imagem de fundo
    const jpgImage = await pdfDoc.embedJpg(imageBytes)
    const { width, height } = jpgImage.size()
    
    // Adicionar página com o tamanho da imagem
    const page = pdfDoc.addPage([width, height])
    
    // Desenhar a imagem de fundo
    page.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    })
    
    // Embed da fonte
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique)
    
    // Nome formatado
    const nomeFormatado = toTitleCase(nome)
    
    // Configurações de texto - convertendo coordenadas do canvas para PDF
    // PDF tem origem no canto inferior esquerdo, canvas no superior esquerdo
    const fontSize = 64 // Tamanho reduzido para funcionar com fonte padrão
    const textColor = rgb(1, 1, 1) // Branco
    
    // Posições aproximadas baseadas no template original
    const textX = width / 2 // Centro horizontal
    const textY = height * 0.4 // Aproximadamente onde fica o nome no template
    
    // Quebrar texto em linhas se necessário
    const words = nomeFormatado.split(' ')
    const maxWordsPerLine = 3
    const lines: string[] = []
    
    for (let i = 0; i < words.length; i += maxWordsPerLine) {
      lines.push(words.slice(i, i + maxWordsPerLine).join(' '))
    }
    
    // Desenhar cada linha
    const lineHeight = fontSize + 10
    const totalHeight = lines.length * lineHeight
    let startY = textY + totalHeight / 2
    
    lines.forEach((line, index) => {
      const textWidth = font.widthOfTextAtSize(line, fontSize)
      const x = textX - textWidth / 2 // Centralizar
      const y = startY - (index * lineHeight)
      
      page.drawText(line, {
        x: x,
        y: y,
        size: fontSize,
        font: font,
        color: textColor,
      })
    })
    
    // Salvar o PDF
    const pdfBytes = await pdfDoc.save()
    console.log('PDF gerado com sucesso usando pdf-lib puro')
    return Buffer.from(pdfBytes)
    
  } catch (error) {
    console.error('Erro ao gerar certificado:', error)
    throw error
  }
}
