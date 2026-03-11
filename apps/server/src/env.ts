import { optional, parse, string } from 'valibot';


function get_required_env_variable(name: string) {
    return parse(string(`Environment variable ${name.toUpperCase()} is missing.`), process.env[name.toUpperCase()])
}


export const XENDIT_CLIENT_SECRET = get_required_env_variable('XENDIT_CLIENT_SECRET');

export const GOOGLE_MAPS_API_KEY = get_required_env_variable('GOOGLE_MAPS_API_KEY');

export const AWS_REGION = get_required_env_variable('AWS_REGION');

export const AWS_ACCESS_KEY_ID = get_required_env_variable('AWS_ACCESS_KEY_ID');

export const AWS_SECRET_ACCESS_KEY = get_required_env_variable('AWS_SECRET_ACCESS_KEY');

export const S3_BUCKET_NAME = get_required_env_variable('S3_BUCKET_NAME');

export const S3_PUBLIC_URL = parse(optional(string()), process.env.S3_PUBLIC_URL);
