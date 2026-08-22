const fs = require('fs');
const path = require('path');

const { CITY_REPOSITORY_METHODS } = require('../src/repositories/contracts/cityRepository.contract');
const { ACTIVITY_REPOSITORY_METHODS } = require('../src/repositories/contracts/activityRepository.contract');
const createInMemoryCityRepository = require('../src/repositories/inMemoryCityRepository');
const createInMemoryActivityRepository = require('../src/repositories/inMemoryActivityRepository');

function readContract(filename) {
  return fs.readFileSync(path.join(__dirname, '../src/repositories/contracts', filename), 'utf8');
}

describe('Repository contracts are database-agnostic', () => {
  it('CityRepository contract does not reference any specific database/ORM', () => {
    const source = readContract('cityRepository.contract.js');

    expect(source).not.toMatch(/prisma/i);
    expect(source).not.toMatch(/mysql/i);
    expect(source).not.toMatch(/\bSELECT\b|\bINSERT INTO\b|\bCREATE TABLE\b/i);
  });

  it('ActivityRepository contract does not reference any specific database/ORM', () => {
    const source = readContract('activityRepository.contract.js');

    expect(source).not.toMatch(/prisma/i);
    expect(source).not.toMatch(/mysql/i);
    expect(source).not.toMatch(/\bSELECT\b|\bINSERT INTO\b|\bCREATE TABLE\b/i);
  });

  it('the in-memory city repository implements the full CityRepository contract', () => {
    const repository = createInMemoryCityRepository();
    CITY_REPOSITORY_METHODS.forEach((method) => {
      expect(typeof repository[method]).toBe('function');
    });
  });

  it('the in-memory activity repository implements the full ActivityRepository contract', () => {
    const repository = createInMemoryActivityRepository();
    ACTIVITY_REPOSITORY_METHODS.forEach((method) => {
      expect(typeof repository[method]).toBe('function');
    });
  });
});
