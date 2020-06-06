import AWS from 'aws-sdk';
import { configuration } from './config/config'

const c = configuration.dev;

//Configure AWS
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

export const s3 = new AWS.S3({
    signatureVersion : 'v4',
    region: c.aws_region,
    params: { Bucket : c.aws_media_bucket }
});

/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export const getGetSignedUrl = (key: String) => {

    const signedUrlExpireSeconds = 60 * 5;

    const url = s3.getSignedUrl('getObject', {
        Bucket : c.aws_media_bucket,
        key : key,
        Expires : signedUrlExpireSeconds
    });

    return url;
}


/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */

 export const getPutSignedUrl = ( key: string ) => {
     
    const signedUrlExpireSeconds = 60 * 5;

    const url = s3.getSignedUrl('putObject', {
        Bucket : c.aws_media_bucket,
        key : key,
        Expires : signedUrlExpireSeconds
    });

    return url;
 }
