const testRoutes = async () => {
  try {
    const adminId = "67dbf8c4086968d839386377"; // Providing a fallback ID found in previous logs
    const urls = [
      "http://localhost:5000/api/users/me",
      "http://localhost:5000/api/audit-logs/me"
    ];

    for (const url of urls) {
      const response = await fetch(url, {
        headers: { "x-admin-id": adminId }
      });
      console.log(`${url}: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
};

testRoutes();
