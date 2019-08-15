const Offices = require('@utils/Offices');

let offices;

beforeEach(() => {
    offices = new Offices();
});


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

test('get state instead of an office', () => {
    const states = new Offices('states');
    
    const state = states.get('madrid');

    expect(state.code).toBe('28');
});