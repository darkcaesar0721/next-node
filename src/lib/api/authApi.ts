import axios from 'axios';

interface LoginPayload {
  client_id: string;
  client_secret: string;
  grant_type: string;
}

interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const authApi = {
  login(payload: LoginPayload): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('client_id', payload.client_id);
    formData.append('client_secret', payload.client_secret);
    formData.append('grant_type', payload.grant_type);

    return axios
      .post('https://auth.celitech.net/oauth2/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then((response) => response.data);
  },
};

export default authApi;
