const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ler o arquivo Excel
const workbook = XLSX.readFile(path.join(__dirname, 'participantes-sales-teresina.xlsx'));

// Pegar a primeira planilha
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Converter para CSV
const csv = XLSX.utils.sheet_to_csv(worksheet);

// Salvar como CSV
fs.writeFileSync(path.join(__dirname, 'participantes-sales-teresina.csv'), csv, 'utf-8');

console.log('✅ Arquivo convertido com sucesso: participantes-sales-teresina.csv');
