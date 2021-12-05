class AuthenticationTokenManager {
  async createRefreshToken(_payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async createAccessToken(_payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async verifyRefreshToken(_payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async decodePayload(_payload) {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

export default AuthenticationTokenManager;
