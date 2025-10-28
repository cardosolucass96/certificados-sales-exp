import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

export interface Participant {
  'código': string
  'nome participante': string
  'email participante': string
  'país participante': string
  'telefone participante': string
  'estado': string
  'link': string
  'id produto': string
  'nome produto': string
  'local evento': string
  'data início': string
  'data fim': string
  'id oferta': string
  'nome oferta': string
  'nome marketplace': string
  'id marketplace': string
  'status (transação)': string
  'data pedido (transação)': string
  'nome contato': string
  'email contato': string
  '[Extra] document': string
}

export function getParticipants(): Participant[] {
  const csvFilePath = path.join(process.cwd(), 'participantes-sales-teresina.csv')
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8')

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  return records
}

export function findParticipant(
  searchValue: string
): Participant | undefined {
  const participants = getParticipants()
  const normalizedSearch = searchValue.trim().toLowerCase()

  return participants.find((participant) => {
    const email = participant['email participante']?.toLowerCase() || ''
    const emailContato = participant['email contato']?.toLowerCase() || ''
    const telefone = participant['telefone participante']?.replace(/\D/g, '') || ''
    const searchTelefone = normalizedSearch.replace(/\D/g, '')
    const codigo = participant['código']?.toLowerCase() || ''
    const documento = participant['[Extra] document']?.replace(/\D/g, '') || ''

    return (
      email === normalizedSearch ||
      emailContato === normalizedSearch ||
      telefone === searchTelefone ||
      telefone.includes(searchTelefone) ||
      searchTelefone.includes(telefone) ||
      codigo === normalizedSearch ||
      documento === searchTelefone
    )
  })
}
