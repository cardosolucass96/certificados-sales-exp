import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Configuração para o MinIO usando AWS SDK
const s3Client = new S3Client({
  endpoint: 'https://minio.grupovorp.com',
  region: 'us-east-1',
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

    // Retornar URL pública
    const url = `https://minio.grupovorp.com/${BUCKET_NAME}/${fileName}`
    return url
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error)
    throw error
  }
}

export { s3Client as minioClient, BUCKET_NAME }
