export const AJAX = async function ({
  methodValue,
  URL,
  token = undefined,
  valueBody = undefined,
}) {
  const headersValue = { "Content-Type": "application/json" };

  if (token) {
    headersValue.Authorization = `Bearer ${token}`;
  }

  const options = {
    method: methodValue,
    headers: headersValue,
  };

  if (valueBody && methodValue !== "GET") {
    options.body = JSON.stringify(valueBody);
  }

  try {
    console.log(URL, options);
    const response = await fetch(URL, options);

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    console.error("AJAX error:", err);
    throw err;
  }
};

export const checkSession = () => {
  const storage = sessionStorage.getItem("keys");
  console.log("finUser:", storage);
  return JSON.parse(storage);
};
