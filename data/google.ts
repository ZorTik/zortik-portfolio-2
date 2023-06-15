export type FetchUserInfoResponse = {
    sub: string,
    name: string,
    picture: string,
    locale: string,
}

export async function fetchUserInfo(access_token: string): Promise<FetchUserInfoResponse> {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`;
    return await fetch(url).then(r => r.json());
}
