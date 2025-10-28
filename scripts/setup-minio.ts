import { S3Client, CreateBucketCommand, PutBucketPolicyCommand, HeadBucketCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  endpoint: 'https://minio.grupovorp.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'tu6gysXY9yFEGKO2cBhv',
    secretAccessKey: 'OWevInkkkEFwSz0EOlPi9iS2XHMBLeQGN9dHcEqB',
  },
  forcePathStyle: true,
})

const BUCKET_NAME = 'certificados-sales'

async function setupBucket() {
  try {
    // Verificar se o bucket existe
    console.log(`Verificando bucket ${BUCKET_NAME}...`)
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }))
      console.log('✅ Bucket já existe')
    } catch (error: any) {
      if (error.name === 'NotFound') {
        console.log('Bucket não existe, criando...')
        await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }))
        console.log('✅ Bucket criado com sucesso')
      } else {
        throw error
      }
    }

    // Configurar política pública de leitura
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
        },
      ],
    }

    console.log('Configurando política pública de leitura...')
    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: BUCKET_NAME,
        Policy: JSON.stringify(policy),
      })
    )
    console.log('✅ Política pública configurada')

    console.log('\n🎉 Bucket configurado com sucesso!')
    console.log(`   URL: https://minio.grupovorp.com/${BUCKET_NAME}/`)
  } catch (error) {
    console.error('❌ Erro ao configurar bucket:', error)
    process.exit(1)
  }
}

setupBucket()
