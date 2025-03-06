import { Formatter, parseArrayFromFormData } from './parseArrayFromFormData';

interface TestType {
  name: string;
  age: number;
}

const isTestType = (item: unknown): item is TestType => {
  const obj = item as TestType;
  return (
    typeof obj.name === 'string' &&
    typeof obj.age === 'number' &&
    !isNaN(obj.age)
  );
};

const formatter: Formatter<TestType> = {
  age: (value) => parseInt(value as string, 10),
};

describe('parseArrayFromFormData', () => {
  it('should parse valid form data', () => {
    const formData = new FormData();
    formData.append('items.0.name', 'Alice');
    formData.append('items.0.age', '30');
    formData.append('items.1.name', 'Bob');
    formData.append('items.1.age', '25');

    const result = parseArrayFromFormData<TestType>(
      formData,
      'items',
      isTestType,
      formatter,
    );

    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });

  it('should filter out invalid items', () => {
    const formData = new FormData();
    formData.append('items.0.name', 'Alice');
    formData.append('items.0.age', '30');
    formData.append('items.1.name', 'Bob');
    formData.append('items.1.age', 'invalid');

    const result = parseArrayFromFormData<TestType>(
      formData,
      'items',
      isTestType,
      formatter,
    );

    expect(result).toEqual([{ name: 'Alice', age: 30 }]);
  });

  it('should handle mixed valid and invalid data', () => {
    const formData = new FormData();
    formData.append('items.0.name', 'Alice');
    formData.append('items.0.age', '30');
    formData.append('items.1.name', 'Bob');
    formData.append('items.1.age', '25');
    formData.append('items.2.name', 'Charlie');
    formData.append('items.2.age', 'invalid');

    const result = parseArrayFromFormData<TestType>(
      formData,
      'items',
      isTestType,
      formatter,
    );

    expect(result).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });

  it('should return an empty array for empty form data', () => {
    const formData = new FormData();

    const result = parseArrayFromFormData<TestType>(
      formData,
      'items',
      isTestType,
      formatter,
    );

    expect(result).toEqual([]);
  });
});
