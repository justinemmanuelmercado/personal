import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const responseHeaderPolicy = new aws.cloudfront.ResponseHeadersPolicy("myCacheResponseHeaderPolicy", {
  customHeadersConfig: {
    items: [
      {
        header: "Cache-Control",
        override: true,
        value: "max-age=2592000",
      },
    ],
  },
});

// Create S3 Bucket
const bucket = new aws.s3.Bucket("personal-bucket", {
  website: {
    indexDocument: "index.html",
  },
});

// Generate Origin Access Identity to access the private s3 bucket.
const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
  "originAccessIdentity",
  {
    comment: "this is needed to setup s3 polices and make s3 not public.",
  }
);

// Create CloudFront Distribution
const cdn = new aws.cloudfront.Distribution("personal-cdn", {
  aliases: ["ejmercado.com"],
  httpVersion: "http2",
  origins: [
    {
      domainName: bucket.bucketRegionalDomainName,
      originId: bucket.arn,
      s3OriginConfig: {
        originAccessIdentity: originAccessIdentity.cloudfrontAccessIdentityPath,
      },
    },
  ],
  enabled: true,
  defaultRootObject: "index.html",
  defaultCacheBehavior: {
    compress: true,
    targetOriginId: bucket.arn,
    responseHeadersPolicyId: responseHeaderPolicy.id,
    viewerProtocolPolicy: "redirect-to-https",
    allowedMethods: ["GET", "HEAD", "OPTIONS"],
    cachedMethods: ["GET", "HEAD", "OPTIONS"],
    forwardedValues: {
      queryString: false,
      cookies: {
        forward: "none",
      },
    },
    minTtl: 0,
    defaultTtl: 86400,
    maxTtl: 31536000,
  },
  restrictions: {
    geoRestriction: {
      restrictionType: "none",
    },
  },
  viewerCertificate: {
    acmCertificateArn:
      "arn:aws:acm:us-east-1:599276683720:certificate/5001a336-9e0e-4f0f-8787-40cddd0c624a",
    sslSupportMethod: "sni-only",
  },
});

const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
  bucket: bucket.id, // refer to the bucket created earlier
  policy: pulumi.jsonStringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          AWS: originAccessIdentity.iamArn,
        }, // Only allow Cloudfront read access.
        Action: ["s3:GetObject"],
        Resource: [pulumi.interpolate`${bucket.arn}/*`], // Give Cloudfront access to the entire bucket.
      },
    ],
  }),
});

export const bucketName = bucket.bucket;
export const cdnDomain = cdn.domainName;
export const cdnDistributionId = cdn.id;
