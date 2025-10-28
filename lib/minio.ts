import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Configuração para o MinIO usando AWS SDK
const minioEndpoint = process.env.MINIO_ENDPOINT || 'minio.grupovorp.com'
const minioPort = process.env.MINIO_PORT || '443'
const useSSL = process.env.MINIO_USE_SSL === 'true' || true
const protocol = useSSL ? 'https' : 'http'

console.log('[MinIO] Configuração:', {
  endpoint: `${protocol}://${minioEndpoint}`,
  bucket: process.env.MINIO_BUCKET || 'certificados-sales',
  hasAccessKey: !!(process.env.MINIO_ACCESS_KEY),
  hasSecretKey: !!(process.env.MINIO_SECRET_KEY),
})

const s3Client = new S3Client({
  endpoint: `${protocol}://${minioEndpoint}`,
  region: process.env.MINIO_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'tu6gysXY9yFEGKO2cBhv',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'OWevInkkkEFwSz0EOlPi9iS2XHMBLeQGN9dHcEqB',
  },
  forcePathStyle: true, // Importante para MinIO
})

const BUCKET_NAME = process.env.MINIO_BUCKET || 'certificados-sales'

export async function uploadFile(
  fileName: string,
  fileBuffer: Buffer,
  contentType: string = 'application/pdf'
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    })

    await s3Client.send(command)

    console.log(`Arquivo ${fileName} enviado para o MinIO com sucesso`)

    // Retornar URL pública do MinIO (sem a porta no path)
    const url = `${protocol}://${minioEndpoint}/${BUCKET_NAME}/${fileName}`
    console.log(`URL pública: ${url}`)
    return url
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error)
    throw error
  }
}

export { s3Client as minioClient, BUCKET_NAME }
