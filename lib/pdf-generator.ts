import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import fs from 'fs'
import path from 'path'

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function generateCertificate(nome: string): Promise<Buffer> {
  console.log('🔍 Gerando certificado para:', nome)
  
  const modeloPath = path.join(process.cwd(), 'public', 'modelo-certificado.pdf')
  console.log('📄 Modelo PDF path:', modeloPath)
  console.log('📄 Modelo existe?', fs.existsSync(modeloPath))
  
  const modeloPdfBytes = fs.readFileSync(modeloPath)
  const pdfDoc = await PDFDocument.load(modeloPdfBytes)
  
  pdfDoc.registerFontkit(fontkit)
  
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Montserrat-BlackItalic.ttf')
  console.log('🔤 Font path:', fontPath)
  console.log('🔤 Font existe?', fs.existsSync(fontPath))
  
  const fontBytes = fs.readFileSync(fontPath)
  const customFont = await pdfDoc.embedFont(fontBytes)
  console.log('✅ Fonte embedada com sucesso')
  
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { height, width } = firstPage.getSize()
  console.log('📐 Dimensões da página:', { width, height })
  
  const nomeFormatado = toTitleCase(nome)
  console.log('✏️ Nome formatado:', nomeFormatado)
  
  // ========== CONFIGURAÇÃO DO PONTO DE REFERÊNCIA (CENTRO) ==========
  // Este é o ponto central onde o texto será alinhado
  const centerX = 650 // Centro X da área de texto
  const centerY = 350 // Centro Y da área de texto
  const fontSize = 24
  const maxWidth = 300 // Largura máxima para quebra de linha
  
  console.log('📍 Ponto de referência (centro):', { centerX, centerY, fontSize, maxWidth })
  
  // ========== QUEBRA DE LINHA INTELIGENTE ==========
  const words = nomeFormatado.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  // Tenta manter tudo em uma linha
  const fullText = nomeFormatado
  const fullTextWidth = customFont.widthOfTextAtSize(fullText, fontSize)
  
  if (fullTextWidth <= maxWidth) {
    // Se cabe em uma linha, usa o texto completo
    lines.push(fullText)
  } else {
    // Se não cabe, quebra palavra por palavra
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testWidth = customFont.widthOfTextAtSize(testLine, fontSize)
      
      if (testWidth > maxWidth && currentLine) {
        // Linha atual excedeu, salva e começa nova
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    // Adiciona a última linha
    if (currentLine) {
      lines.push(currentLine)
    }
  }
  
  console.log('📝 Linhas de texto:', lines)
  console.log('📏 Largura total necessária:', fullTextWidth.toFixed(2), '/ máxima:', maxWidth.toFixed(2))
  
  // ========== CÁLCULO DO CENTRO DO BLOCO DE TEXTO ==========
  const lineHeight = fontSize * 1.3 // Espaçamento entre linhas (30% do tamanho da fonte)
  
  // Altura total do bloco de texto (espaço entre primeira e última linha)
  const totalBlockHeight = (lines.length - 1) * lineHeight
  
  // Posição Y da primeira linha (topo do bloco)
  // Para centralizar: centro + metade da altura total
  const firstLineY = centerY + (totalBlockHeight / 2)
  
  console.log('📊 Bloco de texto:', {
    linhas: lines.length,
    alturaTotal: totalBlockHeight.toFixed(2),
    primeiraLinhaY: firstLineY.toFixed(2),
    centro: { x: centerX, y: centerY }
  })
  
  // ========== DESENHO DAS LINHAS CENTRALIZADAS ==========
  lines.forEach((line, index) => {
    // Largura da linha atual
    const lineWidth = customFont.widthOfTextAtSize(line, fontSize)
    
    // Posição X centralizada em relação ao centerX
    const lineX = centerX - (lineWidth / 2)
    
    // Posição Y (primeira linha no topo, demais descem)
    const lineY = firstLineY - (index * lineHeight)
    
    console.log(`📌 Linha ${index + 1}: "${line}"`)
    console.log(`   └─ Posição: x=${lineX.toFixed(2)} (centro-${(lineWidth/2).toFixed(2)}), y=${lineY.toFixed(2)}`)
    console.log(`   └─ Largura: ${lineWidth.toFixed(2)}px`)
    
    firstPage.drawText(line, {
      x: lineX,
      y: lineY,
      size: fontSize,
      font: customFont,
      color: rgb(1, 1, 1),
    })
  })
  
  const pdfBytes = await pdfDoc.save()
  console.log('💾 PDF salvo, tamanho:', pdfBytes.length, 'bytes')
  
  return Buffer.from(pdfBytes)
}
