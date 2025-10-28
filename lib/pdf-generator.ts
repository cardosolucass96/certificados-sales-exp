import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import fs from 'fs'
import path from 'path'

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function generateCertificate(nome: string): Promise<Buffer> {
  const modeloPath = path.join(process.cwd(), 'public', 'modelo-certificado.pdf')
  const modeloPdfBytes = fs.readFileSync(modeloPath)
  const pdfDoc = await PDFDocument.load(modeloPdfBytes)
  
  pdfDoc.registerFontkit(fontkit)
  
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Montserrat-BlackItalic.ttf')
  const fontBytes = fs.readFileSync(fontPath)
  const customFont = await pdfDoc.embedFont(fontBytes)
  
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { height } = firstPage.getSize()
  
  const nomeFormatado = toTitleCase(nome)
  
  const fontSize = 102
  const textX = 2124.48
  const textY = height - 803.43
  const maxWidth = 1193.84
  
  const words = nomeFormatado.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const textWidth = customFont.widthOfTextAtSize(testLine, fontSize)
    
    if (textWidth > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) {
    lines.push(currentLine)
  }
  
  const lineHeight = fontSize * 1.2
  
  lines.forEach((line, index) => {
    const textWidth = customFont.widthOfTextAtSize(line, fontSize)
    const centeredX = textX + (maxWidth - textWidth) / 2
    const y = textY - (index * lineHeight)
    
    firstPage.drawText(line, {
      x: centeredX,
      y: y,
      size: fontSize,
      font: customFont,
      color: rgb(1, 1, 1),
    })
  })
  
  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
