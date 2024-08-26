import * as AWS from "aws-sdk";

export const uploadFileToS3 = (file, typeFile, userID) => {
  // aws s3 config
  const bucket_name = "biowood-bucket";
  const region_name = "ap-southeast-1";
  const identity_pool_id =
    "ap-southeast-1:487ab313-abc9-42cb-bc97-6ad722c1fa55";

  AWS.config.update({
    region: region_name,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identity_pool_id,
    }),
  });

  const folder = typeFile;
  const fileName = typeFile + new Date().toISOString() + userID;

  const photoKey = folder + "/" + fileName;

  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: bucket_name,
      Key: photoKey,
      Body: file,
      ContentType: file.type,
    },
  });

  const promise = upload.promise();
  return promise;
};

export const humanFileSize = (bytes, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
};
