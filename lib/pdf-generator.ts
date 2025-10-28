import { PDFDocument } from 'pdf-lib'
import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'

// Função para capitalizar primeira letra de cada palavra
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

export async function generateCertificate(nome: string): Promise<Buffer> {
  console.log('Gerando certificado para:', nome)
  
  // Caminho para a imagem do modelo
  const modeloPath = path.join(process.cwd(), 'modelo-certificado.jpg')
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(modeloPath)) {
    throw new Error(`Arquivo de modelo não encontrado: ${modeloPath}`)
  }
  
  // Carregar a imagem
  const image = await loadImage(modeloPath)
  
  // Criar canvas com o tamanho da imagem
  const canvas = createCanvas(image.width, image.height)
  const ctx = canvas.getContext('2d')
  
  // Desenhar a imagem de fundo
  ctx.drawImage(image, 0, 0)
  
  // Configurar o texto
  // Fonte bem maior - aproximadamente 96pt
  // Montserrat Black Italic não está disponível por padrão, usando alternativa similar
  ctx.font = 'italic bold 128px Arial, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  
  // Configurações da caixa de texto
  const boxX = 2070.28
  const boxY = 912.5  // 1012.5 - 100 = 912.5 (subiu 100px)
  const boxWidth = 1270.81
  const boxHeight = 526.75
  
  // Altura da linha - também aumentada proporcionalmente
  const lineHeight = 140
  
  // Nome com primeira letra maiúscula
  const nomeFormatado = toTitleCase(nome)
  
  // Quebrar texto em múltiplas linhas se necessário
  const words = nomeFormatado.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  // Calcular quebra de linhas
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > boxWidth - 40) { // -40 para margem
      if (currentLine) lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) lines.push(currentLine)
  
  // Centralizar verticalmente o texto na caixa
  const totalHeight = lines.length * lineHeight
  const startY = boxY + (boxHeight - totalHeight) / 2
  
  // Desenhar cada linha centralizada
  const centerX = boxX + boxWidth / 2
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + (index * lineHeight))
  })
  
  // Converter canvas para buffer
  const imageBuffer = canvas.toBuffer('image/jpeg', { quality: 0.95 })
  
  // Criar PDF e inserir a imagem
  const pdfDoc = await PDFDocument.create()
  
  // Adicionar página com tamanho baseado na imagem
  const page = pdfDoc.addPage([image.width, image.height])
  
  // Embed da imagem no PDF
  const jpgImage = await pdfDoc.embedJpg(imageBuffer)
  
  // Desenhar imagem na página
  page.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  })
  
  // Salvar o PDF
  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
