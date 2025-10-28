import { PDFDocument, rgb } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import fontkit from '@pdf-lib/fontkit'

// Função para capitalizar primeira letra de cada palavra
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function generateCertificate(nome: string): Promise<Buffer> {
  console.log('Gerando certificado para:', nome)
  
  try {
    // Caminho absoluto para a imagem na pasta public
    const modeloPath = path.join(process.cwd(), 'public', 'modelo-certificado.jpg')
    console.log('Caminho do modelo:', modeloPath)
    
    // Ler a imagem do modelo
    const imageBytes = fs.readFileSync(modeloPath)
    
    // Criar PDF
    const pdfDoc = await PDFDocument.create()
    
    // Registrar fontkit para usar fontes customizadas
    pdfDoc.registerFontkit(fontkit)
    
    // Embed da imagem de fundo
    const jpgImage = await pdfDoc.embedJpg(imageBytes)
    const { width, height } = jpgImage.size()
    
    console.log('Dimensões da imagem:', { width, height })
    
    // Adicionar página com o tamanho da imagem
    const page = pdfDoc.addPage([width, height])
    
    // Desenhar a imagem de fundo
    page.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    })
    
    // Carregar fonte Montserrat Black Italic
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Montserrat-BlackItalic.ttf')
    let font
    
    try {
      const fontBytes = fs.readFileSync(fontPath)
      font = await pdfDoc.embedFont(fontBytes)
      console.log('Fonte Montserrat Black Italic carregada com sucesso')
    } catch (error) {
      console.error('Erro ao carregar fonte customizada, usando fonte padrão:', error)
      // Fallback para fonte padrão se a Montserrat não estiver disponível
      const { StandardFonts } = await import('pdf-lib')
      font = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique)
    }
    
    // Nome formatado
    const nomeFormatado = toTitleCase(nome)
    
    // Configurações conforme especificado
    // Fonte: Montserrat Black Italic 34pt x 3 = 102pt
    const fontSize = 102
    const textColor = rgb(1, 1, 1) // Branco
    
    // Coordenadas EXATAS do design:
    // X: 2124,48 px, Y: 803,43 px
    // Área: W: 1193,84 px, H: 693,15 px
    // Importante: No PDF, Y=0 é no FUNDO da página (não no topo)
    
    const designX = 2250.48
    const designY = 1103.43
    const maxWidth = 1193.84
    
    // Como a origem Y no PDF é INFERIOR ESQUERDA, precisamos ajustar
    const textX = designX
    const textY = height - designY  // Inverte o Y
    
    console.log('Posição do texto:', { textX, textY, fontSize, maxWidth })
    
    // Quebrar texto em linhas se necessário para caber na largura máxima
    const words = nomeFormatado.split(' ')
    const lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testWidth = font.widthOfTextAtSize(testLine, fontSize)
      
      if (testWidth > maxWidth && currentLine) {
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
    const lineHeight = fontSize * 1.2 // Espaçamento entre linhas
    
    lines.forEach((line, index) => {
      const y = textY - (index * lineHeight)
      
      console.log(`Desenhando linha ${index + 1}: "${line}" em (${textX}, ${y})`)
      
      page.drawText(line, {
        x: textX,
        y: y,
        size: fontSize,
        font: font,
        color: textColor,
      })
    })
    
    // Salvar o PDF
    const pdfBytes = await pdfDoc.save()
    console.log('PDF gerado com sucesso')
    return Buffer.from(pdfBytes)
    
  } catch (error) {
    console.error('Erro ao gerar certificado:', error)
    throw error
  }
}
