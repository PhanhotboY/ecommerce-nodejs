export * from './app.constant';
export * from './shop.constant';
export * from './product.constant';
export * from './resource.constant';
export * from './role.constant';
export * from './cart.constant';
export * from './comment.constant';
export * from './discount.constant';
export * from './inventory.constant';
export * from './notification.constant';
export * from './user.constant';

export const KEYTOKEN = {
  COLLECTION_NAME: 'KeyTokens',
  DOCUMENT_NAME: 'KeyToken',
};

export const APIKEY = {
  COLLECTION_NAME: 'ApiKeys',
  DOCUMENT_NAME: 'ApiKey',
};

export const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-refresh-token',
};
