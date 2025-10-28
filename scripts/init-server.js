#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Inicializando servidor...');

// Criar pasta de certificados se não existir
const certificadosDir = path.join(process.cwd(), 'public', 'certificados');

if (!fs.existsSync(certificadosDir)) {
  fs.mkdirSync(certificadosDir, { recursive: true });
  console.log('✅ Pasta de certificados criada:', certificadosDir);
} else {
  console.log('✅ Pasta de certificados já existe:', certificadosDir);
}

// Verificar permissões de escrita
try {
  const testFile = path.join(certificadosDir, '.test');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('✅ Permissões de escrita OK');
} catch (error) {
  console.error('❌ Erro nas permissões de escrita:', error.message);
  process.exit(1);
}

console.log('🎉 Servidor inicializado com sucesso!');
