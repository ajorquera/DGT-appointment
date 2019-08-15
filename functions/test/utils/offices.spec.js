const offices = require('@utils/offices');

test('look for an office by name', () => {
    const office = offices.get('Mádrid');

    expect(typeof office.label).toBe('string');
    expect(typeof office.code).toBe('string');
});

test('return all offices', () => {
    const AllOffices = offices.get();

    expect(Array.isArray(AllOffices)).toBe(true);
});

test('return undefined for non existing office', () => {
    const office = offices.get('non existen office');

    expect(office).toBe(undefined);
});