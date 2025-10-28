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

export function findParticipant(busca: string): Participant | null {
  const csvPath = path.join(process.cwd(), 'participantes-sales-teresina.csv')
  const fileContent = fs.readFileSync(csvPath, 'utf-8')

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  const buscaNormalizada = normalizeString(busca)
  const buscaTelefone = normalizePhone(busca)

  return records.find((p: any) => {
    if (normalizeString(p['código'] || '') === buscaNormalizada) return true
    if (normalizeString(p['email participante'] || '') === buscaNormalizada) return true
    
    const tel = normalizePhone(p['telefone participante'] || '')
    if (tel && (tel === buscaTelefone || tel.endsWith(buscaTelefone))) return true
    
    const doc = normalizePhone(p['[Extra] document'] || '')
    if (doc && doc === buscaTelefone) return true
    
    return false
  }) || null
}
