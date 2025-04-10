test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.database.dependencies.version).toBe("16.0");
  expect(responseBody.database.dependencies.max_connections).toBeGreaterThan(0);
  expect(responseBody.database.dependencies.opened_connections).toBe(1);
});
