import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import { createCanvas, registerFont } from 'canvas'

// Função para capitalizar primeira letra de cada palavra
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function generateCertificate(nome: string): Promise<Buffer> {
  console.log('Gerando certificado para:', nome)
  
  try {
    // Carregar o PDF modelo
    const modeloPath = path.join(process.cwd(), 'public', 'modelo-certificado.pdf')
    console.log('Caminho do modelo PDF:', modeloPath)
    
    const modeloPdfBytes = fs.readFileSync(modeloPath)
    const pdfDoc = await PDFDocument.load(modeloPdfBytes)
    
    // Pegar a primeira página
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    
    console.log('Dimensões da página PDF:', { width, height })
    
    // Registrar a fonte Montserrat
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Montserrat-BlackItalic.ttf')
    registerFont(fontPath, { family: 'Montserrat Black Italic' })
    
    // Criar canvas para desenhar o texto
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    
    // Canvas transparente
    ctx.clearRect(0, 0, width, height)
    
    // Nome formatado
    const nomeFormatado = toTitleCase(nome)
    
    // Configurações
    const fontSize = 102
    ctx.font = `${fontSize}px "Montserrat Black Italic"`
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    
    // Coordenadas: X: 2124,48 px, Y: 803,43 px, W: 1193,84 px
    const designX = 2124.48
    const designY = 803.43
    const maxWidth = 1193.84
    
    const centerX = designX + (maxWidth / 2)
    const textY = designY
    
    console.log('Posição do texto:', { centerX, textY, fontSize, maxWidth })
    
    // Quebrar texto em linhas
    const words = nomeFormatado.split(' ')
    const lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) {
      lines.push(currentLine)
    }
    
    console.log('Texto dividido em linhas:', lines)
    
    // Desenhar cada linha
    const lineHeight = fontSize * 1.2
    
    lines.forEach((line, index) => {
      const y = textY + (index * lineHeight)
      console.log(`Desenhando linha ${index + 1}: "${line}" em (${centerX}, ${y})`)
      ctx.fillText(line, centerX, y)
    })
    
    // Converter canvas para PNG
    const pngBuffer = canvas.toBuffer('image/png')
    const pngImage = await pdfDoc.embedPng(pngBuffer)
    
    // Desenhar o texto sobre o PDF
    firstPage.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: width,
      height: height,
      opacity: 1
    })
    
    // Salvar o PDF
    const pdfBytes = await pdfDoc.save()
    console.log('PDF gerado com sucesso com Canvas + PDF')
    return Buffer.from(pdfBytes)
    
  } catch (error) {
    console.error('Erro ao gerar certificado:', error)
    throw error
  }
}
