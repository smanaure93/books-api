import { cleanUpUndefinedData } from "../book.service";

describe("cleanUpUndefinedData", () => {
  it("should remove properties with undefined values from object", () => {
    const testData = {
      title: "Book Title",
      author: undefined,
      pages: 100,
      publisher: undefined,
    };

    const expected = {
      title: "Book Title",
      pages: 100,
    };

    const result = cleanUpUndefinedData(testData);

    expect(result).toEqual(expected);
  });

  it("should return empty object when input is empty", () => {
    const input = {};

    const result = cleanUpUndefinedData(input);

    expect(result).toEqual({});
  });

  it("should remove undefined and empty array/string properties from object", () => {
    const input = {
      title: "Book Title",
      author: undefined,
      genres: [],
      summary: "",
      pages: 300,
    };

    const result = cleanUpUndefinedData(input);

    expect(result).toEqual({
      title: "Book Title",
      pages: 300,
    });
  });

  it("should return the original object when all properties are defined and non-empty", () => {
    const input = {
      name: "test",
      age: 30,
      address: "123 Main St",
      phone: "1234567890",
    };

    const result = cleanUpUndefinedData(input);

    expect(result).toEqual(input);
  });

  it('should return null when input is null', () => {
    const input = null;
    const result = cleanUpUndefinedData(input);
    expect(result).toBeNull();
  });

  it('should return an empty object when all properties are undefined', () => {
    const input = {
      name: undefined,
      age: undefined,
      address: undefined
    };

    const result = cleanUpUndefinedData(input);

    expect(result).toEqual({});
  });

  // Handle objects with multiple levels of nesting
  it("should remove undefined and empty properties from nested objects", () => {
    const input = {
      name: "test",
      details: {
        age: undefined,
        address: "",
        phone: "1234567890",
      },
      preferences: {
        likes: undefined,
        dislikes: [],
      },
    };

    const result = cleanUpUndefinedData(input);

    expect(result).toEqual({
      name: "test",
      details: {
        phone: "1234567890",
      },
    });
  });
});
