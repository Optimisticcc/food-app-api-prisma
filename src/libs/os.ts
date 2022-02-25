export function getOsEnv(key: string) {
  if (typeof process.env[key] === 'undefined') {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key];
}

export function getOsEnvOptional(key: string) {
  return process.env[key];
}

export function toNumber(value: string) {
  return parseInt(value, 10);
}

export function normalizePort(port: string) {
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    // named pipe
    return port;
  }
  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }
  return false;
}
