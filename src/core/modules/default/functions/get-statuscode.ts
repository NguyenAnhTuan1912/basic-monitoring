const errorCodes = {
  "4xx": [400, 401, 403, 404, 405, 408, 429],
  "5xx": [500, 501, 502, 503, 504, 505],
};

function getRandomErrorCode(type: string) {
  const codes = (errorCodes as any)[type];
  return codes[Math.floor(Math.random() * codes.length)];
}

/**
 * Get status code
 *
 * @returns
 */
export async function getStatusCode() {
  let code = 400;
  let roll = Math.random();

  if (roll < 0.5) code = getRandomErrorCode("4xx");
  else code = getRandomErrorCode("5xx");

  return code;
}
