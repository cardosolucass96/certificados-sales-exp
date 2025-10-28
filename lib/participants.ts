import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export interface Participant {
  'código': string
  'nome participante': string
  'email participante': string
  'telefone participante': string
  '[Extra] document': string
}

function normalizeString(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

function isEmail(str: string): boolean {
  return str.includes('@')
}

function isPhone(str: string): boolean {
  const onlyNumbers = str.replace(/\D/g, '')
  // Telefone válido tem 10 ou 11 dígitos (com ou sem DDD 85)
  return /^\d{10,11}$/.test(onlyNumbers)
}

export function findParticipant(busca: string): Participant | null {
  const csvPath = path.join(process.cwd(), 'participantes-sales-teresina.csv')
  const fileContent = fs.readFileSync(csvPath, 'utf-8')

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const buscaTrimmed = busca.trim()
  
  // Identifica o tipo de busca
  if (isEmail(buscaTrimmed)) {
    // BUSCA POR EMAIL - deve ser exatamente igual (case-insensitive)
    const emailBusca = normalizeString(buscaTrimmed)
    console.log('🔍 Buscando por EMAIL:', emailBusca)
    
    return records.find((p: any) => {
      const emailParticipante = normalizeString(p['email participante'] || '')
      const match = emailParticipante === emailBusca
      if (match) {
        console.log('✅ EMAIL encontrado:', p['email participante'])
      }
      return match
    }) || null
    
  } else if (isPhone(buscaTrimmed)) {
    // BUSCA POR TELEFONE - deve ser exatamente igual (apenas números)
    const telBusca = normalizePhone(buscaTrimmed)
    console.log('🔍 Buscando por TELEFONE:', telBusca)
    
    return records.find((p: any) => {
      const telParticipante = normalizePhone(p['telefone participante'] || '')
      
      // Busca exata
      if (telParticipante === telBusca) {
        console.log('✅ TELEFONE encontrado (exato):', p['telefone participante'])
        return true
      }
      
      // Se a busca tem 11 dígitos e começa com 85, também tenta sem o DDD
      if (telBusca.length === 11 && telBusca.startsWith('85')) {
        const telSemDDD = telBusca.substring(2) // Remove os 2 primeiros dígitos (85)
        if (telParticipante === telSemDDD) {
          console.log('✅ TELEFONE encontrado (sem DDD):', p['telefone participante'])
          return true
        }
      }
      
      // Se a busca tem 10 dígitos, tenta adicionar 85 no início
      if (telBusca.length === 10) {
        const telComDDD = '85' + telBusca
        if (telParticipante === telComDDD) {
          console.log('✅ TELEFONE encontrado (com DDD):', p['telefone participante'])
          return true
        }
      }
      
      return false
    }) || null
    
  } else {
    // BUSCA POR CÓDIGO - deve ser exatamente igual (case-insensitive)
    const codigoBusca = normalizeString(buscaTrimmed)
    console.log('🔍 Buscando por CÓDIGO:', codigoBusca)
    
    return records.find((p: any) => {
      const codigoParticipante = normalizeString(p['código'] || '')
      const match = codigoParticipante === codigoBusca
      if (match) {
        console.log('✅ CÓDIGO encontrado:', p['código'])
      }
      return match
    }) || null
  }
}
