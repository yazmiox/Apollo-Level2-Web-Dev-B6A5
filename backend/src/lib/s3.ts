import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { R2_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT, R2_SECRET_ACCESS_KEY, R2_SIGNED_URL_EXPIRY_HOUR } from "./env"

const s3 = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT!,
    credentials: {
        accessKeyId: R2_ACCESS_KEY!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!
    }
})

const BUCKET = R2_BUCKET_NAME!;

export const getPutObjectUrl = (params: Omit<PutObjectCommand["input"], "Bucket">) =>
    getSignedUrl(s3, new PutObjectCommand({ Bucket: BUCKET, ...params }), { expiresIn: parseInt(R2_SIGNED_URL_EXPIRY_HOUR!) * 60 * 60 });

export const getObjectUrl = (key: string) =>
    getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: parseInt(R2_SIGNED_URL_EXPIRY_HOUR!) * 60 * 60 });

export const putObject = (params: Omit<PutObjectCommand["input"], "Bucket">) =>
    s3.send(new PutObjectCommand({ Bucket: BUCKET, ...params }));

export const getObject = (params: Omit<GetObjectCommand["input"], "Bucket">) =>
    s3.send(new GetObjectCommand({ Bucket: BUCKET, ...params }));

export const deleteObject = (params: Omit<GetObjectCommand["input"], "Bucket">) =>
    s3.send(new DeleteObjectCommand({ Bucket: BUCKET, ...params }));
