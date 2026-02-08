import 'server-only'

export const getJwtPublicKey = () => {
    const publicKey = process.env.JWT_PUBLIC_KEY;
    if (!publicKey) {
        throw new Error("JWT public key not found");
    }

    // return publicKey.replace(/\\n/g, "\n");

    return publicKey;
}