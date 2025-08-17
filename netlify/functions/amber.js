// This is a simple test function to make sure deployment works.
export const handler = async () => {
  const testData = [{
    perKwh: 15.7
  }];

  return {
    statusCode: 200,
    body: JSON.stringify(testData),
  };
};
