export default function checkLogin() {
  return !!localStorage.getItem(authHeaderName);
}

export const authHeaderName = 'AIOps-Api-Auth';

